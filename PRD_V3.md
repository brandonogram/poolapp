# Pool App - Product Requirements Document v3.0

**Version:** 3.0
**Date:** January 26, 2026
**Status:** APPROVED FOR IMPLEMENTATION
**Context:** Pre-convention redesign with research-informed requirements

---

## Executive Summary

Pool App is a SaaS application for pool service companies that combines route optimization with field service management. This PRD defines the next iteration based on comprehensive market research, competitor analysis, and field technician workflow studies.

**Key Insight from Research:** The market is bifurcated between pool-specific tools (Skimmer, Pool Brain) that excel at chemistry tracking but have mobile issues, and general FSM platforms (ServiceTitan, Jobber) that lack pool features entirely. Our opportunity is to be the **fast, reliable, pool-specific platform** that works beautifully on mobile.

---

## 1. Revised Personas

### Persona 1: Owner/Manager - "Mike the Manager"

**Demographics:**
- 35-55 years old
- Owns/operates pool service company
- 2-15 technicians
- 100-500 pools under management
- Revenue: $200K - $1.5M annually

**Daily Context:**
- Works from home office or small commercial space
- 0-1 full-time office staff
- Spends mornings on admin, afternoons on field issues
- Wears multiple hats: sales, operations, HR, finance

**Goals:**
1. Grow revenue without proportionally increasing costs
2. Keep technicians productive and customers happy
3. Reduce time spent on administrative tasks
4. Make data-driven decisions about routes and pricing

**Frustrations:**
- Can't see what's happening in the field in real-time
- Chasing down information across multiple systems
- Software that's too complex or too simple
- Surprise customer complaints

**Software Needs:**
- Desktop dashboard for business intelligence
- Real-time fleet visibility
- Financial metrics at a glance
- Alert-driven exception management

**Quote from Research:**
> "I just need to know if my guys are on track and if there are any problems I need to deal with. I don't have time to dig through reports."

---

### Persona 2: Field Technician - "Sarah the Tech"

**Demographics:**
- 20-40 years old
- Employed by pool service company
- Services 15-25 pools per day
- Seasonal variations (more in summer)

**Daily Context:**
- Starts early (6-7 AM) loading truck
- On the road all day (7 AM - 4 PM)
- Works alone at each stop
- Deals with weather, traffic, gate codes
- Uses phone for everything

**Goals:**
1. Complete route efficiently and get home on time
2. Do quality work that doesn't result in callbacks
3. Minimize frustrating interruptions
4. Get paid fairly for work done

**Frustrations:**
- Apps that crash or don't work offline
- Too many taps to complete simple tasks
- Can't see gate codes without hunting
- Separate apps for routing, chemistry, logging
- Phone dies from battery drain

**Software Needs:**
- Mobile-first (phone is primary device)
- Offline capability (must work in backyards)
- One-screen service completion
- Built-in chemical calculator
- Fast, reliable, simple

**Quote from Research:**
> "I just want to tap once and be done. Don't make me scroll through menus to find the gate code."

---

### Persona 3: Commercial/HOA Manager - "Lisa the Property Manager"

**Demographics:**
- 30-50 years old
- Manages multiple properties (HOA, apartment complex, hotel)
- 5-50 pools across portfolio
- Reports to board or corporate

**Daily Context:**
- Juggles many vendor relationships
- Needs documentation for liability
- Budget conscious but quality focused
- Prefers self-service over phone calls

**Goals:**
1. Ensure all pools are serviced on schedule
2. Have documentation for board meetings
3. Stay within budget
4. Minimize resident complaints

**Frustrations:**
- Can't verify work was actually done
- No visibility into service quality
- Chasing vendors for reports
- Surprise invoices

**Software Needs:**
- Customer portal for service visibility
- Photo documentation proof
- Scheduled reports
- PDF invoices for accounting

---

## 2. Updated Feature Requirements

### 2.1 Owner/Manager Dashboard (Desktop)

#### Must Have (P0)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Revenue Dashboard | Daily/weekly/monthly revenue with trends | Shows at top of dashboard |
| Route Progress | Live completion status for all routes | Updates in real-time |
| Tech Status | Live location and status of all technicians | Map + cards view |
| Alert Feed | Priority-ordered issues requiring attention | Visible without scrolling |
| Quick Actions | One-click access to Routes, Schedule, Customers | Prominent buttons |

#### Should Have (P1)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Route Savings | Time/miles/dollars saved display | Visible on dashboard |
| Chemistry Summary | Aggregate chemistry health across fleet | Trend indicators |
| AR Overview | Outstanding invoices and aging | Amount visible |
| Performance Metrics | Callback rate, satisfaction, efficiency | KPI cards |

#### Could Have (P2)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Predictive Alerts | AI-powered issue prediction | Proactive notifications |
| Revenue Forecasting | ML-based revenue projection | Accuracy > 90% |
| Benchmarking | Compare to industry averages | Percentile display |

---

### 2.2 Field Tech Mobile App

#### Must Have (P0)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Route View | Today's stops in optimized order | < 1 sec load |
| Gate Code Display | Visible immediately on stop view | No taps required |
| One-Tap Navigation | Launch maps to next stop | Single tap |
| Quick Chemistry Entry | pH, Cl, Alk with +/- buttons | < 30 sec total |
| Task Checklist | Skim, brush, vac, baskets | Tap to complete |
| Complete Stop | Single button to finish | One tap |
| Offline Mode | Full functionality without internet | 100% coverage |

#### Should Have (P1)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Chemical Calculator | Auto-dosing recommendations | Instant calculation |
| Photo Capture | Before/after with timestamps | < 3 taps |
| Customer Notes | Special instructions visible | On stop screen |
| Service History | Previous readings at glance | Expandable section |
| Voice Notes | Hands-free observation logging | One-tap record |

#### Could Have (P2)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Video Upload | Document equipment issues | Background upload |
| Weather Alerts | Rain delay notifications | Push notification |
| Inventory Tracking | Low supply alerts | End of day prompt |
| Peer Messaging | Text other techs | In-app chat |

---

### 2.3 Route Optimization

#### Must Have (P0)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Auto-Optimization | Calculate optimal route order | Show miles saved |
| Before/After Compare | Visual route comparison | Clear improvement |
| Turn-by-Turn Ready | Export to maps apps | One tap |
| Re-Optimize | Recalculate when stops change | Instant update |

#### Should Have (P1)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Traffic-Aware | Factor in real-time traffic | ETA accuracy |
| Time Windows | Respect customer preferences | No conflicts |
| Multi-Tech Balance | Distribute stops evenly | Workload equity |

---

### 2.4 Customer Management

#### Must Have (P0)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Customer List | Searchable customer database | < 1 sec search |
| Pool Details | Volume, type, equipment | Complete profile |
| Service History | All past services | Timeline view |
| Chemistry History | Historical readings with trends | Chart display |

#### Should Have (P1)

| Feature | Description | Success Metric |
|---------|-------------|----------------|
| Equipment Inventory | Pump, filter, heater details | Photo + specs |
| Access Instructions | Gate codes, notes, warnings | Prominent display |
| Photo Gallery | All service photos | Organized by date |
| Communication Log | Calls, texts, emails | Unified history |

---

## 3. Mobile-First Tech Experience Specification

### 3.1 Route Structure

```
/tech                    - Mobile tech home (redirect to route)
/tech/route              - Today's route with progress
/tech/route/[stopId]     - Individual stop service entry
/tech/history            - Past service records
/tech/account            - Tech profile and settings
```

### 3.2 Screen Flow

```
[Launch App]
     |
     v
[Route View] -----> [Navigate] -----> [Maps App]
     |
     v
[Start Stop] -----> [Service Entry]
     |                    |
     |                    v
     |              [Chemistry Input]
     |                    |
     |                    v
     |              [Task Checklist]
     |                    |
     |                    v
     |              [Photo Capture]
     |                    |
     |                    v
[Complete Stop] <----[Review & Submit]
     |
     v
[Next Stop] (auto-advance)
```

### 3.3 Mobile UI Specifications

#### Touch Targets
- Primary buttons: 60x60px minimum
- Secondary buttons: 48x48px minimum
- List items: 60px row height minimum
- Spacing between tappables: 8px minimum

#### Colors (High Contrast Mode)
- Background: #F8FAFC (off-white, reduces glare)
- Text: #0F172A (near-black, maximum contrast)
- Primary: #2563EB (blue, visible in sunlight)
- Success: #16A34A (green)
- Warning: #F59E0B (amber)
- Error: #DC2626 (red)

#### Typography
- Body: 16px minimum (18px preferred)
- Labels: 14px minimum
- Headings: 20-24px
- Numbers: Tabular figures for alignment

#### Layout
- Single column on mobile
- Primary actions in thumb zone (bottom half)
- Bottom navigation bar
- Top status bar (sync, battery, time)

### 3.4 Offline Requirements

| Data Type | Sync Direction | Priority |
|-----------|---------------|----------|
| Route List | Server -> Device | On login |
| Customer Info | Server -> Device | On login |
| Chemistry History | Server -> Device | On login |
| Service Entries | Device -> Server | On completion |
| Photos | Device -> Server | Background |
| GPS Breadcrumbs | Device -> Server | Background |

**Conflict Resolution:**
- Server timestamp wins for customer data
- Device timestamp wins for service entries
- Prompt user for manual merge on conflict

---

## 4. Dashboard Redesign Specification

### 4.1 Layout Hierarchy

```
1. Hero Row (Above the Fold)
   +------------------------+------------------------+
   |   REVENUE CARD         |   SAVINGS CARD         |
   |   $47,850 (+9.4%)      |   $875 saved this week |
   +------------------------+------------------------+

2. Progress Row
   +----------------------------------------------------+
   |   TODAY'S PROGRESS                                  |
   |   [==============--------] 24/32 pools | 94% on time|
   +----------------------------------------------------+

3. Alert + Status Row
   +------------------------+------------------------+
   |   ALERTS (3)           |   TECH STATUS          |
   |   - pH High @ Johnson  |   [Map with pins]      |
   |   - Jake behind        |   Mike: 6/8 pools      |
   |   - Invoice overdue    |   Sarah: 8/8 DONE      |
   +------------------------+------------------------+

4. Quick Actions
   +------------------------+------------------------+
   |   [VIEW ROUTES]        |   [SCHEDULE]           |
   +------------------------+------------------------+
```

### 4.2 Widget Specifications

#### Revenue Card
- Monthly revenue with trend arrow
- Growth percentage vs last month
- Projected end-of-month revenue
- Gradient background (blue)

#### Savings Card
- Weekly dollars saved from optimization
- Hours saved
- Miles saved
- Annual projection
- Gradient background (green)

#### Progress Bar
- Visual completion percentage
- Pools completed / remaining
- On-time rate percentage
- Revenue collected today

#### Alert Feed
- Priority-ordered list
- Severity indicators (color + icon)
- Actionable quick-fix suggestions
- Expandable for details

#### Tech Status
- Live map with tech pins
- Status colors (active/behind/break)
- Progress bar per tech
- ETA to completion

---

## 5. Success Metrics

### Convention Demo (January 27)

| Metric | Target |
|--------|--------|
| Demo load time | < 2 seconds |
| Demo flow completion | < 3 minutes |
| Visual polish rating | 8/10 minimum |
| Mobile responsiveness | Perfect |

### Product Metrics (Q1 2026)

| Metric | Target |
|--------|--------|
| Trial signup conversion | > 15% |
| Trial to paid conversion | > 10% |
| Daily active users (tech) | > 70% |
| Service completion rate | > 95% |
| Chemistry entry rate | > 80% |
| NPS score | > 50 |

### Technical Metrics

| Metric | Target |
|--------|--------|
| Page load time (mobile) | < 1.5s |
| Time to interactive | < 2s |
| Offline reliability | 100% |
| Data sync success | > 99.5% |
| Crash rate | < 0.1% |

---

## 6. Out of Scope (Not This Release)

1. **Inventory management** - Phase 2
2. **Customer portal** - Phase 2
3. **Automated billing** - Stripe integration exists, full automation later
4. **AI predictions** - Nice-to-have, not MVP
5. **Multi-location support** - Enterprise feature
6. **Third-party integrations** - QuickBooks later

---

## 7. Implementation Priority

### Tonight (January 26)
1. Dashboard redesign with revenue focus
2. Mobile-responsive improvements
3. Tech status cards with live feel
4. Alert system with severity
5. Polish for convention demo

### This Week (Post-Convention)
1. Mobile tech route view (/tech/route)
2. Basic offline capability
3. Chemistry entry with calculator
4. Photo capture

### This Month (February)
1. Full offline-first architecture
2. Real-time sync
3. Voice notes
4. Video upload

---

## Appendix: Research Insights

### Why This Matters

From RESEARCH_FINDINGS.md:
> "64% have adopted all-in-one pool business management software. Only 5% use no management software - increasingly non-viable."

From COMPETITOR_ANALYSIS.md:
> "The $500K-$1M revenue threshold is where companies typically outgrow pool-specific software... [We can] thread the needle."

From TECH_MOBILE_WORKFLOW.md:
> "No current app excels at sub-30-second service logging, true one-handed operation, intelligent dosing automation, predictive insights, or modern, delightful UX."

### Our Differentiation

1. **Speed** - Faster than any competitor
2. **Offline** - Actually works without internet
3. **Pool-specific** - Not generic FSM
4. **Mid-market** - Right-sized features and pricing
5. **Modern UX** - Not legacy software feel

---

*Document Status: APPROVED FOR IMPLEMENTATION*
*Next Review: Post-convention (January 28, 2026)*
