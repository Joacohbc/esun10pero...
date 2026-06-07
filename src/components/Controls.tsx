"use client";

import type { ClientMessage, PublicGameState } from "@/lib/protocol";
import { RatingInput } from "./RatingInput";

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
	const migajeroName = state.players.find((p) => p.id === state.hiddenPlayerId)?.name;

	return (
		<div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
			{/* Acción primaria */}
			{state.phase === "lobby" && (
				<button
					onClick={() => send({ type: "volunteerHidden" })}
					disabled={connectedCount < 2}
					className="w-full bg-neutral-100 hover:bg-white text-neutral-900 active:scale-[0.98] py-4 px-6 rounded-xl font-bold tracking-wide shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{connectedCount < 2 ? "Esperando jugadores…" : "Ser el migajero"}
				</button>
			)}

			{state.phase === "playing" &&
				(isHidden ? (
					<RatingInput currentRating={state.migajeroRating} send={send} />
				) : (
					<button
						onClick={() => send({ type: "reveal" })}
						disabled={state.migajeroRating === null && !isHost}
						className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white active:scale-[0.98] py-4 px-6 rounded-xl font-bold tracking-wide shadow-md transition-all"
					>
						{state.migajeroRating === null
							? `Esperando valoración de ${migajeroName ?? "el migajero"}…`
							: `Voltear y revelar a ${migajeroName ?? "el migajero"}`}
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
					disabled={!isHost || state.phase !== "lobby"}
					className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-3 rounded-xl text-xs font-semibold border border-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
					title={!isHost ? "Solo el host" : state.phase !== "lobby" ? "Solo en el lobby" : "Barajar mazo"}
				>
					Barajar
				</button>
				<button
					onClick={onOpenVisor}
					disabled={!isHost || state.phase !== "lobby"}
					className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-3 rounded-xl text-xs font-semibold border border-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
					title={!isHost ? "Solo el host" : state.phase !== "lobby" ? "Solo en el lobby" : "Visor y exclusiones"}
				>
					Visor / Excluir
				</button>
				<button
					onClick={onToggleSound}
					className={`bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-3 rounded-xl text-xs font-semibold border border-neutral-800 transition-all flex items-center justify-center gap-1.5 ${soundEnabled ? "" : "opacity-50"}`}
					title="Alternar sonido"
				>
					{soundEnabled ? (
						<svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
						</svg>
					) : (
						<svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
						</svg>
					)}
					<span>Sonido</span>
				</button>
			</div>

			{isHost && (
				<div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3">
					<p className="text-[10px] text-neutral-500 mb-2 text-center">Tipo de mazo (solo en lobby)</p>
					<div className="grid grid-cols-2 gap-1">
						<button
							onClick={() => send({ type: "setDeckMode", simpleOnly: true })}
							disabled={state.phase !== "lobby"}
							className={`py-2 rounded-lg text-xs font-semibold transition-all disabled:cursor-not-allowed ${
								state.simpleOnly
									? "bg-red-500 text-white"
									: "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 disabled:opacity-40"
							}`}
							title="A=1, 2-10 · sin figuras"
						>
							Simple · 1-10
						</button>
						<button
							onClick={() => send({ type: "setDeckMode", simpleOnly: false })}
							disabled={state.phase !== "lobby"}
							className={`py-2 rounded-lg text-xs font-semibold transition-all disabled:cursor-not-allowed ${
								!state.simpleOnly
									? "bg-red-500 text-white"
									: "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 disabled:opacity-40"
							}`}
							title="A=1 … 10, J=11, Q=12, K=13"
						>
							Completo · 1-13
						</button>
					</div>
				</div>
			)}

			{isHost && state.phase !== "lobby" && (
				<button onClick={() => send({ type: "resetRound" })} className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
					Reiniciar ronda
				</button>
			)}
		</div>
	);
}
