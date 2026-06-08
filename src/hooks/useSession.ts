"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientMessage, PublicGameState, ServerMessage } from "@/lib/protocol";

export type ConnectionStatus = "connecting" | "open" | "closed";

interface UseSessionOptions {
	code: string;
	playerId: string;
	name: string;
	color: string;
	/** Eventos efímeros del servidor para animación/sonido. */
	onEvent?: (event: "flip" | "shuffle" | "empty") => void;
}

interface UseSessionResult {
	state: PublicGameState | null;
	status: ConnectionStatus;
	error: string | null;
	send: (msg: ClientMessage) => void;
}

function wsUrl(code: string): string {
	const proto = window.location.protocol === "https:" ? "wss" : "ws";
	return `${proto}://${window.location.host}/api/ws/${encodeURIComponent(code)}`;
}

/**
 * Mantiene la conexión WebSocket con el Durable Object de la sala.
 * Reenvía `join` al abrir, reconecta con backoff y expone `send`.
 */
export function useSession({ code, playerId, name, color, onEvent }: UseSessionOptions): UseSessionResult {
	const [state, setState] = useState<PublicGameState | null>(null);
	const [status, setStatus] = useState<ConnectionStatus>("connecting");
	const [error, setError] = useState<string | null>(null);

	const wsRef = useRef<WebSocket | null>(null);
	const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const closedByUs = useRef(false);
	// Guardamos los datos de join en refs para no reconectar al cambiar el nombre.
	const joinRef = useRef({ playerId, name, color });
	const onEventRef = useRef(onEvent);
	joinRef.current = { playerId, name, color };
	onEventRef.current = onEvent;

	const send = useCallback((msg: ClientMessage) => {
		const ws = wsRef.current;
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(msg));
		}
	}, []);

	useEffect(() => {
		if (!code || !playerId) return;
		closedByUs.current = false;

		const connect = () => {
			setStatus("connecting");
			let ws: WebSocket;
			try {
				ws = new WebSocket(wsUrl(code));
			} catch {
				scheduleReconnect();
				return;
			}
			wsRef.current = ws;

			ws.onopen = () => {
				setStatus("open");
				setError(null);
				ws.send(JSON.stringify({ type: "join", playerId: joinRef.current.playerId, name: joinRef.current.name, color: joinRef.current.color } satisfies ClientMessage));
			};

			ws.onmessage = (ev) => {
				let msg: ServerMessage;
				try {
					msg = JSON.parse(ev.data as string);
				} catch {
					return;
				}
				if (msg.type === "state") setState(msg.state);
				else if (msg.type === "error") setError(msg.message);
				else if (msg.type === "event") onEventRef.current?.(msg.event);
			};

			ws.onclose = () => {
				setStatus("closed");
				if (!closedByUs.current) scheduleReconnect();
			};

			ws.onerror = () => {
				ws.close();
			};
		};

		const scheduleReconnect = () => {
			if (closedByUs.current) return;
			if (reconnectRef.current) clearTimeout(reconnectRef.current);
			reconnectRef.current = setTimeout(connect, 1500);
		};

		connect();

		return () => {
			closedByUs.current = true;
			if (reconnectRef.current) clearTimeout(reconnectRef.current);
			wsRef.current?.close();
			wsRef.current = null;
		};
		// Solo reconectar si cambia la sala o el jugador.

	}, [code, playerId]);

	return { state, status, error, send };
}
