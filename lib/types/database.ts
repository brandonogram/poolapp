/**
 * PoolOps - Database Types
 * TypeScript interfaces matching the Supabase schema
 */

// =============================================================================
// Helper Types
// =============================================================================

/** UUID string type for clarity */
export type UUID = string;

/** ISO timestamp string */
export type Timestamp = string;

/** Time string in HH:MM:SS format */
export type TimeString = string;

/** Date string in YYYY-MM-DD format */
export type DateString = string;

/** Service area definition for companies */
export interface ServiceArea {
  zip_codes?: string[];
  cities?: string[];
  radius_miles?: number;
  center_lat?: number;
  center_lng?: number;
}

/** Chemical addition record */
export interface ChemicalAdded {
  name: string;
  amount: number;
  unit: 'oz' | 'lb' | 'gal' | 'qt' | 'bag';
}

/** Chemicals added to a pool during service */
export interface ChemicalsAdded {
  chemicals: ChemicalAdded[];
}

/** Chemistry readings from pool water testing */
export interface ChemistryReadings {
  free_chlorine?: number;
  ph?: number;
  alkalinity?: number;
  cyanuric_acid?: number;
  calcium_hardness?: number;
  salt_level?: number;
  water_temp?: number;
}

// =============================================================================
// Enums / Union Types
// =============================================================================

/** User roles within the system */
export type UserRole = 'owner' | 'admin' | 'technician';

/** Subscription plans */
export type PlanType = 'trial' | 'starter' | 'professional' | 'enterprise';

/** Pool types */
export type PoolType = 'in_ground' | 'above_ground' | 'infinity' | 'lap' | 'plunge';

/** Pool surface materials */
export type PoolSurface = 'plaster' | 'pebble' | 'tile' | 'fiberglass' | 'vinyl' | 'aggregate';

/** Sanitizer types */
export type SanitizerType = 'chlorine' | 'salt' | 'bromine' | 'mineral' | 'ozone';

/** Service frequency types */
export type ServiceType = 'weekly' | 'biweekly' | 'monthly' | 'one_time';

/** Rate calculation types */
export type RateType = 'per_service' | 'monthly' | 'per_hour';

/** Service job status */
export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped' | 'cancelled';

/** Route status */
export type RouteStatus = 'planned' | 'in_progress' | 'completed';

/** Invoice status */
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

/** Payment methods */
export type PaymentMethod = 'card' | 'ach' | 'check' | 'cash';

// =============================================================================
// Database Tables
// =============================================================================

/** Company - Multi-tenant root entity */
export interface Company {
  id: UUID;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  service_area: ServiceArea | null;
  logo_url: string | null;
  stripe_customer_id: string | null;
  plan: PlanType;
  plan_expires_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** User - Login accounts linked to Supabase Auth */
export interface User {
  id: UUID;
  company_id: UUID;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** Technician - Field workers (may or may not have login) */
export interface Technician {
  id: UUID;
  company_id: UUID;
  user_id: UUID | null;
  name: string;
  email: string | null;
  phone: string;
  color: string;
  is_active: boolean;
  hourly_rate: number | null;
  max_pools_per_day: number;
  skills: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** Customer - Pool owners who receive service */
export interface Customer {
  id: UUID;
  company_id: UUID;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number | null;
  longitude: number | null;
  gate_code: string | null;
  access_notes: string | null;
  billing_email: string | null;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** Pool - Physical pool with specifications */
export interface Pool {
  id: UUID;
  company_id: UUID;
  customer_id: UUID;
  name: string;
  type: PoolType;
  surface: PoolSurface | null;
  volume_gallons: number | null;
  sanitizer_type: SanitizerType;
  has_heater: boolean;
  has_spa: boolean;
  has_cover: boolean;
  equipment_notes: string | null;
  photo_url: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** ServiceSchedule - Recurring service patterns */
export interface ServiceSchedule {
  id: UUID;
  company_id: UUID;
  customer_id: UUID;
  pool_id: UUID;
  technician_id: UUID | null;
  service_type: ServiceType;
  day_of_week: number | null; // 0 = Sunday, 6 = Saturday
  time_window_start: TimeString | null;
  time_window_end: TimeString | null;
  rate_amount: number;
  rate_type: RateType;
  is_active: boolean;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** ServiceJob - Individual scheduled service instance */
export interface ServiceJob {
  id: UUID;
  company_id: UUID;
  schedule_id: UUID | null;
  customer_id: UUID;
  pool_id: UUID;
  technician_id: UUID | null;
  route_id: UUID | null;
  scheduled_date: DateString;
  scheduled_time: TimeString | null;
  status: JobStatus;
  route_order: number | null;
  estimated_duration: number; // minutes
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** ServiceLog - Completed service record with chemistry data */
export interface ServiceLog {
  id: UUID;
  company_id: UUID;
  job_id: UUID;
  technician_id: UUID;
  started_at: Timestamp;
  completed_at: Timestamp;
  arrival_lat: number | null;
  arrival_lng: number | null;
  free_chlorine: number | null;
  ph: number | null;
  alkalinity: number | null;
  cyanuric_acid: number | null;
  calcium_hardness: number | null;
  salt_level: number | null;
  water_temp: number | null;
  brushed: boolean;
  skimmed: boolean;
  vacuumed: boolean;
  filter_cleaned: boolean;
  baskets_emptied: boolean;
  chemicals_added: ChemicalsAdded | null;
  notes: string | null;
  photo_urls: string[];
  signature_url: string | null;
  created_at: Timestamp;
}

/** Route - Optimized daily route for a technician */
export interface Route {
  id: UUID;
  company_id: UUID;
  technician_id: UUID;
  date: DateString;
  status: RouteStatus;
  total_jobs: number | null;
  total_distance_miles: number | null;
  total_drive_time_minutes: number | null;
  optimized_distance_miles: number | null;
  optimized_drive_time_minutes: number | null;
  job_sequence: UUID[];
  started_at: Timestamp | null;
  completed_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** Invoice - Billing record for customer */
export interface Invoice {
  id: UUID;
  company_id: UUID;
  customer_id: UUID;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_amount: number;
  total: number;
  due_date: DateString | null;
  paid_at: Timestamp | null;
  payment_method: PaymentMethod | null;
  stripe_invoice_id: string | null;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** InvoiceItem - Line item on an invoice */
export interface InvoiceItem {
  id: UUID;
  invoice_id: UUID;
  service_log_id: UUID | null;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: Timestamp;
}

/** TechnicianLocation - Real-time GPS location of a technician */
export interface TechnicianLocation {
  id: UUID;
  technician_id: UUID;
  company_id: UUID;
  latitude: number;
  longitude: number;
  accuracy_meters: number | null;
  heading: number | null;
  speed_mph: number | null;
  updated_at: Timestamp;
}

/** JobPhoto - Photo uploaded as proof of service completion */
export interface JobPhoto {
  id: UUID;
  company_id: UUID;
  job_id: UUID;
  technician_id: UUID;
  photo_url: string;
  uploaded_at: Timestamp;
}

// =============================================================================
// Insert Types (for creating new records)
// =============================================================================

export type CompanyInsert = Omit<Company, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID;
};

export type UserInsert = Omit<User, 'created_at' | 'updated_at'>;

export type TechnicianInsert = Omit<Technician, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID;
};

export type CustomerInsert = Omit<Customer, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID;
};

export type PoolInsert = Omit<Pool, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID;
};

export type ServiceScheduleInsert = Omit<ServiceSchedule, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID;
};

export type ServiceJobInsert = Omit<ServiceJob, 'id' | 'created_at' | 'updated_at' | 'schedule_id' | 'route_id' | 'route_order'> & {
  id?: UUID;
  schedule_id?: UUID | null;
  route_id?: UUID | null;
  route_order?: number | null;
};

export type ServiceLogInsert = Omit<ServiceLog, 'id' | 'created_at'> & {
  id?: UUID;
};

export type RouteInsert = Omit<Route, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID;
};

export type InvoiceInsert = Omit<Invoice, 'id' | 'created_at' | 'updated_at'> & {
  id?: UUID;
};

export type InvoiceItemInsert = Omit<InvoiceItem, 'id' | 'created_at'> & {
  id?: UUID;
};

export type TechnicianLocationInsert = Omit<TechnicianLocation, 'id' | 'updated_at'> & {
  id?: UUID;
  updated_at?: Timestamp;
};

export type JobPhotoInsert = Omit<JobPhoto, 'id' | 'uploaded_at'> & {
  id?: UUID;
};

// =============================================================================
// Update Types (for partial updates)
// =============================================================================

export type CompanyUpdate = Partial<Omit<Company, 'id' | 'created_at'>>;
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at'>>;
export type TechnicianUpdate = Partial<Omit<Technician, 'id' | 'created_at'>>;
export type CustomerUpdate = Partial<Omit<Customer, 'id' | 'created_at'>>;
export type PoolUpdate = Partial<Omit<Pool, 'id' | 'created_at'>>;
export type ServiceScheduleUpdate = Partial<Omit<ServiceSchedule, 'id' | 'created_at'>>;
export type ServiceJobUpdate = Partial<Omit<ServiceJob, 'id' | 'created_at'>>;
export type ServiceLogUpdate = Partial<Omit<ServiceLog, 'id' | 'created_at'>>;
export type RouteUpdate = Partial<Omit<Route, 'id' | 'created_at'>>;
export type InvoiceUpdate = Partial<Omit<Invoice, 'id' | 'created_at'>>;
export type InvoiceItemUpdate = Partial<Omit<InvoiceItem, 'id' | 'created_at'>>;
export type TechnicianLocationUpdate = Partial<Omit<TechnicianLocation, 'id'>>;
export type JobPhotoUpdate = Partial<Omit<JobPhoto, 'id' | 'uploaded_at'>>;

// =============================================================================
// Joined/Extended Types (for queries with relations)
// =============================================================================

/** Customer with their pools */
export interface CustomerWithPools extends Customer {
  pools: Pool[];
}

/** Pool with customer information */
export interface PoolWithCustomer extends Pool {
  customer: Customer;
}

/** Service job with all related entities */
export interface ServiceJobWithDetails extends ServiceJob {
  customer: Customer;
  pool: Pool;
  technician: Technician | null;
  schedule: ServiceSchedule | null;
}

/** Service log with job and customer details */
export interface ServiceLogWithDetails extends ServiceLog {
  job: ServiceJob;
  customer: Customer;
  pool: Pool;
  technician: Technician;
}

/** Route with technician and jobs */
export interface RouteWithDetails extends Route {
  technician: Technician;
  jobs: ServiceJobWithDetails[];
}

/** Invoice with customer and line items */
export interface InvoiceWithDetails extends Invoice {
  customer: Customer;
  items: InvoiceItem[];
}

// =============================================================================
// Database Schema Type (for Supabase client)
// =============================================================================

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company;
        Insert: CompanyInsert;
        Update: CompanyUpdate;
      };
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      technicians: {
        Row: Technician;
        Insert: TechnicianInsert;
        Update: TechnicianUpdate;
      };
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: CustomerUpdate;
      };
      pools: {
        Row: Pool;
        Insert: PoolInsert;
        Update: PoolUpdate;
      };
      service_schedules: {
        Row: ServiceSchedule;
        Insert: ServiceScheduleInsert;
        Update: ServiceScheduleUpdate;
      };
      service_jobs: {
        Row: ServiceJob;
        Insert: ServiceJobInsert;
        Update: ServiceJobUpdate;
      };
      service_logs: {
        Row: ServiceLog;
        Insert: ServiceLogInsert;
        Update: ServiceLogUpdate;
      };
      routes: {
        Row: Route;
        Insert: RouteInsert;
        Update: RouteUpdate;
      };
      invoices: {
        Row: Invoice;
        Insert: InvoiceInsert;
        Update: InvoiceUpdate;
      };
      invoice_items: {
        Row: InvoiceItem;
        Insert: InvoiceItemInsert;
        Update: InvoiceItemUpdate;
      };
      technician_locations: {
        Row: TechnicianLocation;
        Insert: TechnicianLocationInsert;
        Update: TechnicianLocationUpdate;
      };
      job_photos: {
        Row: JobPhoto;
        Insert: JobPhotoInsert;
        Update: JobPhotoUpdate;
      };
    };
    Functions: {
      get_user_company_id: {
        Args: Record<string, never>;
        Returns: UUID;
      };
    };
  };
}
