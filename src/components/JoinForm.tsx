import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getIdentity, setName as persistName, setColor as persistColor } from "@/lib/identity";
import { generateCode, isValidCode, type CardMode } from "@/lib/protocol";
import { randomPigeonName } from "@/lib/names";
import { PalomaSVG, PIGEON_COLORS, DEFAULT_COLOR } from "@/components/PalomaSVG";
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
		<div className="w-full max-w-sm flex flex-col gap-6">
			{/* Preview de paloma */}
			<div className="flex flex-col items-center gap-4">
				<PalomaSVG color={color} animated size={96} />

				{/* Selector de color */}
				<div className="flex flex-wrap justify-center gap-2 max-w-xs">
					{PIGEON_COLORS.map((c) => (
						<button
							key={c.hex}
							title={c.label}
							onClick={() => handleColorChange(c.hex)}
							className="w-7 h-7 rounded-full transition-transform hover:scale-110 cursor-pointer"
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
						className="w-7 h-7 rounded-full transition-transform hover:scale-110 cursor-pointer flex items-center justify-center relative overflow-hidden"
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
				<label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Tu nombre</label>
				<input
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						setError(null);
					}}
					maxLength={24}
					placeholder={defaultName}
					className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
				/>
				<p className="text-[10px] text-neutral-600">Si lo dejas vacío te tocará un nombre de paloma al azar.</p>
			</div>

			{/* Modo de carta: se fija al crear la sala y no se puede cambiar después. */}
			<div className="flex flex-col gap-2">
				<label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Modo de carta</label>
				<div className="relative flex h-12 bg-neutral-900 border border-neutral-800 rounded-xl select-none">
					{/* Pastilla deslizante */}
					<span
						aria-hidden
						className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.5rem)] rounded-lg bg-red-500 shadow-md transition-transform duration-300 ease-out ${
							cardMode === "random" ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-0"
						}`}
					/>
					<button
						onClick={() => setCardMode("choose")}
						className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors ${
							cardMode === "choose" ? "text-white" : "text-neutral-400 hover:text-neutral-200"
						}`}
						title="Los demás eligen la carta para el migajero"
					>
						<svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
						</svg>
						Elegir carta
					</button>
					<button
						onClick={() => setCardMode("random")}
						className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors ${
							cardMode === "random" ? "text-white" : "text-neutral-400 hover:text-neutral-200"
						}`}
						title="Al ser migajero se saca una carta al azar al instante"
					>
						<svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<rect x="4" y="4" width="16" height="16" rx="3" />
							<circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
							<circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
							<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
							<circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
							<circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
						</svg>
						Aleatorio
					</button>
				</div>
				<p className="text-[10px] text-neutral-600 text-center">
					{cardMode === "choose" ? "Los demás eligen la carta del migajero." : "Se saca una carta al azar automáticamente."} Se fija al crear la sala.
				</p>
			</div>

			<button
				onClick={handleCreate}
				className="w-full bg-neutral-100 hover:bg-white text-neutral-900 active:scale-[0.98] py-4 px-6 rounded-xl font-bold tracking-wide shadow-md transition-all"
			>
				Crear sala
			</button>

			<div className="flex items-center gap-3 text-xs text-neutral-600">
				<div className="flex-1 h-px bg-neutral-800" />
				o únete con un código
				<div className="flex-1 h-px bg-neutral-800" />
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
					className="flex-1 min-w-0 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder:text-neutral-600 font-mono tracking-[0.3em] text-center uppercase focus:outline-none focus:border-neutral-600"
					onKeyDown={(e) => {
						if (e.key === "Enter") handleJoin();
					}}
				/>
				<button
					onClick={handleJoin}
					className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 px-5 rounded-xl font-semibold border border-neutral-800 transition-all"
				>
					Unirse
				</button>
			</div>

			{error && <p className="text-xs text-red-400 text-center">{error}</p>}
		</div>
	);
}
