"use client";

import { useCallback, useRef, useState } from "react";

export type SoundType = "flip" | "shuffle" | "empty";

/**
 * Sonidos sintetizados con Web Audio API — portado del generador original.
 * El AudioContext se inicializa de forma perezosa tras la primera interacción.
 */
export function useSound() {
	const [enabled, setEnabled] = useState(true);
	const ctxRef = useRef<AudioContext | null>(null);

	const ensureContext = useCallback(() => {
		if (!ctxRef.current) {
			const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			ctxRef.current = new Ctor();
		}
		if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
		return ctxRef.current;
	}, []);

	const playSound = useCallback(
		(type: SoundType) => {
			if (!enabled) return;
			try {
				const audioCtx = ensureContext();
				const osc = audioCtx.createOscillator();
				const gain = audioCtx.createGain();
				osc.connect(gain);
				gain.connect(audioCtx.destination);
				const now = audioCtx.currentTime;

				if (type === "flip") {
					osc.type = "triangle";
					osc.frequency.setValueAtTime(150, now);
					osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
					gain.gain.setValueAtTime(0.15, now);
					gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
					osc.start(now);
					osc.stop(now + 0.15);
				} else if (type === "shuffle") {
					osc.type = "sine";
					osc.frequency.setValueAtTime(300, now);
					osc.frequency.setValueAtTime(200, now + 0.05);
					osc.frequency.setValueAtTime(400, now + 0.1);
					gain.gain.setValueAtTime(0.1, now);
					gain.gain.setValueAtTime(0.08, now + 0.05);
					gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
					osc.start(now);
					osc.stop(now + 0.2);
				} else if (type === "empty") {
					osc.type = "sawtooth";
					osc.frequency.setValueAtTime(120, now);
					osc.frequency.setValueAtTime(100, now + 0.1);
					gain.gain.setValueAtTime(0.1, now);
					gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
					osc.start(now);
					osc.stop(now + 0.3);
				}
			} catch {
				// El navegador puede bloquear el audio temporalmente; ignorar.
			}
		},
		[enabled, ensureContext],
	);

	const toggle = useCallback(() => setEnabled((v) => !v), []);

	return { enabled, toggle, playSound };
}
