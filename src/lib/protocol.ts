import type { Card, CardId } from "./cards";

export type Phase = "lobby" | "playing" | "revealed" | "selecting";

export interface PublicPlayer {
	id: string;
	name: string;
	connected: boolean;
	isHost: boolean;
}

/**
 * Estado que el servidor envía a CADA cliente. Se serializa de forma
 * personalizada: `currentCard` viaja como `null` para el jugador oculto
 * mientras la fase sea "playing" (no debe poder espiarla en DevTools).
 */
export interface PublicGameState {
	code: string;
	phase: Phase;
	players: PublicPlayer[];
	hostId: string | null;
	hiddenPlayerId: string | null;
	/** Carta de la ronda. `null` si aún no se sacó o está oculta para ti. */
	currentCard: Card | null;
	/** Cuántas cartas quedan en el mazo. */
	deckCount: number;
	/** Total de cartas activas (52 menos exclusiones). */
	activeCount: number;
	/** IDs excluidos por el host (para el visor). */
	excludedCardIds: CardId[];
	revealedById: string | null;
	/** Votos de la fase "selecting": voterId -> candidateId. */
	votes: Record<string, string>;
	/** Tu propio playerId (la conexión que recibe este estado). */
	youId: string;
}

// ---- Mensajes Cliente -> Servidor ----

export type ClientMessage =
	| { type: "join"; playerId: string; name: string }
	| { type: "volunteerHidden" }
	| { type: "reveal" }
	| { type: "vote"; candidateId: string }
	| { type: "shuffle" }
	| { type: "setExclusions"; excludedCardIds: CardId[] }
	| { type: "resetRound" };

// ---- Mensajes Servidor -> Cliente ----

export type ServerMessage =
	| { type: "state"; state: PublicGameState }
	| { type: "error"; message: string }
	// Eventos efímeros para animación/sonido en el cliente.
	| { type: "event"; event: "flip" | "shuffle" | "empty" };

/** Código de sala: 4 caracteres alfanuméricos sin ambigüedades. */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 4;

export function isValidCode(code: string): boolean {
	if (code.length !== CODE_LENGTH) return false;
	return [...code].every((ch) => CODE_ALPHABET.includes(ch));
}

/** Genera un código de sala aleatorio (uso en cliente al crear sesión). */
export function generateCode(): string {
	let code = "";
	for (let i = 0; i < CODE_LENGTH; i++) {
		code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
	}
	return code;
}
