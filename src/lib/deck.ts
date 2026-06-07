import { MASTER_DECK, SIMPLE_VALUES, type CardId } from "./cards";
import { shuffle } from "./shuffle";

/**
 * Construye un mazo barajado respetando las cartas excluidas.
 * Con simpleOnly=true solo incluye valores A-10 (escala de migajerismo 1-10).
 */
export function buildDeck(excludedIds: Iterable<CardId> = [], simpleOnly = false): CardId[] {
	const excluded = new Set(excludedIds);
	const simpleSet = new Set<string>(SIMPLE_VALUES);
	const ids = MASTER_DECK
		.filter((card) => !excluded.has(card.id) && (!simpleOnly || simpleSet.has(card.value)))
		.map((card) => card.id);
	return shuffle(ids);
}
