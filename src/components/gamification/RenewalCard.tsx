'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Gift,
  Coins,
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

export interface RenewalCheckpoint {
  id: string
  daysBeforeExpiry: number // T-30, T-15, T-7
  coinsReward: number
  hasFreeSpinReward: boolean
  isCompleted: boolean
  completedAt?: string
  isAvailable: boolean // Can be claimed now
  isPassed: boolean // Window has passed without claiming
}

export interface PolicyRenewal {
  id: string
  policyNumber: string
  policyType: 'auto' | 'hogar' | 'vida' | 'salud' | 'negocio' | 'otro'
  productName: string
  expiryDate: string // ISO date
  premium: number
  checkpoints: RenewalCheckpoint[]
  totalCoinsAvailable: number
  totalCoinsEarned: number
}

interface RenewalCardProps {
  policy: PolicyRenewal
  onClaimCheckpoint?: (policyId: string, checkpointId: string) => Promise<void>
  onViewPolicy?: (policyId: string) => void
  compact?: boolean
}

// ============================================
// CONSTANTS
// ============================================

const CHECKPOINT_CONFIG = {
  'T-30': { days: 30, coins: 100, freeSpin: false, label: 'T-30' },
  'T-15': { days: 15, coins: 150, freeSpin: false, label: 'T-15' },
  'T-7': { days: 7, coins: 200, freeSpin: true, label: 'T-7' }
} as const

const POLICY_ICONS: Record<PolicyRenewal['policyType'], string> = {
  auto: '🚗',
  hogar: '🏠',
  vida: '❤️',
  salud: '🏥',
  negocio: '🏢',
  otro: '📋'
}

const POLICY_COLORS: Record<PolicyRenewal['policyType'], string> = {
  auto: 'from-blue-500 to-blue-600',
  hogar: 'from-amber-500 to-amber-600',
  vida: 'from-rose-500 to-rose-600',
  salud: 'from-emerald-500 to-emerald-600',
  negocio: 'from-purple-500 to-purple-600',
  otro: 'from-gray-500 to-gray-600'
}

// ============================================
// HELPERS
// ============================================

function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate)
  const now = new Date()
  expiry.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  const diffTime = expiry.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getUrgencyLevel(daysRemaining: number): 'green' | 'yellow' | 'red' {
  if (daysRemaining <= 7) return 'red'
  if (daysRemaining <= 15) return 'yellow'
  return 'green'
}

function getUrgencyStyles(level: 'green' | 'yellow' | 'red') {
  switch (level) {
    case 'red':
      return {
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        badge: 'bg-red-500',
        glow: 'shadow-red-500/20'
      }
    case 'yellow':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-500',
        glow: 'shadow-amber-500/20'
      }
    default:
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-600 dark:text-emerald-400',
        badge: 'bg-emerald-500',
        glow: 'shadow-emerald-500/20'
      }
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface CheckpointNodeProps {
  checkpoint: RenewalCheckpoint
  isFirst: boolean
  isLast: boolean
  urgencyLevel: 'green' | 'yellow' | 'red'
  onClaim?: () => void
  isLoading?: boolean
}

function CheckpointNode({
  checkpoint,
  isFirst,
  isLast,
  urgencyLevel,
  onClaim,
  isLoading
}: CheckpointNodeProps) {
  const urgencyStyles = getUrgencyStyles(urgencyLevel)

  const getNodeStatus = () => {
    if (checkpoint.isCompleted) return 'completed'
    if (checkpoint.isPassed) return 'passed'
    if (checkpoint.isAvailable) return 'available'
    return 'pending'
  }

  const status = getNodeStatus()

  return (
    <div className="flex flex-col items-center relative">
      {/* Connection line to previous */}
      {!isFirst && (
        <div
          className={`absolute -top-4 w-0.5 h-4 ${
            checkpoint.isCompleted || checkpoint.isPassed
              ? 'bg-gray-300 dark:bg-gray-600'
              : status === 'available'
              ? urgencyStyles.badge
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        />
      )}

      {/* Node */}
      <motion.button
        onClick={status === 'available' && onClaim ? onClaim : undefined}
        disabled={status !== 'available' || isLoading}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          status === 'completed'
            ? 'bg-emerald-500 text-white'
            : status === 'passed'
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
            : status === 'available'
            ? `${urgencyStyles.badge} text-white cursor-pointer hover:scale-110 shadow-lg ${urgencyStyles.glow}`
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600'
        }`}
        whileHover={status === 'available' ? { scale: 1.1 } : {}}
        whileTap={status === 'available' ? { scale: 0.95 } : {}}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : status === 'completed' ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : status === 'passed' ? (
          <AlertTriangle className="w-5 h-5" />
        ) : status === 'available' ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Gift className="w-5 h-5" />
          </motion.div>
        ) : (
          <Circle className="w-5 h-5" />
        )}

        {/* Pulse effect for available */}
        {status === 'available' && (
          <motion.div
            className={`absolute inset-0 rounded-full ${urgencyStyles.badge} opacity-30`}
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Label */}
      <div className="mt-2 text-center">
        <span
          className={`text-xs font-bold ${
            status === 'completed'
              ? 'text-emerald-600 dark:text-emerald-400'
              : status === 'available'
              ? urgencyStyles.text
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          T-{checkpoint.daysBeforeExpiry}
        </span>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          <Coins className="w-3 h-3 text-amber-500" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {checkpoint.coinsReward}
          </span>
        </div>
        {checkpoint.hasFreeSpinReward && (
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <Gift className="w-3 h-3 text-purple-500" />
            <span className="text-xs text-purple-600 dark:text-purple-400">
              +Tirada
            </span>
          </div>
        )}
      </div>

      {/* Connection line to next */}
      {!isLast && (
        <div
          className={`absolute -bottom-4 w-0.5 h-4 ${
            checkpoint.isCompleted
              ? 'bg-emerald-500'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        />
      )}
    </div>
  )
}

interface CountdownDisplayProps {
  daysRemaining: number
  urgencyLevel: 'green' | 'yellow' | 'red'
}

function CountdownDisplay({ daysRemaining, urgencyLevel }: CountdownDisplayProps) {
  const urgencyStyles = getUrgencyStyles(urgencyLevel)

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${urgencyStyles.bg} ${urgencyStyles.border} border`}
      animate={urgencyLevel === 'red' ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <Clock className={`w-4 h-4 ${urgencyStyles.text}`} />
      <span className={`text-sm font-bold ${urgencyStyles.text}`}>
        {daysRemaining <= 0 ? (
          'Vencida'
        ) : daysRemaining === 1 ? (
          '1 dia'
        ) : (
          `${daysRemaining} dias`
        )}
      </span>
    </motion.div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function RenewalCard({
  policy,
  onClaimCheckpoint,
  onViewPolicy,
  compact = false
}: RenewalCardProps) {
  const [claimingCheckpoint, setClaimingCheckpoint] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null)

  const daysRemaining = useMemo(
    () => getDaysUntilExpiry(policy.expiryDate),
    [policy.expiryDate]
  )

  const urgencyLevel = useMemo(
    () => getUrgencyLevel(daysRemaining),
    [daysRemaining]
  )

  const urgencyStyles = getUrgencyStyles(urgencyLevel)
  const policyGradient = POLICY_COLORS[policy.policyType]

  const progressPercentage = useMemo(() => {
    const completedCount = policy.checkpoints.filter(c => c.isCompleted).length
    return (completedCount / policy.checkpoints.length) * 100
  }, [policy.checkpoints])

  const handleClaimCheckpoint = useCallback(
    async (checkpointId: string) => {
      if (!onClaimCheckpoint || claimingCheckpoint) return

      setClaimingCheckpoint(checkpointId)
      try {
        await onClaimCheckpoint(policy.id, checkpointId)
        setClaimSuccess(checkpointId)
        setTimeout(() => setClaimSuccess(null), 2000)
      } catch (error) {
        console.error('Error claiming checkpoint:', error)
      } finally {
        setClaimingCheckpoint(null)
      }
    },
    [onClaimCheckpoint, policy.id, claimingCheckpoint]
  )

  // Sort checkpoints by days (T-30 first, T-7 last)
  const sortedCheckpoints = useMemo(
    () => [...policy.checkpoints].sort((a, b) => b.daysBeforeExpiry - a.daysBeforeExpiry),
    [policy.checkpoints]
  )

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card p-4 ${urgencyStyles.border} border-2 cursor-pointer hover:shadow-lg transition-shadow`}
        onClick={() => onViewPolicy?.(policy.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{POLICY_ICONS[policy.policyType]}</span>
            <div>
              <h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                {policy.productName}
              </h4>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {policy.policyNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CountdownDisplay daysRemaining={daysRemaining} urgencyLevel={urgencyLevel} />
            <div className="flex items-center gap-1 text-amber-500">
              <Coins className="w-4 h-4" />
              <span className="text-sm font-bold">
                {policy.totalCoinsAvailable - policy.totalCoinsEarned}c
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card overflow-hidden ${urgencyStyles.border} border-2`}
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${policyGradient} p-4 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
              {POLICY_ICONS[policy.policyType]}
            </div>
            <div>
              <h3 className="font-bold text-lg">{policy.productName}</h3>
              <p className="text-white/80 text-sm">{policy.policyNumber}</p>
            </div>
          </div>
          <CountdownDisplay daysRemaining={daysRemaining} urgencyLevel={urgencyLevel} />
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/80 mb-1">
            <span>Progreso de renovacion</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Checkpoints section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
            Checkpoints de Renovacion
          </h4>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {policy.totalCoinsEarned} / {policy.totalCoinsAvailable} COINS
            </span>
          </div>
        </div>

        {/* Checkpoint nodes */}
        <div className="flex justify-around items-start py-4">
          {sortedCheckpoints.map((checkpoint, index) => (
            <CheckpointNode
              key={checkpoint.id}
              checkpoint={checkpoint}
              isFirst={index === 0}
              isLast={index === sortedCheckpoints.length - 1}
              urgencyLevel={urgencyLevel}
              onClaim={() => handleClaimCheckpoint(checkpoint.id)}
              isLoading={claimingCheckpoint === checkpoint.id}
            />
          ))}
        </div>

        {/* Success animation */}
        <AnimatePresence>
          {claimSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Checkpoint completado! Monedas acreditadas.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expiry date info */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <Calendar className="w-4 h-4" />
            <span>Vencimiento: {formatDate(policy.expiryDate)}</span>
          </div>
          {onViewPolicy && (
            <button
              onClick={() => onViewPolicy(policy.id)}
              className="flex items-center gap-1 text-sm font-medium text-occident hover:underline"
            >
              Ver poliza
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Warning for red urgency */}
        {urgencyLevel === 'red' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              Tu poliza vence pronto. Completa los checkpoints para ganar recompensas y no pierdas tu cobertura.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default RenewalCard
