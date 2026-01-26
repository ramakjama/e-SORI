'use client'

import { motion } from 'framer-motion'
import {
  Download,
  ClipboardCheck,
  Star,
  CreditCard,
  Check,
  Coins
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

export type ReferralStage =
  | 'INVITED'
  | 'INSTALL_OPEN'
  | 'PROFILE_QUIZ'
  | 'REQUESTED_REVIEW'
  | 'POLICY_PAID'

export interface ReferralTrackerProps {
  currentStage: ReferralStage
  referredName?: string | null
  referredEmail?: string | null
  coinsEarned?: number
  className?: string
  compact?: boolean
}

// ============================================
// CONSTANTS
// ============================================

interface StageConfig {
  id: ReferralStage
  label: string
  shortLabel: string
  description: string
  coins: number
  icon: typeof Download
}

const STAGES: StageConfig[] = [
  {
    id: 'INSTALL_OPEN',
    label: 'App Instalada',
    shortLabel: 'Instalada',
    description: 'Tu amigo descargo e inicio la app',
    coins: 50,
    icon: Download,
  },
  {
    id: 'PROFILE_QUIZ',
    label: 'Perfil Completado',
    shortLabel: 'Perfil',
    description: 'Completo el quiz de perfil',
    coins: 100,
    icon: ClipboardCheck,
  },
  {
    id: 'REQUESTED_REVIEW',
    label: 'Solicito Presupuesto',
    shortLabel: 'Presupuesto',
    description: 'Pidio revision de su seguro',
    coins: 200,
    icon: Star,
  },
  {
    id: 'POLICY_PAID',
    label: 'Poliza Contratada',
    shortLabel: 'Contratada',
    description: 'Contrato y pago su primera poliza',
    coins: 1000,
    icon: CreditCard,
  },
]

const STAGE_ORDER: ReferralStage[] = [
  'INVITED',
  'INSTALL_OPEN',
  'PROFILE_QUIZ',
  'REQUESTED_REVIEW',
  'POLICY_PAID',
]

// ============================================
// HELPERS
// ============================================

function getStageIndex(stage: ReferralStage): number {
  return STAGE_ORDER.indexOf(stage)
}

function getStageStatus(
  stageId: ReferralStage,
  currentStage: ReferralStage
): 'completed' | 'current' | 'pending' {
  const stageIndex = getStageIndex(stageId)
  const currentIndex = getStageIndex(currentStage)

  if (stageIndex < currentIndex) return 'completed'
  if (stageIndex === currentIndex) return 'current'
  return 'pending'
}

// ============================================
// COMPONENT
// ============================================

export function ReferralTracker({
  currentStage,
  referredName,
  referredEmail,
  coinsEarned = 0,
  className,
  compact = false,
}: ReferralTrackerProps) {
  const currentIndex = getStageIndex(currentStage)
  const totalPossibleCoins = STAGES.reduce((acc, s) => acc + s.coins, 0)
  const progressPercentage = currentStage === 'INVITED'
    ? 0
    : ((currentIndex) / (STAGES.length)) * 100

  return (
    <div className={cn('w-full', className)}>
      {/* Header con info del referido */}
      {(referredName || referredEmail) && !compact && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {referredName || 'Invitado'}
            </p>
            {referredEmail && (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {referredEmail}
              </p>
            )}
          </div>
          {coinsEarned > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-500">
                +{coinsEarned}
              </span>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Timeline/Stepper Visual */}
      <div className="relative">
        {/* Progress Bar Background */}
        <div
          className="absolute top-5 left-0 right-0 h-1 rounded-full hidden sm:block"
          style={{
            backgroundColor: 'var(--color-border)',
            left: '12.5%',
            right: '12.5%',
          }}
        />

        {/* Progress Bar Filled */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="absolute top-5 h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hidden sm:block"
          style={{
            left: '12.5%',
            maxWidth: '75%',
          }}
        />

        {/* Mobile: Vertical Timeline */}
        <div className="sm:hidden space-y-3">
          {STAGES.map((stage, index) => {
            const status = getStageStatus(stage.id, currentStage)
            const Icon = stage.icon

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all',
                  status === 'completed' && 'bg-green-500/10',
                  status === 'current' && 'bg-blue-500/10 ring-2 ring-blue-500/30',
                  status === 'pending' && 'opacity-50'
                )}
                style={{
                  backgroundColor: status === 'pending' ? 'var(--color-card)' : undefined
                }}
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                    status === 'completed' && 'bg-green-500 text-white',
                    status === 'current' && 'bg-blue-500 text-white animate-pulse',
                    status === 'pending' && 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'font-medium text-sm',
                      status === 'completed' && 'text-green-600 dark:text-green-400',
                      status === 'current' && 'text-blue-600 dark:text-blue-400',
                    )}
                    style={{
                      color: status === 'pending' ? 'var(--color-text-secondary)' : undefined
                    }}
                  >
                    {stage.label}
                  </p>
                  {!compact && (
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                      {stage.description}
                    </p>
                  )}
                </div>

                {/* Coins */}
                <div
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold',
                    status === 'completed' && 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
                    status === 'current' && 'bg-amber-500/10 text-amber-500',
                    status === 'pending' && 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  )}
                >
                  <Coins className="w-3 h-3" />
                  {stage.coins}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden sm:flex justify-between">
          {STAGES.map((stage, index) => {
            const status = getStageStatus(stage.id, currentStage)
            const Icon = stage.icon

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center w-1/4"
              >
                {/* Circle Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    delay: index * 0.15 + 0.2
                  }}
                  className={cn(
                    'relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                    status === 'completed' && 'bg-green-500 text-white shadow-lg shadow-green-500/30',
                    status === 'current' && 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
                    status === 'pending' && 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  )}
                >
                  {status === 'completed' ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: index * 0.15 + 0.3 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}

                  {/* Pulse animation for current */}
                  {status === 'current' && (
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 rounded-full bg-blue-500"
                    />
                  )}
                </motion.div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-xs font-semibold mb-1 transition-colors',
                      status === 'completed' && 'text-green-600 dark:text-green-400',
                      status === 'current' && 'text-blue-600 dark:text-blue-400',
                    )}
                    style={{
                      color: status === 'pending' ? 'var(--color-text-secondary)' : undefined
                    }}
                  >
                    {compact ? stage.shortLabel : stage.label}
                  </p>

                  {/* Coins Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
                      status === 'completed' && 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
                      status === 'current' && 'bg-amber-500/10 text-amber-500',
                      status === 'pending' && 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    )}
                  >
                    <Coins className="w-3 h-3" />
                    {stage.coins}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Summary Footer */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-4 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {currentStage === 'POLICY_PAID' ? (
              <span className="text-green-500 font-medium">
                Conversion completada
              </span>
            ) : currentStage === 'INVITED' ? (
              <span>Esperando que tu amigo empiece</span>
            ) : (
              <span>
                Siguiente paso: {STAGES.find(s => getStageStatus(s.id, currentStage) === 'pending')?.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Potencial:
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Coins className="w-4 h-4" />
              <span>{totalPossibleCoins}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ============================================
// MINI VERSION FOR LISTS
// ============================================

export function ReferralTrackerMini({
  currentStage,
  className,
}: {
  currentStage: ReferralStage
  className?: string
}) {
  const currentIndex = getStageIndex(currentStage)

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {STAGES.map((stage, index) => {
        const status = getStageStatus(stage.id, currentStage)

        return (
          <motion.div
            key={stage.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              status === 'completed' && 'bg-green-500',
              status === 'current' && 'bg-blue-500 animate-pulse',
              status === 'pending' && 'bg-gray-300 dark:bg-gray-600'
            )}
            title={stage.label}
          />
        )
      })}
    </div>
  )
}
