import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getIdentity, setName as persistName, setColor as persistColor } from "@/lib/identity";
import { generateCode, isValidCode, type CardMode } from "@/lib/protocol";
import { randomPigeonName } from "@/lib/names";
import { PalomaSVG, PIGEON_COLORS, DEFAULT_COLOR } from "@/components/PalomaSVG";
import { SlideToggle } from "@/components/SlideToggle";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";

export function JoinForm() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [code, setCode] = useState("");
	const [cardMode, setCardMode] = useState<CardMode>("choose");
	const [error, setError] = useState<string | null>(null);
	// Nombre por defecto (científico de paloma + pan) si el jugador no escribe ninguno.
	const [defaultName] = useState(randomPigeonName);

	useDynamicFavicon(color);

	useEffect(() => {
		const id = getIdentity();
		setName(id.name);
		setColor(id.color);
	}, []);

	const go = (targetCode: string, mode?: CardMode) => {
		// Si no escribe nombre, se le asigna uno por defecto de paloma.
		const finalName = name.trim() || defaultName;
		persistName(finalName);
		navigate({ to: `/session/${targetCode}`, search: mode ? { mode } : {} });
	};

	const handleColorChange = (hex: string) => {
		setColor(hex);
		persistColor(hex);
	};

	const handleCreate = () => go(generateCode(), cardMode);

	const handleJoin = () => {
		const clean = code.trim().toUpperCase();
		if (!isValidCode(clean)) {
			setError("Código inválido (4 caracteres)");
			return;
		}
		go(clean);
	};

	return (
		<div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 flex flex-col gap-6">
			{/* Identidad: paloma + color */}
			<div className="flex flex-col items-center gap-4">
				<PalomaSVG color={color} animated size={80} />

				{/* Selector de color */}
				<div className="flex flex-wrap justify-center gap-2 max-w-xs">
					{PIGEON_COLORS.map((c) => (
						<button
							key={c.hex}
							title={c.label}
							onClick={() => handleColorChange(c.hex)}
							className="w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer"
							style={{
								backgroundColor: c.hex,
								outline: color === c.hex ? `2px solid ${c.hex}` : "2px solid transparent",
								outlineOffset: "2px",
							}}
						/>
					))}
					{/* Selector personalizado */}
					<label
						title="Color personalizado"
						className="w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer flex items-center justify-center relative overflow-hidden"
						style={{
							background: "linear-gradient(45deg, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)",
							outline: !PIGEON_COLORS.some((c) => c.hex === color) ? `2px solid ${color}` : "2px solid transparent",
							outlineOffset: "2px",
						}}
					>
						<input
							type="color"
							value={color}
							onChange={(e) => handleColorChange(e.target.value)}
							className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
						/>
						<span className="text-white text-[10px] font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">+</span>
					</label>
				</div>
			</div>

			{/* Nombre */}
			<div className="flex flex-col gap-2">
				<label className="text-[11px] text-faint font-medium uppercase tracking-wider">Tu nombre</label>
				<input
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						setError(null);
					}}
					maxLength={24}
					placeholder={defaultName}
					className="bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-fg placeholder:text-faint focus:outline-none focus:border-border-strong"
				/>
				<p className="text-[10px] text-faint">Si lo dejas vacío te tocará un nombre de paloma al azar.</p>
			</div>

			{/* Modo de carta: se fija al crear la sala y no se puede cambiar después. */}
			<div className="flex flex-col gap-2">
				<label className="text-[11px] text-faint font-medium uppercase tracking-wider">Modo de carta</label>
				<SlideToggle
					value={cardMode}
					onChange={setCardMode}
					options={[
						{
							value: "choose",
							title: "Los demás eligen la carta para el migajero",
							label: (
								<>
									<svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
									</svg>
									Elegir carta
								</>
							),
						},
						{
							value: "random",
							title: "Al ser migajero se saca una carta al azar al instante",
							label: (
								<>
									<svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<rect x="4" y="4" width="16" height="16" rx="3" />
										<circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
										<circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
										<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
										<circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
										<circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
									</svg>
									Aleatorio
								</>
							),
						},
					]}
				/>
				<p className="text-[10px] text-faint">
					{cardMode === "choose" ? "Los demás eligen la carta del migajero." : "Se saca una carta al azar automáticamente."} Se fija al crear la sala.
				</p>
			</div>

			{/* Acciones */}
			<div className="flex flex-col gap-4 pt-1">
				<button
					onClick={handleCreate}
					className="w-full bg-primary hover:opacity-90 text-primary-fg active:scale-[0.99] py-3 px-6 rounded-lg text-sm font-semibold transition-all"
				>
					Crear sala
				</button>

				<div className="flex items-center gap-3 text-[11px] text-faint">
					<div className="flex-1 h-px bg-border" />
					o únete con un código
					<div className="flex-1 h-px bg-border" />
				</div>

				<div className="flex gap-2">
					<input
						value={code}
						onChange={(e) => {
							setCode(e.target.value.toUpperCase());
							setError(null);
						}}
						maxLength={4}
						placeholder="CÓDIGO"
						className="flex-1 min-w-0 bg-bg border border-border rounded-lg px-3.5 py-2.5 text-sm text-fg placeholder:text-faint font-mono tracking-[0.3em] text-center uppercase focus:outline-none focus:border-border-strong"
						onKeyDown={(e) => {
							if (e.key === "Enter") handleJoin();
						}}
					/>
					<button
						onClick={handleJoin}
						className="bg-transparent hover:bg-surface-2 text-muted hover:text-fg border border-border px-5 rounded-lg text-sm font-medium transition-colors"
					>
						Unirse
					</button>
				</div>

				{error && <p className="text-xs text-accent text-center">{error}</p>}
			</div>
		</div>
	);
}
