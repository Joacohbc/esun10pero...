import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card3D } from "@/components/Card3D";
import { MASTER_DECK, SUITS, suitNameEs, VALUES, type Card } from "@/lib/cards";

export const Route = createFileRoute("/offline")({
	component: OfflinePage,
});

function OfflinePage() {
	const [card, setCard] = useState<Card | null>(null);
	const [flipped, setFlipped] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isSelectorOpen, setIsSelectorOpen] = useState(false);

	const drawCard = () => {
		const randomIndex = Math.floor(Math.random() * MASTER_DECK.length);
		setCard(MASTER_DECK[randomIndex]);
		setFlipped(false);
	};

	const toggleFlip = () => {
		if (card) {
			setFlipped(!flipped);
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-between items-center px-6 py-8 gap-8">
			{/* Header */}
			<header className="w-full max-w-md flex justify-between items-center">
				<h1 className="text-xl font-bold text-neutral-100">Modo Offline</h1>
				<Link
					to="/"
					className="text-xs bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-full text-neutral-400 transition-colors"
				>
					Volver al inicio
				</Link>
			</header>

			{/* Main / Card area */}
			<main className="flex-1 flex flex-col items-center justify-center gap-6">
				{card ? (
					<Card3D card={card} flipped={flipped} onClick={toggleFlip} />
				) : (
					<div
						onClick={drawCard}
						className="w-64 h-96 sm:w-72 sm:h-[400px] border-2 border-dashed border-neutral-800 hover:border-neutral-700 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer text-neutral-500 hover:text-neutral-400 transition-colors"
					>
						<span className="text-5xl">🎴</span>
						<span className="text-sm font-semibold">Toca para sacar una carta</span>
					</div>
				)}

				{card && (
					<div className="text-center">
						<p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">
							{flipped ? "Carta Revelada" : "Carta Oculta"}
						</p>
						<p className="text-sm text-neutral-300 mt-1">
							{flipped ? `${card.value} de ${card.suit.symbol}` : "Toca la carta para voltearla"}
						</p>
					</div>
				)}
			</main>

			{/* Footer / Controls */}
			<footer className="w-full max-w-sm flex flex-col gap-3">
				{card && (
					<div className="grid grid-cols-2 gap-2">
						<button
							onClick={toggleFlip}
							className="bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 active:scale-[0.98] text-neutral-200 py-3.5 px-4 rounded-xl font-bold tracking-wide transition-all cursor-pointer"
						>
							{flipped ? "Ocultar" : "Revelar"}
						</button>
						<button
							onClick={() => setIsFullscreen(true)}
							className="bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 active:scale-[0.98] text-neutral-200 py-3.5 px-4 rounded-xl font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1"
						>
							📺 Pantalla completa
						</button>
					</div>
				)}

				<div className="grid grid-cols-2 gap-2">
					<button
						onClick={() => setIsSelectorOpen(true)}
						className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 active:scale-[0.98] text-neutral-300 py-3.5 px-4 rounded-xl font-semibold tracking-wide transition-all cursor-pointer"
					>
						🗂️ Elegir de baraja
					</button>
					<button
						onClick={drawCard}
						className="bg-neutral-100 hover:bg-white active:scale-[0.98] text-neutral-900 py-3.5 px-4 rounded-xl font-bold tracking-wide shadow-md transition-all cursor-pointer"
					>
						🎰 Carta aleatoria
					</button>
				</div>
			</footer>

			{/* Fullscreen Overlay */}
			{isFullscreen && card && (
				<div
					onClick={() => setIsFullscreen(false)}
					className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 transition-all"
				>
					{/* Close button */}
					<button
						onClick={() => setIsFullscreen(false)}
						className="absolute top-6 right-6 text-neutral-400 hover:text-white text-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer z-50"
					>
						✕
					</button>

					{/* Large Card */}
					<div onClick={(e) => e.stopPropagation()} className="scale-110 sm:scale-125 md:scale-135 transition-transform duration-300">
						<Card3D card={card} flipped={flipped} onClick={toggleFlip} />
					</div>

					<p className="text-neutral-500 text-xs mt-12 text-center pointer-events-none">
						Toca la carta para voltearla. Toca fuera para salir de pantalla completa.
					</p>
				</div>
			)}

			{/* Card Selector Modal */}
			{isSelectorOpen && (
				<div
					onClick={() => setIsSelectorOpen(false)}
					className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
					>
						{/* Header */}
						<div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
							<div>
								<h3 className="text-base font-bold text-neutral-100">Elige una carta</h3>
								<p className="text-xs text-neutral-400 mt-1">Selecciona cualquier carta de la baraja para ponerla en la mesa.</p>
							</div>
							<button onClick={() => setIsSelectorOpen(false)} className="text-neutral-400 hover:text-white p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer">
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
											const cardId = `${val}-${suit.name}`;
											const cardObj = MASTER_DECK.find((c) => c.id === cardId);
											if (!cardObj) return null;
											const isSelected = card?.id === cardId;

											return (
												<button
													key={cardId}
													onClick={() => {
														setCard(cardObj);
														setFlipped(false);
														setIsSelectorOpen(false);
													}}
													className={`h-16 rounded-lg border ${
														isSelected
															? "border-emerald-500 bg-emerald-950/20 text-emerald-400 scale-[1.05]"
															: suit.isRed
																? "text-red-500 border-red-500/20 bg-white"
																: "text-neutral-900 border-neutral-200 bg-white"
													} flex flex-col justify-between p-1.5 shadow-sm hover:shadow-md hover:scale-[1.05] active:scale-95 transition-all relative cursor-pointer`}
												>
													<div className="text-left font-extrabold text-xs leading-none">{val}</div>
													<div className="text-right text-base leading-none">{suit.symbol}</div>
												</button>
											);
										})}
									</div>
								</div>
							))}
						</div>

						{/* Footer */}
						<div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
							<button onClick={() => setIsSelectorOpen(false)} className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer">
								Cerrar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
