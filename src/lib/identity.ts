// Identidad ligera del jugador, persistida en localStorage.
// No es autenticación: solo un id estable para reconectar y un nombre.

export interface Identity {
	playerId: string;
	name: string;
}

const KEY = "poker-identity";

function randomId(): string {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Devuelve la identidad guardada o crea una nueva (con nombre vacío). */
export function getIdentity(): Identity {
	if (typeof window === "undefined") return { playerId: "", name: "" };
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Identity;
			if (parsed.playerId) return parsed;
		}
	} catch {
		// ignorar storage corrupto
	}
	const fresh: Identity = { playerId: randomId(), name: "" };
	saveIdentity(fresh);
	return fresh;
}

export function saveIdentity(identity: Identity): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, JSON.stringify(identity));
	} catch {
		// ignorar
	}
}

export function setName(name: string): Identity {
	const id = getIdentity();
	const updated = { ...id, name };
	saveIdentity(updated);
	return updated;
}
