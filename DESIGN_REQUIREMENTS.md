# Pool App Design Requirements

**Compiled:** January 26, 2026
**Purpose:** Synthesize research findings into actionable design requirements
**Status:** APPROVED FOR IMPLEMENTATION

---

## 1. Owner/Manager Dashboard Requirements (Desktop-First)

### Core Philosophy
The owner dashboard is a **command center for business intelligence**, not a task management tool. Owners have 0-1 full-time office staff and need to make quick decisions without digging through menus.

### Above-the-Fold Priority (First View)

1. **Revenue Health** (PRIMARY)
   - Daily/Weekly/Monthly revenue with trends
   - End-of-day revenue forecast
   - Outstanding AR / collections status
   - Revenue per technician

2. **Operations Status** (SECONDARY)
   - Live technician map with status indicators
   - Route completion progress
   - Today's pools completed vs remaining
   - Estimated completion time

3. **Alerts & Exceptions** (TERTIARY)
   - Missed stops / skipped services
   - Technician running behind
   - Chemistry readings out of range
   - Equipment failures reported
   - Past-due invoices

### Critical Metrics to Display

| Category | Metric | Why It Matters |
|----------|--------|----------------|
| **Revenue** | Monthly Revenue | Primary health indicator |
| **Revenue** | Revenue Growth % | Shows trajectory |
| **Revenue** | Revenue per Tech | Efficiency benchmark |
| **Revenue** | Outstanding AR | Cash flow management |
| **Operations** | Stops Completed Today | Daily progress |
| **Operations** | On-Time Rate % | Service quality |
| **Operations** | Route Efficiency | Miles saved vs baseline |
| **Operations** | Tech Utilization | Labor cost optimization |
| **Customer** | Customer Satisfaction | Retention indicator |
| **Customer** | Callback Rate | Quality issues |
| **Growth** | New Customers This Month | Business growth |
| **Growth** | Quote Conversion Rate | Sales effectiveness |

### Alert Types (Priority Order)

1. **CRITICAL (Red)** - Requires immediate action
   - Technician no-show
   - Customer complaint
   - Equipment failure at customer site
   - Safety incident

2. **WARNING (Amber)** - Needs attention today
   - Technician running 30+ min behind
   - Chemistry readings significantly out of range
   - Missed service stop
   - Invoice 30+ days overdue

3. **INFORMATIONAL (Blue)** - Awareness items
   - Minor chemistry variance
   - Route optimization suggestion
   - Low inventory alert
   - Weather advisory

### Dashboard Layout Specification

```
+----------------------------------------------------------+
|  HEADER: Company Name | Date/Time | Quick Actions | User |
+----------------------------------------------------------+
|                                                          |
|  [HERO: Revenue Card]     [HERO: Route Savings Card]     |
|  Monthly Revenue          Weekly Savings                 |
|  $47,850 (+9.4%)          $875 / 12.5h / 186 mi         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  [TODAY'S PROGRESS]                                      |
|  Progress bar: 24/32 pools | 94% on time | $2,847 earned|
|                                                          |
+----------------------------------------------------------+
|                              |                           |
|  [CRITICAL ALERTS]           |  [TECH STATUS]            |
|  - Chemistry issues          |  - Live map               |
|  - Missed stops              |  - Tech progress cards    |
|  - Equipment problems        |  - ETA to completion      |
|                              |                           |
+----------------------------------------------------------+
|                                                          |
|  [QUICK ACTIONS]                                         |
|  View Routes | Schedule | Customers | Invoices           |
|                                                          |
+----------------------------------------------------------+
```

### Responsive Behavior
- **Desktop (1024px+)**: Full 2-column layout with map
- **Tablet (768-1023px)**: Stacked cards, map in dedicated section
- **Mobile (< 768px)**: Single column, most critical first

---

## 2. Field Tech Mobile App Requirements

### Core Philosophy
The mobile app is a **single-purpose field tool** for technicians. Every interaction should be completable in under 10 seconds with wet hands, in bright sunlight, with one hand.

### User Context
- Working outdoors in bright sunlight
- Hands are wet from pool water and chemicals
- Standing/walking, often carrying equipment
- Time pressure: 15-25 pools per day
- Varying connectivity (many backyards have poor signal)

### Primary Screens

#### Screen 1: Route View (Home)
```
+----------------------------------+
|  Today: Tue, Jan 26              |
|  15 stops | ~6.5 hrs | 42 mi    |
+----------------------------------+
|                                  |
|  [=====--------] 5/15 complete  |
|                                  |
+----------------------------------+
|                                  |
|  NEXT STOP                       |
|  -------------------------       |
|  Johnson Residence               |
|  1234 Oak Street                 |
|  Gate: #4521                     |
|                                  |
|  [ NAVIGATE ]   [ START JOB ]   |
|                                  |
+----------------------------------+
|  Upcoming:                       |
|  6. Smith - 0.8 mi               |
|  7. Williams - 1.2 mi            |
+----------------------------------+
| [Route] [History] [Account]      |
+----------------------------------+
```

**Requirements:**
- Gate code visible without tapping
- One-tap navigation to maps app
- Swipe gestures for common actions
- Sync status always visible

#### Screen 2: Service Entry
```
+----------------------------------+
|  < Back    Johnson    Complete > |
+----------------------------------+
|                                  |
|  WATER CHEMISTRY                 |
|  --------------------------      |
|  pH        [  -  ] 7.4 [  +  ]  |
|  Chlorine  [  -  ] 1.5 [  +  ]  |
|  Alk       [  -  ] 90  [  +  ]  |
|  [Show more readings...]         |
|                                  |
+----------------------------------+
|                                  |
|  RECOMMENDED DOSING              |
|  --------------------------      |
|  + 8 oz Muriatic Acid           |
|  + 3 Chlorine tabs              |
|  [  MARK CHEMICALS ADDED  ]     |
|                                  |
+----------------------------------+
|                                  |
|  TASKS                           |
|  [X] Skim  [X] Brush  [ ] Vac   |
|  [X] Baskets  [ ] Filter        |
|                                  |
+----------------------------------+
|       [  COMPLETE STOP  ]        |
+----------------------------------+
```

**Requirements:**
- Chemistry entry in < 30 seconds
- Auto-calculate dosing recommendations
- Pre-filled defaults from last visit
- Increment/decrement buttons (no keyboard)
- LSI calculation built-in

#### Screen 3: Customer Info (Expandable)
```
+----------------------------------+
|  CUSTOMER INFO                   |
|  --------------------------      |
|  Pool: 15,000 gal | Saltwater   |
|  Equipment: Pentair IntelliFlow  |
|  Last Service: 7 days ago       |
|                                  |
|  NOTES                          |
|  - Dog in backyard (friendly)   |
|  - Check salt cell quarterly    |
|                                  |
|  PREVIOUS READINGS              |
|  Jan 19: pH 7.4, Cl 1.2         |
|  Jan 12: pH 7.6, Cl 0.8 (low)   |
+----------------------------------+
```

### UI/UX Requirements

1. **Large Touch Targets**
   - Minimum button size: 60x60px for primary actions
   - Minimum tap target: 48x48px for secondary
   - Spacing between tappables: 8px minimum

2. **High Visibility**
   - High contrast mode (dark text on light background)
   - Minimum font size: 16px for body
   - Bold status indicators (not subtle color changes)
   - Off-white background to reduce glare

3. **One-Handed Operation**
   - Primary actions in bottom half of screen (thumb zone)
   - Bottom navigation bar
   - Swipe gestures for complete/skip
   - Floating action button for most common action

4. **Minimal Data Entry**
   - Pre-filled defaults from history
   - Increment/decrement buttons instead of keyboard
   - Voice notes for observations
   - Quick-select for common values

5. **Offline-First**
   - All data available offline
   - Queue actions for sync
   - Clear sync status indicator
   - Graceful conflict resolution

### Performance Requirements

| Metric | Target |
|--------|--------|
| Launch to usable | < 2 seconds |
| Route load | < 1 second |
| Photo capture | Instant, background upload |
| Offline queue | 100+ stops |
| Battery drain | < 10% over full workday |

### Essential Features (Phase 1)

1. **Route View** - Today's stops in optimized order
2. **One-Tap Navigation** - Launch maps app instantly
3. **Quick Service Entry** - Chemistry + tasks in < 30 sec
4. **Offline Mode** - Full functionality without internet
5. **Gate Codes** - Immediately visible on arrival
6. **Chemical Calculator** - Auto-dose recommendations
7. **Photo Capture** - Quick camera with categorization
8. **Customer Notes** - Special instructions visible
9. **Service History** - Previous readings at a glance

### Nice-to-Have Features (Phase 2)

1. Voice notes
2. Video recording for equipment issues
3. Weather integration
4. Inventory tracking
5. Peer messaging

---

## 3. Key Differentiators

### What Makes Us Stand Out

1. **Offline-First Architecture**
   - Not bolted on as afterthought
   - Truly reliable in poor connectivity
   - Background sync when connected
   - No data loss ever

2. **Speed**
   - Sub-second response times
   - Minimal taps to complete tasks
   - Modern, optimized mobile experience

3. **Integrated Chemical Intelligence**
   - Not a separate app/calculator
   - Dosing built into service flow
   - LSI calculation automatic
   - Historical trending

4. **Right-Sized for Mid-Market**
   - Not too simple (like basic apps)
   - Not overwhelming (like ServiceTitan)
   - Pool-specific features
   - Affordable pricing

5. **Video Documentation**
   - First-class video support
   - No competitor does this well
   - Important for equipment issues

6. **Weather-Aware Scheduling**
   - Automatic rain delay handling
   - Proactive rescheduling
   - Customer notifications

---

## 4. Priority Features (Ranked by Impact)

### CRITICAL (Must Ship for Convention Demo)

| Rank | Feature | Impact | Effort |
|------|---------|--------|--------|
| 1 | Dashboard Revenue Display | Shows business value | Low |
| 2 | Route Progress Tracking | Proves route optimization | Low |
| 3 | Tech Status Cards | Demonstrates fleet visibility | Medium |
| 4 | Chemistry Alerts | Shows proactive quality | Low |
| 5 | Quick Actions | Makes demo flow smooth | Low |

### HIGH PRIORITY (Next Sprint)

| Rank | Feature | Impact | Effort |
|------|---------|--------|--------|
| 6 | Mobile Tech Route View | Core tech workflow | High |
| 7 | Offline Mode | Critical differentiator | High |
| 8 | Chemical Calculator | Industry table stakes | Medium |
| 9 | Photo Capture | Documentation proof | Medium |
| 10 | Real-Time Updates | Fleet coordination | High |

### MEDIUM PRIORITY (Q1 2026)

| Rank | Feature | Impact | Effort |
|------|---------|--------|--------|
| 11 | Voice Notes | Wet hands use case | Medium |
| 12 | Weather Integration | Proactive scheduling | Medium |
| 13 | Equipment Tracking | Maintenance history | Medium |
| 14 | Customer Portal | Self-service | High |
| 15 | Video Upload | Equipment documentation | Medium |

---

## 5. UI/UX Guidelines

### Design Principles

1. **Clarity Over Cleverness**
   - Plain language, no jargon
   - Obvious actions, no hunting
   - Status always visible

2. **Speed Over Features**
   - Every tap has a purpose
   - No loading spinners > 1 second
   - Progressive loading

3. **Mobile-Optimized First**
   - Design for phone, scale to desktop
   - Touch targets sized for fingers
   - Consider outdoor viewing

4. **Alert-Driven**
   - Surface problems automatically
   - Don't make users hunt for issues
   - Priority-ordered notifications

5. **Data as Story**
   - Show trends, not just numbers
   - Before/after comparisons
   - Progress visualization

### Color System

| Usage | Color | Hex |
|-------|-------|-----|
| Primary (Brand) | Blue | #0066FF |
| Success | Green | #00C853 |
| Warning | Amber | #FFB300 |
| Critical | Red | #FF3D00 |
| Neutral | Slate | Scale |

### Typography

- **Headings**: Satoshi or system sans-serif
- **Body**: Inter or system sans-serif
- **Numbers**: Tabular numerals (monospace-like alignment)

### Component Standards

- **Cards**: 16px padding, 12px border-radius, subtle shadow
- **Buttons**: 48px min height, clear hover/active states
- **Inputs**: 48px min height, clear labels, inline validation
- **Icons**: 24px standard, 16px inline, consistent stroke weight

### Animation

- **Purpose**: Only for feedback and transitions
- **Duration**: 150-300ms for micro-interactions
- **Easing**: ease-out for entering, ease-in for exiting
- **Reduce motion**: Respect system preference

---

## 6. Technical Constraints

### For Tonight's Implementation

1. **Use existing tech stack** - Next.js, Tailwind, Framer Motion
2. **Mock data OK** - No real Supabase integration required
3. **Demo-focused** - Optimize for convention demo flow
4. **Mobile-responsive** - Must look good on phone for demo
5. **Fast loading** - Vercel deployment should be instant

### Component Reuse

Leverage existing components from:
- `/components/ui/` - Base components
- Current dashboard page patterns
- Existing mock data structures

---

## Appendix: Research Sources

This document synthesizes findings from:
- RESEARCH_FINDINGS.md - User needs and pain points
- TECH_MOBILE_WORKFLOW.md - Field technician workflow
- COMPETITOR_ANALYSIS.md - Market positioning
- Existing PRD and design documents
- CONVENTION_PLAYBOOK.md - Demo requirements

---

*Document Status: READY FOR IMPLEMENTATION*
