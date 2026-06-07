import { createFileRoute, notFound } from "@tanstack/react-router";
import { SessionRoom } from "@/components/SessionRoom";
import { isValidCode } from "@/lib/protocol";

export const Route = createFileRoute("/session/$code")({
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
	return <SessionRoom code={code} />;
}
