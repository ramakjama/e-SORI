'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw,
  Coins,
  Gift,
  Trophy,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
  TrendingUp,
  Sparkles,
  Filter
} from 'lucide-react'
import { RenewalCard, PolicyRenewal } from './RenewalCard'

// ============================================
// TYPES
// ============================================

interface RenewalCheckpointsProps {
  userId?: string
  onClaimCheckpoint?: (policyId: string, checkpointId: string) => Promise<void>
  onViewPolicy?: (policyId: string) => void
  maxVisible?: number
  className?: string
}

type SortOption = 'urgency' | 'coins' | 'date'
type FilterOption = 'all' | 'available' | 'urgent'

interface RenewalStats {
  totalPolicies: number
  totalCoinsAvailable: number
  totalCoinsEarned: number
  freeSpinsAvailable: number
  urgentCount: number
  completedCheckpoints: number
  totalCheckpoints: number
}

// ============================================
// MOCK DATA (for development)
// ============================================

const generateMockPolicies = (): PolicyRenewal[] => {
  const now = new Date()

  return [
    {
      id: 'pol-001',
      policyNumber: 'AUTO-2024-001234',
      policyType: 'auto',
      productName: 'Seguro Auto Premium',
      expiryDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      premium: 850.00,
      checkpoints: [
        { id: 'cp-1', daysBeforeExpiry: 30, coinsReward: 100, hasFreeSpinReward: false, isCompleted: true, completedAt: new Date().toISOString(), isAvailable: false, isPassed: false },
        { id: 'cp-2', daysBeforeExpiry: 15, coinsReward: 150, hasFreeSpinReward: false, isCompleted: true, completedAt: new Date().toISOString(), isAvailable: false, isPassed: false },
        { id: 'cp-3', daysBeforeExpiry: 7, coinsReward: 200, hasFreeSpinReward: true, isCompleted: false, isAvailable: true, isPassed: false }
      ],
      totalCoinsAvailable: 450,
      totalCoinsEarned: 250
    },
    {
      id: 'pol-002',
      policyNumber: 'HOG-2024-005678',
      policyType: 'hogar',
      productName: 'Hogar Confort Plus',
      expiryDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      premium: 420.00,
      checkpoints: [
        { id: 'cp-4', daysBeforeExpiry: 30, coinsReward: 100, hasFreeSpinReward: false, isCompleted: true, completedAt: new Date().toISOString(), isAvailable: false, isPassed: false },
        { id: 'cp-5', daysBeforeExpiry: 15, coinsReward: 150, hasFreeSpinReward: false, isCompleted: false, isAvailable: true, isPassed: false },
        { id: 'cp-6', daysBeforeExpiry: 7, coinsReward: 200, hasFreeSpinReward: true, isCompleted: false, isAvailable: false, isPassed: false }
      ],
      totalCoinsAvailable: 450,
      totalCoinsEarned: 100
    },
    {
      id: 'pol-003',
      policyNumber: 'VID-2024-009012',
      policyType: 'vida',
      productName: 'Vida Familiar',
      expiryDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      premium: 180.00,
      checkpoints: [
        { id: 'cp-7', daysBeforeExpiry: 30, coinsReward: 100, hasFreeSpinReward: false, isCompleted: false, isAvailable: true, isPassed: false },
        { id: 'cp-8', daysBeforeExpiry: 15, coinsReward: 150, hasFreeSpinReward: false, isCompleted: false, isAvailable: false, isPassed: false },
        { id: 'cp-9', daysBeforeExpiry: 7, coinsReward: 200, hasFreeSpinReward: true, isCompleted: false, isAvailable: false, isPassed: false }
      ],
      totalCoinsAvailable: 450,
      totalCoinsEarned: 0
    },
    {
      id: 'pol-004',
      policyNumber: 'SAL-2024-003456',
      policyType: 'salud',
      productName: 'Salud Completa',
      expiryDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      premium: 320.00,
      checkpoints: [
        { id: 'cp-10', daysBeforeExpiry: 30, coinsReward: 100, hasFreeSpinReward: false, isCompleted: false, isAvailable: false, isPassed: false },
        { id: 'cp-11', daysBeforeExpiry: 15, coinsReward: 150, hasFreeSpinReward: false, isCompleted: false, isAvailable: false, isPassed: false },
        { id: 'cp-12', daysBeforeExpiry: 7, coinsReward: 200, hasFreeSpinReward: true, isCompleted: false, isAvailable: false, isPassed: false }
      ],
      totalCoinsAvailable: 450,
      totalCoinsEarned: 0
    }
  ]
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

function calculateStats(policies: PolicyRenewal[]): RenewalStats {
  let totalCoinsAvailable = 0
  let totalCoinsEarned = 0
  let freeSpinsAvailable = 0
  let urgentCount = 0
  let completedCheckpoints = 0
  let totalCheckpoints = 0

  for (const policy of policies) {
    totalCoinsAvailable += policy.totalCoinsAvailable
    totalCoinsEarned += policy.totalCoinsEarned

    const daysRemaining = getDaysUntilExpiry(policy.expiryDate)
    if (daysRemaining <= 7) urgentCount++

    for (const checkpoint of policy.checkpoints) {
      totalCheckpoints++
      if (checkpoint.isCompleted) completedCheckpoints++
      if (checkpoint.isAvailable && checkpoint.hasFreeSpinReward) freeSpinsAvailable++
    }
  }

  return {
    totalPolicies: policies.length,
    totalCoinsAvailable,
    totalCoinsEarned,
    freeSpinsAvailable,
    urgentCount,
    completedCheckpoints,
    totalCheckpoints
  }
}

function sortPolicies(policies: PolicyRenewal[], sortBy: SortOption): PolicyRenewal[] {
  return [...policies].sort((a, b) => {
    switch (sortBy) {
      case 'urgency':
        return getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate)
      case 'coins':
        return (b.totalCoinsAvailable - b.totalCoinsEarned) - (a.totalCoinsAvailable - a.totalCoinsEarned)
      case 'date':
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      default:
        return 0
    }
  })
}

function filterPolicies(policies: PolicyRenewal[], filterBy: FilterOption): PolicyRenewal[] {
  switch (filterBy) {
    case 'available':
      return policies.filter(p => p.checkpoints.some(c => c.isAvailable))
    case 'urgent':
      return policies.filter(p => getDaysUntilExpiry(p.expiryDate) <= 15)
    default:
      return policies
  }
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  color: string
  highlight?: boolean
}

function StatCard({ icon, value, label, color, highlight }: StatCardProps) {
  return (
    <motion.div
      className={`flex items-center gap-3 p-4 rounded-xl ${
        highlight
          ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20'
          : 'bg-gray-50 dark:bg-gray-800/50'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </p>
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function RenewalCheckpoints({
  userId,
  onClaimCheckpoint,
  onViewPolicy,
  maxVisible = 3,
  className = ''
}: RenewalCheckpointsProps) {
  const [policies, setPolicies] = useState<PolicyRenewal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('urgency')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  // Fetch policies on mount
  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In production, this would be an API call
        // const response = await fetch('/api/renewal/policies')
        // const data = await response.json()
        // setPolicies(data.policies)

        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 800))
        setPolicies(generateMockPolicies())
      } catch (err) {
        console.error('Error fetching renewal policies:', err)
        setError('Error al cargar las polizas. Por favor, intenta de nuevo.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolicies()
  }, [userId])

  // Process policies
  const processedPolicies = useMemo(() => {
    let result = filterPolicies(policies, filterBy)
    result = sortPolicies(result, sortBy)
    return result
  }, [policies, sortBy, filterBy])

  const visiblePolicies = useMemo(
    () => (showAll ? processedPolicies : processedPolicies.slice(0, maxVisible)),
    [processedPolicies, showAll, maxVisible]
  )

  const stats = useMemo(() => calculateStats(policies), [policies])

  const handleClaimCheckpoint = useCallback(
    async (policyId: string, checkpointId: string) => {
      if (onClaimCheckpoint) {
        await onClaimCheckpoint(policyId, checkpointId)
      }

      // Update local state after successful claim
      setPolicies(prevPolicies =>
        prevPolicies.map(policy => {
          if (policy.id !== policyId) return policy

          const updatedCheckpoints = policy.checkpoints.map(cp => {
            if (cp.id !== checkpointId) return cp
            return {
              ...cp,
              isCompleted: true,
              completedAt: new Date().toISOString(),
              isAvailable: false
            }
          })

          const newTotalEarned = updatedCheckpoints
            .filter(cp => cp.isCompleted)
            .reduce((sum, cp) => sum + cp.coinsReward, 0)

          return {
            ...policy,
            checkpoints: updatedCheckpoints,
            totalCoinsEarned: newTotalEarned
          }
        })
      )
    },
    [onClaimCheckpoint]
  )

  // Loading state
  if (isLoading) {
    return (
      <div className={`card p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-8 h-8 text-occident" />
          </motion.div>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Cargando renovaciones...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`card p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (policies.length === 0) {
    return (
      <div className={`card p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
              Sin renovaciones pendientes
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Todas tus polizas estan al dia. Vuelve pronto para nuevas oportunidades de ganar COINS.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <RefreshCw className="w-6 h-6 text-occident" />
            Renovacion Inteligente
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Gana COINS completando checkpoints antes del vencimiento
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Coins className="w-5 h-5 text-white" />}
          value={`${stats.totalCoinsAvailable - stats.totalCoinsEarned}c`}
          label="COINS disponibles"
          color="bg-gradient-to-br from-amber-500 to-amber-600"
          highlight
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          value={`${stats.totalCoinsEarned}c`}
          label="COINS ganados"
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          icon={<Gift className="w-5 h-5 text-white" />}
          value={stats.freeSpinsAvailable}
          label="Tiradas gratis"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5 text-white" />}
          value={stats.urgentCount}
          label="Urgentes (<7d)"
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5"
            style={{ color: 'var(--color-text)' }}
          >
            <option value="all">Todas ({policies.length})</option>
            <option value="available">Con recompensas</option>
            <option value="urgent">Urgentes</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Ordenar:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5"
            style={{ color: 'var(--color-text)' }}
          >
            <option value="urgency">Mas urgente</option>
            <option value="coins">Mas COINS</option>
            <option value="date">Fecha vencimiento</option>
          </select>
        </div>
      </div>

      {/* Available rewards banner */}
      {processedPolicies.some(p => p.checkpoints.some(c => c.isAvailable)) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
          </motion.div>
          <div className="flex-1">
            <p className="font-medium text-amber-700 dark:text-amber-300">
              Tienes checkpoints disponibles para reclamar
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              No dejes pasar la oportunidad de ganar COINS extra
            </p>
          </div>
        </motion.div>
      )}

      {/* Policies List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {visiblePolicies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <RenewalCard
                policy={policy}
                onClaimCheckpoint={handleClaimCheckpoint}
                onViewPolicy={onViewPolicy}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Show more/less button */}
      {processedPolicies.length > maxVisible && (
        <motion.button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-5 h-5" />
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Ver menos
              </span>
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Ver {processedPolicies.length - maxVisible} polizas mas
              </span>
            </>
          )}
        </motion.button>
      )}

      {/* Total summary */}
      <div className="card p-4 bg-gradient-to-r from-occident/5 to-occident/10 border border-occident/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-occident/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-occident" />
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                Progreso total de renovaciones
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {stats.completedCheckpoints} de {stats.totalCheckpoints} checkpoints completados
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.totalCoinsEarned}c
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              de {stats.totalCoinsAvailable}c posibles
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-occident to-occident-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.completedCheckpoints / stats.totalCheckpoints) * 100}%`
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RenewalCheckpoints
