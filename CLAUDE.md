# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Definitely Not Wordle" — a fullstack daily word game. Node/Express backend serves today's word; React/TypeScript frontend handles all game logic.

## Commands

### Frontend (run from `frontend/`)
```bash
npm run dev          # Vite dev server (port 5173, proxies /api/* to port 3000)
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
```

Run a single test file:
```bash
npx vitest run src/lib/feedback.test.ts
```

### Backend (run from `backend/`)
```bash
node index.js        # Express server on port 3000 (default)
PORT=4000 node index.js
```

For local development, start backend first, then frontend dev server.

## Architecture

### Data flow

**Development:**
```
browser → Vite dev server → /api/* proxy → Express (port 3000)
                                           └── backend/data/words.json
```

**Production (Render — two services):**
```
browser → Render Static Site (frontend/dist, CDN)
             └── fetch(VITE_API_URL + '/api/word') → Render Web Service (Express)
```

The frontend fetches `${VITE_API_URL}/api/word?date=YYYY-MM-DD`. `VITE_API_URL` is inlined at build time by Vite — set it as an env var on the Render Static Site. When undefined (local dev), it falls back to `''` so the Vite proxy still handles `/api/*` transparently. The backend picks the word deterministically by days since `2026-04-30` (puzzle #1), cycling through the pre-generated word list.

**Render deploy settings:**
- Backend Web Service: root `backend`, build `npm ci`, start `node index.js`, env `FRONTEND_ORIGIN=<static-site-url>`
- Frontend Static Site: root `frontend`, build `npm ci && npm run build`, publish `dist`, env `VITE_API_URL=<backend-url>`

### State machine

All game state lives in a single `GameState` (defined in `src/types.ts`) managed by `useReducer` in `GameProvider` (`src/hooks/useGame.tsx`). Components call `useGame()` and are purely presentational — they never hold local game state.

Status lifecycle: `loading` → `playing` → `won | lost` (or `error` on fetch failure).

The `gameReducer` (`src/hooks/gameReducer.ts`) is a pure function that handles all transitions. `useGame.tsx` wraps it with side effects: fetch on mount, localStorage sync after every guess, physical keyboard listener, keyboard color derivation, and reveal animation gating.

### Key invariants

- `computeFeedback` (`src/lib/feedback.ts`) uses a 2-pass algorithm: Pass 1 marks exact matches (G) and nulls out their pool slots; Pass 2 scans remaining letters for misplaced matches (Y). The pool prevents double-counting duplicate letters.
- `validWords` (`src/lib/words.ts`) is a `Set<string>` built at module load from `frontend/data/valid-wordle-words.txt` via Vite's `?raw` import. Guesses are rejected before dispatch if not in this set.
- localStorage is keyed `dnw-YYYY-MM-DD`, so different dates never collide. State is loaded after `LOAD_SUCCESS` so the word is always set before history is restored.
- `LetterFeedback = 'G' | 'Y' | 'X'` is the single source of truth for tile color; CSS variables (`--color-correct`, `--color-present`, `--color-absent`) map to the visual colors in `index.css`. In dark mode `--color-absent` is overridden to `#4a4a4c` (deepslate) so exhausted tiles are visually distinct from empty ones.
- `isRevealing` in `GameState` gates all input (typing, deleting, submitting) for 900ms after each guess — the duration of the full tile-flip sequence (`4 × 100ms stagger + 500ms flip`). `SUBMIT_GUESS` sets it; `REVEAL_DONE` clears it. The game-over modal is opened by a `useEffect` in `useGame.tsx` after `REVEAL_DONE`, not synchronously in the reducer.

### TypeScript constraints

`verbatimModuleSyntax` is enabled. Type-only imports **must** use `import type { ... }` or the inline form `import { value, type OnlyType }`. Mixing value and type imports in the same statement requires the inline form.

### React Compiler

`babel-plugin-react-compiler` is configured. **Do not add `useMemo` or `useCallback`** — the compiler handles memoization automatically and manual additions may conflict.

### Path alias

`@/` resolves to `frontend/src/`. Configured in both `vite.config.ts` (runtime) and `tsconfig.app.json` (type checking).

### shadcn/ui

Components live in `src/components/ui/`. Add new components with `npx shadcn add <component>`. The project uses the `base-vega` style. Only `dialog`, `button`, and `sonner` are currently used by the game — the rest were bulk-installed.

**Important:** This project uses `@base-ui/react` primitives (not Radix UI). Key differences:
- No `asChild` prop — use the `render` prop pattern or style the primitive directly via `className`.
- Modal/dropdown animations are done via `data-open:` and `data-closed:` Tailwind variants (from `tw-animate-css`), not component props. Example: `data-open:slide-in-from-bottom-4`.
- All shadcn semantic tokens (`--popover`, `--popover-foreground`, `--background`, etc.) are fully defined in `index.css` under `:root` and `.dark`. Use Tailwind semantic classes (`bg-popover`, `bg-background`, etc.) freely.

### Dark mode

`ThemeProvider` lives in `main.tsx` (not `App.tsx`) so `useTheme()` works inside the `Toaster`. It adds a `dark` class to `<html>`. Theme defaults to system preference; the sun/moon button in `Header` toggles between light and dark directly.

**FOUC prevention**: `index.html` contains a blocking inline `<script>` in `<head>` that reads localStorage and sets both the `dark` class and a raw `style.background` on `<html>` before any CSS or JS loads. The hardcoded hex values (`#121213` dark, `#fffdf8` light) must stay in sync with `--background` in `index.css`.

All elements share a `0.2s ease` transition on `background-color`, `border-color`, and `color` via a global `*` rule in `index.css`, so theme switches are synchronised. `.tile-flip` does **not** set `transition: none` — CSS animations suppress transitions on the properties they control per spec, so the flip works correctly without it. Tiles carry an explicit `transition-colors duration-200` class rather than relying solely on the global rule.

## Keep-alive

`scripts/keep-alive.sh` pings the backend `/api/word` endpoint to prevent Render's free tier from spinning down. Reads the URL from `BACKEND_URL` env var. Run on a cron schedule every 10 minutes:

```bash
*/10 * * * * BACKEND_URL=https://your-backend.onrender.com/api/word /path/to/scripts/keep-alive.sh >> /tmp/wordle-keepalive.log 2>&1
```

## Word lists

- `backend/data/words.json` — pre-generated daily puzzle words (ordered, deterministic by date)
- `frontend/data/valid-wordle-words.txt` — full valid-guess dictionary (14,855 words, one per line)
