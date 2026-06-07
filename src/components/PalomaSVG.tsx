"use client";

export interface PigeonColor {
	label: string;
	hex: string;
}

export const PIGEON_COLORS: PigeonColor[] = [
	{ label: "Gris", hex: "#9CA3AF" },
	{ label: "Azul", hex: "#60A5FA" },
	{ label: "Cian", hex: "#38BDF8" },
	{ label: "Verde", hex: "#4ADE80" },
	{ label: "Esmeralda", hex: "#34D399" },
	{ label: "Violeta", hex: "#A78BFA" },
	{ label: "Fucsia", hex: "#E879F9" },
	{ label: "Rosa", hex: "#F472B6" },
	{ label: "Rojo", hex: "#F87171" },
	{ label: "Naranja", hex: "#FB923C" },
	{ label: "Amarillo", hex: "#FBBF24" },
];

export const DEFAULT_COLOR = PIGEON_COLORS[0].hex;

function darken(hex: string, factor = 0.72): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `#${Math.round(r * factor).toString(16).padStart(2, "0")}${Math.round(g * factor).toString(16).padStart(2, "0")}${Math.round(b * factor).toString(16).padStart(2, "0")}`;
}

interface PalomaSVGProps {
	color?: string;
	animated?: boolean;
	size?: number;
	className?: string;
}

export function PalomaSVG({ color = DEFAULT_COLOR, animated = false, size = 40, className }: PalomaSVGProps) {
	const wing = darken(color);

	if (animated) {
		return (
			<svg viewBox="0 0 400 400" width={size} height={size} xmlns="http://www.w3.org/2000/svg" className={className}>
				<style>{`
					@keyframes paloma-peck {
						0%,15%,85%,100% { transform: rotate(0deg); }
						25% { transform: rotate(-100deg); }
						35% { transform: rotate(-80deg); }
						45% { transform: rotate(-100deg); }
						55% { transform: rotate(-70deg); }
						65% { transform: rotate(-105deg); }
						75% { transform: rotate(-90deg); }
					}
					@keyframes paloma-tilt {
						0%,15%,85%,100% { transform: rotate(0deg); }
						25%,45%,65% { transform: rotate(15deg); }
						35%,55%,75% { transform: rotate(10deg); }
					}
					@keyframes paloma-blink {
						0%,96%,100% { transform: scaleY(1); }
						98% { transform: scaleY(0.1); }
					}
					@keyframes paloma-shadow {
						0%,15%,85%,100% { transform: translateX(0) scaleX(1); }
						25%,65% { transform: translateX(-15px) scaleX(1.1); }
					}
					.paloma-head  { animation: paloma-peck   4s infinite cubic-bezier(0.4,0,0.2,1); transform-origin: 180px 220px; }
					.paloma-body  { animation: paloma-tilt   4s infinite cubic-bezier(0.4,0,0.2,1); transform-origin: 220px 240px; }
					.paloma-blink { animation: paloma-blink  4s infinite linear; transform-origin: 140px 62px; }
					.paloma-shad  { animation: paloma-shadow 4s infinite cubic-bezier(0.4,0,0.2,1); transform-origin: 200px 350px; }
				`}</style>

				<ellipse cx="200" cy="350" rx="100" ry="8" fill="#E2E8F0" className="paloma-shad" />
				<g>
					<circle cx="60" cy="348" r="4" fill="#F59E0B" />
					<circle cx="85" cy="345" r="3" fill="#F59E0B" />
					<circle cx="110" cy="349" r="5" fill="#F59E0B" />
				</g>
				<path d="M 225,260 L 225,345 L 205,345" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
				<g className="paloma-body">
					<polygon points="270,210 350,230 340,260 270,260" fill={wing} />
					<ellipse cx="220" cy="240" rx="75" ry="55" fill={color} />
				</g>
				<g className="paloma-head">
					<circle cx="180" cy="220" r="26" fill={color} />
					<path d="M 155,220 L 135,70 L 165,70 L 200,220 Z" fill={color} />
					<circle cx="150" cy="70" r="25" fill={color} />
					<polygon points="128,65 95,75 128,82" fill="#F59E0B" />
					<g className="paloma-blink">
						<circle cx="140" cy="62" r="3" fill="#1F2937" />
					</g>
				</g>
				<g className="paloma-body">
					<path d="M 170,230 Q 240,200 290,230 Q 300,250 250,260 Q 200,260 170,230 Z" fill={wing} />
				</g>
				<path d="M 195,260 L 195,350 L 175,350" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 400 400" width={size} height={size} xmlns="http://www.w3.org/2000/svg" className={className}>
			<ellipse cx="200" cy="350" rx="100" ry="8" fill="#E2E8F0" />
			<g>
				<circle cx="60" cy="348" r="4" fill="#F59E0B" />
				<circle cx="85" cy="345" r="3" fill="#F59E0B" />
				<circle cx="110" cy="349" r="5" fill="#F59E0B" />
			</g>
			<path d="M 225,260 L 225,345 L 205,345" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
			<g style={{ transformOrigin: "220px 240px", transform: "rotate(15deg)" }}>
				<polygon points="270,210 350,230 340,260 270,260" fill={wing} />
				<ellipse cx="220" cy="240" rx="75" ry="55" fill={color} />
			</g>
			<g style={{ transformOrigin: "180px 220px", transform: "rotate(-100deg)" }}>
				<circle cx="180" cy="220" r="26" fill={color} />
				<path d="M 155,220 L 135,70 L 165,70 L 200,220 Z" fill={color} />
				<circle cx="150" cy="70" r="25" fill={color} />
				<polygon points="128,65 95,75 128,82" fill="#F59E0B" />
				<circle cx="140" cy="62" r="3" fill="#1F2937" />
			</g>
			<g style={{ transformOrigin: "220px 240px", transform: "rotate(15deg)" }}>
				<path d="M 170,230 Q 240,200 290,230 Q 300,250 250,260 Q 200,260 170,230 Z" fill={wing} />
			</g>
			<path d="M 195,260 L 195,350 L 175,350" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
		</svg>
	);
}
