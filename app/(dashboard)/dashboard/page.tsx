'use client';

import { StatCard, ProgressBar, Badge, Card, Avatar } from '@/components/ui';
import {
  weeklyStats,
  todayRoutes,
  technicians,
  alerts,
  getTechnicianById,
} from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's what's happening with your routes today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Customer
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue This Week"
          value={`$${weeklyStats.revenue.toLocaleString()}`}
          trend={{ value: weeklyStats.revenueChange, label: 'vs last week' }}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Pools Serviced"
          value={`${weeklyStats.poolsDone}/${weeklyStats.poolsTotal}`}
          subtitle="This week"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Time Saved"
          value={`${weeklyStats.timeSaved} hrs`}
          subtitle="Via route optimization"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Fuel Saved"
          value={`$${weeklyStats.fuelSaved}`}
          subtitle="This week"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Routes - spans 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Today's Routes" subtitle="Wednesday, January 22">
            <div className="space-y-6">
              {todayRoutes.map((route) => {
                const tech = getTechnicianById(route.technicianId);
                const completedStops = route.stops.filter((s) => s.status === 'completed').length;
                const inProgressStops = route.stops.filter((s) => s.status === 'in-progress').length;
                const totalStops = route.stops.length;

                return (
                  <div key={route.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={tech?.name || ''} size="md" />
                        <div>
                          <p className="font-medium text-slate-900">{tech?.name}</p>
                          <p className="text-sm text-slate-500">
                            {completedStops} of {totalStops} pools done
                            {inProgressStops > 0 && (
                              <span className="text-primary-500"> - 1 in progress</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={completedStops === totalStops ? 'success' : 'primary'}
                          dot
                        >
                          {completedStops === totalStops
                            ? 'Complete'
                            : inProgressStops > 0
                            ? 'On Route'
                            : 'Scheduled'}
                        </Badge>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <ProgressBar
                      value={completedStops}
                      max={totalStops}
                      color={completedStops === totalStops ? 'success' : 'primary'}
                      size="md"
                      showValue={false}
                    />
                    {/* Next stop info */}
                    {inProgressStops > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg">
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-primary-700">
                          Currently at: {route.stops.find((s) => s.status === 'in-progress')?.customerName}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Map placeholder */}
          <Card title="Live Map" subtitle="Technician locations">
            <div className="h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Fake map background */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Fake route line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320">
                <path
                  d="M 50 260 Q 100 200 150 180 Q 200 160 220 120 Q 240 80 300 100 Q 360 120 350 200"
                  fill="none"
                  stroke="#0066FF"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  className="opacity-60"
                />
              </svg>

              {/* Technician markers */}
              {technicians.map((tech, index) => {
                const positions = [
                  { x: '35%', y: '45%' },
                  { x: '55%', y: '35%' },
                  { x: '75%', y: '55%' },
                ];
                return (
                  <div
                    key={tech.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: positions[index].x, top: positions[index].y }}
                  >
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: tech.color }}
                      >
                        {tech.name.split(' ')[0][0]}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {tech.name}
                    </div>
                  </div>
                );
              })}

              {/* Map attribution style text */}
              <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                Map integration coming soon
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - Alerts */}
        <div className="space-y-4">
          <Card
            title="Needs Attention"
            subtitle={`${alerts.length} alerts`}
            action={
              <button className="text-sm font-medium text-primary-500 hover:text-primary-600">
                View all
              </button>
            }
          >
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'high'
                      ? 'bg-red-50 border-red-200'
                      : alert.severity === 'medium'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        alert.severity === 'high'
                          ? 'bg-red-100 text-red-600'
                          : alert.severity === 'medium'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {alert.type === 'chemistry' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      )}
                      {alert.type === 'equipment' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {alert.type === 'overdue' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {alert.type === 'weather' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{alert.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                    <button className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick stats */}
          <Card title="Today's Performance">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Avg Service Time</span>
                <span className="text-sm font-semibold text-slate-900">{weeklyStats.avgServiceTime} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Customer Rating</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-900">{weeklyStats.customerSatisfaction}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Routes Optimized</span>
                <Badge variant="success">3/3</Badge>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Miles Saved Today</span>
                  <span className="font-semibold text-green-600">23.4 mi</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
