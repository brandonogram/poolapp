// @ts-nocheck
/**
 * Pool App - Job Completion Workflow
 * Handles job status transitions, photo uploads, and job queue management
 * Note: @ts-nocheck used until Supabase types are fully configured
 */

import { supabase, subscribeToTable } from '@/lib/supabase/client';
import type {
  UUID,
  Timestamp,
  ServiceJob,
  ServiceLog,
  JobStatus,
  ServiceJobWithDetails
} from '@/lib/types/database';

// =============================================================================
// Types
// =============================================================================

export interface JobCompletionData {
  notes?: string;
  photos?: string[];
  arrival_lat?: number;
  arrival_lng?: number;
  // Chemistry readings
  free_chlorine?: number;
  ph?: number;
  alkalinity?: number;
  cyanuric_acid?: number;
  calcium_hardness?: number;
  salt_level?: number;
  water_temp?: number;
  // Tasks completed
  brushed?: boolean;
  skimmed?: boolean;
  vacuumed?: boolean;
  filter_cleaned?: boolean;
  baskets_emptied?: boolean;
  // Chemicals
  chemicals_added?: {
    chemicals: Array<{
      name: string;
      amount: number;
      unit: 'oz' | 'lb' | 'gal' | 'qt' | 'bag';
    }>;
  };
  signature_url?: string;
}

export interface JobSubscriptionPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: ServiceJob | null;
  old: ServiceJob | null;
}

// =============================================================================
// Job Status Management
// =============================================================================

/**
 * Start a job (transition from scheduled to in_progress)
 * @param jobId - The job ID to start
 * @param technicianId - The technician starting the job
 * @returns The updated job
 */
export async function startJob(
  jobId: string,
  technicianId: string
): Promise<ServiceJob> {
  const { data, error } = await supabase
    .from('service_jobs')
    .update({
      status: 'in_progress' as JobStatus,
      technician_id: technicianId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error starting job:', error);
    throw error;
  }

  return data;
}

/**
 * Mark a job as complete and create a service log
 * @param jobId - The job ID to complete
 * @param technicianId - The technician completing the job
 * @param photos - Array of photo URLs
 * @param completionData - Additional completion data
 * @returns The created service log
 */
export async function markJobComplete(
  jobId: string,
  technicianId: string,
  photos: string[] = [],
  completionData?: JobCompletionData
): Promise<ServiceLog> {
  // First, get the job details
  const { data: job, error: jobError } = await supabase
    .from('service_jobs')
    .select('*, customers(company_id)')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    console.error('Error fetching job:', jobError);
    throw jobError || new Error('Job not found');
  }

  const now = new Date().toISOString();
  const companyId = (job as ServiceJob & { customers: { company_id: string } }).customers.company_id;

  // Create the service log
  const serviceLogData = {
    company_id: companyId,
    job_id: jobId,
    technician_id: technicianId,
    started_at: now, // In a real app, this would be tracked from when job started
    completed_at: now,
    arrival_lat: completionData?.arrival_lat ?? null,
    arrival_lng: completionData?.arrival_lng ?? null,
    free_chlorine: completionData?.free_chlorine ?? null,
    ph: completionData?.ph ?? null,
    alkalinity: completionData?.alkalinity ?? null,
    cyanuric_acid: completionData?.cyanuric_acid ?? null,
    calcium_hardness: completionData?.calcium_hardness ?? null,
    salt_level: completionData?.salt_level ?? null,
    water_temp: completionData?.water_temp ?? null,
    brushed: completionData?.brushed ?? false,
    skimmed: completionData?.skimmed ?? false,
    vacuumed: completionData?.vacuumed ?? false,
    filter_cleaned: completionData?.filter_cleaned ?? false,
    baskets_emptied: completionData?.baskets_emptied ?? false,
    chemicals_added: completionData?.chemicals_added ?? null,
    notes: completionData?.notes ?? null,
    photo_urls: [...photos, ...(completionData?.photos || [])],
    signature_url: completionData?.signature_url ?? null,
  };

  // Use a transaction-like pattern with Promise.all
  const [logResult, jobUpdateResult] = await Promise.all([
    supabase.from('service_logs').insert(serviceLogData).select().single(),
    supabase
      .from('service_jobs')
      .update({
        status: 'completed' as JobStatus,
        updated_at: now,
      })
      .eq('id', jobId)
      .select()
      .single(),
  ]);

  if (logResult.error) {
    console.error('Error creating service log:', logResult.error);
    throw logResult.error;
  }

  if (jobUpdateResult.error) {
    console.error('Error updating job status:', jobUpdateResult.error);
    throw jobUpdateResult.error;
  }

  return logResult.data;
}

/**
 * Skip a job with a reason
 * @param jobId - The job ID to skip
 * @param reason - Reason for skipping
 * @returns The updated job
 */
export async function skipJob(
  jobId: string,
  reason?: string
): Promise<ServiceJob> {
  const { data, error } = await supabase
    .from('service_jobs')
    .update({
      status: 'skipped' as JobStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error skipping job:', error);
    throw error;
  }

  return data;
}

/**
 * Cancel a job
 * @param jobId - The job ID to cancel
 * @returns The updated job
 */
export async function cancelJob(jobId: string): Promise<ServiceJob> {
  const { data, error } = await supabase
    .from('service_jobs')
    .update({
      status: 'cancelled' as JobStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error cancelling job:', error);
    throw error;
  }

  return data;
}

// =============================================================================
// Job Queue Management
// =============================================================================

/**
 * Get the next pending job for a technician
 * @param technicianId - The technician ID
 * @param date - Optional date filter (defaults to today)
 * @returns The next pending job or null
 */
export async function getNextJob(
  technicianId: string,
  date?: string
): Promise<ServiceJobWithDetails | null> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('service_jobs')
    .select(`
      *,
      customer:customers(*),
      pool:pools(*),
      technician:technicians(*),
      schedule:service_schedules(*)
    `)
    .eq('technician_id', technicianId)
    .eq('scheduled_date', targetDate)
    .eq('status', 'scheduled')
    .order('route_order', { ascending: true, nullsFirst: false })
    .order('scheduled_time', { ascending: true, nullsFirst: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching next job:', error);
    throw error;
  }

  return data as ServiceJobWithDetails;
}

/**
 * Get all pending jobs for a technician
 * @param technicianId - The technician ID
 * @param date - Optional date filter (defaults to today)
 * @returns Array of pending jobs
 */
export async function getPendingJobs(
  technicianId: string,
  date?: string
): Promise<ServiceJobWithDetails[]> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('service_jobs')
    .select(`
      *,
      customer:customers(*),
      pool:pools(*),
      technician:technicians(*),
      schedule:service_schedules(*)
    `)
    .eq('technician_id', technicianId)
    .eq('scheduled_date', targetDate)
    .in('status', ['scheduled', 'in_progress'])
    .order('route_order', { ascending: true, nullsFirst: false })
    .order('scheduled_time', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching pending jobs:', error);
    throw error;
  }

  return data as ServiceJobWithDetails[];
}

/**
 * Get all jobs for a company on a given date
 * @param companyId - The company ID
 * @param date - Optional date filter (defaults to today)
 * @returns Array of jobs
 */
export async function getCompanyJobs(
  companyId: string,
  date?: string
): Promise<ServiceJobWithDetails[]> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('service_jobs')
    .select(`
      *,
      customer:customers(*),
      pool:pools(*),
      technician:technicians(*),
      schedule:service_schedules(*)
    `)
    .eq('company_id', companyId)
    .eq('scheduled_date', targetDate)
    .order('route_order', { ascending: true, nullsFirst: false })
    .order('scheduled_time', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching company jobs:', error);
    throw error;
  }

  return data as ServiceJobWithDetails[];
}

// =============================================================================
// Real-time Subscriptions
// =============================================================================

/**
 * Subscribe to job updates for a company
 * @param companyId - The company ID to subscribe to
 * @param callback - Function called when jobs change
 * @returns Unsubscribe function
 */
export function subscribeJobUpdates(
  companyId: string,
  callback: (payload: JobSubscriptionPayload) => void
): () => void {
  const channel = supabase
    .channel(`service_jobs_${companyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'service_jobs',
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as ServiceJob | null,
          old: payload.old as ServiceJob | null,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to job updates for a specific technician
 * @param technicianId - The technician ID to subscribe to
 * @param callback - Function called when jobs change
 * @returns Unsubscribe function
 */
export function subscribeTechnicianJobs(
  technicianId: string,
  callback: (payload: JobSubscriptionPayload) => void
): () => void {
  const channel = supabase
    .channel(`technician_jobs_${technicianId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'service_jobs',
        filter: `technician_id=eq.${technicianId}`,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as ServiceJob | null,
          old: payload.old as ServiceJob | null,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// =============================================================================
// Photo Upload
// =============================================================================

/**
 * Upload a job photo to storage
 * @param file - The file to upload
 * @param jobId - The job ID
 * @param technicianId - The technician ID
 * @returns The public URL of the uploaded photo
 */
export async function uploadJobPhoto(
  file: File,
  jobId: string,
  technicianId: string
): Promise<string> {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const filePath = `job-photos/${jobId}/${technicianId}_${timestamp}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('service-photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('service-photos')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a job photo from storage
 * @param photoUrl - The URL of the photo to delete
 */
export async function deleteJobPhoto(photoUrl: string): Promise<void> {
  // Extract the file path from the URL
  const urlParts = photoUrl.split('/service-photos/');
  if (urlParts.length < 2) {
    throw new Error('Invalid photo URL');
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('service-photos')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}
