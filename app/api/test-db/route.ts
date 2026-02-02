import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify Supabase connection and schema deployment
 * GET /api/test-db
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Missing Supabase environment variables' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Check connection and get list of tables
  const results: Record<string, unknown> = {
    connection: 'unknown',
    tables: {},
    timestamp: new Date().toISOString(),
  };

  // Test the core tables from our schema
  const tablesToCheck = [
    'companies',
    'users',
    'technicians',
    'customers',
    'pools',
    'service_schedules',
    'service_jobs',
    'service_logs',
    'routes',
    'invoices',
    'invoice_items',
    // New tables for Package 2 and 3
    'technician_locations',
    'job_photos',
  ];

  try {
    for (const table of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          (results.tables as Record<string, unknown>)[table] = {
            exists: false,
            error: error.message,
          };
        } else {
          (results.tables as Record<string, unknown>)[table] = {
            exists: true,
            count: count ?? 0,
          };
        }
      } catch (err) {
        (results.tables as Record<string, unknown>)[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        };
      }
    }

    // Check if all core tables exist
    const coreTablesExist = tablesToCheck
      .slice(0, 11) // Core tables (excluding new ones)
      .every(
        (t) => ((results.tables as Record<string, unknown>)[t] as { exists: boolean })?.exists
      );

    results.connection = 'success';
    results.schemaDeployed = coreTablesExist;
    results.supabaseUrl = supabaseUrl;

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      {
        connection: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        supabaseUrl,
      },
      { status: 500 }
    );
  }
}
