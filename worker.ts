import handler from "./dist/server/server.js";

export { PokerSessionDO } from "./src/durable-objects/PokerSessionDO";

export default {
	async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname.startsWith("/api/ws/")) {
			const code = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() ?? "");
			if (!code) return new Response("Falta el código de sala", { status: 400 });
			const id = env.POKER_SESSION.idFromName(code);
			const stub = env.POKER_SESSION.get(id);
			return stub.fetch(request);
		}

		return handler.fetch(request, env, ctx);
	},
};
