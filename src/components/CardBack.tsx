/** Reverso decorativo de la carta, portado del markup original. */
export function CardBack() {
	return (
		<div className="absolute inset-0 w-full h-full backface-hidden bg-neutral-900 border-2 border-neutral-800 rounded-2xl flex flex-col items-center justify-center p-4">
			<div className="w-full h-full border border-neutral-800/80 rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
				<div className="w-24 h-24 rounded-full border-2 border-neutral-800 flex items-center justify-center bg-neutral-900/90 z-10">
					<div className="text-3xl text-neutral-700 font-serif select-none">♠️</div>
				</div>
				<div className="absolute top-4 left-4 text-xs text-neutral-800 font-mono">♣️</div>
				<div className="absolute top-4 right-4 text-xs text-neutral-800 font-mono">♥️</div>
				<div className="absolute bottom-4 left-4 text-xs text-neutral-800 font-mono">♦️</div>
				<div className="absolute bottom-4 right-4 text-xs text-neutral-800 font-mono">♠️</div>
			</div>
		</div>
	);
}
