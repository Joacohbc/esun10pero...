import type { PublicGameState } from "@/lib/protocol";

interface ScoreDisplayProps {
	state: PublicGameState;
}

function getMessage(diff: number): { text: string; color: string } {
	if (diff === 0) return { text: "¡Acertaste!", color: "text-fg" };
	if (diff === 1) return { text: "¡Muy cerca!", color: "text-fg" };
	if (diff === 2) return { text: "Cerca", color: "text-muted" };
	return { text: "Lejos", color: "text-muted" };
}

export function ScoreDisplay({ state }: ScoreDisplayProps) {
	const { migajeroRating, cardNumericValue } = state;

	if (migajeroRating === null) {
		return (
			<div className="w-full max-w-sm mx-auto bg-surface border border-border rounded-2xl p-4 text-center text-sm text-faint">
				El migajero no valoró esta ronda.
			</div>
		);
	}

	if (cardNumericValue === null) return null;

	const diff = Math.abs(migajeroRating - cardNumericValue);
	const { text, color } = getMessage(diff);

	return (
		<div className="w-full max-w-sm mx-auto bg-surface border border-border rounded-2xl p-5">
			<p className={`text-xl font-semibold text-center mb-4 ${color}`}>{text}</p>
			<div className="flex items-center justify-center gap-6">
				<div className="text-center">
					<p className="text-xs text-faint mb-1">Valoración del migajero</p>
					<p className="text-5xl font-semibold text-fg">{migajeroRating}</p>
				</div>
				<div className="text-faint text-xl font-medium">vs</div>
				<div className="text-center">
					<p className="text-xs text-faint mb-1">Nivel real</p>
					<p className="text-5xl font-semibold text-fg">{cardNumericValue}</p>
				</div>
			</div>
			{diff > 0 && (
				<p className="text-xs text-faint text-center mt-3">
					Diferencia: {diff} {diff === 1 ? "punto" : "puntos"}
				</p>
			)}
		</div>
	);
}
