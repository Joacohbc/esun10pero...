import { DEFAULT_COLOR } from "@/components/PalomaSVG";

export interface Identity {
	playerId: string;
	name: string;
	color: string;
}

const KEY = "migajero-identity";

function randomId(): string {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getIdentity(): Identity {
	if (typeof window === "undefined") return { playerId: "", name: "", color: DEFAULT_COLOR };
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Identity;
			if (parsed.playerId) return { ...parsed, color: parsed.color ?? DEFAULT_COLOR };
		}
	} catch {
		// ignorar storage corrupto
	}
	const fresh: Identity = { playerId: randomId(), name: "", color: DEFAULT_COLOR };
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

export function setColor(color: string): Identity {
	const id = getIdentity();
	const updated = { ...id, color };
	saveIdentity(updated);
	return updated;
}
