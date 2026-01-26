'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Calendar, Gift, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  nextMilestone: number
  milestoneReward: number
  weekActivity: boolean[] // 7 dias, true = activo
}

interface StreakDisplayProps {
  className?: string
  variant?: 'badge' | 'compact' | 'tooltip'
  showTooltip?: boolean
}

// ============================================
// MOCK DATA
// ============================================

const mockStreakData: StreakData = {
  currentStreak: 7,
  longestStreak: 14,
  lastActivityDate: new Date().toISOString(),
  nextMilestone: 10,
  milestoneReward: 100,
  weekActivity: [true, true, true, true, true, true, true]
}

// ============================================
// MAIN COMPONENT
// ============================================

export function StreakDisplay({
  className,
  variant = 'badge',
  showTooltip = true
}: StreakDisplayProps) {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  useEffect(() => {
    const fetchStreak = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      setStreak(mockStreakData)
      setIsLoading(false)
    }
    fetchStreak()
  }, [])

  if (isLoading || !streak) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
    )
  }

  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const isHotStreak = streak.currentStreak >= 7

  // Variant: Badge (solo icono + numero)
  if (variant === 'badge') {
    return (
      <div className={cn('relative', className)}>
        <motion.button
          type="button"
          onClick={() => showTooltip && setTooltipOpen(!tooltipOpen)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm transition-all',
            isHotStreak
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={isHotStreak ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <Flame className={cn(
              'w-4 h-4',
              isHotStreak && 'drop-shadow-[0_0_3px_rgba(251,146,60,0.8)]'
            )} />
          </motion.span>
          <span>{streak.currentStreak}</span>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltipOpen && showTooltip && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setTooltipOpen(false)}
              />

              {/* Tooltip Content */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-64 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50"
              >
                <button
                  type="button"
                  onClick={() => setTooltipOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>

                {/* Streak Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    isHotStreak
                      ? 'bg-gradient-to-br from-orange-500 to-red-500'
                      : 'bg-orange-100 dark:bg-orange-900/50'
                  )}>
                    <Flame className={cn(
                      'w-6 h-6',
                      isHotStreak ? 'text-white' : 'text-orange-600 dark:text-orange-400'
                    )} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {streak.currentStreak} dias
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Racha actual
                    </p>
                  </div>
                </div>

                {/* Week Activity */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Actividad de la semana
                  </p>
                  <div className="flex justify-between">
                    {streak.weekActivity.map((active, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center',
                            active
                              ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                              : 'bg-slate-100 dark:bg-slate-700'
                          )}
                        >
                          {active ? (
                            <Flame className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                          )}
                        </motion.div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {daysOfWeek[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Record</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {streak.longestStreak} dias
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Gift className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Proximo premio</span>
                    </div>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                      {streak.nextMilestone - streak.currentStreak} dias
                    </p>
                  </div>
                </div>

                {/* Milestone Progress */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/50 dark:border-orange-800/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      Objetivo: {streak.nextMilestone} dias
                    </span>
                    <span className="text-xs text-orange-600 dark:text-orange-400">
                      +{streak.milestoneReward} COINS
                    </span>
                  </div>
                  <div className="h-2 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(streak.currentStreak / streak.nextMilestone) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Variant: Compact (linea horizontal)
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/50 dark:border-orange-800/30',
          className
        )}
      >
        <motion.div
          animate={isHotStreak ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            isHotStreak
              ? 'bg-gradient-to-br from-orange-500 to-red-500'
              : 'bg-orange-200 dark:bg-orange-800'
          )}
        >
          <Flame className={cn(
            'w-4 h-4',
            isHotStreak ? 'text-white' : 'text-orange-600 dark:text-orange-300'
          )} />
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
              {streak.currentStreak} dias
            </span>
            <span className="text-xs text-orange-600/70 dark:text-orange-400/70">
              Record: {streak.longestStreak}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] text-orange-600 dark:text-orange-400">
              {streak.nextMilestone - streak.currentStreak} dias para +{streak.milestoneReward} COINS
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  // Default (same as badge)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        isHotStreak
          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
          : 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300',
        className
      )}
    >
      <Flame className="w-4 h-4" />
      <span className="font-semibold text-sm">{streak.currentStreak}</span>
    </motion.div>
  )
}

export default StreakDisplay
