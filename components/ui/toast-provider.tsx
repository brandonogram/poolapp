'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastMessage } from './toast';

interface ToastContextType {
  addToast: (message: string, type?: ToastMessage['type']) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Global toast provider component.
 * Wrap your app with this to enable toast notifications anywhere.
 *
 * Usage:
 * ```tsx
 * // In your root layout
 * <ToastProvider>
 *   {children}
 * </ToastProvider>
 *
 * // In any component
 * const toast = useToastContext();
 * toast.success('Customer created successfully');
 * toast.error('Failed to save, please retry');
 * toast.info('Your changes have been saved');
 * ```
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setMessages((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setMessages((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info }}>
      {children}
      <Toast messages={messages} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast functions from anywhere in the app.
 * Must be used within a ToastProvider.
 */
export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
