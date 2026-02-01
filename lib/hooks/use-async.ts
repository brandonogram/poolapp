'use client';

import { useState, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  resetOnExecute?: boolean;
}

/**
 * Hook for managing async operations with loading and error states.
 *
 * @example
 * ```tsx
 * const { execute, loading, error, data } = useAsync(async (id: string) => {
 *   const response = await fetch(`/api/customers/${id}`);
 *   return response.json();
 * });
 *
 * // Usage with toast context
 * const toast = useToastContext();
 * const { execute, loading } = useAsync(createCustomer, {
 *   onSuccess: () => toast.success('Customer created successfully'),
 *   onError: (error) => toast.error(`Failed to create customer: ${error.message}`),
 * });
 * ```
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { onSuccess, onError, resetOnExecute = true } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Use ref to track if component is mounted
  const mountedRef = useRef(true);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      if (resetOnExecute) {
        setState({ data: null, loading: true, error: null });
      } else {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        const result = await asyncFn(...args);

        if (mountedRef.current) {
          setState({ data: result, loading: false, error: null });
          onSuccess?.(result);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        if (mountedRef.current) {
          setState({ data: null, loading: false, error });
          onError?.(error);
        }

        return null;
      }
    },
    [asyncFn, onSuccess, onError, resetOnExecute]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    execute,
    reset,
    ...state,
    isSuccess: !state.loading && !state.error && state.data !== null,
    isError: !state.loading && state.error !== null,
    isIdle: !state.loading && state.error === null && state.data === null,
  };
}

/**
 * Hook for managing form submission with loading states.
 *
 * @example
 * ```tsx
 * const { submit, isSubmitting, error } = useFormSubmit(async (data) => {
 *   await api.createCustomer(data);
 * }, {
 *   onSuccess: () => {
 *     toast.success('Customer created!');
 *     router.push('/customers');
 *   },
 *   onError: (error) => toast.error(error.message),
 * });
 *
 * <form onSubmit={submit}>
 *   <Button type="submit" loading={isSubmitting}>Save</Button>
 * </form>
 * ```
 */
export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<void>,
  options: UseAsyncOptions = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (e: React.FormEvent<HTMLFormElement> | T) => {
      // If it's a form event, prevent default
      if (e && typeof e === 'object' && 'preventDefault' in e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as T;

        setIsSubmitting(true);
        setError(null);

        try {
          await submitFn(data);
          options.onSuccess?.(data);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          options.onError?.(error);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // Direct data submission
        setIsSubmitting(true);
        setError(null);

        try {
          await submitFn(e as T);
          options.onSuccess?.(e);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          options.onError?.(error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [submitFn, options]
  );

  return { submit, isSubmitting, error };
}

/**
 * Hook for managing optimistic updates with automatic rollback on error.
 *
 * @example
 * ```tsx
 * const { optimisticUpdate, isPending } = useOptimistic(
 *   customers,
 *   async (customer) => await api.deleteCustomer(customer.id),
 *   {
 *     optimisticFn: (customers, deletedCustomer) =>
 *       customers.filter(c => c.id !== deletedCustomer.id),
 *     onError: (error) => toast.error('Failed to delete customer'),
 *   }
 * );
 * ```
 */
export function useOptimistic<T, A>(
  currentValue: T,
  asyncFn: (arg: A) => Promise<void>,
  options: {
    optimisticFn: (current: T, arg: A) => T;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) {
  const [optimisticValue, setOptimisticValue] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);

  const optimisticUpdate = useCallback(
    async (arg: A) => {
      // Apply optimistic update
      const newValue = options.optimisticFn(currentValue, arg);
      setOptimisticValue(newValue);
      setIsPending(true);

      try {
        await asyncFn(arg);
        setOptimisticValue(null);
        options.onSuccess?.();
      } catch (err) {
        // Rollback optimistic update
        setOptimisticValue(null);
        const error = err instanceof Error ? err : new Error(String(err));
        options.onError?.(error);
      } finally {
        setIsPending(false);
      }
    },
    [currentValue, asyncFn, options]
  );

  return {
    value: optimisticValue ?? currentValue,
    optimisticUpdate,
    isPending,
  };
}
