'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  stepLabels?: string[];
  className?: string;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  completedSteps,
  stepLabels = ['Hook', 'Account', 'Customers', 'Optimize', 'Welcome'],
  className = '',
}: ProgressBarProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Step indicators */}
      <div className="relative flex justify-between items-center mb-2">
        {/* Background line */}
        <div className="absolute h-1 bg-slate-200 left-0 right-0 top-1/2 -translate-y-1/2 rounded-full" />

        {/* Progress line */}
        <motion.div
          className="absolute h-1 bg-gradient-to-r from-blue-500 to-cyan-400 left-0 top-1/2 -translate-y-1/2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Step dots */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = completedSteps.includes(stepNum);
          const isCurrent = currentStep === stepNum;
          const isPast = stepNum < currentStep;

          return (
            <motion.div
              key={stepNum}
              className="relative z-10"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted || isPast
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-blue-500 text-blue-600'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
                animate={isCurrent ? {
                  boxShadow: [
                    '0 0 0 0 rgba(0, 102, 255, 0.4)',
                    '0 0 0 10px rgba(0, 102, 255, 0)',
                  ],
                } : {}}
                transition={isCurrent ? { duration: 1.5, repeat: Infinity } : {}}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  stepNum
                )}
              </motion.div>

              {/* Step label */}
              {stepLabels[index] && (
                <motion.span
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap transition-colors duration-300 ${
                    isCurrent ? 'text-blue-600 font-medium' : 'text-slate-500'
                  }`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {stepLabels[index]}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for mobile
export function CompactProgressBar({
  currentStep,
  totalSteps,
  className = '',
}: {
  currentStep: number;
  totalSteps: number;
  className?: string;
}) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
