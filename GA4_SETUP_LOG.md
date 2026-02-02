# Google Analytics 4 Setup Log for PoolApp

## Overview

This document describes the Google Analytics 4 (GA4) integration implemented for PoolApp, a Next.js 14 application using the App Router.

## Files Created/Modified

### 1. Analytics Library (`/lib/analytics/`)

#### `/lib/analytics/google-analytics.ts`
Core GA4 implementation with:
- Type declarations for gtag global
- GA4 initialization
- Page view tracking
- Custom event tracking
- **Conversion Events:**
  - `trackDemoRequest(source?)` - Lead generation tracking
  - `trackTrialSignup(plan?)` - Free trial signup conversion
  - `trackPricingPageView(source?)` - Pricing page engagement
  - `trackCheckoutStart(plan, price, currency?)` - Checkout initiation (GA4 begin_checkout)
  - `trackPurchaseComplete(transactionId, plan, price, currency?)` - Purchase conversion (GA4 purchase)
- **User Engagement Events:**
  - `trackFeatureUsage(featureName, action)`
  - `trackROICalculator(action, poolCount?, estimatedSavings?)`
  - `trackFormInteraction(formName, action, errorMessage?)`
  - `trackCTAClick(ctaName, location, destination?)`
  - `trackVideoInteraction(videoName, action, progress?)`
- **Onboarding Events:**
  - `trackOnboardingStep(stepNumber, stepName, completed?)`
  - `trackOnboardingComplete(totalSteps, timeSpentSeconds?)`
- **Error Tracking:**
  - `trackError(errorMessage, errorSource, fatal?)`
  - `trackAPIError(endpoint, statusCode, errorMessage?)`
- **User Properties:**
  - `setUserProperties(properties)`
  - `setUserId(userId)`
- **Privacy/Consent:**
  - `optOut()` - Disable GA tracking
  - `optIn()` - Re-enable GA tracking

#### `/lib/analytics/gtm.ts`
Google Tag Manager (GTM) alternative implementation with:
- Data layer management
- Page view tracking via GTM
- E-commerce events (view_item, add_to_cart, begin_checkout, purchase)
- Conversion events (demo_request, trial_signup, form_submit)
- User data management

#### `/lib/analytics/index.ts`
Central export point for all analytics functionality.

### 2. Analytics Components (`/components/analytics/`)

#### `/components/analytics/GoogleAnalytics.tsx`
React client component that:
- Loads GA4 gtag.js script using `next/script` with `afterInteractive` strategy
- Initializes GA4 configuration
- Tracks page views on route changes using `usePathname` and `useSearchParams`
- Wraps route tracking in Suspense boundary for proper SSR handling

#### `/components/analytics/GoogleTagManager.tsx`
React client component that:
- Loads GTM container script
- Provides `GTMNoScript` component for noscript fallback
- Tracks page views on route changes

#### `/components/analytics/index.ts`
Central export for analytics components.

### 3. Custom Hook (`/lib/hooks/use-analytics.ts`)

React hook for easy analytics usage throughout the app:
```tsx
const { trackCTA, trackForm, trackDemo } = useAnalytics();

// Example usage
const handleClick = () => {
  trackCTA('start_trial', 'hero_section', '/signup');
  router.push('/signup');
};
```

### 4. Root Layout (`/app/layout.tsx`)

Added GoogleAnalytics component:
```tsx
import { GoogleAnalytics } from '@/components/analytics'

// In body, after main content:
<GoogleAnalytics />
```

### 5. Environment Variables (`.env.example`)

Added:
```env
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager (alternative)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Setup Instructions

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click Admin (gear icon)
3. Click "Create Property"
4. Enter property name: "PoolApp"
5. Configure business details
6. Create a Web data stream for your domain

### Step 2: Get Measurement ID

1. In GA4, go to Admin > Data Streams
2. Click on your web stream
3. Copy the Measurement ID (format: G-XXXXXXXXXX)

### Step 3: Configure Environment Variable

Add to `.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR-ACTUAL-ID
```

### Step 4: Verify Installation

1. Deploy or run locally
2. Open Google Analytics Real-Time view
3. Navigate your site and confirm events appear

## Conversion Events Setup in GA4

To track conversions in GA4:

1. Go to GA4 Admin > Events
2. Find your events (demo_request, trial_signup, purchase, etc.)
3. Toggle "Mark as conversion" for key events

### Recommended Conversions

| Event Name | Description | Value |
|------------|-------------|-------|
| `demo_request` | User requests a demo | Lead value |
| `trial_signup` | User starts free trial | Trial value |
| `purchase` | User completes subscription | Transaction value |
| `checkout_start` | User initiates checkout | Intent signal |

## Google Ads Integration

To import GA4 conversions to Google Ads:

1. Link GA4 to Google Ads in GA4 Admin > Google Ads Linking
2. In Google Ads, go to Tools > Conversions
3. Click "Import" and select Google Analytics 4 properties
4. Select the conversions you want to track

## GTM Alternative Setup

If you prefer using Google Tag Manager:

1. Create GTM container at [tagmanager.google.com](https://tagmanager.google.com/)
2. Get Container ID (format: GTM-XXXXXXX)
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GTM_ID=GTM-YOUR-CONTAINER-ID
   ```
4. Replace GoogleAnalytics with GoogleTagManager in layout:
   ```tsx
   import { GoogleTagManager, GTMNoScript } from '@/components/analytics/GoogleTagManager'

   // In <head>:
   <GoogleTagManager />

   // First thing in <body>:
   <GTMNoScript />
   ```

## Usage Examples

### Track Button Clicks
```tsx
import { trackCTAClick } from '@/lib/analytics';

<button onClick={() => {
  trackCTAClick('start_free_trial', 'pricing_section', '/signup');
}}>
  Start Free Trial
</button>
```

### Track Form Submissions
```tsx
import { trackFormInteraction, trackTrialSignup } from '@/lib/analytics';

const handleSubmit = async (data) => {
  trackFormInteraction('signup_form', 'submit');

  try {
    await submitForm(data);
    trackTrialSignup('growth');
  } catch (error) {
    trackFormInteraction('signup_form', 'error', error.message);
  }
};
```

### Track E-commerce
```tsx
import { trackCheckoutStart, trackPurchaseComplete } from '@/lib/analytics';

// When user clicks checkout
trackCheckoutStart('growth_monthly', 99, 'USD');

// After successful payment
trackPurchaseComplete(
  'txn_123456',
  'growth_monthly',
  99,
  'USD'
);
```

### Using the Hook
```tsx
import { useAnalytics } from '@/lib/hooks/use-analytics';

function PricingCard() {
  const { trackPricing, trackCheckout, trackCTA } = useAnalytics();

  useEffect(() => {
    trackPricing('pricing_page');
  }, []);

  return (
    <button onClick={() => {
      trackCTA('select_plan', 'pricing_card');
      trackCheckout('growth', 99);
    }}>
      Select Plan
    </button>
  );
}
```

## Privacy Compliance

### GDPR/CCPA Compliance

The implementation includes opt-out functionality:

```tsx
import { optOut, optIn } from '@/lib/analytics';

// In your cookie consent component
const handleReject = () => {
  optOut();
  saveCookiePreference('rejected');
};

const handleAccept = () => {
  optIn();
  saveCookiePreference('accepted');
};
```

### IP Anonymization

GA4 automatically anonymizes IP addresses by default.

## Testing

### Debug Mode

Enable GA4 debug mode in browser:
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Enable the extension
3. Open browser DevTools console to see GA4 events

### Verifying Events

1. Go to GA4 > Reports > Realtime
2. Perform actions on your site
3. Verify events appear in real-time

## Troubleshooting

### Events Not Appearing

1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Check browser console for errors
3. Ensure ad blockers are disabled for testing
4. Wait 24-48 hours for historical reports to populate

### Page Views Not Tracking

1. Verify GoogleAnalytics component is in layout.tsx
2. Check that routes use Next.js navigation (not hard refreshes)
3. Confirm Suspense boundary is present for useSearchParams

## Build Verification

Build tested successfully:
```
npm run build
 Compiled successfully
 Generating static pages (31/31)
```

## Date

Setup completed: 2026-02-01
