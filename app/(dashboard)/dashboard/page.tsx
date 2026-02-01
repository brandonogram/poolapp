'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GettingStartedChecklist, FeatureHint, DemoModeToggle } from '@/components/onboarding';

// ============================================================================
// MOCK DATA - Revenue-first, impressive numbers
// ============================================================================

const revenueData = {
  today: 2847,
  todayProjected: 3650,
  thisWeek: 12340,
  thisMonth: 47850,
  lastMonth: 43720,
  monthGrowthPercent: 9.4,
};

const routeData = {
  poolsCompleted: 24,
  poolsTotal: 32,
  estimatedCompletion: '4:30 PM',
};

const technicians = [
  { id: 1, name: 'Mike R.', initials: 'MR', color: '#2563EB', completed: 6, total: 8, status: 'active' as const },
  { id: 2, name: 'Sarah C.', initials: 'SC', color: '#059669', completed: 8, total: 8, status: 'done' as const },
  { id: 3, name: 'Jake T.', initials: 'JT', color: '#F59E0B', completed: 4, total: 8, status: 'behind' as const },
];

const alerts = [
  { id: 1, type: 'critical' as const, message: 'pH high at Johnson - prevented $500 callback', action: '/customers/cust-1' },
  { id: 2, type: 'critical' as const, message: 'Jake running 30min behind - route auto-adjusted', action: '/routes' },
  { id: 3, type: 'warning' as const, message: 'Filter replacement due at 3 pools this week', action: '/schedule' },
  { id: 4, type: 'info' as const, message: 'Opening season prep: 12 pools scheduled', action: '/schedule' },
];

const weekData = [
  { day: 'Mon', jobs: 28, revenue: 2100 },
  { day: 'Tue', jobs: 32, revenue: 2400 },
  { day: 'Wed', jobs: 30, revenue: 2250 },
  { day: 'Thu', jobs: 35, revenue: 2625 },
  { day: 'Fri', jobs: 33, revenue: 2475 },
  { day: 'Sat', jobs: 12, revenue: 900 },
  { day: 'Sun', jobs: 0, revenue: 0 },
];

// ============================================================================
// STATUS DOT COMPONENT
// ============================================================================

function StatusDot({ status }: { status: 'active' | 'done' | 'behind' | 'break' }) {
  const colors = {
    active: 'bg-green-500',
    done: 'bg-slate-400',
    behind: 'bg-red-500',
    break: 'bg-amber-500',
  };

  return (
    <span className="relative flex h-2.5 w-2.5">
      {(status === 'active' || status === 'behind') && (
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${colors[status]}`} />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status]}`} />
    </span>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check if user has completed onboarding and if we should show the checklist
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('poolapp-onboarding-complete');
    const checklistDismissed = localStorage.getItem('poolapp-checklist-dismissed');

    if (onboardingComplete === 'true' && checklistDismissed !== 'true') {
      setShowOnboarding(true);
    }

    // Check if this is a new user (just completed onboarding)
    const justCompleted = localStorage.getItem('poolapp-just-completed-onboarding');
    if (justCompleted === 'true') {
      setIsNewUser(true);
      localStorage.removeItem('poolapp-just-completed-onboarding');
    }
  }, []);

  const progressPercent = (routeData.poolsCompleted / routeData.poolsTotal) * 100;
  const todayIndex = new Date().getDay();
  const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Mon=0, Sun=6

  return (
    <div className="min-h-screen pb-8">
      {/* ================================================================== */}
      {/* GETTING STARTED CHECKLIST - Show for new users */}
      {/* ================================================================== */}
      {showOnboarding && (
        <div className="mb-6">
          <GettingStartedChecklist />
        </div>
      )}

      {/* ================================================================== */}
      {/* 1. REVENUE HERO SECTION - THE MOST IMPORTANT THING */}
      {/* ================================================================== */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">{currentDate}</p>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{currentTime}</p>
        </div>

        {/* Revenue Hero Card */}
        <FeatureHint
          id="revenue-hint"
          title="Your daily revenue"
          description="This shows your revenue at a glance - today's earnings, weekly totals, and monthly growth."
          position="bottom"
          delay={1000}
        >
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Primary: Today's Revenue */}
            <div>
              <p className="text-emerald-200 text-sm font-medium mb-1">Today's Revenue</p>
              <p className="text-5xl font-bold tracking-tight">${revenueData.today.toLocaleString()}</p>
              <p className="text-emerald-200 text-sm mt-1">
                Projected: <span className="text-white font-semibold">${revenueData.todayProjected.toLocaleString()}</span>
              </p>
            </div>

            {/* Secondary Metrics */}
            <div className="flex gap-6 sm:gap-8">
              <div className="text-right">
                <p className="text-emerald-200 text-xs uppercase tracking-wide">This Week</p>
                <p className="text-2xl font-bold">${(revenueData.thisWeek / 1000).toFixed(1)}k</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-200 text-xs uppercase tracking-wide">This Month</p>
                <p className="text-2xl font-bold">${(revenueData.thisMonth / 1000).toFixed(1)}k</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-green-300 font-semibold">+{revenueData.monthGrowthPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </FeatureHint>
      </div>

      {/* ================================================================== */}
      {/* 2. QUICK ACTIONS BAR */}
      {/* ================================================================== */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <FeatureHint
          id="routes-hint"
          title="Click here to optimize routes"
          description="View and optimize your technicians' routes. Our AI finds the fastest path to save time and gas."
          position="bottom"
          delay={2000}
        >
          <Link
            href="/routes"
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View Routes
          </Link>
        </FeatureHint>
        <Link
          href="/invoices/new"
          className="flex items-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-colors whitespace-nowrap shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Link>
        <Link href="/schedule" className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors whitespace-nowrap shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Job
        </Link>
        <Link
          href="/schedule"
          className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule
        </Link>
        <Link
          href="/customers"
          className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Customers
        </Link>
      </div>

      {/* ================================================================== */}
      {/* 3. TODAY'S OPERATIONS - Two Columns */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left Column: Route Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Route Progress</h2>
            <span className="text-sm text-slate-500">Est. done by {routeData.estimatedCompletion}</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-900">{routeData.poolsCompleted} completed</span>
              <span className="text-slate-500">{routeData.poolsTotal - routeData.poolsCompleted} remaining</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-slate-900">{routeData.poolsCompleted}</p>
              <p className="text-xs text-slate-500">Done</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-slate-900">{routeData.poolsTotal - routeData.poolsCompleted}</p>
              <p className="text-xs text-slate-500">Left</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{Math.round(progressPercent)}%</p>
              <p className="text-xs text-blue-600">Complete</p>
            </div>
          </div>
        </div>

        {/* Right Column: Tech Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Technicians</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-500">Live</span>
            </div>
          </div>

          {/* Tech Cards - Compact Grid */}
          <div className="grid grid-cols-2 gap-2">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  tech.status === 'behind' ? 'bg-red-50 border border-red-200' : 'bg-slate-50'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: tech.color }}
                >
                  {tech.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-slate-900 truncate">{tech.name}</p>
                    <StatusDot status={tech.status} />
                  </div>
                  <p className="text-xs text-slate-500">{tech.completed}/{tech.total} pools</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/routes"
            className="mt-4 block w-full text-center py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] flex items-center justify-center"
          >
            Open Live Map
          </Link>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. ALERTS SECTION - Compact */}
      {/* ================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-900">Alerts</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
              {alerts.filter(a => a.type === 'critical').length} urgent
            </span>
          </div>
          <Link href="/alerts" className="text-sm text-blue-600 hover:text-blue-700 px-3 py-2 -mr-3 rounded-lg hover:bg-blue-50 min-h-[44px] flex items-center">
            View all
          </Link>
        </div>

        <div className="space-y-2">
          {alerts.slice(0, 4).map((alert) => (
            <Link
              key={alert.id}
              href={alert.action}
              className={`flex items-center justify-between p-3 rounded-lg border-l-4 transition-colors ${
                alert.type === 'critical'
                  ? 'bg-red-50 border-l-red-500 hover:bg-red-100'
                  : alert.type === 'warning'
                  ? 'bg-amber-50 border-l-amber-500 hover:bg-amber-100'
                  : 'bg-blue-50 border-l-blue-400 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {alert.type === 'critical' ? (
                  <svg className="w-4 h-4 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : alert.type === 'warning' ? (
                  <svg className="w-4 h-4 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium text-slate-700">{alert.message}</span>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 5. WEEK SNAPSHOT */}
      {/* ================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">This Week</h2>
          <p className="text-sm text-slate-500">
            Projected: <span className="font-semibold text-slate-900">${weekData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</span>
          </p>
        </div>

        {/* Mini Calendar / Job Density */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekData.map((day, index) => {
            const maxJobs = Math.max(...weekData.map(d => d.jobs));
            const intensity = day.jobs > 0 ? Math.max(0.2, day.jobs / maxJobs) : 0;
            const isToday = index === adjustedTodayIndex;

            return (
              <div key={day.day} className="text-center">
                <p className={`text-xs mb-1 ${isToday ? 'font-bold text-blue-600' : 'text-slate-500'}`}>
                  {day.day}
                </p>
                <div
                  className={`h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                    isToday
                      ? 'bg-blue-600 text-white'
                      : day.jobs > 0
                      ? 'text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                  style={!isToday && day.jobs > 0 ? { backgroundColor: `rgba(16, 185, 129, ${intensity})` } : {}}
                >
                  {day.jobs}
                </div>
                <p className={`text-xs mt-1 ${isToday ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                  ${day.revenue > 0 ? (day.revenue / 1000).toFixed(1) + 'k' : '0'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{weekData.reduce((sum, d) => sum + d.jobs, 0)}</p>
            <p className="text-xs text-slate-500">Jobs Scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">${(weekData.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(1)}k</p>
            <p className="text-xs text-slate-500">Expected Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">4</p>
            <p className="text-xs text-slate-500">Active Techs</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button for quick add - mobile only */}
      <Link
        href="/schedule"
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 active:scale-95 transition-all lg:hidden z-40"
        aria-label="Add new job"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Link>
    </div>
  );
}
