'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TechPrediction } from '@/lib/predictions';

interface AlertBannerProps {
  predictions: TechPrediction[];
}

export default function AlertBanner({ predictions }: AlertBannerProps) {
  const behindTechs = predictions.filter((p) => p.status === 'behind');

  if (behindTechs.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            {/* Warning icon with pulse */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <motion.div
                className="absolute inset-0 rounded-full bg-red-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Alert content */}
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">
                {behindTechs.length === 1
                  ? `${behindTechs[0].technicianName} is running behind`
                  : `${behindTechs.length} technicians running behind`}
              </h3>
              <div className="mt-1 space-y-1">
                {behindTechs.map((tech) => (
                  <p key={tech.technicianId} className="text-sm text-red-700">
                    <span className="font-medium">{tech.technicianName}</span>
                    {' - '}
                    predicted to finish{' '}
                    <span className="font-medium">{tech.minutesBehind} min late</span>
                    {' ('}
                    {tech.totalStops - tech.completedStops} stops remaining)
                  </p>
                ))}
              </div>
            </div>

            {/* Dismiss button */}
            <button className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Action hint */}
          <p className="mt-3 text-xs text-red-600 pl-13">
            SMS notification sent to your phone
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
