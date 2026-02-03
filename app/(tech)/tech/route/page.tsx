'use client';

import { useTech } from '@/lib/tech-context';
import { getDemoMode } from '@/lib/demo-session';
import { StopCard } from '@/components/tech/StopCard';

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

export default function TechRoutePage() {
  const { route, getCurrentStop, getUpcomingStops, getCompletedStops, isOnline, pendingSync } = useTech();
  const isDemoMode = getDemoMode();

  const currentStop = getCurrentStop();
  const upcomingStops = getUpcomingStops();
  const completedStops = getCompletedStops();
  const progressPercent = (route.completedStops / route.totalStops) * 100;

  // Calculate estimated finish time
  const remainingStops = route.totalStops - route.completedStops;
  const avgTimePerStop = 30; // minutes
  const estimatedMinutesRemaining = remainingStops * avgTimePerStop;
  const finishTime = new Date();
  finishTime.setMinutes(finishTime.getMinutes() + estimatedMinutesRemaining);
  const formattedFinishTime = finishTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="p-4 pb-8">
      {/* Date Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{route.date}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {route.totalStops} stops | ~{route.estimatedHours} hrs | {route.totalMiles} mi
        </p>
        {isDemoMode && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-xs font-semibold text-amber-800 dark:text-amber-200">
            Demo session resets on tab close
          </div>
        )}
        {!isOnline && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-xs font-semibold text-amber-800 dark:text-amber-200">
            Offline mode
          </div>
        )}
        {isOnline && pendingSync > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-xs font-semibold text-blue-800 dark:text-blue-200">
            Syncing {pendingSync} {pendingSync === 1 ? 'entry' : 'entries'}
          </div>
        )}
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-5 shadow-sm transition-colors" role="region" aria-label="Route progress">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">Progress</span>
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {route.completedStops}/{route.totalStops}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-slate-100 dark:bg-surface-700 rounded-full overflow-hidden mb-3" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <ClockIcon className="w-4 h-4" aria-hidden="true" />
            <span>Est. finish: <strong className="text-slate-700 dark:text-slate-200">{formattedFinishTime}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <TruckIcon className="w-4 h-4" aria-hidden="true" />
            <span><strong className="text-slate-700 dark:text-slate-200">{remainingStops}</strong> remaining</span>
          </div>
        </div>
      </div>

      {/* Current/Next Stop - Prominent */}
      {currentStop ? (
        <div className="mb-5">
          <StopCard stop={currentStop} isNext={true} />
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-2xl p-6 mb-5 text-center" role="status">
          <CheckIcon className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">Route Complete!</h2>
          <p className="text-green-700 dark:text-green-300">Great job today. All {route.totalStops} stops done.</p>
        </div>
      )}

      {/* Upcoming Stops */}
      {upcomingStops.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 shadow-sm mb-5 transition-colors">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            Coming Up ({upcomingStops.length} stops)
          </p>
          <div className="divide-y divide-slate-100 dark:divide-surface-700">
            {upcomingStops.slice(0, 4).map((stop) => (
              <StopCard key={stop.id} stop={stop} isNext={false} />
            ))}
          </div>
          {upcomingStops.length > 4 && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
              +{upcomingStops.length - 4} more stops
            </p>
          )}
        </div>
      )}

      {/* Completed Stops (Collapsible) */}
      {completedStops.length > 0 && (
        <details className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm overflow-hidden mb-20 transition-colors">
          <summary className="px-4 py-4 cursor-pointer font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-surface-700 min-h-[56px] transition-colors">
            <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            Completed ({completedStops.length} stops)
          </summary>
          <div className="px-4 pb-4 divide-y divide-slate-100 dark:divide-surface-700">
            {completedStops.map((stop) => (
              <div key={stop.id} className="py-4 flex items-center justify-between opacity-60 min-h-[48px]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{stop.customerName}</span>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Floating Action Button for quick navigation */}
      {currentStop && (
        <a
          href={`/tech/stop/${currentStop.id}`}
          className="fixed bottom-24 right-4 w-16 h-16 bg-blue-600 dark:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white active:bg-blue-700 dark:active:bg-blue-600 active:scale-95 transition-all z-40"
          aria-label="Start current stop"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
        </a>
      )}
    </div>
  );
}
