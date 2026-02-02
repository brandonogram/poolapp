// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pool App - Technician Location Tracking
 * Real-time utilities for tracking technician positions
 * Note: @ts-nocheck used until Supabase types are fully configured
 */

import { supabase, subscribeToTable } from '@/lib/supabase/client';
import type { UUID, Timestamp } from '@/lib/types/database';

// =============================================================================
// Types
// =============================================================================

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

export interface TechnicianLocationUpdate {
  latitude: number;
  longitude: number;
  accuracy_meters?: number;
  heading?: number;
  speed_mph?: number;
}

export interface TechnicianLocationWithDetails extends TechnicianLocation {
  technician_name?: string;
  technician_color?: string;
  current_job_id?: UUID | null;
}

// =============================================================================
// Fetch Functions
// =============================================================================

/**
 * Fetch all technician locations for a company
 * @param companyId - The company ID to fetch locations for
 * @returns Array of technician locations with details
 */
export async function getTechnicianLocations(
  companyId: string
): Promise<TechnicianLocationWithDetails[]> {
  // Query the technician_locations table joined with technicians
  const { data, error } = await supabase
    .from('technician_locations')
    .select(`
      *,
      technicians (
        name,
        color
      )
    `)
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching technician locations:', error);
    throw error;
  }

  // Transform the data to include technician details at the top level
  return (data || []).map((location: TechnicianLocation & { technicians?: { name: string; color: string } }) => ({
    ...location,
    technician_name: location.technicians?.name,
    technician_color: location.technicians?.color,
  }));
}

/**
 * Fetch a single technician's location
 * @param technicianId - The technician ID
 * @returns The technician's current location or null
 */
export async function getTechnicianLocation(
  technicianId: string
): Promise<TechnicianLocation | null> {
  const { data, error } = await supabase
    .from('technician_locations')
    .select('*')
    .eq('technician_id', technicianId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching technician location:', error);
    throw error;
  }

  return data;
}

// =============================================================================
// Update Functions
// =============================================================================

/**
 * Update a technician's location
 * @param technicianId - The technician ID to update
 * @param lat - Latitude
 * @param lng - Longitude
 * @param extras - Optional additional location data
 * @returns The updated location record
 */
export async function updateTechnicianLocation(
  technicianId: string,
  lat: number,
  lng: number,
  extras?: Omit<TechnicianLocationUpdate, 'latitude' | 'longitude'>
): Promise<TechnicianLocation> {
  // First, get the technician to find their company_id
  const { data: technician, error: techError } = await (supabase as any)
    .from('technicians')
    .select('company_id')
    .eq('id', technicianId)
    .single();

  if (techError || !technician) {
    console.error('Error finding technician:', techError);
    throw techError || new Error('Technician not found');
  }

  // Upsert the location (insert if not exists, update if exists)
  const locationData = {
    technician_id: technicianId,
    company_id: (technician as any).company_id,
    latitude: lat,
    longitude: lng,
    accuracy_meters: extras?.accuracy_meters ?? null,
    heading: extras?.heading ?? null,
    speed_mph: extras?.speed_mph ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await (supabase as any)
    .from('technician_locations')
    .upsert(locationData, {
      onConflict: 'technician_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating technician location:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a technician's location (e.g., when going offline)
 * @param technicianId - The technician ID
 */
export async function deleteTechnicianLocation(
  technicianId: string
): Promise<void> {
  const { error } = await supabase
    .from('technician_locations')
    .delete()
    .eq('technician_id', technicianId);

  if (error) {
    console.error('Error deleting technician location:', error);
    throw error;
  }
}

// =============================================================================
// Real-time Subscriptions
// =============================================================================

export interface LocationSubscriptionPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: TechnicianLocation | null;
  old: TechnicianLocation | null;
}

/**
 * Subscribe to real-time location updates for all technicians in a company
 * @param companyId - The company ID to subscribe to
 * @param callback - Function called when locations change
 * @returns Unsubscribe function
 */
export function subscribeTechnicianLocations(
  companyId: string,
  callback: (payload: LocationSubscriptionPayload) => void
): () => void {
  // Create a channel for this company's technician locations
  const channel = supabase
    .channel(`technician_locations_${companyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'technician_locations',
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as TechnicianLocation | null,
          old: payload.old as TechnicianLocation | null,
        });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to a single technician's location updates
 * @param technicianId - The technician ID to subscribe to
 * @param callback - Function called when location changes
 * @returns Unsubscribe function
 */
export function subscribeTechnicianLocation(
  technicianId: string,
  callback: (payload: LocationSubscriptionPayload) => void
): () => void {
  const channel = supabase
    .channel(`technician_location_${technicianId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'technician_locations',
        filter: `technician_id=eq.${technicianId}`,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as TechnicianLocation | null,
          old: payload.old as TechnicianLocation | null,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Calculate distance between two coordinates in miles
 * Uses the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a technician is near a specific location (within threshold)
 * @param techLocation - Technician's current location
 * @param targetLat - Target latitude
 * @param targetLng - Target longitude
 * @param thresholdMiles - Distance threshold in miles (default 0.1 = ~500 feet)
 */
export function isTechnicianNearLocation(
  techLocation: TechnicianLocation,
  targetLat: number,
  targetLng: number,
  thresholdMiles: number = 0.1
): boolean {
  const distance = calculateDistance(
    techLocation.latitude,
    techLocation.longitude,
    targetLat,
    targetLng
  );
  return distance <= thresholdMiles;
}
