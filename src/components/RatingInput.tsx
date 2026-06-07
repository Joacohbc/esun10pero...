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
			<div className="w-full bg-neutral-900 border border-emerald-800/60 rounded-2xl p-4 text-center">
				<p className="text-xs text-neutral-400 mb-1">Tu valoración enviada</p>
				<p className="text-5xl font-black text-emerald-400">{currentRating}</p>
				<p className="text-xs text-neutral-500 mt-2">Esperando a que alguien voltee la carta…</p>
			</div>
		);
	}

	return (
		<div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
			<p className="text-sm font-bold text-neutral-100 mb-1">¿Cuánto de migajero es?</p>
			<p className="text-xs text-neutral-500 mb-4">Escucha la situación y dale un nivel del 1 al 13</p>
			<div className="grid grid-cols-7 gap-2 mb-4">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
					<button
						key={n}
						onClick={() => setSelected(n)}
						className={`aspect-square rounded-xl text-base font-black border transition-all active:scale-95 ${
							selected === n
								? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-950/40"
								: "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500"
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
				className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold tracking-wide transition-all active:scale-[0.98]"
			>
				{selected !== null ? `Enviar valoración: ${selected}` : "Elige un número primero"}
			</button>
		</div>
	);
}
