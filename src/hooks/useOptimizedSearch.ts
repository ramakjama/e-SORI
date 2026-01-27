'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDebounce } from './useDebounce'

interface UseOptimizedSearchOptions<T> {
  items: T[]
  searchKeys: (keyof T)[]
  debounceMs?: number
  minSearchLength?: number
}

interface SearchResult<T> {
  results: T[]
  isSearching: boolean
  query: string
  setQuery: (query: string) => void
  clearSearch: () => void
}

/**
 * Optimized search hook with debouncing and memoization
 * Prevents unnecessary re-renders and computations
 */
export function useOptimizedSearch<T>({
  items,
  searchKeys,
  debounceMs = 300,
  minSearchLength = 2,
}: UseOptimizedSearchOptions<T>): SearchResult<T> {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, debounceMs)
  const [isSearching, setIsSearching] = useState(false)

  // Update searching state when query changes
  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [query, debouncedQuery])

  // Memoized search results
  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minSearchLength) {
      return items
    }

    const lowerQuery = debouncedQuery.toLowerCase()

    return items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery)
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowerQuery)
        }
        return false
      })
    })
  }, [items, debouncedQuery, searchKeys, minSearchLength])

  const clearSearch = useCallback(() => {
    setQuery('')
  }, [])

  return {
    results,
    isSearching,
    query,
    setQuery,
    clearSearch,
  }
}
