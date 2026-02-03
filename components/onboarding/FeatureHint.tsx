'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDemoStorage } from '@/lib/demo-session';

interface FeatureHintProps {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  showOnce?: boolean;
  delay?: number;
}

export default function FeatureHint({
  id,
  title,
  description,
  position = 'bottom',
  children,
  showOnce = true,
  delay = 500,
}: FeatureHintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storageKey = `poolapp-hint-${id}`;
    const storage = getDemoStorage();
    const seen = storage?.getItem(storageKey);

    if (seen === 'true' && showOnce) {
      setHasBeenSeen(true);
      return;
    }

    setHasBeenSeen(false);

    // Show hint after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [id, showOnce, delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      const storage = getDemoStorage();
      storage?.setItem(`poolapp-hint-${id}`, 'true');
      setHasBeenSeen(true);
    }
  };

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Arrow classes
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-blue-600 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-blue-600 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-blue-600 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-blue-600 border-t-transparent border-b-transparent border-l-transparent',
  };

  if (hasBeenSeen) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            {/* Hint Box */}
            <div className="bg-blue-600 rounded-xl p-4 shadow-lg shadow-blue-500/30 max-w-xs">
              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`}
              />

              {/* Content */}
              <div className="relative">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-white">{title}</h4>
                  <button
                    onClick={handleDismiss}
                    className="p-1 text-blue-200 hover:text-white hover:bg-blue-500 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-blue-100 text-sm">{description}</p>
                <button
                  onClick={handleDismiss}
                  className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility hook for programmatically controlling hints
export function useFeatureHints() {
  const markHintSeen = (id: string) => {
    const storage = getDemoStorage();
    storage?.setItem(`poolapp-hint-${id}`, 'true');
  };

  const resetHint = (id: string) => {
    const storage = getDemoStorage();
    storage?.removeItem(`poolapp-hint-${id}`);
  };

  const resetAllHints = () => {
    const storage = getDemoStorage();
    if (!storage) return;
    const keys = Object.keys(storage).filter(k => k.startsWith('poolapp-hint-'));
    keys.forEach(k => storage.removeItem(k));
  };

  const hasSeenHint = (id: string): boolean => {
    const storage = getDemoStorage();
    return storage?.getItem(`poolapp-hint-${id}`) === 'true';
  };

  return {
    markHintSeen,
    resetHint,
    resetAllHints,
    hasSeenHint,
  };
}
