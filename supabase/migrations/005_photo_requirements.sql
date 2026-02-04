-- PoolOps Photo Requirements Admin
-- Migration: 005_photo_requirements
-- Date: 2026-02-03

CREATE TABLE IF NOT EXISTS photo_requirements (
  task_key TEXT PRIMARY KEY,
  required BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_requirements_updated_at ON photo_requirements(updated_at);

ALTER TABLE photo_requirements ENABLE ROW LEVEL SECURITY;

-- Demo policies: allow read/write for admin toggles in demo mode.
CREATE POLICY "Public photo requirements read" ON photo_requirements
  FOR SELECT USING (true);

CREATE POLICY "Public photo requirements write" ON photo_requirements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public photo requirements update" ON photo_requirements
  FOR UPDATE USING (true);

-- Seed defaults (all tasks require photos initially).
INSERT INTO photo_requirements (task_key, required)
VALUES
  ('skim', true),
  ('brush', true),
  ('vacuum', true),
  ('baskets', true),
  ('filter', true),
  ('equipment', true)
ON CONFLICT (task_key) DO NOTHING;
