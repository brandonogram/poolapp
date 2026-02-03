/**
 * PoolOps - Analytics Storage
 * File-based storage for analytics data with Supabase fallback option
 */

import { promises as fs } from 'fs';
import path from 'path';
import type {
  AnalyticsStore,
  PageView,
  AnalyticsEvent,
  Conversion,
  Recommendation,
  ABTest,
  LogPageViewInput,
  LogEventInput,
  LogConversionInput,
} from './types';

// =============================================================================
// Configuration
// =============================================================================

const DATA_DIR = process.env.ANALYTICS_DATA_DIR || path.join(process.cwd(), 'data', 'analytics');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// =============================================================================
// Storage Initialization
// =============================================================================

/**
 * Initialize storage directory and file
 */
async function initStorage(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(STORE_FILE);
    } catch {
      // File doesn't exist, create empty store
      const emptyStore: AnalyticsStore = {
        pageViews: [],
        events: [],
        conversions: [],
        recommendations: [],
        abTests: [],
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(STORE_FILE, JSON.stringify(emptyStore, null, 2));
    }
  } catch (error) {
    console.error('Failed to initialize analytics storage:', error);
    throw error;
  }
}

/**
 * Read the analytics store
 */
async function readStore(): Promise<AnalyticsStore> {
  try {
    await initStorage();
    const data = await fs.readFile(STORE_FILE, 'utf-8');
    return JSON.parse(data) as AnalyticsStore;
  } catch (error) {
    console.error('Failed to read analytics store:', error);
    // Return empty store if read fails
    return {
      pageViews: [],
      events: [],
      conversions: [],
      recommendations: [],
      abTests: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Write to the analytics store
 */
async function writeStore(store: AnalyticsStore): Promise<void> {
  try {
    await initStorage();
    store.lastUpdated = new Date().toISOString();
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error('Failed to write analytics store:', error);
    throw error;
  }
}

// =============================================================================
// ID Generation
// =============================================================================

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// =============================================================================
// Page View Operations
// =============================================================================

/**
 * Log a page view
 */
export async function logPageView(input: LogPageViewInput): Promise<PageView> {
  const store = await readStore();

  const pageView: PageView = {
    id: generateId('pv'),
    path: input.path,
    referrer: input.referrer || null,
    userAgent: input.userAgent || null,
    sessionId: input.sessionId,
    userId: input.userId || null,
    companyId: input.companyId || null,
    timestamp: new Date().toISOString(),
    duration: input.duration || null,
    scrollDepth: input.scrollDepth || null,
    metadata: input.metadata || {},
  };

  store.pageViews.push(pageView);

  // Keep only last 30 days of data to prevent file from growing too large
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  store.pageViews = store.pageViews.filter(
    pv => new Date(pv.timestamp) > thirtyDaysAgo
  );

  await writeStore(store);
  return pageView;
}

/**
 * Get page views with optional filtering
 */
export async function getPageViews(options: {
  startDate?: Date;
  endDate?: Date;
  path?: string;
  sessionId?: string;
  limit?: number;
} = {}): Promise<PageView[]> {
  const store = await readStore();
  let views = store.pageViews;

  if (options.startDate) {
    views = views.filter(pv => new Date(pv.timestamp) >= options.startDate!);
  }
  if (options.endDate) {
    views = views.filter(pv => new Date(pv.timestamp) <= options.endDate!);
  }
  if (options.path) {
    views = views.filter(pv => pv.path === options.path);
  }
  if (options.sessionId) {
    views = views.filter(pv => pv.sessionId === options.sessionId);
  }
  if (options.limit) {
    views = views.slice(-options.limit);
  }

  return views;
}

// =============================================================================
// Event Operations
// =============================================================================

/**
 * Log an analytics event
 */
export async function logEvent(input: LogEventInput): Promise<AnalyticsEvent> {
  const store = await readStore();

  const event: AnalyticsEvent = {
    id: generateId('ev'),
    category: input.category,
    action: input.action,
    label: input.label || null,
    value: input.value || null,
    sessionId: input.sessionId,
    userId: input.userId || null,
    companyId: input.companyId || null,
    path: input.path,
    timestamp: new Date().toISOString(),
    metadata: input.metadata || {},
  };

  store.events.push(event);

  // Keep only last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  store.events = store.events.filter(
    ev => new Date(ev.timestamp) > thirtyDaysAgo
  );

  await writeStore(store);
  return event;
}

/**
 * Get events with optional filtering
 */
export async function getEvents(options: {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  action?: string;
  sessionId?: string;
  limit?: number;
} = {}): Promise<AnalyticsEvent[]> {
  const store = await readStore();
  let events = store.events;

  if (options.startDate) {
    events = events.filter(ev => new Date(ev.timestamp) >= options.startDate!);
  }
  if (options.endDate) {
    events = events.filter(ev => new Date(ev.timestamp) <= options.endDate!);
  }
  if (options.category) {
    events = events.filter(ev => ev.category === options.category);
  }
  if (options.action) {
    events = events.filter(ev => ev.action === options.action);
  }
  if (options.sessionId) {
    events = events.filter(ev => ev.sessionId === options.sessionId);
  }
  if (options.limit) {
    events = events.slice(-options.limit);
  }

  return events;
}

// =============================================================================
// Conversion Operations
// =============================================================================

/**
 * Log a conversion event
 */
export async function logConversion(input: LogConversionInput): Promise<Conversion> {
  const store = await readStore();

  const conversion: Conversion = {
    id: generateId('cv'),
    type: input.type,
    value: input.value || 0,
    sessionId: input.sessionId,
    userId: input.userId || null,
    companyId: input.companyId || null,
    path: input.path,
    timestamp: new Date().toISOString(),
    funnelStep: input.funnelStep || null,
    attributionSource: input.attributionSource || null,
    metadata: input.metadata || {},
  };

  store.conversions.push(conversion);

  // Keep only last 90 days for conversions
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  store.conversions = store.conversions.filter(
    cv => new Date(cv.timestamp) > ninetyDaysAgo
  );

  await writeStore(store);
  return conversion;
}

/**
 * Get conversions with optional filtering
 */
export async function getConversions(options: {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  sessionId?: string;
  limit?: number;
} = {}): Promise<Conversion[]> {
  const store = await readStore();
  let conversions = store.conversions;

  if (options.startDate) {
    conversions = conversions.filter(cv => new Date(cv.timestamp) >= options.startDate!);
  }
  if (options.endDate) {
    conversions = conversions.filter(cv => new Date(cv.timestamp) <= options.endDate!);
  }
  if (options.type) {
    conversions = conversions.filter(cv => cv.type === options.type);
  }
  if (options.sessionId) {
    conversions = conversions.filter(cv => cv.sessionId === options.sessionId);
  }
  if (options.limit) {
    conversions = conversions.slice(-options.limit);
  }

  return conversions;
}

// =============================================================================
// Recommendation Operations
// =============================================================================

/**
 * Save recommendations
 */
export async function saveRecommendations(recommendations: Recommendation[]): Promise<void> {
  const store = await readStore();

  // Merge with existing - update existing, add new
  for (const rec of recommendations) {
    const existingIndex = store.recommendations.findIndex(r => r.id === rec.id);
    if (existingIndex >= 0) {
      store.recommendations[existingIndex] = rec;
    } else {
      store.recommendations.push(rec);
    }
  }

  // Keep only last 100 recommendations
  store.recommendations = store.recommendations.slice(-100);

  await writeStore(store);
}

/**
 * Get recommendations
 */
export async function getRecommendations(options: {
  status?: string;
  priority?: string;
  limit?: number;
} = {}): Promise<Recommendation[]> {
  const store = await readStore();
  let recommendations = store.recommendations;

  if (options.status) {
    recommendations = recommendations.filter(r => r.status === options.status);
  }
  if (options.priority) {
    recommendations = recommendations.filter(r => r.priority === options.priority);
  }
  if (options.limit) {
    recommendations = recommendations.slice(-options.limit);
  }

  return recommendations;
}

/**
 * Update recommendation status
 */
export async function updateRecommendationStatus(
  id: string,
  status: Recommendation['status']
): Promise<Recommendation | null> {
  const store = await readStore();
  const index = store.recommendations.findIndex(r => r.id === id);

  if (index < 0) {
    return null;
  }

  store.recommendations[index] = {
    ...store.recommendations[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  await writeStore(store);
  return store.recommendations[index];
}

// =============================================================================
// A/B Test Operations
// =============================================================================

/**
 * Save an A/B test
 */
export async function saveABTest(test: ABTest): Promise<ABTest> {
  const store = await readStore();

  const existingIndex = store.abTests.findIndex(t => t.id === test.id);
  if (existingIndex >= 0) {
    store.abTests[existingIndex] = test;
  } else {
    store.abTests.push(test);
  }

  await writeStore(store);
  return test;
}

/**
 * Get A/B tests
 */
export async function getABTests(options: {
  status?: string;
  limit?: number;
} = {}): Promise<ABTest[]> {
  const store = await readStore();
  let tests = store.abTests;

  if (options.status) {
    tests = tests.filter(t => t.status === options.status);
  }
  if (options.limit) {
    tests = tests.slice(-options.limit);
  }

  return tests;
}

/**
 * Get A/B test by ID
 */
export async function getABTestById(id: string): Promise<ABTest | null> {
  const store = await readStore();
  return store.abTests.find(t => t.id === id) || null;
}

// =============================================================================
// Full Store Operations
// =============================================================================

/**
 * Get the complete analytics store
 */
export async function getStore(): Promise<AnalyticsStore> {
  return readStore();
}

/**
 * Clear all analytics data (use with caution)
 */
export async function clearStore(): Promise<void> {
  const emptyStore: AnalyticsStore = {
    pageViews: [],
    events: [],
    conversions: [],
    recommendations: [],
    abTests: [],
    lastUpdated: new Date().toISOString(),
  };
  await writeStore(emptyStore);
}

/**
 * Export analytics data to JSON
 */
export async function exportData(): Promise<string> {
  const store = await readStore();
  return JSON.stringify(store, null, 2);
}

/**
 * Import analytics data from JSON
 */
export async function importData(jsonData: string): Promise<void> {
  const data = JSON.parse(jsonData) as AnalyticsStore;
  await writeStore(data);
}
