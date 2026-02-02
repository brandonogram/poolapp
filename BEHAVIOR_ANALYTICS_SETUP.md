# Behavior Analytics Setup Guide

This document describes the user behavior analytics infrastructure for PoolApp, including heatmaps, session recordings, scroll tracking, and conversion funnel analysis.

## Table of Contents

1. [Overview](#overview)
2. [Components](#components)
3. [Configuration](#configuration)
4. [Tracking Features](#tracking-features)
5. [Conversion Funnels](#conversion-funnels)
6. [API Endpoints](#api-endpoints)
7. [Supabase Schema](#supabase-schema)
8. [Usage Examples](#usage-examples)
9. [Privacy Considerations](#privacy-considerations)

---

## Overview

The behavior analytics system provides comprehensive user tracking through:

- **Hotjar** - Third-party heatmaps and session recordings
- **Custom Behavior Tracking** - Scroll depth, mouse movements, rage clicks
- **Session Management** - User journey mapping and funnel tracking
- **Analytics API** - Backend storage and aggregation

### Architecture

```
User Browser
    |
    ├─> Hotjar Component (3rd party)
    │       └─> Hotjar servers (heatmaps, recordings)
    │
    ├─> ScrollDepthTracker
    │       └─> /api/analytics/behavior
    │
    ├─> BehaviorTracker (optional full tracking)
    │       └─> /api/analytics/behavior
    │
    └─> Session Library
            └─> localStorage + /api/analytics/behavior
```

---

## Components

### 1. Hotjar Component

**Location:** `/components/analytics/Hotjar.tsx`

Integrates Hotjar for professional heatmaps and session recordings.

```tsx
import Hotjar from '@/components/analytics/Hotjar';

// In layout.tsx
<Hotjar />
```

**Helper Functions:**

```tsx
import { trackHotjarEvent, tagHotjarSession, identifyHotjarUser } from '@/components/analytics';

// Track custom events
trackHotjarEvent('pricing_viewed');

// Tag recording with labels
tagHotjarSession(['premium_user', 'mobile']);

// Identify user (for session lookup)
identifyHotjarUser('user_123', { plan: 'growth', signupDate: '2024-01-15' });
```

### 2. ScrollDepthTracker

**Location:** `/components/analytics/ScrollDepthTracker.tsx`

Tracks scroll depth milestones (25%, 50%, 75%, 100%).

```tsx
import ScrollDepthTracker from '@/components/analytics/ScrollDepthTracker';

// Basic usage (in layout.tsx)
<ScrollDepthTracker />

// With custom configuration
<ScrollDepthTracker
  milestones={[10, 25, 50, 75, 90, 100]}
  onMilestoneReached={(milestone) => {
    console.log(`User scrolled to ${milestone.percentage}%`);
  }}
  trackInHotjar={true}
  sendToApi={true}
/>
```

**Hook Version:**

```tsx
import { useScrollDepthTracking } from '@/components/analytics';

function MyComponent() {
  const { getMilestones, getMaxDepth } = useScrollDepthTracking();

  // Get current max scroll depth
  const maxDepth = getMaxDepth(); // e.g., 75

  // Get all reached milestones
  const milestones = getMilestones();
  // [{ percentage: 25, reached: true, timestamp: ... }, ...]
}
```

### 3. BehaviorTracker

**Location:** `/components/analytics/BehaviorTracker.tsx`

Full behavior tracking including mouse movements, clicks, and rage click detection.

```tsx
import { BehaviorTracker } from '@/components/analytics';

// In layout.tsx (optional - more comprehensive than just ScrollDepthTracker)
<BehaviorTracker
  trackMouse={true}
  trackScroll={true}
  trackClicks={true}
  trackTime={true}
  trackForms={true}
/>
```

**Note:** This is more comprehensive but may impact performance. Use `ScrollDepthTracker` alone for lighter tracking.

---

## Configuration

### Environment Variables

Add to `.env.local`:

```env
# Hotjar Configuration
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_site_id
NEXT_PUBLIC_HOTJAR_VERSION=6

# Supabase (for analytics storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Getting Hotjar Site ID

1. Sign up at [hotjar.com](https://www.hotjar.com)
2. Add your site
3. Go to **Settings > Tracking**
4. Copy your Site ID (numeric)

---

## Tracking Features

### Scroll Depth

- Tracks 25%, 50%, 75%, 100% scroll milestones
- Records time to reach each milestone
- Fires events to both Hotjar and custom API

### Time on Page

- Total time spent on page
- Active time (excludes tab-hidden periods)
- Visibility tracking

### Mouse Movements

- Sampled movement tracking (every 10th event)
- Relative position (percentage of viewport)
- Used for custom heatmap generation

### Click Tracking

- All clicks with element identification
- Position (x, y coordinates)
- Element selector (tag#id.class)

### Rage Click Detection

- Detects rapid repeated clicks (frustration indicator)
- Threshold: 3+ clicks within 500ms in 30px radius
- Alerts on potential UX issues

### Form Interactions

- Field focus/blur events
- Time spent per field
- Change events
- Form submission tracking

---

## Conversion Funnels

### Pre-defined Funnels

**Location:** `/lib/analytics/session.ts`

```typescript
// Pricing Conversion Funnel
Landing Page -> Pricing Section -> Checkout -> Success

// Demo Request Funnel
Landing Page -> Demo Request -> Demo Scheduled

// Convention Signup Funnel
Convention Landing -> Convention Checkout -> Signup Success

// User Onboarding Funnel
Dashboard Entry -> First Customer -> First Job -> Route Optimization
```

### Tracking Funnel Progress

```tsx
import { getFunnelProgress, markFunnelDropOff, FUNNELS } from '@/lib/analytics/session';

// Get current funnel progress
const progress = getFunnelProgress('pricing_conversion');
// {
//   funnelId: 'pricing_conversion',
//   currentStep: 2,
//   completedSteps: ['Landing Page', 'Pricing Section', 'Checkout'],
//   startTime: 1704067200000,
//   completed: false,
//   droppedOff: false
// }

// Mark drop-off when user abandons
markFunnelDropOff('pricing_conversion', 'Checkout');
```

### User Journey Summary

```tsx
import { getJourneySummary } from '@/lib/analytics/session';

const journey = getJourneySummary();
// {
//   totalPages: 5,
//   totalTime: 180000, // 3 minutes in ms
//   uniquePaths: ['/', '/#pricing', '/checkout'],
//   entryPage: '/',
//   exitPage: '/checkout',
//   bounced: false
// }
```

---

## API Endpoints

### POST /api/analytics/behavior

Receive and store behavior events.

**Request:**

```json
{
  "events": [
    {
      "type": "scroll_milestone",
      "timestamp": 1704067200000,
      "page": "/",
      "sessionId": "session_123_abc",
      "data": {
        "milestone": 50,
        "timeToReach": 5000
      }
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "eventsStored": 1,
  "storageType": "supabase"
}
```

### GET /api/analytics/behavior

Retrieve aggregated statistics.

**Query Parameters:**

- `format=summary` (default) - Returns aggregated stats
- `format=raw` - Returns last 100 raw events

**Response (summary):**

```json
{
  "totalEvents": 1543,
  "eventsByType": {
    "scroll_milestone": 234,
    "click": 890,
    "page_view": 156,
    "rage_click": 12
  },
  "uniqueSessions": 89,
  "topPages": [
    { "page": "/", "count": 456 },
    { "page": "/dashboard", "count": 234 }
  ],
  "rageClicks": 12,
  "averageScrollDepth": 67
}
```

### DELETE /api/analytics/behavior

Clear local analytics data (for testing).

---

## Supabase Schema

If using Supabase for storage, create this table:

```sql
-- Create behavior_events table
CREATE TABLE behavior_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  page VARCHAR(500) NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_behavior_events_type ON behavior_events(event_type);
CREATE INDEX idx_behavior_events_session ON behavior_events(session_id);
CREATE INDEX idx_behavior_events_page ON behavior_events(page);
CREATE INDEX idx_behavior_events_timestamp ON behavior_events(timestamp);

-- Enable Row Level Security (optional)
ALTER TABLE behavior_events ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage behavior events"
  ON behavior_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

---

## Usage Examples

### Basic Setup (Recommended)

Add to `app/layout.tsx`:

```tsx
import Hotjar from '@/components/analytics/Hotjar';
import ScrollDepthTracker from '@/components/analytics/ScrollDepthTracker';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Hotjar />
        <ScrollDepthTracker />
      </body>
    </html>
  );
}
```

### Track Custom Events

```tsx
import { trackHotjarEvent } from '@/components/analytics';

function PricingPage() {
  const handlePlanSelect = (plan: string) => {
    trackHotjarEvent(`plan_selected_${plan}`);
    // ... rest of logic
  };

  return (
    // ...
  );
}
```

### Track Form Completion

```tsx
import { useBehaviorTracking } from '@/components/analytics';

function SignupForm() {
  const { trackFormSubmit } = useBehaviorTracking();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    trackFormSubmit('signup_form');
    // ... submit logic
  };

  return (
    <form id="signup_form" onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Analyze User Drop-offs

```tsx
import { analyzeDropOffPoints } from '@/lib/analytics/session';

// In an admin dashboard or analytics page
async function getDropOffAnalysis() {
  const response = await fetch('/api/analytics/behavior?format=raw');
  const { events } = await response.json();

  // Group events by session
  const sessions = events.reduce((acc, event) => {
    if (event.type === 'page_view') {
      if (!acc[event.sessionId]) acc[event.sessionId] = [];
      acc[event.sessionId].push(event);
    }
    return acc;
  }, {});

  const dropOffs = analyzeDropOffPoints(Object.values(sessions));
  // [
  //   { fromPage: '/checkout', toPage: null, count: 45, percentage: 23 },
  //   { fromPage: '/#pricing', toPage: null, count: 32, percentage: 18 },
  // ]
}
```

---

## Privacy Considerations

### Data Collected

- Page URLs visited
- Scroll depth percentages
- Click positions (x, y coordinates)
- Element identifiers (tag, id, class)
- Time spent on pages
- Session identifiers (anonymous)
- Browser/device info (via Hotjar)

### Data NOT Collected

- Personal information (names, emails)
- Form input values
- Authentication tokens
- IP addresses (stored client-side only)

### GDPR Compliance

1. **Cookie Consent:** Implement consent banner before loading Hotjar
2. **Data Retention:** Configure 90-day auto-deletion
3. **Opt-out:** Provide mechanism to disable tracking

### Implementing Consent

```tsx
'use client';

import { useState, useEffect } from 'react';
import Hotjar from '@/components/analytics/Hotjar';

function ConsentWrapper() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent');
    setHasConsent(consent === 'true');
  }, []);

  if (!hasConsent) return null;
  return <Hotjar />;
}
```

---

## Troubleshooting

### Hotjar Not Loading

1. Check `NEXT_PUBLIC_HOTJAR_ID` is set correctly
2. Ensure no ad blockers are active
3. Check browser console for errors

### Events Not Sending

1. Verify Supabase credentials if using Supabase storage
2. Check `/data/analytics/behavior.json` for local storage fallback
3. Inspect Network tab for failed API calls

### Session Data Lost

1. Session data uses `localStorage` (persists across tabs)
2. Check for 30-minute timeout (configurable)
3. Verify `behavior_session_id` in sessionStorage

---

## File Reference

| File | Purpose |
|------|---------|
| `/components/analytics/Hotjar.tsx` | Hotjar script loader and helpers |
| `/components/analytics/ScrollDepthTracker.tsx` | Scroll milestone tracking |
| `/components/analytics/BehaviorTracker.tsx` | Full behavior tracking component |
| `/lib/analytics/behavior.ts` | Core behavior tracking utilities |
| `/lib/analytics/session.ts` | Session and funnel management |
| `/app/api/analytics/behavior/route.ts` | Backend API for storing events |
| `/.env.example` | Environment variable template |

---

## Next Steps

1. **Set up Hotjar account** and add Site ID to environment
2. **Create Supabase table** if using Supabase storage
3. **Add consent banner** for GDPR compliance
4. **Configure Hotjar recordings** to exclude sensitive areas
5. **Set up alerts** for high rage click counts
6. **Build analytics dashboard** to visualize funnel conversions
