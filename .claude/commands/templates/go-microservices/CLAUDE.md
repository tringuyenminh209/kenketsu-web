# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [DESCRIPTION]. Target: Japanese market.

## Repository Structure

```
project/
├── services/                       # Go microservices
│   ├── api-gateway/                # Public REST API gateway
│   │   ├── cmd/main.go
│   │   ├── internal/
│   │   │   ├── config/config.go    # Env config (envconfig)
│   │   │   ├── handler/            # HTTP handlers (Echo)
│   │   │   ├── middleware/         # Auth, CORS, rate-limit, tracing
│   │   │   ├── dto/               # Request/Response DTOs
│   │   │   └── client/            # gRPC clients to internal services
│   │   ├── Dockerfile
│   │   └── go.mod
│   ├── [domain]-svc/               # Domain microservice
│   │   ├── cmd/main.go
│   │   ├── internal/
│   │   │   ├── config/
│   │   │   ├── domain/            # Business logic + models
│   │   │   ├── repository/        # Database access (sqlc/GORM)
│   │   │   ├── grpc/              # gRPC server implementation
│   │   │   └── worker/            # Background workers (if needed)
│   │   ├── Dockerfile
│   │   └── go.mod
│   └── [worker]-svc/               # Worker/processor service
├── apps/
│   ├── web/                        # React + Vite web dashboard
│   │   ├── src/
│   │   └── package.json
│   └── mobile/                     # React + Vite mobile PWA (or Flutter)
├── packages/
│   └── api-client/                 # Shared TypeScript API client
│       ├── src/
│       │   ├── client.ts           # Grouped API namespaces
│       │   ├── types.ts            # Shared types
│       │   └── ws-client.ts        # WebSocket client
│       └── package.json
├── proto/                          # Protobuf definitions (gRPC)
│   └── [service].proto
├── migrations/
│   └── init/                       # SQL schema files
├── infra/
│   ├── grafana/                    # Dashboard JSON
│   └── mosquitto/                  # MQTT config (if IoT)
├── docker-compose.yml
├── Makefile                        # All dev commands
└── CLAUDE.md
```

## Development Commands

```makefile
# Full stack
make dev              # Build + start all services + infra
make up               # Start without rebuild
make down             # Stop all
make logs             # Tail all logs
make logs s=api-gateway  # Tail specific service

# Database
make migrate          # Run SQL migrations
make migrate-down     # Rollback
make seed             # Seed dev data

# Frontend
make web              # Web dashboard dev server
make mobile           # Mobile app dev server
make install          # npm install for all apps

# Go
make test             # go test ./... for all services
make build            # Build all Go binaries
make lint             # golangci-lint

# Setup
cp .env.example .env
make gen-keys         # Generate JWT RS256 keys
make dev              # First run
```

## Architecture

### Communication Pattern
- **External → api-gateway**: REST (HTTPS)
- **api-gateway → services**: gRPC (internal)
- **services → services**: gRPC or message queue
- **Real-time → clients**: WebSocket

### Go Service Pattern
Each service follows:
```
cmd/main.go           # Wire up config → server → graceful shutdown
internal/
  config/             # Struct with envconfig tags
  domain/             # Pure business logic (no framework deps)
  repository/         # Database interface + implementation
  handler/ or grpc/   # Transport layer (HTTP or gRPC)
  worker/             # Background processing (optional)
```

### Infrastructure (Docker Compose)
| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL 16 | 5432 | Primary database |
| Redis 7 | 6379 | Cache, queues, pub/sub |
| [Optional] TimescaleDB | — | Time-series data |
| [Optional] Mosquitto | 1883 | MQTT for IoT |
| [Optional] MinIO | 9000/9090 | S3-compatible storage |
| [Optional] Jaeger | 16686 | Distributed tracing |

### Auth
- JWT RS256 (asymmetric) via api-gateway
- Access token: 15min, Refresh token: 7 days
- Keys in `secrets/` directory (gitignored)

### API Design (api-gateway)
```
GET    /api/v1/[resource]          # List (paginated)
POST   /api/v1/[resource]          # Create
GET    /api/v1/[resource]/:id      # Get
PATCH  /api/v1/[resource]/:id      # Update
DELETE /api/v1/[resource]/:id      # Delete
```

Response: `{ "success": true, "data": {...} }` / `{ "success": false, "error": {...} }`

## Key Conventions

- Each service has its own `go.mod` — independent deployability
- Config via environment variables (12-factor)
- Structured logging with `slog`
- OpenTelemetry for tracing
- Health check: `GET /health` on every service
- Graceful shutdown: catch SIGTERM, drain connections
- Database: sqlc for type-safe queries (or GORM for rapid dev)

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname?sslmode=disable

# Auth
JWT_PRIVATE_KEY_PATH=secrets/private.pem
JWT_PUBLIC_KEY_PATH=secrets/public.pem

# Services (internal)
[DOMAIN]_SVC_ADDR=localhost:50051

# External
REDIS_URL=redis://localhost:6379
```
