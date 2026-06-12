import { cardNumericValue, type Card } from "@/lib/cards";

/** Cara de la carta (valor + palo), portada del markup original. */
export function CardFront({ card, roundedClassName }: { card: Card; roundedClassName?: string }) {
	// Para A/J/Q/K mostramos el número equivalente (1, 11, 12, 13).
	const isFace = Number.isNaN(parseInt(card.value, 10));
	const numericValue = isFace ? cardNumericValue(card) : null;

	return (
		<div
			className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white border border-neutral-200 ${card.suit.color} ${roundedClassName ?? "rounded-2xl"} flex flex-col justify-between p-5 select-none`}
		>
			{/* Número equivalente en las esquinas opuestas (sup. der. e inf. izq.) */}
			{numericValue !== null && (
				<>
					<span className="absolute top-5 right-5 text-xs font-semibold leading-none opacity-70">{numericValue}</span>
					<span className="absolute bottom-5 left-5 text-xs font-semibold leading-none opacity-70 rotate-180">{numericValue}</span>
				</>
			)}

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
