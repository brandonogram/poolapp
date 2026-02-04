'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTech, type ChemistryReading } from '@/lib/tech-context';
import { supabase } from '@/lib/supabase/client';
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

type DosingStep = {
  key: string;
  chemical: string;
  amount: string;
  reason: string;
  wait: string;
  notes?: string;
  order: number;
};

type ChemistryEntry = {
  pH: number | null;
  chlorine: number | null;
  alkalinity: number | null;
  cya: number | null;
  calcium: number | null;
  salt: number | null;
};

const TARGETS = {
  pH: { min: 7.2, max: 7.8, target: 7.5 },
  chlorine: { min: 1, max: 3, target: 2 },
  alkalinity: { min: 80, max: 120, target: 100 },
  cya: { min: 20, max: 50, target: 30 },
  calcium: { min: 200, max: 400, target: 250 },
  salt: { target: 3200 },
};

const MAX_SODA_ASH_OZ_PER_10K = 16;
const MAX_BICARB_LB_PER_10K = 1;

const roundTo = (value: number, decimals = 1) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

const formatAmount = (value: number, unit: string) => `${roundTo(value, 1)} ${unit}`;

// Chemical dosing calculator based on readings and pool size
function calculateDosing(chemistry: ChemistryReading, poolSize: number, poolType: string) {
  const dosing: DosingStep[] = [];
  const factor = poolSize / 10000;

  const needsAlkRaise = chemistry.alkalinity < TARGETS.alkalinity.min;
  const needsPhRaise = chemistry.pH < TARGETS.pH.min;

  // Total Alkalinity (raise only)
  if (needsAlkRaise) {
    const delta = TARGETS.alkalinity.target - chemistry.alkalinity;
    const lbsBicarbonateRaw = (delta / 10) * 1.25 * factor;
    const maxBicarb = MAX_BICARB_LB_PER_10K * factor;
    const lbsBicarbonate = Math.min(lbsBicarbonateRaw, maxBicarb);
    dosing.push({
      key: 'alkalinity',
      chemical: 'Sodium Bicarbonate',
      amount: formatAmount(lbsBicarbonate, 'lb'),
      reason: 'Raise total alkalinity',
      wait: 'Circulate 6-8 hours, then retest',
      notes: lbsBicarbonateRaw > maxBicarb ? 'Split dose. Do not add more than 1 lb per 10,000 gal at one time.' : undefined,
      order: 10,
    });
  }

  // pH adjustments
  if (chemistry.pH > TARGETS.pH.max) {
    const delta = chemistry.pH - TARGETS.pH.target;
    const ozAcid = (delta / 0.2) * 16 * factor;
    dosing.push({
      key: 'ph-low',
      chemical: 'Muriatic Acid (31.45%)',
      amount: formatAmount(ozAcid, 'fl oz'),
      reason: 'Lower pH',
      wait: 'Circulate 4-6 hours, then retest',
      notes: 'Allow at least 1 hour between acid and chlorine additions.',
      order: 20,
    });
  } else if (needsPhRaise) {
    const delta = TARGETS.pH.target - chemistry.pH;
    const ozSodaRaw = (delta / 0.2) * 6 * factor;
    const maxOz = MAX_SODA_ASH_OZ_PER_10K * factor;
    const ozSoda = Math.min(ozSodaRaw, maxOz);
    dosing.push({
      key: 'ph-high',
      chemical: 'Soda Ash (pH Up)',
      amount: formatAmount(ozSoda, 'oz'),
      reason: 'Raise pH',
      wait: 'Circulate 4-6 hours, then retest',
      notes: ozSodaRaw > maxOz ? 'Split dose. Do not add more than 1 lb per 10,000 gal at once.' : undefined,
      order: 20,
    });
  }

  // Calcium hardness (raise only)
  if (chemistry.calcium !== undefined && chemistry.calcium < TARGETS.calcium.min) {
    const delta = TARGETS.calcium.target - chemistry.calcium;
    const lbsCalcium = (delta / 10) * 1.25 * factor;
    dosing.push({
      key: 'calcium',
      chemical: 'Calcium Chloride',
      amount: formatAmount(lbsCalcium, 'lb'),
      reason: 'Raise calcium hardness',
      wait: 'Circulate a couple of hours, then retest',
      notes: needsAlkRaise || needsPhRaise ? 'Do not add the same day as pH or alkalinity increaser.' : undefined,
      order: 30,
    });
  }

  // Chlorine (liquid 12%)
  if (chemistry.chlorine < TARGETS.chlorine.min) {
    const delta = TARGETS.chlorine.target - chemistry.chlorine;
    const ozLiquidChlorine = delta * 10 * factor;
    dosing.push({
      key: 'chlorine',
      chemical: 'Liquid Chlorine (12%)',
      amount: formatAmount(ozLiquidChlorine, 'fl oz'),
      reason: 'Raise free chlorine',
      wait: 'Circulate, then retest per label. Keep 1 hour between acid and chlorine.',
      notes: 'If using a different strength, adjust dose.',
      order: 40,
    });
  }

  // Stabilizer (CYA)
  if (chemistry.cya !== undefined && chemistry.cya < TARGETS.cya.min) {
    const delta = TARGETS.cya.target - chemistry.cya;
    const lbsCya = (delta / 10) * 1 * factor;
    dosing.push({
      key: 'cya',
      chemical: 'Cyanuric Acid (Stabilizer)',
      amount: formatAmount(lbsCya, 'lb'),
      reason: 'Raise stabilizer (CYA)',
      wait: 'Do not backwash for 48 hours; allow time to dissolve before retesting',
      notes: 'Adjust pH and chlorine before adding stabilizer.',
      order: 50,
    });
  }

  // Salt (salt pools only)
  if (poolType === 'Saltwater' && chemistry.salt !== undefined && chemistry.salt < TARGETS.salt.target) {
    const delta = TARGETS.salt.target - chemistry.salt;
    const lbsSalt = delta * poolSize * 0.00000834;
    dosing.push({
      key: 'salt',
      chemical: 'Pool Salt',
      amount: formatAmount(lbsSalt, 'lb'),
      reason: 'Raise salt level',
      wait: 'Circulate 24 hours before turning on the salt system',
      notes: 'Target salt varies by cell. Verify equipment manual.',
      order: 60,
    });
  }

  if (dosing.length === 0) {
    dosing.push({
      key: 'none',
      chemical: 'None needed',
      amount: '-',
      reason: 'Chemistry is balanced',
      wait: '',
      order: 0,
    });
  }

  return dosing.sort((a, b) => a.order - b.order);
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
  const [chemistry, setChemistry] = useState<ChemistryEntry>({
    pH: null,
    chlorine: null,
    alkalinity: null,
    cya: null,
    calcium: null,
    salt: null,
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
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [photoRequirements, setPhotoRequirements] = useState<Record<keyof typeof tasks, boolean>>({
    skim: true,
    brush: true,
    vacuum: true,
    baskets: true,
    filter: true,
    equipment: true,
  });

  // Redirect if stop not found
  useEffect(() => {
    if (!stop) {
      router.push('/tech/route');
    }
  }, [stop, router]);

  useEffect(() => {
    let active = true;

    const loadRequirements = async () => {
      try {
        const { data, error } = await supabase
          .from('photo_requirements')
          .select('task_key, required');
        if (error || !data) {
          if (error) console.error('Failed to load photo requirements', error);
          return;
        }
        if (!active) return;
        const next: Record<keyof typeof tasks, boolean> = {
          skim: true,
          brush: true,
          vacuum: true,
          baskets: true,
          filter: true,
          equipment: true,
        };
        data.forEach((row: { task_key: string; required: boolean }) => {
          if (row.task_key in next) {
            next[row.task_key as keyof typeof tasks] = row.required;
          }
        });
        setPhotoRequirements(next);
      } catch (err) {
        console.error('Failed to load photo requirements', err);
      }
    };

    void loadRequirements();

    return () => {
      active = false;
    };
  }, []);

  if (!stop) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" role="status" aria-label="Loading" />
      </div>
    );
  }

  const requiredFields: (keyof ChemistryEntry)[] = [
    'pH',
    'chlorine',
    'alkalinity',
    'cya',
    'calcium',
  ];
  if (stop.poolType === 'Saltwater') requiredFields.push('salt');

  const chemistryComplete = requiredFields.every((field) => chemistry[field] !== null);

  const dosing = chemistryComplete
    ? calculateDosing(chemistry as ChemistryReading, stop.poolSize, stop.poolType)
    : [
        {
          key: 'incomplete',
          chemical: 'Enter all readings',
          amount: '-',
          reason: 'Complete the test to see dosing',
          wait: '',
          order: 0,
        },
      ];
  const requiredTasks: (keyof typeof tasks)[] = ['skim', 'brush', 'baskets'];
  const photoRequiredTasks: (keyof typeof tasks)[] = (Object.keys(tasks) as (keyof typeof tasks)[])
    .filter(task => photoRequirements[task]);
  const allRequiredComplete = requiredTasks.every(task => tasks[task]);
  const photoRequired = photoRequiredTasks.some(task => tasks[task]);
  const hasRequiredPhoto = !photoRequired || photos.length > 0;

  const toggleTask = (task: keyof typeof tasks) => {
    setTasks(prev => ({ ...prev, [task]: !prev[task] }));
  };

  const handleComplete = () => {
    completeStop(stopId, {
      chemistry: chemistry as ChemistryReading,
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
      chemistry: chemistry as ChemistryReading,
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
    photoInputRef.current?.click();
  };

  const handlePhotoSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPhotos(prev => [...prev, objectUrl]);
    setShowPhotoCapture(false);
    event.target.value = '';
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
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 flex items-center justify-center bg-slate-100 dark:bg-surface-700 rounded-xl text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-surface-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
            aria-label={`Navigate to ${stop.address}`}
          >
            <NavigationIcon className="w-7 h-7" aria-hidden="true" />
          </a>
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

      {/* Water Chemistry Section */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-4 shadow-sm transition-colors">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4 4 0 018.302-2.556A5.5 5.5 0 1117 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.72 1.72a.75.75 0 101.06-1.06l-3-3a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v4.59z" clipRule="evenodd" />
          </svg>
          Water Chemistry
        </h2>

        <div className="mb-4 rounded-xl border border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-900/30 p-3 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Basic test steps</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Collect a sample about 18 inches below the surface, away from return lines.</li>
            <li>Test before adding chemicals.</li>
            <li>Add one chemical at a time and allow circulation before adding another.</li>
            <li>Adjust total alkalinity before pH for more stable results.</li>
          </ol>
        </div>

        {!chemistryComplete && (
          <div className="mb-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 p-3 text-xs text-amber-800 dark:text-amber-200">
            Tap each reading to enter a value. Chemistry must be completed before you can finish the stop.
          </div>
        )}

        {/* Chemistry Inputs - Large +/- buttons */}
        <div className="space-y-2 divide-y divide-slate-100 dark:divide-surface-700">
          <ChemistryInput
            label="pH"
            value={chemistry.pH}
            onChange={(v) => setChemistry(prev => ({ ...prev, pH: v }))}
            min={6.0}
            max={9.0}
            step={0.1}
            idealRange={{ min: 7.2, max: 7.8 }}
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
          <ChemistryInput
            label="CYA (Stabilizer)"
            value={chemistry.cya}
            onChange={(v) => setChemistry(prev => ({ ...prev, cya: v }))}
            min={0}
            max={100}
            step={10}
            unit="ppm"
            idealRange={{ min: 20, max: 50 }}
          />
          <ChemistryInput
            label="Calcium Hardness"
            value={chemistry.calcium}
            onChange={(v) => setChemistry(prev => ({ ...prev, calcium: v }))}
            min={0}
            max={600}
            step={10}
            unit="ppm"
            idealRange={{ min: 200, max: 400 }}
          />
          {stop.poolType === 'Saltwater' && (
            <ChemistryInput
              label="Salt"
              value={chemistry.salt}
              onChange={(v) => setChemistry(prev => ({ ...prev, salt: v }))}
              min={0}
              max={5000}
              step={100}
              unit="ppm"
              idealRange={{ min: 2700, max: 3400 }}
            />
          )}
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
          Recommended Dosing (Order + Wait Time)
        </h3>
        <ul className="space-y-2" aria-label="Chemical dosing recommendations">
          {dosing.map((dose, index) => (
            <li
              key={dose.key}
              className={`rounded-xl border p-3 ${dosing[0].chemical === 'None needed' ? 'border-green-200 dark:border-green-700 text-green-700 dark:text-green-300' : 'border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200'}`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{dose.chemical === 'None needed' ? dose.chemical : `Step ${index + 1}: ${dose.chemical}`}</span>
                <span className="font-bold">{dose.amount}</span>
              </div>
              {dose.chemical !== 'None needed' && (
                <div className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  <div>{dose.reason}</div>
                  {dose.wait && <div>Wait: {dose.wait}</div>}
                  {dose.notes && <div>Note: {dose.notes}</div>}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Mark Chemicals Added Button */}
        {dosing[0].chemical !== 'None needed' && dosing[0].chemical !== 'Enter all readings' && (
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
        {photoRequired && !hasRequiredPhoto && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Photo required for any completed task before finishing.
          </div>
        )}
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

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelected}
          aria-hidden="true"
        />
        <button
          onClick={handlePhotoCapture}
          className="w-full py-4 bg-slate-100 dark:bg-surface-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-slate-200 dark:active:bg-surface-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
        >
          <CameraIcon className="w-6 h-6" aria-hidden="true" />
          Take Photo
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
        disabled={!allRequiredComplete || !hasRequiredPhoto || !chemistryComplete}
        className={`w-full py-6 rounded-2xl font-bold text-xl transition-all active:scale-98 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900 ${
          allRequiredComplete && hasRequiredPhoto && chemistryComplete
            ? 'bg-green-600 dark:bg-green-700 text-white active:bg-green-700 dark:active:bg-green-600 focus:ring-green-500'
            : 'bg-slate-300 dark:bg-surface-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
        }`}
        aria-disabled={!allRequiredComplete || !hasRequiredPhoto || !chemistryComplete}
      >
        {allRequiredComplete && hasRequiredPhoto && chemistryComplete ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete Stop
          </span>
        ) : (
          photoRequired && !hasRequiredPhoto
            ? 'Photo Required'
            : !chemistryComplete
              ? 'Complete Chemistry'
              : 'Complete Required Tasks'
        )}
      </button>

      {/* Next Stop Preview */}
      {nextStop && allRequiredComplete && chemistryComplete && (
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
