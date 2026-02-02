# Pool App - Internal Analytics Monitoring System

## Setup Log

**Date**: February 1, 2026
**Status**: Implemented

---

## Overview

This document describes the internal analytics monitoring system for PoolApp. The system provides:
- Real-time metrics collection (page views, events, conversions)
- AI-generated improvement recommendations
- A/B testing framework
- Admin dashboard for viewing KPIs

---

## Architecture

### File Structure

```
lib/analytics/
  ├── index.ts           # Client-safe exports (GA, GTM, Vercel Analytics)
  ├── server.ts          # Server-only exports (storage, monitor, improvements)
  ├── types.ts           # TypeScript type definitions
  ├── storage.ts         # File-based storage operations
  ├── monitor.ts         # Metrics aggregation & analysis
  ├── improvements.ts    # Recommendation engine & A/B testing
  ├── google-analytics.ts # Google Analytics 4 integration
  ├── gtm.ts             # Google Tag Manager integration
  ├── events.ts          # Vercel Analytics events
  ├── session.ts         # Session management
  ├── behavior.ts        # User behavior tracking
  ├── ab-testing.ts      # A/B testing helpers
  ├── reporter.ts        # Metrics reporting
  ├── rules-engine.ts    # Automation rules
  └── improvement-loop.ts # Continuous improvement logic

app/api/analytics/
  ├── route.ts           # GET metrics, POST events
  ├── behavior/
  │   └── route.ts       # Behavior tracking API
  └── insights/
      └── route.ts       # GET insights, POST update recommendations

app/(dashboard)/admin/analytics/
  └── page.tsx           # Admin analytics dashboard

data/analytics/
  └── store.json         # Local analytics data storage (gitignored)
```

---

## API Endpoints

### GET /api/analytics

Retrieve analytics metrics.

**Query Parameters:**
- `type`: `summary` | `pageviews` | `events` | `conversions` | `raw` (default: `summary`)
- `start`: ISO date string (default: 7 days ago)
- `end`: ISO date string (default: now)
- `granularity`: `hour` | `day` | `week` | `month` (default: `day`)
- `limit`: number (default: 100)

**Example:**
```bash
curl "/api/analytics?type=summary&start=2026-01-25T00:00:00Z"
```

### POST /api/analytics

Log analytics events.

**Request Body:**
```json
{
  "type": "pageview" | "event" | "conversion",
  "data": {
    // For pageview:
    "path": "/dashboard",
    "sessionId": "session_123",
    "referrer": "https://google.com",
    "duration": 5000,

    // For event:
    "category": "interaction",
    "action": "button_click",
    "label": "signup_cta",
    "value": 1,
    "sessionId": "session_123",
    "path": "/",

    // For conversion:
    "type": "signup_completed",
    "value": 99,
    "sessionId": "session_123",
    "path": "/onboarding",
    "funnelStep": 4
  }
}
```

### GET /api/analytics/insights

Generate comprehensive insights and recommendations.

**Query Parameters:**
- `start`: ISO date string
- `end`: ISO date string
- `granularity`: `hour` | `day` | `week` | `month`
- `includeABTests`: `true` | `false`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": { ... },
    "recommendations": [ ... ],
    "trends": [ ... ],
    "alerts": [ ... ],
    "abTestSuggestions": [ ... ]
  }
}
```

### POST /api/analytics/insights

Update recommendation status.

**Request Body:**
```json
{
  "action": "acknowledge" | "dismiss" | "complete" | "update_status",
  "recommendationId": "rec_123",
  "status": "in_progress"  // Only for update_status action
}
```

---

## Data Types

### PageView
- `id`: Unique identifier
- `path`: URL path
- `referrer`: Referring URL
- `sessionId`: Session identifier
- `userId`: Optional user ID
- `companyId`: Optional company ID
- `duration`: Time spent on page (ms)
- `scrollDepth`: Scroll percentage (0-100)
- `timestamp`: ISO timestamp

### AnalyticsEvent
- `id`: Unique identifier
- `category`: Event category (navigation, interaction, form, error, performance, engagement, feature_usage, onboarding, billing)
- `action`: Event action
- `label`: Optional label
- `value`: Optional numeric value
- `sessionId`, `userId`, `companyId`, `path`, `timestamp`

### Conversion
- `id`: Unique identifier
- `type`: Conversion type (signup_started, signup_completed, trial_started, subscription_started, etc.)
- `value`: Monetary value
- `funnelStep`: Position in conversion funnel
- `attributionSource`: Traffic source
- `sessionId`, `userId`, `companyId`, `path`, `timestamp`

### Recommendation
- `id`: Unique identifier
- `type`: Recommendation type (conversion_optimization, engagement_improvement, performance_fix, etc.)
- `priority`: critical | high | medium | low
- `title`, `description`, `impact`
- `effort`: low | medium | high
- `metrics`: { current, target, unit }
- `actions`: Array of suggested actions
- `status`: new | acknowledged | in_progress | completed | dismissed

---

## Storage

Analytics data is stored in JSON files under `data/analytics/store.json`.

**Retention Policy:**
- Page views and events: 30 days
- Conversions: 90 days
- Recommendations: Last 100 entries

**Environment Variable:**
- `ANALYTICS_DATA_DIR`: Custom data directory (default: `./data/analytics`)

---

## Recommendation Engine

The system includes 9 built-in improvement templates:

1. **High Bounce Rate** - Triggered when bounce rate > 60%
2. **Low Trial Conversion** - Triggered when conversion rate < 3%
3. **Low Session Duration** - Triggered when avg session < 2 minutes
4. **Low Page Depth** - Triggered when pages/session < 3
5. **Slow Page Load** - Triggered when load time > 3 seconds
6. **High Error Rate** - Triggered when error rate > 1%
7. **Low Feature Adoption** - Based on feature usage events
8. **Form Abandonment** - Based on form interaction patterns
9. **Incomplete Onboarding** - Based on onboarding completion rate

---

## A/B Testing Framework

### Creating a Test

```typescript
// Server-side only - import from server.ts
import { createABTest, saveABTest } from '@/lib/analytics/server';

const test = createABTest({
  name: 'Homepage Hero Test',
  description: 'Testing new hero message',
  targetPath: '/',
  variants: [
    { name: 'Control', description: 'Current hero', weight: 50 },
    { name: 'Variant A', description: 'New hero message', weight: 50 },
  ],
  primaryMetric: 'signup_started',
  sampleSize: 1000,
});

await saveABTest(test);
```

### Assigning Users to Variants

```typescript
// Server-side only - import from server.ts
import { getABTestById, assignVariant } from '@/lib/analytics/server';

const test = await getABTestById('test_123');
const variant = assignVariant(test, userId);
```

### Recording Results

```typescript
// Server-side only - import from server.ts
import { recordVariantView, recordVariantConversion, determineWinner } from '@/lib/analytics/server';

// Record a view
let updatedTest = recordVariantView(test, variantId);

// Record a conversion
updatedTest = recordVariantConversion(updatedTest, variantId);

// Check for statistical significance
updatedTest = determineWinner(updatedTest);
```

---

## Admin Dashboard

Access the analytics dashboard at `/admin/analytics`.

### Features:
- **Date Range Selector**: 24h, 7d, 30d, 90d
- **Key Metrics Cards**: Page views, conversion rate, bounce rate, session duration
- **User Metrics**: Unique users, sessions, new vs returning
- **Performance Metrics**: Load time, TTI, error rate
- **Trend Indicators**: Comparison with previous period
- **Alerts**: Real-time alerts for threshold violations
- **Recommendations**: Actionable improvement suggestions with status tracking
- **Top Pages Table**: Most visited pages with engagement metrics

---

## Usage Examples

### Track Page View (Client-Side)

```typescript
// In a React component
useEffect(() => {
  const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
  localStorage.setItem('sessionId', sessionId);

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'pageview',
      data: {
        path: window.location.pathname,
        sessionId,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      },
    }),
  });
}, []);
```

### Track Button Click

```typescript
const trackClick = async (buttonName: string) => {
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'event',
      data: {
        category: 'interaction',
        action: 'button_click',
        label: buttonName,
        sessionId: localStorage.getItem('sessionId'),
        path: window.location.pathname,
      },
    }),
  });
};
```

### Track Conversion

```typescript
const trackSignup = async (userId: string, planValue: number) => {
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'conversion',
      data: {
        type: 'signup_completed',
        value: planValue,
        sessionId: localStorage.getItem('sessionId'),
        userId,
        path: window.location.pathname,
        funnelStep: 4,
        attributionSource: new URLSearchParams(window.location.search).get('utm_source'),
      },
    }),
  });
};
```

---

## Production Considerations

### Security
- Add authentication to `/admin/analytics` route
- Implement rate limiting on POST endpoint
- Validate and sanitize all input data

### Scaling
- For high-traffic sites, consider:
  - Moving to Supabase storage (schema ready in types)
  - Using Redis for real-time aggregation
  - Implementing batch event processing

### Privacy
- Ensure GDPR/CCPA compliance
- Implement data anonymization for PII
- Add user opt-out mechanism

---

## Integration with Existing Analytics

The internal monitoring system works alongside existing analytics integrations:

### Client-Side Analytics (from `@/lib/analytics`)
- **Google Analytics 4**: Full GA4 event tracking, conversion tracking, user properties
- **Google Tag Manager**: DataLayer events, e-commerce tracking
- **Vercel Analytics**: Custom events for CTAs, conversions, forms

### Server-Side Monitoring (from `@/lib/analytics/server`)
- **Internal Storage**: File-based metrics collection
- **Recommendation Engine**: AI-generated improvement suggestions
- **A/B Testing**: Statistical significance calculations

---

## Next Steps

1. [x] Core monitoring infrastructure
2. [x] API endpoints for data collection
3. [x] Admin dashboard
4. [ ] Add authentication to admin route
5. [ ] Integrate with Supabase for production storage
6. [ ] Add real-time WebSocket updates
7. [ ] Export to CSV/Excel functionality
8. [ ] Email alerts for critical metrics
9. [ ] Custom funnel visualization component

---

## Changelog

### v1.0.0 (2026-02-01)
- Initial implementation
- File-based storage
- 9 recommendation templates
- A/B testing framework
- Admin dashboard with 3 tabs (Overview, Recommendations, Pages)
