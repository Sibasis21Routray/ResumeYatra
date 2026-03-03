import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

/**
 * Custom hook for leading & trailing edge debouncing
 * Useful for form inputs where you want immediate feedback followed by debounced updates
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 */
export function useDebouncedCallbackWithLeading<
  T extends (...args: any[]) => any
>(callback: T, delay: number = 300): T {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      // Leading edge - execute immediately if no pending timeout
      if (!timeoutRef.current) {
        callbackRef.current(...args);
      }

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for trailing edge
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
      }, delay);
    }) as T,
    [delay]
  );
}

/**
 * Hook to debounce a value and provide a setter that updates the debounced value
 * Useful for form inputs
 */
export function useDebouncedValue<T>(initialValue: T, delay: number = 300) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { value, setValue, debouncedValue };
}
