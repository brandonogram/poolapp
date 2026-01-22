'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Mock data for actionable items
const actionItems = [
  {
    id: '1',
    type: 'invoice',
    title: '3 invoices overdue',
    subtitle: '$847.50 outstanding',
    action: 'Review invoices',
    href: '/invoices',
    priority: 'high',
  },
  {
    id: '2',
    type: 'chemistry',
    title: 'pH alert at Johnson residence',
    subtitle: 'Reading: 8.4 (high) - Last service: 2 days ago',
    action: 'View details',
    href: '/customers/cust_001',
    priority: 'high',
  },
  {
    id: '3',
    type: 'schedule',
    title: 'Tomorrow: 2 techs unavailable',
    subtitle: 'Mike Chen (PTO), Sarah Kim (sick)',
    action: 'Adjust routes',
    href: '/schedule',
    priority: 'medium',
  },
];

const todayStats = {
  revenue: 1245,
  completed: 18,
  remaining: 6,
};

// Business health metrics - past 30 days
const businessHealth = {
  retention: {
    value: 94.2,
    change: +1.8,
    label: 'Customer retention',
  },
  avgRevenue: {
    value: 127,
    change: +12,
    label: 'Avg revenue/customer',
  },
  outstanding: {
    value: 2847.5,
    invoices: 8,
    label: 'Outstanding receivables',
  },
  churn: {
    lost: 2,
    gained: 7,
    label: 'Customer changes',
  },
};

export default function DashboardHybridPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">
          Wednesday, January 22
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Good afternoon
        </h1>
      </motion.div>

      {/* Business Health Strip - Past 30 Days */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Past 30 days
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Retention */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500">{businessHealth.retention.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {businessHealth.retention.value}%
              </span>
              <span className={`text-sm font-medium mb-0.5 ${businessHealth.retention.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {businessHealth.retention.change >= 0 ? '+' : ''}{businessHealth.retention.change}%
              </span>
            </div>
          </div>

          {/* Avg Revenue */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500">{businessHealth.avgRevenue.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                ${businessHealth.avgRevenue.value}
              </span>
              <span className={`text-sm font-medium mb-0.5 ${businessHealth.avgRevenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {businessHealth.avgRevenue.change >= 0 ? '+' : ''}${businessHealth.avgRevenue.change}
              </span>
            </div>
          </div>

          {/* Outstanding */}
          <Link
            href="/invoices?filter=overdue"
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
          >
            <p className="text-sm text-slate-500">{businessHealth.outstanding.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 group-hover:text-amber-700">
                ${businessHealth.outstanding.value.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400 mb-0.5">
                {businessHealth.outstanding.invoices} invoices
              </span>
            </div>
          </Link>

          {/* Customer Changes */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
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
          </div>
        </div>
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
            <h2 className="text-lg font-semibold text-slate-900">
              Needs your attention
            </h2>
            <span className="text-sm text-slate-500">
              {actionItems.length} items
            </span>
          </div>

          <div className="space-y-3">
            {actionItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all"
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
                    <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.action} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {actionItems.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">You're all caught up</p>
                <p className="text-slate-400 text-sm mt-1">No items need attention right now</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right column - Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Today</h2>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
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
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${(todayStats.completed / (todayStats.completed + todayStats.remaining)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-right">
                {Math.round((todayStats.completed / (todayStats.completed + todayStats.remaining)) * 100)}% complete
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-6 space-y-2">
            <Link
              href="/routes"
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <span className="font-medium text-slate-700">View today's routes</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/customers"
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <span className="font-medium text-slate-700">Manage customers</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Compare link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 pt-8 border-t border-slate-200"
      >
        <p className="text-sm text-slate-400 text-center">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← View minimal dashboard option
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
