# Pool App - Design Document

**Date:** January 22, 2026
**Status:** Approved for Implementation

---

## Executive Summary

Pool App is a SaaS application for pool cleaning companies (2-5 technicians, 100-300 pools). The primary value proposition is **route optimization** that saves $4,000+/year in fuel and enables 4-6 additional service calls per technician per day.

**Target Customer:** Small pool service teams (2-5 techs)
**Primary Hook:** "Stop wasting 2 hours a day driving between pools"
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, PostgreSQL
**Brand:** Professional & trustworthy (blues, clean, Stripe-inspired)

---

## 1. Landing Page

### Structure
1. **Header:** Logo | Features | Pricing | Login | [Start Free Trial]
2. **Hero:** "Stop wasting 2 hours a day driving between pools" + route visualization
3. **Social Proof Bar:** "Trusted by 500+ pool service companies"
4. **ROI Calculator:** Interactive slider showing personalized savings
5. **Feature Cards:** Route Optimization, Same-Day Invoicing, Chemistry Tracking
6. **Testimonials:** Pool pro quotes with photos
7. **Pricing Table:** Starter $49 | Growth $99 | Pro $199
8. **FAQ Section**
9. **Final CTA:** "Start your free 14-day trial. No credit card required."
10. **Footer**

### Key Conversion Elements
- ROI calculator creates personalized urgency
- No credit card trial removes friction
- Pricing visible upfront (transparency builds trust)

---

## 2. Onboarding Flow (Progressive Reveal)

### Philosophy
Every step delivers a micro-win. Users see value BEFORE completing signup.

### Steps

**Step 1: The Hook (before signup)**
- User enters zip code
- Instantly see: local pool count, average rates, competitor insights
- "$4,100/year lost to bad routing" - loss aversion messaging
- CTA: "Let's Fix That - Create Account"

**Step 2: Account Creation**
- Minimal fields: company name, email, password
- "Claim your territory" language
- Animation: logo plants on map, territory boundary pulses
- Shows: "Potential: 1,247 pools in range"

**Step 3: First Customer**
- Side-by-side: form + live map
- Pin drops with animation when customer added
- Revenue counter starts ($158/week)
- "Add 2 more to unlock route optimization"

**Step 4: Optimization Reveal (THE MAGIC MOMENT)**
- After 3 customers: "Optimization Unlocked"
- Click to optimize → watch route redraw itself
- Animated distance counter ticks down
- Show before/after comparison with extrapolated annual savings

**Step 5: Completion & Celebration**
- Full optimized route displayed
- Four clear next steps (one highlighted)
- Annual savings reinforced
- "Your first optimized Monday awaits"

---

## 3. Core App MVP

### Dashboard
- Today's routes with progress bars
- This week stats: revenue, pools done, time saved, fuel saved
- Live map with technician locations
- "Needs Attention" alerts

### Schedule View
- Week calendar with drag-drop
- Technician rows showing daily pool counts
- Unscheduled pools row
- One-click route optimization

### Customer Management
- Pool profile (type, volume, sanitizer, equipment)
- Service schedule and pricing
- Service history with chemistry logs
- Notes and photos

### Route Optimization
- Map view with optimized sequence
- Before/after comparison
- Turn-by-turn integration ready

### Invoicing (Phase 1)
- Auto-generate after service completion
- Stripe integration for payments
- Recurring billing support

---

## 4. Technical Architecture

### Directory Structure
```
poolapp/
├── app/
│   ├── (marketing)/        # Landing page (public)
│   │   ├── page.tsx        # Homepage
│   │   └── pricing/
│   ├── (onboarding)/       # Onboarding flow
│   │   ├── setup/
│   │   └── welcome/
│   ├── (dashboard)/        # Core app (authenticated)
│   │   ├── dashboard/
│   │   ├── schedule/
│   │   ├── customers/
│   │   └── routes/
│   └── api/
├── components/
│   ├── ui/                 # Shared UI components
│   ├── marketing/          # Landing page components
│   ├── onboarding/         # Onboarding components
│   └── dashboard/          # App components
├── lib/
│   ├── db/                 # Database utilities
│   ├── auth/               # Authentication
│   └── routing/            # Route optimization algorithms
└── styles/
```

### Key Dependencies
- next: 14.x
- typescript
- tailwindcss
- framer-motion (animations)
- maplibre-gl or @mapbox/mapbox-gl-js
- @stripe/stripe-js
- prisma (ORM)
- next-auth (authentication)

### Database Schema (Core)
- User (company accounts)
- Technician
- Customer
- Pool (linked to Customer)
- Service (scheduled jobs)
- ServiceLog (completed work)
- Invoice

---

## 5. Design System

### Colors
- Primary: Blue (#0066FF) - trust, water association
- Secondary: Navy (#001B44) - professionalism
- Accent: Cyan (#00D4FF) - energy, freshness
- Success: Green (#00C853)
- Warning: Amber (#FFB300)
- Error: Red (#FF3D00)
- Neutrals: Slate scale

### Typography
- Headings: Satoshi or similar geometric sans
- Body: Inter or system fonts
- Monospace: JetBrains Mono (for data/numbers)

### Spacing
- Base unit: 4px
- Consistent scale: 4, 8, 12, 16, 24, 32, 48, 64

### Components
- Buttons: Solid primary, outline secondary, ghost tertiary
- Cards: Subtle shadow, rounded-lg, hover states
- Forms: Clear labels, inline validation, helpful placeholders
- Maps: Custom markers, animated routes, clean overlays

---

## 6. Success Metrics

### Landing Page
- Visitor → Trial signup: >5%
- Time on page: >2 minutes
- ROI calculator engagement: >40%

### Onboarding
- Signup → Complete setup: >60%
- Time to "aha moment": <5 minutes
- Customers added in first session: >5

### Core App
- Daily active users: >60% of signups
- Routes optimized per week: >10 per user
- Trial → Paid conversion: >15%

---

## 7. Implementation Order

1. **Phase 1:** Landing page (convert visitors)
2. **Phase 2:** Onboarding flow (activate users)
3. **Phase 3:** Core app MVP (retain users)

All three will be built in parallel by separate agents.

---

**Document Status:** Ready for implementation
