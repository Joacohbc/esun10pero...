"use client";

import { useState } from "react";
import type { ClientMessage, PublicGameState } from "@/lib/protocol";
import { RatingInput } from "./RatingInput";
import { ChooseCardModal } from "./ChooseCardModal";
import { SlideToggle } from "./SlideToggle";

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
	const [chooseModalOpen, setChooseModalOpen] = useState(false);
	const connectedCount = state.players.filter((p) => p.connected).length;
	const migajeroName = state.players.find((p) => p.id === state.hiddenPlayerId)?.name;
	const pendingMigajeroName = state.players.find((p) => p.id === state.pendingHiddenPlayerId)?.name;
	const isPendingHidden = state.youId === state.pendingHiddenPlayerId;

	return (
		<div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
			{/* Acción primaria */}
			{state.phase === "lobby" && (
				<button
					onClick={() => send({ type: "volunteerHidden" })}
					disabled={connectedCount < 2}
					className="w-full bg-primary hover:opacity-90 text-primary-fg active:scale-[0.99] py-3.5 px-6 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{connectedCount < 2 ? "Esperando jugadores…" : "Ser el migajero"}
				</button>
			)}

			{state.phase === "choosingCard" && (
				isPendingHidden ? (
					<div className="w-full text-center py-4 px-6 bg-surface border border-border rounded-xl">
						<p className="text-sm font-semibold text-fg">Esperando a que los demás elijan una carta...</p>
					</div>
				) : (
					<div className="w-full flex flex-col gap-2">
						<p className="text-xs text-center text-muted mb-2">Elige una carta para {pendingMigajeroName}</p>
						<button
							onClick={() => setChooseModalOpen(true)}
							className="w-full bg-primary hover:opacity-90 text-primary-fg active:scale-[0.99] py-3 px-6 rounded-xl text-sm font-semibold transition-all"
						>
							Elegir Carta Específica
						</button>
					</div>
				)
			)}

			{state.phase === "playing" &&
				(isHidden ? (
					<RatingInput currentRating={state.migajeroRating} send={send} />
				) : (
					<button
						onClick={() => send({ type: "reveal" })}
						disabled={state.migajeroRating === null && !isHost}
						className="w-full bg-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-fg active:scale-[0.99] py-3.5 px-6 rounded-xl text-sm font-semibold transition-all"
					>
						{state.migajeroRating === null
							? `Esperando valoración de ${migajeroName ?? "el migajero"}…`
							: `Voltear y revelar a ${migajeroName ?? "el migajero"}`}
					</button>
				))}

			{state.phase === "revealed" && (
				<div className="w-full text-center py-2 text-sm text-muted">
					Carta revelada. Voten quién no verá la próxima.
				</div>
			)}

			{/* Botones secundarios */}
			<div className="grid grid-cols-3 gap-2 w-full">
				<button
					onClick={() => send({ type: "shuffle" })}
					disabled={!isHost || state.phase !== "lobby"}
					className="bg-transparent hover:bg-surface text-muted hover:text-fg py-3 rounded-xl text-xs font-medium border border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
					title={!isHost ? "Solo el host" : state.phase !== "lobby" ? "Solo en el lobby" : "Barajar mazo"}
				>
					Barajar
				</button>
				<button
					onClick={onOpenVisor}
					disabled={!isHost || state.phase !== "lobby"}
					className="bg-transparent hover:bg-surface text-muted hover:text-fg py-3 rounded-xl text-xs font-medium border border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
					title={!isHost ? "Solo el host" : state.phase !== "lobby" ? "Solo en el lobby" : "Visor y exclusiones"}
				>
					Visor / Excluir
				</button>
				<button
					onClick={onToggleSound}
					className={`bg-transparent hover:bg-surface text-muted hover:text-fg py-3 rounded-xl text-xs font-medium border border-border transition-colors flex items-center justify-center gap-1.5 ${soundEnabled ? "" : "opacity-50"}`}
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
				<div className={`w-full ${state.phase !== "lobby" ? "opacity-40" : ""}`}>
					<p className="text-[10px] text-faint mb-2 text-center">Tipo de mazo (solo en lobby)</p>
					<SlideToggle
						className="h-10"
						value={state.simpleOnly ? "simple" : "full"}
						onChange={(v) => send({ type: "setDeckMode", simpleOnly: v === "simple" })}
						disabled={state.phase !== "lobby"}
						options={[
							{ value: "simple", label: "Simple · 1-10", title: "A=1, 2-10 · sin figuras" },
							{ value: "full", label: "Completo · 1-13", title: "A=1 … 10, J=11, Q=12, K=13" },
						]}
					/>
				</div>
			)}

			{isHost && state.phase !== "lobby" && (
				<button onClick={() => send({ type: "resetRound" })} className="text-xs text-faint hover:text-fg transition-colors">
					Reiniciar ronda
				</button>
			)}

			<ChooseCardModal
				open={chooseModalOpen}
				onClose={() => setChooseModalOpen(false)}
				excludedCardIds={state.excludedCardIds}
				send={send}
			/>
		</div>
	);
}
