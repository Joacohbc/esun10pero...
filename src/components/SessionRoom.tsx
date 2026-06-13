import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/hooks/useSession";
import { useSound } from "@/hooks/useSound";
import { getIdentity, setName as persistName } from "@/lib/identity";
import { Card3D } from "./Card3D";
import { Controls } from "./Controls";
import { PlayerList } from "./PlayerList";
import { PalomaSVG } from "./PalomaSVG";
import { VisorModal } from "./VisorModal";
import { VotePanel } from "./VotePanel";
import { ScoreDisplay } from "./ScoreDisplay";
import { ThemeToggle } from "./ThemeToggle";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import { randomPigeonName } from "@/lib/names";
import type { CardMode } from "@/lib/protocol";

/** Pide el nombre si el jugador entró por enlace directo sin haberlo fijado. */
function NamePrompt({ onSubmit }: { onSubmit: (name: string) => void }) {
	const [name, setName] = useState("");
	// Nombre por defecto (científico de paloma + pan) si lo deja vacío.
	const [defaultName] = useState(randomPigeonName);
	const submit = () => onSubmit(name.trim() || defaultName);
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
			<h1 className="text-lg font-semibold text-fg">¿Cómo te llamas?</h1>
			<div className="flex gap-2 w-full max-w-xs">
				<input
					autoFocus
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={24}
					placeholder={defaultName}
					className="flex-1 min-w-0 bg-surface border border-border rounded-xl px-4 py-3 text-fg placeholder:text-faint focus:outline-none focus:border-border-strong"
					onKeyDown={(e) => {
						if (e.key === "Enter") submit();
					}}
				/>
				<button onClick={submit} className="bg-primary hover:opacity-90 text-primary-fg px-5 rounded-xl font-bold transition-all">
					Entrar
				</button>
			</div>
			<p className="text-[10px] text-faint">Si lo dejas vacío te tocará un nombre de paloma al azar.</p>
		</div>
	);
}

export function SessionRoom({ code, cardMode }: { code: string; cardMode?: CardMode }) {
	const navigate = useNavigate();
	const [identity, setIdentity] = useState(() => ({ playerId: "", name: "", color: "#9CA3AF" }));
	const [ready, setReady] = useState(false);
	const [visorOpen, setVisorOpen] = useState(false);
	const [bounce, setBounce] = useState(false);
	const [copied, setCopied] = useState(false);

	useDynamicFavicon(identity.color);

	const { enabled: soundEnabled, toggle: toggleSound, playSound } = useSound();

	useEffect(() => {
		const id = getIdentity();
		setIdentity(id);
		if (id.name) setReady(true);
	}, []);

	const handleName = useCallback((name: string) => {
		const updated = persistName(name);
		setIdentity(updated);
		setReady(true);
	}, []);

	const onEvent = useCallback(
		(event: "flip" | "shuffle" | "empty") => {
			playSound(event);
			if (event === "shuffle") {
				setBounce(true);
				setTimeout(() => setBounce(false), 500);
			}
		},
		[playSound],
	);

	const { state, status, error, send } = useSession({
		code,
		playerId: ready ? identity.playerId : "",
		name: identity.name,
		color: identity.color,
		cardMode,
		onEvent,
	});

	const copyCode = useCallback(() => {
		navigator.clipboard?.writeText(code).then(
			() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			},
			() => {},
		);
	}, [code]);

	if (!ready) return <NamePrompt onSubmit={handleName} />;

	const isHidden = !!state && state.hiddenPlayerId === state.youId;
	const isHost = !!state && state.hostId === state.youId;
	const flipped = !!state && (state.phase === "revealed" || (state.phase === "playing" && !isHidden));

	return (
		<div className="min-h-screen flex flex-col justify-between">
			{/* Header */}
			<header className="w-full max-w-md mx-auto px-5 pt-5 flex justify-between items-center gap-3">
				<button onClick={copyCode} className="flex items-center gap-2 group bg-transparent hover:bg-surface active:scale-95 border border-border hover:border-border-strong pl-2 pr-3 py-1.5 rounded-full transition-colors" title="Copiar código de sala">
					<PalomaSVG color={identity.color} size={24} animated className="shrink-0" />
					<span className="font-mono font-semibold tracking-[0.2em] text-sm text-fg">{code}</span>
					{copied ? (
						<svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					) : (
						<svg className="w-3.5 h-3.5 text-faint group-hover:text-muted transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a1 1 0 011-1h8l4 4v9a1 1 0 01-1 1h-3M6 9h8a1 1 0 011 1v9a1 1 0 01-1 1H6a1 1 0 01-1-1V10a1 1 0 011-1z" />
						</svg>
					)}
				</button>

				{/* Grupo conectado: mazo · tema · salir */}
				<div className="flex items-center gap-0.5 bg-transparent border border-border rounded-full p-1">
					<span className="flex items-center gap-1.5 pl-2.5 pr-1 text-xs text-muted">
						<span className={`inline-block w-1.5 h-1.5 rounded-full ${status === "open" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
						{state ? <span className="font-mono text-fg">{state.deckCount}/{state.activeCount}</span> : <span>···</span>}
					</span>
					<span className="w-px h-4 bg-border mx-0.5" />
					<ThemeToggle bare className="rounded-full hover:bg-surface-2" />
					<button
						onClick={() => navigate({ to: "/" })}
						title="Salir de la sesión"
						className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-fg hover:bg-surface-2 transition-colors"
					>
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7M13 16v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
					</button>
				</div>
			</header>

			{/* Main */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
				{!state ? (
					<p className="text-faint text-sm">Conectando a la sala…</p>
				) : (
					<>
						<Card3D card={state.currentCard} flipped={flipped} bounce={bounce} />

						{error && <p className="text-xs text-accent text-center h-4">{error}</p>}

						<Controls
							state={state}
							send={send}
							isHost={isHost}
							isHidden={isHidden}
							soundEnabled={soundEnabled}
							onToggleSound={toggleSound}
							onOpenVisor={() => setVisorOpen(true)}
						/>

						{state.phase === "revealed" && (
							<>
								<ScoreDisplay state={state} />
								<VotePanel state={state} send={send} />
							</>
						)}
					</>
				)}
			</main>

			{/* Footer: roster */}
			<footer className="w-full max-w-md mx-auto px-5 pb-6 mt-auto">
				{state && <PlayerList state={state} />}
			</footer>

			{state && <VisorModal open={visorOpen} onClose={() => setVisorOpen(false)} excludedCardIds={state.excludedCardIds} send={send} />}
		</div>
	);
}
