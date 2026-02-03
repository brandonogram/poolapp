'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getDemoStorage } from './demo-session';
import { deriveLatLng } from './geo';

// Types
export type CustomerType = 'residential' | 'commercial';
export type ServiceFrequency = 'weekly' | 'bi-weekly' | 'monthly';
export type ChemistryStatus = 'healthy' | 'attention' | 'critical';

export interface ChemistryReading {
  ph: number;
  chlorine: number;
  alkalinity: number;
  lastReadingDate: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  type: CustomerType;
  serviceFrequency: ServiceFrequency;
  lastServiceDate: string;
  nextServiceDate: string;
  chemistry: ChemistryReading;
  chemistryStatus: ChemistryStatus;
  chemistryAlert?: string;
  monthlyRate: number;
  assignedTech: string;
  notes?: string;
  lat?: number;
  lng?: number;
}

export interface CustomerFormData {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  type: CustomerType;
  serviceFrequency: ServiceFrequency;
  monthlyRate: number;
  notes?: string;
}

interface CustomersContextType {
  customers: Customer[];
  loading: boolean;
  addCustomer: (data: CustomerFormData) => Customer;
  updateCustomer: (id: string, data: Partial<CustomerFormData>) => Customer | null;
  deleteCustomer: (id: string) => boolean;
  getCustomer: (id: string) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

// Initial mock data - Delaware Pool Pros demo data
// Realistic Delaware addresses and pool sizes for convention demo
const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Johnson Family',
    address: '1842 Baynard Blvd',
    city: 'Wilmington, DE 19802',
    phone: '(302) 555-1234',
    email: 'johnson@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    chemistry: { ph: 8.2, chlorine: 2.5, alkalinity: 95, lastReadingDate: '2026-01-24' },
    chemistryStatus: 'critical',
    chemistryAlert: 'pH high at Johnson - prevented $500 callback',
    monthlyRate: 660,
    assignedTech: 'Mike Rodriguez',
    notes: 'Gate code: 4521. 18,000 gallon inground pool. Salt system.',
  },
  {
    id: 'cust-2',
    name: 'Chen Residence',
    address: '245 Rockwood Rd',
    city: 'Wilmington, DE 19802',
    phone: '(302) 555-2345',
    email: 'chen@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    chemistry: { ph: 7.4, chlorine: 3.0, alkalinity: 100, lastReadingDate: '2026-01-24' },
    chemistryStatus: 'healthy',
    monthlyRate: 580,
    assignedTech: 'Mike Rodriguez',
    notes: '22,000 gallon pool with attached spa. Key under mat by back door.',
  },
  {
    id: 'cust-3',
    name: 'Williams Estate',
    address: '589 Kennett Pike',
    city: 'Greenville, DE 19807',
    phone: '(302) 555-3456',
    email: 'williams@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    chemistry: { ph: 7.6, chlorine: 0.8, alkalinity: 85, lastReadingDate: '2026-01-24' },
    chemistryStatus: 'attention',
    chemistryAlert: 'Low chlorine (0.8 ppm) - shock treatment scheduled',
    monthlyRate: 900,
    assignedTech: 'Sarah Chen',
    notes: '28,000 gallon infinity pool. Premium customer. Filter due for replacement.',
  },
  {
    id: 'cust-4',
    name: 'Thompson Home',
    address: '1120 Paper Mill Rd',
    city: 'Newark, DE 19711',
    phone: '(302) 555-4567',
    email: 'thompson@email.com',
    type: 'residential',
    serviceFrequency: 'bi-weekly',
    lastServiceDate: '2026-01-17',
    nextServiceDate: '2026-01-31',
    chemistry: { ph: 7.2, chlorine: 2.8, alkalinity: 90, lastReadingDate: '2026-01-17' },
    chemistryStatus: 'healthy',
    monthlyRate: 310,
    assignedTech: 'Jake Thompson',
    notes: '15,000 gallon above-ground pool. Winter cover on.',
  },
  {
    id: 'cust-5',
    name: 'Rehoboth Beach Club',
    address: '1 Virginia Ave',
    city: 'Rehoboth Beach, DE 19971',
    phone: '(302) 555-5678',
    email: 'manager@rehobothclub.com',
    type: 'commercial',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-25',
    nextServiceDate: '2026-02-01',
    chemistry: { ph: 7.5, chlorine: 3.5, alkalinity: 110, lastReadingDate: '2026-01-25' },
    chemistryStatus: 'healthy',
    monthlyRate: 2400,
    assignedTech: 'Mike Rodriguez',
    notes: '65,000 gallon commercial pool. Health dept inspections monthly.',
  },
  {
    id: 'cust-6',
    name: 'Garcia Family',
    address: '892 Old Baltimore Pike',
    city: 'Newark, DE 19702',
    phone: '(302) 555-6789',
    email: 'garcia@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-23',
    nextServiceDate: '2026-01-30',
    chemistry: { ph: 7.3, chlorine: 2.2, alkalinity: 88, lastReadingDate: '2026-01-23' },
    chemistryStatus: 'healthy',
    monthlyRate: 540,
    assignedTech: 'Sarah Chen',
    notes: '17,000 gallon pool. Dog is friendly but loud.',
  },
  {
    id: 'cust-7',
    name: 'Anderson Pool',
    address: '2234 Silverside Rd',
    city: 'Wilmington, DE 19810',
    phone: '(302) 555-7890',
    email: 'anderson@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-22',
    nextServiceDate: '2026-01-29',
    chemistry: { ph: 7.4, chlorine: 2.8, alkalinity: 92, lastReadingDate: '2026-01-22' },
    chemistryStatus: 'healthy',
    monthlyRate: 700,
    assignedTech: 'Jake Thompson',
    notes: '24,000 gallon lap pool. Heater serviced Dec 2025.',
  },
  {
    id: 'cust-8',
    name: 'Davis Residence',
    address: '456 Limestone Rd',
    city: 'Wilmington, DE 19804',
    phone: '(302) 555-8901',
    email: 'davis@email.com',
    type: 'residential',
    serviceFrequency: 'bi-weekly',
    lastServiceDate: '2026-01-12',
    nextServiceDate: '2026-01-26',
    chemistry: { ph: 7.4, chlorine: 2.6, alkalinity: 95, lastReadingDate: '2026-01-12' },
    chemistryStatus: 'healthy',
    monthlyRate: 290,
    assignedTech: 'Mike Rodriguez',
    notes: '16,000 gallon pool. Gate code: 7788.',
  },
  {
    id: 'cust-9',
    name: 'Wilson Family',
    address: '3421 Concord Pike',
    city: 'Wilmington, DE 19803',
    phone: '(302) 555-9012',
    email: 'wilson@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    chemistry: { ph: 7.5, chlorine: 3.2, alkalinity: 100, lastReadingDate: '2026-01-24' },
    chemistryStatus: 'healthy',
    monthlyRate: 780,
    assignedTech: 'Sarah Chen',
    notes: '25,000 gallon pool with waterfall feature.',
  },
  {
    id: 'cust-10',
    name: 'Harbor View HOA',
    address: '100 Harbor Dr',
    city: 'Lewes, DE 19958',
    phone: '(302) 555-0123',
    email: 'hoa@harborview.com',
    type: 'commercial',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-25',
    nextServiceDate: '2026-02-01',
    chemistry: { ph: 7.4, chlorine: 4.0, alkalinity: 105, lastReadingDate: '2026-01-25' },
    chemistryStatus: 'healthy',
    monthlyRate: 3200,
    assignedTech: 'Mike Rodriguez',
    notes: '55,000 gallon community pool. Filter replacement due.',
  },
  {
    id: 'cust-11',
    name: 'Brown Pool House',
    address: '789 Foulk Rd',
    city: 'Wilmington, DE 19803',
    phone: '(302) 555-1122',
    email: 'brown@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-23',
    nextServiceDate: '2026-01-30',
    chemistry: { ph: 7.6, chlorine: 2.4, alkalinity: 92, lastReadingDate: '2026-01-23' },
    chemistryStatus: 'healthy',
    monthlyRate: 660,
    assignedTech: 'Jake Thompson',
    notes: '19,000 gallon pool. Separate pool house with equipment.',
  },
  {
    id: 'cust-12',
    name: 'Miller Residence',
    address: '567 Capitol Trail',
    city: 'Newark, DE 19711',
    phone: '(302) 555-2233',
    email: 'miller@email.com',
    type: 'residential',
    serviceFrequency: 'bi-weekly',
    lastServiceDate: '2026-01-11',
    nextServiceDate: '2026-01-25',
    chemistry: { ph: 7.8, chlorine: 1.5, alkalinity: 82, lastReadingDate: '2026-01-11' },
    chemistryStatus: 'attention',
    chemistryAlert: 'pH trending high (7.8) - monitoring',
    monthlyRate: 310,
    assignedTech: 'Sarah Chen',
    notes: '15,500 gallon pool. Prefers text for appointments.',
  },
  {
    id: 'cust-13',
    name: 'Rodriguez Family',
    address: '1456 Marsh Rd',
    city: 'Wilmington, DE 19810',
    phone: '(302) 555-3344',
    email: 'rodriguez@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    chemistry: { ph: 7.3, chlorine: 2.9, alkalinity: 98, lastReadingDate: '2026-01-24' },
    chemistryStatus: 'healthy',
    monthlyRate: 580,
    assignedTech: 'Jake Thompson',
    notes: '20,000 gallon pool. Great referral source.',
  },
  {
    id: 'cust-14',
    name: 'Dover Country Club',
    address: '800 Country Club Rd',
    city: 'Dover, DE 19901',
    phone: '(302) 555-4455',
    email: 'facilities@dovercc.com',
    type: 'commercial',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-25',
    nextServiceDate: '2026-02-01',
    chemistry: { ph: 7.5, chlorine: 3.8, alkalinity: 102, lastReadingDate: '2026-01-25' },
    chemistryStatus: 'healthy',
    monthlyRate: 2800,
    assignedTech: 'Mike Rodriguez',
    notes: '70,000 gallon commercial pool. VIP account.',
  },
  {
    id: 'cust-15',
    name: 'Taylor Residence',
    address: '234 Kings Hwy',
    city: 'Lewes, DE 19958',
    phone: '(302) 555-5566',
    email: 'taylor@email.com',
    type: 'residential',
    serviceFrequency: 'monthly',
    lastServiceDate: '2026-01-05',
    nextServiceDate: '2026-02-05',
    chemistry: { ph: 7.7, chlorine: 2.0, alkalinity: 88, lastReadingDate: '2026-01-05' },
    chemistryStatus: 'attention',
    chemistryAlert: 'Reading 21 days old - check due',
    monthlyRate: 145,
    assignedTech: 'Sarah Chen',
    notes: 'Beach house. 12,000 gallon pool. Seasonal customer.',
  },
  {
    id: 'cust-16',
    name: 'Lee Family',
    address: '678 Christiana Rd',
    city: 'Newark, DE 19702',
    phone: '(302) 555-6677',
    email: 'lee@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-23',
    nextServiceDate: '2026-01-30',
    chemistry: { ph: 7.4, chlorine: 2.7, alkalinity: 94, lastReadingDate: '2026-01-23' },
    chemistryStatus: 'healthy',
    monthlyRate: 720,
    assignedTech: 'Jake Thompson',
    notes: '26,000 gallon pool. Spa attached. Premium salt system.',
  },
  {
    id: 'cust-17',
    name: 'Nguyen Home',
    address: '901 Philadelphia Pike',
    city: 'Wilmington, DE 19809',
    phone: '(302) 555-7788',
    email: 'nguyen@email.com',
    type: 'residential',
    serviceFrequency: 'weekly',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    chemistry: { ph: 7.5, chlorine: 3.1, alkalinity: 96, lastReadingDate: '2026-01-24' },
    chemistryStatus: 'healthy',
    monthlyRate: 540,
    assignedTech: 'Mike Rodriguez',
    notes: '18,500 gallon pool. Very particular about chemistry.',
  },
  {
    id: 'cust-18',
    name: 'Patel Residence',
    address: '345 Kirkwood Hwy',
    city: 'Newark, DE 19711',
    phone: '(302) 555-8899',
    email: 'patel@email.com',
    type: 'residential',
    serviceFrequency: 'bi-weekly',
    lastServiceDate: '2026-01-18',
    nextServiceDate: '2026-02-01',
    chemistry: { ph: 7.6, chlorine: 2.3, alkalinity: 91, lastReadingDate: '2026-01-18' },
    chemistryStatus: 'healthy',
    monthlyRate: 290,
    assignedTech: 'Sarah Chen',
    notes: '14,000 gallon pool. New customer - referred by Johnson.',
  },
];

const STORAGE_KEY = 'poolapp_customers';

// Helper to generate unique ID
function generateId(): string {
  return `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to calculate next service date based on frequency
function calculateNextServiceDate(frequency: ServiceFrequency): string {
  const today = new Date();
  const daysToAdd = frequency === 'weekly' ? 7 : frequency === 'bi-weekly' ? 14 : 30;
  const nextDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return nextDate.toISOString().split('T')[0];
}

// Helper to get default chemistry for new customers
function getDefaultChemistry(): ChemistryReading {
  const today = new Date().toISOString().split('T')[0];
  return {
    ph: 7.4,
    chlorine: 2.5,
    alkalinity: 95,
    lastReadingDate: today,
  };
}

function ensureCustomerGeo(customer: Customer): Customer {
  if (typeof customer.lat === 'number' && typeof customer.lng === 'number') {
    return customer;
  }
  const { lat, lng } = deriveLatLng(customer.address, customer.city);
  return { ...customer, lat, lng };
}

function ensureCustomersGeo(customers: Customer[]): Customer[] {
  return customers.map(ensureCustomerGeo);
}

// Technicians for assignment
const technicians = ['Mike Rodriguez', 'Sarah Chen', 'Jake Thompson'];

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load customers from storage on mount
  useEffect(() => {
    try {
      const storage = getDemoStorage();
      const stored = storage?.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hydrated = ensureCustomersGeo(parsed);
        setCustomers(hydrated);
        storage?.setItem(STORAGE_KEY, JSON.stringify(hydrated));
      } else {
        // Initialize with mock data if no stored data
        const hydrated = ensureCustomersGeo(initialCustomers);
        setCustomers(hydrated);
        storage?.setItem(STORAGE_KEY, JSON.stringify(hydrated));
      }
    } catch (error) {
      console.error('Error loading customers from localStorage:', error);
      setCustomers(initialCustomers);
    }
    setLoading(false);
  }, []);

  // Save to storage whenever customers change
  useEffect(() => {
    if (!loading && customers.length > 0) {
      try {
        const storage = getDemoStorage();
        storage?.setItem(STORAGE_KEY, JSON.stringify(customers));
      } catch (error) {
        console.error('Error saving customers to localStorage:', error);
      }
    }
  }, [customers, loading]);

  const addCustomer = useCallback((data: CustomerFormData): Customer => {
    const today = new Date().toISOString().split('T')[0];
    const newCustomer: Customer = {
      id: generateId(),
      name: data.name,
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
      type: data.type,
      serviceFrequency: data.serviceFrequency,
      lastServiceDate: today,
      nextServiceDate: calculateNextServiceDate(data.serviceFrequency),
      chemistry: getDefaultChemistry(),
      chemistryStatus: 'healthy',
      monthlyRate: data.monthlyRate,
      assignedTech: technicians[Math.floor(Math.random() * technicians.length)],
      notes: data.notes,
    };

    const withGeo = ensureCustomerGeo(newCustomer);
    setCustomers((prev) => [withGeo, ...prev]);
    return withGeo;
  }, []);

  const updateCustomer = useCallback((id: string, data: Partial<CustomerFormData>): Customer | null => {
    let updatedCustomer: Customer | null = null;

    setCustomers((prev) => {
      return prev.map((customer) => {
        if (customer.id === id) {
          updatedCustomer = {
            ...customer,
            ...data,
            // Recalculate next service date if frequency changed
            ...(data.serviceFrequency && data.serviceFrequency !== customer.serviceFrequency
              ? { nextServiceDate: calculateNextServiceDate(data.serviceFrequency) }
              : {}),
          };
          return updatedCustomer;
        }
        return customer;
      });
    });

    return updatedCustomer;
  }, []);

  const deleteCustomer = useCallback((id: string): boolean => {
    let found = false;
    setCustomers((prev) => {
      const filtered = prev.filter((customer) => {
        if (customer.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    return found;
  }, []);

  const getCustomer = useCallback((id: string): Customer | undefined => {
    return customers.find((customer) => customer.id === id);
  }, [customers]);

  return (
    <CustomersContext.Provider
      value={{
        customers,
        loading,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomer,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomersContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
}
