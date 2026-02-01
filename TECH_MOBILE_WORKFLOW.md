# Pool Service Field Technician Mobile Workflow

> Research compiled for mobile app design targeting field technicians (not office managers/owners)

---

## 1. Typical Tech Daily Workflow

### Morning Preparation (6:00 AM - 7:00 AM)

1. **Check Today's Route**
   - Review assigned pools (typically 15-25 stops per day)
   - Note any special instructions, gate codes, or customer preferences
   - Check for schedule changes or priority stops added overnight

2. **Stock the Truck**
   - Verify chemical levels (chlorine tabs, liquid chlorine, muriatic acid, etc.)
   - Check equipment (test kits, poles, nets, vacuum heads, hoses)
   - Ensure adequate supplies for a full day (bleach, salt, bicarbonate, stabilizer)

3. **Review Customer Notes**
   - Previous service issues
   - Equipment problems flagged
   - Customer complaints or special requests

### Route Execution (7:00 AM - 4:00 PM)

**At Each Pool Stop (15-30 minutes per pool):**

| Step | Action | Time |
|------|--------|------|
| 1 | Arrive, note gate code/access | 1 min |
| 2 | Visual inspection of pool | 1 min |
| 3 | Test water chemistry | 3-5 min |
| 4 | Add chemicals as needed | 2-3 min |
| 5 | Skim surface debris | 3-5 min |
| 6 | Brush walls and steps | 5-8 min |
| 7 | Vacuum (if needed) | 5-10 min |
| 8 | Clean skimmer/pump baskets | 2-3 min |
| 9 | Check/backwash filter | 2-5 min |
| 10 | Inspect equipment | 2 min |
| 11 | Log service, take photos | 2-3 min |
| 12 | Mark complete, travel to next | varies |

**Types of Service Stops:**
- **Full Service**: 20-30 min per pool (2-3 pools/hour including travel)
- **Chemical Only**: 10-15 min per pool (4-6 pools/hour including travel)

### End of Day (4:00 PM - 5:00 PM)

1. Complete final service stop
2. Review all stops for the day are marked complete
3. Note any supplies running low
4. Log total time/mileage
5. Report any issues needing office follow-up
6. Restock truck for next day (if returning to shop)

---

## 2. Information Needs at Each Step

### Before Leaving for Route

| Information | Why Needed | Priority |
|-------------|------------|----------|
| Route order (optimized) | Minimize drive time | Critical |
| Total stops for day | Plan timing | High |
| Driving directions/nav | Get to stops | Critical |
| Expected route duration | Time management | Medium |
| Weather forecast | Adjust plans | Medium |

### At Each Service Stop

| Information | Why Needed | Priority |
|-------------|------------|----------|
| Customer name | Professionalism | Critical |
| Property address | Navigation | Critical |
| Gate code / access instructions | Entry | Critical |
| Service type | What to do | Critical |
| Pool specs (size, gallons, type) | Chemical dosing | High |
| Equipment details | Know what to check | High |
| Last service date | Context | Medium |
| Previous chemical readings | Trend analysis | High |
| Previous dosages | Calibrate treatment | High |
| Service history notes | Customer context | Medium |
| Special instructions | Customer satisfaction | High |
| Pet/child warnings | Safety | High |
| Equipment issues flagged | What to inspect | High |

### Chemical Testing Reference

| Parameter | Ideal Range | Test Frequency |
|-----------|-------------|----------------|
| pH | 7.2 - 7.4 | Every visit |
| Free Chlorine | 1 - 2 ppm | Every visit |
| Total Alkalinity | 80 - 120 ppm | Every visit |
| Cyanuric Acid (CYA) | 25 - 50 ppm | Weekly |
| Calcium Hardness | 150 - 400 ppm | Monthly |
| LSI (Saturation Index) | -0.3 to +0.3 | Every visit |
| Phosphates | < 125 ppb | As needed |
| Salt (saltwater pools) | 2700 - 3400 ppm | Every visit |

---

## 3. Actions They Take (What to Input/Log)

### Required Data Entry Per Stop

**Water Chemistry Readings:**
- pH level
- Free chlorine
- Total chlorine
- Alkalinity
- CYA/stabilizer
- Calcium hardness (periodic)
- TDS (periodic)
- Temperature
- Salt level (if applicable)

**Chemicals Added:**
- Type of chemical
- Amount/dosage
- Calculated vs. actual

**Tasks Completed (Checklist):**
- [ ] Skimmed surface
- [ ] Brushed walls/steps
- [ ] Vacuumed bottom
- [ ] Emptied skimmer basket
- [ ] Emptied pump basket
- [ ] Checked filter pressure
- [ ] Backwashed filter (if needed)
- [ ] Inspected pump
- [ ] Inspected heater
- [ ] Checked water level
- [ ] Checked chlorinator
- [ ] Inspected automation system

**Equipment Status:**
- All equipment functioning: Yes/No
- Issues found (dropdown + notes)
- Repair needed: Yes/No
- Urgency level: Routine/Soon/Urgent

**Photos (Optional but Valuable):**
- Before photo (if pool in bad condition)
- After photo (proof of work)
- Equipment issue documentation
- Damage documentation

**Service Notes:**
- Free-text field for observations
- Customer communication log

**Timestamps:**
- Arrival time
- Departure time
- Service duration

---

## 4. Pain Points with Current Apps

### Common Frustrations (from user reviews)

**Technical Issues:**
- Apps are buggy and crash frequently
- Offline mode doesn't sync properly when connection returns
- Slow performance, especially with photos
- Battery drain from constant GPS usage

**User Interface Problems:**
- Too many taps to complete simple actions
- Small buttons hard to tap with wet hands
- Screens hard to see in bright sunlight
- Data entry fields too small

**Feature Gaps:**
- Chemical calculator not integrated with readings
- No automatic dosing recommendations
- Can't see historical trends easily
- Poor photo management
- Limited voice input support

**Pricing Frustrations:**
- Increasing subscription fees
- Per-tech pricing gets expensive
- Essential features paywalled
- No option for small operators

**Sync & Communication Issues:**
- Schedule changes not pushed in real-time
- Difficult to communicate with office
- Customer notes not visible enough
- Slow sync between office and field

**Accounting Integration Nightmares:**
- QuickBooks sync breaks frequently
- Duplicate invoices
- Payments not applied correctly
- No running totals visible

### What Techs Actually Want

Based on reviews and forum discussions:

1. **"I just want to tap once and be done"** - Minimize data entry
2. **"Don't make me scroll"** - All important info on one screen
3. **"It needs to work when I have no signal"** - Robust offline mode
4. **"I can't see anything in the sun"** - High contrast mode
5. **"My hands are wet"** - Big touch targets
6. **"Just tell me how much chlorine"** - Auto-calculate dosing
7. **"Stop asking me things I already answered"** - Remember preferences

---

## 5. Ideal Mobile App Features (Prioritized)

### Tier 1: Critical (Must Have)

| Feature | Description |
|---------|-------------|
| **Route View** | Today's stops in order with map integration |
| **One-Tap Navigation** | Launch maps app to next stop instantly |
| **Quick Service Entry** | Enter readings in < 30 seconds |
| **Offline Mode** | Full functionality without internet |
| **Gate Codes Display** | Immediately visible on arrival |
| **Chemical Calculator** | Auto-dose recommendations from readings |
| **Task Checklist** | Tap to complete, can't skip required items |
| **Photo Capture** | Quick camera with auto-organize |
| **Customer Notes** | Special instructions prominently displayed |
| **Service History** | Previous readings/notes at a glance |

### Tier 2: High Priority

| Feature | Description |
|---------|-------------|
| **LSI Calculator** | Built-in saturation index |
| **Equipment Database** | Make/model of pool equipment |
| **Quick Issue Flagging** | Report repair needs with one tap |
| **Real-Time Schedule Updates** | Push notifications for changes |
| **Voice Notes** | Speak instead of type |
| **Auto-Time Tracking** | GPS-based arrival/departure |
| **Weather Integration** | Know if rain is coming |
| **Inventory Tracker** | Low supply alerts |
| **Customer Contact** | One-tap call/text |

### Tier 3: Nice to Have

| Feature | Description |
|---------|-------------|
| **Before/After Photos** | Side-by-side comparison |
| **Video Recording** | For complex equipment issues |
| **Signature Capture** | Customer sign-off |
| **Mileage Tracking** | Automatic log |
| **Peer Chat** | Message other techs |
| **Training Videos** | In-app reference |
| **Parts Lookup** | Find replacement parts |
| **Scanning** | Barcode scan for inventory |

### Tier 4: Future Enhancements

| Feature | Description |
|---------|-------------|
| **AR Equipment ID** | Point camera to identify model |
| **AI Troubleshooting** | Diagnose issues from symptoms |
| **Predictive Maintenance** | Alert before problems |
| **Customer App Integration** | Let customers see service status |
| **Smart Routing** | Traffic-aware optimization |

---

## 6. UI/UX Requirements

### Physical Context Considerations

Pool technicians work in challenging conditions:
- **Bright outdoor sunlight** - Can't see low-contrast screens
- **Wet hands** - From pool water, chemicals, sweat
- **One hand occupied** - Holding equipment, chemicals
- **Standing/walking** - Not sitting at a desk
- **Time pressure** - 15-20 pools to service
- **Varying connectivity** - Many backyards have poor signal

### Design Principles

#### 1. Large Touch Targets
- **Minimum button size**: 48x48 dp (Android) / 44x44 pt (iOS)
- **Recommended**: 60x60 for primary actions
- **Spacing**: At least 8dp between tappable elements
- **Reason**: Wet hands, gloves, outdoor conditions

#### 2. One-Handed Operation
- **Primary actions in thumb zone** (bottom half of screen)
- **Bottom navigation bar** for main sections
- **Swipe gestures** for common actions (complete stop, next stop)
- **Floating action button** for most common action

#### 3. High Visibility / Outdoor Mode
- **High contrast mode** with dark text on light background
- **Large fonts** - minimum 16sp for body text
- **Bold status indicators** - not subtle color changes
- **Avoid pure white** - use off-white to reduce glare
- **Dark mode option** for early morning/evening

#### 4. Minimal Data Entry
- **Pre-filled defaults** from last service
- **Increment/decrement buttons** instead of keyboard
- **Sliders** for ranges (pH: 6.8 ----[7.2]---- 8.0)
- **Voice input** for notes
- **Quick-select** for common values

#### 5. Progressive Disclosure
- **Show only what's needed** for current step
- **Collapse optional fields** by default
- **Expand details on demand**
- **Don't overwhelm** with all options at once

#### 6. Clear Feedback
- **Haptic feedback** on button press
- **Visual confirmation** (checkmarks, color change)
- **Progress indicator** (3/15 stops complete)
- **Sync status** always visible

#### 7. Offline-First Architecture
- **All data available offline**
- **Queue actions for sync**
- **Clear sync status indicator**
- **Graceful handling** of sync conflicts

### Screen-by-Screen Recommendations

#### Home / Route Screen
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
|  [  NAVIGATE  ]  [  START  ]    |
|                                  |
+----------------------------------+
|  Upcoming:                       |
|  6. Smith - 0.8 mi               |
|  7. Williams - 1.2 mi            |
+----------------------------------+
| [Home] [Route] [History] [More] |
+----------------------------------+
```

#### Service Entry Screen
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

#### Quick Actions (Swipe Gestures)
- **Swipe right on stop**: Mark complete (if all tasks done)
- **Swipe left on stop**: Skip with reason
- **Long press**: Quick actions menu (call customer, report issue)

### Accessibility Requirements

- **Font scaling**: Support system font size preferences
- **Color blind safe**: Don't rely solely on color
- **Screen reader compatible**: Proper labeling
- **Reduced motion option**: Minimize animations

### Performance Requirements

- **Launch time**: < 2 seconds to usable state
- **Route load**: < 1 second
- **Photo capture**: Instant, background upload
- **Offline sync**: Queue up to 100 stops
- **Battery**: < 10% drain over full workday

---

## 7. Communication Scenarios

### How Techs Handle Common Situations

#### Schedule Changes Mid-Route
**Current Pain**: Office calls/texts, tech has to manually update
**Ideal**: Push notification with one-tap accept, auto-resequences route

#### Customer Not Home (Locked Gate)
**Current Pain**: Call office, try customer, wait, reschedule
**Ideal**: App shows alternative access instructions, one-tap "Customer No-Show" with auto-notification to customer and office

#### Equipment Needs Repair
**Current Pain**: Write it down, remember to tell office later
**Ideal**: Quick-flag with photo, auto-creates work order, notifies office

#### Running Low on Supplies
**Current Pain**: Remember to tell office, hope shop has stock
**Ideal**: Inventory tracker with low-stock alerts, request restock from app

#### Pool in Bad Condition
**Current Pain**: Extra time, may need to reschedule other stops
**Ideal**: "Extended Service" mode that auto-adjusts downstream ETAs and notifies affected customers

---

## 8. Competitive Analysis Summary

### Current Market Leaders

| App | Strengths | Weaknesses |
|-----|-----------|------------|
| **Skimmer** | Chemical calculator, offline mode, pool-specific | Buggy, price increases, limited invoicing |
| **Pool Brain** | Comprehensive features, good photo handling | Accounting nightmares, buggy |
| **Jobber** | General field service, good UI | No chemical tracking, not pool-specific |
| **ServiceTitan** | Enterprise features, comprehensive | Expensive, complex, not pool-specific |
| **Pool Office Manager** | Good reporting, quick service entry | Limited mobile features |

### Opportunity Gap

No current app excels at:
1. **Sub-30-second service logging** - All are too clicky
2. **True one-handed operation** - Not designed for field conditions
3. **Intelligent dosing automation** - Basic calculators only
4. **Predictive insights** - No trending/forecasting
5. **Modern, delightful UX** - All feel dated

---

## Sources

- [ProValet - Pool Service Technician Guide](https://www.provalet.io/knowledge-base/comprehensive-pool-service-technician-guide-essential-skills-and-tips)
- [Skimmer Pool Service Software](https://www.getskimmer.com)
- [ASP Franchising - Day in the Life](https://www.aspfranchising.com/blog/2021/december/day-in-the-life-of-a-pool-care-professional/)
- [Swim University - Pool Water Testing Guide](https://www.swimuniversity.com/pool-water-testing/)
- [Pool Pro Magazine - What's in Your Truck](https://poolpromag.com/whats-in-your-truck/)
- [AQUA Magazine - The 12 Kinds of Customers](https://www.aquamagazine.com/service/article/15120728/the-12-kinds-of-customers-every-service-tech-meets)
- [OptimoRoute - Pool Maintenance Scheduling](https://optimoroute.com/pool-maintenance-schedule/)
- [Orenda Technologies - LSI Calculator](https://www.orendatech.com/pool-dosing-calculator)
- [Microsoft Dynamics - Field Service Mobile UX](https://www.microsoft.com/en-us/dynamics-365/blog/it-professional/2023/10/27/transform-technician-experience-with-the-new-field-service-mobile-ux/)
- [Smashing Magazine - One-Hand Mobile Design](https://www.smashingmagazine.com/2020/02/design-mobile-apps-one-hand-usage/)
- [Trouble Free Pool Forums](https://www.troublefreepool.com/)
- [Capterra - Pool Service Software Reviews](https://www.capterra.com/pool-service-software/)

---

*Document compiled: January 2026*
*Purpose: Mobile app design research for pool service field technicians*
