'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

/**
 * QueryProvider component that wraps the application with React Query context.
 *
 * Configured with optimized defaults for:
 * - Stale time: 60 seconds (data considered fresh)
 * - Garbage collection time: 5 minutes (cache cleanup)
 * - Retry: 1 attempt on failure
 * - No refetch on window focus (manual control)
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient instance with useState to ensure it's created once per client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 60 seconds
            staleTime: 60 * 1000,
            // Cache is cleaned up after 5 minutes of inactivity
            gcTime: 5 * 60 * 1000,
            // Only retry once on failure
            retry: 1,
            // Don't refetch on window focus by default (can be overridden per query)
            refetchOnWindowFocus: false,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
            // Don't refetch on reconnect by default
            refetchOnReconnect: false,
          },
          mutations: {
            // Retry mutations once on failure
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  )
}

export default QueryProvider
