"use client";

import type { Card } from "@/lib/cards";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";

interface Card3DProps {
	/** Carta a mostrar en la cara. Si es null se muestra solo el reverso. */
	card: Card | null;
	/** Si está volteada (mostrando la cara). */
	flipped: boolean;
	onClick?: () => void;
	bounce?: boolean;
}

/** Contenedor 3D con la animación de volteo, portado del generador original. */
export function Card3D({ card, flipped, onClick, bounce }: Card3DProps) {
	const cardKey = card ? card.id : "empty";
	return (
		<div
			key={cardKey}
			className="perspective-1000 w-64 h-96 sm:w-72 sm:h-[400px] cursor-pointer group animate-deal"
			onClick={onClick}
		>
			<div
				className={`w-full h-full preserve-3d transition-transform duration-500 relative rounded-2xl shadow-2xl ${
					flipped ? "rotate-y-180" : ""
				} ${bounce ? "animate-bounce" : ""}`}
			>
				<CardBack />
				{card ? (
					<CardFront card={card} />
				) : (
					// Placeholder de cara cuando aún no se conoce la carta (jugador oculto).
					<div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white border border-neutral-200 text-neutral-300 rounded-2xl flex items-center justify-center select-none">
						<span className="text-7xl">?</span>
					</div>
				)}
			</div>
		</div>
	);
}
