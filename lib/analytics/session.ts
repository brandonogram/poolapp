/**
 * Session Tracking & User Journey Analytics
 *
 * Tracks user sessions, journeys through the app, and conversion funnels:
 * - Session persistence and management
 * - User journey mapping
 * - Funnel tracking with drop-off identification
 * - Page flow analysis
 */

// Types
export interface SessionData {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: PageView[];
  referrer: string;
  userAgent: string;
  screenSize: { width: number; height: number };
  funnels: FunnelProgress[];
}

export interface PageView {
  path: string;
  timestamp: number;
  duration?: number;
  referrer?: string;
  title?: string;
}

export interface FunnelStep {
  name: string;
  path: string | RegExp;
  order: number;
}

export interface FunnelProgress {
  funnelId: string;
  currentStep: number;
  completedSteps: string[];
  startTime: number;
  completed: boolean;
  droppedOff: boolean;
  dropOffStep?: string;
}

export interface FunnelDefinition {
  id: string;
  name: string;
  steps: FunnelStep[];
}

// Predefined conversion funnels
export const FUNNELS: Record<string, FunnelDefinition> = {
  // Landing -> Pricing -> Checkout -> Success
  pricing_conversion: {
    id: 'pricing_conversion',
    name: 'Pricing Conversion Funnel',
    steps: [
      { name: 'Landing Page', path: '/', order: 0 },
      { name: 'Pricing Section', path: '/#pricing', order: 1 },
      { name: 'Checkout', path: /^\/checkout/, order: 2 },
      { name: 'Success', path: '/checkout/success', order: 3 },
    ],
  },

  // Landing -> Demo Request -> Scheduled
  demo_request: {
    id: 'demo_request',
    name: 'Demo Request Funnel',
    steps: [
      { name: 'Landing Page', path: '/', order: 0 },
      { name: 'Demo Request', path: '/demo', order: 1 },
      { name: 'Demo Scheduled', path: '/demo/scheduled', order: 2 },
    ],
  },

  // Convention funnel
  convention_signup: {
    id: 'convention_signup',
    name: 'Convention Signup Funnel',
    steps: [
      { name: 'Convention Landing', path: '/convention', order: 0 },
      { name: 'Convention Checkout', path: /^\/checkout.*convention/, order: 1 },
      { name: 'Signup Success', path: '/checkout/success', order: 2 },
    ],
  },

  // Onboarding funnel
  onboarding: {
    id: 'onboarding',
    name: 'User Onboarding Funnel',
    steps: [
      { name: 'Dashboard Entry', path: '/dashboard', order: 0 },
      { name: 'First Customer', path: '/dashboard/customers', order: 1 },
      { name: 'First Job', path: '/dashboard/schedule', order: 2 },
      { name: 'Route Optimization', path: '/dashboard/routes', order: 3 },
    ],
  },
};

// Session storage key
const SESSION_KEY = 'poolapp_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Current session
let currentSession: SessionData | null = null;
let pageEnterTime = 0;

/**
 * Initialize or resume session
 */
export function initSession(): SessionData {
  if (typeof window === 'undefined') {
    return createEmptySession();
  }

  // Try to resume existing session
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as SessionData;
      const now = Date.now();

      // Check if session is still valid (within timeout)
      if (now - parsed.lastActivity < SESSION_TIMEOUT) {
        currentSession = parsed;
        currentSession.lastActivity = now;
        saveSession();
        return currentSession;
      }
    } catch {
      // Invalid session data, create new
    }
  }

  // Create new session
  currentSession = createNewSession();
  saveSession();
  return currentSession;
}

function createEmptySession(): SessionData {
  return {
    id: 'server',
    startTime: Date.now(),
    lastActivity: Date.now(),
    pageViews: [],
    referrer: '',
    userAgent: '',
    screenSize: { width: 0, height: 0 },
    funnels: [],
  };
}

function createNewSession(): SessionData {
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    lastActivity: Date.now(),
    pageViews: [],
    referrer: document.referrer || '',
    userAgent: navigator.userAgent,
    screenSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    funnels: [],
  };
}

function saveSession() {
  if (typeof window === 'undefined' || !currentSession) return;

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Get current session
 */
export function getSession(): SessionData | null {
  if (!currentSession && typeof window !== 'undefined') {
    initSession();
  }
  return currentSession;
}

/**
 * Track page view
 */
export function trackPageView(path?: string): PageView | null {
  if (typeof window === 'undefined') return null;

  if (!currentSession) {
    initSession();
  }

  const now = Date.now();

  // Calculate duration of previous page
  if (currentSession!.pageViews.length > 0 && pageEnterTime > 0) {
    const lastView = currentSession!.pageViews[currentSession!.pageViews.length - 1];
    lastView.duration = now - pageEnterTime;
  }

  pageEnterTime = now;
  const currentPath = path || window.location.pathname + window.location.hash;

  const pageView: PageView = {
    path: currentPath,
    timestamp: now,
    referrer: currentSession!.pageViews.length > 0
      ? currentSession!.pageViews[currentSession!.pageViews.length - 1].path
      : document.referrer,
    title: document.title,
  };

  currentSession!.pageViews.push(pageView);
  currentSession!.lastActivity = now;

  // Update funnel progress
  updateFunnelProgress(currentPath);

  saveSession();

  // Send to analytics API
  sendPageView(pageView);

  return pageView;
}

/**
 * Update funnel progress based on current page
 */
function updateFunnelProgress(path: string) {
  if (!currentSession) return;

  Object.values(FUNNELS).forEach((funnel) => {
    // Find matching step
    const matchingStep = funnel.steps.find((step) => {
      if (typeof step.path === 'string') {
        return path === step.path || path.startsWith(step.path);
      }
      return step.path.test(path);
    });

    if (!matchingStep) return;

    // Find or create funnel progress
    let progress = currentSession!.funnels.find((f) => f.funnelId === funnel.id);

    if (!progress) {
      progress = {
        funnelId: funnel.id,
        currentStep: matchingStep.order,
        completedSteps: [matchingStep.name],
        startTime: Date.now(),
        completed: false,
        droppedOff: false,
      };
      currentSession!.funnels.push(progress);
    } else {
      // Update progress if this is a new step forward
      if (matchingStep.order > progress.currentStep) {
        progress.currentStep = matchingStep.order;
        if (!progress.completedSteps.includes(matchingStep.name)) {
          progress.completedSteps.push(matchingStep.name);
        }
      }

      // Check if funnel is complete
      if (matchingStep.order === funnel.steps.length - 1) {
        progress.completed = true;
      }
    }
  });
}

/**
 * Mark funnel as dropped off
 */
export function markFunnelDropOff(funnelId: string, dropOffStep?: string) {
  if (!currentSession) return;

  const progress = currentSession.funnels.find((f) => f.funnelId === funnelId);
  if (progress && !progress.completed) {
    progress.droppedOff = true;
    progress.dropOffStep = dropOffStep || progress.completedSteps[progress.completedSteps.length - 1];
    saveSession();
  }
}

/**
 * Get funnel analytics
 */
export function getFunnelProgress(funnelId: string): FunnelProgress | null {
  if (!currentSession) return null;
  return currentSession.funnels.find((f) => f.funnelId === funnelId) || null;
}

/**
 * Get user journey summary
 */
export function getJourneySummary(): {
  totalPages: number;
  totalTime: number;
  uniquePaths: string[];
  entryPage: string;
  exitPage: string;
  bounced: boolean;
} | null {
  if (!currentSession || currentSession.pageViews.length === 0) return null;

  const pageViews = currentSession.pageViews;
  const uniquePaths = Array.from(new Set(pageViews.map((pv) => pv.path)));

  const totalTime = pageViews.reduce((sum, pv) => sum + (pv.duration || 0), 0) +
    (Date.now() - (pageViews[pageViews.length - 1]?.timestamp || 0));

  return {
    totalPages: pageViews.length,
    totalTime,
    uniquePaths,
    entryPage: pageViews[0].path,
    exitPage: pageViews[pageViews.length - 1].path,
    bounced: pageViews.length === 1 && totalTime < 10000, // Less than 10 seconds on single page
  };
}

/**
 * Identify drop-off points across all sessions
 */
export interface DropOffPoint {
  fromPage: string;
  toPage: string | null;
  count: number;
  percentage: number;
}

/**
 * Get common drop-off patterns from page views
 */
export function analyzeDropOffPoints(pageViews: PageView[][]): DropOffPoint[] {
  const transitions = new Map<string, number>();
  const pageCounts = new Map<string, number>();

  pageViews.forEach((session) => {
    session.forEach((view, index) => {
      // Count page visits
      pageCounts.set(view.path, (pageCounts.get(view.path) || 0) + 1);

      // Track transitions
      const nextPage = session[index + 1]?.path || 'EXIT';
      const transitionKey = `${view.path} -> ${nextPage}`;
      transitions.set(transitionKey, (transitions.get(transitionKey) || 0) + 1);
    });
  });

  const dropOffs: DropOffPoint[] = [];

  transitions.forEach((count, key) => {
    const [fromPage, toPage] = key.split(' -> ');
    if (toPage === 'EXIT') {
      const pageCount = pageCounts.get(fromPage) || 1;
      dropOffs.push({
        fromPage,
        toPage: null,
        count,
        percentage: Math.round((count / pageCount) * 100),
      });
    }
  });

  // Sort by count descending
  return dropOffs.sort((a, b) => b.count - a.count);
}

/**
 * Send page view to analytics API
 */
async function sendPageView(pageView: PageView) {
  try {
    await fetch('/api/analytics/behavior', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: [{
          type: 'page_view',
          timestamp: pageView.timestamp,
          page: pageView.path,
          sessionId: currentSession?.id || 'unknown',
          data: {
            title: pageView.title,
            referrer: pageView.referrer,
          },
        }],
      }),
    });
  } catch (error) {
    console.error('Failed to send page view:', error);
  }
}

/**
 * Clear session data
 */
export function clearSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(SESSION_KEY);
  currentSession = null;
}

/**
 * Get session ID
 */
export function getSessionId(): string {
  return currentSession?.id || 'no_session';
}
