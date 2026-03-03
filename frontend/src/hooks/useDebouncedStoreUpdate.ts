import { useCallback, useRef, useEffect } from "react";

/**
 * Hook for debounced store updates
 * Updates store after a delay, but allows immediate local updates
 *
 * @param updateStore - The function to call for updating the store
 * @param delay - Debounce delay in milliseconds (default: 300)
 */
export function useDebouncedStoreUpdate<T>(
  updateStore: (data: T) => void,
  delay: number = 300
) {
  const pendingDataRef = useRef<T | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const latestDataRef = useRef<T | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && pendingDataRef.current !== null) {
      clearTimeout(timeoutRef.current);
      updateStore(pendingDataRef.current);
      pendingDataRef.current = null;
      timeoutRef.current = null;
    }
  }, [updateStore]);

  const update = useCallback(
    (data: T) => {
      // Store the latest data
      latestDataRef.current = data;

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set up new timeout
      timeoutRef.current = window.setTimeout(() => {
        if (latestDataRef.current !== null) {
          updateStore(latestDataRef.current);
          pendingDataRef.current = null;
          timeoutRef.current = null;
        }
      }, delay);
    },
    [updateStore, delay]
  );

  return { update, flush, cancel: flush };
}

/**
 * Simple debounce utility for functions
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
  };
}

/**
 * Debounce a value - useful for form inputs
 */
export function useSimpleDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

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

// Need to import useState for the above function
import { useState } from "react";
