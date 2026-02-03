/**
 * Google Analytics 4 Integration for PoolOps
 *
 * This module provides GA4 tracking functionality including:
 * - Page view tracking
 * - Custom event tracking
 * - E-commerce events (for Stripe integration)
 * - Conversion tracking for marketing funnels
 */

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// GA4 Measurement ID from environment variables
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Check if GA is enabled
export const isGAEnabled = (): boolean => {
  return typeof window !== 'undefined' &&
         !!GA_MEASUREMENT_ID &&
         GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX';
};

/**
 * Initialize Google Analytics
 * Called once when the app loads
 */
export const initGA = (): void => {
  if (!isGAEnabled()) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });
};

/**
 * Track page views
 * Call this on route changes in Next.js
 */
export const trackPageView = (url: string, title?: string): void => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
};

/**
 * Track custom events
 * Generic event tracking function
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, unknown>
): void => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalParams,
  });
};

// ============================================
// CONVERSION TRACKING
// Marketing funnel events for PoolOps
// ============================================

/**
 * Track demo request submissions
 */
export const trackDemoRequest = (source?: string): void => {
  trackEvent('demo_request', 'lead_generation', source, undefined, {
    conversion: true,
  });

  // Also send as GA4 conversion event
  if (isGAEnabled()) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_MEASUREMENT_ID}/demo_request`,
    });
  }
};

/**
 * Track free trial signups
 */
export const trackTrialSignup = (plan?: string): void => {
  trackEvent('trial_signup', 'conversion', plan, undefined, {
    conversion: true,
    plan_type: plan,
  });

  if (isGAEnabled()) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_MEASUREMENT_ID}/trial_signup`,
    });
  }
};

/**
 * Track pricing page views
 */
export const trackPricingPageView = (source?: string): void => {
  trackEvent('pricing_page_view', 'engagement', source);
};

/**
 * Track checkout initiation
 */
export const trackCheckoutStart = (
  plan: string,
  price: number,
  currency: string = 'USD'
): void => {
  trackEvent('checkout_start', 'ecommerce', plan, price, {
    currency,
    plan_name: plan,
  });

  // GA4 begin_checkout event
  if (isGAEnabled()) {
    window.gtag('event', 'begin_checkout', {
      currency,
      value: price,
      items: [{
        item_id: plan,
        item_name: `PoolOps ${plan}`,
        price: price,
        quantity: 1,
      }],
    });
  }
};

/**
 * Track successful purchase/subscription
 */
export const trackPurchaseComplete = (
  transactionId: string,
  plan: string,
  price: number,
  currency: string = 'USD'
): void => {
  trackEvent('purchase_complete', 'ecommerce', plan, price, {
    transaction_id: transactionId,
    currency,
    conversion: true,
  });

  // GA4 purchase event
  if (isGAEnabled()) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: price,
      currency,
      items: [{
        item_id: plan,
        item_name: `PoolOps ${plan}`,
        price: price,
        quantity: 1,
      }],
    });

    // Also send as conversion
    window.gtag('event', 'conversion', {
      send_to: `${GA_MEASUREMENT_ID}/purchase`,
      value: price,
      currency,
      transaction_id: transactionId,
    });
  }
};

// ============================================
// USER ENGAGEMENT EVENTS
// Track user interactions within the app
// ============================================

/**
 * Track feature usage
 */
export const trackFeatureUsage = (
  featureName: string,
  action: 'view' | 'use' | 'complete' = 'use'
): void => {
  trackEvent(`feature_${action}`, 'engagement', featureName);
};

/**
 * Track ROI calculator usage
 */
export const trackROICalculator = (
  action: 'start' | 'complete',
  poolCount?: number,
  estimatedSavings?: number
): void => {
  trackEvent(`roi_calculator_${action}`, 'engagement', undefined, estimatedSavings, {
    pool_count: poolCount,
    estimated_savings: estimatedSavings,
  });
};

/**
 * Track form interactions
 */
export const trackFormInteraction = (
  formName: string,
  action: 'start' | 'submit' | 'error' | 'abandon',
  errorMessage?: string
): void => {
  trackEvent(`form_${action}`, 'forms', formName, undefined, {
    error_message: errorMessage,
  });
};

/**
 * Track CTA clicks
 */
export const trackCTAClick = (
  ctaName: string,
  location: string,
  destination?: string
): void => {
  trackEvent('cta_click', 'engagement', ctaName, undefined, {
    cta_location: location,
    destination_url: destination,
  });
};

/**
 * Track video interactions
 */
export const trackVideoInteraction = (
  videoName: string,
  action: 'play' | 'pause' | 'complete' | 'progress',
  progress?: number
): void => {
  trackEvent(`video_${action}`, 'video', videoName, progress, {
    video_progress: progress,
  });
};

// ============================================
// ONBOARDING TRACKING
// Track user progress through onboarding
// ============================================

/**
 * Track onboarding step completion
 */
export const trackOnboardingStep = (
  stepNumber: number,
  stepName: string,
  completed: boolean = true
): void => {
  trackEvent(
    completed ? 'onboarding_step_complete' : 'onboarding_step_start',
    'onboarding',
    stepName,
    stepNumber
  );
};

/**
 * Track onboarding completion
 */
export const trackOnboardingComplete = (
  totalSteps: number,
  timeSpentSeconds?: number
): void => {
  trackEvent('onboarding_complete', 'onboarding', undefined, totalSteps, {
    time_spent_seconds: timeSpentSeconds,
    conversion: true,
  });
};

// ============================================
// ERROR TRACKING
// Track errors for debugging and UX improvement
// ============================================

/**
 * Track JavaScript errors
 */
export const trackError = (
  errorMessage: string,
  errorSource: string,
  fatal: boolean = false
): void => {
  trackEvent('exception', 'error', errorMessage, undefined, {
    description: errorMessage,
    source: errorSource,
    fatal,
  });
};

/**
 * Track API errors
 */
export const trackAPIError = (
  endpoint: string,
  statusCode: number,
  errorMessage?: string
): void => {
  trackEvent('api_error', 'error', endpoint, statusCode, {
    status_code: statusCode,
    error_message: errorMessage,
  });
};

// ============================================
// USER PROPERTIES
// Set custom user dimensions
// ============================================

/**
 * Set user properties for segmentation
 */
export const setUserProperties = (
  properties: Record<string, string | number | boolean>
): void => {
  if (!isGAEnabled()) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Set user ID for cross-device tracking
 */
export const setUserId = (userId: string): void => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Opt user out of analytics
 */
export const optOut = (): void => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  }
};

/**
 * Opt user back into analytics
 */
export const optIn = (): void => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  }
};
