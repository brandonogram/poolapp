'use client';

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm active:bg-primary-700',
  secondary: 'bg-navy-500 text-white hover:bg-navy-600 focus:ring-navy-500 shadow-sm active:bg-navy-700',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 active:bg-slate-100',
  ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500 active:bg-slate-200',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm active:bg-red-700',
  success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm active:bg-green-700',
};

const sizeClasses = {
  xs: 'px-2 py-1 text-xs min-h-[32px]',
  sm: 'px-4 py-2.5 text-sm min-h-[44px]',
  md: 'px-5 py-3 text-sm min-h-[44px]',
  lg: 'px-6 py-3.5 text-base min-h-[48px]',
};

const spinnerSizes = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    loadingText,
    fullWidth = false,
    disabled,
    className = '',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98] disabled:active:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className={`animate-spin ${spinnerSizes[size]}`}
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
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText && <span>{loadingText}</span>}
          {!loadingText && <span className="sr-only">Loading</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  );
});

// Icon button variant for actions like delete, edit, etc.
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const iconButtonSizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    label,
    variant = 'ghost',
    size = 'md',
    loading = false,
    disabled,
    className = '',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center rounded-lg
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95 disabled:active:scale-100
        ${variantClasses[variant]}
        ${iconButtonSizes[size]}
        ${className}
      `}
      disabled={isDisabled}
      aria-label={label}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <svg
          className={`animate-spin ${spinnerSizes[size]}`}
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
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon
      )}
    </button>
  );
});
