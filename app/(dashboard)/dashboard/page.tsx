'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import TechStatusCard from '@/components/dashboard/TechStatusCard';
import AlertBanner from '@/components/dashboard/AlertBanner';
import { calculateTechPrediction, TechPrediction } from '@/lib/predictions';

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

// Mock route data for predictions
const techRoutes = [
  {
    technicianId: 'tech_001',
    technicianName: 'Mike Rodriguez',
    technicianColor: '#2563EB',
    scheduledEnd: new Date(new Date().setHours(16, 30, 0, 0)), // 4:30 PM
    stops: [
      { id: '1', customerName: 'Johnson', status: 'completed' as const, lat: 42.4611, lng: -83.1150 },
      { id: '2', customerName: 'Williams', status: 'completed' as const, lat: 42.4720, lng: -83.1280 },
      { id: '3', customerName: 'Garcia', status: 'completed' as const, lat: 42.4550, lng: -83.1420 },
      { id: '4', customerName: 'Thompson', status: 'completed' as const, lat: 42.4680, lng: -83.1050 },
      { id: '5', customerName: 'Chen', status: 'in-progress' as const, lat: 42.4810, lng: -83.1320 },
      { id: '6', customerName: 'Davis', status: 'pending' as const, lat: 42.4920, lng: -83.1180 },
      { id: '7', customerName: 'Miller', status: 'pending' as const, lat: 42.5010, lng: -83.1350 },
      { id: '8', customerName: 'Wilson', status: 'pending' as const, lat: 42.4750, lng: -83.1500 },
      { id: '9', customerName: 'Anderson', status: 'pending' as const, lat: 42.4630, lng: -83.1620 },
      { id: '10', customerName: 'Martinez', status: 'pending' as const, lat: 42.4520, lng: -83.1750 },
    ],
  },
  {
    technicianId: 'tech_002',
    technicianName: 'Sarah Chen',
    technicianColor: '#059669',
    scheduledEnd: new Date(new Date().setHours(15, 45, 0, 0)), // 3:45 PM
    stops: [
      { id: '11', customerName: 'Brown', status: 'completed' as const, lat: 42.5120, lng: -83.0950 },
      { id: '12', customerName: 'Taylor', status: 'completed' as const, lat: 42.5230, lng: -83.1080 },
      { id: '13', customerName: 'Thomas', status: 'completed' as const, lat: 42.5180, lng: -83.1220 },
      { id: '14', customerName: 'Jackson', status: 'completed' as const, lat: 42.5050, lng: -83.1350 },
      { id: '15', customerName: 'White', status: 'completed' as const, lat: 42.4980, lng: -83.1480 },
      { id: '16', customerName: 'Harris', status: 'in-progress' as const, lat: 42.4850, lng: -83.1580 },
      { id: '17', customerName: 'Clark', status: 'pending' as const, lat: 42.4720, lng: -83.1680 },
      { id: '18', customerName: 'Lewis', status: 'pending' as const, lat: 42.4590, lng: -83.1750 },
    ],
  },
  {
    technicianId: 'tech_003',
    technicianName: 'Jake Thompson',
    technicianColor: '#DC2626',
    scheduledEnd: new Date(new Date().setHours(14, 0, 0, 0)), // 2:00 PM - intentionally behind
    stops: [
      { id: '19', customerName: 'Robinson', status: 'completed' as const, lat: 42.4320, lng: -83.2050 },
      { id: '20', customerName: 'Walker', status: 'in-progress' as const, lat: 42.4450, lng: -83.2180 },
      { id: '21', customerName: 'Young', status: 'pending' as const, lat: 42.4580, lng: -83.2280 },
      { id: '22', customerName: 'King', status: 'pending' as const, lat: 42.4710, lng: -83.2380 },
    ],
  },
];

// Calculate predictions for all techs
const predictions: TechPrediction[] = techRoutes.map((route) =>
  calculateTechPrediction(
    route.technicianId,
    route.technicianName,
    route.technicianColor,
    route.stops,
    route.scheduledEnd
  )
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">
          Wednesday, January 22
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Good afternoon
        </h1>
      </motion.div>

      {/* Alert Banner - shows if any tech is behind */}
      <AlertBanner predictions={predictions} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Needs Action + Tech Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Needs Attention */}
          <div>
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
          </div>

          {/* Tech Status - replaces the old "This Week" section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Tech Status
              </h2>
              <span className="text-sm text-slate-500">
                {predictions.filter((p) => p.status === 'on-track').length} on track
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {predictions.map((prediction, index) => (
                <TechStatusCard
                  key={prediction.technicianId}
                  prediction={prediction}
                  index={index}
                />
              ))}
            </div>
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
        transition={{ delay: 0.5 }}
        className="mt-12 pt-8 border-t border-slate-200"
      >
        <p className="text-sm text-slate-400 text-center">
          <Link href="/dashboard-hybrid" className="text-blue-600 hover:underline">
            View hybrid dashboard option →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
