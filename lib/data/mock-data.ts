/**
 * PoolOps - Mock Data
 * Realistic sample data for development and testing
 */

import type {
  Company,
  User,
  Technician,
  Customer,
  Pool,
  ServiceSchedule,
  ServiceJob,
  ServiceLog,
  Route,
  Invoice,
  InvoiceItem,
  CustomerWithPools,
  ServiceJobWithDetails,
} from '@/lib/types/database';

// =============================================================================
// Date Helpers
// =============================================================================

const now = new Date();
const today = now.toISOString().split('T')[0];

function getDateString(daysFromNow: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

function getTimestamp(daysFromNow: number = 0, hours: number = 0, minutes: number = 0): string {
  const date = new Date(now);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function getDayOfWeek(): number {
  return now.getDay();
}

// =============================================================================
// Company
// =============================================================================

export const mockCompany: Company = {
  id: 'c0a80121-0001-4000-8000-000000000001',
  name: 'Delaware Pool Pros',
  slug: 'delaware-pool-pros',
  email: 'info@delawarepoolpros.com',
  phone: '(302) 555-7665',
  address: '1200 Market St',
  city: 'Wilmington',
  state: 'DE',
  zip_code: '19801',
  service_area: {
    cities: ['Wilmington', 'Newark', 'Dover', 'Rehoboth Beach', 'Lewes', 'Greenville', 'Hockessin', 'Middletown'],
    radius_miles: 50,
    center_lat: 39.7391,
    center_lng: -75.5398,
  },
  logo_url: null,
  stripe_customer_id: null,
  plan: 'professional',
  plan_expires_at: getTimestamp(365),
  created_at: '2024-06-15T10:00:00.000Z',
  updated_at: '2024-06-15T10:00:00.000Z',
};

// =============================================================================
// Users
// =============================================================================

export const mockUsers: User[] = [
  {
    id: 'u0a80121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    email: 'mike@delawarepoolpros.com',
    full_name: 'Mike Rodriguez',
    role: 'owner',
    phone: '(302) 555-0101',
    avatar_url: null,
    is_active: true,
    created_at: '2024-06-15T10:00:00.000Z',
    updated_at: '2024-06-15T10:00:00.000Z',
  },
  {
    id: 'u0a80121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    email: 'sarah@delawarepoolpros.com',
    full_name: 'Sarah Chen',
    role: 'technician',
    phone: '(302) 555-0102',
    avatar_url: null,
    is_active: true,
    created_at: '2024-07-01T10:00:00.000Z',
    updated_at: '2024-07-01T10:00:00.000Z',
  },
];

// =============================================================================
// Technicians
// =============================================================================

export const mockTechnicians: Technician[] = [
  {
    id: 't0a80121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    user_id: mockUsers[0].id,
    name: 'Mike Rodriguez',
    email: 'mike@delawarepoolpros.com',
    phone: '(302) 555-0101',
    color: '#2563EB', // Blue
    is_active: true,
    hourly_rate: 35.00,
    max_pools_per_day: 12,
    skills: ['chlorine', 'salt', 'repair', 'equipment'],
    created_at: '2024-06-15T10:00:00.000Z',
    updated_at: '2024-06-15T10:00:00.000Z',
  },
  {
    id: 't0a80121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    user_id: mockUsers[1].id,
    name: 'Sarah Chen',
    email: 'sarah@delawarepoolpros.com',
    phone: '(302) 555-0102',
    color: '#059669', // Green
    is_active: true,
    hourly_rate: 30.00,
    max_pools_per_day: 15,
    skills: ['chlorine', 'salt', 'chemical balance'],
    created_at: '2024-07-01T10:00:00.000Z',
    updated_at: '2024-07-01T10:00:00.000Z',
  },
];

// =============================================================================
// Customers (Detroit Area)
// =============================================================================

export const mockCustomers: Customer[] = [
  {
    id: 'cust0121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    name: 'Robert & Linda Johnson',
    email: 'rjohnson@email.com',
    phone: '(248) 555-1234',
    address: '1542 Maple Lane',
    city: 'Birmingham',
    state: 'MI',
    zip_code: '48009',
    latitude: 42.5467,
    longitude: -83.2113,
    gate_code: '4521',
    access_notes: 'Gate on left side of house. Dog is friendly.',
    billing_email: 'rjohnson@email.com',
    is_active: true,
    created_at: '2024-06-20T10:00:00.000Z',
    updated_at: '2024-06-20T10:00:00.000Z',
  },
  {
    id: 'cust0121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    name: 'Patricia Williams',
    email: 'pwilliams@email.com',
    phone: '(248) 555-2345',
    address: '2891 Oak Ridge Dr',
    city: 'Bloomfield Hills',
    state: 'MI',
    zip_code: '48301',
    latitude: 42.5839,
    longitude: -83.2455,
    gate_code: null,
    access_notes: 'Pool in backyard, use side gate.',
    billing_email: 'pwilliams@email.com',
    is_active: true,
    created_at: '2024-06-22T10:00:00.000Z',
    updated_at: '2024-06-22T10:00:00.000Z',
  },
  {
    id: 'cust0121-0003-4000-8000-000000000003',
    company_id: mockCompany.id,
    name: 'James & Mary Davis',
    email: 'jdavis@email.com',
    phone: '(248) 555-3456',
    address: '456 Lakeside Blvd',
    city: 'Royal Oak',
    state: 'MI',
    zip_code: '48073',
    latitude: 42.4895,
    longitude: -83.1446,
    gate_code: '9876',
    access_notes: null,
    billing_email: null,
    is_active: true,
    created_at: '2024-07-01T10:00:00.000Z',
    updated_at: '2024-07-01T10:00:00.000Z',
  },
  {
    id: 'cust0121-0004-4000-8000-000000000004',
    company_id: mockCompany.id,
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '(248) 555-4567',
    address: '789 Woodward Heights',
    city: 'Troy',
    state: 'MI',
    zip_code: '48083',
    latitude: 42.5803,
    longitude: -83.1499,
    gate_code: null,
    access_notes: 'Ring doorbell on arrival. Pool heater control in shed.',
    billing_email: 'mchen@email.com',
    is_active: true,
    created_at: '2024-07-05T10:00:00.000Z',
    updated_at: '2024-07-05T10:00:00.000Z',
  },
  {
    id: 'cust0121-0005-4000-8000-000000000005',
    company_id: mockCompany.id,
    name: 'Susan Anderson',
    email: 'sanderson@email.com',
    phone: '(313) 555-5678',
    address: '321 Grosse Pointe Blvd',
    city: 'Grosse Pointe',
    state: 'MI',
    zip_code: '48230',
    latitude: 42.3863,
    longitude: -82.9113,
    gate_code: '1234',
    access_notes: 'Premium customer. Has attached spa.',
    billing_email: null,
    is_active: true,
    created_at: '2024-07-10T10:00:00.000Z',
    updated_at: '2024-07-10T10:00:00.000Z',
  },
  {
    id: 'cust0121-0006-4000-8000-000000000006',
    company_id: mockCompany.id,
    name: 'David & Jennifer Miller',
    email: 'dmiller@email.com',
    phone: '(586) 555-6789',
    address: '567 Sterling Lane',
    city: 'Sterling Heights',
    state: 'MI',
    zip_code: '48310',
    latitude: 42.5803,
    longitude: -83.0302,
    gate_code: null,
    access_notes: 'Large pool. May need extra chemicals.',
    billing_email: 'jmiller.billing@email.com',
    is_active: true,
    created_at: '2024-07-15T10:00:00.000Z',
    updated_at: '2024-07-15T10:00:00.000Z',
  },
  {
    id: 'cust0121-0007-4000-8000-000000000007',
    company_id: mockCompany.id,
    name: 'Thomas Wilson',
    email: 'twilson@email.com',
    phone: '(586) 555-7890',
    address: '890 Warren Ave',
    city: 'Warren',
    state: 'MI',
    zip_code: '48089',
    latitude: 42.4773,
    longitude: -83.0277,
    gate_code: '5555',
    access_notes: null,
    billing_email: 'twilson@email.com',
    is_active: true,
    created_at: '2024-07-20T10:00:00.000Z',
    updated_at: '2024-07-20T10:00:00.000Z',
  },
  {
    id: 'cust0121-0008-4000-8000-000000000008',
    company_id: mockCompany.id,
    name: 'Emily Thompson',
    email: 'ethompson@email.com',
    phone: '(248) 555-8901',
    address: '234 Ferndale Ave',
    city: 'Ferndale',
    state: 'MI',
    zip_code: '48220',
    latitude: 42.4606,
    longitude: -83.1346,
    gate_code: null,
    access_notes: 'Pool cover should be removed before service.',
    billing_email: null,
    is_active: true,
    created_at: '2024-08-01T10:00:00.000Z',
    updated_at: '2024-08-01T10:00:00.000Z',
  },
  {
    id: 'cust0121-0009-4000-8000-000000000009',
    company_id: mockCompany.id,
    name: 'Richard & Barbara Brown',
    email: 'rbrown@email.com',
    phone: '(248) 555-9012',
    address: '678 Southfield Rd',
    city: 'Birmingham',
    state: 'MI',
    zip_code: '48009',
    latitude: 42.5195,
    longitude: -83.2214,
    gate_code: '7890',
    access_notes: 'Salt water pool. Check salt levels carefully.',
    billing_email: 'rbrown@email.com',
    is_active: true,
    created_at: '2024-08-05T10:00:00.000Z',
    updated_at: '2024-08-05T10:00:00.000Z',
  },
  {
    id: 'cust0121-0010-4000-8000-000000000010',
    company_id: mockCompany.id,
    name: 'Nancy Garcia',
    email: 'ngarcia@email.com',
    phone: '(248) 555-0123',
    address: '901 Orchard Lake Rd',
    city: 'Bloomfield Hills',
    state: 'MI',
    zip_code: '48302',
    latitude: 42.5612,
    longitude: -83.2891,
    gate_code: '2468',
    access_notes: 'Infinity pool. Check water level.',
    billing_email: 'ngarcia@email.com',
    is_active: true,
    created_at: '2024-08-10T10:00:00.000Z',
    updated_at: '2024-08-10T10:00:00.000Z',
  },
  {
    id: 'cust0121-0011-4000-8000-000000000011',
    company_id: mockCompany.id,
    name: 'Christopher Lee',
    email: 'clee@email.com',
    phone: '(248) 555-1122',
    address: '345 Coolidge Hwy',
    city: 'Royal Oak',
    state: 'MI',
    zip_code: '48073',
    latitude: 42.4927,
    longitude: -83.1002,
    gate_code: null,
    access_notes: 'Above ground pool. Ladder on south side.',
    billing_email: null,
    is_active: true,
    created_at: '2024-08-15T10:00:00.000Z',
    updated_at: '2024-08-15T10:00:00.000Z',
  },
  {
    id: 'cust0121-0012-4000-8000-000000000012',
    company_id: mockCompany.id,
    name: 'Amanda & Kevin Taylor',
    email: 'ktaylor@email.com',
    phone: '(248) 555-2233',
    address: '567 Livernois Ave',
    city: 'Troy',
    state: 'MI',
    zip_code: '48084',
    latitude: 42.5561,
    longitude: -83.1677,
    gate_code: '3579',
    access_notes: null,
    billing_email: 'ataylor@email.com',
    is_active: true,
    created_at: '2024-08-20T10:00:00.000Z',
    updated_at: '2024-08-20T10:00:00.000Z',
  },
  {
    id: 'cust0121-0013-4000-8000-000000000013',
    company_id: mockCompany.id,
    name: 'Daniel Martinez',
    email: 'dmartinez@email.com',
    phone: '(313) 555-3344',
    address: '789 Jefferson Ave',
    city: 'Grosse Pointe',
    state: 'MI',
    zip_code: '48230',
    latitude: 42.3912,
    longitude: -82.9234,
    gate_code: null,
    access_notes: 'Historic home. Be careful with equipment around landscaping.',
    billing_email: 'dmartinez@email.com',
    is_active: true,
    created_at: '2024-09-01T10:00:00.000Z',
    updated_at: '2024-09-01T10:00:00.000Z',
  },
  {
    id: 'cust0121-0014-4000-8000-000000000014',
    company_id: mockCompany.id,
    name: 'Laura White',
    email: 'lwhite@email.com',
    phone: '(586) 555-4455',
    address: '123 Van Dyke Ave',
    city: 'Sterling Heights',
    state: 'MI',
    zip_code: '48312',
    latitude: 42.5612,
    longitude: -83.0012,
    gate_code: '6789',
    access_notes: 'Lap pool. Long and narrow.',
    billing_email: null,
    is_active: true,
    created_at: '2024-09-05T10:00:00.000Z',
    updated_at: '2024-09-05T10:00:00.000Z',
  },
  {
    id: 'cust0121-0015-4000-8000-000000000015',
    company_id: mockCompany.id,
    name: 'Steven & Karen Harris',
    email: 'sharris@email.com',
    phone: '(586) 555-5566',
    address: '456 Mound Rd',
    city: 'Warren',
    state: 'MI',
    zip_code: '48091',
    latitude: 42.4912,
    longitude: -83.0123,
    gate_code: null,
    access_notes: 'Pool and spa combo. Test both.',
    billing_email: 'kharris@email.com',
    is_active: true,
    created_at: '2024-09-10T10:00:00.000Z',
    updated_at: '2024-09-10T10:00:00.000Z',
  },
];

// =============================================================================
// Pools
// =============================================================================

export const mockPools: Pool[] = [
  {
    id: 'pool0121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    customer_id: mockCustomers[0].id,
    name: 'Main Pool',
    type: 'in_ground',
    surface: 'plaster',
    volume_gallons: 20000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: true,
    equipment_notes: 'Pentair pump, DE filter',
    photo_url: null,
    created_at: '2024-06-20T10:00:00.000Z',
    updated_at: '2024-06-20T10:00:00.000Z',
  },
  {
    id: 'pool0121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    customer_id: mockCustomers[1].id,
    name: 'Main Pool',
    type: 'in_ground',
    surface: 'pebble',
    volume_gallons: 25000,
    sanitizer_type: 'salt',
    has_heater: true,
    has_spa: true,
    has_cover: false,
    equipment_notes: 'Salt cell replaced 2024. Hayward equipment.',
    photo_url: null,
    created_at: '2024-06-22T10:00:00.000Z',
    updated_at: '2024-06-22T10:00:00.000Z',
  },
  {
    id: 'pool0121-0003-4000-8000-000000000003',
    company_id: mockCompany.id,
    customer_id: mockCustomers[2].id,
    name: 'Backyard Pool',
    type: 'in_ground',
    surface: 'tile',
    volume_gallons: 18000,
    sanitizer_type: 'chlorine',
    has_heater: false,
    has_spa: false,
    has_cover: true,
    equipment_notes: 'Standard cartridge filter',
    photo_url: null,
    created_at: '2024-07-01T10:00:00.000Z',
    updated_at: '2024-07-01T10:00:00.000Z',
  },
  {
    id: 'pool0121-0004-4000-8000-000000000004',
    company_id: mockCompany.id,
    customer_id: mockCustomers[3].id,
    name: 'Main Pool',
    type: 'in_ground',
    surface: 'plaster',
    volume_gallons: 22000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: false,
    equipment_notes: 'Variable speed pump installed 2025',
    photo_url: null,
    created_at: '2024-07-05T10:00:00.000Z',
    updated_at: '2024-07-05T10:00:00.000Z',
  },
  {
    id: 'pool0121-0005-4000-8000-000000000005',
    company_id: mockCompany.id,
    customer_id: mockCustomers[4].id,
    name: 'Pool & Spa',
    type: 'in_ground',
    surface: 'pebble',
    volume_gallons: 30000,
    sanitizer_type: 'salt',
    has_heater: true,
    has_spa: true,
    has_cover: true,
    equipment_notes: 'Premium setup. Automation system. Spa attached.',
    photo_url: null,
    created_at: '2024-07-10T10:00:00.000Z',
    updated_at: '2024-07-10T10:00:00.000Z',
  },
  {
    id: 'pool0121-0006-4000-8000-000000000006',
    company_id: mockCompany.id,
    customer_id: mockCustomers[5].id,
    name: 'Family Pool',
    type: 'in_ground',
    surface: 'aggregate',
    volume_gallons: 35000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: false,
    equipment_notes: 'Large pool. Two skimmers. Extra chemicals needed.',
    photo_url: null,
    created_at: '2024-07-15T10:00:00.000Z',
    updated_at: '2024-07-15T10:00:00.000Z',
  },
  {
    id: 'pool0121-0007-4000-8000-000000000007',
    company_id: mockCompany.id,
    customer_id: mockCustomers[6].id,
    name: 'Main Pool',
    type: 'in_ground',
    surface: 'plaster',
    volume_gallons: 16000,
    sanitizer_type: 'chlorine',
    has_heater: false,
    has_spa: false,
    has_cover: true,
    equipment_notes: 'Standard setup',
    photo_url: null,
    created_at: '2024-07-20T10:00:00.000Z',
    updated_at: '2024-07-20T10:00:00.000Z',
  },
  {
    id: 'pool0121-0008-4000-8000-000000000008',
    company_id: mockCompany.id,
    customer_id: mockCustomers[7].id,
    name: 'Covered Pool',
    type: 'in_ground',
    surface: 'fiberglass',
    volume_gallons: 15000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: true,
    equipment_notes: 'Solar cover. Fiberglass shell.',
    photo_url: null,
    created_at: '2024-08-01T10:00:00.000Z',
    updated_at: '2024-08-01T10:00:00.000Z',
  },
  {
    id: 'pool0121-0009-4000-8000-000000000009',
    company_id: mockCompany.id,
    customer_id: mockCustomers[8].id,
    name: 'Salt Pool',
    type: 'in_ground',
    surface: 'pebble',
    volume_gallons: 24000,
    sanitizer_type: 'salt',
    has_heater: true,
    has_spa: false,
    has_cover: false,
    equipment_notes: 'Salt system. Check cell monthly.',
    photo_url: null,
    created_at: '2024-08-05T10:00:00.000Z',
    updated_at: '2024-08-05T10:00:00.000Z',
  },
  {
    id: 'pool0121-0010-4000-8000-000000000010',
    company_id: mockCompany.id,
    customer_id: mockCustomers[9].id,
    name: 'Infinity Pool',
    type: 'infinity',
    surface: 'tile',
    volume_gallons: 28000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: false,
    equipment_notes: 'Infinity edge. Check water level. Catch basin requires attention.',
    photo_url: null,
    created_at: '2024-08-10T10:00:00.000Z',
    updated_at: '2024-08-10T10:00:00.000Z',
  },
  {
    id: 'pool0121-0011-4000-8000-000000000011',
    company_id: mockCompany.id,
    customer_id: mockCustomers[10].id,
    name: 'Above Ground',
    type: 'above_ground',
    surface: 'vinyl',
    volume_gallons: 10000,
    sanitizer_type: 'chlorine',
    has_heater: false,
    has_spa: false,
    has_cover: true,
    equipment_notes: 'Above ground round pool. Intex pump.',
    photo_url: null,
    created_at: '2024-08-15T10:00:00.000Z',
    updated_at: '2024-08-15T10:00:00.000Z',
  },
  {
    id: 'pool0121-0012-4000-8000-000000000012',
    company_id: mockCompany.id,
    customer_id: mockCustomers[11].id,
    name: 'Main Pool',
    type: 'in_ground',
    surface: 'plaster',
    volume_gallons: 19000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: true,
    equipment_notes: 'Standard residential setup',
    photo_url: null,
    created_at: '2024-08-20T10:00:00.000Z',
    updated_at: '2024-08-20T10:00:00.000Z',
  },
  {
    id: 'pool0121-0013-4000-8000-000000000013',
    company_id: mockCompany.id,
    customer_id: mockCustomers[12].id,
    name: 'Historic Pool',
    type: 'in_ground',
    surface: 'tile',
    volume_gallons: 21000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: false,
    equipment_notes: 'Older pool. Classic tile work. Be careful.',
    photo_url: null,
    created_at: '2024-09-01T10:00:00.000Z',
    updated_at: '2024-09-01T10:00:00.000Z',
  },
  {
    id: 'pool0121-0014-4000-8000-000000000014',
    company_id: mockCompany.id,
    customer_id: mockCustomers[13].id,
    name: 'Lap Pool',
    type: 'lap',
    surface: 'plaster',
    volume_gallons: 12000,
    sanitizer_type: 'chlorine',
    has_heater: true,
    has_spa: false,
    has_cover: true,
    equipment_notes: '50 ft lap pool. Long and narrow.',
    photo_url: null,
    created_at: '2024-09-05T10:00:00.000Z',
    updated_at: '2024-09-05T10:00:00.000Z',
  },
  {
    id: 'pool0121-0015-4000-8000-000000000015',
    company_id: mockCompany.id,
    customer_id: mockCustomers[14].id,
    name: 'Pool & Spa',
    type: 'in_ground',
    surface: 'pebble',
    volume_gallons: 23000,
    sanitizer_type: 'salt',
    has_heater: true,
    has_spa: true,
    has_cover: false,
    equipment_notes: 'Pool and attached spa. Salt system.',
    photo_url: null,
    created_at: '2024-09-10T10:00:00.000Z',
    updated_at: '2024-09-10T10:00:00.000Z',
  },
];

// =============================================================================
// Service Schedules
// =============================================================================

export const mockServiceSchedules: ServiceSchedule[] = mockCustomers.map((customer, index) => ({
  id: `sched121-${String(index + 1).padStart(4, '0')}-4000-8000-000000000001`,
  company_id: mockCompany.id,
  customer_id: customer.id,
  pool_id: mockPools[index].id,
  technician_id: index % 2 === 0 ? mockTechnicians[0].id : mockTechnicians[1].id,
  service_type: 'weekly' as const,
  day_of_week: (index % 5) + 1, // Mon-Fri (1-5)
  time_window_start: '08:00:00',
  time_window_end: '17:00:00',
  rate_amount: 75 + (index % 3) * 25, // $75, $100, or $125
  rate_type: 'per_service' as const,
  is_active: true,
  notes: null,
  created_at: customer.created_at,
  updated_at: customer.updated_at,
}));

// =============================================================================
// Routes (This Week)
// =============================================================================

const currentDayOfWeek = getDayOfWeek();

export const mockRoutes: Route[] = [
  {
    id: 'route121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    technician_id: mockTechnicians[0].id,
    date: today,
    status: 'in_progress',
    total_jobs: 6,
    total_distance_miles: 28.5,
    total_drive_time_minutes: 85,
    optimized_distance_miles: 22.3,
    optimized_drive_time_minutes: 68,
    job_sequence: [],
    started_at: getTimestamp(0, 8, 15),
    completed_at: null,
    created_at: getTimestamp(-1),
    updated_at: getTimestamp(0, 8, 15),
  },
  {
    id: 'route121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    technician_id: mockTechnicians[1].id,
    date: today,
    status: 'planned',
    total_jobs: 7,
    total_distance_miles: 32.1,
    total_drive_time_minutes: 95,
    optimized_distance_miles: 26.8,
    optimized_drive_time_minutes: 78,
    job_sequence: [],
    started_at: null,
    completed_at: null,
    created_at: getTimestamp(-1),
    updated_at: getTimestamp(-1),
  },
];

// =============================================================================
// Service Jobs (This Week)
// =============================================================================

// Jobs for Mike today
const mikeJobsToday: ServiceJob[] = [
  {
    id: 'job00121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[0].id,
    customer_id: mockCustomers[0].id,
    pool_id: mockPools[0].id,
    technician_id: mockTechnicians[0].id,
    route_id: mockRoutes[0].id,
    scheduled_date: today,
    scheduled_time: '08:30:00',
    status: 'completed',
    route_order: 1,
    estimated_duration: 30,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(0, 9, 5),
  },
  {
    id: 'job00121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[2].id,
    customer_id: mockCustomers[2].id,
    pool_id: mockPools[2].id,
    technician_id: mockTechnicians[0].id,
    route_id: mockRoutes[0].id,
    scheduled_date: today,
    scheduled_time: '09:15:00',
    status: 'completed',
    route_order: 2,
    estimated_duration: 25,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(0, 9, 45),
  },
  {
    id: 'job00121-0003-4000-8000-000000000003',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[4].id,
    customer_id: mockCustomers[4].id,
    pool_id: mockPools[4].id,
    technician_id: mockTechnicians[0].id,
    route_id: mockRoutes[0].id,
    scheduled_date: today,
    scheduled_time: '10:30:00',
    status: 'in_progress',
    route_order: 3,
    estimated_duration: 45,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(0, 10, 35),
  },
  {
    id: 'job00121-0004-4000-8000-000000000004',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[6].id,
    customer_id: mockCustomers[6].id,
    pool_id: mockPools[6].id,
    technician_id: mockTechnicians[0].id,
    route_id: mockRoutes[0].id,
    scheduled_date: today,
    scheduled_time: '11:30:00',
    status: 'scheduled',
    route_order: 4,
    estimated_duration: 30,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0005-4000-8000-000000000005',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[8].id,
    customer_id: mockCustomers[8].id,
    pool_id: mockPools[8].id,
    technician_id: mockTechnicians[0].id,
    route_id: mockRoutes[0].id,
    scheduled_date: today,
    scheduled_time: '13:00:00',
    status: 'scheduled',
    route_order: 5,
    estimated_duration: 35,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0006-4000-8000-000000000006',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[10].id,
    customer_id: mockCustomers[10].id,
    pool_id: mockPools[10].id,
    technician_id: mockTechnicians[0].id,
    route_id: mockRoutes[0].id,
    scheduled_date: today,
    scheduled_time: '14:30:00',
    status: 'scheduled',
    route_order: 6,
    estimated_duration: 25,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
];

// Jobs for Sarah today
const sarahJobsToday: ServiceJob[] = [
  {
    id: 'job00121-0007-4000-8000-000000000007',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[1].id,
    customer_id: mockCustomers[1].id,
    pool_id: mockPools[1].id,
    technician_id: mockTechnicians[1].id,
    route_id: mockRoutes[1].id,
    scheduled_date: today,
    scheduled_time: '08:00:00',
    status: 'scheduled',
    route_order: 1,
    estimated_duration: 40,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0008-4000-8000-000000000008',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[3].id,
    customer_id: mockCustomers[3].id,
    pool_id: mockPools[3].id,
    technician_id: mockTechnicians[1].id,
    route_id: mockRoutes[1].id,
    scheduled_date: today,
    scheduled_time: '09:00:00',
    status: 'scheduled',
    route_order: 2,
    estimated_duration: 30,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0009-4000-8000-000000000009',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[5].id,
    customer_id: mockCustomers[5].id,
    pool_id: mockPools[5].id,
    technician_id: mockTechnicians[1].id,
    route_id: mockRoutes[1].id,
    scheduled_date: today,
    scheduled_time: '10:00:00',
    status: 'scheduled',
    route_order: 3,
    estimated_duration: 45,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0010-4000-8000-000000000010',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[7].id,
    customer_id: mockCustomers[7].id,
    pool_id: mockPools[7].id,
    technician_id: mockTechnicians[1].id,
    route_id: mockRoutes[1].id,
    scheduled_date: today,
    scheduled_time: '11:00:00',
    status: 'scheduled',
    route_order: 4,
    estimated_duration: 30,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0011-4000-8000-000000000011',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[9].id,
    customer_id: mockCustomers[9].id,
    pool_id: mockPools[9].id,
    technician_id: mockTechnicians[1].id,
    route_id: mockRoutes[1].id,
    scheduled_date: today,
    scheduled_time: '12:30:00',
    status: 'scheduled',
    route_order: 5,
    estimated_duration: 40,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0012-4000-8000-000000000012',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[11].id,
    customer_id: mockCustomers[11].id,
    pool_id: mockPools[11].id,
    technician_id: mockTechnicians[1].id,
    route_id: mockRoutes[1].id,
    scheduled_date: today,
    scheduled_time: '14:00:00',
    status: 'scheduled',
    route_order: 6,
    estimated_duration: 30,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
  {
    id: 'job00121-0013-4000-8000-000000000013',
    company_id: mockCompany.id,
    schedule_id: mockServiceSchedules[13].id,
    customer_id: mockCustomers[13].id,
    pool_id: mockPools[13].id,
    technician_id: mockTechnicians[1].id,
    route_id: mockRoutes[1].id,
    scheduled_date: today,
    scheduled_time: '15:00:00',
    status: 'scheduled',
    route_order: 7,
    estimated_duration: 25,
    created_at: getTimestamp(-7),
    updated_at: getTimestamp(-7),
  },
];

export const mockServiceJobs: ServiceJob[] = [...mikeJobsToday, ...sarahJobsToday];

// =============================================================================
// Service Logs (Completed Services)
// =============================================================================

export const mockServiceLogs: ServiceLog[] = [
  {
    id: 'log00121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    job_id: mikeJobsToday[0].id,
    technician_id: mockTechnicians[0].id,
    started_at: getTimestamp(0, 8, 32),
    completed_at: getTimestamp(0, 9, 5),
    arrival_lat: 42.5467,
    arrival_lng: -83.2113,
    free_chlorine: 2.5,
    ph: 7.4,
    alkalinity: 90,
    cyanuric_acid: 45,
    calcium_hardness: 280,
    salt_level: null,
    water_temp: 78,
    brushed: true,
    skimmed: true,
    vacuumed: false,
    filter_cleaned: false,
    baskets_emptied: true,
    chemicals_added: {
      chemicals: [
        { name: 'Chlorine Tabs', amount: 3, unit: 'oz' },
      ],
    },
    notes: 'Pool looking good. Chlorine levels stable.',
    photo_urls: [],
    signature_url: null,
    created_at: getTimestamp(0, 9, 5),
  },
  {
    id: 'log00121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    job_id: mikeJobsToday[1].id,
    technician_id: mockTechnicians[0].id,
    started_at: getTimestamp(0, 9, 18),
    completed_at: getTimestamp(0, 9, 45),
    arrival_lat: 42.4895,
    arrival_lng: -83.1446,
    free_chlorine: 1.8,
    ph: 7.6,
    alkalinity: 85,
    cyanuric_acid: 40,
    calcium_hardness: 260,
    salt_level: null,
    water_temp: 76,
    brushed: true,
    skimmed: true,
    vacuumed: true,
    filter_cleaned: false,
    baskets_emptied: true,
    chemicals_added: {
      chemicals: [
        { name: 'Chlorine Shock', amount: 1, unit: 'lb' },
        { name: 'pH Down', amount: 8, unit: 'oz' },
      ],
    },
    notes: 'pH was high. Added pH down and shock treatment.',
    photo_urls: [],
    signature_url: null,
    created_at: getTimestamp(0, 9, 45),
  },
];

// =============================================================================
// Invoices
// =============================================================================

export const mockInvoices: Invoice[] = [
  {
    id: 'inv00121-0001-4000-8000-000000000001',
    company_id: mockCompany.id,
    customer_id: mockCustomers[0].id,
    invoice_number: 'INV-2026-0001',
    status: 'paid',
    subtotal: 300.00,
    tax_amount: 18.00,
    total: 318.00,
    due_date: getDateString(-15),
    paid_at: getTimestamp(-10),
    payment_method: 'card',
    stripe_invoice_id: null,
    notes: 'January 2026 services',
    created_at: getTimestamp(-30),
    updated_at: getTimestamp(-10),
  },
  {
    id: 'inv00121-0002-4000-8000-000000000002',
    company_id: mockCompany.id,
    customer_id: mockCustomers[1].id,
    invoice_number: 'INV-2026-0002',
    status: 'sent',
    subtotal: 400.00,
    tax_amount: 24.00,
    total: 424.00,
    due_date: getDateString(15),
    paid_at: null,
    payment_method: null,
    stripe_invoice_id: null,
    notes: 'January 2026 services',
    created_at: getTimestamp(-5),
    updated_at: getTimestamp(-5),
  },
];

// =============================================================================
// Invoice Items
// =============================================================================

export const mockInvoiceItems: InvoiceItem[] = [
  {
    id: 'item0121-0001-4000-8000-000000000001',
    invoice_id: mockInvoices[0].id,
    service_log_id: null,
    description: 'Weekly Pool Service - Week 1',
    quantity: 1,
    unit_price: 75.00,
    total: 75.00,
    created_at: getTimestamp(-30),
  },
  {
    id: 'item0121-0002-4000-8000-000000000002',
    invoice_id: mockInvoices[0].id,
    service_log_id: null,
    description: 'Weekly Pool Service - Week 2',
    quantity: 1,
    unit_price: 75.00,
    total: 75.00,
    created_at: getTimestamp(-30),
  },
  {
    id: 'item0121-0003-4000-8000-000000000003',
    invoice_id: mockInvoices[0].id,
    service_log_id: null,
    description: 'Weekly Pool Service - Week 3',
    quantity: 1,
    unit_price: 75.00,
    total: 75.00,
    created_at: getTimestamp(-30),
  },
  {
    id: 'item0121-0004-4000-8000-000000000004',
    invoice_id: mockInvoices[0].id,
    service_log_id: null,
    description: 'Weekly Pool Service - Week 4',
    quantity: 1,
    unit_price: 75.00,
    total: 75.00,
    created_at: getTimestamp(-30),
  },
  {
    id: 'item0121-0005-4000-8000-000000000005',
    invoice_id: mockInvoices[1].id,
    service_log_id: null,
    description: 'Weekly Pool & Spa Service - Week 1',
    quantity: 1,
    unit_price: 100.00,
    total: 100.00,
    created_at: getTimestamp(-5),
  },
  {
    id: 'item0121-0006-4000-8000-000000000006',
    invoice_id: mockInvoices[1].id,
    service_log_id: null,
    description: 'Weekly Pool & Spa Service - Week 2',
    quantity: 1,
    unit_price: 100.00,
    total: 100.00,
    created_at: getTimestamp(-5),
  },
  {
    id: 'item0121-0007-4000-8000-000000000007',
    invoice_id: mockInvoices[1].id,
    service_log_id: null,
    description: 'Weekly Pool & Spa Service - Week 3',
    quantity: 1,
    unit_price: 100.00,
    total: 100.00,
    created_at: getTimestamp(-5),
  },
  {
    id: 'item0121-0008-4000-8000-000000000008',
    invoice_id: mockInvoices[1].id,
    service_log_id: null,
    description: 'Weekly Pool & Spa Service - Week 4',
    quantity: 1,
    unit_price: 100.00,
    total: 100.00,
    created_at: getTimestamp(-5),
  },
];

// =============================================================================
// Computed/Joined Data Helpers
// =============================================================================

/**
 * Get customers with their pools attached
 */
export function getCustomersWithPools(): CustomerWithPools[] {
  return mockCustomers.map((customer) => ({
    ...customer,
    pools: mockPools.filter((pool) => pool.customer_id === customer.id),
  }));
}

/**
 * Get service jobs with all related details
 */
export function getServiceJobsWithDetails(date?: string): ServiceJobWithDetails[] {
  const targetDate = date || today;

  return mockServiceJobs
    .filter((job) => job.scheduled_date === targetDate)
    .map((job) => {
      const customer = mockCustomers.find((c) => c.id === job.customer_id)!;
      const pool = mockPools.find((p) => p.id === job.pool_id)!;
      const technician = mockTechnicians.find((t) => t.id === job.technician_id) || null;
      const schedule = mockServiceSchedules.find((s) => s.id === job.schedule_id) || null;

      return {
        ...job,
        customer,
        pool,
        technician,
        schedule,
      };
    })
    .sort((a, b) => {
      // Sort by route order if same technician, otherwise by scheduled time
      if (a.technician_id === b.technician_id) {
        return (a.route_order || 0) - (b.route_order || 0);
      }
      return (a.scheduled_time || '').localeCompare(b.scheduled_time || '');
    });
}

/**
 * Get dashboard statistics
 */
export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalPools: number;
  jobsToday: number;
  jobsCompleted: number;
  jobsInProgress: number;
  jobsScheduled: number;
  totalTechnicians: number;
  activeTechnicians: number;
  revenueThisMonth: number;
  outstandingInvoices: number;
}

export function getDashboardStats(): DashboardStats {
  const todayJobs = mockServiceJobs.filter((job) => job.scheduled_date === today);

  return {
    totalCustomers: mockCustomers.length,
    activeCustomers: mockCustomers.filter((c) => c.is_active).length,
    totalPools: mockPools.length,
    jobsToday: todayJobs.length,
    jobsCompleted: todayJobs.filter((j) => j.status === 'completed').length,
    jobsInProgress: todayJobs.filter((j) => j.status === 'in_progress').length,
    jobsScheduled: todayJobs.filter((j) => j.status === 'scheduled').length,
    totalTechnicians: mockTechnicians.length,
    activeTechnicians: mockTechnicians.filter((t) => t.is_active).length,
    revenueThisMonth: mockInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0),
    outstandingInvoices: mockInvoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0),
  };
}

// =============================================================================
// Export All Data
// =============================================================================

export const mockData = {
  company: mockCompany,
  users: mockUsers,
  technicians: mockTechnicians,
  customers: mockCustomers,
  pools: mockPools,
  serviceSchedules: mockServiceSchedules,
  serviceJobs: mockServiceJobs,
  serviceLogs: mockServiceLogs,
  routes: mockRoutes,
  invoices: mockInvoices,
  invoiceItems: mockInvoiceItems,
};

export default mockData;
