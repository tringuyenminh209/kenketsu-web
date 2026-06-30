# Project Kickstart Guide

Copy file này vào conversation đầu tiên với Claude Code khi bắt đầu dự án mới.
Hoặc nói: "Tạo dự án mới theo kickstart protocol"

---

## Cách dùng

### Option 1: Mô tả ý tưởng
```
Tạo dự án mới: [mô tả ý tưởng]
Target: [ai dùng]
Scale: [MVP / Growth / Enterprise]
Platform: [Web / Mobile / Both]
```

### Option 2: Nói chi tiết hơn
```
Tạo dự án mới:
- Tên: [tên dự án]
- Mô tả: [app làm gì]
- Users: [ai dùng, bao nhiêu người]
- Platform: Web only / Mobile / Both / PWA
- Infra: Vercel / AWS / VPS / Supabase
- Timeline: [bao lâu cho MVP]
- Key features: [list features chính]
- Integrations: LINE / Stripe / AWS / Maps / AI ...
- Monetization: Free / Freemium / SaaS / One-time
```

### Option 3: Nhanh nhất
```
Tạo dự án mới kiểu [shokuai/Logi-Go/FinOps/asahi/JLPT/Gentsuki]
nhưng cho [domain khác]
```
→ Claude sẽ clone architecture pattern từ dự án tương tự.

---

## Claude Code sẽ trả lời với:

### 1. Architecture Decision Record (ADR)
```
## Tech Stack
- Frontend: [framework] — lý do: ...
- Backend: [framework] — lý do: ...
- Database: [DB] — lý do: ...
- Auth: [strategy] — lý do: ...
- Deploy: [platform] — lý do: ...
```

### 2. Directory Structure (complete tree)
```
project/
├── [full tree with every directory explained]
```

### 3. Database Schema
```sql
-- ERD with relationships, key fields, indexes
-- Japanese market fields included
```

### 4. API Design
```
GET  /api/v1/[resource]     — list
POST /api/v1/[resource]     — create
GET  /api/v1/[resource]/:id — detail
...
```

### 5. Development Setup
```bash
# Step-by-step commands to get running
```

### 6. CLAUDE.md (auto-generated for this project)

---

## Checklist trước khi approve

- [ ] Stack phù hợp với scale và timeline?
- [ ] Directory structure rõ ràng, scalable?
- [ ] Database schema có đủ Japanese market fields?
- [ ] API design RESTful, consistent?
- [ ] Auth strategy phù hợp? (JWT vs Sanctum vs OAuth)
- [ ] Docker Compose cho local dev?
- [ ] i18n setup sẵn? (ja + vi minimum)
- [ ] Có seed data/test accounts?

Nói "OK" hoặc "Approve" → Claude bắt đầu scaffold code.
Nói "Sửa [phần]" → Claude điều chỉnh phần đó.
