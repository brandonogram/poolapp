'use client';

import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

/**
 * A reusable skeleton loading component with shimmer/pulse animations.
 * Use this component to show loading placeholders for content.
 */
export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'shimmer',
}: SkeletonProps) {
  const baseClasses = 'bg-slate-200';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton compositions for common UI patterns

interface CardSkeletonProps {
  showAvatar?: boolean;
  lines?: number;
  className?: string;
}

export function CardSkeleton({ showAvatar = false, lines = 3, className = '' }: CardSkeletonProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        {showAvatar && (
          <Skeleton variant="circular" width={40} height={40} />
        )}
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" height={20} width="60%" />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={16}
              width={i === lines - 1 ? '40%' : '100%'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" height={14} width="40%" />
          <Skeleton variant="text" height={36} width="50%" />
          <Skeleton variant="text" height={12} width="60%" />
        </div>
        <Skeleton variant="rounded" width={44} height={44} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton variant="text" height={16} width={i === 0 ? '80%' : '60%'} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <Skeleton variant="text" height={12} width="70%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ListItemSkeleton({ showAvatar = true, className = '' }: { showAvatar?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-4 p-4 ${className}`}>
      {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={16} width="70%" />
        <Skeleton variant="text" height={14} width="40%" />
      </div>
      <Skeleton variant="rounded" width={60} height={24} />
    </div>
  );
}

export function ListSkeleton({ items = 5, showAvatar = true, className = '' }: { items?: number; showAvatar?: boolean; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <ListItemSkeleton key={i} showAvatar={showAvatar} />
      ))}
    </div>
  );
}

export function TechStatusSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="space-y-2">
            <Skeleton variant="text" height={16} width={120} />
            <Skeleton variant="text" height={14} width={80} />
          </div>
        </div>
        <Skeleton variant="rounded" width={100} height={28} />
      </div>
      <Skeleton variant="rounded" height={8} className="mb-4" />
      <div className="p-3 bg-slate-50 rounded-lg mb-4">
        <Skeleton variant="text" height={14} width="70%" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton variant="text" height={10} width="50%" />
          <Skeleton variant="text" height={20} width="60%" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" height={10} width="50%" />
          <Skeleton variant="text" height={20} width="60%" />
        </div>
      </div>
    </div>
  );
}

export function AlertItemSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={8} height={8} className="mt-2" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={18} width="80%" />
          <Skeleton variant="text" height={14} width="60%" />
        </div>
        <Skeleton variant="text" height={14} width={80} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" height={14} width={150} />
        <Skeleton variant="text" height={36} width={200} />
      </div>

      {/* Business health strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Action items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton variant="text" height={24} width={200} />
            <Skeleton variant="text" height={16} width={60} />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <AlertItemSkeleton key={i} />
          ))}
        </div>

        {/* Today panel */}
        <div className="space-y-4">
          <Skeleton variant="text" height={24} width={80} />
          <CardSkeleton lines={4} />
        </div>
      </div>
    </div>
  );
}

export function CalendarSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 ${className}`}>
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" height={20} width={120} />
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={32} height={32} />
          <Skeleton variant="rounded" width={32} height={32} />
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} variant="text" height={14} className="mx-auto" width={24} />
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={40} />
        ))}
      </div>
    </div>
  );
}

export function RouteStopSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg ${className}`}>
      <Skeleton variant="circular" width={32} height={32} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={16} width="60%" />
        <Skeleton variant="text" height={14} width="40%" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton variant="text" height={14} width={50} />
        <Skeleton variant="text" height={12} width={40} />
      </div>
    </div>
  );
}

export function RouteListSkeleton({ stops = 6, className = '' }: { stops?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: stops }).map((_, i) => (
        <RouteStopSkeleton key={i} />
      ))}
    </div>
  );
}

export function InvoiceSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton variant="rounded" width={40} height={40} />
        <div className="space-y-2">
          <Skeleton variant="text" height={16} width={150} />
          <Skeleton variant="text" height={14} width={100} />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton variant="text" height={18} width={70} />
        <Skeleton variant="rounded" width={60} height={22} />
      </div>
    </div>
  );
}

export function InvoiceListSkeleton({ items = 5, className = '' }: { items?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <InvoiceSkeleton key={i} />
      ))}
    </div>
  );
}
