import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getIdentity, setName as persistName, setColor as persistColor } from "@/lib/identity";
import { generateCode, isValidCode } from "@/lib/protocol";
import { PalomaSVG, PIGEON_COLORS, DEFAULT_COLOR } from "@/components/PalomaSVG";

export function JoinForm() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const id = getIdentity();
		setName(id.name);
		setColor(id.color);
	}, []);

	const go = (targetCode: string) => {
		const trimmed = name.trim();
		if (!trimmed) {
			setError("Escribe tu nombre");
			return;
		}
		persistName(trimmed);
		navigate({ to: `/session/${targetCode}` });
	};

	const handleColorChange = (hex: string) => {
		setColor(hex);
		persistColor(hex);
	};

	const handleCreate = () => go(generateCode());

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
					placeholder="Ej. Joaco"
					className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
				/>
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
