'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type TaskKey = 'skim' | 'brush' | 'vacuum' | 'baskets' | 'filter' | 'equipment';

const TASKS: { key: TaskKey; label: string; description: string }[] = [
  { key: 'skim', label: 'Skim', description: 'Surface debris removal' },
  { key: 'brush', label: 'Brush', description: 'Walls and steps' },
  { key: 'vacuum', label: 'Vacuum', description: 'Floor and deep clean' },
  { key: 'baskets', label: 'Baskets', description: 'Skimmer and pump baskets' },
  { key: 'filter', label: 'Filter', description: 'Filter inspection or backwash' },
  { key: 'equipment', label: 'Equip Check', description: 'Pump/heater/valves inspection' },
];

type RequirementRow = {
  task_key: TaskKey;
  required: boolean;
  updated_at?: string;
};

const DEFAULT_REQUIREMENTS: Record<TaskKey, boolean> = {
  skim: true,
  brush: true,
  vacuum: true,
  baskets: true,
  filter: true,
  equipment: true,
};

export default function AdminPage() {
  const [requirements, setRequirements] = useState<Record<TaskKey, boolean>>(DEFAULT_REQUIREMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedTasks = useMemo(() => TASKS, []);

  useEffect(() => {
    let active = true;

    const loadRequirements = async () => {
      try {
        const client = supabase as unknown as { from: (t: string) => { select: (c: string) => Promise<{ data: RequirementRow[] | null; error: unknown }> } };
        const { data, error } = await client
          .from('photo_requirements')
          .select('task_key, required');
        if (error) {
          console.error('Failed to load photo requirements', error);
          if (active) setError('Unable to load requirements. Using defaults.');
          return;
        }
        if (!data || !active) return;
        const next = { ...DEFAULT_REQUIREMENTS };
        data.forEach((row: RequirementRow) => {
          next[row.task_key] = row.required;
        });
        setRequirements(next);
      } catch (err) {
        console.error('Failed to load photo requirements', err);
        if (active) setError('Unable to load requirements. Using defaults.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadRequirements();

    return () => {
      active = false;
    };
  }, []);

  const toggleRequirement = async (taskKey: TaskKey) => {
    const nextValue = !requirements[taskKey];
    setRequirements(prev => ({ ...prev, [taskKey]: nextValue }));
    setIsSaving(true);
    setError(null);

    try {
      const client = supabase as unknown as { from: (t: string) => { upsert: (d: object) => Promise<{ error: unknown }> } };
      const { error } = await client
        .from('photo_requirements')
        .upsert({
          task_key: taskKey,
          required: nextValue,
          updated_at: new Date().toISOString(),
        });
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Failed to update requirement', err);
      setError('Failed to save. Please try again.');
      setRequirements(prev => ({ ...prev, [taskKey]: !nextValue }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Admin</p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-2">Operations Control Center</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Adjust the core operational settings that govern how techs work in the field.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Photo Requirements</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Require a photo for each completed task.
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isSaving ? 'Saving…' : 'Auto‑saved'}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {sortedTasks.map(task => (
            <button
              key={task.key}
              onClick={() => toggleRequirement(task.key)}
              disabled={isSaving || isLoading}
              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
                requirements[task.key]
                  ? 'border-blue-200 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-600 dark:border-surface-700 dark:bg-surface-900/40 dark:text-slate-300'
              } ${isSaving ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-300'}`}
              aria-pressed={requirements[task.key]}
            >
              <div>
                <p className="text-sm font-semibold">{task.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
              </div>
              <span
                className={`inline-flex h-6 w-10 items-center rounded-full border px-1 transition ${
                  requirements[task.key] ? 'border-blue-400 bg-blue-100' : 'border-slate-300 bg-slate-100'
                }`}
                aria-hidden="true"
              >
                <span
                  className={`h-4 w-4 rounded-full transition ${
                    requirements[task.key] ? 'translate-x-4 bg-blue-600' : 'translate-x-0 bg-slate-400'
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Coming Soon</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Additional admin controls will live here (notification templates, service defaults, compliance checks).
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-slate-100 dark:bg-surface-700 px-3 py-1">Notification Templates</span>
          <span className="rounded-full bg-slate-100 dark:bg-surface-700 px-3 py-1">Route Rules</span>
          <span className="rounded-full bg-slate-100 dark:bg-surface-700 px-3 py-1">Service Defaults</span>
          <span className="rounded-full bg-slate-100 dark:bg-surface-700 px-3 py-1">Compliance Flags</span>
        </div>
      </section>
    </div>
  );
}
