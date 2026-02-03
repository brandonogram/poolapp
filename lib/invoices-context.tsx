'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDemoStorage } from './demo-session';

export interface LineItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  lineItems: LineItem[];
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  paymentSpeed?: number; // days to payment
  notes?: string;
}

interface InvoicesContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'total' | 'status'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

// Initial mock data - Delaware Pool Pros demo
// Shows fast payment times (1-3 days) vs industry avg (7-10 days)
// Monthly total: ~$47,850 for a 3-tech company
const initialInvoices: Invoice[] = [
  // Week of Jan 20-26 (current week) - mostly paid quickly
  {
    id: 'INV-001',
    customerId: 'cust-1',
    customerName: 'Johnson Family',
    customerEmail: 'johnson@email.com',
    date: '2026-01-24',
    dueDate: '2026-02-07',
    lineItems: [
      { id: 'li-001', description: 'Weekly Pool Service (18,000 gal)', amount: 165 },
      { id: 'li-002', description: 'Salt Cell Cleaning', amount: 45 },
      { id: 'li-003', description: 'Chemical Balance', amount: 25 },
    ],
    total: 235,
    status: 'paid',
    paidDate: '2026-01-25',
    paymentSpeed: 1,
    notes: 'Same-day invoice, paid next morning',
  },
  {
    id: 'INV-002',
    customerId: 'cust-2',
    customerName: 'Chen Residence',
    customerEmail: 'chen@email.com',
    date: '2026-01-24',
    dueDate: '2026-02-07',
    lineItems: [
      { id: 'li-004', description: 'Weekly Pool & Spa Service (22,000 gal)', amount: 195 },
      { id: 'li-005', description: 'Chemical Treatment', amount: 30 },
    ],
    total: 225,
    status: 'paid',
    paidDate: '2026-01-25',
    paymentSpeed: 1,
  },
  {
    id: 'INV-003',
    customerId: 'cust-3',
    customerName: 'Williams Estate',
    customerEmail: 'williams@email.com',
    date: '2026-01-24',
    dueDate: '2026-02-07',
    lineItems: [
      { id: 'li-006', description: 'Premium Pool Service (28,000 gal infinity)', amount: 275 },
      { id: 'li-007', description: 'Waterfall Feature Cleaning', amount: 85 },
      { id: 'li-008', description: 'Chemical Treatment', amount: 40 },
    ],
    total: 400,
    status: 'paid',
    paidDate: '2026-01-26',
    paymentSpeed: 2,
  },
  {
    id: 'INV-004',
    customerId: 'cust-5',
    customerName: 'Rehoboth Beach Club',
    customerEmail: 'manager@rehobothclub.com',
    date: '2026-01-25',
    dueDate: '2026-02-08',
    lineItems: [
      { id: 'li-009', description: 'Commercial Pool Service (65,000 gal)', amount: 450 },
      { id: 'li-010', description: 'Chemical Treatment - Commercial Grade', amount: 150 },
      { id: 'li-011', description: 'Health Dept Compliance Check', amount: 100 },
    ],
    total: 700,
    status: 'paid',
    paidDate: '2026-01-26',
    paymentSpeed: 1,
    notes: 'Commercial account - auto-pay enabled',
  },
  {
    id: 'INV-005',
    customerId: 'cust-6',
    customerName: 'Garcia Family',
    customerEmail: 'garcia@email.com',
    date: '2026-01-23',
    dueDate: '2026-02-06',
    lineItems: [
      { id: 'li-012', description: 'Weekly Pool Service (17,000 gal)', amount: 145 },
      { id: 'li-013', description: 'Chemical Treatment', amount: 25 },
    ],
    total: 170,
    status: 'paid',
    paidDate: '2026-01-24',
    paymentSpeed: 1,
  },
  {
    id: 'INV-006',
    customerId: 'cust-7',
    customerName: 'Anderson Pool',
    customerEmail: 'anderson@email.com',
    date: '2026-01-22',
    dueDate: '2026-02-05',
    lineItems: [
      { id: 'li-014', description: 'Lap Pool Service (24,000 gal)', amount: 185 },
      { id: 'li-015', description: 'Heater Inspection', amount: 65 },
      { id: 'li-016', description: 'Chemical Treatment', amount: 30 },
    ],
    total: 280,
    status: 'paid',
    paidDate: '2026-01-24',
    paymentSpeed: 2,
  },
  {
    id: 'INV-007',
    customerId: 'cust-9',
    customerName: 'Wilson Family',
    customerEmail: 'wilson@email.com',
    date: '2026-01-24',
    dueDate: '2026-02-07',
    lineItems: [
      { id: 'li-017', description: 'Premium Pool Service (25,000 gal)', amount: 195 },
      { id: 'li-018', description: 'Waterfall Cleaning', amount: 50 },
      { id: 'li-019', description: 'Chemical Treatment', amount: 35 },
    ],
    total: 280,
    status: 'paid',
    paidDate: '2026-01-26',
    paymentSpeed: 2,
  },
  {
    id: 'INV-008',
    customerId: 'cust-10',
    customerName: 'Harbor View HOA',
    customerEmail: 'hoa@harborview.com',
    date: '2026-01-25',
    dueDate: '2026-02-08',
    lineItems: [
      { id: 'li-020', description: 'Community Pool Service (55,000 gal)', amount: 550 },
      { id: 'li-021', description: 'Chemical Treatment - Large Volume', amount: 125 },
      { id: 'li-022', description: 'Filter Inspection', amount: 75 },
    ],
    total: 750,
    status: 'paid',
    paidDate: '2026-01-26',
    paymentSpeed: 1,
    notes: 'HOA account - net 30 but pays immediately',
  },
  {
    id: 'INV-009',
    customerId: 'cust-11',
    customerName: 'Brown Pool House',
    customerEmail: 'brown@email.com',
    date: '2026-01-23',
    dueDate: '2026-02-06',
    lineItems: [
      { id: 'li-023', description: 'Weekly Pool Service (19,000 gal)', amount: 165 },
      { id: 'li-024', description: 'Chemical Treatment', amount: 25 },
    ],
    total: 190,
    status: 'paid',
    paidDate: '2026-01-25',
    paymentSpeed: 2,
  },
  {
    id: 'INV-010',
    customerId: 'cust-13',
    customerName: 'Rodriguez Family',
    customerEmail: 'rodriguez@email.com',
    date: '2026-01-24',
    dueDate: '2026-02-07',
    lineItems: [
      { id: 'li-025', description: 'Weekly Pool Service (20,000 gal)', amount: 155 },
      { id: 'li-026', description: 'Chemical Treatment', amount: 25 },
    ],
    total: 180,
    status: 'paid',
    paidDate: '2026-01-25',
    paymentSpeed: 1,
  },
  {
    id: 'INV-011',
    customerId: 'cust-14',
    customerName: 'Dover Country Club',
    customerEmail: 'facilities@dovercc.com',
    date: '2026-01-25',
    dueDate: '2026-02-08',
    lineItems: [
      { id: 'li-027', description: 'Commercial Pool Service (70,000 gal)', amount: 550 },
      { id: 'li-028', description: 'Commercial Chemical Package', amount: 175 },
      { id: 'li-029', description: 'Equipment Inspection', amount: 100 },
    ],
    total: 825,
    status: 'paid',
    paidDate: '2026-01-26',
    paymentSpeed: 1,
    notes: 'VIP commercial account',
  },
  {
    id: 'INV-012',
    customerId: 'cust-16',
    customerName: 'Lee Family',
    customerEmail: 'lee@email.com',
    date: '2026-01-23',
    dueDate: '2026-02-06',
    lineItems: [
      { id: 'li-030', description: 'Premium Pool & Spa Service (26,000 gal)', amount: 225 },
      { id: 'li-031', description: 'Salt System Maintenance', amount: 55 },
      { id: 'li-032', description: 'Chemical Treatment', amount: 35 },
    ],
    total: 315,
    status: 'paid',
    paidDate: '2026-01-24',
    paymentSpeed: 1,
  },
  {
    id: 'INV-013',
    customerId: 'cust-17',
    customerName: 'Nguyen Home',
    customerEmail: 'nguyen@email.com',
    date: '2026-01-24',
    dueDate: '2026-02-07',
    lineItems: [
      { id: 'li-033', description: 'Weekly Pool Service (18,500 gal)', amount: 145 },
      { id: 'li-034', description: 'Chemical Treatment', amount: 25 },
    ],
    total: 170,
    status: 'paid',
    paidDate: '2026-01-26',
    paymentSpeed: 2,
  },
  // Pending invoices (just sent - normal for recent services)
  {
    id: 'INV-014',
    customerId: 'cust-8',
    customerName: 'Davis Residence',
    customerEmail: 'davis@email.com',
    date: '2026-01-26',
    dueDate: '2026-02-09',
    lineItems: [
      { id: 'li-035', description: 'Bi-weekly Pool Service (16,000 gal)', amount: 145 },
      { id: 'li-036', description: 'Chemical Treatment', amount: 25 },
    ],
    total: 170,
    status: 'pending',
    notes: 'Sent today - customer usually pays within 24hrs',
  },
  {
    id: 'INV-015',
    customerId: 'cust-4',
    customerName: 'Thompson Home',
    customerEmail: 'thompson@email.com',
    date: '2026-01-26',
    dueDate: '2026-02-09',
    lineItems: [
      { id: 'li-037', description: 'Bi-weekly Pool Service (15,000 gal)', amount: 155 },
      { id: 'li-038', description: 'Winter Cover Inspection', amount: 45 },
    ],
    total: 200,
    status: 'pending',
    notes: 'Opening season prep invoice',
  },
  // Small overdue - only one to show good collection
  {
    id: 'INV-016',
    customerId: 'cust-15',
    customerName: 'Taylor Residence',
    customerEmail: 'taylor@email.com',
    date: '2026-01-05',
    dueDate: '2026-01-19',
    lineItems: [
      { id: 'li-039', description: 'Monthly Pool Service (12,000 gal)', amount: 145 },
    ],
    total: 145,
    status: 'overdue',
    notes: 'Beach house - customer traveling, will pay on return',
  },
];

const STORAGE_KEY = 'poolapp-invoices';

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const storage = getDemoStorage();
    const saved = storage?.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInvoices(parsed);
      } catch (e) {
        console.error('Failed to load invoices from localStorage:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to storage on change
  useEffect(() => {
    if (isLoaded) {
      const storage = getDemoStorage();
      storage?.setItem(STORAGE_KEY, JSON.stringify(invoices));
    }
  }, [invoices, isLoaded]);

  const generateId = useCallback(() => {
    const maxId = invoices.reduce((max, inv) => {
      const num = parseInt(inv.id.replace('INV-', ''), 10);
      return num > max ? num : max;
    }, 0);
    return `INV-${String(maxId + 1).padStart(3, '0')}`;
  }, [invoices]);

  const calculateTotal = (lineItems: LineItem[]) => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const addInvoice = useCallback((invoiceData: Omit<Invoice, 'id' | 'total' | 'status'>): Invoice => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateId(),
      total: calculateTotal(invoiceData.lineItems),
      status: 'pending',
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  }, [generateId]);

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== id) return inv;
      const updated = { ...inv, ...updates };
      // Recalculate total if line items changed
      if (updates.lineItems) {
        updated.total = calculateTotal(updates.lineItems);
      }
      return updated;
    }));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const markAsPaid = useCallback((id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== id) return inv;
      const invoiceDate = new Date(inv.date);
      const paidDate = new Date(today);
      const daysDiff = Math.ceil((paidDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        ...inv,
        status: 'paid' as const,
        paidDate: today,
        paymentSpeed: daysDiff,
      };
    }));
  }, []);

  const getInvoiceById = useCallback((id: string) => {
    return invoices.find(inv => inv.id === id);
  }, [invoices]);

  return (
    <InvoicesContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid,
      getInvoiceById,
    }}>
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
}
