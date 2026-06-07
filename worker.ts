/**
 * Entry del Worker de Cloudflare.
 *
 * Envuelve el worker generado por OpenNext para:
 *  1. Exportar el Durable Object `PokerSessionDO` (y re-exportar los DO internos
 *     de OpenNext) desde el worker final.
 *  2. Interceptar las conexiones WebSocket en `/api/ws/<CODE>` y enrutarlas
 *     directamente al Durable Object, evitando el handler de Next (OpenNext no
 *     soporta WebSockets dentro de Next).
 *
 * `./.open-next/worker.js` lo genera `opennextjs-cloudflare build` antes de que
 * wrangler empaquete este archivo, por eso los imports se resuelven en build.
 */
// @ts-ignore - generado por OpenNext durante el build
import openNextWorker from "./.open-next/worker.js";

export { PokerSessionDO } from "./src/durable-objects/PokerSessionDO";
// @ts-ignore - re-export de los Durable Objects internos de OpenNext
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

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

		return openNextWorker.fetch(request, env, ctx);
	},
};
