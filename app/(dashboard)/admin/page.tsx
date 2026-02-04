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
        const { data, error } = await supabase
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
      const { error } = await supabase
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

      <section className="rounded-2xl border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Photo Requirements</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Toggle which service tasks require a photo before a tech can complete a stop.
          </p>
        </div>
        <div className="grid gap-4">
          {sortedTasks.map(task => (
            <div
              key={task.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-900/40 p-4"
            >
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{task.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
              </div>
              <button
                onClick={() => toggleRequirement(task.key)}
                disabled={isSaving || isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  requirements[task.key] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-surface-600'
                } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                aria-pressed={requirements[task.key]}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    requirements[task.key] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {isSaving ? 'Saving changes…' : 'Changes save instantly.'}
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
