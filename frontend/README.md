# Fav Movies App — Frontend

A React + TypeScript + Vite frontend for the Fav Movies App. It connects to the backend API for authentication and favorites management.

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn (examples below use npm)

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

- Copy `.env.example` to `.env`
- Set `VITE_API_URL` to your backend URL

```bash
cp .env.example .env
# edit .env
VITE_API_URL=http://localhost:3232
```

Note: The example uses port 3232 to match the current repo `.env`. If your backend runs on 4000, set `VITE_API_URL=http://localhost:4000`.

## Scripts

- `npm run dev` — Start Vite dev server (default http://localhost:5173)
- `npm run build` — Type check and build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Project structure

- `src/` — React app source code
- `src/config/env.ts` — Reads `VITE_API_URL`

## How it works

- Reads API base URL from `import.meta.env.VITE_API_URL`
- Calls backend endpoints for auth and favorites
- CORS must allow the frontend origin (configure in backend)

## Troubleshooting

- Ensure backend CORS `CORS_ORIGIN` matches `http://localhost:5173`
- Ensure `VITE_API_URL` points to the running backend

