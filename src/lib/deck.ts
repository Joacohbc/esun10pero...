import { MASTER_DECK, type CardId } from "./cards";
import { shuffle } from "./shuffle";

/**
 * Construye un mazo barajado respetando las cartas excluidas.
 * Equivalente a `initializeDeck` / `syncDeckWithExclusions` del original.
 * Devuelve la lista de IDs (el servidor saca con `pop()`).
 */
export function buildDeck(excludedIds: Iterable<CardId> = []): CardId[] {
	const excluded = new Set(excludedIds);
	const ids = MASTER_DECK.filter((card) => !excluded.has(card.id)).map((card) => card.id);
	return shuffle(ids);
}
