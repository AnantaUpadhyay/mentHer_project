# mentHer

A mentorship workspace for women building businesses. React frontend, Node HTTP API, and a persistent SQLite database.

## Run locally

Use Node **22.13+** (tested on Node 26). From the repository root:

```sh
npm ci --prefix frontend
npm start
```

Open **http://localhost:3001**. The frontend proxies `/api` to **http://127.0.0.1:5000**. Both services run with one command. Stop with Ctrl+C.

No database installation or API keys are required. SQLite is built into supported Node versions; some versions print an experimental warning. Local data is stored in `backend/data/menther.sqlite`, which is ignored by Git. The old `docs/schema.sql` describes the initial MySQL concept; the running schema is created in `backend/server.js`.

Optional environment variables: `PORT` (API port, default 5000), `DB_PATH` (database file), `APP_ORIGIN` (browser origin, default `http://localhost:3001`), `FRONTEND_PORT` (frontend port). If changing the API port, update `frontend/package.json`'s proxy too. Set `APP_ORIGIN` when changing the browser origin. Do not commit local databases or real credentials.

## Try the complete journey

1. Sign up as a mentor. Fill in a bio and expertise to appear in the directory.
2. Log out, then sign up as an entrepreneur. Complete your business profile.
3. Find the mentor by name, industry, or expertise. Send a personal introduction.
4. Log in as the mentor and accept the request.
5. Both accounts can now exchange messages. Conversations refresh every eight seconds while open.
6. Explore official resources and bookmark useful ones. Bookmarks and profiles survive restarts.

There are no fabricated members, testimonials, funding awards, ratings or demo credentials. A fresh database has an empty mentor directory.

## Checks

```sh
npm test
npm run build
```

Tests cover the mentorship journey, private messages, role checks, cross-origin writes, account errors, logout, bookmark isolation, signup UI and the homepage FAQ.

## Current boundaries

This is a working local MVP, not a launch-ready public service. Before public deployment: add email verification and password recovery; mentor review and reporting/blocking; privacy/retention controls and account deletion; abuse controls across all write routes; pagination; backups and monitoring. Serve the built frontend and API behind the same HTTPS origin and configure `APP_ORIGIN` and `NODE_ENV=production` for Secure session cookies. Do not deploy the development server.

No admin credentials, verification badges, scheduling, video calls, payments, public community feed or AI matching are included. Industry prioritisation is explicit, with no hidden match score. Funding resources link to providers; eligibility and application windows must be checked there.

See [design and product audit](docs/PRODUCT_AUDIT.md) for findings, decisions and next steps.

## Vercel and Neon

Production runs the full API through `api/index.js` and persists accounts, profiles, mentorship requests, messages and bookmarks in Neon Postgres. Vercel supplies `DATABASE_URL`; `APP_ORIGIN` must match the production website for authenticated writes. Cookies use Secure, HttpOnly and SameSite=Lax in production. Local development continues to use SQLite unless `DATABASE_URL` is set.

After connecting Neon and pulling environment variables with Vercel CLI:

```sh
npm ci --prefix backend
node --env-file=.env.local backend/migrate.js
node --env-file=.env.local backend/test-neon.js
```

The migration creates missing tables without deleting existing records. The Neon integration test creates uniquely prefixed tables, exercises the real API against Postgres, and removes only those test tables afterward. Do not commit `.env.local`, database credentials, or local SQLite files. Production schema changes run explicitly before deployment, not inside user requests.
