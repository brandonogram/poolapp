-- Pool App - Initial Database Schema
-- Migration: 001_initial_schema
-- Date: 2026-01-22
--
-- Multi-tenant PostgreSQL schema for Pool App with Row Level Security

-- =============================================================================
-- Enable Required Extensions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Companies Table
-- =============================================================================

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

-- =============================================================================
-- Users Table
-- =============================================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'technician' CHECK (role IN ('owner', 'admin', 'technician')),
  phone           TEXT,
  avatar_url      TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Technicians Table
-- =============================================================================

CREATE TABLE technicians (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT NOT NULL,
  color           TEXT DEFAULT '#0066FF',
  is_active       BOOLEAN DEFAULT true,
  hourly_rate     DECIMAL(10,2),
  max_pools_per_day INTEGER DEFAULT 15,
  skills          TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Customers Table
-- =============================================================================

CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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

-- =============================================================================
-- Pools Table
-- =============================================================================

CREATE TABLE pools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name            TEXT DEFAULT 'Main Pool',
  type            TEXT NOT NULL DEFAULT 'in_ground' CHECK (type IN ('in_ground', 'above_ground', 'infinity', 'lap', 'plunge')),
  surface         TEXT CHECK (surface IN ('plaster', 'pebble', 'tile', 'fiberglass', 'vinyl', 'aggregate')),
  volume_gallons  INTEGER,
  sanitizer_type  TEXT DEFAULT 'chlorine' CHECK (sanitizer_type IN ('chlorine', 'salt', 'bromine', 'mineral', 'ozone')),
  has_heater      BOOLEAN DEFAULT false,
  has_spa         BOOLEAN DEFAULT false,
  has_cover       BOOLEAN DEFAULT false,
  equipment_notes TEXT,
  photo_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Service Schedules Table
-- =============================================================================

CREATE TABLE service_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  pool_id         UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  technician_id   UUID REFERENCES technicians(id) ON DELETE SET NULL,
  service_type    TEXT NOT NULL DEFAULT 'weekly' CHECK (service_type IN ('weekly', 'biweekly', 'monthly', 'one_time')),
  day_of_week     INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time_window_start TIME,
  time_window_end TIME,
  rate_amount     DECIMAL(10,2) NOT NULL,
  rate_type       TEXT DEFAULT 'per_service' CHECK (rate_type IN ('per_service', 'monthly', 'per_hour')),
  is_active       BOOLEAN DEFAULT true,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Routes Table (must be created before service_jobs due to FK)
-- =============================================================================

CREATE TABLE routes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  technician_id   UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  status          TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  total_jobs      INTEGER,
  total_distance_miles DECIMAL(10,2),
  total_drive_time_minutes INTEGER,
  optimized_distance_miles DECIMAL(10,2),
  optimized_drive_time_minutes INTEGER,
  job_sequence    UUID[] DEFAULT '{}',
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, technician_id, date)
);

-- =============================================================================
-- Service Jobs Table
-- =============================================================================

CREATE TABLE service_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  schedule_id     UUID REFERENCES service_schedules(id) ON DELETE SET NULL,
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  pool_id         UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  technician_id   UUID REFERENCES technicians(id) ON DELETE SET NULL,
  route_id        UUID REFERENCES routes(id) ON DELETE SET NULL,
  scheduled_date  DATE NOT NULL,
  scheduled_time  TIME,
  status          TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped', 'cancelled')),
  route_order     INTEGER,
  estimated_duration INTEGER DEFAULT 30,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Service Logs Table
-- =============================================================================

CREATE TABLE service_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_id          UUID NOT NULL REFERENCES service_jobs(id) ON DELETE CASCADE,
  technician_id   UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
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
  photo_urls      TEXT[] DEFAULT '{}',
  signature_url   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Invoices Table
-- =============================================================================

CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  invoice_number  TEXT NOT NULL,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal        DECIMAL(10,2) NOT NULL,
  tax_amount      DECIMAL(10,2) DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  due_date        DATE,
  paid_at         TIMESTAMPTZ,
  payment_method  TEXT CHECK (payment_method IN ('card', 'ach', 'check', 'cash')),
  stripe_invoice_id TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Invoice Items Table
-- =============================================================================

CREATE TABLE invoice_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  service_log_id  UUID REFERENCES service_logs(id) ON DELETE SET NULL,
  description     TEXT NOT NULL,
  quantity        DECIMAL(10,2) DEFAULT 1,
  unit_price      DECIMAL(10,2) NOT NULL,
  total           DECIMAL(10,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Users
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);

-- Technicians
CREATE INDEX idx_technicians_company ON technicians(company_id);
CREATE INDEX idx_technicians_user ON technicians(user_id);

-- Customers
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_customers_location ON customers(latitude, longitude);
CREATE INDEX idx_customers_active ON customers(company_id, is_active);

-- Pools
CREATE INDEX idx_pools_customer ON pools(customer_id);
CREATE INDEX idx_pools_company ON pools(company_id);

-- Service Schedules
CREATE INDEX idx_service_schedules_customer ON service_schedules(customer_id);
CREATE INDEX idx_service_schedules_pool ON service_schedules(pool_id);
CREATE INDEX idx_service_schedules_technician ON service_schedules(technician_id);
CREATE INDEX idx_service_schedules_day ON service_schedules(company_id, day_of_week);

-- Service Jobs
CREATE INDEX idx_service_jobs_date ON service_jobs(company_id, scheduled_date);
CREATE INDEX idx_service_jobs_technician ON service_jobs(technician_id, scheduled_date);
CREATE INDEX idx_service_jobs_customer ON service_jobs(customer_id);
CREATE INDEX idx_service_jobs_route ON service_jobs(route_id);
CREATE INDEX idx_service_jobs_status ON service_jobs(company_id, status);

-- Service Logs
CREATE INDEX idx_service_logs_job ON service_logs(job_id);
CREATE INDEX idx_service_logs_technician ON service_logs(technician_id);
CREATE INDEX idx_service_logs_date ON service_logs(company_id, completed_at);

-- Routes
CREATE INDEX idx_routes_technician_date ON routes(technician_id, date);
CREATE INDEX idx_routes_company_date ON routes(company_id, date);

-- Invoices
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(company_id, status);
CREATE INDEX idx_invoices_number ON invoices(company_id, invoice_number);

-- Invoice Items
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to get the company_id for the current authenticated user
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Updated At Triggers
-- =============================================================================

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at
  BEFORE UPDATE ON technicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pools_updated_at
  BEFORE UPDATE ON pools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_schedules_updated_at
  BEFORE UPDATE ON service_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_jobs_updated_at
  BEFORE UPDATE ON service_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only see their own company
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (id = get_user_company_id());

CREATE POLICY "Owners can update own company" ON companies
  FOR UPDATE USING (id = get_user_company_id())
  WITH CHECK (id = get_user_company_id());

-- Users: Can see users in same company
CREATE POLICY "Users can view company users" ON users
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage company users" ON users
  FOR ALL USING (
    company_id = get_user_company_id() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Technicians: Company-scoped access
CREATE POLICY "Users can view company technicians" ON technicians
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage company technicians" ON technicians
  FOR ALL USING (
    company_id = get_user_company_id() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Customers: Company-scoped access
CREATE POLICY "Users can view company customers" ON customers
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company customers" ON customers
  FOR ALL USING (company_id = get_user_company_id());

-- Pools: Company-scoped access
CREATE POLICY "Users can view company pools" ON pools
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company pools" ON pools
  FOR ALL USING (company_id = get_user_company_id());

-- Service Schedules: Company-scoped access
CREATE POLICY "Users can view company schedules" ON service_schedules
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company schedules" ON service_schedules
  FOR ALL USING (company_id = get_user_company_id());

-- Service Jobs: Company-scoped access
CREATE POLICY "Users can view company jobs" ON service_jobs
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company jobs" ON service_jobs
  FOR ALL USING (company_id = get_user_company_id());

-- Service Logs: Company-scoped access
CREATE POLICY "Users can view company logs" ON service_logs
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Technicians can create logs" ON service_logs
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Technicians can update own logs" ON service_logs
  FOR UPDATE USING (
    company_id = get_user_company_id() AND
    technician_id IN (
      SELECT id FROM technicians WHERE user_id = auth.uid()
    )
  );

-- Routes: Company-scoped access
CREATE POLICY "Users can view company routes" ON routes
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company routes" ON routes
  FOR ALL USING (company_id = get_user_company_id());

-- Invoices: Company-scoped access
CREATE POLICY "Users can view company invoices" ON invoices
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage company invoices" ON invoices
  FOR ALL USING (
    company_id = get_user_company_id() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Invoice Items: Access through invoice
CREATE POLICY "Users can view invoice items" ON invoice_items
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Admins can manage invoice items" ON invoice_items
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE company_id = get_user_company_id()
    ) AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- =============================================================================
-- Comments for Documentation
-- =============================================================================

COMMENT ON TABLE companies IS 'Multi-tenant root - pool service businesses';
COMMENT ON TABLE users IS 'Login accounts linked to Supabase Auth';
COMMENT ON TABLE technicians IS 'Field workers who perform pool service';
COMMENT ON TABLE customers IS 'Pool owners who receive service';
COMMENT ON TABLE pools IS 'Physical pools with specifications';
COMMENT ON TABLE service_schedules IS 'Recurring service patterns';
COMMENT ON TABLE service_jobs IS 'Individual scheduled service instances';
COMMENT ON TABLE service_logs IS 'Completed service records with chemistry data';
COMMENT ON TABLE routes IS 'Optimized daily routes for technicians';
COMMENT ON TABLE invoices IS 'Customer billing records';
COMMENT ON TABLE invoice_items IS 'Line items on invoices';

COMMENT ON FUNCTION get_user_company_id() IS 'Returns the company_id for the current authenticated user';
