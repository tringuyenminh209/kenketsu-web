# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [DESCRIPTION]. Target: Japanese market.

Lightweight stack: Hono.js backend + React/Vite frontend + Supabase (PostgreSQL).
Best for: rapid MVPs, small-medium apps, serverless deployment.

## Repository Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── index.ts                # Hono app entry (CORS, headers, rate-limit)
│   │   ├── middleware/
│   │   │   ├── auth.ts             # requireAuth (cookie or Bearer)
│   │   │   └── rate-limit.ts       # In-memory sliding window
│   │   ├── routes/
│   │   │   ├── auth.ts             # register, login, logout
│   │   │   ├── [resource].ts       # CRUD routes per resource
│   │   │   └── index.ts            # Route aggregator
│   │   ├── db/
│   │   │   ├── index.ts            # Supabase JS client (or Drizzle)
│   │   │   ├── schema.ts           # Drizzle schema (source of truth)
│   │   │   └── migrations/         # SQL migration files
│   │   └── lib/
│   │       ├── errors.ts           # Custom error classes
│   │       └── validators.ts       # Zod schemas
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx             # Main app (Router or state machine)
│   │   │   └── components/
│   │   │       ├── ui/             # shadcn/ui primitives
│   │   │       └── [feature]/      # Feature components
│   │   ├── lib/
│   │   │   ├── api.ts              # Typed fetch client
│   │   │   └── utils.ts            # cn() helper
│   │   ├── hooks/
│   │   ├── stores/                 # Zustand (if needed)
│   │   ├── locales/                # ja.json, vi.json
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
├── scripts/                        # Seed scripts, data extraction
├── docker-compose.yml              # PostgreSQL for local dev (optional if using Supabase cloud)
└── CLAUDE.md
```

## Development Commands

### Backend
```bash
cd backend
npm install
npm run dev                         # tsx watch (localhost:3000)
npm run build                       # tsc → dist/
npm run db:generate                 # drizzle-kit generate
npm run db:studio                   # Drizzle Studio
npx tsx src/db/seed.ts              # Seed data
```

### Frontend
```bash
cd frontend
npm install
npm run dev                         # Vite (localhost:5173)
npm run build
```

## Architecture

### Backend
- **Framework**: Hono.js on Node.js (@hono/node-server)
- **Database**: Supabase (PostgreSQL) via @supabase/supabase-js or Drizzle ORM
- **Auth**: Cookie-based session or JWT
- **Validation**: Zod schemas
- **Rate limiting**: In-memory sliding window (→ Redis for horizontal scale)

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **State**: useState/useContext for simple apps, Zustand for complex
- **Navigation**: React Router v7 or useState screen machine (for mobile-like UX)
- **i18n**: custom useTranslation hook or react-i18next

### Route Pattern
```typescript
// backend/src/routes/[resource].ts
const app = new Hono()
  .get('/', requireAuth, async (c) => { /* list */ })
  .post('/', requireAuth, async (c) => { /* create */ })
  .get('/:id', requireAuth, async (c) => { /* get */ })
  .patch('/:id', requireAuth, async (c) => { /* update */ })
  .delete('/:id', requireAuth, async (c) => { /* delete */ })
export default app
```

### Response Envelope
```json
{ "success": true, "data": {...} }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

## Environment Variables

```
# Backend
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_...
SESSION_SECRET=...
PORT=3000
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000
```

## Key Conventions

- Supabase JS client for DB access (if direct postgres DNS is blocked)
- Drizzle schema as source of truth (even if not used at runtime)
- Migrations applied via Supabase SQL Editor
- Seed scripts use REST API, not direct postgres
- All monetary values as INTEGER (JPY, no decimals)
