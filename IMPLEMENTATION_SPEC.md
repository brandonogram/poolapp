# Pool App Implementation Specification

**Date:** January 26, 2026
**Purpose:** Detailed implementation instructions for dashboard redesign and mobile tech app
**Audience:** Implementation engineers
**Status:** READY FOR IMPLEMENTATION

---

## Overview

This document provides exact specifications for implementing the approved design changes. Follow this document precisely for consistent implementation.

---

## Part 1: Dashboard Redesign

### 1.1 File to Modify

**Primary File:** `/app/(dashboard)/dashboard/page.tsx`

### 1.2 Layout Changes

#### Current Structure (Remove)
```
- Hero Savings Cards (2 equal columns)
- Today's Progress
- Chemistry Alerts (large cards)
- Tech Status (large cards)
- Performance Metrics (4 columns)
- Quick Actions (at bottom)
```

#### New Structure (Implement)
```
1. Action Bar (sticky/prominent)
2. Hero Metrics Row (Revenue primary, Savings + On-Time secondary)
3. Today's Progress (simplified)
4. Two-Column: Alerts (compact) | Tech Status (map-focused)
5. [Optional] Quick Actions (if not in action bar)
```

### 1.3 Component Specifications

#### Component 1: Action Bar

```tsx
// Position: Top of dashboard, after header
// Purpose: Quick access to primary actions

<div className="flex items-center gap-3 mb-6">
  <Link href="/routes" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
    Routes
  </Link>
  <Link href="/schedule" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
    Schedule
  </Link>
  <Link href="/customers" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
    Customers
  </Link>
  <Link href="/invoices" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
    Invoices
  </Link>
  <button className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
    <PlusIcon className="w-4 h-4" />
    Add Stop
  </button>
</div>
```

#### Component 2: Hero Metrics Row

```tsx
// Layout: 3 cards - Revenue (larger), Savings, On-Time Rate
// Revenue card: col-span-2 on desktop

<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
  {/* Revenue Card - Primary */}
  <div className="sm:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
    <div className="flex items-center gap-2 mb-2">
      <TrendingUpIcon className="w-5 h-5 text-blue-200" />
      <span className="text-sm font-medium text-blue-200">Monthly Revenue</span>
    </div>
    <p className="text-4xl font-bold mb-2">$47,850</p>
    <div className="flex items-center gap-2">
      <span className="px-2 py-0.5 bg-green-500/30 text-green-100 rounded-full text-xs font-semibold">
        +9.4%
      </span>
      <span className="text-sm text-blue-200">vs last month</span>
    </div>
  </div>

  {/* Savings Card */}
  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
    <div className="flex items-center gap-2 mb-2">
      <DollarSignIcon className="w-5 h-5 text-emerald-200" />
      <span className="text-sm font-medium text-emerald-200">This Week</span>
    </div>
    <p className="text-3xl font-bold mb-1">$875</p>
    <p className="text-sm text-emerald-200">saved in routing</p>
  </div>

  {/* On-Time Card */}
  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <div className="flex items-center gap-2 mb-2">
      <ClockIcon className="w-5 h-5 text-slate-400" />
      <span className="text-sm font-medium text-slate-500">Today</span>
    </div>
    <p className="text-3xl font-bold text-slate-900 mb-1">94%</p>
    <p className="text-sm text-slate-500">on-time rate</p>
  </div>
</div>
```

#### Component 3: Progress Bar (Simplified)

```tsx
// Single row with progress bar and key stats

<div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-semibold text-slate-900">Today's Progress</h2>
    <span className="text-sm text-slate-500">
      $2,847 collected | Projected: $3,650
    </span>
  </div>
  <div className="flex items-center gap-4">
    <div className="flex-1">
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: '75%' }}
        />
      </div>
    </div>
    <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
      24/32 pools
    </span>
  </div>
</div>
```

#### Component 4: Alerts (Compact List)

```tsx
// Replace large alert cards with compact list
// Severity indicated by left border color

const alerts = [
  { id: 1, type: 'high', message: 'pH High - Johnson Residence', action: 'View' },
  { id: 2, type: 'high', message: 'Jake running behind schedule', action: 'View' },
  { id: 3, type: 'medium', message: 'Invoice 30+ days overdue - Chen', action: 'View' },
];

<div className="bg-white rounded-2xl border border-slate-200 p-5">
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-semibold text-slate-900">Alerts</h2>
    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
      {alerts.length} active
    </span>
  </div>
  <div className="space-y-2">
    {alerts.map(alert => (
      <div
        key={alert.id}
        className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
          alert.type === 'high'
            ? 'bg-red-50 border-l-red-500'
            : 'bg-amber-50 border-l-amber-500'
        }`}
      >
        <span className="text-sm font-medium text-slate-700">{alert.message}</span>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
          {alert.action} →
        </button>
      </div>
    ))}
  </div>
  <button className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-700">
    View all alerts
  </button>
</div>
```

#### Component 5: Tech Status (Map-Focused)

```tsx
// Map placeholder with tech list sidebar
// Mobile: Stack vertically

<div className="bg-white rounded-2xl border border-slate-200 p-5">
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-semibold text-slate-900">Technicians</h2>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-xs text-slate-500">Live</span>
    </div>
  </div>

  {/* Map Placeholder */}
  <div className="h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center">
    <span className="text-slate-400 text-sm">Map View</span>
  </div>

  {/* Tech List - Compact */}
  <div className="grid grid-cols-2 gap-2">
    {technicians.map(tech => (
      <div key={tech.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
          style={{ backgroundColor: tech.color }}
        >
          {tech.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{tech.name}</p>
          <p className="text-xs text-slate-500">{tech.completed}/{tech.total} pools</p>
        </div>
        <StatusDot status={tech.status} />
      </div>
    ))}
  </div>

  <Link href="/routes" className="mt-4 block w-full text-center py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
    Open Live Map →
  </Link>
</div>
```

### 1.4 Layout Grid

```tsx
// Two-column layout for Alerts and Tech Status

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Alerts - Left Column */}
  <AlertsCompact />

  {/* Tech Status - Right Column */}
  <TechStatusMap />
</div>
```

### 1.5 Animations to Remove

Remove or simplify these animations:
- `AnimatedNumber` component - Replace with static number display
- Shimmer effect on progress bar
- Individual card slide-in animations (delay: 0.1, 0.2, etc.)
- Pulse animation on tech status dots (keep for "behind" status only)

**Keep:**
- Progress bar width animation (useful feedback)
- Hover transitions on buttons
- Status indicator pulse for critical alerts

### 1.6 Mobile Responsiveness

```tsx
// Breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px

// Mobile (< 640px): Single column, stacked vertically
// Tablet (640-1024px): 2 columns for metrics
// Desktop (> 1024px): Full layout

// Example responsive classes:
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
```

---

## Part 2: Mobile Tech App

### 2.1 New Routes to Create

```
/app/(tech)/layout.tsx         - Tech-specific layout (no sidebar)
/app/(tech)/tech/page.tsx      - Redirect to route
/app/(tech)/tech/route/page.tsx - Route view
/app/(tech)/tech/route/[stopId]/page.tsx - Service entry
/app/(tech)/tech/history/page.tsx - History
/app/(tech)/tech/account/page.tsx - Account
```

### 2.2 Tech Layout

```tsx
// /app/(tech)/layout.tsx
// Minimal layout without sidebar, with bottom navigation

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Status Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-slate-900">Pool App</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs text-slate-500">Synced</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <NavLink href="/tech/route" icon={MapIcon} label="Route" />
          <NavLink href="/tech/history" icon={ClockIcon} label="History" />
          <NavLink href="/tech/account" icon={UserIcon} label="Account" />
        </div>
      </nav>
    </div>
  );
}
```

### 2.3 Route View Page

```tsx
// /app/(tech)/tech/route/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data
const todayRoute = {
  date: 'Tuesday, January 26',
  totalStops: 15,
  estimatedHours: 6.5,
  totalMiles: 42,
  completed: 10,
};

const stops = [
  { id: '1', name: 'Johnson Residence', address: '1234 Oak Street', gateCode: '#4521', status: 'completed' },
  { id: '2', name: 'Smith Pool', address: '567 Maple Ave', gateCode: '9876', status: 'completed' },
  // ... more stops
  { id: '11', name: 'Williams Estate', address: '890 Pine Rd', gateCode: 'Side gate unlocked', status: 'next' },
  { id: '12', name: 'Chen Residence', address: '234 Elm St', gateCode: '#1234', status: 'upcoming' },
];

export default function TechRoutePage() {
  const nextStop = stops.find(s => s.status === 'next');
  const upcomingStops = stops.filter(s => s.status === 'upcoming').slice(0, 2);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm text-slate-500">{todayRoute.date}</p>
        <p className="text-sm text-slate-600 mt-1">
          {todayRoute.totalStops} stops | {todayRoute.estimatedHours} hrs | {todayRoute.totalMiles} mi
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">
            {todayRoute.completed}/{todayRoute.totalStops} done
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${(todayRoute.completed / todayRoute.totalStops) * 100}%` }}
          />
        </div>
      </div>

      {/* Next Stop - Prominent */}
      {nextStop && (
        <div className="bg-white rounded-xl p-5 mb-4 shadow-sm border-2 border-blue-500">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Next Stop</p>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{nextStop.name}</h2>
          <p className="text-slate-600 mb-3">{nextStop.address}</p>

          {/* Gate Code - Very Prominent */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-amber-700 uppercase tracking-wide">Gate Code</p>
            <p className="text-2xl font-bold text-amber-900">{nextStop.gateCode}</p>
          </div>

          {/* Action Buttons - Large */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(nextStop.address)}`}
              className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold text-lg"
            >
              <NavigationIcon className="w-5 h-5" />
              Navigate
            </a>
            <Link
              href={`/tech/route/${nextStop.id}`}
              className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg"
            >
              Start Job
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming Stops */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-500 mb-3">Up Next</p>
        <div className="space-y-3">
          {upcomingStops.map((stop, index) => (
            <div key={stop.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <p className="font-medium text-slate-900">{stop.name}</p>
                <p className="text-sm text-slate-500">{stop.address}</p>
              </div>
              <span className="text-xs text-slate-400">{index + 1} stops</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 2.4 Service Entry Page

```tsx
// /app/(tech)/tech/route/[stopId]/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock data
const stopData = {
  id: '11',
  name: 'Williams Estate',
  address: '890 Pine Rd',
  poolSize: 15000,
  poolType: 'Saltwater',
  lastChemistry: { pH: 7.4, chlorine: 1.2, alkalinity: 95 },
};

export default function ServiceEntryPage({ params }: { params: { stopId: string } }) {
  const router = useRouter();

  // Chemistry state with +/- controls
  const [chemistry, setChemistry] = useState({
    pH: 7.4,
    chlorine: 1.5,
    alkalinity: 90,
  });

  // Tasks state
  const [tasks, setTasks] = useState({
    skim: true,
    brush: true,
    vacuum: false,
    baskets: true,
    filter: false,
  });

  const [chemicalsAdded, setChemicalsAdded] = useState(false);

  const incrementValue = (field: keyof typeof chemistry, amount: number) => {
    setChemistry(prev => ({
      ...prev,
      [field]: Math.round((prev[field] + amount) * 10) / 10
    }));
  };

  const toggleTask = (task: keyof typeof tasks) => {
    setTasks(prev => ({ ...prev, [task]: !prev[task] }));
  };

  const handleComplete = () => {
    // In real app: save to local storage / sync queue
    router.push('/tech/route');
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="text-slate-600 font-medium"
        >
          ← Back
        </button>
        <button
          onClick={handleComplete}
          className="text-blue-600 font-semibold"
        >
          Complete →
        </button>
      </div>

      {/* Stop Info */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">{stopData.name}</h1>
        <p className="text-slate-500">
          {stopData.poolSize.toLocaleString()} gal | {stopData.poolType}
        </p>
      </div>

      {/* Chemistry Input */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-4">Water Chemistry</h2>

        <div className="space-y-4">
          {/* pH Row */}
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">pH</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => incrementValue('pH', -0.1)}
                className="w-12 h-12 bg-slate-100 rounded-lg text-xl font-bold text-slate-600 active:bg-slate-200"
              >
                −
              </button>
              <span className="w-16 text-center text-xl font-bold text-slate-900">
                {chemistry.pH.toFixed(1)}
              </span>
              <button
                onClick={() => incrementValue('pH', 0.1)}
                className="w-12 h-12 bg-slate-100 rounded-lg text-xl font-bold text-slate-600 active:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Chlorine Row */}
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">Chlorine</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => incrementValue('chlorine', -0.1)}
                className="w-12 h-12 bg-slate-100 rounded-lg text-xl font-bold text-slate-600 active:bg-slate-200"
              >
                −
              </button>
              <span className="w-16 text-center text-xl font-bold text-slate-900">
                {chemistry.chlorine.toFixed(1)}
              </span>
              <button
                onClick={() => incrementValue('chlorine', 0.1)}
                className="w-12 h-12 bg-slate-100 rounded-lg text-xl font-bold text-slate-600 active:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Alkalinity Row */}
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">Alkalinity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => incrementValue('alkalinity', -5)}
                className="w-12 h-12 bg-slate-100 rounded-lg text-xl font-bold text-slate-600 active:bg-slate-200"
              >
                −
              </button>
              <span className="w-16 text-center text-xl font-bold text-slate-900">
                {Math.round(chemistry.alkalinity)}
              </span>
              <button
                onClick={() => incrementValue('alkalinity', 5)}
                className="w-12 h-12 bg-slate-100 rounded-lg text-xl font-bold text-slate-600 active:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dosing Recommendation */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
        <h3 className="font-semibold text-green-800 mb-2">Recommended Dosing</h3>
        <ul className="space-y-1 text-green-700">
          <li>+ 8 oz muriatic acid</li>
          <li>+ 3 chlorine tabs</li>
        </ul>
        <button
          onClick={() => setChemicalsAdded(true)}
          className={`mt-3 w-full py-3 rounded-lg font-semibold text-center ${
            chemicalsAdded
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}
        >
          {chemicalsAdded ? '✓ Chemicals Added' : 'Mark Chemicals Added'}
        </button>
      </div>

      {/* Tasks Checklist */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-4">Tasks</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(tasks).map(([task, completed]) => (
            <button
              key={task}
              onClick={() => toggleTask(task as keyof typeof tasks)}
              className={`py-3 px-4 rounded-lg font-medium text-center transition-colors ${
                completed
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {completed && '✓ '}{task.charAt(0).toUpperCase() + task.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Button - Large */}
      <button
        onClick={handleComplete}
        className="w-full py-5 bg-green-600 text-white rounded-xl font-bold text-lg active:bg-green-700"
      >
        Complete Stop
      </button>
    </div>
  );
}
```

### 2.5 Mobile Breakpoints

The tech app should be mobile-only optimized:

```tsx
// In layout.tsx, consider adding:
// This forces mobile viewport for consistent testing

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

// Max width for tech layout content:
<main className="max-w-md mx-auto">
```

---

## Part 3: Data Structures

### 3.1 Mock Data (Dashboard)

```tsx
// Use existing mock data structure but ensure these values:

const dashboardData = {
  revenue: {
    monthly: 47850,
    growthPercent: 9.4,
    projectedMonth: 52340,
  },
  savings: {
    weeklyDollars: 875,
    weeklyHours: 12.5,
    weeklyMiles: 186,
    annualProjected: 4200,
  },
  today: {
    poolsCompleted: 24,
    poolsTotal: 32,
    onTimePercent: 94,
    revenueCollected: 2847,
    revenueProjected: 3650,
  },
  alerts: [
    { id: 1, type: 'high', message: 'pH High - Johnson Residence' },
    { id: 2, type: 'high', message: 'Jake running behind schedule' },
    { id: 3, type: 'medium', message: 'Invoice 30+ days overdue - Chen' },
  ],
  technicians: [
    { id: 1, name: 'Mike Rodriguez', initials: 'MR', color: '#2563EB', completed: 6, total: 8, status: 'active' },
    { id: 2, name: 'Sarah Chen', initials: 'SC', color: '#059669', completed: 8, total: 8, status: 'done' },
    { id: 3, name: 'Jake Thompson', initials: 'JT', color: '#DC2626', completed: 4, total: 8, status: 'behind' },
    { id: 4, name: 'Emily Davis', initials: 'ED', color: '#7C3AED', completed: 5, total: 8, status: 'break' },
  ],
};
```

### 3.2 Mock Data (Tech App)

```tsx
const techRouteData = {
  date: 'Tuesday, January 26',
  totalStops: 15,
  estimatedHours: 6.5,
  totalMiles: 42,
  completed: 10,
  stops: [
    // First 10 completed
    ...Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      name: `Customer ${i + 1}`,
      address: `${1000 + i * 100} Main St`,
      gateCode: `#${1000 + i}`,
      status: 'completed',
    })),
    // Next stop
    {
      id: '11',
      name: 'Williams Estate',
      address: '890 Pine Rd',
      gateCode: 'Side gate unlocked',
      status: 'next',
      poolSize: 15000,
      poolType: 'Saltwater',
    },
    // Remaining
    ...Array.from({ length: 4 }, (_, i) => ({
      id: String(i + 12),
      name: `Customer ${i + 12}`,
      address: `${2000 + i * 100} Oak Ave`,
      gateCode: `${2000 + i}`,
      status: 'upcoming',
    })),
  ],
};
```

---

## Part 4: Testing Checklist

### Dashboard

- [ ] Revenue card displays correctly on mobile
- [ ] Savings card displays correctly
- [ ] Progress bar animates on load
- [ ] Alerts are compact and readable
- [ ] Tech status shows all 4 technicians
- [ ] Quick actions are visible without scrolling on desktop
- [ ] Layout responds correctly at 640px, 768px, 1024px breakpoints
- [ ] No animations cause layout shift

### Tech App

- [ ] Route view loads in < 1 second
- [ ] Gate code is immediately visible
- [ ] Navigate button launches maps
- [ ] Start Job navigates to service entry
- [ ] Chemistry +/- buttons work
- [ ] Task checkboxes toggle
- [ ] Complete button returns to route
- [ ] Bottom navigation works
- [ ] Layout looks correct on iPhone SE (375px)
- [ ] Layout looks correct on iPhone 14 Pro (393px)

### Performance

- [ ] Dashboard loads in < 2 seconds
- [ ] No console errors
- [ ] No layout shift during animations
- [ ] Images are optimized (if any)

---

## Part 5: Deployment Notes

### Pre-Deployment

1. Run `npm run build` to check for errors
2. Test on mobile device (not just responsive mode)
3. Verify all links work
4. Check demo login still works

### Environment

- Deployment: Vercel
- URL: poolapp.vercel.app
- Demo credentials: demo@poolapp.com / demo123

### Post-Deployment

1. Test dashboard on phone
2. Test tech app flow on phone
3. Verify load time < 2 seconds
4. Send URL to team for review

---

## Summary

### Files to Create
- `/app/(tech)/layout.tsx`
- `/app/(tech)/tech/page.tsx`
- `/app/(tech)/tech/route/page.tsx`
- `/app/(tech)/tech/route/[stopId]/page.tsx`
- `/app/(tech)/tech/history/page.tsx`
- `/app/(tech)/tech/account/page.tsx`

### Files to Modify
- `/app/(dashboard)/dashboard/page.tsx`

### Estimated Time
- Dashboard redesign: 3-4 hours
- Tech app (basic): 4-5 hours
- Testing: 1 hour
- **Total: 8-10 hours**

---

*Implementation Status: READY*
*Assignee: Implementation Engineer*
*Due: January 26, 2026 EOD*
