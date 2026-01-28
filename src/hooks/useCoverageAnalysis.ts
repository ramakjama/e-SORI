/**
 * Hook optimizado para análisis de cobertura con caché
 */

import { useState, useEffect, useRef } from 'react'
import type { CoverageAnalysisResult } from '@/lib/coverage-engine-optimized'

interface CoverageAnalysisState {
  data: CoverageAnalysisResult | null
  loading: boolean
  error: string | null
}

// Caché simple en memoria
const cache = new Map<string, { data: CoverageAnalysisResult; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function useCoverageAnalysis(userId?: string, enabled = true) {
  const [state, setState] = useState<CoverageAnalysisState>({
    data: null,
    loading: enabled,
    error: null
  })
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null })
      return
    }

    async function fetchAnalysis() {
      try {
        const cacheKey = userId || 'default'

        // Revisar caché primero
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setState({ data: cached.data, loading: false, error: null })
          return
        }

        setState(prev => ({ ...prev, loading: true, error: null }))

        // Cancelar request anterior si existe
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        const url = userId
          ? `/api/coverage/analysis?userId=${userId}`
          : '/api/coverage/analysis'

        const response = await fetch(url, {
          signal: abortControllerRef.current.signal
        })

        if (!response.ok) {
          throw new Error('Error al obtener el análisis')
        }

        const json = await response.json()

        // Guardar en caché
        cache.set(cacheKey, {
          data: json.analysis,
          timestamp: Date.now()
        })

        setState({
          data: json.analysis,
          loading: false,
          error: null
        })
      } catch (error: any) {
        if (error.name === 'AbortError') return

        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    fetchAnalysis()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [userId, enabled])

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true }))
    // Re-trigger useEffect by updating a dependency
    const url = userId
      ? `/api/coverage/analysis?userId=${userId}`
      : '/api/coverage/analysis'

    try {
      const response = await fetch(url)
      const json = await response.json()
      setState({
        data: json.analysis,
        loading: false,
        error: null
      })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  return {
    analysis: state.data,
    loading: state.loading,
    error: state.error,
    refetch
  }
}
