import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card3D } from "@/components/Card3D";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MASTER_DECK, SUITS, suitNameEs, VALUES, type Card } from "@/lib/cards";

export const Route = createFileRoute("/offline")({
	component: OfflinePage,
});

function OfflinePage() {
	const [card, setCard] = useState<Card | null>(null);
	const [flipped, setFlipped] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isSelectorOpen, setIsSelectorOpen] = useState(false);
	const [showCloseButton, setShowCloseButton] = useState(false);

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

	useEffect(() => {
		if (showCloseButton) {
			const timer = setTimeout(() => {
				setShowCloseButton(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [showCloseButton]);

	return (
		<div className="min-h-screen flex flex-col justify-between items-center px-6 py-8 gap-8">
			{/* Header */}
			<header className="w-full max-w-md flex justify-between items-center">
				<h1 className="text-xl font-semibold tracking-tight text-fg">Modo Offline</h1>
				{/* Grupo conectado: tema · volver */}
				<div className="flex items-center gap-0.5 bg-transparent border border-border rounded-full p-1">
					<ThemeToggle bare className="rounded-full hover:bg-surface" />
					<span className="w-px h-4 bg-border mx-0.5" />
					<Link
						to="/"
						title="Volver al inicio"
						className="flex items-center gap-1.5 h-8 pl-2 pr-3 rounded-full text-xs text-muted hover:text-fg hover:bg-surface transition-colors"
					>
						<svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						<span>Inicio</span>
					</Link>
				</div>
			</header>

			{/* Main / Card area */}
			<main className="flex-1 flex flex-col items-center justify-center gap-6">
				{card ? (
					<Card3D card={card} flipped={flipped} onClick={toggleFlip} />
				) : (
					<div
						onClick={drawCard}
						className="w-64 h-96 sm:w-72 sm:h-[400px] border-2 border-dashed border-border hover:border-border-strong rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer text-faint hover:text-muted transition-colors group"
					>
						<svg className="w-14 h-14 text-faint group-hover:text-muted transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
							<rect x="4" y="3" width="16" height="18" rx="2" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M9 11h6" />
						</svg>
						<span className="text-sm font-semibold">Toca para sacar una carta</span>
					</div>
				)}

				{card && (
					<div className="text-center">
						<p className="text-xs text-faint uppercase tracking-widest font-semibold">
							{flipped ? "Carta Revelada" : "Carta Oculta"}
						</p>
						<p className="text-sm text-muted mt-1">
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
							className="bg-transparent border border-border hover:bg-surface hover:border-border-strong active:scale-[0.99] text-muted hover:text-fg py-3.5 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer"
						>
							{flipped ? "Ocultar" : "Revelar"}
						</button>
						<button
							onClick={() => {
								setIsFullscreen(true);
								setShowCloseButton(false);
							}}
							className="bg-transparent border border-border hover:bg-surface hover:border-border-strong active:scale-[0.99] text-muted hover:text-fg py-3.5 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
						>
							<svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4" />
							</svg>
							<span>Pantalla completa</span>
						</button>
					</div>
				)}

				<div className="grid grid-cols-2 gap-2">
					<button
						onClick={() => setIsSelectorOpen(true)}
						className="bg-transparent border border-border hover:bg-surface hover:border-border-strong active:scale-[0.99] text-muted hover:text-fg py-3.5 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
					>
						<svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<rect x="3" y="3" width="12" height="12" rx="2" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 17h6a2 2 0 002-2V9" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M13 21h6a2 2 0 002-2v-6" />
						</svg>
						<span>Elegir de baraja</span>
					</button>
					<button
						onClick={drawCard}
						className="bg-primary hover:opacity-90 active:scale-[0.99] text-primary-fg py-3.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
					>
						<svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M18 4l3 3m0 0l-3 3m3-3H9a4 4 0 00-4 4v1a4 4 0 004 4h10M6 20l-3-3m0 0l3-3m-3 3h12a4 4 0 004-4v-1a4 4 0 00-4-4H9" />
						</svg>
						<span>Carta aleatoria</span>
					</button>
				</div>
			</footer>

			{/* Fullscreen Overlay */}
			{isFullscreen && card && (
				<div
					onClick={() => {
						// On click anywhere in the fullscreen overlay, flip the card and show controls
						toggleFlip();
						setShowCloseButton(true);
					}}
					className="fixed inset-0 bg-bg z-50 flex flex-col items-center justify-center p-0 transition-all"
				>
					{/* Close button */}
					{showCloseButton && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								setIsFullscreen(false);
							}}
							className="absolute top-6 right-6 text-muted hover:text-fg text-2xl bg-surface/80 backdrop-blur-sm border border-border hover:border-border-strong w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer z-50"
						>
							✕
						</button>
					)}

					{/* Fullscreen Card */}
					<div className="w-full h-full transition-transform duration-300">
						<Card3D
							card={card}
							flipped={flipped}
							className="w-full h-[100dvh]"
							innerClassName="rounded-none"
						/>
					</div>
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
						className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden"
					>
						{/* Header */}
						<div className="p-5 border-b border-border flex justify-between items-center bg-surface">
							<div>
								<h3 className="text-base font-bold text-fg">Elige una carta</h3>
								<p className="text-xs text-muted mt-1">Selecciona cualquier carta de la baraja para ponerla en la mesa.</p>
							</div>
							<button onClick={() => setIsSelectorOpen(false)} className="text-muted hover:text-fg p-2 rounded-lg bg-surface-2 hover:bg-border transition-colors cursor-pointer">
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
															? "border-neutral-900 ring-1 ring-neutral-900 text-neutral-900 bg-neutral-100 scale-[1.05]"
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
						<div className="p-4 border-t border-border bg-bg flex justify-end">
							<button onClick={() => setIsSelectorOpen(false)} className="text-xs bg-surface-2 hover:bg-border text-fg px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer">
								Cerrar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
