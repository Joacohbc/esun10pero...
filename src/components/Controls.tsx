"use client";

import type { ClientMessage, PublicGameState } from "@/lib/protocol";

interface ControlsProps {
	state: PublicGameState;
	send: (msg: ClientMessage) => void;
	isHost: boolean;
	isHidden: boolean;
	soundEnabled: boolean;
	onToggleSound: () => void;
	onOpenVisor: () => void;
}

/** Botonera de acciones según fase y rol. */
export function Controls({ state, send, isHost, isHidden, soundEnabled, onToggleSound, onOpenVisor }: ControlsProps) {
	const connectedCount = state.players.filter((p) => p.connected).length;
	const hiddenName = state.players.find((p) => p.id === state.hiddenPlayerId)?.name;

	return (
		<div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
			{/* Acción primaria */}
			{state.phase === "lobby" && (
				<button
					onClick={() => send({ type: "volunteerHidden" })}
					disabled={connectedCount < 2}
					className="w-full bg-neutral-100 hover:bg-white text-neutral-900 active:scale-[0.98] py-4 px-6 rounded-xl font-bold tracking-wide shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{connectedCount < 2 ? "Esperando jugadores…" : "Yo no veo esta ronda"}
				</button>
			)}

			{state.phase === "playing" &&
				(isHidden ? (
					<div className="w-full text-center py-4 px-6 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm font-medium">
						🙈 No mires. Esperando a que alguien revele tu carta…
					</div>
				) : (
					<button
						onClick={() => send({ type: "reveal" })}
						className="w-full bg-red-500 hover:bg-red-600 text-white active:scale-[0.98] py-4 px-6 rounded-xl font-bold tracking-wide shadow-md transition-all"
					>
						Voltear y revelar a {hiddenName ?? "el jugador"}
					</button>
				))}

			{state.phase === "revealed" && (
				<div className="w-full text-center py-2 text-sm text-neutral-400">
					Carta revelada. Voten quién no verá la próxima.
				</div>
			)}

			{/* Botones secundarios */}
			<div className="grid grid-cols-3 gap-2 w-full">
				<button
					onClick={() => send({ type: "shuffle" })}
					disabled={!isHost}
					className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-3 rounded-xl text-xs font-semibold border border-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
					title={isHost ? "Barajar mazo" : "Solo el host"}
				>
					Barajar
				</button>
				<button
					onClick={onOpenVisor}
					disabled={!isHost}
					className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-3 rounded-xl text-xs font-semibold border border-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
					title={isHost ? "Visor y exclusiones" : "Solo el host"}
				>
					Visor / Excluir
				</button>
				<button
					onClick={onToggleSound}
					className={`bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-3 rounded-xl text-xs font-semibold border border-neutral-800 transition-all ${soundEnabled ? "" : "opacity-50"}`}
					title="Alternar sonido"
				>
					{soundEnabled ? "🔊 Sonido" : "🔇 Sonido"}
				</button>
			</div>

			{isHost && state.phase !== "lobby" && (
				<button onClick={() => send({ type: "resetRound" })} className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
					Reiniciar ronda
				</button>
			)}
		</div>
	);
}
