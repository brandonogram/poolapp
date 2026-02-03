'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTech } from '@/lib/tech-context';
import { getDemoMode } from '@/lib/demo-session';
import { StopCard } from '@/components/tech/StopCard';
import { calculateDistance } from '@/lib/realtime/technician-locations';
import { upsertDemoTracking } from '@/lib/realtime/demo-tracking';

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

const BASE_LAT = 33.4484;
const BASE_LNG = -112.074;

export default function TechRoutePage() {
  const { route, getCurrentStop, getUpcomingStops, getCompletedStops, isOnline, pendingSync } = useTech();
  const isDemoMode = getDemoMode();
  const [showTrackerShare, setShowTrackerShare] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [trackingSession, setTrackingSession] = useState<{
    trackerId: string;
    targetLat: number;
    targetLng: number;
    currentLat: number;
    currentLng: number;
    etaMinutes: number;
    distanceMiles: number;
    arrivalTime: string;
  } | null>(null);

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

  const destination = useMemo(() => {
    if (!currentStop) return null;
    const latOffset = (currentStop.order % 6) * 0.012 + 0.01;
    const lngOffset = (currentStop.order % 5) * 0.015 + 0.01;
    return {
      lat: BASE_LAT + latOffset,
      lng: BASE_LNG + lngOffset,
    };
  }, [currentStop]);

  const handleSendOnTheWay = () => {
    if (!currentStop) return;
    const trackerId = `demo-${currentStop.id}-${Date.now()}`;
    const startLat = BASE_LAT + 0.002;
    const startLng = BASE_LNG - 0.002;
    const targetLat = destination?.lat ?? BASE_LAT + 0.02;
    const targetLng = destination?.lng ?? BASE_LNG + 0.02;
    const initialDistance = calculateDistance(startLat, startLng, targetLat, targetLng);
    const etaMinutes = Math.max(4, Math.ceil(initialDistance / 0.35));
    const distanceMiles = Number(initialDistance.toFixed(1));
    const arrivalTime = new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      tracker: trackerId,
    });
    const url = `${baseUrl}/track/${currentStop.id}?${params.toString()}`;
    setShareLink(url);
    setShareCopied(false);
    setShowTrackerShare(true);
    setTrackingSession({
      trackerId,
      targetLat,
      targetLng,
      currentLat: startLat,
      currentLng: startLng,
      etaMinutes,
      distanceMiles,
      arrivalTime,
    });
  };

  const handleCopyShare = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link', err);
    }
  };

  useEffect(() => {
    if (!trackingSession || !currentStop) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let active = true;

    const pushUpdate = async (nextLat: number, nextLng: number, nextDistance: number, nextEta: number) => {
      try {
        await upsertDemoTracking({
          tracker_id: trackingSession.trackerId,
          tech_name: route.techName,
          customer_name: currentStop.customerName,
          address: currentStop.address,
          latitude: nextLat,
          longitude: nextLng,
          eta_minutes: nextEta,
          distance_miles: Number(nextDistance.toFixed(1)),
          arrival_time: trackingSession.arrivalTime,
        });
      } catch (err) {
        console.error('Demo tracking update failed', err);
      }
    };

    const startFallbackLoop = () => {
      intervalId = setInterval(() => {
        if (!active) return;
        setTrackingSession(prev => {
          if (!prev) return prev;
          const step = 0.18;
          const nextLat = prev.currentLat + (prev.targetLat - prev.currentLat) * step;
          const nextLng = prev.currentLng + (prev.targetLng - prev.currentLng) * step;
          const distance = calculateDistance(nextLat, nextLng, prev.targetLat, prev.targetLng);
          const eta = Math.max(1, Math.ceil(distance / 0.35));
          void pushUpdate(nextLat, nextLng, distance, eta);
          return {
            ...prev,
            currentLat: nextLat,
            currentLng: nextLng,
            distanceMiles: distance,
            etaMinutes: eta,
          };
        });
      }, 8000);
    };

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (!active) return;
          const nextLat = pos.coords.latitude;
          const nextLng = pos.coords.longitude;
          const distance = calculateDistance(nextLat, nextLng, trackingSession.targetLat, trackingSession.targetLng);
          const eta = Math.max(1, Math.ceil(distance / 0.35));
          setTrackingSession(prev => prev ? ({
            ...prev,
            currentLat: nextLat,
            currentLng: nextLng,
            distanceMiles: distance,
            etaMinutes: eta,
          }) : prev);
          void pushUpdate(nextLat, nextLng, distance, eta);
        },
        () => {
          startFallbackLoop();
        },
        { enableHighAccuracy: false, maximumAge: 10000, timeout: 8000 }
      );

      return () => {
        active = false;
        navigator.geolocation.clearWatch(watchId);
        if (intervalId) clearInterval(intervalId);
      };
    }

    startFallbackLoop();

    return () => {
      active = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [trackingSession, currentStop, route.techName]);

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
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Current stop</p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{currentStop.customerName}</h2>
            </div>
            <button
              onClick={handleSendOnTheWay}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-500 transition-colors"
            >
              Send On The Way
            </button>
          </div>
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

      {showTrackerShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-surface-800 p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300 font-semibold">On the way</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Share live tracking</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Send this link to the customer so they can see how far away the tech is.
                </p>
              </div>
              <button
                onClick={() => setShowTrackerShare(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close share modal"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 break-all">
              {shareLink}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCopyShare}
                className="flex-1 rounded-xl bg-slate-900 text-white py-2 text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                {shareCopied ? 'Copied' : 'Copy link'}
              </button>
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl border border-slate-200 dark:border-surface-700 text-center py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors"
              >
                Open tracker
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
