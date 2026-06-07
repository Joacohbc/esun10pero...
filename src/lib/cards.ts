// Estructuras de datos de naipes — portado del generador original.

export interface Suit {
	name: "spades" | "hearts" | "diamonds" | "clubs";
	symbol: string;
	/** Clase Tailwind del color de la cara */
	color: string;
	isRed: boolean;
}

export type CardId = string; // `${value}-${suitName}`, ej. "A-spades"

export interface Card {
	id: CardId;
	value: string;
	suit: Suit;
}

export const SUITS: Suit[] = [
	{ name: "spades", symbol: "♠", color: "text-neutral-900", isRed: false },
	{ name: "hearts", symbol: "♥", color: "text-red-500", isRed: true },
	{ name: "diamonds", symbol: "♦", color: "text-red-500", isRed: true },
	{ name: "clubs", symbol: "♣", color: "text-neutral-900", isRed: false },
];

export const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const TOTAL_CARDS = SUITS.length * VALUES.length; // 52

/** Mazo maestro estático: referencia de las 52 cartas. */
export const MASTER_DECK: Card[] = SUITS.flatMap((suit) =>
	VALUES.map((value) => ({
		id: `${value}-${suit.name}` as CardId,
		value,
		suit,
	})),
);

const CARD_BY_ID = new Map<CardId, Card>(MASTER_DECK.map((c) => [c.id, c]));

export function getCard(id: CardId): Card | undefined {
	return CARD_BY_ID.get(id);
}

/** Nombre del palo en español, para la UI del visor. */
export function suitNameEs(suit: Suit): string {
	switch (suit.name) {
		case "spades":
			return "Picas";
		case "hearts":
			return "Corazones";
		case "diamonds":
			return "Diamantes";
		case "clubs":
			return "Tréboles";
	}
}
