'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast-provider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper.
 * Includes all context providers that need to be client-side.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
