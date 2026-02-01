'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import { Job, formatTime } from '@/lib/schedule-context';
import { getTechColors, useTechnicians } from '@/lib/technicians-context';

// Re-export techColors for backward compatibility
export const techColors: Record<string, { bg: string; border: string; text: string; light: string }> = {
  'tech-1': { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-700', light: 'bg-blue-50' },
  'tech-2': { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-700', light: 'bg-emerald-50' },
  'tech-3': { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-700', light: 'bg-amber-50' },
};

interface JobCardProps {
  job: Job;
  compact?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent, jobId: string) => void;
  isDragging?: boolean;
}

export function JobCard({
  job,
  compact = false,
  onClick,
  onDragStart,
  isDragging,
}: JobCardProps) {
  const { getTechnicianById } = useTechnicians();
  const tech = getTechnicianById(job.technicianId);
  const colors = tech ? getTechColors(tech.color) : techColors['tech-1'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.95 : 1,
        y: 0
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart?.(e as unknown as React.DragEvent, job.id)}
      onClick={onClick}
      className={`
        group relative p-2.5 rounded-lg border-l-3 cursor-pointer
        bg-white border border-slate-200 hover:border-slate-300
        transition-all duration-150
        ${colors.border} border-l-[3px]
        ${job.status === 'cancelled' ? 'opacity-50' : ''}
        ${onDragStart ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-slate-800 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {job.customerName}
          </p>
          {!compact && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{job.address}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-medium ${colors.text}`}>{formatTime(job.time)}</span>
          {job.status === 'completed' && (
            <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          {job.status === 'in-progress' && (
            <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </span>
          )}
          {job.status === 'cancelled' && (
            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )}
        </div>
      </div>
      {!compact && (
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" size="sm">{job.serviceType}</Badge>
          <span className="text-xs text-slate-400">{job.duration}min</span>
          <span className="text-xs text-slate-400 ml-auto">${job.rate}</span>
        </div>
      )}

      {/* Drag handle indicator */}
      {onDragStart && (
        <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>
      )}

      {/* Click indicator */}
      {onClick && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
