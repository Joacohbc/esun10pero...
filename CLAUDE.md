# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Desarrollo local con solo Next.js (sin Cloudflare, más rápido)
pnpm dev:next

# Desarrollo completo con Cloudflare Workers (compila primero, luego wrangler dev)
pnpm dev

# Build de producción
pnpm build

# Deploy a Cloudflare
pnpm deploy
```

No hay tests automatizados. La verificación es manual via `pnpm dev:next`.

## Arquitectura

**Next.js 16 desplegado en Cloudflare Workers** via `@opennextjs/cloudflare`. El estado del juego en tiempo real lo maneja un **Cloudflare Durable Object**.

### Flujo de requests

```
Browser
  └─ /api/ws/<CODE>  →  worker.ts  →  PokerSessionDO (Durable Object, binding POKER_SESSION)
  └─ todo lo demás   →  worker.ts  →  Next.js handler (OpenNext)
```

### Estado del juego

Todo el estado vive en **`PokerSessionDO`** (`src/durable-objects/PokerSessionDO.ts`). Los clientes se conectan por WebSocket y reciben un `PublicGameState` serializado en cada acción. Usa la API de WebSocket hibernation de Cloudflare (el runtime mantiene los sockets, no el objeto en memoria).

En el cliente, **`useSession`** (`src/hooks/useSession.ts`) gestiona el WebSocket, la reconexión (backoff 1.5s) y expone el último `PublicGameState`.

### Identidad del jugador

Persistida en localStorage via `src/lib/identity.ts`. Contiene `playerId` (UUID estable) y `name`. El `playerId` se usa para reconectar a la misma sesión sin perder el rol.

### Tipos del protocolo

Todos los shapes cliente↔servidor están en `src/lib/protocol.ts`:
- `ClientMessage` — acciones que envía el browser al DO
- `ServerMessage` — respuestas del DO (state, error, event efímero)
- `PublicGameState` — snapshot completo pero filtrado (la carta viaja como `null` para el migajero en fase "playing")

### Fases del juego

```
lobby → playing → revealed → selecting → playing → ...
```

- `lobby`: sin carta, esperando voluntario ("migajero" = jugador oculto)
- `playing`: carta sacada, el migajero no la ve
- `revealed`: carta revelada, migajero envía rating, resto vota al próximo migajero
- `selecting`: transición mientras se resuelven votos

### Lógica de cartas

- `src/lib/cards.ts` — tipos y definiciones de las 52 cartas
- `src/lib/deck.ts` — construcción del mazo con exclusiones y modo simple (A-10)
- `src/lib/shuffle.ts` — Fisher-Yates

### Styling

Tailwind CSS v4 (`@import "tailwindcss"` en `globals.css`). Tema oscuro: fondos `neutral-950`, texto `neutral-100`. Clases custom en `globals.css` para la animación 3D de la carta (`.perspective-1000`, `.preserve-3d`, `.backface-hidden`, `.rotate-y-180`).

### Nota sobre el Durable Object

No renombrar la clase `PokerSessionDO` ni el binding `POKER_SESSION` en `wrangler.jsonc` sin planificar una migración manual — los DOs tienen estado persistido atado al nombre de clase en Cloudflare.
