import type { ClientMessage, PublicGameState } from "@/lib/protocol";

interface VotePanelProps {
	state: PublicGameState;
	send: (msg: ClientMessage) => void;
}

/** Votación del próximo jugador oculto (fase "revealed"). */
export function VotePanel({ state, send }: VotePanelProps) {
	const myVote = state.votes[state.youId];
	const connectedCount = state.players.filter((p) => p.connected).length;
	const castCount = Object.keys(state.votes).filter((voterId) => state.players.find((p) => p.id === voterId)?.connected).length;

	// Conteo de votos por candidato.
	const tally = new Map<string, number>();
	for (const candidate of Object.values(state.votes)) {
		tally.set(candidate, (tally.get(candidate) ?? 0) + 1);
	}

	return (
		<div className="w-full max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
			<div className="flex items-center justify-between mb-3">
				<p className="text-sm font-bold text-neutral-100">¿Quién no ve la próxima carta?</p>
				<span className="text-xs text-neutral-400 font-mono">
					{castCount}/{connectedCount}
				</span>
			</div>
			<div className="grid grid-cols-2 gap-2">
				{state.players.map((p) => {
					const votes = tally.get(p.id) ?? 0;
					const selected = myVote === p.id;
					return (
						<button
							key={p.id}
							onClick={() => send({ type: "vote", candidateId: p.id })}
							disabled={!p.connected}
							className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-30 ${
								selected
									? "border-red-500 bg-red-500/15 text-white"
									: "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
							}`}
						>
							<span className="truncate">{p.name}</span>
							{votes > 0 && (
								<span className="shrink-0 text-xs font-bold bg-neutral-800 text-neutral-200 rounded-full w-5 h-5 flex items-center justify-center">{votes}</span>
							)}
						</button>
					);
				})}
			</div>
			<p className="text-xs text-neutral-500 mt-3 text-center">La ronda empieza cuando todos votan. Se puede repetir al mismo jugador.</p>
		</div>
	);
}
