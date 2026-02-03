'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTech, type ChemistryReading } from '@/lib/tech-context';
import { ChemistryInput } from '@/components/tech/ChemistryInput';
import { TaskChecklist } from '@/components/tech/TaskChecklist';

const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

const NavigationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

// Chemical dosing calculator based on readings and pool size
function calculateDosing(chemistry: ChemistryReading, poolSize: number) {
  const dosing: { chemical: string; amount: string; reason: string }[] = [];

  // pH adjustments
  if (chemistry.pH > 7.6) {
    const ozAcid = Math.round((chemistry.pH - 7.4) * poolSize * 0.0008);
    dosing.push({ chemical: 'Muriatic Acid', amount: `${ozAcid} oz`, reason: 'Lower pH' });
  } else if (chemistry.pH < 7.2) {
    const ozSoda = Math.round((7.4 - chemistry.pH) * poolSize * 0.001);
    dosing.push({ chemical: 'Soda Ash', amount: `${ozSoda} oz`, reason: 'Raise pH' });
  }

  // Chlorine adjustments
  if (chemistry.chlorine < 1) {
    const tabs = Math.ceil((2 - chemistry.chlorine) * poolSize / 10000);
    dosing.push({ chemical: 'Chlorine Tabs', amount: `${tabs} tabs`, reason: 'Raise chlorine' });
  }

  // Alkalinity adjustments
  if (chemistry.alkalinity < 80) {
    const lbsBicarbonate = Math.round((100 - chemistry.alkalinity) * poolSize / 10000 * 0.5);
    dosing.push({ chemical: 'Sodium Bicarbonate', amount: `${lbsBicarbonate} lbs`, reason: 'Raise alkalinity' });
  }

  if (dosing.length === 0) {
    dosing.push({ chemical: 'None needed', amount: '-', reason: 'Chemistry is balanced' });
  }

  return dosing;
}

export default function ServiceEntryPage() {
  const router = useRouter();
  const params = useParams();
  const stopId = params.id as string;

  const { route, completeStop, getCurrentStop, getUpcomingStops, isOnline, pendingSync, skipStop } = useTech();

  // Find the stop
  const stop = route.stops.find(s => s.id === stopId);
  const currentStop = getCurrentStop();
  const nextStops = getUpcomingStops();
  const nextStop = nextStops[0];

  // Chemistry state
  const [chemistry, setChemistry] = useState<ChemistryReading>({
    pH: 7.4,
    chlorine: 1.5,
    alkalinity: 90,
  });

  // Tasks state
  const [tasks, setTasks] = useState({
    skim: false,
    brush: false,
    vacuum: false,
    baskets: false,
    filter: false,
    equipment: false,
  });

  const [chemicalsAdded, setChemicalsAdded] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showTrackerShare, setShowTrackerShare] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  // Redirect if stop not found
  useEffect(() => {
    if (!stop) {
      router.push('/tech/route');
    }
  }, [stop, router]);

  if (!stop) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" role="status" aria-label="Loading" />
      </div>
    );
  }

  const dosing = calculateDosing(chemistry, stop.poolSize);
  const requiredTasks: (keyof typeof tasks)[] = ['skim', 'brush', 'baskets'];
  const allRequiredComplete = requiredTasks.every(task => tasks[task]);

  const toggleTask = (task: keyof typeof tasks) => {
    setTasks(prev => ({ ...prev, [task]: !prev[task] }));
  };

  const handleComplete = () => {
    completeStop(stopId, {
      chemistry,
      tasks,
      chemicalsAdded,
      photos,
      notes,
    });
    router.push('/tech/route');
  };

  const handleQuickComplete = () => {
    const quickTasks = {
      skim: true,
      brush: true,
      vacuum: false,
      baskets: true,
      filter: false,
      equipment: false,
    };
    setTasks(quickTasks);
    completeStop(stopId, {
      chemistry,
      tasks: quickTasks,
      chemicalsAdded,
      photos,
      notes,
    });
    router.push('/tech/route');
  };

  const handleSkip = () => {
    const reason = window.prompt('Why are you skipping this stop?') || '';
    if (!reason.trim()) return;
    skipStop(stopId, reason.trim());
    router.push('/tech/route');
  };

  const handlePhotoCapture = () => {
    // In a real app, this would open the camera
    // For demo, we simulate adding a photo
    const mockPhotoUrl = `photo-${Date.now()}.jpg`;
    setPhotos(prev => [...prev, mockPhotoUrl]);
    setShowPhotoCapture(false);
  };

  const handleSendOnTheWay = () => {
    const etaMinutes = Math.max(6, 18 - (stop.order % 5) * 2);
    const distanceMiles = Math.max(0.8, Number((etaMinutes * 0.35).toFixed(1)));
    const arrivalTime = new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      customer: stop.customerName,
      address: stop.address,
      tech: route.techName,
      eta: String(etaMinutes),
      distance: String(distanceMiles),
      arrival: arrivalTime,
      updated: String(Date.now()),
    });
    const url = `${baseUrl}/track/${stop.id}?${params.toString()}`;
    setShareLink(url);
    setShareCopied(false);
    setShowTrackerShare(true);
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

  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(stop.address)}`;

  return (
    <div className="p-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium py-3 px-4 -ml-4 rounded-xl active:bg-slate-100 dark:active:bg-surface-700 min-h-[48px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
          aria-label="Go back to route"
        >
          <BackIcon className="w-6 h-6" aria-hidden="true" />
          Back
        </button>
        <button
          onClick={handleSkip}
          className="text-sm font-semibold text-amber-700 dark:text-amber-300 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30"
        >
          Skip
        </button>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-4 shadow-sm transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{stop.customerName}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{stop.address}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="px-2 py-1 bg-slate-100 dark:bg-surface-700 rounded-lg">
                {stop.poolSize.toLocaleString()} gal
              </span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-surface-700 rounded-lg">
                {stop.poolType}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center bg-slate-100 dark:bg-surface-700 rounded-xl text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-surface-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
              aria-label={`Navigate to ${stop.address}`}
            >
              <NavigationIcon className="w-7 h-7" aria-hidden="true" />
            </a>
            <button
              onClick={handleSendOnTheWay}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-500 transition-colors"
            >
              Send On The Way
            </button>
          </div>
        </div>

        {/* Gate Code - Still prominent here */}
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl">
          <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase">Gate Code</span>
          <p className="text-xl font-bold text-amber-900 dark:text-amber-200" aria-label={`Gate code: ${stop.gateCode}`}>{stop.gateCode}</p>
        </div>

        {/* Notes if any */}
        {stop.notes && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
            <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold uppercase">Notes</span>
            <p className="text-sm text-blue-900 dark:text-blue-200">{stop.notes}</p>
          </div>
        )}
      </div>

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

      {/* Water Chemistry Section */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-4 shadow-sm transition-colors">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4 4 0 018.302-2.556A5.5 5.5 0 1117 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.72 1.72a.75.75 0 101.06-1.06l-3-3a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v4.59z" clipRule="evenodd" />
          </svg>
          Water Chemistry
        </h2>

        {/* Chemistry Inputs - Large +/- buttons */}
        <div className="space-y-2 divide-y divide-slate-100 dark:divide-surface-700">
          <ChemistryInput
            label="pH"
            value={chemistry.pH}
            onChange={(v) => setChemistry(prev => ({ ...prev, pH: v }))}
            min={6.0}
            max={9.0}
            step={0.1}
            idealRange={{ min: 7.2, max: 7.6 }}
          />
          <ChemistryInput
            label="Chlorine"
            value={chemistry.chlorine}
            onChange={(v) => setChemistry(prev => ({ ...prev, chlorine: v }))}
            min={0}
            max={10}
            step={0.5}
            unit="ppm"
            idealRange={{ min: 1, max: 3 }}
          />
          <ChemistryInput
            label="Alkalinity"
            value={chemistry.alkalinity}
            onChange={(v) => setChemistry(prev => ({ ...prev, alkalinity: v }))}
            min={0}
            max={200}
            step={10}
            unit="ppm"
            idealRange={{ min: 80, max: 120 }}
          />
        </div>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-4 text-sm text-amber-800 dark:text-amber-200">
          You are offline. This service entry will be saved and synced when you&apos;re back online.
        </div>
      )}
      {isOnline && pendingSync > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 mb-4 text-sm text-blue-800 dark:text-blue-200">
          Syncing {pendingSync} saved {pendingSync === 1 ? 'entry' : 'entries'}...
        </div>
      )}

      {/* Recommended Dosing */}
      <div className={`rounded-2xl p-4 mb-4 transition-colors ${dosing[0].chemical === 'None needed' ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700'}`}>
        <h3 className={`font-bold mb-3 flex items-center gap-2 ${dosing[0].chemical === 'None needed' ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Recommended Dosing
        </h3>
        <ul className="space-y-2" aria-label="Chemical dosing recommendations">
          {dosing.map((dose, index) => (
            <li key={index} className={`flex items-center justify-between ${dosing[0].chemical === 'None needed' ? 'text-green-700 dark:text-green-300' : 'text-amber-800 dark:text-amber-200'}`}>
              <span className="font-medium">{dose.chemical}</span>
              <span className="font-bold">{dose.amount}</span>
            </li>
          ))}
        </ul>

        {/* Mark Chemicals Added Button */}
        {dosing[0].chemical !== 'None needed' && (
          <button
            onClick={() => setChemicalsAdded(!chemicalsAdded)}
            className={`mt-4 w-full py-4 rounded-xl font-semibold text-lg transition-all active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              chemicalsAdded
                ? 'bg-green-600 dark:bg-green-700 text-white focus:ring-green-500'
                : 'bg-white dark:bg-surface-800 text-amber-700 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-600 focus:ring-amber-500'
            }`}
            aria-pressed={chemicalsAdded}
          >
            {chemicalsAdded ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Chemicals Added
              </span>
            ) : (
              'Mark Chemicals Added'
            )}
          </button>
        )}
      </div>

      {/* Tasks Checklist */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-4 shadow-sm transition-colors">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Service Tasks
          {!allRequiredComplete && (
            <span className="text-xs text-red-600 dark:text-red-400 font-normal ml-2">(Red dot = required)</span>
          )}
        </h2>
        <TaskChecklist tasks={tasks} onToggle={toggleTask} requiredTasks={requiredTasks} />
        <button
          onClick={handleQuickComplete}
          className="mt-4 w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold active:scale-[0.99] transition-transform"
        >
          Quick Complete (Skim, Brush, Baskets)
        </button>
      </div>

      {/* Photo Section */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-4 shadow-sm transition-colors">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-4 flex items-center gap-2">
          <CameraIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          Photos
        </h2>

        {photos.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2" role="list" aria-label="Attached photos">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="w-20 h-20 bg-slate-200 dark:bg-surface-700 rounded-xl flex-shrink-0 flex items-center justify-center relative"
                role="listitem"
              >
                <CameraIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <button
                  onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                  className="absolute -top-3 -right-3 w-11 h-11 bg-red-500 dark:bg-red-600 rounded-full text-white flex items-center justify-center shadow-md active:bg-red-600 dark:active:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handlePhotoCapture}
          className="w-full py-4 bg-slate-100 dark:bg-surface-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-slate-200 dark:active:bg-surface-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
        >
          <CameraIcon className="w-6 h-6" aria-hidden="true" />
          Add Photo
        </button>
      </div>

      {/* Notes Section */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-6 shadow-sm transition-colors">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-3">
          <label htmlFor="service-notes">Service Notes</label>
        </h2>
        <textarea
          id="service-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this service..."
          className="w-full p-3 bg-slate-50 dark:bg-surface-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-surface-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none resize-none transition-colors"
          rows={3}
        />
      </div>

      {/* Complete Button - Very Large */}
      <button
        onClick={handleComplete}
        disabled={!allRequiredComplete}
        className={`w-full py-6 rounded-2xl font-bold text-xl transition-all active:scale-98 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900 ${
          allRequiredComplete
            ? 'bg-green-600 dark:bg-green-700 text-white active:bg-green-700 dark:active:bg-green-600 focus:ring-green-500'
            : 'bg-slate-300 dark:bg-surface-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
        }`}
        aria-disabled={!allRequiredComplete}
      >
        {allRequiredComplete ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete Stop
          </span>
        ) : (
          'Complete Required Tasks'
        )}
      </button>

      {/* Next Stop Preview */}
      {nextStop && allRequiredComplete && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 transition-colors">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Next Stop</p>
          <p className="font-bold text-blue-900 dark:text-blue-100">{nextStop.customerName}</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">{nextStop.address}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(nextStop.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-xl font-semibold active:bg-blue-700 dark:active:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-blue-900"
            aria-label={`Navigate to ${nextStop.customerName} at ${nextStop.address}`}
          >
            <NavigationIcon className="w-5 h-5" aria-hidden="true" />
            Navigate to Next
          </a>
        </div>
      )}
    </div>
  );
}
