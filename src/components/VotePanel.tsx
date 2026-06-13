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
		<div className="w-full max-w-md mx-auto bg-surface border border-border rounded-2xl p-4">
			<div className="flex items-center justify-between mb-3">
				<p className="text-sm font-bold text-fg">¿Quién no ve la próxima carta?</p>
				<span className="text-xs text-muted font-mono">
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
									? "border-fg bg-surface-2 text-fg"
									: "border-border bg-bg text-muted hover:border-border-strong"
							}`}
						>
							<span className="truncate">{p.name}</span>
							{votes > 0 && (
								<span className="shrink-0 text-xs font-semibold bg-fg text-bg rounded-full w-5 h-5 flex items-center justify-center">{votes}</span>
							)}
						</button>
					);
				})}
			</div>
			<p className="text-xs text-faint mt-3 text-center">La ronda empieza cuando todos votan. Se puede repetir al mismo jugador.</p>
		</div>
	);
}
