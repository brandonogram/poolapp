'use client';

import { useState } from 'react';

interface ChemistryInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  idealRange?: { min: number; max: number };
}

export function ChemistryInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  idealRange,
}: ChemistryInputProps) {
  const isOutOfRange = idealRange && (value < idealRange.min || value > idealRange.max);

  const decrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(Math.round(newValue * 100) / 100);
  };

  const increment = () => {
    const newValue = Math.min(max, value + step);
    onChange(Math.round(newValue * 100) / 100);
  };

  // Format display value
  const displayValue = step < 1 ? value.toFixed(1) : Math.round(value).toString();

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-slate-700 dark:text-slate-200 font-semibold text-lg">{label}</span>
        {idealRange && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Ideal: {idealRange.min} - {idealRange.max}{unit}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* Large minus button - 80x60 touch target */}
        <button
          onClick={decrement}
          disabled={value <= min}
          className="w-16 h-16 bg-slate-100 dark:bg-surface-700 rounded-xl text-2xl font-bold text-slate-600 dark:text-slate-300
                     active:bg-slate-200 dark:active:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
          aria-label={`Decrease ${label}`}
        >
          -
        </button>

        {/* Value display */}
        <div
          className={`w-20 h-16 flex items-center justify-center rounded-xl font-bold text-2xl
            ${isOutOfRange
              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700'
              : 'bg-white dark:bg-surface-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-surface-600'}`}
          role="status"
          aria-label={`${label} value: ${displayValue}${unit}`}
        >
          {displayValue}
          {unit && <span className="text-sm ml-0.5 text-slate-500 dark:text-slate-400">{unit}</span>}
        </div>

        {/* Large plus button - 80x60 touch target */}
        <button
          onClick={increment}
          disabled={value >= max}
          className="w-16 h-16 bg-slate-100 dark:bg-surface-700 rounded-xl text-2xl font-bold text-slate-600 dark:text-slate-300
                     active:bg-slate-200 dark:active:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

// Pre-configured chemistry inputs
export function PHInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <ChemistryInput
      label="pH"
      value={value}
      onChange={onChange}
      min={6.0}
      max={9.0}
      step={0.1}
      idealRange={{ min: 7.2, max: 7.6 }}
    />
  );
}

export function ChlorineInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <ChemistryInput
      label="Chlorine"
      value={value}
      onChange={onChange}
      min={0}
      max={10}
      step={0.5}
      unit="ppm"
      idealRange={{ min: 1, max: 3 }}
    />
  );
}

export function AlkalinityInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <ChemistryInput
      label="Alkalinity"
      value={value}
      onChange={onChange}
      min={0}
      max={200}
      step={10}
      unit="ppm"
      idealRange={{ min: 80, max: 120 }}
    />
  );
}
