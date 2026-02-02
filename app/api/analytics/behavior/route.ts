import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Behavior Analytics API Endpoint
 *
 * Receives user behavior events and stores them for analysis.
 * Supports both Supabase storage and local JSON fallback.
 */

// Types
interface BehaviorEvent {
  type: string;
  timestamp: number;
  page: string;
  sessionId: string;
  data: Record<string, unknown>;
}

interface AnalyticsPayload {
  events: BehaviorEvent[];
}

// Local storage path (fallback when Supabase is not configured)
const LOCAL_ANALYTICS_DIR = path.join(process.cwd(), 'data', 'analytics');
const LOCAL_ANALYTICS_FILE = path.join(LOCAL_ANALYTICS_DIR, 'behavior.json');

// Initialize Supabase client if configured
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey);
  }

  return null;
}

// Store events in Supabase
async function storeInSupabase(events: BehaviorEvent[]): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('behavior_events')
      .insert(
        events.map((event) => ({
          event_type: event.type,
          timestamp: new Date(event.timestamp).toISOString(),
          page: event.page,
          session_id: event.sessionId,
          data: event.data,
          created_at: new Date().toISOString(),
        }))
      );

    if (error) {
      console.error('Supabase insert error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Supabase storage failed:', error);
    return false;
  }
}

// Store events in local JSON file
async function storeLocally(events: BehaviorEvent[]): Promise<boolean> {
  try {
    // Ensure directory exists
    await fs.mkdir(LOCAL_ANALYTICS_DIR, { recursive: true });

    // Read existing data
    let existingData: BehaviorEvent[] = [];
    try {
      const content = await fs.readFile(LOCAL_ANALYTICS_FILE, 'utf-8');
      existingData = JSON.parse(content);
    } catch {
      // File doesn't exist yet, start fresh
    }

    // Append new events
    const updatedData = [...existingData, ...events];

    // Keep only last 10000 events to prevent file from growing too large
    const trimmedData = updatedData.slice(-10000);

    // Write back
    await fs.writeFile(LOCAL_ANALYTICS_FILE, JSON.stringify(trimmedData, null, 2));

    return true;
  } catch (error) {
    console.error('Local storage failed:', error);
    return false;
  }
}

// Aggregate events for summary statistics
interface AggregatedStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  uniqueSessions: number;
  topPages: Array<{ page: string; count: number }>;
  rageClicks: number;
  averageScrollDepth: number;
}

async function getAggregatedStats(): Promise<AggregatedStats | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    // Get stats from Supabase
    try {
      const { data: events, error } = await supabase
        .from('behavior_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error || !events) return null;

      return calculateStats(events.map((e) => ({
        type: e.event_type,
        timestamp: new Date(e.timestamp).getTime(),
        page: e.page,
        sessionId: e.session_id,
        data: e.data,
      })));
    } catch {
      return null;
    }
  }

  // Get stats from local file
  try {
    const content = await fs.readFile(LOCAL_ANALYTICS_FILE, 'utf-8');
    const events: BehaviorEvent[] = JSON.parse(content);

    // Filter to last 24 hours
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const recentEvents = events.filter((e) => e.timestamp > cutoff);

    return calculateStats(recentEvents);
  } catch {
    return null;
  }
}

function calculateStats(events: BehaviorEvent[]): AggregatedStats {
  const eventsByType: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};
  const sessions = new Set<string>();
  let rageClicks = 0;
  let scrollDepths: number[] = [];

  events.forEach((event) => {
    // Count by type
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;

    // Count by page
    pageCounts[event.page] = (pageCounts[event.page] || 0) + 1;

    // Track unique sessions
    sessions.add(event.sessionId);

    // Count rage clicks
    if (event.type === 'rage_click') {
      rageClicks++;
    }

    // Track scroll depths
    if (event.type === 'scroll' && event.data.maxDepth !== undefined) {
      scrollDepths.push(event.data.maxDepth as number);
    }
  });

  // Sort pages by count
  const topPages = Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate average scroll depth
  const averageScrollDepth = scrollDepths.length > 0
    ? Math.round(scrollDepths.reduce((a, b) => a + b, 0) / scrollDepths.length)
    : 0;

  return {
    totalEvents: events.length,
    eventsByType,
    uniqueSessions: sessions.size,
    topPages,
    rageClicks,
    averageScrollDepth,
  };
}

// POST handler - receive and store events
export async function POST(request: NextRequest) {
  try {
    const payload: AnalyticsPayload = await request.json();

    if (!payload.events || !Array.isArray(payload.events)) {
      return NextResponse.json(
        { error: 'Invalid payload: events array required' },
        { status: 400 }
      );
    }

    // Validate events
    const validEvents = payload.events.filter((event) =>
      event.type &&
      event.timestamp &&
      event.page &&
      event.sessionId
    );

    if (validEvents.length === 0) {
      return NextResponse.json(
        { error: 'No valid events in payload' },
        { status: 400 }
      );
    }

    // Try Supabase first, fall back to local storage
    let stored = await storeInSupabase(validEvents);
    let storageType = 'supabase';

    if (!stored) {
      stored = await storeLocally(validEvents);
      storageType = 'local';
    }

    if (!stored) {
      return NextResponse.json(
        { error: 'Failed to store events' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      eventsStored: validEvents.length,
      storageType,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET handler - retrieve aggregated stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'summary';

  if (format === 'summary') {
    const stats = await getAggregatedStats();

    if (!stats) {
      return NextResponse.json({
        totalEvents: 0,
        eventsByType: {},
        uniqueSessions: 0,
        topPages: [],
        rageClicks: 0,
        averageScrollDepth: 0,
      });
    }

    return NextResponse.json(stats);
  }

  // Raw data access (for debugging/admin)
  if (format === 'raw') {
    try {
      const content = await fs.readFile(LOCAL_ANALYTICS_FILE, 'utf-8');
      const events = JSON.parse(content);
      return NextResponse.json({ events: events.slice(-100) }); // Last 100 events
    } catch {
      return NextResponse.json({ events: [] });
    }
  }

  return NextResponse.json(
    { error: 'Invalid format parameter' },
    { status: 400 }
  );
}

// DELETE handler - clear local analytics data (for testing)
export async function DELETE() {
  try {
    await fs.unlink(LOCAL_ANALYTICS_FILE);
    return NextResponse.json({ success: true, message: 'Analytics data cleared' });
  } catch {
    return NextResponse.json({ success: true, message: 'No data to clear' });
  }
}
