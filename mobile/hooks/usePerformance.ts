import { useCallback, useMemo } from 'react';

/**
 * Performance optimization hooks
 * Memoization ve callback optimizasyonları için yardımcı hook'lar
 */

/**
 * Debounce hook - Sık tetiklenen fonksiyonları geciktirmek için
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
};

/**
 * Throttle hook - Fonksiyon çağrılarını sınırlamak için
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle) {
        callback(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    },
    [callback, limit]
  );
};

/**
 * Memoized değer hesaplama
 */
export const useMemoizedValue = <T>(factory: () => T, deps: any[]): T => {
  return useMemo(factory, deps);
};

/**
 * Optimized callback
 */
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  return useCallback(callback, deps) as T;
};