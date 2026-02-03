-- PoolOps Demo Live Tracking (public demo table)
-- Migration: 004_demo_live_tracking
-- Date: 2026-02-03

CREATE TABLE IF NOT EXISTS demo_live_tracking (
  tracker_id TEXT PRIMARY KEY,
  tech_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  eta_minutes INTEGER NOT NULL,
  distance_miles DECIMAL(6,2) NOT NULL,
  arrival_time TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_live_tracking_updated_at ON demo_live_tracking(updated_at);

ALTER TABLE demo_live_tracking ENABLE ROW LEVEL SECURITY;

-- Demo policies: allow anonymous read/write for tracking links.
CREATE POLICY "Public demo tracking read" ON demo_live_tracking
  FOR SELECT USING (true);

CREATE POLICY "Public demo tracking write" ON demo_live_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public demo tracking update" ON demo_live_tracking
  FOR UPDATE USING (true);
