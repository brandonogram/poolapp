'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TechPrediction, formatTime, getStatusColors } from '@/lib/predictions';

interface TechStatusCardProps {
  prediction: TechPrediction;
  index?: number;
}

export default function TechStatusCard({ prediction, index = 0 }: TechStatusCardProps) {
  const colors = getStatusColors(prediction.status);
  const progress = (prediction.completedStops / prediction.totalStops) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white border rounded-xl p-5 transition-all ${colors.border} ${
        prediction.status === 'behind' ? 'ring-2 ring-red-200' : ''
      }`}
    >
      {/* Pulse animation for behind status */}
      {prediction.status === 'behind' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-red-500 opacity-0"
          animate={{ opacity: [0, 0.05, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative">
        {/* Header: Tech name and status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: prediction.technicianColor }}
            >
              {prediction.technicianName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {prediction.technicianName}
              </h3>
              <p className="text-sm text-slate-500">
                {prediction.completedStops} of {prediction.totalStops} stops
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg}`}
          >
            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
            <span className={`text-sm font-medium ${colors.text}`}>
              {prediction.status === 'on-track' && 'On Track'}
              {prediction.status === 'at-risk' && 'At Risk'}
              {prediction.status === 'behind' && `${prediction.minutesBehind}m Behind`}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: prediction.technicianColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            />
          </div>
        </div>

        {/* Current location */}
        {prediction.currentStop && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-lg">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm text-slate-600">
              At: <span className="font-medium">{prediction.currentStop}</span>
            </span>
          </div>
        )}

        {/* Time predictions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Scheduled
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {formatTime(prediction.scheduledFinish)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Predicted
            </p>
            <p
              className={`text-lg font-semibold ${
                prediction.status === 'behind'
                  ? 'text-red-600'
                  : prediction.status === 'at-risk'
                  ? 'text-amber-600'
                  : 'text-slate-900'
              }`}
            >
              {formatTime(prediction.predictedFinish)}
            </p>
          </div>
        </div>

        {/* View route link */}
        <Link
          href="/routes"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          View route details
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
