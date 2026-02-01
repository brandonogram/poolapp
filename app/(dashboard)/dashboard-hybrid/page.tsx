'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  StatCardSkeleton,
  AlertItemSkeleton,
  CardSkeleton,
  AlertsEmptyState,
  ErrorBoundary,
  ErrorFallback,
} from '@/components/ui';

// Demo data for convention - tells the story of a successful Delaware pool company
// This is a 3-tech company showing impressive but believable numbers

// Alerts that demonstrate value - catching problems before they become expensive
const actionItems = [
  {
    id: '1',
    type: 'chemistry',
    title: 'pH high at Johnson residence - prevented $500 callback',
    subtitle: 'Reading: 8.2 (high) - Auto-detected before customer noticed',
    action: 'View details',
    href: '/customers/cust-1',
    priority: 'high',
  },
  {
    id: '2',
    type: 'schedule',
    title: 'Jake running 30min behind - route auto-adjusted',
    subtitle: 'Traffic on Rt. 1 near Rehoboth - 3 customers notified automatically',
    action: 'View route',
    href: '/routes',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'equipment',
    title: 'Filter replacement due at 3 pools this week',
    subtitle: 'Williams, Chen, and Harbor View HOA - scheduled proactively',
    action: 'View schedule',
    href: '/schedule',
    priority: 'low',
  },
];

// Today's numbers - realistic for a busy January day (off-season prep)
const todayStats = {
  revenue: 2847,
  completed: 14,
  remaining: 4,
};

// Business health metrics - past 30 days - matches our pitch numbers
const businessHealth = {
  retention: {
    value: 98.2,
    change: +3.4,
    label: 'Customer retention',
  },
  avgRevenue: {
    value: 156,
    change: +18,
    label: 'Avg revenue/customer',
  },
  outstanding: {
    value: 1245,
    invoices: 4,
    label: 'Outstanding receivables',
  },
  churn: {
    lost: 1,
    gained: 8,
    label: 'Customer changes',
  },
};

// Monthly stats that match our convention pitch
const monthlyStats = {
  revenue: 47850, // $47,850 monthly - realistic for 3-tech company
  routeSavings: 4200, // $4,200/year in route optimization
  satisfaction: 4.9, // 4.9/5 customer satisfaction
  onTimeRate: 94, // 94% on-time rate
};

// Loading skeleton for business health stats
function BusinessHealthSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="skeleton-shimmer h-4 w-24 rounded mb-2" />
          <div className="flex items-end gap-2">
            <div className="skeleton-shimmer h-8 w-20 rounded" />
            <div className="skeleton-shimmer h-4 w-12 rounded mb-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading skeleton for monthly stats strip
function MonthlyStatsSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="skeleton-shimmer h-9 w-24 rounded mx-auto mb-1 opacity-40" />
            <div className="skeleton-shimmer h-4 w-20 rounded mx-auto opacity-30" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading skeleton for today panel
function TodayPanelSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-6">
        <div className="skeleton-shimmer h-4 w-16 rounded mb-2" />
        <div className="skeleton-shimmer h-10 w-32 rounded" />
      </div>
      <div className="h-px bg-slate-100 mb-6" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="skeleton-shimmer h-4 w-20 rounded" />
          <div className="skeleton-shimmer h-8 w-12 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="skeleton-shimmer h-4 w-20 rounded" />
          <div className="skeleton-shimmer h-8 w-12 rounded" />
        </div>
      </div>
      <div className="mt-6">
        <div className="skeleton-shimmer h-2 w-full rounded-full" />
        <div className="skeleton-shimmer h-3 w-24 rounded mt-2 ml-auto" />
      </div>
    </div>
  );
}

export default function DashboardHybridPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide uppercase">
            Sunday, January 26
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Good afternoon, Mike
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Delaware Pool Pros - Opening Season Prep Mode
          </p>
        </motion.div>

        {/* Key Performance Strip - Convention pitch numbers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className="mb-6"
        >
          {isLoading ? (
            <MonthlyStatsSkeleton />
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold"
                  >
                    ${monthlyStats.revenue.toLocaleString()}
                  </motion.p>
                  <p className="text-blue-100 text-sm">This Month</p>
                </div>
                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-3xl font-bold"
                  >
                    ${monthlyStats.routeSavings.toLocaleString()}
                  </motion.p>
                  <p className="text-blue-100 text-sm">Route Savings/Year</p>
                </div>
                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold"
                  >
                    {monthlyStats.satisfaction}/5
                  </motion.p>
                  <p className="text-blue-100 text-sm">Customer Rating</p>
                </div>
                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-3xl font-bold"
                  >
                    {monthlyStats.onTimeRate}%
                  </motion.p>
                  <p className="text-blue-100 text-sm">On-Time Rate</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Business Health Strip - Past 30 Days */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Past 30 days
            </h2>
          </div>

          {isLoading ? (
            <BusinessHealthSkeleton />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Retention */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <p className="text-sm text-slate-500">{businessHealth.retention.label}</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900">
                    {businessHealth.retention.value}%
                  </span>
                  <span className={`text-sm font-medium mb-0.5 ${businessHealth.retention.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {businessHealth.retention.change >= 0 ? '+' : ''}{businessHealth.retention.change}%
                  </span>
                </div>
              </motion.div>

              {/* Avg Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <p className="text-sm text-slate-500">{businessHealth.avgRevenue.label}</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900">
                    ${businessHealth.avgRevenue.value}
                  </span>
                  <span className={`text-sm font-medium mb-0.5 ${businessHealth.avgRevenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {businessHealth.avgRevenue.change >= 0 ? '+' : ''}${businessHealth.avgRevenue.change}
                  </span>
                </div>
              </motion.div>

              {/* Outstanding */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/invoices?filter=overdue"
                  className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-md transition-all duration-200 group"
                >
                  <p className="text-sm text-slate-500">{businessHealth.outstanding.label}</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      ${businessHealth.outstanding.value.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400 mb-0.5">
                      {businessHealth.outstanding.invoices} invoices
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Customer Changes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <p className="text-sm text-slate-500">{businessHealth.churn.label}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-lg font-semibold text-green-600">+{businessHealth.churn.gained}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-lg font-semibold text-red-500">-{businessHealth.churn.lost}</span>
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Needs Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Needs your attention
              </h2>
              {!isLoading && (
                <span className="text-sm text-slate-500">
                  {showAlerts ? actionItems.length : 0} items
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <AlertItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {showAlerts && actionItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Link
                        href={item.href}
                        className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 active:scale-[0.99]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {/* Priority indicator */}
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                item.priority === 'high'
                                  ? 'bg-red-500'
                                  : item.priority === 'medium'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-300'
                              }`}
                            />
                            <div>
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-slate-500 text-sm mt-0.5">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1">
                            {item.action}
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {(!showAlerts || actionItems.length === 0) && (
                  <AlertsEmptyState />
                )}
              </div>
            )}
          </motion.div>

          {/* Right column - Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Today</h2>

            {isLoading ? (
              <TodayPanelSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Revenue */}
                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-1">Revenue</p>
                  <p className="text-4xl font-bold text-slate-900 tracking-tight">
                    ${todayStats.revenue.toLocaleString()}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 mb-6" />

                {/* Pools */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Completed</span>
                    <span className="text-2xl font-semibold text-slate-900">
                      {todayStats.completed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Remaining</span>
                    <span className="text-2xl font-semibold text-blue-600">
                      {todayStats.remaining}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(todayStats.completed / (todayStats.completed + todayStats.remaining)) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right">
                    {Math.round((todayStats.completed / (todayStats.completed + todayStats.remaining)) * 100)}% complete
                  </p>
                </div>
              </motion.div>
            )}

            {/* Quick links */}
            {!isLoading && (
              <div className="mt-6 space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/routes"
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 group active:scale-[0.99]"
                  >
                    <span className="font-medium text-slate-700">View today's routes</span>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <Link
                    href="/customers"
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 group active:scale-[0.99]"
                  >
                    <span className="font-medium text-slate-700">Manage customers</span>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Social Proof Section */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">M</div>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">J</div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">S</div>
                  </div>
                  <span className="text-sm text-slate-500">Trusted by 500+ pool pros</span>
                </div>
                <blockquote className="text-slate-700 italic">
                  "Saved $4,100 last year just from route optimization. The chemistry alerts paid for the whole system in the first month."
                </blockquote>
                <p className="text-sm text-slate-500 mt-1">
                  — Mike R., Blue Wave Pools, Delaware
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">$4,100</p>
                  <p className="text-xs text-slate-500">avg. annual savings</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Opening Season Banner - January context */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-amber-800">Opening Season Prep Mode Active</p>
                <p className="text-sm text-amber-700 mt-0.5">
                  12 pools scheduled for spring opening inspections. Equipment checks and filter replacements queued automatically.
                  <Link href="/schedule" className="ml-1 underline hover:no-underline">View prep schedule</Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Compare link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 pt-6 border-t border-slate-200"
        >
          <p className="text-sm text-slate-400 text-center">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              View minimal dashboard option
            </Link>
            {' | '}
            <Link href="/demo" className="text-blue-600 hover:underline">
              View UI components demo
            </Link>
          </p>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}
