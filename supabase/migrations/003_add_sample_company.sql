-- Add Sample Company (for Demo Account)
-- =============================================================================

INSERT INTO companies (
  name, slug, email, phone, address, city, state, zip_code, service_area, plan,
  plan_expires_at, created_at, updated_at
) VALUES (
  'Pool Cleaning Demo',
  'pool-cleaning-demo',
  'demo@poolapp.com',
  NULL,
  NULL,
  'Hockessin',
  'DE',
  '19707',
  '{"cities": ["Hockessin", "Wilmington", "Newark"], "states": ["DE"]}'::jsonb,
  'trial',
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
);

-- This matches the seed data in 003_seed_data.sql