"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const KEY = "migajero-theme";

/** Lee el tema guardado, o cae al preferido por el sistema. */
function readTheme(): Theme {
	if (typeof window === "undefined") return "dark";
	try {
		const stored = localStorage.getItem(KEY);
		if (stored === "light" || stored === "dark") return stored;
	} catch {
		// ignorar storage corrupto
	}
	return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
	if (typeof document === "undefined") return;
	document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * Gestiona el tema claro/oscuro. Persiste la preferencia en localStorage y
 * aplica la clase `.dark` en <html>. El script anti-FOUC de __root.tsx ya
 * aplica la clase antes del primer paint; aquí solo se sincroniza el estado.
 */
export function useTheme() {
	const [theme, setTheme] = useState<Theme>("dark");

	// Sincroniza el estado con lo que ya hay en el DOM/storage al montar.
	useEffect(() => {
		const initial = readTheme();
		setTheme(initial);
		applyTheme(initial);
	}, []);

	const toggle = useCallback(() => {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			applyTheme(next);
			try {
				localStorage.setItem(KEY, next);
			} catch {
				// ignorar
			}
			return next;
		});
	}, []);

	return { theme, toggle };
}
