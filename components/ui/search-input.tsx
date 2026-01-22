'use client';

import { InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, className = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        className="block w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400 transition-colors"
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </div>
  );
}
