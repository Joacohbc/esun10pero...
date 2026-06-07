import { JoinForm } from "@/components/JoinForm";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-10">
			<header className="flex flex-col items-center gap-3 text-center">
				<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-950/30">
					<span className="text-white font-bold text-2xl">♠</span>
				</div>
				<h1 className="text-2xl font-bold text-neutral-100">Póker Simple</h1>
				<p className="text-sm text-neutral-400 max-w-xs">
					Crea una sala y comparte el código. Cada ronda, uno no ve la carta y el resto sí. Cualquiera puede voltearla para revelarla.
				</p>
			</header>

			<JoinForm />
		</div>
	);
}
