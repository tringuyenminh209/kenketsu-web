# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

<!-- Mô tả ngắn 1-2 câu: dự án này là gì, cho ai dùng -->
**[Tên dự án]** — [Mô tả]. Target: Japanese market.

## Repository Structure

<!-- Cấu trúc thư mục chính -->
```
project/
├── frontend/     # [Framework] frontend
├── backend/      # [Framework] backend API
├── docs/         # Documentation
└── docker-compose.yml
```

## Development Commands

### Setup
```bash
# First time setup
cp .env.example .env
docker compose up -d
# [thêm migration/seed commands]
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:[PORT]
npm run build
```

### Backend
```bash
# [Commands tùy theo framework: Go/Laravel/Node]
```

### Testing
```bash
# [Test commands]
```

## Architecture

### Frontend
- **Framework**: [Next.js 15 / React + Vite / Flutter]
- **UI**: shadcn/ui + Tailwind CSS
- **State**: [Zustand / Context / Provider]
- **Data fetching**: [TanStack Query / SWR]
- **Routing**: [App Router / React Router / go_router]

### Backend
- **Framework**: [Go Echo / Laravel / Hono / FastAPI]
- **Database**: [PostgreSQL / MySQL] + [ORM: Drizzle / Eloquent / GORM]
- **Auth**: [JWT / Sanctum] — [chi tiết token strategy]
- **API prefix**: `/api/v1/`

### API Routes

| Prefix | Auth | Purpose |
|--------|------|---------|
| `/api/v1/auth/*` | public | Login, register, refresh |
| `/api/v1/[resource]/*` | required | [Mô tả] |

### Infrastructure (Docker)
- [DB service]: port [PORT]
- [Cache/Queue]: port [PORT]
- [Other services]

## Key Conventions

<!-- Quy tắc đặc biệt của dự án này -->
- [Convention 1]
- [Convention 2]
- [Convention 3]

## Known Issues / Warnings

<!-- Những thứ cần tránh hoặc lưu ý -->
- [Issue 1]

## Seed Data / Test Accounts

<!-- Tài khoản test nếu có -->
- admin@example.com / password123 (admin)
- user@example.com / password123 (user)
