'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateDistance } from '@/lib/realtime/technician-locations';
import { fetchDemoTracking, subscribeDemoTracking, type DemoTrackingRow } from '@/lib/realtime/demo-tracking';

const formatUpdated = (timestamp: number) => {
  const deltaMs = Date.now() - timestamp;
  if (Number.isNaN(deltaMs) || deltaMs < 0) return 'just now';
  const minutes = Math.floor(deltaMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 min ago';
  return `${minutes} mins ago`;
};

export default function TrackPage() {
  const searchParams = useSearchParams();
  const trackerId = searchParams.get('tracker');
  const [trackerData, setTrackerData] = useState<DemoTrackingRow | null>(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  useEffect(() => {
    if (!trackerId) return;
    let unsubscribe: (() => void) | null = null;
    let active = true;

    const load = async () => {
      try {
        const initial = await fetchDemoTracking(trackerId);
        if (!active) return;
        if (initial) {
          setTrackerData(initial);
          setLastUpdated(Date.parse(initial.updated_at));
        }
        unsubscribe = subscribeDemoTracking(trackerId, (row) => {
          setTrackerData(row);
          setLastUpdated(Date.parse(row.updated_at));
        });
      } catch (err) {
        console.error('Failed to load tracker data', err);
      }
    };

    void load();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [trackerId]);

  const customer = trackerData?.customer_name ?? 'Pool Customer';
  const tech = trackerData?.tech_name ?? 'PoolOps Tech';
  const address = trackerData?.address ?? 'Phoenix, AZ';
  const arrival = trackerData?.arrival_time ?? 'Soon';
  const etaMinutes = trackerData?.eta_minutes ?? 12;
  const distanceMiles = trackerData?.distance_miles ?? 3.5;
  const currentLat = trackerData?.latitude;
  const currentLng = trackerData?.longitude;

  const progress = useMemo(() => {
    if (!trackerData || !currentLat || !currentLng) return 0.25;
    const baseLat = currentLat - 0.02;
    const baseLng = currentLng - 0.02;
    const totalDistance = calculateDistance(baseLat, baseLng, currentLat + 0.02, currentLng + 0.02);
    if (totalDistance <= 0) return 1;
    const traveled = totalDistance - Math.max(0, distanceMiles);
    return Math.min(1, Math.max(0.1, traveled / totalDistance));
  }, [trackerData, currentLat, currentLng, distanceMiles]);

  const techX = 10 + progress * 70;
  const customerX = 85;
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="px-6 py-10 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">PoolOps Live Tracker</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold">{tech} is on the way</h1>
            <p className="mt-2 text-white/60 text-sm">Heading to {customer}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-xs text-white/50">ETA</p>
            <p className="text-xl font-semibold">{etaMinutes} min</p>
            <p className="text-xs text-white/60">{distanceMiles.toFixed(1)} mi away</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-6 shadow-xl">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Live location</span>
            <span>Updated {formatUpdated(lastUpdated)}</span>
          </div>

          <div className="mt-6 relative h-56 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.2),_transparent_50%)] border border-white/10 overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-white/10 rounded-full">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${Math.max(8, progress * 100)}%` }} />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center text-xs"
              style={{ left: `${techX}%` }}
            >
              <span className="inline-flex h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.9)]" />
              <span className="mt-1 text-blue-200">Tech</span>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center text-xs"
              style={{ left: `${customerX}%` }}
            >
              <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.9)]" />
              <span className="mt-1 text-emerald-200">Home</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/50 text-xs uppercase">Arrival</p>
              <p className="mt-1 text-lg font-semibold">{arrival}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
              <p className="text-white/50 text-xs uppercase">Address</p>
              <p className="mt-1 text-sm text-white/80">{address}</p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-white text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
