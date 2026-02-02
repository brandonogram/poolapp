-- Pool App - Additional Tables Migration
-- Migration: 002_additional_tables
-- Date: 2026-02-01
--
-- Additional tables for real-time tracking and photo uploads

-- =============================================================================
-- Technician Locations Table (for real-time tracking)
-- =============================================================================

CREATE TABLE IF NOT EXISTS technician_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  accuracy_meters DECIMAL(10,2),
  heading DECIMAL(5,2),
  speed_mph DECIMAL(5,2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(technician_id)
);

-- =============================================================================
-- Job Photos Table (for completion evidence)
-- =============================================================================

CREATE TABLE IF NOT EXISTS job_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES service_jobs(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_technician_locations_company ON technician_locations(company_id);
CREATE INDEX IF NOT EXISTS idx_technician_locations_technician ON technician_locations(technician_id);
CREATE INDEX IF NOT EXISTS idx_technician_locations_last_seen ON technician_locations(last_seen);

CREATE INDEX IF NOT EXISTS idx_job_photos_company ON job_photos(company_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_job ON job_photos(job_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_technician ON job_photos(technician_id);

-- =============================================================================
-- Updated At Trigger for technician_locations
-- =============================================================================

CREATE OR REPLACE TRIGGER update_technician_locations_updated_at
  BEFORE UPDATE ON technician_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

ALTER TABLE technician_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;

-- Technician Locations Policies
CREATE POLICY "Users can view company locations" ON technician_locations
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Technicians can update own location" ON technician_locations
  FOR ALL USING (company_id = get_user_company_id());

-- Job Photos Policies
CREATE POLICY "Users can view company job photos" ON job_photos
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Technicians can upload photos" ON job_photos
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- =============================================================================
-- Comments for Documentation
-- =============================================================================

COMMENT ON TABLE technician_locations IS 'Real-time GPS locations of technicians for live tracking';
COMMENT ON TABLE job_photos IS 'Photos uploaded by technicians as proof of service completion';
