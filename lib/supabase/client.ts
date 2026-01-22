// @ts-nocheck
/**
 * Pool App - Supabase Client Setup
 * Type-safe Supabase clients for browser and server environments
 * Note: @ts-nocheck used until Supabase is fully configured
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database';

// =============================================================================
// Environment Variables
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// =============================================================================
// Validation
// =============================================================================

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// =============================================================================
// Browser Client (for React components)
// =============================================================================

/**
 * Supabase client for browser/client-side use.
 * Uses the anonymous key and respects RLS policies based on the authenticated user.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// =============================================================================
// Server Client (for API routes and server components)
// =============================================================================

/**
 * Creates a Supabase client for server-side use.
 * Can optionally use the service role key to bypass RLS.
 *
 * @param useServiceRole - If true, uses service role key (bypasses RLS)
 */
export function createServerClient(useServiceRole = false) {
  const key = useServiceRole && supabaseServiceKey
    ? supabaseServiceKey
    : supabaseAnonKey;

  return createClient<Database>(supabaseUrl!, key!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates a Supabase admin client that bypasses RLS.
 * Only use this for admin operations that need to access all data.
 */
export function createAdminClient() {
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// =============================================================================
// Type-Safe Query Helpers
// =============================================================================

/** Type for Supabase client */
export type SupabaseClient = typeof supabase;

/** Type for a Supabase query builder */
export type SupabaseQueryBuilder<T extends keyof Database['public']['Tables']> =
  ReturnType<typeof supabase.from<T>>;

// =============================================================================
// Auth Helpers
// =============================================================================

/**
 * Gets the current authenticated user's session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

/**
 * Signs out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// =============================================================================
// Realtime Subscription Helpers
// =============================================================================

/**
 * Subscribe to changes on a table
 * @param table - The table name to subscribe to
 * @param callback - Function to call when changes occur
 * @param filter - Optional filter for the subscription
 */
export function subscribeToTable<T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: Database['public']['Tables'][T]['Row'] | null;
    old: Database['public']['Tables'][T]['Row'] | null;
  }) => void,
  filter?: string
) {
  let channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table as string,
        filter,
      },
      (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as Database['public']['Tables'][T]['Row'] | null,
          old: payload.old as Database['public']['Tables'][T]['Row'] | null,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// =============================================================================
// Export Types
// =============================================================================

export type { Database } from '@/lib/types/database';
