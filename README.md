# Fav Movies App

A full-stack app to manage your favorite movies and TV shows.

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript + Sequelize (SQLite by default, MySQL optional)

## Repository structure

- `frontend/` — React app
- `server/` — Node/Express API

## Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)
- Optional: MySQL server (only if you switch DB from SQLite)

## Quick start

1) Backend

- Open `server/`
- Copy environment file

```bash
cp .env.example .env
# edit .env if needed
```

- Install and run

```bash
npm install
npm run dev
```

The API starts on `http://localhost:4000` by default (configurable via `PORT`). On first run, it will sync the database schema and seed a demo user and favorites.

2) Frontend

- Open `frontend/`
- Copy environment file

```bash
cp .env.example .env
# edit .env
# VITE_API_URL should point to the backend, e.g.
# VITE_API_URL=http://localhost:4000
```

- Install and run

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Environment variables

Frontend (`frontend/.env`):

- `VITE_API_URL` — Backend base URL (e.g. `http://localhost:4000`)

Backend (`server/.env`):

- Server
  - `PORT` (default `4000`)
  - `CORS_ORIGIN` (default `http://localhost:5173`)
  - `NODE_ENV` (default `development`)
- Auth
  - `JWT_SECRET` (set a strong secret)
  - `JWT_EXPIRES_IN` (e.g. `7d`)
- Password hashing / seeding
  - `PASSWORD_SALT` (default `10`)
  - `PBKDF2_ITERATIONS` (default `100000`)
  - `PBKDF2_KEYLEN` (default `64`)
  - `PBKDF2_DIGEST` (default `sha512`)
- Database selection
  - `DB_DIALECT` = `sqlite` (default) or `mysql`
- SQLite
  - `SQLITE_STORAGE` (default `database.sqlite`)
- MySQL
  - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`

See `.env.example` in both projects for full examples.

## Database schema and migrations

ORM: Sequelize. Tables are created/updated at runtime via `sequelize.sync({ alter: true })` — no separate migration files.

- `users`
  - `id` (int, PK)
  - `email` (string, unique)
  - `name` (string)
  - `passwordHash` (string)
  - `createdAt` (date)
- `favorites`
  - `id` (int, PK)
  - `userId` (int, FK -> users.id, cascade on delete)
  - `title` (string)
  - `type` (enum: `movie` | `tv`)
  - `director` (string, nullable)
  - `budget` (decimal, nullable)
  - `location` (string, nullable)
  - `durationMinutes` (int, nullable)
  - `year` (int, nullable)
  - `description` (text, nullable)
  - `rating` (float 0–10, nullable)
  - `createdAt`, `updatedAt` (date)

Associations:

- User hasMany Favorite (`userId`)
- Favorite belongsTo User

Switching to MySQL:

- Set `DB_DIALECT=mysql` and configure `MYSQL_*` variables
- Ensure the database exists and credentials are valid

## Seed data and demo credentials

On the first run, if no users exist, the backend seeds:

- Email: `user@gmail.com`
- Password: `User@123`

It also seeds a large set of sample favorites for the demo user.

## Common scripts

Frontend:

- `npm run dev` — Vite dev server
- `npm run build` — Build
- `npm run preview` — Preview build

Backend:

- `npm run dev` — Dev server (ts-node + nodemon)
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled server

## Notes

- Ensure `CORS_ORIGIN` on the backend matches the frontend URL
- Ensure `VITE_API_URL` in the frontend points to the backend URL
