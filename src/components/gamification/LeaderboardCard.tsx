'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Clock, Users, RefreshCw, Calendar, Star,
  ChevronUp, ChevronDown, Minus, Gift, Crown, Medal, Award
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@/components/ui/Tabs'
import { Skeleton, SkeletonAvatar } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly'

interface LeaderboardUser {
  rank: number
  userId: string
  name: string | null
  avatar: string | null
  level: string
  xpEarned: number
  isCurrentUser: boolean
}

interface CurrentUserPosition {
  rank: number
  xpEarned: number
  percentile: number
  usersAhead: number
  usersBehind: number
}

interface LeaderboardData {
  period: LeaderboardPeriod
  periodLabel: string
  periodStart: string
  periodEnd: string
  topUsers: LeaderboardUser[]
  currentUserPosition: CurrentUserPosition | null
  totalParticipants: number
  lastUpdated: string
}

interface PrizeInfo {
  positions: string
  reward: string
  icon: string
}

interface LeaderboardCardProps {
  className?: string
  showHeader?: boolean
  maxUsers?: number
  showCountdown?: boolean
  showUserPosition?: boolean
  showPrizes?: boolean
  compact?: boolean
  initialPeriod?: LeaderboardPeriod
}

// ============================================
// PRIZE CONFIGURATION
// ============================================

const PRIZES_CONFIG: Record<LeaderboardPeriod, PrizeInfo[]> = {
  daily: [
    { positions: '1', reward: '50 coins', icon: '&#x1F947;' },
    { positions: '2', reward: '30 coins', icon: '&#x1F948;' },
    { positions: '3', reward: '20 coins', icon: '&#x1F949;' },
    { positions: '4-10', reward: '10 coins', icon: '&#x2B50;' },
  ],
  weekly: [
    { positions: '1', reward: '200 coins', icon: '&#x1F947;' },
    { positions: '2', reward: '150 coins', icon: '&#x1F948;' },
    { positions: '3', reward: '100 coins', icon: '&#x1F949;' },
    { positions: '4-10', reward: '50 coins', icon: '&#x2B50;' },
  ],
  monthly: [
    { positions: '1', reward: '1000 coins + Regalo', icon: '&#x1F451;' },
    { positions: '2', reward: '500 coins', icon: '&#x1F48E;' },
    { positions: '3', reward: '300 coins', icon: '&#x1F3C6;' },
    { positions: '4-10', reward: '100 coins', icon: '&#x2B50;' },
  ],
}

// ============================================
// MEDAL COMPONENT
// ============================================

const RankMedal = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
        className="text-2xl"
        aria-label="Medalla de oro"
      >
        <span dangerouslySetInnerHTML={{ __html: '&#x1F947;' }} />
      </motion.span>
    )
  }
  if (rank === 2) {
    return (
      <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.3 }}
        className="text-2xl"
        aria-label="Medalla de plata"
      >
        <span dangerouslySetInnerHTML={{ __html: '&#x1F948;' }} />
      </motion.span>
    )
  }
  if (rank === 3) {
    return (
      <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.4 }}
        className="text-2xl"
        aria-label="Medalla de bronce"
      >
        <span dangerouslySetInnerHTML={{ __html: '&#x1F949;' }} />
      </motion.span>
    )
  }
  return (
    <span
      className="w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full"
      style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
    >
      {rank}
    </span>
  )
}

// ============================================
// COUNTDOWN COMPONENT
// ============================================

interface CountdownProps {
  periodEnd: string
  period: LeaderboardPeriod
}

const PeriodCountdown = ({ periodEnd, period }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(periodEnd).getTime()
      const now = new Date().getTime()
      const diff = Math.max(0, end - now)

      setIsUrgent(diff < 24 * 60 * 60 * 1000)

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTime())
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000)
    return () => clearInterval(timer)
  }, [periodEnd])

  const periodLabels = {
    daily: 'Reset diario',
    weekly: 'Reset semanal',
    monthly: 'Reset mensual',
  }

  const formatUnit = (value: number) => String(value).padStart(2, '0')

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-xl',
      isUrgent
        ? 'bg-occident text-white animate-pulse'
        : 'bg-occident/10'
    )}>
      <Clock className={cn('w-4 h-4', isUrgent ? 'text-white' : 'text-occident')} />
      <span className={cn(
        'text-xs font-medium',
        isUrgent ? 'text-white/80' : ''
      )} style={{ color: isUrgent ? undefined : 'var(--color-text-secondary)' }}>
        {periodLabels[period]}:
      </span>
      <span className={cn(
        'font-mono font-bold text-sm',
        isUrgent ? 'text-white' : 'text-occident'
      )}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {formatUnit(timeLeft.hours)}:{formatUnit(timeLeft.minutes)}:{formatUnit(timeLeft.seconds)}
      </span>
    </div>
  )
}

// ============================================
// LEADERBOARD ROW COMPONENT
// ============================================

interface LeaderboardRowProps {
  user: LeaderboardUser
  index: number
  isCurrentUser: boolean
}

const LeaderboardRow = ({ user, index, isCurrentUser }: LeaderboardRowProps) => {
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
      case 'PLATINO': return <Crown className="w-3 h-3" />
      case 'ORO': return <Trophy className="w-3 h-3" />
      case 'PLATA': return <Medal className="w-3 h-3" />
      default: return <Award className="w-3 h-3" />
    }
  }

  const getRowStyle = () => {
    if (user.rank === 1) {
      return 'bg-gradient-to-r from-amber-100/80 via-yellow-50/50 to-amber-100/80 dark:from-amber-900/30 dark:via-amber-800/20 dark:to-amber-900/30 border-amber-300 dark:border-amber-700'
    }
    if (user.rank === 2) {
      return 'bg-gradient-to-r from-slate-200/80 via-slate-100/50 to-slate-200/80 dark:from-slate-700/40 dark:via-slate-600/30 dark:to-slate-700/40 border-slate-300 dark:border-slate-600'
    }
    if (user.rank === 3) {
      return 'bg-gradient-to-r from-orange-100/80 via-amber-50/50 to-orange-100/80 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-orange-900/30 border-orange-300 dark:border-orange-700'
    }
    if (isCurrentUser) {
      return 'bg-gradient-to-r from-red-50 via-white to-red-50 dark:from-red-950/30 dark:via-slate-900 dark:to-red-950/30 border-red-300 dark:border-red-700'
    }
    return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100
      }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200',
        getRowStyle(),
        isCurrentUser && 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-900 shadow-lg shadow-occident/10'
      )}
    >
      {/* Rank */}
      <div className="w-10 flex-shrink-0 flex justify-center">
        <RankMedal rank={user.rank} />
      </div>

      {/* Avatar */}
      <Avatar
        src={user.avatar || undefined}
        name={user.name || 'Usuario'}
        size="md"
        bordered={user.rank <= 3 || isCurrentUser}
        borderColor={user.rank === 1 ? 'premium' : isCurrentUser ? 'primary' : 'default'}
      />

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'font-semibold truncate',
              isCurrentUser ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
            )}
          >
            {user.name || 'Usuario'}
            {isCurrentUser && <span className="text-xs ml-1">(Tu)</span>}
          </p>
          {user.rank === 1 && (
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium text-white',
              `bg-gradient-to-r ${getLevelColor(user.level)}`
            )}
          >
            {getLevelIcon(user.level)}
            {user.level}
          </span>
        </div>
      </div>

      {/* XP Points */}
      <div className="text-right flex-shrink-0">
        <motion.p
          className="font-bold text-lg text-slate-900 dark:text-white"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {user.xpEarned.toLocaleString('es-ES')}
        </motion.p>
        <p className="text-xs text-slate-500 dark:text-slate-400">XP</p>
      </div>
    </motion.div>
  )
}

// ============================================
// LOADING SKELETON
// ============================================

const LeaderboardSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <Skeleton variant="circular" width={32} height={32} />
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="30%" height={16} />
        </div>
        <div className="text-right space-y-2">
          <Skeleton variant="text" width={60} height={24} />
          <Skeleton variant="text" width={40} height={12} />
        </div>
      </div>
    ))}
  </div>
)

// ============================================
// PRIZES PANEL COMPONENT
// ============================================

interface PrizesPanelProps {
  prizes: PrizeInfo[]
  period: LeaderboardPeriod
}

const PrizesPanel = ({ prizes, period }: PrizesPanelProps) => {
  const periodLabels = {
    daily: 'diarios',
    weekly: 'semanales',
    monthly: 'mensuales',
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800"
    >
      <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
        <Gift className="w-4 h-4" />
        Premios {periodLabels[period]}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {prizes.map((prize, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 dark:bg-slate-800/70"
          >
            <span className="text-lg" dangerouslySetInnerHTML={{ __html: prize.icon }} />
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Top {prize.positions}
              </p>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {prize.reward}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function LeaderboardCard({
  className,
  showHeader = true,
  maxUsers = 10,
  showCountdown = true,
  showUserPosition = true,
  showPrizes = true,
  compact = false,
  initialPeriod = 'weekly',
}: LeaderboardCardProps) {
  const [activePeriod, setActivePeriod] = useState<LeaderboardPeriod>(initialPeriod)
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prizesVisible, setPrizesVisible] = useState(false)

  const fetchLeaderboard = useCallback(async (period: LeaderboardPeriod) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/leaderboard/${period}`)
      if (!response.ok) throw new Error('Error al cargar el ranking')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard(activePeriod)
  }, [activePeriod, fetchLeaderboard])

  const handleTabChange = (tabId: string) => {
    setActivePeriod(tabId as LeaderboardPeriod)
  }

  const periodTabs = [
    { id: 'daily', label: 'Diaria', shortLabel: 'Hoy' },
    { id: 'weekly', label: 'Semanal', shortLabel: 'Semana' },
    { id: 'monthly', label: 'Mensual', shortLabel: 'Mes' },
  ]

  return (
    <Card
      variant="elevated"
      padding={compact ? 'sm' : 'lg'}
      className={cn('overflow-hidden', className)}
    >
      {/* Header */}
      {showHeader && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-occident to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-occident/30">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block">Clasificacion e-SORI</span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  Top {maxUsers} jugadores
                </span>
              </div>
            </CardTitle>
            <button
              type="button"
              onClick={() => fetchLeaderboard(activePeriod)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Refrescar"
            >
              <RefreshCw
                className={cn('w-5 h-5', loading && 'animate-spin')}
                style={{ color: 'var(--color-text-secondary)' }}
              />
            </button>
          </div>
        </CardHeader>
      )}

      <CardContent>
        {/* Period Tabs */}
        <Tabs
          defaultTab={initialPeriod}
          variant="default"
          onTabChange={handleTabChange}
        >
          <TabList fullWidth className="mb-4">
            {periodTabs.map((tab) => (
              <Tab key={tab.id} id={tab.id} className="flex-1 justify-center">
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {periodTabs.map((tab) => (
              <TabPanel key={tab.id} id={tab.id}>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <LeaderboardSkeleton />
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <p className="text-red-500 mb-4">{error}</p>
                      <button
                        type="button"
                        onClick={() => fetchLeaderboard(activePeriod)}
                        className="px-4 py-2 bg-occident text-white rounded-xl hover:bg-occident/90 transition-colors"
                      >
                        Reintentar
                      </button>
                    </motion.div>
                  ) : data ? (
                    <motion.div
                      key="data"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Period Info & Countdown */}
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {data.totalParticipants.toLocaleString()} participantes
                          </span>
                        </div>
                        {showCountdown && (
                          <PeriodCountdown
                            periodEnd={data.periodEnd}
                            period={data.period}
                          />
                        )}
                      </div>

                      {/* Leaderboard List */}
                      <div className="space-y-2">
                        {data.topUsers.slice(0, maxUsers).map((user, index) => (
                          <LeaderboardRow
                            key={user.userId}
                            user={user}
                            index={index}
                            isCurrentUser={user.isCurrentUser}
                          />
                        ))}

                        {data.topUsers.length === 0 && (
                          <div className="text-center py-8">
                            <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                              Aun no hay participantes en este periodo
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Current User Position (if not in top) */}
                      {showUserPosition && data.currentUserPosition && data.currentUserPosition.rank > maxUsers && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-6 pt-4 border-t"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Tu posicion actual:
                          </p>
                          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-occident/10 to-purple-500/10 border-2 border-occident/30">
                            <div className="flex items-center gap-3">
                              <span
                                className="w-10 h-10 flex items-center justify-center text-sm font-bold rounded-full bg-occident text-white"
                              >
                                #{data.currentUserPosition.rank}
                              </span>
                              <div>
                                <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                                  Tu posicion
                                </p>
                                <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                  {data.currentUserPosition.usersAhead > 0 ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 text-green-500" />
                                      <span>{data.currentUserPosition.usersAhead} por delante</span>
                                    </>
                                  ) : (
                                    <>
                                      <Minus className="w-4 h-4" />
                                      <span>Eres el primero</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
                                {data.currentUserPosition.xpEarned.toLocaleString()} XP
                              </p>
                              <p className="text-sm text-green-500 font-medium">
                                Top {data.currentUserPosition.percentile}%
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Prizes Toggle */}
                      {showPrizes && (
                        <>
                          <button
                            type="button"
                            onClick={() => setPrizesVisible(!prizesVisible)}
                            className="w-full mt-4 py-2 px-4 text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Gift className="w-4 h-4" />
                            <span>{prizesVisible ? 'Ocultar' : 'Ver'} premios</span>
                            <motion.span
                              animate={{ rotate: prizesVisible ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.span>
                          </button>

                          <AnimatePresence>
                            {prizesVisible && (
                              <PrizesPanel prizes={PRIZES_CONFIG[activePeriod]} period={activePeriod} />
                            )}
                          </AnimatePresence>
                        </>
                      )}

                      {/* Footer Stats */}
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="info" size="sm">
                            {data.totalParticipants} participantes
                          </Badge>
                          {data.currentUserPosition && (
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                              Tu puesto: <span className="font-bold" style={{ color: 'var(--color-text)' }}>#{data.currentUserPosition.rank}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default LeaderboardCard
