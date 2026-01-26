'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Shield,
  Star,
  TrendingUp,
  ChevronRight,
  Zap,
  Gift
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface WalletData {
  xp: number
  level: number
  levelName: string
  xpToNextLevel: number
  xpProgress: number
  coins: number
  coinsEuroEquivalent: number
  shields: number
  streak: number
}

interface WalletSummaryProps {
  className?: string
  variant?: 'compact' | 'full' | 'header'
  showAllStats?: boolean
}

// ============================================
// MOCK DATA (Replace with real API)
// ============================================

const mockWalletData: WalletData = {
  xp: 2850,
  level: 12,
  levelName: 'ORO',
  xpToNextLevel: 500,
  xpProgress: 70,
  coins: 340,
  coinsEuroEquivalent: 3.40,
  shields: 2,
  streak: 7
}

// ============================================
// LEVEL COLORS
// ============================================

const getLevelColors = (levelName: string) => {
  switch (levelName) {
    case 'PLATINO':
      return {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600 dark:text-purple-400',
        light: 'bg-purple-100 dark:bg-purple-950/50'
      }
    case 'ORO':
      return {
        bg: 'from-yellow-500 to-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
        light: 'bg-amber-100 dark:bg-amber-950/50'
      }
    case 'PLATA':
      return {
        bg: 'from-gray-400 to-gray-500',
        text: 'text-gray-600 dark:text-gray-400',
        light: 'bg-gray-100 dark:bg-gray-800/50'
      }
    default:
      return {
        bg: 'from-orange-500 to-orange-600',
        text: 'text-orange-600 dark:text-orange-400',
        light: 'bg-orange-100 dark:bg-orange-950/50'
      }
  }
}

// ============================================
// ANIMATED COUNTER
// ============================================

function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return

    const incrementTime = (duration * 1000) / end
    const timer = setInterval(() => {
      start += Math.ceil(end / 50)
      if (start > end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value, duration])

  return <>{displayValue.toLocaleString('es-ES')}</>
}

// ============================================
// MAIN COMPONENT
// ============================================

export function WalletSummary({
  className,
  variant = 'full',
  showAllStats = true
}: WalletSummaryProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de API
    const fetchWallet = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setWallet(mockWalletData)
      setIsLoading(false)
    }
    fetchWallet()
  }, [])

  if (isLoading || !wallet) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  const levelColors = getLevelColors(wallet.levelName)

  // Variant: Header (muy compacto, para navbar)
  if (variant === 'header') {
    return (
      <Link href="/soriano-club">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer',
            className
          )}
        >
          {/* XP */}
          <div className="flex items-center gap-1.5">
            <div className={cn('w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br', levelColors.bg)}>
              <Star className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">{wallet.xp}</span>
          </div>

          <div className="w-px h-5 bg-white/20" />

          {/* COINS */}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-white">{wallet.coins}</span>
          </div>

          <div className="w-px h-5 bg-white/20" />

          {/* SHIELDS */}
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">{wallet.shields}</span>
          </div>
        </motion.div>
      </Link>
    )
  }

  // Variant: Compact (para sidebar)
  if (variant === 'compact') {
    return (
      <Link href="/soriano-club">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group',
            className
          )}
        >
          {/* Level badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br', levelColors.bg)}>
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Nivel {wallet.level}</p>
                <p className={cn('text-sm font-bold', levelColors.text)}>{wallet.levelName}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* XP Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">XP</span>
              <span className="font-medium text-slate-900 dark:text-white">{wallet.xp} / {wallet.xp + wallet.xpToNextLevel}</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full bg-gradient-to-r', levelColors.bg)}
                initial={{ width: 0 }}
                animate={{ width: `${wallet.xpProgress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-around pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{wallet.coins}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">COINS</p>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{wallet.shields}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">SHIELDS</p>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  // Variant: Full (card completa)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-red-500" />
          Mi Cartera e-SORI
        </h3>
        <Link href="/soriano-club" className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline flex items-center gap-1">
          Ver todo <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Level Card */}
      <div className={cn('p-4 rounded-xl mb-4', levelColors.light)}>
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg', levelColors.bg)}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Star className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Nivel {wallet.level}</p>
            <p className={cn('text-xl font-bold', levelColors.text)}>{wallet.levelName}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              <AnimatedNumber value={wallet.xp} />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">XP totales</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400">Progreso al siguiente nivel</span>
            <span className="font-medium text-slate-900 dark:text-white">{wallet.xpProgress}%</span>
          </div>
          <div className="h-2.5 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', levelColors.bg)}
              initial={{ width: 0 }}
              animate={{ width: `${wallet.xpProgress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Faltan <span className="font-medium">{wallet.xpToNextLevel} XP</span> para subir de nivel
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {showAllStats && (
        <div className="grid grid-cols-3 gap-3">
          {/* COINS */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200/50 dark:border-yellow-800/30">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">COINS</span>
            </div>
            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
              <AnimatedNumber value={wallet.coins} />
            </p>
            <p className="text-[10px] text-yellow-600/70 dark:text-yellow-400/70">
              = {wallet.coinsEuroEquivalent.toFixed(2)} EUR
            </p>
          </div>

          {/* SHIELDS */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/30">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">SHIELDS</span>
            </div>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{wallet.shields}</p>
            <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70">disponibles</p>
          </div>

          {/* STREAK */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200/50 dark:border-orange-800/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300">RACHA</span>
            </div>
            <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{wallet.streak}</p>
            <p className="text-[10px] text-orange-600/70 dark:text-orange-400/70">dias seguidos</p>
          </div>
        </div>
      )}

      {/* Quick Action */}
      <Link href="/soriano-club">
        <motion.button
          type="button"
          className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <TrendingUp className="w-4 h-4" />
          Ver recompensas y canjear
        </motion.button>
      </Link>
    </motion.div>
  )
}

export default WalletSummary
