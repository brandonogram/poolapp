'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  initBehaviorTracking,
  cleanupBehaviorTracking,
  trackFormFocus,
  trackFormBlur,
  trackFormChange,
  trackFormSubmit,
} from '@/lib/analytics/behavior';
import { initSession, trackPageView, getSessionId } from '@/lib/analytics/session';

/**
 * BehaviorTracker Component
 *
 * Initializes all behavior tracking:
 * - Mouse movements
 * - Scroll tracking
 * - Click tracking (including rage click detection)
 * - Time on page
 * - Page views
 * - Session management
 *
 * Usage: Include once in your app layout
 *
 * @example
 * // In app/layout.tsx
 * import { BehaviorTracker } from '@/components/analytics';
 *
 * <body>
 *   {children}
 *   <BehaviorTracker />
 * </body>
 */

interface BehaviorTrackerProps {
  /**
   * Track mouse movements (can impact performance)
   * @default true
   */
  trackMouse?: boolean;

  /**
   * Track scroll events
   * @default true
   */
  trackScroll?: boolean;

  /**
   * Track click events
   * @default true
   */
  trackClicks?: boolean;

  /**
   * Track time on page
   * @default true
   */
  trackTime?: boolean;

  /**
   * Track form interactions
   * @default true
   */
  trackForms?: boolean;

  /**
   * Enable debug logging
   * @default false in production
   */
  debug?: boolean;
}

export default function BehaviorTracker({
  trackMouse = true,
  trackScroll = true,
  trackClicks = true,
  trackTime = true,
  trackForms = true,
  debug = process.env.NODE_ENV === 'development',
}: BehaviorTrackerProps) {
  const pathname = usePathname();

  // Initialize session and behavior tracking on mount
  useEffect(() => {
    initSession();
    initBehaviorTracking({
      trackScroll,
      trackMouse,
      trackClicks,
      trackTime,
    });

    if (debug) {
      console.log('[BehaviorTracker] Initialized with session:', getSessionId());
    }

    return () => {
      cleanupBehaviorTracking();
      if (debug) {
        console.log('[BehaviorTracker] Cleaned up');
      }
    };
  }, [trackScroll, trackMouse, trackClicks, trackTime, debug]);

  // Track page views on route change
  useEffect(() => {
    trackPageView(pathname);
    if (debug) {
      console.log('[BehaviorTracker] Page view:', pathname);
    }
  }, [pathname, debug]);

  // Set up form tracking
  useEffect(() => {
    if (!trackForms) return;

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const form = target.closest('form');
        const fieldName = target.getAttribute('name') || target.getAttribute('id') || 'unnamed';
        trackFormFocus(fieldName, form?.id);

        if (debug) {
          console.log('[BehaviorTracker] Form focus:', fieldName);
        }
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const form = target.closest('form');
        const fieldName = target.getAttribute('name') || target.getAttribute('id') || 'unnamed';
        trackFormBlur(fieldName, form?.id);

        if (debug) {
          console.log('[BehaviorTracker] Form blur:', fieldName);
        }
      }
    };

    const handleChange = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const form = target.closest('form');
        const fieldName = target.getAttribute('name') || target.getAttribute('id') || 'unnamed';
        trackFormChange(fieldName, form?.id);
      }
    };

    const handleSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      trackFormSubmit(form.id);

      if (debug) {
        console.log('[BehaviorTracker] Form submit:', form.id);
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    document.addEventListener('change', handleChange);
    document.addEventListener('submit', handleSubmit);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('change', handleChange);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [trackForms, debug]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook for accessing behavior tracking functions
 */
export function useBehaviorTracking() {
  return {
    trackFormFocus,
    trackFormBlur,
    trackFormChange,
    trackFormSubmit,
    getSessionId,
    trackPageView,
  };
}
