# Database Design Patterns for Japanese Market Apps

Reference này dùng khi Claude Code cần thiết kế database schema.
Copy các patterns phù hợp vào migration files.

---

## 1. Core Tables (hầu hết project nào cũng cần)

### Organizations (Multi-tenant SaaS)
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- 会社名/団体名
  name_kana TEXT,                        -- フリガナ
  slug VARCHAR(50) UNIQUE,               -- URL-safe identifier
  postal_code VARCHAR(8),                -- 〒123-4567
  prefecture VARCHAR(10),                -- 都道府県
  city TEXT,                             -- 市区町村
  address_detail TEXT,                   -- 番地以降
  building TEXT,                         -- 建物名・部屋番号
  phone VARCHAR(15),                     -- 電話番号
  fax VARCHAR(15),                       -- FAX番号 (still common in Japan B2B)
  email VARCHAR(255),
  website TEXT,
  plan_type VARCHAR(20) DEFAULT 'free',  -- free, pro, enterprise
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',           -- Flexible extra fields
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,                    -- 氏名
  name_kana TEXT,                        -- フリガナ (for search/sort)
  role VARCHAR(20) NOT NULL DEFAULT 'user',  -- admin, manager, staff, viewer
  avatar_url TEXT,
  phone VARCHAR(15),
  language VARCHAR(5) DEFAULT 'ja',      -- ja, vi, en
  timezone VARCHAR(30) DEFAULT 'Asia/Tokyo',
  is_active BOOLEAN DEFAULT true,
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(org_id, role);
```

### Audit Logs (必須 for B2B SaaS)
```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  actor_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,           -- create, update, delete, login, export
  entity_type VARCHAR(50) NOT NULL,      -- user, order, settings
  entity_id UUID,
  changes JSONB,                         -- { field: { old: x, new: y } }
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_org_date ON audit_logs(org_id, created_at DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

---

## 2. Auth Patterns

### Sessions (Sanctum-style)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) UNIQUE NOT NULL,  -- SHA-256 of Bearer token
  device_name VARCHAR(100),
  ip_address INET,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Refresh Tokens (JWT-style)
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) UNIQUE NOT NULL,
  family_id UUID NOT NULL,               -- Token rotation family
  is_revoked BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### LINE Login Integration
```sql
-- Add to users table or create separate table
ALTER TABLE users ADD COLUMN line_user_id VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN line_display_name TEXT;
ALTER TABLE users ADD COLUMN line_picture_url TEXT;

-- Or separate table for multiple OAuth providers
CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL,         -- line, google, github
  provider_user_id VARCHAR(100) NOT NULL,
  provider_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider, provider_user_id)
);
```

---

## 3. E-Commerce / Billing (JPY)

### Products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  name_kana TEXT,
  description TEXT,
  price_jpy INTEGER NOT NULL,            -- JPY: always INTEGER, no decimals
  tax_rate SMALLINT DEFAULT 10,          -- 10% standard, 8% food
  sku VARCHAR(50),
  barcode VARCHAR(20),                   -- JAN code (Japanese barcode)
  category_id UUID,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  image_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- YYYYMMDD-XXXX format
  customer_id UUID,
  status VARCHAR(20) DEFAULT 'pending',  -- pending, confirmed, processing, shipped, delivered, cancelled
  subtotal_jpy INTEGER NOT NULL DEFAULT 0,
  tax_jpy INTEGER NOT NULL DEFAULT 0,
  total_jpy INTEGER NOT NULL DEFAULT 0,
  shipping_jpy INTEGER DEFAULT 0,
  discount_jpy INTEGER DEFAULT 0,
  payment_method VARCHAR(20),            -- card, bank_transfer (振込), convenience (コンビニ)
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  notes TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,            -- Snapshot at order time
  quantity INTEGER NOT NULL,
  unit_price_jpy INTEGER NOT NULL,       -- Snapshot at order time
  tax_rate SMALLINT NOT NULL,
  line_total_jpy INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Stripe + Bank Transfer Billing (SaaS)
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) UNIQUE,
  plan_type VARCHAR(20) NOT NULL,
  billing_cycle VARCHAR(10) DEFAULT 'monthly', -- monthly, yearly
  amount_jpy INTEGER NOT NULL,
  tax_jpy INTEGER NOT NULL,
  stripe_subscription_id VARCHAR(100),
  stripe_customer_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',   -- active, past_due, cancelled, trialing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  invoice_number VARCHAR(20) UNIQUE NOT NULL, -- INV-YYYYMM-XXXX
  amount_jpy INTEGER NOT NULL,
  tax_jpy INTEGER NOT NULL,
  total_jpy INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',    -- draft, sent, paid, overdue, void
  payment_method VARCHAR(20),            -- card, bank_transfer
  -- JCT (Japanese Consumption Tax) Invoice fields (インボイス制度)
  issuer_registration_number VARCHAR(20), -- T + 13 digits
  issued_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Geo / Logistics

### Addresses (Japanese format)
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(20) NOT NULL,      -- user, organization, facility
  entity_id UUID NOT NULL,
  label VARCHAR(20) DEFAULT 'main',      -- main, shipping, billing
  postal_code VARCHAR(8) NOT NULL,
  prefecture VARCHAR(10) NOT NULL,
  city TEXT NOT NULL,
  address_line1 TEXT NOT NULL,           -- 番地
  address_line2 TEXT,                    -- 建物名・部屋番号
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Routes / Delivery
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  driver_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'draft',    -- draft, optimized, active, completed
  estimated_duration_min INTEGER,
  total_distance_km NUMERIC(8,2),
  optimized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE route_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  stop_type VARCHAR(20) DEFAULT 'delivery', -- start, delivery, pickup, end
  estimated_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Notification / LINE Integration

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,             -- order_created, delivery_complete, payment_due
  channel VARCHAR(20) DEFAULT 'in_app',  -- in_app, line, email, push
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',              -- Structured payload for deep links
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread
  ON notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;
```

---

## 6. Content / Education

```sql
-- Topic-based content (study material, FAQ, help)
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  title_ja TEXT NOT NULL,
  title_vi TEXT,
  description_ja TEXT,
  description_vi TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title_ja TEXT NOT NULL,
  title_vi TEXT,
  content_ja TEXT NOT NULL,             -- Markdown
  content_vi TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz / Exam
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id),
  type VARCHAR(20) DEFAULT 'multiple_choice',
  question_ja TEXT NOT NULL,
  question_vi TEXT,
  options JSONB NOT NULL,               -- [{text_ja, text_vi, is_correct}]
  explanation_ja TEXT,
  explanation_vi TEXT,
  difficulty SMALLINT DEFAULT 1,        -- 1-5
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  quiz_type VARCHAR(30) NOT NULL,       -- exam, topic_practice, review
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  time_spent_sec INTEGER,
  passed BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Common Indexes to Always Create

```sql
-- Composite indexes for multi-tenant queries
CREATE INDEX idx_[table]_org_id ON [table](org_id);
CREATE INDEX idx_[table]_org_created ON [table](org_id, created_at DESC);

-- Full-text search for Japanese (requires pg_bigm or pgroonga extension)
-- pg_bigm: CREATE INDEX idx_[table]_name_bigm ON [table] USING gin (name gin_bigm_ops);
-- Or use LIKE with trigram: CREATE EXTENSION pg_trgm;

-- Status filtering
CREATE INDEX idx_[table]_status ON [table](org_id, status) WHERE status != 'deleted';
```

---

## 8. Migration Naming Convention

```
YYYYMMDDHHMMSS_description.sql

Example:
20260405000001_create_organizations.sql
20260405000002_create_users.sql
20260405000003_create_audit_logs.sql
20260405000004_create_products.sql
20260405000005_create_orders.sql
```

---

## 9. Tips

- **Always use TIMESTAMPTZ** (not TIMESTAMP) — stores UTC, converts to JST in app
- **UUID for PKs** in distributed systems, BIGSERIAL for simple apps
- **JSONB** for flexible metadata — but don't overuse, prefer typed columns
- **Soft delete** (`deleted_at`) for audit-sensitive tables (orders, users)
- **Check constraints** for enums: `CHECK (status IN ('active', 'inactive'))`
- **Row-level security** (Supabase) or middleware-enforced tenant isolation
