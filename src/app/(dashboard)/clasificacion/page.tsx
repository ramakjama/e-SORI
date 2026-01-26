'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Star, TrendingUp, TrendingDown, Minus, Award, Crown,
  Medal, Gift, Calendar, ChevronRight, History, Target, Sparkles,
  Users, Percent, ArrowUp, ArrowDown
} from 'lucide-react'
import { LeaderboardCard } from '@/components/gamification/LeaderboardCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly'

interface UserPosition {
  rank: number
  xpEarned: number
  percentile: number
  usersAhead: number
  usersBehind: number
}

interface HistoricalPosition {
  period: string
  periodLabel: string
  rank: number
  xpEarned: number
  totalParticipants: number
  trend: 'up' | 'down' | 'same'
  change: number
}

interface PrizeInfo {
  period: LeaderboardPeriod
  periodLabel: string
  prizes: {
    position: string
    reward: string
    icon: string
    description: string
  }[]
}

// ============================================
// PRIZE CONFIGURATION
// ============================================

const PRIZES: PrizeInfo[] = [
  {
    period: 'daily',
    periodLabel: 'Diario',
    prizes: [
      { position: 'Top 1', reward: '50 coins', icon: '&#x1F947;', description: 'Mejor del dia' },
      { position: 'Top 2-3', reward: '30 coins', icon: '&#x1F948;', description: 'Podio diario' },
      { position: 'Top 4-10', reward: '10 coins', icon: '&#x2B50;', description: 'Top 10 del dia' },
    ],
  },
  {
    period: 'weekly',
    periodLabel: 'Semanal',
    prizes: [
      { position: 'Top 1', reward: '200 coins', icon: '&#x1F947;', description: 'Campeon semanal' },
      { position: 'Top 2-3', reward: '100 coins', icon: '&#x1F948;', description: 'Podio semanal' },
      { position: 'Top 4-10', reward: '50 coins', icon: '&#x2B50;', description: 'Top 10 semanal' },
    ],
  },
  {
    period: 'monthly',
    periodLabel: 'Mensual',
    prizes: [
      { position: 'Top 1', reward: '1000 coins + Regalo', icon: '&#x1F451;', description: 'Leyenda mensual' },
      { position: 'Top 2-3', reward: '500 coins', icon: '&#x1F48E;', description: 'Elite mensual' },
      { position: 'Top 4-10', reward: '100 coins', icon: '&#x1F3C6;', description: 'Top 10 mensual' },
    ],
  },
]

// ============================================
// MOCK DATA - Replace with API calls
// ============================================

const mockHistoricalPositions: HistoricalPosition[] = [
  { period: 'weekly_2025-W04', periodLabel: 'Semana 4, 2025', rank: 5, xpEarned: 1250, totalParticipants: 156, trend: 'up', change: 3 },
  { period: 'weekly_2025-W03', periodLabel: 'Semana 3, 2025', rank: 8, xpEarned: 980, totalParticipants: 142, trend: 'down', change: 2 },
  { period: 'weekly_2025-W02', periodLabel: 'Semana 2, 2025', rank: 6, xpEarned: 1100, totalParticipants: 138, trend: 'up', change: 4 },
  { period: 'weekly_2025-W01', periodLabel: 'Semana 1, 2025', rank: 10, xpEarned: 850, totalParticipants: 125, trend: 'same', change: 0 },
  { period: 'monthly_2024-12', periodLabel: 'Diciembre 2024', rank: 12, xpEarned: 3200, totalParticipants: 198, trend: 'up', change: 5 },
]

// ============================================
// COMPONENTS
// ============================================

// User Position Card Component
function UserPositionCard() {
  const { user } = useStore()
  const [position, setPosition] = useState<UserPosition | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosition = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/leaderboard/weekly')
        if (response.ok) {
          const data = await response.json()
          setPosition(data.currentUserPosition)
        }
      } catch (error) {
        console.error('Error fetching position:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosition()
  }, [])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'PLATINO': return 'from-purple-500 to-purple-600'
      case 'ORO': return 'from-yellow-500 to-amber-500'
      case 'PLATA': return 'from-gray-400 to-gray-500'
      default: return 'from-orange-600 to-orange-700'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'PLATINO': return <Crown className="w-6 h-6" />
      case 'ORO': return <Trophy className="w-6 h-6" />
      case 'PLATA': return <Medal className="w-6 h-6" />
      default: return <Award className="w-6 h-6" />
    }
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card variant="premium" className="overflow-hidden">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <CardContent className="relative z-10 p-6">
            <div className="flex items-start gap-4">
              {/* Avatar & Level */}
              <div className="relative">
                <Avatar
                  src={user.avatar || undefined}
                  name={user.name || 'Usuario'}
                  size="2xl"
                  bordered
                  borderColor="premium"
                />
                <div className={cn(
                  'absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg',
                  `bg-gradient-to-br ${getLevelColor(user.level)}`
                )}>
                  {getLevelIcon(user.level)}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white',
                    `bg-gradient-to-r ${getLevelColor(user.level)}`
                  )}>
                    {getLevelIcon(user.level)}
                    <span className="ml-1">{user.level}</span>
                  </span>
                  <Badge variant="success" size="sm">
                    <Star className="w-3 h-3 mr-1" />
                    {user.points.toLocaleString()} pts
                  </Badge>
                </div>
              </div>
            </div>

            {/* Position Stats */}
            {loading ? (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <Skeleton variant="text" width="60%" height={32} className="mx-auto" />
                    <Skeleton variant="text" width="80%" height={16} className="mx-auto mt-1" />
                  </div>
                ))}
              </div>
            ) : position ? (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                      #{position.rank}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Posicion actual
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-center gap-1">
                    <Percent className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">
                      Top {position.percentile}%
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Percentil
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                      {position.xpEarned.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    XP esta semana
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="mt-6 text-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50">
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Participa para aparecer en el ranking
                </p>
              </div>
            )}

            {/* Progress to next position */}
            {position && position.usersAhead > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-3 rounded-xl bg-gradient-to-r from-occident/10 to-purple-500/10 border border-occident/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-occident" />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {position.usersAhead} usuarios por delante
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Sigue sumando XP
                  </span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}

// Prizes Section Component
function PrizesSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('weekly')
  const currentPrizes = PRIZES.find(p => p.period === selectedPeriod)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-occident" />
            Premios por periodo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Period Selector */}
          <div className="flex gap-2 mb-4">
            {PRIZES.map((prize) => (
              <button
                key={prize.period}
                type="button"
                onClick={() => setSelectedPeriod(prize.period)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all',
                  selectedPeriod === prize.period
                    ? 'bg-occident text-white shadow-lg shadow-occident/30'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
                style={{
                  color: selectedPeriod === prize.period ? undefined : 'var(--color-text-secondary)'
                }}
              >
                {prize.periodLabel}
              </button>
            ))}
          </div>

          {/* Prizes List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPeriod}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {currentPrizes?.prizes.map((prize, index) => (
                <motion.div
                  key={prize.position}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800"
                >
                  <span className="text-3xl" dangerouslySetInnerHTML={{ __html: prize.icon }} />
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {prize.position}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {prize.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600 dark:text-amber-400">
                      {prize.reward}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Historical Positions Component
function HistoricalPositions() {
  const [history, setHistory] = useState<HistoricalPosition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call - Replace with actual API
    const fetchHistory = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setHistory(mockHistoricalPositions)
      setLoading(false)
    }
    fetchHistory()
  }, [])

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-slate-400" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-slate-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-occident" />
            Historial de posiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton variant="text" width={100} />
                  <div className="flex-1">
                    <Skeleton variant="text" width="60%" />
                  </div>
                  <Skeleton variant="text" width={60} />
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Aun no tienes historial
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => (
                <motion.div
                  key={item.period}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-24 flex-shrink-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {item.periodLabel.split(',')[0]}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {item.periodLabel.split(',')[1]}
                    </p>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        #{item.rank}
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        {item.change > 0 && (
                          <span className={cn('text-xs font-medium', getTrendColor(item.trend))}>
                            {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}{item.change}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {item.xpEarned.toLocaleString()} XP
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      de {item.totalParticipants}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* View More Button */}
          {history.length > 0 && (
            <button
              type="button"
              className="w-full mt-4 py-2 px-4 text-sm font-medium text-occident hover:bg-occident/10 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Ver historial completo
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ClasificacionPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-occident/10 rounded-full mb-4">
          <Trophy className="w-5 h-5 text-occident" />
          <span className="font-medium" style={{ color: 'var(--color-text)' }}>
            Ranking e-SORI
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Clasificacion
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Compite con otros usuarios y gana premios exclusivos
        </p>
      </motion.div>

      {/* User Position Card */}
      <UserPositionCard />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaderboard - Takes 2 columns */}
        <div className="lg:col-span-2">
          <LeaderboardCard
            showHeader={true}
            maxUsers={10}
            showCountdown={true}
            showUserPosition={true}
            showPrizes={false}
            initialPeriod="weekly"
          />
        </div>

        {/* Sidebar - Prizes & History */}
        <div className="space-y-6">
          <PrizesSection />
          <HistoricalPositions />
        </div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="glass" className="overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Target className="w-5 h-5 text-occident" />
              Como subir en el ranking
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Star className="w-5 h-5" />, title: 'Completa retos', desc: '+50 XP por reto', color: 'text-yellow-500' },
                { icon: <Users className="w-5 h-5" />, title: 'Refiere amigos', desc: '+100 XP por referido', color: 'text-blue-500' },
                { icon: <Calendar className="w-5 h-5" />, title: 'Visita diaria', desc: '+10 XP cada dia', color: 'text-green-500' },
                { icon: <Sparkles className="w-5 h-5" />, title: 'Juega a la ruleta', desc: 'XP aleatorio', color: 'text-purple-500' },
              ].map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className={cn('flex-shrink-0', tip.color)}>
                    {tip.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                      {tip.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {tip.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
