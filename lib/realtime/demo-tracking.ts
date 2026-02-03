// @ts-nocheck
/**
 * PoolOps - Demo Live Tracking (Realtime via Supabase)
 * Uses a public demo table for anonymous read/write.
 */

import { supabase } from '@/lib/supabase/client';

export interface DemoTrackingRow {
  tracker_id: string;
  tech_name: string;
  customer_name: string;
  address: string;
  latitude: number;
  longitude: number;
  eta_minutes: number;
  distance_miles: number;
  arrival_time: string;
  updated_at: string;
}

export interface DemoTrackingUpdate {
  tracker_id: string;
  tech_name: string;
  customer_name: string;
  address: string;
  latitude: number;
  longitude: number;
  eta_minutes: number;
  distance_miles: number;
  arrival_time: string;
  updated_at?: string;
}

export async function upsertDemoTracking(update: DemoTrackingUpdate): Promise<void> {
  const payload = {
    ...update,
    updated_at: update.updated_at ?? new Date().toISOString(),
  };

  const { error } = await supabase
    .from('demo_live_tracking')
    .upsert(payload, { onConflict: 'tracker_id' });

  if (error) {
    console.error('Failed to upsert demo tracking', error);
    throw error;
  }
}

export async function fetchDemoTracking(trackerId: string): Promise<DemoTrackingRow | null> {
  const { data, error } = await supabase
    .from('demo_live_tracking')
    .select('*')
    .eq('tracker_id', trackerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Failed to fetch demo tracking', error);
    throw error;
  }

  return data as DemoTrackingRow;
}

export function subscribeDemoTracking(
  trackerId: string,
  callback: (row: DemoTrackingRow) => void
): () => void {
  const channel = supabase
    .channel(`demo_live_tracking_${trackerId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'demo_live_tracking',
        filter: `tracker_id=eq.${trackerId}`,
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as DemoTrackingRow);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
