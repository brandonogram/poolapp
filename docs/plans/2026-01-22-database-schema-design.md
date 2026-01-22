# Pool App - Database Schema Design

**Date:** January 22, 2026
**Status:** Approved for Implementation

---

## Overview

Multi-tenant PostgreSQL schema for Pool App, designed for Supabase with Row Level Security (RLS).

## Core Entities

| Entity | Purpose |
|--------|---------|
| `companies` | Multi-tenant root - pool service businesses |
| `users` | Login accounts (linked to Supabase Auth) |
| `technicians` | Field workers (may not have login) |
| `customers` | Pool owners who receive service |
| `pools` | Physical pool with specs |
| `service_schedules` | Recurring service patterns |
| `service_jobs` | Individual scheduled instances |
| `service_logs` | Completed service records |
| `routes` | Optimized daily routes |
| `invoices` | Billing records |
| `invoice_items` | Line items on invoices |

## Schema

### companies
```sql
CREATE TABLE companies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  address         TEXT,
  city            TEXT,
  state           TEXT,
  zip_code        TEXT,
  service_area    JSONB,
  logo_url        TEXT,
  stripe_customer_id TEXT,
  plan            TEXT DEFAULT 'trial',
  plan_expires_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### users
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id),
  company_id      UUID NOT NULL REFERENCES companies(id),
  email           TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'technician',
  phone           TEXT,
  avatar_url      TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### technicians
```sql
CREATE TABLE technicians (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  user_id         UUID REFERENCES users(id),
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT NOT NULL,
  color           TEXT DEFAULT '#0066FF',
  is_active       BOOLEAN DEFAULT true,
  hourly_rate     DECIMAL(10,2),
  max_pools_per_day INTEGER DEFAULT 15,
  skills          TEXT[],
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### customers
```sql
CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  zip_code        TEXT NOT NULL,
  latitude        DECIMAL(10,7),
  longitude       DECIMAL(10,7),
  gate_code       TEXT,
  access_notes    TEXT,
  billing_email   TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### pools
```sql
CREATE TABLE pools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  name            TEXT DEFAULT 'Main Pool',
  type            TEXT NOT NULL DEFAULT 'in_ground',
  surface         TEXT,
  volume_gallons  INTEGER,
  sanitizer_type  TEXT DEFAULT 'chlorine',
  has_heater      BOOLEAN DEFAULT false,
  has_spa         BOOLEAN DEFAULT false,
  has_cover       BOOLEAN DEFAULT false,
  equipment_notes TEXT,
  photo_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### service_schedules
```sql
CREATE TABLE service_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  pool_id         UUID NOT NULL REFERENCES pools(id),
  technician_id   UUID REFERENCES technicians(id),
  service_type    TEXT NOT NULL DEFAULT 'weekly',
  day_of_week     INTEGER,
  time_window_start TIME,
  time_window_end TIME,
  rate_amount     DECIMAL(10,2) NOT NULL,
  rate_type       TEXT DEFAULT 'per_service',
  is_active       BOOLEAN DEFAULT true,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### service_jobs
```sql
CREATE TABLE service_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  schedule_id     UUID REFERENCES service_schedules(id),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  pool_id         UUID NOT NULL REFERENCES pools(id),
  technician_id   UUID REFERENCES technicians(id),
  route_id        UUID REFERENCES routes(id),
  scheduled_date  DATE NOT NULL,
  scheduled_time  TIME,
  status          TEXT DEFAULT 'scheduled',
  route_order     INTEGER,
  estimated_duration INTEGER DEFAULT 30,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### service_logs
```sql
CREATE TABLE service_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  job_id          UUID NOT NULL REFERENCES service_jobs(id),
  technician_id   UUID NOT NULL REFERENCES technicians(id),
  started_at      TIMESTAMPTZ NOT NULL,
  completed_at    TIMESTAMPTZ NOT NULL,
  arrival_lat     DECIMAL(10,7),
  arrival_lng     DECIMAL(10,7),
  free_chlorine   DECIMAL(5,2),
  ph              DECIMAL(4,2),
  alkalinity      INTEGER,
  cyanuric_acid   INTEGER,
  calcium_hardness INTEGER,
  salt_level      INTEGER,
  water_temp      INTEGER,
  brushed         BOOLEAN DEFAULT false,
  skimmed         BOOLEAN DEFAULT false,
  vacuumed        BOOLEAN DEFAULT false,
  filter_cleaned  BOOLEAN DEFAULT false,
  baskets_emptied BOOLEAN DEFAULT false,
  chemicals_added JSONB,
  notes           TEXT,
  photo_urls      TEXT[],
  signature_url   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### routes
```sql
CREATE TABLE routes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  technician_id   UUID NOT NULL REFERENCES technicians(id),
  date            DATE NOT NULL,
  status          TEXT DEFAULT 'planned',
  total_jobs      INTEGER,
  total_distance_miles DECIMAL(10,2),
  total_drive_time_minutes INTEGER,
  optimized_distance_miles DECIMAL(10,2),
  optimized_drive_time_minutes INTEGER,
  job_sequence    UUID[],
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, technician_id, date)
);
```

### invoices
```sql
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  invoice_number  TEXT NOT NULL,
  status          TEXT DEFAULT 'draft',
  subtotal        DECIMAL(10,2) NOT NULL,
  tax_amount      DECIMAL(10,2) DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  due_date        DATE,
  paid_at         TIMESTAMPTZ,
  payment_method  TEXT,
  stripe_invoice_id TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### invoice_items
```sql
CREATE TABLE invoice_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id      UUID NOT NULL REFERENCES invoices(id),
  service_log_id  UUID REFERENCES service_logs(id),
  description     TEXT NOT NULL,
  quantity        DECIMAL(10,2) DEFAULT 1,
  unit_price      DECIMAL(10,2) NOT NULL,
  total           DECIMAL(10,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security

All tables use company_id-based RLS:

```sql
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Example policy (applied to all tables)
CREATE POLICY "Users can manage company data" ON [table]
  FOR ALL USING (company_id = get_user_company_id());
```

## Indexes

- `idx_users_company` on users(company_id)
- `idx_technicians_company` on technicians(company_id)
- `idx_customers_company` on customers(company_id)
- `idx_customers_location` on customers(latitude, longitude)
- `idx_pools_customer` on pools(customer_id)
- `idx_service_schedules_customer` on service_schedules(customer_id)
- `idx_service_jobs_date` on service_jobs(company_id, scheduled_date)
- `idx_service_jobs_technician` on service_jobs(technician_id, scheduled_date)
- `idx_service_logs_job` on service_logs(job_id)
- `idx_routes_technician_date` on routes(technician_id, date)
- `idx_invoices_customer` on invoices(customer_id)
- `idx_invoices_status` on invoices(company_id, status)

---

**Document Status:** Ready for implementation
