'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { trackHotjarEvent } from './Hotjar';

/**
 * ScrollDepthTracker Component
 *
 * Tracks scroll depth milestones (25%, 50%, 75%, 100%) and fires events
 * at each milestone. Integrates with both custom analytics and Hotjar.
 *
 * Usage:
 * - Include in layout.tsx for global tracking
 * - Or include in specific pages for targeted tracking
 */

export interface ScrollMilestone {
  percentage: number;
  reached: boolean;
  timestamp?: number;
}

interface ScrollDepthTrackerProps {
  /**
   * Custom milestones to track (default: [25, 50, 75, 100])
   */
  milestones?: number[];

  /**
   * Callback when a milestone is reached
   */
  onMilestoneReached?: (milestone: ScrollMilestone) => void;

  /**
   * Whether to send events to the analytics API
   */
  sendToApi?: boolean;

  /**
   * Whether to track in Hotjar
   */
  trackInHotjar?: boolean;

  /**
   * Debounce delay in milliseconds
   */
  debounceMs?: number;
}

export default function ScrollDepthTracker({
  milestones = [25, 50, 75, 100],
  onMilestoneReached,
  sendToApi = true,
  trackInHotjar = true,
  debounceMs = 100,
}: ScrollDepthTrackerProps) {
  const reachedMilestones = useRef<Set<number>>(new Set());
  const pageLoadTime = useRef<number>(Date.now());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Send scroll event to API
  const sendScrollEvent = useCallback(async (milestone: number) => {
    if (!sendToApi) return;

    try {
      await fetch('/api/analytics/behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [{
            type: 'scroll_milestone',
            timestamp: Date.now(),
            page: window.location.pathname,
            sessionId: sessionStorage.getItem('behavior_session_id') || 'unknown',
            data: {
              milestone,
              timeToReach: Date.now() - pageLoadTime.current,
            },
          }],
        }),
      });
    } catch (error) {
      console.error('Failed to send scroll event:', error);
    }
  }, [sendToApi]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Check each milestone
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !reachedMilestones.current.has(milestone)) {
          reachedMilestones.current.add(milestone);

          const milestoneData: ScrollMilestone = {
            percentage: milestone,
            reached: true,
            timestamp: Date.now(),
          };

          // Fire custom callback
          if (onMilestoneReached) {
            onMilestoneReached(milestoneData);
          }

          // Track in Hotjar
          if (trackInHotjar) {
            trackHotjarEvent(`scroll_depth_${milestone}`);
          }

          // Send to API
          sendScrollEvent(milestone);

          // Log for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log(`[ScrollDepth] Milestone reached: ${milestone}%`);
          }
        }
      });
    }, debounceMs);
  }, [milestones, onMilestoneReached, trackInHotjar, sendScrollEvent, debounceMs]);

  // Set up scroll listener
  useEffect(() => {
    // Reset on page change
    pageLoadTime.current = Date.now();
    reachedMilestones.current.clear();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position (in case page loads scrolled)
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [handleScroll]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook version for more control
 */
export function useScrollDepthTracking(options?: Omit<ScrollDepthTrackerProps, 'onMilestoneReached'>) {
  const milestones = useMemo(
    () => options?.milestones || [25, 50, 75, 100],
    [options?.milestones]
  );
  const reachedMilestones = useRef<Map<number, ScrollMilestone>>(new Map());

  const getMilestones = useCallback(() => {
    return Array.from(reachedMilestones.current.values());
  }, []);

  const getMaxDepth = useCallback(() => {
    const reached = Array.from(reachedMilestones.current.keys());
    return reached.length > 0 ? Math.max(...reached) : 0;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !reachedMilestones.current.has(milestone)) {
          reachedMilestones.current.set(milestone, {
            percentage: milestone,
            reached: true,
            timestamp: Date.now(),
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [milestones]);

  return {
    getMilestones,
    getMaxDepth,
  };
}
