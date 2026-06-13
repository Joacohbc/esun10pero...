import type { ReactNode } from "react";

interface SlideOption<T extends string> {
	value: T;
	label: ReactNode;
	title?: string;
}

interface SlideToggleProps<T extends string> {
	/** Las dos opciones; la primera queda a la izquierda y la segunda a la derecha. */
	options: readonly [SlideOption<T>, SlideOption<T>];
	value: T;
	onChange: (value: T) => void;
	disabled?: boolean;
	/** Clases extra del contenedor (p. ej. altura). */
	className?: string;
}

/** Toggle segmentado de dos opciones con pastilla deslizante. */
export function SlideToggle<T extends string>({ options, value, onChange, disabled = false, className = "h-11" }: SlideToggleProps<T>) {
	const isSecond = value === options[1].value;
	return (
		<div className={`relative flex bg-bg border border-border rounded-lg select-none ${className}`}>
			{/* Pastilla deslizante */}
			<span
				aria-hidden
				className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.5rem)] rounded-md bg-primary transition-transform duration-300 ease-out ${
					isSecond ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-0"
				}`}
			/>
			{options.map((opt) => (
				<button
					key={opt.value}
					type="button"
					onClick={() => onChange(opt.value)}
					disabled={disabled}
					title={opt.title}
					className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors disabled:cursor-not-allowed ${
						value === opt.value ? "text-primary-fg" : "text-muted hover:text-fg"
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
