'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

const AccessibilityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM12 12a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0112 12zm-3 0a.75.75 0 01.53.22l1.72 1.72a.75.75 0 11-1.06 1.06l-1.72-1.72A.75.75 0 019 12zm6 0a.75.75 0 00-.53.22l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72A.75.75 0 0015 12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5v2.5m0 0l-3 3m3-3l3 3" />
  </svg>
);

const ContrastIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18a9 9 0 109 9 9 9 0 00-9-9z" />
  </svg>
);

const TextSizeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const MotionIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  id: string;
}

function ToggleSwitch({ checked, onChange, label, description, id }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
          checked ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export function AccessibilitySettings() {
  const { contrastMode, setContrastMode, textSize, setTextSize, reducedMotion, toggleReducedMotion } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  // Trap focus within modal when open
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    panel.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      panel.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        aria-label="Accessibility settings"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <AccessibilityIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Accessibility settings"
            aria-modal="true"
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Accessibility
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                aria-label="Close accessibility settings"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Settings */}
            <div className="px-4 py-2 divide-y divide-slate-100 dark:divide-slate-700">
              {/* High Contrast */}
              <div className="flex items-center gap-3 py-3">
                <ContrastIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <ToggleSwitch
                  id="high-contrast"
                  checked={contrastMode === 'high'}
                  onChange={() => setContrastMode(contrastMode === 'high' ? 'normal' : 'high')}
                  label="High contrast"
                  description="Better for outdoor/sunlight use"
                />
              </div>

              {/* Large Text */}
              <div className="flex items-center gap-3 py-3">
                <TextSizeIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <ToggleSwitch
                  id="large-text"
                  checked={textSize === 'large'}
                  onChange={() => setTextSize(textSize === 'large' ? 'normal' : 'large')}
                  label="Large text"
                  description="Increases text size throughout"
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center gap-3 py-3">
                <MotionIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <ToggleSwitch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onChange={toggleReducedMotion}
                  label="Reduce motion"
                  description="Minimizes animations"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your preferences are saved automatically.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Inline accessibility controls for tech app
export function AccessibilityQuickControls() {
  const { contrastMode, setContrastMode, textSize, setTextSize } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setContrastMode(contrastMode === 'high' ? 'normal' : 'high')}
        className={`p-2 rounded-lg transition-colors ${
          contrastMode === 'high'
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        aria-label={`High contrast mode: ${contrastMode === 'high' ? 'on' : 'off'}`}
        aria-pressed={contrastMode === 'high'}
      >
        <ContrastIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTextSize(textSize === 'large' ? 'normal' : 'large')}
        className={`p-2 rounded-lg transition-colors ${
          textSize === 'large'
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        aria-label={`Large text: ${textSize === 'large' ? 'on' : 'off'}`}
        aria-pressed={textSize === 'large'}
      >
        <span className="text-sm font-bold">Aa</span>
      </button>
    </div>
  );
}
