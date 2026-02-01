'use client';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'slate' | 'current';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-primary-500',
  white: 'text-white',
  slate: 'text-slate-500',
  current: 'text-current',
};

/**
 * A simple loading spinner component.
 * Use within buttons, cards, or page sections to indicate loading state.
 */
export function Spinner({ size = 'md', color = 'primary', className = '' }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
  );
}

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  blur?: boolean;
  className?: string;
}

/**
 * A full-screen or container loading overlay.
 * Shows a spinner with optional message while content is loading.
 */
export function LoadingOverlay({
  visible,
  message = 'Loading...',
  blur = true,
  className = '',
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-50 ${
        blur ? 'backdrop-blur-sm bg-white/60' : 'bg-white/80'
      } ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm font-medium text-slate-600">{message}</p>
        )}
      </div>
    </div>
  );
}

interface InlineLoaderProps {
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * An inline loading indicator with optional text.
 * Useful for showing loading state within content areas.
 */
export function InlineLoader({ text = 'Loading', size = 'md', className = '' }: InlineLoaderProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Spinner size={size === 'sm' ? 'sm' : 'md'} color="slate" />
      <span className={`text-slate-500 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {text}
      </span>
    </div>
  );
}

interface PageLoaderProps {
  message?: string;
}

/**
 * Full-page loading state.
 * Use when loading initial page content.
 */
export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-slate-500 font-medium">{message}</p>
      </div>
    </div>
  );
}
