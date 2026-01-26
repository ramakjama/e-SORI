'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Trophy, Flame, Shield, Star, Clock,
  CheckCircle, XCircle, Award, TrendingUp, Calendar,
  ChevronRight, Sparkles, Zap, Gift, History,
  Play, Filter, Medal, Crown, Coins, BarChart3,
  ArrowUp, Lock
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn, formatDateShort } from '@/lib/utils'
import { DailyQuizWidget } from '@/components/gamification/DailyQuizWidget'

// ============================================================================
// Types
// ============================================================================

interface QuizHistoryItem {
  id: string
  date: string
  score: number
  totalQuestions: number
  xpEarned: number
  coinsEarned: number
  perfectBonus: boolean
}

interface QuizStats {
  totalCompleted: number
  currentStreak: number
  bestStreak: number
  averageScore: number
  totalXP: number
  totalCoins: number
  perfectQuizzes: number
}

interface QuizBadge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

interface DailyQuizData {
  id: string
  date: string
  alreadyCompleted: boolean
  previousScore?: number
  previousXP?: number
  previousCoins?: number
}

// ============================================================================
// Mock Data
// ============================================================================

const mockQuizHistory: QuizHistoryItem[] = [
  { id: '1', date: '2024-06-26', score: 5, totalQuestions: 5, xpEarned: 120, coinsEarned: 60, perfectBonus: true },
  { id: '2', date: '2024-06-25', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
  { id: '3', date: '2024-06-24', score: 5, totalQuestions: 5, xpEarned: 120, coinsEarned: 60, perfectBonus: true },
  { id: '4', date: '2024-06-23', score: 3, totalQuestions: 5, xpEarned: 60, coinsEarned: 30, perfectBonus: false },
  { id: '5', date: '2024-06-22', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
  { id: '6', date: '2024-06-21', score: 5, totalQuestions: 5, xpEarned: 120, coinsEarned: 60, perfectBonus: true },
  { id: '7', date: '2024-06-20', score: 2, totalQuestions: 5, xpEarned: 40, coinsEarned: 20, perfectBonus: false },
  { id: '8', date: '2024-06-19', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
  { id: '9', date: '2024-06-18', score: 3, totalQuestions: 5, xpEarned: 60, coinsEarned: 30, perfectBonus: false },
  { id: '10', date: '2024-06-17', score: 5, totalQuestions: 5, xpEarned: 120, coinsEarned: 60, perfectBonus: true },
  { id: '11', date: '2024-06-16', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
  { id: '12', date: '2024-06-15', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
]

const mockStats: QuizStats = {
  totalCompleted: 42,
  currentStreak: 5,
  bestStreak: 12,
  averageScore: 4.1,
  totalXP: 3360,
  totalCoins: 1680,
  perfectQuizzes: 8
}

const quizBadges: QuizBadge[] = [
  {
    id: 'FIRST_QUIZ',
    name: 'Primer Quiz',
    description: 'Completa tu primer quiz diario',
    icon: '🎯',
    requirement: '1 quiz completado',
    unlocked: true,
    unlockedAt: '2024-05-15'
  },
  {
    id: 'PERFECT_QUIZ',
    name: 'Perfeccionista',
    description: 'Consigue 5/5 en un quiz',
    icon: '💯',
    requirement: '5/5 correctas',
    unlocked: true,
    unlockedAt: '2024-05-20'
  },
  {
    id: 'STREAK_3',
    name: 'Constante',
    description: 'Mantén una racha de 3 días',
    icon: '🔥',
    requirement: '3 días seguidos',
    unlocked: true,
    unlockedAt: '2024-05-18'
  },
  {
    id: 'STREAK_7',
    name: 'Comprometido',
    description: 'Mantén una racha de 7 días',
    icon: '⚡',
    requirement: '7 días seguidos',
    unlocked: true,
    unlockedAt: '2024-06-01'
  },
  {
    id: 'STREAK_14',
    name: 'Dedicado',
    description: 'Mantén una racha de 14 días',
    icon: '🌟',
    requirement: '14 días seguidos',
    unlocked: false,
    progress: 5,
    maxProgress: 14
  },
  {
    id: 'STREAK_30',
    name: 'Maestro de la Constancia',
    description: 'Mantén una racha de 30 días',
    icon: '👑',
    requirement: '30 días seguidos',
    unlocked: false,
    progress: 5,
    maxProgress: 30
  },
  {
    id: 'PERFECT_10',
    name: 'Experto',
    description: 'Consigue 10 quizzes perfectos',
    icon: '🏆',
    requirement: '10 quizzes perfectos',
    unlocked: false,
    progress: 8,
    maxProgress: 10
  },
  {
    id: 'TOTAL_50',
    name: 'Veterano',
    description: 'Completa 50 quizzes',
    icon: '🎖️',
    requirement: '50 quizzes completados',
    unlocked: false,
    progress: 42,
    maxProgress: 50
  },
  {
    id: 'XP_5000',
    name: 'Acumulador',
    description: 'Gana 5000 XP en quizzes',
    icon: '💎',
    requirement: '5000 XP ganados',
    unlocked: false,
    progress: 3360,
    maxProgress: 5000
  },
  {
    id: 'SPEEDSTER',
    name: 'Veloz',
    description: 'Responde todas las preguntas en menos de 5 segundos',
    icon: '⏱️',
    requirement: 'Quiz rapido',
    unlocked: false
  },
  {
    id: 'COMEBACK',
    name: 'Remontada',
    description: 'Recupera tu racha con un escudo',
    icon: '🛡️',
    requirement: 'Usar escudo',
    unlocked: true,
    unlockedAt: '2024-06-10'
  },
  {
    id: 'INSURANCE_EXPERT',
    name: 'Experto en Seguros',
    description: 'Responde 50 preguntas de seguros correctamente',
    icon: '🏛️',
    requirement: '50 correctas en seguros',
    unlocked: false,
    progress: 38,
    maxProgress: 50
  }
]

// ============================================================================
// Components
// ============================================================================

// Score Bar Chart Component
function ScoreBarChart({ history }: { history: QuizHistoryItem[] }) {
  const last7Days = useMemo(() => {
    const result = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const quiz = history.find(h => h.date === dateStr)

      result.push({
        date: dateStr,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        score: quiz?.score || 0,
        hasQuiz: !!quiz
      })
    }

    return result
  }, [history])

  return (
    <div className="flex items-end justify-between gap-2 h-32 px-2">
      {last7Days.map((day, index) => {
        const heightPercent = day.hasQuiz ? (day.score / 5) * 100 : 0
        const isPerfect = day.score === 5

        return (
          <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${heightPercent}%` }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className={cn(
                'w-full max-w-[40px] rounded-t-lg relative min-h-[4px]',
                day.hasQuiz
                  ? isPerfect
                    ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                    : day.score >= 3
                    ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                    : 'bg-gradient-to-t from-slate-400 to-slate-300'
                  : 'bg-slate-200 dark:bg-slate-700'
              )}
            >
              {day.hasQuiz && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                  {day.score}
                </span>
              )}
              {isPerfect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </motion.div>
              )}
            </motion.div>
            <span className="text-xs capitalize" style={{ color: 'var(--color-text-secondary)' }}>
              {day.dayName}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Badge Card Component
function BadgeCard({ badge, index }: { badge: QuizBadge; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'relative p-4 rounded-2xl text-center transition-all',
        badge.unlocked
          ? 'bg-gradient-to-br from-occident/10 to-purple-500/10 border-2 border-occident/30'
          : 'opacity-60 grayscale'
      )}
      style={{ backgroundColor: badge.unlocked ? undefined : 'var(--color-card)' }}
    >
      {!badge.unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
        </div>
      )}

      <span className="text-4xl block mb-2">{badge.icon}</span>
      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
        {badge.name}
      </p>
      <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
        {badge.unlocked ? badge.description : badge.requirement}
      </p>

      {badge.unlocked && (
        <div className="flex items-center justify-center gap-1">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-emerald-500">
            {badge.unlockedAt && formatDateShort(badge.unlockedAt)}
          </span>
        </div>
      )}

      {!badge.unlocked && badge.progress !== undefined && badge.maxProgress !== undefined && (
        <div className="mt-2">
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-occident to-purple-500 rounded-full"
            />
          </div>
          <span className="text-xs mt-1 block" style={{ color: 'var(--color-text-tertiary)' }}>
            {badge.progress}/{badge.maxProgress}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// Stats Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  delay = 0
}: {
  icon: React.ElementType
  label: string
  value: string | number
  subtext?: string
  color: string
  delay?: number
}) {
  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: 'text-emerald-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: 'text-amber-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', icon: 'text-orange-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: 'text-purple-500' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: 'text-blue-500' },
    slate: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', icon: 'text-slate-500' }
  }

  const colors = colorClasses[color] || colorClasses.slate

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl"
      style={{ backgroundColor: 'var(--color-card)' }}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', colors.bg)}>
        <Icon className={cn('w-5 h-5', colors.icon)} />
      </div>
      <p className={cn('text-2xl font-bold', colors.text)}>
        {value}
      </p>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </p>
      {subtext && (
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
          {subtext}
        </p>
      )}
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function QuizzesPage() {
  const { user } = useStore()

  // State
  const [stats] = useState<QuizStats>(mockStats)
  const [quizHistory] = useState<QuizHistoryItem[]>(mockQuizHistory)
  const [badges] = useState<QuizBadge[]>(quizBadges)
  const [historyFilter, setHistoryFilter] = useState<'week' | 'month' | 'all'>('week')
  const [dailyQuizData, setDailyQuizData] = useState<DailyQuizData | null>(null)
  const [showQuizWidget, setShowQuizWidget] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch daily quiz data
  useEffect(() => {
    const fetchDailyQuiz = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/quiz/daily')
        if (response.ok) {
          const data = await response.json()
          setDailyQuizData(data)
        }
      } catch (error) {
        console.error('Error fetching daily quiz:', error)
        // Use mock data as fallback
        setDailyQuizData({
          id: 'mock-quiz',
          date: new Date().toISOString().split('T')[0],
          alreadyCompleted: false
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDailyQuiz()
  }, [])

  // Filtered history
  const filteredHistory = useMemo(() => {
    const now = new Date()
    return quizHistory.filter(quiz => {
      const quizDate = new Date(quiz.date)
      const diffDays = Math.floor((now.getTime() - quizDate.getTime()) / (1000 * 60 * 60 * 24))

      if (historyFilter === 'week') return diffDays <= 7
      if (historyFilter === 'month') return diffDays <= 30
      return true
    })
  }, [quizHistory, historyFilter])

  // Unlocked badges count
  const unlockedBadgesCount = useMemo(() => {
    return badges.filter(b => b.unlocked).length
  }, [badges])

  // Handle quiz completion
  const handleQuizComplete = useCallback((score: number, xpEarned: number, coinsEarned: number) => {
    console.log('Quiz completed:', { score, xpEarned, coinsEarned })
    setShowQuizWidget(false)
    // Refresh data
    setDailyQuizData(prev => prev ? { ...prev, alreadyCompleted: true, previousScore: score, previousXP: xpEarned, previousCoins: coinsEarned } : null)
  }, [])

  if (!user) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-occident/10 rounded-full mb-4">
              <Target className="w-5 h-5 text-occident" />
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>Aprende jugando</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Mis Quizzes
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Pon a prueba tus conocimientos y gana recompensas
            </p>
          </div>

          {/* Header Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 md:gap-6"
          >
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {stats.totalCompleted}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Completados
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500 flex items-center gap-1">
                <Flame className="w-5 h-5" />
                {stats.currentStreak}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Racha actual
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">
                {stats.averageScore.toFixed(1)}/5
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Media
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quiz del Dia Destacado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'relative overflow-hidden rounded-3xl p-6 md:p-8',
          dailyQuizData?.alreadyCompleted
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            : 'bg-gradient-to-r from-occident via-red-600 to-red-700'
        )}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : dailyQuizData?.alreadyCompleted ? (
            // Quiz completado hoy
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Quiz del dia completado</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {dailyQuizData.previousScore}/5 correctas
                </h2>
                <p className="text-white/80">
                  Has ganado +{dailyQuizData.previousXP} XP y +{dailyQuizData.previousCoins} COINS
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <Zap className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">+{dailyQuizData.previousXP}</p>
                  <p className="text-sm text-white/80">XP</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <Coins className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">+{dailyQuizData.previousCoins}</p>
                  <p className="text-sm text-white/80">COINS</p>
                </div>
              </div>
            </div>
          ) : (
            // Quiz disponible
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Target className="w-6 h-6" />
                  </motion.div>
                  <span className="font-semibold">Quiz del dia disponible</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">NUEVO</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  5 preguntas sobre seguros
                </h2>
                <p className="text-white/80 mb-4">
                  Gana hasta 120 XP y 60 COINS. Mantén tu racha de {stats.currentStreak} días.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">+100 XP max</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm font-medium">+50 COINS max</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">30s por pregunta</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuizWidget(true)}
                className="flex items-center gap-3 px-8 py-4 bg-white text-occident font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="w-6 h-6" />
                JUGAR AHORA
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={Trophy}
          label="Completados"
          value={stats.totalCompleted}
          color="amber"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Racha actual"
          value={stats.currentStreak}
          subtext={`Mejor: ${stats.bestStreak}`}
          color="orange"
          delay={0.15}
        />
        <StatCard
          icon={Star}
          label="Perfectos"
          value={stats.perfectQuizzes}
          color="emerald"
          delay={0.2}
        />
        <StatCard
          icon={TrendingUp}
          label="Media"
          value={`${stats.averageScore.toFixed(1)}/5`}
          color="blue"
          delay={0.25}
        />
        <StatCard
          icon={Zap}
          label="XP Total"
          value={stats.totalXP.toLocaleString()}
          color="purple"
          delay={0.3}
        />
        <StatCard
          icon={Coins}
          label="COINS Total"
          value={stats.totalCoins.toLocaleString()}
          color="amber"
          delay={0.35}
        />
      </div>

      {/* Chart + Streak Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Grafico de puntuaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <BarChart3 className="w-5 h-5 text-occident" />
              Ultimos 7 dias
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span style={{ color: 'var(--color-text-secondary)' }}>Perfecto</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span style={{ color: 'var(--color-text-secondary)' }}>Bueno</span>
              </div>
            </div>
          </div>
          <ScoreBarChart history={quizHistory} />
        </motion.div>

        {/* Racha y Escudos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Flame className="w-5 h-5 text-orange-500" />
            Racha y Bonificaciones
          </h3>

          <div className="flex items-center gap-6 mb-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-white">{stats.currentStreak}</span>
            </motion.div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                {stats.currentStreak} días consecutivos
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Tu mejor racha: {stats.bestStreak} días
              </p>
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500 font-medium">
                  +{Math.min(stats.currentStreak * 2, 20)} XP bonus por racha
                </span>
              </div>
            </div>
          </div>

          {/* Escudos */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--color-card)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                  Escudos disponibles
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      i < 2 ? 'bg-blue-500/20' : 'bg-slate-200 dark:bg-slate-700'
                    )}
                  >
                    <Shield className={cn(
                      'w-4 h-4',
                      i < 2 ? 'text-blue-500' : 'text-slate-400'
                    )} />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Los escudos protegen tu racha si pierdes un día
            </p>
          </div>
        </motion.div>
      </div>

      {/* Logros de Quiz */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Award className="w-5 h-5 text-occident" />
            Logros de Quiz
          </h3>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-occident/10 text-occident">
            {unlockedBadgesCount}/{badges.length} desbloqueados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <BadgeCard key={badge.id} badge={badge} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Historial de Quizzes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <History className="w-5 h-5 text-occident" />
            Historial de Quizzes
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value as 'week' | 'month' | 'all')}
              title="Filtrar historial por periodo"
              aria-label="Filtrar historial por periodo"
              className="text-sm rounded-lg px-3 py-1.5 border outline-none focus:ring-2 focus:ring-occident/20"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        {/* Grid de cards en lugar de tabla */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHistory.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'p-4 rounded-xl border-l-4 transition-all hover:shadow-md',
                quiz.perfectBonus
                  ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : quiz.score >= 3
                  ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                  : 'border-l-slate-400'
              )}
              style={{ backgroundColor: quiz.score < 3 ? 'var(--color-card)' : undefined }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {formatDateShort(quiz.date)}
                  </span>
                </div>
                {quiz.perfectBonus && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20">
                    <Trophy className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Perfecto
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {quiz.score}/{quiz.totalQuestions}
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-emerald-500">+{quiz.xpEarned}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-amber-500">+{quiz.coinsEarned}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>COINS</p>
                  </div>
                </div>
              </div>

              {/* Mini bar visualization */}
              <div className="flex gap-1">
                {[...Array(quiz.totalQuestions)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full',
                      i < quiz.score
                        ? quiz.perfectBonus
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    )}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No hay quizzes en este periodo
            </p>
          </div>
        )}

        {filteredHistory.length > 0 && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setHistoryFilter('all')}
              className="text-sm font-medium text-occident hover:underline"
            >
              Ver todo el historial
            </button>
          </div>
        )}
      </motion.div>

      {/* DailyQuizWidget */}
      {showQuizWidget && (
        <DailyQuizWidget onComplete={handleQuizComplete} />
      )}
    </div>
  )
}
