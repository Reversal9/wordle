# Definitely Not Wordle

A daily 5-letter word puzzle. Not that one. This one.

## Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui
- **Backend**: Node.js / Express
- **State**: `useReducer` + Context (pure reducer, no external state library)

## Architecture

```
browser → Vite dev server → /api/* proxy → Express (port 3000)
                                           └── backend/data/words.json
```

The backend serves today's word deterministically by days since puzzle #1 (`2026-04-30`), cycling through a pre-generated list. All game logic lives in the frontend.

### State machine

`GameState` (in `src/types.ts`) flows through:

```
loading → playing → won | lost
                 ↘ error
```

Managed by a pure `gameReducer` in `src/hooks/gameReducer.ts`. `GameProvider` wraps it with side effects: API fetch, localStorage sync keyed by date (`dnw-YYYY-MM-DD`), and physical keyboard handling.

### Key invariants

- `computeFeedback` uses a 2-pass algorithm to prevent double-counting duplicate letters
- Valid-word lookup is an O(1) `Set<string>` built once at module load from `frontend/data/valid-wordle-words.txt`
- `@/` path alias resolves to `frontend/src/` in both Vite and TypeScript

## Running locally

Start the backend first, then the frontend dev server:

```bash
# Terminal 1 — backend (port 3000)
cd backend
node index.js

# Terminal 2 — frontend (port 5173, proxies /api/* to 3000)
cd frontend
npm run dev
```

Other frontend commands:

```bash
npm run build        # type-check + Vite build
npm run lint         # ESLint
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
```
