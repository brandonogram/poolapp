/**
 * User Behavior Analytics Module
 *
 * Tracks user interactions for custom heatmap and behavior analysis:
 * - Scroll depth tracking
 * - Time on page
 * - Mouse movement patterns
 * - Form interactions
 * - Rage clicks (frustration detection)
 */

// Types
export interface BehaviorEvent {
  type: 'scroll' | 'time' | 'mouse' | 'form' | 'rage_click' | 'click';
  timestamp: number;
  data: ScrollData | MouseData | FormInteraction | RageClickData | Record<string, unknown>;
  page: string;
  sessionId: string;
}

export interface ScrollData {
  depth: number;
  maxDepth: number;
  direction: 'up' | 'down';
}

export interface MouseData {
  x: number;
  y: number;
  relativeX: number; // Percentage of viewport width
  relativeY: number; // Percentage of viewport height
}

export interface FormInteraction {
  formId?: string;
  fieldName: string;
  action: 'focus' | 'blur' | 'change' | 'submit';
  timeSpent?: number;
}

export interface RageClickData {
  x: number;
  y: number;
  element: string;
  clickCount: number;
  timeWindow: number;
}

// Session management
let sessionId: string | null = null;

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  if (!sessionId) {
    // Try to get from sessionStorage first
    sessionId = sessionStorage.getItem('behavior_session_id');

    if (!sessionId) {
      // Generate new session ID
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('behavior_session_id', sessionId);
    }
  }

  return sessionId;
}

// Event queue for batching
let eventQueue: BehaviorEvent[] = [];
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 5000; // 5 seconds
let batchTimer: ReturnType<typeof setTimeout> | null = null;

function queueEvent(event: Omit<BehaviorEvent, 'timestamp' | 'page' | 'sessionId'>) {
  if (typeof window === 'undefined') return;

  const fullEvent: BehaviorEvent = {
    ...event,
    timestamp: Date.now(),
    page: window.location.pathname,
    sessionId: getSessionId(),
  };

  eventQueue.push(fullEvent);

  // Send batch if queue is full
  if (eventQueue.length >= BATCH_SIZE) {
    flushEvents();
  } else if (!batchTimer) {
    // Set timer for batch send
    batchTimer = setTimeout(flushEvents, BATCH_INTERVAL);
  }
}

async function flushEvents() {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }

  try {
    await fetch('/api/analytics/behavior', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: eventsToSend }),
    });
  } catch (error) {
    // Re-queue failed events
    console.error('Failed to send behavior events:', error);
    eventQueue = [...eventsToSend, ...eventQueue];
  }
}

// Scroll depth tracking
let maxScrollDepth = 0;
let lastScrollPosition = 0;

export function trackScrollDepth() {
  if (typeof window === 'undefined') return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  const direction = scrollTop > lastScrollPosition ? 'down' : 'up';

  if (scrollPercent > maxScrollDepth) {
    maxScrollDepth = scrollPercent;
  }

  lastScrollPosition = scrollTop;

  const scrollData: ScrollData = {
    depth: scrollPercent,
    maxDepth: maxScrollDepth,
    direction,
  };

  queueEvent({
    type: 'scroll',
    data: scrollData,
  });

  return scrollData;
}

// Time on page tracking
let pageLoadTime = 0;
let lastActivityTime = 0;
let isVisible = true;

export function initTimeTracking() {
  if (typeof window === 'undefined') return;

  pageLoadTime = Date.now();
  lastActivityTime = pageLoadTime;

  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      lastActivityTime = Date.now();
    } else {
      trackTimeOnPage();
    }
  });

  // Track on page unload
  window.addEventListener('beforeunload', trackTimeOnPage);
}

export function trackTimeOnPage() {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const totalTime = now - pageLoadTime;
  const activeTime = isVisible ? now - lastActivityTime : 0;

  queueEvent({
    type: 'time',
    data: {
      totalTime,
      activeTime,
      isVisible,
    },
  });

  // Flush immediately since this might be on unload
  flushEvents();
}

// Mouse movement tracking (sampled)
let mouseSampleCount = 0;
const MOUSE_SAMPLE_RATE = 10; // Track every 10th movement

export function trackMouseMovement(event: MouseEvent) {
  if (typeof window === 'undefined') return;

  mouseSampleCount++;
  if (mouseSampleCount % MOUSE_SAMPLE_RATE !== 0) return;

  const mouseData: MouseData = {
    x: event.clientX,
    y: event.clientY,
    relativeX: Math.round((event.clientX / window.innerWidth) * 100),
    relativeY: Math.round((event.clientY / window.innerHeight) * 100),
  };

  queueEvent({
    type: 'mouse',
    data: mouseData,
  });
}

// Form interaction tracking
const formFieldTimers = new Map<string, number>();

export function trackFormFocus(fieldName: string, formId?: string) {
  formFieldTimers.set(fieldName, Date.now());

  queueEvent({
    type: 'form',
    data: {
      formId,
      fieldName,
      action: 'focus',
    } as FormInteraction,
  });
}

export function trackFormBlur(fieldName: string, formId?: string) {
  const startTime = formFieldTimers.get(fieldName);
  const timeSpent = startTime ? Date.now() - startTime : 0;
  formFieldTimers.delete(fieldName);

  queueEvent({
    type: 'form',
    data: {
      formId,
      fieldName,
      action: 'blur',
      timeSpent,
    } as FormInteraction,
  });
}

export function trackFormChange(fieldName: string, formId?: string) {
  queueEvent({
    type: 'form',
    data: {
      formId,
      fieldName,
      action: 'change',
    } as FormInteraction,
  });
}

export function trackFormSubmit(formId?: string) {
  queueEvent({
    type: 'form',
    data: {
      formId,
      fieldName: '',
      action: 'submit',
    } as FormInteraction,
  });

  // Flush immediately on form submit
  flushEvents();
}

// Rage click detection
const clickHistory: { x: number; y: number; time: number; element: string }[] = [];
const RAGE_CLICK_THRESHOLD = 3; // Number of clicks
const RAGE_CLICK_RADIUS = 30; // Pixels
const RAGE_CLICK_WINDOW = 500; // Milliseconds

export function trackClick(event: MouseEvent) {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const { clientX: x, clientY: y } = event;
  const target = event.target as HTMLElement;
  const element = target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : '');

  // Add to click history
  clickHistory.push({ x, y, time: now, element });

  // Clean old clicks
  while (clickHistory.length > 0 && now - clickHistory[0].time > RAGE_CLICK_WINDOW) {
    clickHistory.shift();
  }

  // Check for rage clicks
  const recentClicks = clickHistory.filter((click) => {
    const distance = Math.sqrt(Math.pow(click.x - x, 2) + Math.pow(click.y - y, 2));
    return distance <= RAGE_CLICK_RADIUS && now - click.time <= RAGE_CLICK_WINDOW;
  });

  if (recentClicks.length >= RAGE_CLICK_THRESHOLD) {
    const rageData: RageClickData = {
      x,
      y,
      element,
      clickCount: recentClicks.length,
      timeWindow: RAGE_CLICK_WINDOW,
    };

    queueEvent({
      type: 'rage_click',
      data: rageData,
    });

    // Clear history after detecting rage click
    clickHistory.length = 0;
  } else {
    // Track regular click
    queueEvent({
      type: 'click',
      data: { x, y, element },
    });
  }
}

// Initialize all tracking
export function initBehaviorTracking(options?: {
  trackScroll?: boolean;
  trackMouse?: boolean;
  trackClicks?: boolean;
  trackTime?: boolean;
}) {
  if (typeof window === 'undefined') return;

  const opts = {
    trackScroll: true,
    trackMouse: true,
    trackClicks: true,
    trackTime: true,
    ...options,
  };

  if (opts.trackScroll) {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 100); // Debounce
    }, { passive: true });
  }

  if (opts.trackMouse) {
    window.addEventListener('mousemove', trackMouseMovement, { passive: true });
  }

  if (opts.trackClicks) {
    window.addEventListener('click', trackClick, { passive: true });
  }

  if (opts.trackTime) {
    initTimeTracking();
  }

  // Flush events before page unload
  window.addEventListener('beforeunload', () => {
    flushEvents();
  });

  // Reset scroll depth on navigation
  maxScrollDepth = 0;
  lastScrollPosition = 0;
}

// Export for cleanup
export function cleanupBehaviorTracking() {
  if (typeof window === 'undefined') return;

  window.removeEventListener('scroll', trackScrollDepth as EventListener);
  window.removeEventListener('mousemove', trackMouseMovement);
  window.removeEventListener('click', trackClick);

  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }

  flushEvents();
}
