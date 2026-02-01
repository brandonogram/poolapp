'use client';

import Link from 'next/link';
import { useTech } from '@/lib/tech-context';

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BeakerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.628.105a9.002 9.002 0 01-9.014 0l-.628-.105c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

export default function CompletePage() {
  const { route, getCompletedStops } = useTech();
  const completedStops = getCompletedStops();

  // Calculate today's stats
  const totalStops = route.totalStops;
  const completed = completedStops.length;
  const successRate = Math.round((completed / totalStops) * 100);

  // Mock additional stats
  const stats = {
    totalMiles: 42,
    totalTime: '7h 15m',
    chemicalsUsed: {
      chlorine: '12 tabs',
      acid: '24 oz',
      shock: '3 lbs',
    },
    photosCapture: 18,
    issuesReported: 2,
  };

  return (
    <div className="p-4 pb-8">
      {/* Celebration Header */}
      <div className="text-center mb-8 pt-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-14 h-14 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Route Complete!</h1>
        <p className="text-slate-500">{route.date}</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
        <h2 className="font-bold text-slate-900 text-lg mb-4">Day Summary</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{completed}/{totalStops}</p>
            <p className="text-sm text-green-700">Stops Completed</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{successRate}%</p>
            <p className="text-sm text-blue-700">Success Rate</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Total Miles</span>
            </div>
            <span className="font-semibold text-slate-900">{stats.totalMiles} mi</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Time on Route</span>
            </div>
            <span className="font-semibold text-slate-900">{stats.totalTime}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <BeakerIcon className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Photos Taken</span>
            </div>
            <span className="font-semibold text-slate-900">{stats.photosCapture}</span>
          </div>
        </div>
      </div>

      {/* Chemicals Used */}
      <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
        <h2 className="font-bold text-slate-900 text-lg mb-4">Chemicals Used Today</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-amber-700">{stats.chemicalsUsed.chlorine}</p>
            <p className="text-xs text-amber-600">Chlorine</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-purple-700">{stats.chemicalsUsed.acid}</p>
            <p className="text-xs text-purple-600">Muriatic Acid</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-700">{stats.chemicalsUsed.shock}</p>
            <p className="text-xs text-blue-600">Shock</p>
          </div>
        </div>
      </div>

      {/* Issues Reported */}
      {stats.issuesReported > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
          <h3 className="font-semibold text-amber-800 mb-2">Issues Reported</h3>
          <p className="text-sm text-amber-700">
            {stats.issuesReported} equipment issues were flagged and sent to the office for follow-up.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href="/tech/history"
          className="block w-full py-4 bg-blue-600 text-white text-center rounded-xl font-semibold text-lg active:bg-blue-700"
        >
          View Service Details
        </Link>

        <Link
          href="/tech/route"
          className="block w-full py-4 bg-slate-100 text-slate-700 text-center rounded-xl font-semibold text-lg active:bg-slate-200"
        >
          Back to Route
        </Link>
      </div>

      {/* Motivational Message */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Great work today! Safe travels home.
        </p>
      </div>
    </div>
  );
}
