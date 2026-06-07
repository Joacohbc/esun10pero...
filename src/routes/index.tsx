import { createFileRoute, Link } from "@tanstack/react-router";
import { JoinForm } from "@/components/JoinForm";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-10">
			<header className="flex flex-col items-center gap-3 text-center">
				<h1 className="text-2xl font-bold text-neutral-100">Es un 10 pero...</h1>
				<p className="text-sm text-neutral-400 max-w-xs">
					Crea una sala y comparte el código. Cada ronda, uno no ve la carta y el resto sí. Cualquiera puede voltearla para revelarla.
				</p>
			</header>

			<JoinForm />

			<Link
				to="/offline"
				className="text-xs text-neutral-500 hover:text-neutral-400 underline transition-colors cursor-pointer"
			>
				Jugar en modo offline
			</Link>
		</div>
	);
}
