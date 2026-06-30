# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [DESCRIPTION]. Target: Japanese market.

Stack: Laravel 12 (PHP 8.3) backend + React/Vite (TypeScript) frontend, Docker deployment.

## Repository Structure

```
project/
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # Feature components
│   │   │   │   ├── [feature]/      # Feature-specific
│   │   │   │   └── ui/             # shadcn/ui primitives
│   │   │   ├── pages/              # Route page components
│   │   │   └── routes.tsx          # React Router v7 config
│   │   ├── lib/
│   │   │   ├── api.ts              # Fetch client + interceptors
│   │   │   └── utils.ts            # cn() helper
│   │   ├── hooks/                  # Custom hooks
│   │   ├── stores/                 # Zustand stores
│   │   ├── locales/                # i18n (ja.json, vi.json)
│   │   └── main.tsx                # Entry point
│   ├── vite.config.ts              # Proxy /api → backend
│   └── package.json
├── backend/                        # Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/ # API controllers
│   │   │   ├── Middleware/          # Custom middleware
│   │   │   ├── Requests/           # Form request validation
│   │   │   └── Responses/          # ApiResponse helper
│   │   ├── Models/                 # Eloquent models
│   │   └── Services/               # Business logic
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/api.php              # All API routes
│   └── tests/Feature/              # Feature tests
├── docker/                         # Dockerfiles, nginx configs
├── docker-compose.yml              # MySQL + Redis + app
└── CLAUDE.md
```

## Development Commands

### Frontend
```bash
cd frontend
npm install
npm run dev                         # Vite dev (localhost:5173, proxies /api → backend)
npm run build
```

### Backend
```bash
cd backend
composer install
cp .env.example .env && php artisan key:generate
docker compose up -d                # MySQL + Redis
php artisan migrate --seed
php artisan serve                   # localhost:8000
php artisan test
php artisan test --filter TestName
./vendor/bin/pint                   # PHP code style
```

## Architecture

### Backend
- **Framework**: Laravel 12 (API-only mode)
- **Auth**: Sanctum Bearer Token (stateless, not session)
- **Database**: MySQL 8 via Eloquent ORM
- **API prefix**: `/api/v1/`
- **Queue**: Redis + Laravel Queue (for async jobs)
- **Response**: `ApiResponse::success($data)` / `ApiResponse::error($code, $message)`

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Routing**: React Router v7
- **State**: Zustand (auth, UI) + TanStack Query (server)
- **Forms**: react-hook-form + Zod
- **i18n**: react-i18next (ja + vi)

### API Routes

```php
// routes/api.php — all prefixed /api/v1/
Route::prefix('v1')->group(function () {
    // Public
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/register', [AuthController::class, 'register']);

    // Protected
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::apiResource('[resource]', ResourceController::class);
    });

    // Admin only
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::apiResource('[resource]', Admin\ResourceController::class);
    });
});
```

### Response Envelope
```json
{ "success": true, "data": {...}, "message": "OK", "meta": {...} }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

## Key Conventions

- Controllers: thin, delegate to Services
- Validation: always use Form Request classes
- Models: use `$casts`, `$fillable`, relationships, scopes
- Tests: use `RefreshDatabase`, test against real MySQL (not SQLite)
- Middleware: `EnsureIsAdmin` alias `admin`, per-route not global
- WebSocket: Laravel Echo + Soketi (optional, for real-time features)

## Environment Variables

```
# Backend (.env)
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=app_dev
DB_USERNAME=root
DB_PASSWORD=secret
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Frontend (.env)
VITE_API_URL=http://localhost:8000
```

## Seed Data

- admin@example.com / password123 (admin)
- user@example.com / password123 (user)
