'use client';

import Link from 'next/link';
import type { TechStop } from '@/lib/tech-context';

const NavigationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

interface StopCardProps {
  stop: TechStop;
  isNext?: boolean;
  showActions?: boolean;
}

export function StopCard({ stop, isNext = false, showActions = true }: StopCardProps) {
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(stop.address)}`;

  if (isNext) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-sm border-2 border-blue-500 dark:border-blue-600 transition-colors">
        {/* Next Stop Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            Next Stop
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">#{stop.order} of route</span>
        </div>

        {/* Customer Name - Large and Bold */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stop.customerName}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{stop.address}</p>

        {/* Gate Code - VERY PROMINENT */}
        <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Gate Code</p>
              <p className="text-3xl font-bold text-amber-900 dark:text-amber-200" aria-label={`Gate code: ${stop.gateCode}`}>{stop.gateCode}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center" aria-hidden="true">
              <svg className="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Special Instructions if any */}
        {stop.specialInstructions && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Special Instructions</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{stop.specialInstructions}</p>
          </div>
        )}

        {/* Pool Info */}
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-5">
          <span className="px-2 py-1 bg-slate-100 dark:bg-surface-700 rounded-lg">
            {stop.poolSize.toLocaleString()} gal
          </span>
          <span className="px-2 py-1 bg-slate-100 dark:bg-surface-700 rounded-lg">
            {stop.poolType}
          </span>
        </div>

        {/* Action Buttons - LARGE for wet hands */}
        {showActions && (
          <div className="grid grid-cols-2 gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-5 bg-slate-100 dark:bg-surface-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-lg active:bg-slate-200 dark:active:bg-surface-600 transition-colors min-h-[60px]"
              aria-label={`Navigate to ${stop.address}`}
            >
              <NavigationIcon className="w-6 h-6" />
              Navigate
            </a>
            <Link
              href={`/tech/stop/${stop.id}`}
              className="flex items-center justify-center gap-2 py-5 bg-blue-600 dark:bg-blue-700 text-white rounded-xl font-semibold text-lg active:bg-blue-700 dark:active:bg-blue-600 transition-colors min-h-[60px]"
            >
              Start Job
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Compact card for upcoming stops
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-surface-700 last:border-0 min-h-[72px]">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-200 dark:bg-surface-600 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300" aria-label={`Stop number ${stop.order}`}>
            {stop.order}
          </span>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{stop.customerName}</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 ml-8">{stop.address}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-surface-700 rounded-lg" aria-label={`Gate code: ${stop.gateCode}`}>
          {stop.gateCode.length > 10 ? stop.gateCode.substring(0, 10) + '...' : stop.gateCode}
        </span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 flex items-center justify-center bg-slate-100 dark:bg-surface-700 rounded-xl text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-surface-600 transition-colors"
          aria-label={`Navigate to ${stop.customerName}`}
        >
          <NavigationIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
