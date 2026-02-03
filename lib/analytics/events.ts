import { track } from '@vercel/analytics'

/**
 * Vercel Analytics Event Tracking for PoolOps
 *
 * These functions use Vercel Analytics for custom event tracking.
 * Page views are tracked automatically by Vercel Analytics.
 *
 * Note: This module works alongside the existing Google Analytics
 * integration in google-analytics.ts for dual tracking.
 */

// Event Types for Vercel Analytics
export type VercelCTAType =
  | 'hero_start_trial'
  | 'hero_book_demo'
  | 'nav_start_trial'
  | 'pricing_select_plan'
  | 'footer_cta'
  | 'convention_start_trial'
  | 'convention_book_demo'

export type VercelFeatureType =
  | 'route_optimization'
  | 'chemistry_tracking'
  | 'invoicing'
  | 'customer_portal'
  | 'mobile_app'
  | 'scheduling'
  | 'reports'

export type VercelPricingPlan = 'starter' | 'professional' | 'enterprise' | 'convention-special' | 'founder'

// ============================================
// VERCEL ANALYTICS - CTA TRACKING
// ============================================

/**
 * Track CTA button clicks with Vercel Analytics
 */
export function vercelTrackCTAClick(ctaType: VercelCTAType, additionalData?: Record<string, string | number>) {
  track('cta_click', {
    cta_type: ctaType,
    ...additionalData,
  })
}

// ============================================
// VERCEL ANALYTICS - CONVERSION TRACKING
// ============================================

/**
 * Track demo request with Vercel Analytics
 */
export function vercelTrackDemoRequest(source: string, email?: string) {
  track('demo_request', {
    source,
    has_email: email ? 'yes' : 'no',
  })
}

/**
 * Track trial start with Vercel Analytics
 */
export function vercelTrackTrialStart(plan: VercelPricingPlan, source: string) {
  track('trial_start', {
    plan,
    source,
  })
}

/**
 * Track pricing page view with Vercel Analytics
 */
export function vercelTrackPricingView(source?: string) {
  track('pricing_view', {
    source: source || 'direct',
  })
}

/**
 * Track feature interest with Vercel Analytics
 */
export function vercelTrackFeatureInterest(feature: VercelFeatureType, action: 'view' | 'click' | 'learn_more') {
  track('feature_interest', {
    feature,
    action,
  })
}

// ============================================
// VERCEL ANALYTICS - CONVENTION TRACKING
// ============================================

/**
 * Track convention page view with Vercel Analytics
 */
export function vercelTrackConventionPageView(conventionName: string) {
  track('convention_page_view', {
    convention: conventionName,
  })
}

/**
 * Track convention action with Vercel Analytics
 */
export function vercelTrackConventionAction(conventionName: string, action: 'scan_qr' | 'claim_offer' | 'view_demo') {
  track('convention_action', {
    convention: conventionName,
    action,
  })
}

// ============================================
// VERCEL ANALYTICS - CHECKOUT TRACKING
// ============================================

/**
 * Track checkout start with Vercel Analytics
 */
export function vercelTrackCheckoutStart(plan: VercelPricingPlan, price: number) {
  track('checkout_start', {
    plan,
    price: String(price),
  })
}

/**
 * Track checkout complete with Vercel Analytics
 */
export function vercelTrackCheckoutComplete(plan: VercelPricingPlan, price: number) {
  track('checkout_complete', {
    plan,
    price: String(price),
  })
}

// ============================================
// VERCEL ANALYTICS - FORM TRACKING
// ============================================

/**
 * Track form start with Vercel Analytics
 */
export function vercelTrackFormStart(formType: 'contact' | 'demo' | 'trial' | 'newsletter') {
  track('form_start', {
    form_type: formType,
  })
}

/**
 * Track form complete with Vercel Analytics
 */
export function vercelTrackFormComplete(formType: 'contact' | 'demo' | 'trial' | 'newsletter') {
  track('form_complete', {
    form_type: formType,
  })
}

// ============================================
// VERCEL ANALYTICS - ENGAGEMENT TRACKING
// ============================================

/**
 * Track navigation with Vercel Analytics
 */
export function vercelTrackNavigation(from: string, to: string) {
  track('navigation', {
    from,
    to,
  })
}

/**
 * Track scroll depth with Vercel Analytics
 */
export function vercelTrackScrollDepth(depth: 25 | 50 | 75 | 100, pageName: string) {
  track('scroll_depth', {
    depth: String(depth),
    page: pageName,
  })
}

/**
 * Generic custom event for flexibility
 */
export function vercelTrackCustomEvent(eventName: string, properties: Record<string, string | number>) {
  track(eventName, properties)
}
