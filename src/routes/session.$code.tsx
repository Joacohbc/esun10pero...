import { createFileRoute, notFound } from "@tanstack/react-router";
import { SessionRoom } from "@/components/SessionRoom";
import { isValidCode, type CardMode } from "@/lib/protocol";

export const Route = createFileRoute("/session/$code")({
	// `mode` solo lo agrega el creador de la sala; fija el modo de carta al crearla.
	validateSearch: (search: Record<string, unknown>): { mode?: CardMode } => {
		const mode = search.mode;
		return mode === "random" || mode === "choose" ? { mode } : {};
	},
	loader: ({ params }) => {
		const normalized = decodeURIComponent(params.code).toUpperCase();
		if (!isValidCode(normalized)) {
			throw notFound();
		}
		return { code: normalized };
	},
	component: SessionPage,
});

function SessionPage() {
	const { code } = Route.useLoaderData();
	const { mode } = Route.useSearch();
	return <SessionRoom code={code} cardMode={mode} />;
}
