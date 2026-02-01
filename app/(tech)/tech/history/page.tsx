'use client';

import { useState } from 'react';

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

// Mock history data
const historyData = [
  {
    date: 'Today - Jan 26',
    stops: [
      { id: '1', customer: 'Johnson Family', time: '8:15 AM', chemistry: { pH: 7.4, chlorine: 2.0 }, status: 'completed' },
      { id: '2', customer: 'Martinez Residence', time: '9:00 AM', chemistry: { pH: 7.3, chlorine: 1.5 }, status: 'completed' },
      { id: '3', customer: 'Williams Estate', time: '10:00 AM', chemistry: { pH: 7.6, chlorine: 2.5 }, status: 'completed' },
      { id: '4', customer: 'Thompson Home', time: '11:15 AM', chemistry: { pH: 7.4, chlorine: 1.8 }, status: 'completed' },
      { id: '5', customer: 'Garcia Family', time: '12:00 PM', chemistry: { pH: 7.5, chlorine: 2.0 }, status: 'completed' },
    ],
  },
  {
    date: 'Yesterday - Jan 25',
    stops: [
      { id: '6', customer: 'Davis Residence', time: '8:00 AM', chemistry: { pH: 7.2, chlorine: 1.5 }, status: 'completed' },
      { id: '7', customer: 'Wilson Family', time: '9:00 AM', chemistry: { pH: 7.8, chlorine: 1.0 }, status: 'completed' },
      { id: '8', customer: 'Brown Pool House', time: '10:15 AM', chemistry: { pH: 7.4, chlorine: 2.2 }, status: 'completed' },
      { id: '9', customer: 'Chen Residence', time: '11:00 AM', chemistry: { pH: 7.3, chlorine: 1.8 }, status: 'completed' },
      { id: '10', customer: 'Roberts Family', time: '12:00 PM', chemistry: { pH: 7.5, chlorine: 2.0 }, status: 'skipped', reason: 'Gate locked' },
    ],
  },
  {
    date: 'Friday - Jan 24',
    stops: [
      { id: '11', customer: 'Kim Residence', time: '8:30 AM', chemistry: { pH: 7.4, chlorine: 2.5 }, status: 'completed' },
      { id: '12', customer: 'Patel Home', time: '9:30 AM', chemistry: { pH: 7.1, chlorine: 1.2 }, status: 'completed' },
      { id: '13', customer: 'Taylor Estate', time: '11:00 AM', chemistry: { pH: 7.6, chlorine: 2.0 }, status: 'completed' },
      { id: '14', customer: 'Miller Residence', time: '12:30 PM', chemistry: { pH: 7.4, chlorine: 1.8 }, status: 'completed' },
    ],
  },
];

export default function HistoryPage() {
  const [expandedStop, setExpandedStop] = useState<string | null>(null);

  // Calculate weekly stats
  const totalStops = historyData.reduce((acc, day) => acc + day.stops.length, 0);
  const completedStops = historyData.reduce(
    (acc, day) => acc + day.stops.filter(s => s.status === 'completed').length,
    0
  );

  return (
    <div className="p-4 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Service History</h1>
        <p className="text-slate-500 dark:text-slate-400">View your past service records</p>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-6 shadow-sm transition-colors" role="region" aria-label="Weekly summary">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">This Week</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalStops}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Stops</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedStops}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {Math.round((completedStops / totalStops) * 100)}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Success Rate</p>
          </div>
        </div>
      </div>

      {/* History by Day */}
      {historyData.map((day) => (
        <div key={day.date} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{day.date}</h3>
            <span className="text-sm text-slate-400 dark:text-slate-500">({day.stops.length} stops)</span>
          </div>

          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
            {day.stops.map((stop, index) => (
              <div key={stop.id}>
                <button
                  onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-700 active:bg-slate-100 dark:active:bg-surface-600 transition-colors min-h-[64px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-expanded={expandedStop === stop.id}
                  aria-controls={`stop-details-${stop.id}`}
                >
                  <div className="flex items-center gap-3">
                    {stop.status === 'completed' ? (
                      <CheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs font-bold">!</span>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{stop.customer}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{stop.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <p className="text-slate-600 dark:text-slate-300">pH {stop.chemistry.pH}</p>
                      <p className="text-slate-400 dark:text-slate-500">Cl {stop.chemistry.chlorine}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform ${
                        expandedStop === stop.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded details */}
                {expandedStop === stop.id && (
                  <div id={`stop-details-${stop.id}`} className="px-4 pb-4 bg-slate-50 dark:bg-surface-700 transition-colors">
                    <div className="pl-9">
                      {stop.status === 'skipped' && stop.reason && (
                        <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            <strong>Skipped:</strong> {stop.reason}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">pH Level</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{stop.chemistry.pH}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Chlorine</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{stop.chemistry.chlorine} ppm</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Tasks Completed</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {stop.status === 'completed' ? 'Skim, Brush, Baskets' : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Photos</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {stop.status === 'completed' ? '2 photos' : '0 photos'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {index < day.stops.length - 1 && <div className="border-b border-slate-100 dark:border-surface-700" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
