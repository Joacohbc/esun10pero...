// Algoritmo de barajado Fisher-Yates — portado del generador original.
// Muta el array recibido y lo devuelve por conveniencia.
export function shuffle<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
