# Claude Code Templates

## Cấu trúc

```
templates/
├── nextjs-fullstack/CLAUDE.md    # Next.js 15 + Drizzle + PostgreSQL
├── laravel-react/CLAUDE.md       # Laravel 12 + React/Vite + MySQL
├── go-microservices/CLAUDE.md    # Go Echo microservices + React
├── flutter-mobile/CLAUDE.md      # Flutter mobile app
├── hono-supabase/CLAUDE.md       # Hono.js + Supabase (rapid MVP)
└── DATABASE-PATTERNS.md          # Copy-paste SQL patterns for JP market
```

## Cách dùng

### Khi bắt đầu dự án mới:
1. Copy template phù hợp vào root dự án mới
2. Đổi tên thành `CLAUDE.md`
3. Thay `[PROJECT_NAME]`, `[DESCRIPTION]` và các placeholder
4. Claude Code sẽ tự đọc file này + Global rules (~/.claude/CLAUDE.md)

### Hoặc nói với Claude Code:
```
Tạo dự án mới kiểu [nextjs-fullstack/laravel-react/go-microservices/...]
Tên: [tên]
Mô tả: [mô tả]
```

## Chọn template nào?

| Nhu cầu | Template |
|---------|----------|
| SEO, complex web app, SaaS dashboard | nextjs-fullstack |
| Rapid CRUD, admin panel, familiar PHP | laravel-react |
| High performance, microservices, IoT | go-microservices |
| Native mobile app | flutter-mobile |
| Quick MVP, prototype, serverless | hono-supabase |
