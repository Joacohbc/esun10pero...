"use client";

import { useState } from "react";
import type { ClientMessage } from "@/lib/protocol";

interface RatingInputProps {
	currentRating: number | null;
	send: (msg: ClientMessage) => void;
}

export function RatingInput({ currentRating, send }: RatingInputProps) {
	const [selected, setSelected] = useState<number | null>(null);

	if (currentRating !== null) {
		return (
			<div className="w-full bg-surface border border-border rounded-2xl p-4 text-center">
				<p className="text-xs text-muted mb-1">Tu valoración enviada</p>
				<p className="text-5xl font-semibold text-fg">{currentRating}</p>
				<p className="text-xs text-faint mt-2">Esperando a que alguien voltee la carta…</p>
			</div>
		);
	}

	return (
		<div className="w-full bg-surface border border-border rounded-2xl p-4">
			<p className="text-sm font-semibold text-fg mb-1 text-center">¿Cuánto de migajero es?</p>
			<p className="text-xs text-faint mb-4 text-center">Escucha la situación y dale un nivel del 1 al 13</p>
			<div className="flex flex-wrap justify-center gap-2 mb-4">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
					<button
						key={n}
						onClick={() => setSelected(n)}
						className={`aspect-square w-[calc((100%-3rem)/7)] rounded-lg text-base font-semibold border transition-all active:scale-95 ${
							selected === n
								? "bg-primary border-primary text-primary-fg"
								: "bg-bg border-border text-fg hover:border-border-strong"
						}`}
					>
						{n}
					</button>
				))}
			</div>
			<button
				onClick={() => {
					if (selected !== null) send({ type: "submitRating", rating: selected });
				}}
				disabled={selected === null}
				className="w-full bg-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-fg py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.99]"
			>
				{selected !== null ? `Enviar valoración: ${selected}` : "Elige un número primero"}
			</button>
		</div>
	);
}
