'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  ChevronRight,
  Crown,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface LeaderboardUser {
  rank: number
  name: string
  avatar: string | null
  xp: number
  isCurrentUser: boolean
  trend: 'up' | 'down' | 'same'
}

interface LeaderboardMiniProps {
  className?: string
  period?: 'daily' | 'weekly' | 'monthly'
}

// ============================================
// MOCK DATA
// ============================================

const mockTopUsers: LeaderboardUser[] = [
  { rank: 1, name: 'Ana Martinez', avatar: null, xp: 4520, isCurrentUser: false, trend: 'same' },
  { rank: 2, name: 'Carlos Ruiz', avatar: null, xp: 4210, isCurrentUser: false, trend: 'up' },
  { rank: 3, name: 'Maria Lopez', avatar: null, xp: 3890, isCurrentUser: false, trend: 'down' },
]

const mockCurrentUser = {
  rank: 8,
  name: 'Juan Garcia',
  avatar: null,
  xp: 2850,
  isCurrentUser: true,
  trend: 'up' as const
}

// ============================================
// RANK ICON
// ============================================

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
      >
        <Crown className="w-4 h-4 text-white" />
      </motion.div>
    )
  }
  if (rank === 2) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1 }}
        className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30"
      >
        <Medal className="w-4 h-4 text-white" />
      </motion.div>
    )
  }
  if (rank === 3) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2 }}
        className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
      >
        <Award className="w-4 h-4 text-white" />
      </motion.div>
    )
  }
  return (
    <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
      {rank}
    </span>
  )
}

// ============================================
// TREND ICON
// ============================================

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'same' }) => {
  if (trend === 'up') {
    return <TrendingUp className="w-3 h-3 text-green-500" />
  }
  if (trend === 'down') {
    return <TrendingDown className="w-3 h-3 text-red-500" />
  }
  return <Minus className="w-3 h-3 text-slate-400" />
}

// ============================================
// MAIN COMPONENT
// ============================================

export function LeaderboardMini({
  className,
  period = 'weekly'
}: LeaderboardMiniProps) {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([])
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 600))
      setTopUsers(mockTopUsers)
      setCurrentUser(mockCurrentUser)
      setIsLoading(false)
    }
    fetchLeaderboard()
  }, [period])

  const periodLabels = {
    daily: 'Hoy',
    weekly: 'Esta semana',
    monthly: 'Este mes'
  }

  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clasificacion</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{periodLabels[period]}</p>
          </div>
        </div>
        <Link
          href="/clasificacion"
          className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline flex items-center gap-0.5"
        >
          Ver todo <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Top 3 */}
      <div className="space-y-2 mb-3">
        {topUsers.map((user, index) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-2.5 p-2 rounded-lg transition-colors',
              user.rank === 1 && 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30',
              user.rank === 2 && 'bg-slate-50 dark:bg-slate-800/50',
              user.rank === 3 && 'bg-orange-50/50 dark:bg-orange-950/20'
            )}
          >
            <RankIcon rank={user.rank} />

            <Avatar
              name={user.name}
              src={user.avatar || undefined}
              size="sm"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <TrendIcon trend={user.trend} />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {user.xp.toLocaleString('es-ES')}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">XP</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current User Position (if not in top 3) */}
      {currentUser && currentUser.rank > 3 && (
        <>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-[10px] text-slate-400">...</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border border-red-200 dark:border-red-800/30"
          >
            <span className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
              {currentUser.rank}
            </span>

            <Avatar
              name={currentUser.name}
              src={currentUser.avatar || undefined}
              size="sm"
              bordered
              borderColor="primary"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-700 dark:text-red-300 truncate">
                {currentUser.name} <span className="text-xs">(Tu)</span>
              </p>
            </div>

            <div className="flex items-center gap-1">
              <TrendIcon trend={currentUser.trend} />
              <span className="text-sm font-bold text-red-700 dark:text-red-300">
                {currentUser.xp.toLocaleString('es-ES')}
              </span>
              <span className="text-[10px] text-red-600/70 dark:text-red-400/70">XP</span>
            </div>
          </motion.div>
        </>
      )}

      {/* CTA */}
      <Link href="/clasificacion">
        <motion.button
          type="button"
          className="w-full mt-3 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy className="w-3.5 h-3.5" />
          Ver clasificacion completa
        </motion.button>
      </Link>
    </motion.div>
  )
}

export default LeaderboardMini
