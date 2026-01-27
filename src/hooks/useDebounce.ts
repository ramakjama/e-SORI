'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook that debounces a value by the specified delay.
 * Useful for search inputs, form validation, and API calls.
 *
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   // This will only run 500ms after the user stops typing
 *   searchAPI(debouncedSearch)
 * }, [debouncedSearch])
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up the timeout
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clear timeout on cleanup (when value or delay changes)
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook that returns a debounced callback function.
 * Useful when you need to debounce a function call directly.
 *
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds (default: 300ms)
 * @returns A debounced version of the callback
 *
 * @example
 * ```tsx
 * const handleSearch = useDebouncedCallback((term: string) => {
 *   searchAPI(term)
 * }, 500)
 *
 * return <input onChange={(e) => handleSearch(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update the callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}

/**
 * Hook that throttles a value by the specified interval.
 * Unlike debounce, throttle ensures the value updates at most once per interval.
 *
 * @param value - The value to throttle
 * @param interval - The throttle interval in milliseconds (default: 300ms)
 * @returns The throttled value
 *
 * @example
 * ```tsx
 * const [scrollPosition, setScrollPosition] = useState(0)
 * const throttledPosition = useThrottle(scrollPosition, 100)
 *
 * // throttledPosition updates at most once every 100ms
 * ```
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, interval - (now - lastUpdated.current))

      return () => {
        clearTimeout(timer)
      }
    }
  }, [value, interval])

  return throttledValue
}

/**
 * Hook that returns a throttled callback function.
 * Ensures the callback is called at most once per interval.
 *
 * @param callback - The function to throttle
 * @param interval - The throttle interval in milliseconds (default: 300ms)
 * @returns A throttled version of the callback
 *
 * @example
 * ```tsx
 * const handleScroll = useThrottledCallback(() => {
 *   updateScrollIndicator()
 * }, 100)
 *
 * return <div onScroll={handleScroll}>...</div>
 * ```
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  interval: number = 300
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update the callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastRan.current >= interval) {
        callbackRef.current(...args)
        lastRan.current = now
      } else {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        // Schedule the trailing call
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args)
          lastRan.current = Date.now()
        }, interval - (now - lastRan.current))
      }
    },
    [interval]
  )
}

export default useDebounce
