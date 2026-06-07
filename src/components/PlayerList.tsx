import type { PublicGameState } from "@/lib/protocol";
import { PalomaSVG } from "./PalomaSVG";

interface PlayerListProps {
	state: PublicGameState;
}

export function PlayerList({ state }: PlayerListProps) {
	return (
		<div className="w-full max-w-md mx-auto">
			<p className="text-xs text-neutral-500 font-semibold mb-3 tracking-wider uppercase">Jugadores ({state.players.length})</p>
			<ul className="flex flex-col gap-2">
				{state.players.map((p) => {
					const isHidden = p.id === state.hiddenPlayerId;
					const isYou = p.id === state.youId;
					return (
						<li
							key={p.id}
							className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-sm ${
								isHidden ? "border-red-500/40 bg-red-950/20" : "border-neutral-800 bg-neutral-900"
							} ${p.connected ? "" : "opacity-40"}`}
						>
							<span className="flex items-center gap-2 min-w-0">
								<span className={`inline-block w-2 h-2 rounded-full shrink-0 ${p.connected ? "bg-emerald-500" : "bg-neutral-600"}`} />
								<PalomaSVG color={p.color} size={20} animated className="shrink-0" />
								<span className="truncate font-medium text-neutral-200">
									{p.name}
									{isYou && <span className="text-neutral-500"> (tú)</span>}
								</span>
							</span>
							<span className="flex items-center gap-1.5 shrink-0">
								{p.isHost && <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Host</span>}
								{isHidden && <span title="No ve la carta">🙈</span>}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
