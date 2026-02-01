'use client';

import { ReactNode, forwardRef, HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  loading?: boolean;
  className?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    title,
    subtitle,
    action,
    padding = 'md',
    hover = false,
    interactive = false,
    loading = false,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses = 'bg-white rounded-xl border border-slate-200 shadow-sm';
  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300' : '';
  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm'
    : '';

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${hoverClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-semibold text-navy-500">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={`${paddingClasses[padding]} ${loading ? 'relative' : ''}`}>
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-b-xl">
            <svg
              className="animate-spin h-6 w-6 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        {children}
      </div>
    </div>
  );
});

// Animated card variant using framer-motion
interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  index?: number;
}

export function AnimatedCard({
  children,
  title,
  subtitle,
  action,
  padding = 'md',
  hover = true,
  index = 0,
  className = '',
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : undefined}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${hover ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-semibold text-navy-500">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </motion.div>
  );
}

// Card with status indicator
interface StatusCardProps extends CardProps {
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const statusColors = {
  success: 'border-l-green-500',
  warning: 'border-l-amber-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  neutral: 'border-l-slate-400',
};

export function StatusCard({
  status = 'neutral',
  className = '',
  children,
  ...props
}: StatusCardProps) {
  return (
    <Card
      className={`border-l-4 ${statusColors[status]} ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}
