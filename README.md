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

### UI notes

- **Dark mode**: defaults to system preference; the sun/moon button in the header toggles between light and dark. All elements transition in sync (`0.2s ease` on bg/border/color). A blocking inline `<script>` in `index.html` applies the saved theme class and background color before any CSS loads, preventing the flash-of-white on refresh.
- **Modals**: use `@base-ui/react/dialog` with `tw-animate-css` utilities — `data-open:slide-in-from-bottom-4` produces the slide-up entrance. No Radix `asChild` — use `render` prop or direct `className` styling instead.
- **Tile flip**: `--flip-color` CSS variable drives the mid-animation color switch at 50% (when the tile is edge-on and invisible to the user). CSS animations suppress transitions on the properties they control per spec, so `.tile-flip` does not need `transition: none`.

### Key invariants

- `computeFeedback` uses a 2-pass algorithm to prevent double-counting duplicate letters
- Valid-word lookup is an O(1) `Set<string>` built once at module load from `frontend/data/valid-wordle-words.txt`
- `@/` path alias resolves to `frontend/src/` in both Vite and TypeScript

## Deploying (Render)

Two separate Render services — a Static Site for the frontend and a Web Service for the backend.

### Backend — Web Service

| Field | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `npm ci` |
| **Start Command** | `node index.js` |
| **Env var** | `FRONTEND_ORIGIN=https://your-frontend.onrender.com` |

### Frontend — Static Site

| Field | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Build Command** | `npm ci && npm run build` |
| **Publish Directory** | `dist` |
| **Env var** | `VITE_API_URL=https://your-backend.onrender.com` |

Deploy the backend first to get its URL, then set `VITE_API_URL` before triggering the frontend build.

Render's free Web Service tier spins down after 15 min of inactivity (~30s cold start). Use `scripts/keep-alive.sh` to prevent this:

```bash
# run manually
BACKEND_URL=https://your-backend.onrender.com/api/word ./scripts/keep-alive.sh

# or add to crontab (every 10 minutes)
*/10 * * * * BACKEND_URL=https://your-backend.onrender.com/api/word /path/to/scripts/keep-alive.sh >> /tmp/wordle-keepalive.log 2>&1
```

Alternatively, point [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org) at `https://your-backend.onrender.com/api/word` every 5–10 minutes.

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
