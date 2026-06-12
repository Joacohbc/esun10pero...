/**
 * Genera nombres por defecto divertidos para quien no elige uno:
 * un género científico de paloma (poco común) + un tipo de pan.
 * Ej. "Goura Focaccia", "Otidiphaps Croissant".
 */

// Géneros científicos reales de palomas y tórtolas (Columbidae), priorizando
// los poco comunes para que el nombre suene exótico.
const PIGEON_GENERA = [
	"Columba",
	"Patagioenas",
	"Streptopelia",
	"Spilopelia",
	"Zenaida",
	"Geopelia",
	"Geotrygon",
	"Leptotila",
	"Claravis",
	"Columbina",
	"Metriopelia",
	"Ptilinopus",
	"Ducula",
	"Treron",
	"Goura",
	"Caloenas",
	"Otidiphaps",
	"Gymnophaps",
	"Hemiphaga",
	"Lopholaimus",
	"Macropygia",
	"Phapitreron",
	"Chalcophaps",
	"Ocyphaps",
	"Geophaps",
	"Petrophassa",
	"Phaps",
];

// Tipos de pan de distintas partes del mundo (de una sola palabra).
const BREADS = [
	"Baguette",
	"Focaccia",
	"Ciabatta",
	"Chapata",
	"Croissant",
	"Brioche",
	"Bagel",
	"Pretzel",
	"Marraqueta",
	"Bolillo",
	"Telera",
	"Bollo",
	"Hogaza",
	"Pita",
	"Naan",
	"Bao",
	"Challah",
	"Concha",
	"Medialuna",
	"Roscón",
];

function pick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

/** Devuelve un nombre por defecto del estilo "Goura Focaccia". */
export function randomPigeonName(): string {
	return `${pick(PIGEON_GENERA)} ${pick(BREADS)}`;
}
