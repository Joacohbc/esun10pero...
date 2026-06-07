import { DurableObject } from "cloudflare:workers";
import { getCard, TOTAL_CARDS, type CardId } from "@/lib/cards";
import { buildDeck } from "@/lib/deck";
import type { ClientMessage, Phase, PublicGameState, PublicPlayer, ServerMessage } from "@/lib/protocol";

interface RosterPlayer {
	id: string;
	name: string;
}

/** Estado autoritativo completo de la sala (solo vive en el servidor). */
interface GameState {
	code: string;
	phase: Phase;
	players: RosterPlayer[];
	hostId: string | null;
	hiddenPlayerId: string | null;
	deck: CardId[];
	excludedCardIds: CardId[];
	currentCardId: CardId | null;
	revealedById: string | null;
	votes: Record<string, string>;
}

interface SocketAttachment {
	playerId: string;
}

function defaultState(): GameState {
	return {
		code: "",
		phase: "lobby",
		players: [],
		hostId: null,
		hiddenPlayerId: null,
		deck: [],
		excludedCardIds: [],
		currentCardId: null,
		revealedById: null,
		votes: {},
	};
}

export class PokerSessionDO extends DurableObject<CloudflareEnv> {
	private game: GameState = defaultState();

	constructor(ctx: DurableObjectState, env: CloudflareEnv) {
		super(ctx, env);
		ctx.blockConcurrencyWhile(async () => {
			const saved = await ctx.storage.get<GameState>("game");
			if (saved) this.game = saved;
		});
	}

	// ---- HTTP / WebSocket upgrade ----

	async fetch(request: Request): Promise<Response> {
		if (request.headers.get("Upgrade") !== "websocket") {
			return new Response("Expected websocket", { status: 426 });
		}

		const url = new URL(request.url);
		// Código de sala desde el último segmento del path (/api/ws/<CODE>).
		const code = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() ?? "") || url.searchParams.get("code") || "";
		if (!this.game.code) this.game.code = code;

		const pair = new WebSocketPair();
		const client = pair[0];
		const server = pair[1];

		// Hibernation API: el runtime mantiene el socket sin tenernos en memoria.
		this.ctx.acceptWebSocket(server);

		return new Response(null, { status: 101, webSocket: client });
	}

	async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer): Promise<void> {
		let msg: ClientMessage;
		try {
			msg = JSON.parse(typeof raw === "string" ? raw : new TextDecoder().decode(raw));
		} catch {
			return this.sendError(ws, "Mensaje inválido");
		}

		try {
			await this.handle(ws, msg);
		} catch (err) {
			this.sendError(ws, err instanceof Error ? err.message : "Error inesperado");
		}
	}

	async webSocketClose(ws: WebSocket): Promise<void> {
		// El jugador se desconecta; lo dejamos en el roster (puede reconectar).
		this.reassignHostIfNeeded();
		await this.persistAndBroadcast();
		await this.scheduleCleanupIfEmpty();
	}

	async webSocketError(ws: WebSocket): Promise<void> {
		this.reassignHostIfNeeded();
		await this.persistAndBroadcast();
		await this.scheduleCleanupIfEmpty();
	}

	async alarm(): Promise<void> {
		if (this.connectedPlayerIds().size === 0) {
			await this.ctx.storage.deleteAll();
		}
	}

	// ---- Dispatcher de acciones ----

	private async handle(ws: WebSocket, msg: ClientMessage): Promise<void> {
		switch (msg.type) {
			case "join":
				return this.onJoin(ws, msg.playerId, msg.name);
			case "volunteerHidden":
				return this.onVolunteerHidden(ws);
			case "reveal":
				return this.onReveal(ws);
			case "vote":
				return this.onVote(ws, msg.candidateId);
			case "shuffle":
				return this.onShuffle(ws);
			case "setExclusions":
				return this.onSetExclusions(ws, msg.excludedCardIds);
			case "resetRound":
				return this.onResetRound(ws);
		}
	}

	private async onJoin(ws: WebSocket, playerId: string, name: string): Promise<void> {
		const cleanName = name.trim().slice(0, 24) || "Jugador";
		ws.serializeAttachment({ playerId } satisfies SocketAttachment);

		const existing = this.game.players.find((p) => p.id === playerId);
		if (existing) {
			existing.name = cleanName;
		} else {
			this.game.players.push({ id: playerId, name: cleanName });
		}
		if (!this.game.hostId) this.game.hostId = playerId;

		await this.ctx.storage.deleteAlarm();
		await this.persistAndBroadcast();
	}

	private async onVolunteerHidden(ws: WebSocket): Promise<void> {
		const playerId = this.playerIdOf(ws);
		if (!playerId) throw new Error("No identificado");
		if (this.game.phase !== "lobby") throw new Error("La ronda ya está en curso");
		if (this.connectedPlayerIds().size < 2) throw new Error("Se necesitan al menos 2 jugadores");

		this.startRound(playerId);
		await this.persistAndBroadcast();
	}

	private async onReveal(ws: WebSocket): Promise<void> {
		const playerId = this.playerIdOf(ws);
		if (!playerId) throw new Error("No identificado");
		if (this.game.phase !== "playing") throw new Error("No hay carta para revelar");
		if (playerId === this.game.hiddenPlayerId) throw new Error("El jugador oculto no puede revelar su propia carta");

		this.game.phase = "revealed";
		this.game.revealedById = playerId;
		this.game.votes = {};
		this.broadcastEvent("flip");
		await this.persistAndBroadcast();
	}

	private async onVote(ws: WebSocket, candidateId: string): Promise<void> {
		const playerId = this.playerIdOf(ws);
		if (!playerId) throw new Error("No identificado");
		if (this.game.phase !== "revealed") throw new Error("La votación no está abierta");
		if (!this.game.players.some((p) => p.id === candidateId)) throw new Error("Candidato inválido");

		this.game.votes[playerId] = candidateId;

		// Se resuelve cuando todos los jugadores conectados han votado.
		const connected = this.connectedPlayerIds();
		const everyoneVoted = [...connected].every((id) => this.game.votes[id] !== undefined);
		if (everyoneVoted && connected.size > 0) {
			const winner = this.tallyVotes(connected);
			this.startRound(winner);
		}
		await this.persistAndBroadcast();
	}

	private async onShuffle(ws: WebSocket): Promise<void> {
		this.assertHost(ws);
		this.rebuildDeck();
		this.broadcastEvent("shuffle");
		await this.persistAndBroadcast();
	}

	private async onSetExclusions(ws: WebSocket, excluded: CardId[]): Promise<void> {
		this.assertHost(ws);
		// Validar y limitar: al menos una carta activa.
		const unique = [...new Set(excluded)].filter((id) => getCard(id));
		if (unique.length >= TOTAL_CARDS) throw new Error("Debe quedar al menos una carta activa");
		this.game.excludedCardIds = unique;
		this.rebuildDeck();
		await this.persistAndBroadcast();
	}

	private async onResetRound(ws: WebSocket): Promise<void> {
		this.assertHost(ws);
		this.game.phase = "lobby";
		this.game.hiddenPlayerId = null;
		this.game.currentCardId = null;
		this.game.revealedById = null;
		this.game.votes = {};
		await this.persistAndBroadcast();
	}

	// ---- Lógica de juego ----

	private startRound(hiddenPlayerId: string): void {
		if (this.game.deck.length === 0) {
			this.rebuildDeck();
			this.broadcastEvent("shuffle");
		}
		const drawn = this.game.deck.pop() ?? null;
		this.game.currentCardId = drawn;
		this.game.hiddenPlayerId = hiddenPlayerId;
		this.game.phase = "playing";
		this.game.revealedById = null;
		this.game.votes = {};
		this.broadcastEvent("flip");
	}

	private rebuildDeck(): void {
		let deck = buildDeck(this.game.excludedCardIds);
		// No duplicar la carta actualmente en juego.
		if (this.game.currentCardId && this.game.phase === "playing") {
			deck = deck.filter((id) => id !== this.game.currentCardId);
		}
		this.game.deck = deck;
	}

	private tallyVotes(connected: Set<string>): string {
		const counts = new Map<string, number>();
		for (const [voter, candidate] of Object.entries(this.game.votes)) {
			if (!connected.has(voter)) continue; // ignorar votos de desconectados
			counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
		}
		let max = -1;
		let leaders: string[] = [];
		for (const [candidate, n] of counts) {
			if (n > max) {
				max = n;
				leaders = [candidate];
			} else if (n === max) {
				leaders.push(candidate);
			}
		}
		if (leaders.length === 0) {
			// Nadie votó válido: elige al azar entre conectados.
			leaders = [...connected];
		}
		// Desempate al azar.
		return leaders[Math.floor(Math.random() * leaders.length)];
	}

	// ---- Helpers de conexión / estado ----

	private playerIdOf(ws: WebSocket): string | null {
		const att = ws.deserializeAttachment() as SocketAttachment | null;
		return att?.playerId ?? null;
	}

	private connectedPlayerIds(): Set<string> {
		const ids = new Set<string>();
		for (const ws of this.ctx.getWebSockets()) {
			const id = this.playerIdOf(ws);
			if (id) ids.add(id);
		}
		return ids;
	}

	private reassignHostIfNeeded(): void {
		const connected = this.connectedPlayerIds();
		if (this.game.hostId && connected.has(this.game.hostId)) return;
		// Host actual desconectado: pasa al primer jugador conectado en orden de roster.
		const next = this.game.players.find((p) => connected.has(p.id));
		this.game.hostId = next?.id ?? this.game.hostId;
	}

	private assertHost(ws: WebSocket): void {
		const playerId = this.playerIdOf(ws);
		if (!playerId || playerId !== this.game.hostId) {
			throw new Error("Solo el anfitrión puede hacer esto");
		}
	}

	// ---- Serialización y envío ----

	private publicStateFor(playerId: string, connected: Set<string>): PublicGameState {
		const players: PublicPlayer[] = this.game.players.map((p) => ({
			id: p.id,
			name: p.name,
			connected: connected.has(p.id),
			isHost: p.id === this.game.hostId,
		}));

		// Enmascarar la carta para el jugador oculto mientras la ronda está en juego.
		const hideCard = this.game.phase === "playing" && playerId === this.game.hiddenPlayerId;
		const currentCard = !hideCard && this.game.currentCardId ? (getCard(this.game.currentCardId) ?? null) : null;

		return {
			code: this.game.code,
			phase: this.game.phase,
			players,
			hostId: this.game.hostId,
			hiddenPlayerId: this.game.hiddenPlayerId,
			currentCard,
			deckCount: this.game.deck.length,
			activeCount: TOTAL_CARDS - this.game.excludedCardIds.length,
			excludedCardIds: this.game.excludedCardIds,
			revealedById: this.game.revealedById,
			votes: this.game.votes,
			youId: playerId,
		};
	}

	private send(ws: WebSocket, msg: ServerMessage): void {
		try {
			ws.send(JSON.stringify(msg));
		} catch {
			// Socket cerrándose; ignorar.
		}
	}

	private sendError(ws: WebSocket, message: string): void {
		this.send(ws, { type: "error", message });
	}

	private broadcastEvent(event: "flip" | "shuffle" | "empty"): void {
		const msg: ServerMessage = { type: "event", event };
		for (const ws of this.ctx.getWebSockets()) this.send(ws, msg);
	}

	private async scheduleCleanupIfEmpty(): Promise<void> {
		if (this.connectedPlayerIds().size === 0) {
			await this.ctx.storage.setAlarm(Date.now() + 60 * 60 * 1000);
		} else {
			await this.ctx.storage.deleteAlarm();
		}
	}

	private async persistAndBroadcast(): Promise<void> {
		await this.ctx.storage.put("game", this.game);
		const connected = this.connectedPlayerIds();
		for (const ws of this.ctx.getWebSockets()) {
			const playerId = this.playerIdOf(ws);
			if (!playerId) continue;
			this.send(ws, { type: "state", state: this.publicStateFor(playerId, connected) });
		}
	}
}
