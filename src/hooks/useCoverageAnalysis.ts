/**
 * Hook para consumir el análisis de cobertura personalizado
 */

import { useState, useEffect } from 'react'
import type { CoverageAnalysisResult } from '@/lib/coverage-engine'

interface CoverageAnalysisState {
  data: CoverageAnalysisResult | null
  loading: boolean
  error: string | null
}

export function useCoverageAnalysis(userId?: string) {
  const [state, setState] = useState<CoverageAnalysisState>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true

    async function fetchAnalysis() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))

        const url = userId
          ? `/api/coverage/analysis?userId=${userId}`
          : '/api/coverage/analysis'

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Error al obtener el análisis de cobertura')
        }

        const json = await response.json()

        if (isMounted) {
          setState({
            data: json.analysis,
            loading: false,
            error: null
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
          })
        }
      }
    }

    fetchAnalysis()

    return () => {
      isMounted = false
    }
  }, [userId])

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
