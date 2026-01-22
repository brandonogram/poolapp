'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  sublabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const bgColorClasses = {
  primary: 'bg-primary-100',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  danger: 'bg-red-100',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max,
  label,
  sublabel,
  color = 'primary',
  size = 'md',
  showValue = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-slate-500">
              {value}/{max}
              {sublabel && <span className="text-slate-400 ml-1">{sublabel}</span>}
            </span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full ${bgColorClasses[color]} ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
