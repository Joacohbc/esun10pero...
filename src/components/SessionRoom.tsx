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
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";

/** Pide el nombre si el jugador entró por enlace directo sin haberlo fijado. */
function NamePrompt({ onSubmit }: { onSubmit: (name: string) => void }) {
	const [name, setName] = useState("");
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
			<h1 className="text-lg font-semibold text-neutral-100">¿Cómo te llamas?</h1>
			<div className="flex gap-2 w-full max-w-xs">
				<input
					autoFocus
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={24}
					placeholder="Tu nombre"
					className="flex-1 min-w-0 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
					onKeyDown={(e) => {
						if (e.key === "Enter" && name.trim()) onSubmit(name.trim());
					}}
				/>
				<button onClick={() => name.trim() && onSubmit(name.trim())} className="bg-neutral-100 hover:bg-white text-neutral-900 px-5 rounded-xl font-bold transition-all">
					Entrar
				</button>
			</div>
		</div>
	);
}

export function SessionRoom({ code }: { code: string }) {
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
			<header className="w-full max-w-md mx-auto px-6 pt-6 flex justify-between items-center gap-3">
				<button onClick={copyCode} className="flex items-center gap-2 group bg-neutral-900 hover:bg-neutral-800 active:scale-95 border border-neutral-800 hover:border-neutral-600 px-3 py-2 rounded-xl transition-all" title="Copiar código de sala">
					<PalomaSVG color={identity.color} size={28} animated className="shrink-0" />
					<span className="font-mono font-bold tracking-[0.2em] text-neutral-200 group-hover:text-white transition-colors">{code}</span>
					<span className="text-[10px] text-neutral-500 group-hover:text-neutral-400 transition-colors flex items-center gap-1">
						{copied ? (
							<>
								<svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
								</svg>
								<span>¡copiado!</span>
							</>
						) : (
							<>
								<svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a1 1 0 011-1h8l4 4v9a1 1 0 01-1 1h-3M6 9h8a1 1 0 011 1v9a1 1 0 01-1 1H6a1 1 0 01-1-1V10a1 1 0 011-1z" />
								</svg>
								<span>copiar</span>
							</>
						)}
					</span>
				</button>
				<div className="flex items-center gap-2">
					<div className="text-xs bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-neutral-400 flex items-center gap-2">
						<span className={`inline-block w-2 h-2 rounded-full ${status === "open" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
						{state ? (
							<>
								Mazo: <span className="font-mono font-bold text-neutral-200">{state.deckCount}/{state.activeCount}</span>
							</>
						) : (
							"conectando…"
						)}
					</div>
					<button
						onClick={() => navigate({ to: "/" })}
						title="Salir de la sesión"
						className="text-xs bg-neutral-900 border border-neutral-800 hover:border-red-800 hover:text-red-400 px-3 py-1.5 rounded-full text-neutral-400 transition-colors"
					>
						Salir
					</button>
				</div>
			</header>

			{/* Main */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
				{!state ? (
					<p className="text-neutral-500 text-sm">Conectando a la sala…</p>
				) : (
					<>
						<Card3D card={state.currentCard} flipped={flipped} bounce={bounce} />

						{error && <p className="text-xs text-red-400 text-center h-4">{error}</p>}

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
			<footer className="w-full max-w-md mx-auto px-6 pb-6 mt-auto">
				<div className="border-t border-neutral-900 pt-4">{state && <PlayerList state={state} />}</div>
			</footer>

			{state && <VisorModal open={visorOpen} onClose={() => setVisorOpen(false)} excludedCardIds={state.excludedCardIds} send={send} />}
		</div>
	);
}
