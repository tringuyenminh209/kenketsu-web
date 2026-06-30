# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [DESCRIPTION]. Target: Japanese market.

## Repository Structure

```
project/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Public auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/            # Protected pages
│   │   │   ├── layout.tsx          # Sidebar + TopBar wrapper
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   └── [feature]/page.tsx  # Feature pages
│   │   ├── api/                    # API Route Handlers
│   │   │   └── v1/
│   │   │       ├── auth/route.ts
│   │   │       └── [resource]/route.ts
│   │   ├── layout.tsx              # Root layout (fonts, providers)
│   │   └── globals.css             # Tailwind + theme variables
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives (don't modify)
│   │   ├── layout/                 # Sidebar, TopBar, Footer
│   │   └── [feature]/              # Feature-specific components
│   ├── lib/
│   │   ├── api-client.ts           # Server-side fetch wrapper
│   │   ├── auth.ts                 # Auth utilities (JWT/session)
│   │   ├── db.ts                   # Database client (Drizzle/Prisma)
│   │   ├── utils.ts                # cn() helper
│   │   └── validations.ts          # Zod schemas
│   ├── hooks/                      # Custom React hooks
│   ├── stores/                     # Zustand stores
│   └── types/                      # TypeScript type definitions
├── drizzle/                        # Drizzle ORM migrations
│   ├── schema.ts
│   └── migrations/
├── public/                         # Static assets
├── docker-compose.yml              # PostgreSQL + Redis for local dev
├── drizzle.config.ts
├── tailwind.config.ts
├── next.config.ts
└── CLAUDE.md
```

## Development Commands

```bash
npm install                         # Install dependencies
npm run dev                         # Next.js dev server (localhost:3000)
npm run build                       # Production build
npm run db:generate                 # Generate Drizzle migrations
npm run db:migrate                  # Run migrations
npm run db:studio                   # Drizzle Studio
npm run db:seed                     # Seed development data
docker compose up -d                # Start PostgreSQL + Redis
```

## Architecture

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (strict)
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS 4
- **State**: Zustand (client) + TanStack Query (server state)
- **Forms**: react-hook-form + Zod
- **Database**: PostgreSQL 16 via Drizzle ORM
- **Auth**: [JWT / NextAuth.js / Clerk] — describe strategy here
- **Path alias**: `@` → `./src`

## API Design

All API routes under `/api/v1/`:

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/register` | Register |
| GET | `/api/v1/[resource]` | List (paginated) |
| POST | `/api/v1/[resource]` | Create |
| GET | `/api/v1/[resource]/[id]` | Get by ID |
| PATCH | `/api/v1/[resource]/[id]` | Update |
| DELETE | `/api/v1/[resource]/[id]` | Delete |

Response envelope:
```json
{ "success": true, "data": {...}, "meta": { "page": 1, "total": 100 } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

## Key Libraries

- **UI**: Radix UI + shadcn/ui + Tailwind CSS 4 + lucide-react (icons)
- **Charts**: Recharts
- **Animation**: Motion (framer-motion successor)
- **Date**: dayjs (with ja locale)
- **i18n**: next-intl or react-i18next

## Conventions

- All pages use `"use client"` only when hooks/state are needed
- `cn()` utility from `@/lib/utils` for Tailwind class merging
- Sidebar highlights active route via `usePathname()`
- Japanese fields: always pair `name` + `name_kana` (furigana)
- Currency: JPY as integer, format with `toLocaleString('ja-JP')`
- Dates: store UTC, display JST via dayjs

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Seed Data

- admin@example.com / password123 (admin)
- user@example.com / password123 (user)
