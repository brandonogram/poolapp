/**
 * Pool App - Data Hooks
 * React hooks for fetching and managing data
 * Currently returns mock data, structured for easy migration to Supabase
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Company,
  Technician,
  Customer,
  Pool,
  ServiceJob,
  ServiceSchedule,
  ServiceLog,
  Route,
  Invoice,
  CustomerWithPools,
  ServiceJobWithDetails,
  RouteWithDetails,
} from '@/lib/types/database';
import {
  mockCompany,
  mockTechnicians,
  mockCustomers,
  mockPools,
  mockServiceJobs,
  mockServiceSchedules,
  mockServiceLogs,
  mockRoutes,
  mockInvoices,
  getCustomersWithPools,
  getServiceJobsWithDetails,
  getDashboardStats,
  type DashboardStats,
} from '@/lib/data/mock-data';

// =============================================================================
// Types
// =============================================================================

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseDataListResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// =============================================================================
// Utility Hook for Simulating Async Data Fetching
// =============================================================================

function useAsyncData<T>(
  fetchFn: () => T,
  deps: React.DependencyList = []
): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);

    // Simulate async fetch with small delay
    const timeoutId = setTimeout(() => {
      try {
        const result = fetchFn();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    }, 100); // Small delay to simulate network

    return () => clearTimeout(timeoutId);
  }, [fetchFn]);

  useEffect(() => {
    const cleanup = fetch();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetch };
}

function useAsyncDataList<T>(
  fetchFn: () => T[],
  deps: React.DependencyList = []
): UseDataListResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      try {
        const result = fetchFn();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [fetchFn]);

  useEffect(() => {
    const cleanup = fetch();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetch };
}

// =============================================================================
// Company Hook
// =============================================================================

/**
 * Hook to get the current company
 * In production, this will fetch based on the authenticated user's company_id
 */
export function useCompany(): UseDataResult<Company> {
  return useAsyncData(() => mockCompany, []);
}

// =============================================================================
// Technicians Hooks
// =============================================================================

/**
 * Hook to get all technicians for the company
 */
export function useTechnicians(): UseDataListResult<Technician> {
  return useAsyncDataList(() => mockTechnicians, []);
}

/**
 * Hook to get a specific technician by ID
 */
export function useTechnician(id: string | undefined): UseDataResult<Technician> {
  return useAsyncData(
    () => {
      if (!id) throw new Error('Technician ID required');
      const technician = mockTechnicians.find((t) => t.id === id);
      if (!technician) throw new Error('Technician not found');
      return technician;
    },
    [id]
  );
}

// =============================================================================
// Customers Hooks
// =============================================================================

/**
 * Hook to get all customers for the company
 */
export function useCustomers(): UseDataListResult<Customer> {
  return useAsyncDataList(() => mockCustomers.filter((c) => c.is_active), []);
}

/**
 * Hook to get all customers with their pools
 */
export function useCustomersWithPools(): UseDataListResult<CustomerWithPools> {
  return useAsyncDataList(() => getCustomersWithPools().filter((c) => c.is_active), []);
}

/**
 * Hook to get a specific customer by ID
 */
export function useCustomer(id: string | undefined): UseDataResult<Customer> {
  return useAsyncData(
    () => {
      if (!id) throw new Error('Customer ID required');
      const customer = mockCustomers.find((c) => c.id === id);
      if (!customer) throw new Error('Customer not found');
      return customer;
    },
    [id]
  );
}

/**
 * Hook to get a customer with their pools
 */
export function useCustomerWithPools(id: string | undefined): UseDataResult<CustomerWithPools> {
  return useAsyncData(
    () => {
      if (!id) throw new Error('Customer ID required');
      const customers = getCustomersWithPools();
      const customer = customers.find((c) => c.id === id);
      if (!customer) throw new Error('Customer not found');
      return customer;
    },
    [id]
  );
}

// =============================================================================
// Pools Hooks
// =============================================================================

/**
 * Hook to get all pools for the company
 */
export function usePools(): UseDataListResult<Pool> {
  return useAsyncDataList(() => mockPools, []);
}

/**
 * Hook to get pools for a specific customer
 */
export function useCustomerPools(customerId: string | undefined): UseDataListResult<Pool> {
  return useAsyncDataList(
    () => {
      if (!customerId) return [];
      return mockPools.filter((p) => p.customer_id === customerId);
    },
    [customerId]
  );
}

/**
 * Hook to get a specific pool by ID
 */
export function usePool(id: string | undefined): UseDataResult<Pool> {
  return useAsyncData(
    () => {
      if (!id) throw new Error('Pool ID required');
      const pool = mockPools.find((p) => p.id === id);
      if (!pool) throw new Error('Pool not found');
      return pool;
    },
    [id]
  );
}

// =============================================================================
// Service Schedule Hooks
// =============================================================================

/**
 * Hook to get all service schedules
 */
export function useServiceSchedules(): UseDataListResult<ServiceSchedule> {
  return useAsyncDataList(() => mockServiceSchedules.filter((s) => s.is_active), []);
}

/**
 * Hook to get schedules for a specific customer
 */
export function useCustomerSchedules(customerId: string | undefined): UseDataListResult<ServiceSchedule> {
  return useAsyncDataList(
    () => {
      if (!customerId) return [];
      return mockServiceSchedules.filter((s) => s.customer_id === customerId && s.is_active);
    },
    [customerId]
  );
}

// =============================================================================
// Service Jobs Hooks
// =============================================================================

/**
 * Hook to get service jobs for a specific date
 */
export function useServiceJobs(date?: string): UseDataListResult<ServiceJob> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useAsyncDataList(
    () => mockServiceJobs.filter((job) => job.scheduled_date === targetDate),
    [targetDate]
  );
}

/**
 * Hook to get service jobs with full details for a specific date
 */
export function useServiceJobsWithDetails(date?: string): UseDataListResult<ServiceJobWithDetails> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useAsyncDataList(
    () => getServiceJobsWithDetails(targetDate),
    [targetDate]
  );
}

/**
 * Hook to get service jobs for a specific technician
 */
export function useTechnicianJobs(
  technicianId: string | undefined,
  date?: string
): UseDataListResult<ServiceJobWithDetails> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useAsyncDataList(
    () => {
      if (!technicianId) return [];
      return getServiceJobsWithDetails(targetDate).filter(
        (job) => job.technician_id === technicianId
      );
    },
    [technicianId, targetDate]
  );
}

/**
 * Hook to get a specific service job by ID
 */
export function useServiceJob(id: string | undefined): UseDataResult<ServiceJobWithDetails> {
  return useAsyncData(
    () => {
      if (!id) throw new Error('Job ID required');
      const jobs = getServiceJobsWithDetails();
      const job = jobs.find((j) => j.id === id);
      if (!job) throw new Error('Job not found');
      return job;
    },
    [id]
  );
}

// =============================================================================
// Service Logs Hooks
// =============================================================================

/**
 * Hook to get service logs
 */
export function useServiceLogs(): UseDataListResult<ServiceLog> {
  return useAsyncDataList(() => mockServiceLogs, []);
}

/**
 * Hook to get service log for a specific job
 */
export function useServiceLogForJob(jobId: string | undefined): UseDataResult<ServiceLog> {
  return useAsyncData(
    () => {
      if (!jobId) throw new Error('Job ID required');
      const log = mockServiceLogs.find((l) => l.job_id === jobId);
      if (!log) throw new Error('Service log not found');
      return log;
    },
    [jobId]
  );
}

// =============================================================================
// Routes Hooks
// =============================================================================

/**
 * Hook to get routes for a specific date
 */
export function useRoutes(date?: string): UseDataListResult<Route> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useAsyncDataList(
    () => mockRoutes.filter((route) => route.date === targetDate),
    [targetDate]
  );
}

/**
 * Hook to get routes with full details
 */
export function useRoutesWithDetails(date?: string): UseDataListResult<RouteWithDetails> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useAsyncDataList(
    () => {
      const routes = mockRoutes.filter((route) => route.date === targetDate);
      const jobsWithDetails = getServiceJobsWithDetails(targetDate);

      return routes.map((route) => {
        const technician = mockTechnicians.find((t) => t.id === route.technician_id)!;
        const jobs = jobsWithDetails
          .filter((job) => job.route_id === route.id)
          .sort((a, b) => (a.route_order || 0) - (b.route_order || 0));

        return {
          ...route,
          technician,
          jobs,
        };
      });
    },
    [targetDate]
  );
}

/**
 * Hook to get a specific route for a technician and date
 */
export function useTechnicianRoute(
  technicianId: string | undefined,
  date?: string
): UseDataResult<RouteWithDetails> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  return useAsyncData(
    () => {
      if (!technicianId) throw new Error('Technician ID required');

      const route = mockRoutes.find(
        (r) => r.technician_id === technicianId && r.date === targetDate
      );
      if (!route) throw new Error('Route not found');

      const technician = mockTechnicians.find((t) => t.id === technicianId)!;
      const jobs = getServiceJobsWithDetails(targetDate)
        .filter((job) => job.route_id === route.id)
        .sort((a, b) => (a.route_order || 0) - (b.route_order || 0));

      return {
        ...route,
        technician,
        jobs,
      };
    },
    [technicianId, targetDate]
  );
}

// =============================================================================
// Invoices Hooks
// =============================================================================

/**
 * Hook to get all invoices
 */
export function useInvoices(): UseDataListResult<Invoice> {
  return useAsyncDataList(() => mockInvoices, []);
}

/**
 * Hook to get invoices for a specific customer
 */
export function useCustomerInvoices(customerId: string | undefined): UseDataListResult<Invoice> {
  return useAsyncDataList(
    () => {
      if (!customerId) return [];
      return mockInvoices.filter((inv) => inv.customer_id === customerId);
    },
    [customerId]
  );
}

// =============================================================================
// Dashboard Stats Hook
// =============================================================================

/**
 * Hook to get dashboard statistics
 */
export function useDashboardStats(): UseDataResult<DashboardStats> {
  return useAsyncData(() => getDashboardStats(), []);
}

// =============================================================================
// Search Hook
// =============================================================================

interface SearchResults {
  customers: Customer[];
  pools: Pool[];
}

/**
 * Hook for searching customers and pools
 */
export function useSearch(query: string): UseDataResult<SearchResults> {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return useAsyncData(
    () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return { customers: [], pools: [] };
      }

      const lowerQuery = debouncedQuery.toLowerCase();

      const customers = mockCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.address.toLowerCase().includes(lowerQuery) ||
          c.city.toLowerCase().includes(lowerQuery) ||
          c.email?.toLowerCase().includes(lowerQuery) ||
          c.phone?.includes(debouncedQuery)
      );

      const pools = mockPools.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          mockCustomers.find((c) => c.id === p.customer_id)?.name.toLowerCase().includes(lowerQuery)
      );

      return { customers, pools };
    },
    [debouncedQuery]
  );
}

// =============================================================================
// Today's Overview Hook (combines multiple data points)
// =============================================================================

interface TodayOverview {
  stats: DashboardStats;
  routes: RouteWithDetails[];
  recentLogs: ServiceLog[];
}

/**
 * Hook to get today's overview data for the dashboard
 */
export function useTodayOverview(): UseDataResult<TodayOverview> {
  const today = new Date().toISOString().split('T')[0];

  return useAsyncData(
    () => {
      const stats = getDashboardStats();

      const routes = mockRoutes
        .filter((route) => route.date === today)
        .map((route) => {
          const technician = mockTechnicians.find((t) => t.id === route.technician_id)!;
          const jobs = getServiceJobsWithDetails(today)
            .filter((job) => job.route_id === route.id)
            .sort((a, b) => (a.route_order || 0) - (b.route_order || 0));

          return { ...route, technician, jobs };
        });

      // Get recent logs (last 5)
      const recentLogs = [...mockServiceLogs]
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
        .slice(0, 5);

      return { stats, routes, recentLogs };
    },
    [today]
  );
}

// =============================================================================
// Export All Hooks
// =============================================================================

export {
  type UseDataResult,
  type UseDataListResult,
  type DashboardStats,
  type SearchResults,
  type TodayOverview,
};
