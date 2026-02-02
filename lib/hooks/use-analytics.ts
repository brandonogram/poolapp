'use client';

import { useCallback } from 'react';
import {
  trackEvent,
  trackDemoRequest,
  trackTrialSignup,
  trackPricingPageView,
  trackCheckoutStart,
  trackPurchaseComplete,
  trackFeatureUsage,
  trackROICalculator,
  trackFormInteraction,
  trackCTAClick,
  trackOnboardingStep,
  trackOnboardingComplete,
  trackError,
  setUserProperties,
  setUserId,
} from '@/lib/analytics';

/**
 * Custom hook for easy analytics tracking throughout the app
 *
 * Usage:
 * ```tsx
 * const { trackCTA, trackForm } = useAnalytics();
 *
 * const handleClick = () => {
 *   trackCTA('start_trial', 'hero_section', '/signup');
 *   router.push('/signup');
 * };
 * ```
 */
export function useAnalytics() {
  // Generic event tracking
  const track = useCallback(
    (action: string, category: string, label?: string, value?: number) => {
      trackEvent(action, category, label, value);
    },
    []
  );

  // Conversion tracking
  const trackDemo = useCallback((source?: string) => {
    trackDemoRequest(source);
  }, []);

  const trackTrial = useCallback((plan?: string) => {
    trackTrialSignup(plan);
  }, []);

  const trackPricing = useCallback((source?: string) => {
    trackPricingPageView(source);
  }, []);

  const trackCheckout = useCallback(
    (plan: string, price: number, currency: string = 'USD') => {
      trackCheckoutStart(plan, price, currency);
    },
    []
  );

  const trackPurchase = useCallback(
    (transactionId: string, plan: string, price: number, currency: string = 'USD') => {
      trackPurchaseComplete(transactionId, plan, price, currency);
    },
    []
  );

  // Engagement tracking
  const trackFeature = useCallback(
    (featureName: string, action: 'view' | 'use' | 'complete' = 'use') => {
      trackFeatureUsage(featureName, action);
    },
    []
  );

  const trackROI = useCallback(
    (action: 'start' | 'complete', poolCount?: number, estimatedSavings?: number) => {
      trackROICalculator(action, poolCount, estimatedSavings);
    },
    []
  );

  const trackForm = useCallback(
    (formName: string, action: 'start' | 'submit' | 'error' | 'abandon', errorMessage?: string) => {
      trackFormInteraction(formName, action, errorMessage);
    },
    []
  );

  const trackCTA = useCallback(
    (ctaName: string, location: string, destination?: string) => {
      trackCTAClick(ctaName, location, destination);
    },
    []
  );

  // Onboarding tracking
  const trackStep = useCallback(
    (stepNumber: number, stepName: string, completed: boolean = true) => {
      trackOnboardingStep(stepNumber, stepName, completed);
    },
    []
  );

  const trackComplete = useCallback(
    (totalSteps: number, timeSpentSeconds?: number) => {
      trackOnboardingComplete(totalSteps, timeSpentSeconds);
    },
    []
  );

  // Error tracking
  const trackErr = useCallback(
    (errorMessage: string, errorSource: string, fatal: boolean = false) => {
      trackError(errorMessage, errorSource, fatal);
    },
    []
  );

  // User tracking
  const setUser = useCallback((userId: string) => {
    setUserId(userId);
  }, []);

  const setProperties = useCallback(
    (properties: Record<string, string | number | boolean>) => {
      setUserProperties(properties);
    },
    []
  );

  return {
    // Generic
    track,
    // Conversions
    trackDemo,
    trackTrial,
    trackPricing,
    trackCheckout,
    trackPurchase,
    // Engagement
    trackFeature,
    trackROI,
    trackForm,
    trackCTA,
    // Onboarding
    trackStep,
    trackComplete,
    // Error
    trackErr,
    // User
    setUser,
    setProperties,
  };
}

export default useAnalytics;
