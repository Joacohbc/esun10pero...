"use client";

import { SUITS, suitNameEs, TOTAL_CARDS, VALUES, type CardId } from "@/lib/cards";
import type { ClientMessage } from "@/lib/protocol";

interface VisorModalProps {
	open: boolean;
	onClose: () => void;
	excludedCardIds: CardId[];
	send: (msg: ClientMessage) => void;
}

/**
 * Visor de cartas y exclusiones — portado del modal del generador original.
 * El servidor es la fuente de verdad: cada clic envía el set completo de
 * exclusiones y el estado se re-difunde a todos.
 */
export function VisorModal({ open, onClose, excludedCardIds, send }: VisorModalProps) {
	const excluded = new Set(excludedCardIds);
	const activeCount = TOTAL_CARDS - excluded.size;

	const toggle = (cardId: CardId) => {
		const next = new Set(excluded);
		if (next.has(cardId)) {
			next.delete(cardId);
		} else {
			if (next.size >= TOTAL_CARDS - 1) return; // dejar al menos una activa
			next.add(cardId);
		}
		send({ type: "setExclusions", excludedCardIds: [...next] });
	};

	const reset = () => send({ type: "setExclusions", excludedCardIds: [] });

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
				className={`bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden transition-transform duration-300 ${
					open ? "scale-100" : "scale-95"
				}`}
			>
				{/* Header */}
				<div className="p-5 border-b border-border flex justify-between items-center bg-surface">
					<div>
						<h3 className="text-base font-bold text-fg">Visor de Cartas y Exclusiones</h3>
						<p className="text-xs text-muted mt-1">Haz clic sobre una carta para excluirla o incluirla en el mazo.</p>
					</div>
					<button onClick={onClose} className="text-muted hover:text-fg p-2 rounded-lg bg-surface-2 hover:bg-border transition-colors" aria-label="Cerrar">
						✕
					</button>
				</div>

				{/* Body */}
				<div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-none bg-surface">
					{SUITS.map((suit) => (
						<div key={suit.name} className="space-y-3">
							<div className="flex items-center gap-2 border-b border-border pb-1.5">
								<span className={`text-xl ${suit.isRed ? "text-red-500" : "text-muted"}`}>{suit.symbol}</span>
								<span className="text-xs font-bold uppercase tracking-wider text-muted">{suitNameEs(suit)}</span>
							</div>
							<div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-2 pt-1">
								{VALUES.map((val) => {
									const cardId = `${val}-${suit.name}` as CardId;
									const isExcluded = excluded.has(cardId);
									return (
										<button
											key={cardId}
											onClick={() => toggle(cardId)}
											className={
												isExcluded
													? "h-16 rounded-lg border border-dashed border-border bg-surface-2 text-faint flex flex-col justify-between p-1.5 transition-all opacity-40 relative overflow-hidden"
													: `h-16 rounded-lg border ${
															suit.isRed ? "text-red-500 border-red-500/20" : "text-neutral-900 border-neutral-200"
														} bg-white flex flex-col justify-between p-1.5 shadow-sm hover:shadow-md hover:scale-[1.05] active:scale-95 transition-all relative`
											}
										>
											<div className="text-left font-extrabold text-xs leading-none">{val}</div>
											<div className="text-right text-base leading-none">{suit.symbol}</div>
											{isExcluded && (
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="w-full h-px bg-border-strong rotate-12" />
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
				<div className="p-4 border-t border-border bg-bg flex flex-col sm:flex-row gap-3 justify-between items-center">
					<div className="text-xs text-muted flex items-center gap-2">
						<span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
						Cartas activas: <span className="font-bold text-fg">{activeCount}</span>/{TOTAL_CARDS}
					</div>
					<div className="flex gap-2 w-full sm:w-auto">
						<button onClick={reset} className="flex-1 sm:flex-initial text-xs bg-surface-2 hover:bg-border text-fg px-4 py-2.5 rounded-lg font-semibold transition-all">
							Restaurar Todo
						</button>
						<button onClick={onClose} className="flex-1 sm:flex-initial text-xs bg-primary hover:opacity-90 text-primary-fg px-5 py-2.5 rounded-lg font-bold transition-all">
							Aplicar y Volver
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
