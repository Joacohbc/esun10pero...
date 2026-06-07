import { notFound } from "next/navigation";
import { SessionRoom } from "@/components/SessionRoom";
import { isValidCode } from "@/lib/protocol";

export default async function SessionPage({ params }: { params: Promise<{ code: string }> }) {
	const { code } = await params;
	const normalized = decodeURIComponent(code).toUpperCase();
	if (!isValidCode(normalized)) notFound();
	return <SessionRoom code={normalized} />;
}
