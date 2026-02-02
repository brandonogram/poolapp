/**
 * Analytics Module Exports - CLIENT-SAFE
 *
 * This file only exports client-safe analytics functionality.
 * For server-side features (storage, monitor, improvement-loop),
 * import directly from those modules in API routes only.
 */

// Google Analytics 4
export {
  GA_MEASUREMENT_ID,
  isGAEnabled,
  initGA,
  trackPageView,
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
  trackVideoInteraction,
  trackOnboardingStep,
  trackOnboardingComplete,
  trackError,
  trackAPIError,
  setUserProperties,
  setUserId,
  optOut,
  optIn,
} from './google-analytics';

// Google Tag Manager
export {
  GTM_ID,
  isGTMEnabled,
  pushToDataLayer,
  gtmPageView,
  gtmEvent,
  gtmViewItem,
  gtmAddToCart,
  gtmBeginCheckout,
  gtmPurchase,
  gtmDemoRequest,
  gtmTrialSignup,
  gtmFormSubmit,
  gtmSetUser,
} from './gtm';

// Vercel Analytics Events
export {
  vercelTrackCTAClick,
  vercelTrackDemoRequest,
  vercelTrackTrialStart,
  vercelTrackPricingView,
  vercelTrackFeatureInterest,
  vercelTrackConventionPageView,
  vercelTrackConventionAction,
  vercelTrackCheckoutStart,
  vercelTrackCheckoutComplete,
  vercelTrackFormStart,
  vercelTrackFormComplete,
  vercelTrackNavigation,
  vercelTrackScrollDepth,
  vercelTrackCustomEvent,
  type VercelCTAType,
  type VercelFeatureType,
  type VercelPricingPlan,
} from './events';
