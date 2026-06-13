import type { PublicGameState } from "@/lib/protocol";
import { PalomaSVG } from "./PalomaSVG";

interface PlayerListProps {
	state: PublicGameState;
}

export function PlayerList({ state }: PlayerListProps) {
	return (
		<div className="w-full max-w-md mx-auto">
			<p className="text-xs text-faint font-semibold mb-3 tracking-wider uppercase">Jugadores ({state.players.length})</p>
			<ul className="flex flex-col gap-2">
				{state.players.map((p) => {
					const isHidden = p.id === state.hiddenPlayerId;
					const isYou = p.id === state.youId;
					return (
						<li
							key={p.id}
							className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm ${
								isHidden ? "bg-surface-2" : ""
							} ${p.connected ? "" : "opacity-40"}`}
						>
							<span className="flex items-center gap-2 min-w-0">
								<span className={`inline-block w-2 h-2 rounded-full shrink-0 ${p.connected ? "bg-emerald-500" : "bg-faint"}`} />
								<PalomaSVG color={p.color} size={20} animated className="shrink-0" />
								<span className="truncate font-medium text-fg">
									{p.name}
									{isYou && <span className="text-faint"> (tú)</span>}
								</span>
							</span>
							<span className="flex items-center gap-1.5 shrink-0">
								{p.isHost && <span className="text-[10px] uppercase font-semibold tracking-wider text-muted">Host</span>}
								{isHidden && (
									<span title="No ve la carta" className="flex items-center">
										<svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
										</svg>
									</span>
								)}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
