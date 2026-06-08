"use client";

import { SUITS, suitNameEs, VALUES, type CardId } from "@/lib/cards";
import type { ClientMessage } from "@/lib/protocol";

interface ChooseCardModalProps {
	open: boolean;
	onClose: () => void;
	excludedCardIds: CardId[];
	send: (msg: ClientMessage) => void;
}

export function ChooseCardModal({ open, onClose, excludedCardIds, send }: ChooseCardModalProps) {
	const excluded = new Set(excludedCardIds);

	const selectCard = (cardId: CardId) => {
		if (excluded.has(cardId)) return;
		send({ type: "chooseCard", cardId });
		onClose();
	};

	return (
		<div
			className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 ${
				open ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className={`bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-transform duration-300 ${
					open ? "scale-100" : "scale-95"
				}`}
			>
				{/* Header */}
				<div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
					<div>
						<h3 className="text-base font-bold text-neutral-100">Elegir Carta Específica</h3>
						<p className="text-xs text-neutral-400 mt-1">Haz clic sobre una carta para que sea la elegida.</p>
					</div>
					<button onClick={onClose} className="text-neutral-400 hover:text-white p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors" aria-label="Cerrar">
						✕
					</button>
				</div>

				{/* Body */}
				<div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-none bg-neutral-900/40">
					{SUITS.map((suit) => (
						<div key={suit.name} className="space-y-3">
							<div className="flex items-center gap-2 border-b border-neutral-800/80 pb-1.5">
								<span className={`text-xl ${suit.isRed ? "text-red-500" : "text-neutral-400"}`}>{suit.symbol}</span>
								<span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{suitNameEs(suit)}</span>
							</div>
							<div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-2 pt-1">
								{VALUES.map((val) => {
									const cardId = `${val}-${suit.name}` as CardId;
									const isExcluded = excluded.has(cardId);
									return (
										<button
											key={cardId}
											onClick={() => selectCard(cardId)}
                                            disabled={isExcluded}
											className={
												isExcluded
													? "h-16 rounded-lg border border-dashed border-neutral-800/80 bg-neutral-950/40 text-neutral-600 flex flex-col justify-between p-1.5 transition-all opacity-40 relative overflow-hidden cursor-not-allowed"
													: `h-16 rounded-lg border ${
															suit.isRed ? "text-red-500 border-red-500/20" : "text-neutral-900 border-neutral-200"
														} bg-white flex flex-col justify-between p-1.5 shadow-sm hover:shadow-md hover:scale-[1.05] active:scale-95 transition-all relative cursor-pointer`
											}
										>
											<div className="text-left font-extrabold text-xs leading-none">{val}</div>
											<div className="text-right text-base leading-none">{suit.symbol}</div>
											{isExcluded && (
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="w-full h-px bg-neutral-700/80 rotate-12" />
												</div>
											)}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row gap-3 justify-end items-center">
					<button onClick={onClose} className="w-full sm:w-auto text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-5 py-2.5 rounded-lg font-bold transition-all">
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
}
