import { createFileRoute, Link } from "@tanstack/react-router";
import { JoinForm } from "@/components/JoinForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-7">
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>

			<header className="flex flex-col items-center gap-2.5 text-center max-w-sm">
				<h1 className="text-2xl font-semibold tracking-tight text-fg">Es un 10 pero...</h1>
				<p className="text-sm text-muted leading-relaxed">
					Crea una sala y comparte el código. Cada ronda, uno no ve la carta y el resto sí. Cualquiera puede voltearla para revelarla.
				</p>
			</header>

			<JoinForm />

			<Link
				to="/offline"
				className="text-xs text-faint hover:text-fg transition-colors cursor-pointer"
			>
				Jugar en modo offline →
			</Link>
		</div>
	);
}
