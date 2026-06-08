import type { Card } from "@/lib/cards";

/** Cara de la carta (valor + palo), portada del markup original. */
export function CardFront({ card, roundedClassName }: { card: Card; roundedClassName?: string }) {
	return (
		<div
			className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white border border-neutral-200 ${card.suit.color} ${roundedClassName ?? "rounded-2xl"} flex flex-col justify-between p-5 select-none`}
		>
			{/* Esquina superior izquierda */}
			<div className="flex flex-col items-center justify-start w-fit">
				<span className="text-3xl font-extrabold leading-none tracking-tighter">{card.value}</span>
				<span className="text-2xl leading-none mt-1">{card.suit.symbol}</span>
			</div>

			{/* Icono central grande */}
			<div className="flex justify-center items-center">
				<span className="text-8xl transform filter drop-shadow-sm transition-transform group-hover:scale-110 duration-300">{card.suit.symbol}</span>
			</div>

			{/* Esquina inferior derecha (rotada) */}
			<div className="flex flex-col items-center justify-start w-fit self-end rotate-180">
				<span className="text-3xl font-extrabold leading-none tracking-tighter">{card.value}</span>
				<span className="text-2xl leading-none mt-1">{card.suit.symbol}</span>
			</div>
		</div>
	);
}
