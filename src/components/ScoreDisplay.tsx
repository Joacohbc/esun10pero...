import type { PublicGameState } from "@/lib/protocol";

interface ScoreDisplayProps {
	state: PublicGameState;
}

function getMessage(diff: number): { text: string; color: string } {
	if (diff === 0) return { text: "¡Acertaste!", color: "text-emerald-400" };
	if (diff === 1) return { text: "¡Muy cerca!", color: "text-yellow-400" };
	if (diff === 2) return { text: "Cerca", color: "text-orange-400" };
	return { text: "Lejos", color: "text-red-400" };
}

export function ScoreDisplay({ state }: ScoreDisplayProps) {
	const { migajeroRating, cardNumericValue } = state;

	if (migajeroRating === null) {
		return (
			<div className="w-full max-w-sm mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center text-sm text-neutral-500">
				El migajero no valoró esta ronda.
			</div>
		);
	}

	if (cardNumericValue === null) return null;

	const diff = Math.abs(migajeroRating - cardNumericValue);
	const { text, color } = getMessage(diff);

	return (
		<div className="w-full max-w-sm mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
			<p className={`text-2xl font-black text-center mb-4 ${color}`}>{text}</p>
			<div className="flex items-center justify-center gap-6">
				<div className="text-center">
					<p className="text-xs text-neutral-500 mb-1">Valoración del migajero</p>
					<p className="text-5xl font-black text-neutral-100">{migajeroRating}</p>
				</div>
				<div className="text-neutral-600 text-2xl font-bold">vs</div>
				<div className="text-center">
					<p className="text-xs text-neutral-500 mb-1">Nivel real</p>
					<p className="text-5xl font-black text-neutral-100">{cardNumericValue}</p>
				</div>
			</div>
			{diff > 0 && (
				<p className="text-xs text-neutral-500 text-center mt-3">
					Diferencia: {diff} {diff === 1 ? "punto" : "puntos"}
				</p>
			)}
		</div>
	);
}
