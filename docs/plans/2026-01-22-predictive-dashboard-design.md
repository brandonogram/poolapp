# Predictive Route Analytics Dashboard

## Overview

Replace the confusing "This Week" bar chart with a real-time **Tech Status** section showing each technician's progress and predicted finish time.

## User Problem

Pool company owners need to know if a tech is running behind *before* it becomes a problem, so they can send backup or reassign stops.

## Solution

### Dashboard: Tech Status Cards

For each active technician today:
- Name & avatar
- Progress: "5 of 10 stops complete"
- Status indicator:
  - 🟢 **On Track** - finishing on time
  - 🟡 **At Risk** - 15-29 min behind
  - 🔴 **Behind** - 30+ min behind (triggers alert)
- Predicted finish time vs scheduled
- Current location

### Alert System

**Visual (MVP):**
- Card turns red with pulse animation
- Banner at top of dashboard
- Click to see details

**SMS (Phase 2):**
- Message when threshold crossed
- Configurable phone number
- Quiet hours setting

### Prediction Calculation

```
Time Remaining = Σ(Avg Service Time per stop) + Σ(Drive Time between stops)
```

- Avg Service Time = historical average for that specific customer (default: 45 min)
- Drive Time = calculated from lat/lng coordinates
- Updates each time a stop is completed

### Settings (Phase 2)

- Alert threshold: 15-60 min (default: 30)
- SMS phone number
- Quiet hours
- Per-technician toggle

## Implementation

### Phase 1: Dashboard Visual
1. Create TechStatusCard component
2. Add prediction calculation logic
3. Replace "This Week" section with Tech Status
4. Add alert banner component

### Phase 2: SMS Integration
1. Add Twilio/SMS service
2. Settings page for notifications
3. Alert trigger logic

## Files to Modify

- `/app/(dashboard)/dashboard/page.tsx` - main dashboard
- `/components/dashboard/TechStatusCard.tsx` - new component
- `/lib/predictions.ts` - calculation logic
