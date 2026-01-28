'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Shield, AlertTriangle } from 'lucide-react'
import { validatePasswordStrength } from '@/lib/security'

interface PasswordStrengthMeterProps {
  password: string
  onStrengthChange?: (strength: { isValid: boolean; score: number }) => void
  showSuggestions?: boolean
}

export function PasswordStrengthMeter({
  password,
  onStrengthChange,
  showSuggestions = true,
}: PasswordStrengthMeterProps) {
  const [result, setResult] = useState<{
    isValid: boolean
    score: number
    errors: string[]
    suggestions: string[]
  }>({ isValid: false, score: 0, errors: [], suggestions: [] })

  useEffect(() => {
    if (!password) {
      setResult({ isValid: false, score: 0, errors: [], suggestions: [] })
      return
    }

    const strength = validatePasswordStrength(password)
    setResult(strength)
    onStrengthChange?.(strength)
  }, [password, onStrengthChange])

  if (!password) return null

  const getStrengthLabel = (score: number) => {
    if (score >= 80) return { label: 'Muy Fuerte', color: 'emerald' }
    if (score >= 60) return { label: 'Fuerte', color: 'green' }
    if (score >= 40) return { label: 'Media', color: 'yellow' }
    if (score >= 20) return { label: 'Débil', color: 'orange' }
    return { label: 'Muy Débil', color: 'red' }
  }

  const strength = getStrengthLabel(result.score)

  return (
    <div className="space-y-3">
      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium" style={{ color: 'var(--color-text)' }}>
            Fortaleza de la contraseña
          </span>
          <span
            className={`font-bold text-${strength.color}-500`}
            style={{
              color: strength.color === 'emerald' ? '#10b981'
                : strength.color === 'green' ? '#22c55e'
                : strength.color === 'yellow' ? '#eab308'
                : strength.color === 'orange' ? '#f97316'
                : '#ef4444'
            }}
          >
            {strength.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.score}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded-full`}
            style={{
              backgroundColor: strength.color === 'emerald' ? '#10b981'
                : strength.color === 'green' ? '#22c55e'
                : strength.color === 'yellow' ? '#eab308'
                : strength.color === 'orange' ? '#f97316'
                : '#ef4444'
            }}
          />
        </div>
      </div>

      {/* Errores */}
      {result.errors.length > 0 && (
        <div className="space-y-1.5">
          {result.errors.map((error, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
            >
              <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sugerencias */}
      {showSuggestions && result.suggestions.length > 0 && result.errors.length === 0 && (
        <div className="space-y-1.5">
          {result.suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-2 text-sm text-yellow-600 dark:text-yellow-400"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{suggestion}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Requisitos cumplidos */}
      {result.isValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
        >
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Contraseña segura y lista para usar
          </span>
        </motion.div>
      )}
    </div>
  )
}
