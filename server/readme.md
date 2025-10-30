# Fav Movies App — Backend

Express + TypeScript + Sequelize backend API for authentication and favorites management.

## Prerequisites

- Node.js 18+
- SQLite (bundled) or MySQL (optional)

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

- Copy `.env.example` to `.env`
- Adjust values as needed (port, CORS, auth secrets, database)

```bash
cp .env.example .env
# then edit .env
```

Key variables:

- `PORT` default 4000
- `CORS_ORIGIN` frontend origin (default http://localhost:5173)
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- Password hashing: `PASSWORD_SALT`, `PBKDF2_*`
- Database selection via `DB_DIALECT` = `sqlite` (default) or `mysql`

## Database

Sequelize models: `User` and `Favorite` with associations (User hasMany Favorite).

- SQLite (default): uses file defined by `SQLITE_STORAGE` (default `database.sqlite`).
- MySQL (optional): set `DB_DIALECT=mysql` and configure `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.

Schema creation/migrations:

- On startup we run `sequelize.sync({ alter: true })` to create/update tables based on models. No separate migration files are used.

## Running

- Dev: `npm run dev` (ts-node + nodemon)
- Build: `npm run build`
- Start: `npm start`

Server listens on `http://localhost:PORT`.

## Seeding & Demo credentials

On first run, if there are no users, the server seeds a default user and a set of favorites.

- Email: `user@gmail.com`
- Password: `User@123`

PBKDF2 parameters and salt are configurable in `.env` and used for hashing.

## CORS & Frontend integration

- Ensure `CORS_ORIGIN` matches the frontend URL (default `http://localhost:5173`).
- Frontend uses `VITE_API_URL` to call this API.

## Health check

If you encounter DB connection issues:

- Verify `DB_DIALECT` and corresponding variables.
- For MySQL, ensure the database exists and credentials are correct.
