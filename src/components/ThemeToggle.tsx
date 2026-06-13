"use client";

import { useTheme } from "@/hooks/useTheme";

/**
 * Botón sol/luna para alternar tema claro/oscuro.
 * - `bare`: sin borde/fondo propio, para integrarse dentro de un grupo.
 */
export function ThemeToggle({ bare = false, className = "" }: { bare?: boolean; className?: string }) {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";

	const base = bare
		? "w-8 h-8 text-muted hover:text-fg"
		: "w-9 h-9 text-muted hover:text-fg hover:bg-surface rounded-full";

	return (
		<button
			onClick={toggle}
			title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
			aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
			className={`flex items-center justify-center transition-colors shrink-0 ${base} ${className}`}
		>
			{isDark ? (
				// Sol → ofrece pasar a claro
				<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<circle cx="12" cy="12" r="4" />
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
				</svg>
			) : (
				// Luna → ofrece pasar a oscuro
				<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
				</svg>
			)}
		</button>
	);
}
