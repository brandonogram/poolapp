-- Pool App - Seed Data
-- Migration: 003_seed_data
-- Date: 2026-02-02
--
-- Populates database with sample data for testing and demonstration

-- =============================================================================
-- Sample Company
-- =============================================================================

INSERT INTO companies (
  id, name, slug, email, phone, address, city, state, zip_code, service_area,
  plan
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Pool Cleaning Demo',
  'pool-cleaning-demo',
  'demo@poolapp.com',
  '(555) 123-4567',
  '123 Main St',
  'Hockessin',
  'DE',
  '19707',
  '{"cities": ["Hockessin", "Wilmington", "Newark"], "states": ["DE"]}'::jsonb,
  'trial'
);

-- =============================================================================
-- Sample Users
-- =============================================================================

-- Owner
INSERT INTO users (
  id, company_id, email, full_name, role, phone, is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'owner@poolapp.com',
  'Demo Owner',
  'owner',
  '(555) 123-4567',
  true
);

-- Admin
INSERT INTO users (
  id, company_id, email, full_name, role, phone, is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@poolapp.com',
  'Demo Admin',
  'admin',
  '(555) 123-4568',
  true
);

-- =============================================================================
-- Sample Technicians
-- =============================================================================

INSERT INTO technicians (
  id, company_id, user_id, name, email, phone, color, is_active,
  hourly_rate, max_pools_per_day, skills
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001',
  'Mike Johnson',
  'mike@poolapp.com',
  '(555) 111-1111',
  '#0066FF',
  true,
  45.00,
  15,
  ARRAY['basic_cleaning', 'chemistry', 'repair']
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440002',
  'Sarah Wilson',
  'sarah@poolapp.com',
  '(555) 222-2222',
  '#FF6600',
  true,
  50.00,
  12,
  ARRAY['basic_cleaning', 'equipment', 'opening_closing']
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440000',
  NULL,
  'Tom Davis',
  'tom@poolapp.com',
  '(555) 333-3333',
  '#00CC00',
  true,
  42.00,
  18,
  ARRAY['basic_cleaning', 'chemistry']
);

-- =============================================================================
-- Sample Customers
-- =============================================================================

INSERT INTO customers (
  id, company_id, name, email, phone, address, city, state, zip_code,
  latitude, longitude, gate_code, access_notes, billing_email, is_active
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440000',
  'John Smith',
  'john@example.com',
  '(555) 444-4444',
  '456 Oak Ave',
  'Hockessin',
  'DE',
  '19707',
  39.7874,
  -75.6884,
  '1234',
  'Dog in backyard, please close gate',
  'john.billing@example.com',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440000',
  'Mary Johnson',
  'mary@example.com',
  '(555) 555-5555',
  '789 Pine St',
  'Wilmington',
  'DE',
  '19801',
  39.7392,
  -75.5398,
  NULL,
  'Leave key under mat',
  'mary.billing@example.com',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  'Robert Davis',
  'robert@example.com',
  '(555) 666-6666',
  '321 Elm Drive',
  'Newark',
  'DE',
  '19711',
  39.6837,
  -75.7491,
  '5678',
  'Gate code may change, please call',
  'robert.billing@example.com',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440000',
  'Emily Brown',
  'emily@example.com',
  '(555) 777-7777',
  '654 Maple Lane',
  'Hockessin',
  'DE',
  '19707',
  39.7921,
  -75.6953,
  NULL,
  'Side gate always open',
  'emily.billing@example.com',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440000',
  'David Miller',
  'david@example.com',
  '(555) 888-8888',
  '987 Cedar Road',
  'Wilmington',
  'DE',
  '19802',
  39.7545,
  -75.5542,
  '9999',
  'Large dog, please announce yourself',
  'david.billing@example.com',
  true
);

-- =============================================================================
-- Sample Pools
-- =============================================================================

INSERT INTO pools (
  id, company_id, customer_id, name, type, surface, volume_gallons,
  sanitizer_type, has_heater, has_spa, has_cover, equipment_notes, photo_url
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440006',
  'Main Pool',
  'in_ground',
  'pebble',
  20000,
  'chlorine',
  true,
  false,
  true,
  'Pentair pump, Hayward filter',
  NULL
),
(
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440007',
  'Backyard Pool',
  'in_ground',
  'plaster',
  15000,
  'salt',
  false,
  true,
  true,
  'Jandy pump and filter system',
  NULL
),
(
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440008',
  'Family Pool',
  'in_ground',
  'tile',
  25000,
  'chlorine',
  true,
  false,
  false,
  'Custom design, Pentair heater',
  NULL
),
(
  '550e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440009',
  'Spa Pool',
  'in_ground',
  'fiberglass',
  8000,
  'bromine',
  true,
  true,
  true,
  'Combined pool and spa',
  NULL
),
(
  '550e8400-e29b-41d4-a716-446655440016',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440010',
  'Infinity Pool',
  'infinity',
  'aggregate',
  35000,
  'salt',
  true,
  true,
  true,
  'Large infinity edge, custom equipment',
  NULL
);

-- =============================================================================
-- Sample Service Schedules
-- =============================================================================

INSERT INTO service_schedules (
  id, company_id, customer_id, pool_id, technician_id, service_type,
  day_of_week, time_window_start, time_window_end, rate_amount, rate_type,
  is_active, notes
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440017',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440003',
  'weekly',
  1,
  '08:00:00',
  '10:00:00',
  85.00,
  'per_service',
  true,
  'Weekly service, preferred morning slot'
),
(
  '550e8400-e29b-41d4-a716-446655440018',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440004',
  'biweekly',
  3,
  '10:00:00',
  '12:00:00',
  95.00,
  'per_service',
  true,
  'Biweekly service'
),
(
  '550e8400-e29b-41d4-a716-446655440019',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440003',
  'weekly',
  2,
  '14:00:00',
  '16:00:00',
  100.00,
  'per_service',
  true,
  'Weekly afternoon service'
),
(
  '550e8400-e29b-41d4-a716-446655440020',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440005',
  'weekly',
  4,
  '09:00:00',
  '11:00:00',
  110.00,
  'per_service',
  true,
  'Weekly service with spa'
),
(
  '550e8400-e29b-41d4-a716-446655440021',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440016',
  '550e8400-e29b-41d4-a716-446655440003',
  'monthly',
  5,
  '08:00:00',
  '12:00:00',
  150.00,
  'per_service',
  true,
  'Monthly cleaning for large pool'
);

-- =============================================================================
-- Sample Service Jobs (This Week)
-- =============================================================================

INSERT INTO service_jobs (
  id, company_id, schedule_id, customer_id, pool_id, technician_id,
  scheduled_date, scheduled_time, status, route_order, estimated_duration
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440022',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440017',
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440003',
  '2026-02-03',
  '08:00:00',
  'scheduled',
  1,
  30
),
(
  '550e8400-e29b-41d4-a716-446655440023',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440018',
  '550e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440004',
  '2026-02-03',
  '10:00:00',
  'scheduled',
  2,
  45
),
(
  '550e8400-e29b-41d4-a716-446655440024',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440019',
  '550e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440003',
  '2026-02-04',
  '14:00:00',
  'scheduled',
  1,
  30
),
(
  '550e8400-e29b-41d4-a716-446655440025',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440020',
  '550e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440005',
  '2026-02-05',
  '09:00:00',
  'scheduled',
  1,
  60
),
(
  '550e8400-e29b-41d4-a716-446655440026',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440021',
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440016',
  '550e8400-e29b-41d4-a716-446655440003',
  '2026-02-06',
  '08:00:00',
  'scheduled',
  1,
  90
);

-- =============================================================================
-- Sample Completed Service Log
-- =============================================================================

INSERT INTO service_logs (
  id, company_id, job_id, technician_id, started_at, completed_at,
  arrival_lat, arrival_lng, free_chlorine, ph, alkalinity, cyanuric_acid,
  calcium_hardness, salt_level, water_temp, brushed, skimmed, vacuumed,
  filter_cleaned, baskets_emptied, chemicals_added, notes
) VALUES (
  '550e8400-e29b-41d4-a716-446655440027',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440022',
  '550e8400-e29b-41d4-a716-446655440003',
  '2026-02-01 08:00:00',
  '2026-02-01 08:35:00',
  39.7874,
  -75.6884,
  2.5,
  7.4,
  100,
  40,
  250,
  3200,
  72,
  true,
  true,
  true,
  true,
  true,
  '{"chlorine": "1 lb", "alkalinity_up": "1 lb"}'::jsonb,
  'All chemistry levels good. Pool looks great.'
);

-- =============================================================================
-- Sample Invoice
-- =============================================================================

INSERT INTO invoices (
  id, company_id, customer_id, invoice_number, status,
  subtotal, tax_amount, total, due_date, notes
) VALUES (
  '550e8400-e29b-41d4-a716-446655440028',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440006',
  'INV-2026-02-001',
  'sent',
  85.00,
  0.00,
  85.00,
  '2026-02-15',
  'Weekly pool service for February 2026'
);

-- =============================================================================
-- Sample Invoice Item
-- =============================================================================

INSERT INTO invoice_items (
  id, invoice_id, service_log_id, description, quantity, unit_price, total
) VALUES (
  '550e8400-e29b-41d4-a716-446655440029',
  '550e8400-e29b-41d4-a716-446655440028',
  '550e8400-e29b-41d4-a716-446655440027',
  'Weekly Pool Service - February 1, 2026',
  1,
  85.00,
  85.00
);

-- =============================================================================
-- Sample Route
-- =============================================================================

INSERT INTO routes (
  id, company_id, technician_id, date, status, total_jobs, job_sequence
) VALUES (
  '550e8400-e29b-41d4-a716-446655440030',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440003',
  '2026-02-03',
  'planned',
  2,
  ARRAY['550e8400-e29b-41d4-a716-446655440022'::uuid, '550e8400-e29b-41d4-a716-446655440023'::uuid]
);

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON TABLE companies IS 'Sample company with demo data';
COMMENT ON TABLE users IS 'Sample users (owner, admin)';
COMMENT ON TABLE technicians IS '3 sample technicians with different skills and rates';
COMMENT ON TABLE customers IS '5 sample customers in Hockessin, Wilmington, Newark';
COMMENT ON TABLE pools IS '5 sample pools with different types and features';
COMMENT ON TABLE service_schedules IS '5 sample schedules with different frequencies';
COMMENT ON TABLE service_jobs IS '5 sample jobs scheduled for this week';
COMMENT ON TABLE service_logs IS '1 sample completed service log';
COMMENT ON TABLE invoices IS '1 sample invoice';
COMMENT ON TABLE invoice_items IS '1 sample invoice line item';
COMMENT ON TABLE routes IS '1 sample route for technician';

-- =============================================================================
-- Summary
-- =============================================================================

-- This seed data provides:
-- 1 company
-- 2 users (owner, admin)
-- 3 technicians
-- 5 customers
-- 5 pools
-- 5 service schedules
-- 5 service jobs
-- 1 service log (completed)
-- 1 invoice
-- 1 invoice item
-- 1 route

-- Total records: 24

-- This should be sufficient to test all features including:
- Add Job modal (customer, technician, pool dropdowns)
- Schedule view
- Service log entry
- Route optimization
- Invoice generation
