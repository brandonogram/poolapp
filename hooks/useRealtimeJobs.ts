'use client';

/**
 * Pool App - Real-time Jobs Hook
 * Custom hook for subscribing to real-time job updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { ServiceJob, ServiceJobWithDetails } from '@/lib/types/database';

// =============================================================================
// Types
// =============================================================================

export interface UseRealtimeJobsOptions {
  /** Date to filter jobs by (YYYY-MM-DD format, defaults to today) */
  date?: string;
  /** Whether to auto-fetch job details with relations */
  includeDetails?: boolean;
  /** Whether to auto-connect on mount (default: true) */
  autoConnect?: boolean;
}

export interface UseRealtimeJobsReturn {
  /** Array of jobs */
  jobs: ServiceJobWithDetails[];
  /** Whether the initial load is in progress */
  loading: boolean;
  /** Whether connected to real-time updates */
  isConnected: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Manually refresh the jobs list */
  refresh: () => Promise<void>;
  /** Manually connect to real-time updates */
  connect: () => void;
  /** Manually disconnect from real-time updates */
  disconnect: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for subscribing to real-time job updates
 * @param companyId - The company ID to subscribe to
 * @param options - Optional configuration
 * @returns Jobs array, loading state, connection status, and control functions
 */
export function useRealtimeJobs(
  companyId: string,
  options: UseRealtimeJobsOptions = {}
): UseRealtimeJobsReturn {
  const {
    date = new Date().toISOString().split('T')[0],
    includeDetails = true,
    autoConnect = true,
  } = options;

  const [jobs, setJobs] = useState<ServiceJobWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track the channel for cleanup
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch jobs function
  const fetchJobs = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('service_jobs').select(
        includeDetails
          ? `
              *,
              customer:customers(*),
              pool:pools(*),
              technician:technicians(*),
              schedule:service_schedules(*)
            `
          : '*'
      );

      query = query.eq('company_id', companyId);

      if (date) {
        query = query.eq('scheduled_date', date);
      }

      query = query
        .order('route_order', { ascending: true, nullsFirst: false })
        .order('scheduled_time', { ascending: true, nullsFirst: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setJobs((data as ServiceJobWithDetails[]) || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  }, [companyId, date, includeDetails]);

  // Connect to real-time updates
  const connect = useCallback(() => {
    if (!companyId || channelRef.current) return;

    const channel = supabase
      .channel(`realtime_jobs_${companyId}_${date}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_jobs',
          filter: `company_id=eq.${companyId}`,
        },
        async (payload) => {
          const eventType = payload.eventType;
          const newRecord = payload.new as ServiceJob | null;
          const oldRecord = payload.old as ServiceJob | null;

          // Only process if the job matches our date filter
          if (newRecord?.scheduled_date !== date && oldRecord?.scheduled_date !== date) {
            return;
          }

          if (eventType === 'INSERT') {
            // Fetch the full job with details
            if (includeDetails && newRecord) {
              const { data } = await supabase
                .from('service_jobs')
                .select(`
                  *,
                  customer:customers(*),
                  pool:pools(*),
                  technician:technicians(*),
                  schedule:service_schedules(*)
                `)
                .eq('id', newRecord.id)
                .single();

              if (data) {
                setJobs((prev) => [...prev, data as ServiceJobWithDetails]);
              }
            } else if (newRecord) {
              setJobs((prev) => [...prev, newRecord as ServiceJobWithDetails]);
            }
          } else if (eventType === 'UPDATE') {
            if (includeDetails && newRecord) {
              // Fetch updated job with details
              const { data } = await supabase
                .from('service_jobs')
                .select(`
                  *,
                  customer:customers(*),
                  pool:pools(*),
                  technician:technicians(*),
                  schedule:service_schedules(*)
                `)
                .eq('id', newRecord.id)
                .single();

              if (data) {
                setJobs((prev) =>
                  prev.map((job) =>
                    job.id === newRecord.id ? (data as ServiceJobWithDetails) : job
                  )
                );
              }
            } else if (newRecord) {
              setJobs((prev) =>
                prev.map((job) =>
                  job.id === newRecord.id ? (newRecord as ServiceJobWithDetails) : job
                )
              );
            }
          } else if (eventType === 'DELETE' && oldRecord) {
            setJobs((prev) => prev.filter((job) => job.id !== oldRecord.id));
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'CHANNEL_ERROR') {
          setError(new Error('Failed to connect to real-time updates'));
        }
      });

    channelRef.current = channel;
  }, [companyId, date, includeDetails]);

  // Disconnect from real-time updates
  const disconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Refresh function
  const refresh = useCallback(async () => {
    await fetchJobs();
  }, [fetchJobs]);

  // Initial fetch and subscription
  useEffect(() => {
    fetchJobs();

    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      disconnect();
    };
  }, [fetchJobs, connect, disconnect, autoConnect]);

  return {
    jobs,
    loading,
    isConnected,
    error,
    refresh,
    connect,
    disconnect,
  };
}

// =============================================================================
// Additional Hooks
// =============================================================================

/**
 * Hook for subscribing to a single technician's jobs
 * @param technicianId - The technician ID
 * @param options - Optional configuration
 */
export function useRealtimeTechnicianJobs(
  technicianId: string,
  options: UseRealtimeJobsOptions = {}
): UseRealtimeJobsReturn {
  const {
    date = new Date().toISOString().split('T')[0],
    includeDetails = true,
    autoConnect = true,
  } = options;

  const [jobs, setJobs] = useState<ServiceJobWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!technicianId) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('service_jobs').select(
        includeDetails
          ? `
              *,
              customer:customers(*),
              pool:pools(*),
              technician:technicians(*),
              schedule:service_schedules(*)
            `
          : '*'
      );

      query = query.eq('technician_id', technicianId);

      if (date) {
        query = query.eq('scheduled_date', date);
      }

      query = query
        .order('route_order', { ascending: true, nullsFirst: false })
        .order('scheduled_time', { ascending: true, nullsFirst: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setJobs((data as ServiceJobWithDetails[]) || []);
    } catch (err) {
      console.error('Error fetching technician jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  }, [technicianId, date, includeDetails]);

  const connect = useCallback(() => {
    if (!technicianId || channelRef.current) return;

    const channel = supabase
      .channel(`realtime_tech_jobs_${technicianId}_${date}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_jobs',
          filter: `technician_id=eq.${technicianId}`,
        },
        async (payload) => {
          const eventType = payload.eventType;
          const newRecord = payload.new as ServiceJob | null;
          const oldRecord = payload.old as ServiceJob | null;

          if (newRecord?.scheduled_date !== date && oldRecord?.scheduled_date !== date) {
            return;
          }

          if (eventType === 'INSERT' && newRecord) {
            if (includeDetails) {
              const { data } = await supabase
                .from('service_jobs')
                .select(`
                  *,
                  customer:customers(*),
                  pool:pools(*),
                  technician:technicians(*),
                  schedule:service_schedules(*)
                `)
                .eq('id', newRecord.id)
                .single();

              if (data) {
                setJobs((prev) => [...prev, data as ServiceJobWithDetails]);
              }
            } else {
              setJobs((prev) => [...prev, newRecord as ServiceJobWithDetails]);
            }
          } else if (eventType === 'UPDATE' && newRecord) {
            if (includeDetails) {
              const { data } = await supabase
                .from('service_jobs')
                .select(`
                  *,
                  customer:customers(*),
                  pool:pools(*),
                  technician:technicians(*),
                  schedule:service_schedules(*)
                `)
                .eq('id', newRecord.id)
                .single();

              if (data) {
                setJobs((prev) =>
                  prev.map((job) =>
                    job.id === newRecord.id ? (data as ServiceJobWithDetails) : job
                  )
                );
              }
            } else {
              setJobs((prev) =>
                prev.map((job) =>
                  job.id === newRecord.id ? (newRecord as ServiceJobWithDetails) : job
                )
              );
            }
          } else if (eventType === 'DELETE' && oldRecord) {
            setJobs((prev) => prev.filter((job) => job.id !== oldRecord.id));
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'CHANNEL_ERROR') {
          setError(new Error('Failed to connect to real-time updates'));
        }
      });

    channelRef.current = channel;
  }, [technicianId, date, includeDetails]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchJobs();

    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [fetchJobs, connect, disconnect, autoConnect]);

  return {
    jobs,
    loading,
    isConnected,
    error,
    refresh,
    connect,
    disconnect,
  };
}
