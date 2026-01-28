'use client'

/**
 * QUIZZES - Versión Optimizada
 * Sistema simplificado de quizzes sin animaciones pesadas
 */

import { useState } from 'react'
import {
  Target, Trophy, Flame, Star, Clock, CheckCircle,
  Award, Calendar, Sparkles, Coins, BarChart3
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn, formatDateShort } from '@/lib/utils'
import { DailyQuizWidget } from '@/components/gamification/DailyQuizWidget'

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
  progress?: number
  maxProgress?: number
}

// Mock Data
const mockQuizHistory: QuizHistoryItem[] = [
  { id: '1', date: '2024-06-26', score: 5, totalQuestions: 5, xpEarned: 120, coinsEarned: 60, perfectBonus: true },
  { id: '2', date: '2024-06-25', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
  { id: '3', date: '2024-06-24', score: 5, totalQuestions: 5, xpEarned: 120, coinsEarned: 60, perfectBonus: true },
  { id: '4', date: '2024-06-23', score: 3, totalQuestions: 5, xpEarned: 60, coinsEarned: 30, perfectBonus: false },
  { id: '5', date: '2024-06-22', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
  { id: '6', date: '2024-06-21', score: 5, totalQuestions: 5, xpEarned: 120, coinsEarned: 60, perfectBonus: true },
  { id: '7', date: '2024-06-20', score: 2, totalQuestions: 5, xpEarned: 40, coinsEarned: 20, perfectBonus: false },
  { id: '8', date: '2024-06-19', score: 4, totalQuestions: 5, xpEarned: 80, coinsEarned: 40, perfectBonus: false },
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
  },
  {
    id: 'PERFECT_QUIZ',
    name: 'Perfeccionista',
    description: 'Consigue 5/5 en un quiz',
    icon: '💯',
    requirement: '5/5 correctas',
    unlocked: true,
  },
  {
    id: 'STREAK_3',
    name: 'Constante',
    description: 'Mantén una racha de 3 días',
    icon: '🔥',
    requirement: '3 días seguidos',
    unlocked: true,
  },
  {
    id: 'STREAK_7',
    name: 'Comprometido',
    description: 'Mantén una racha de 7 días',
    icon: '⚡',
    requirement: '7 días seguidos',
    unlocked: true,
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
    id: 'PERFECT_10',
    name: 'Experto',
    description: 'Consigue 10 quizzes perfectos',
    icon: '💎',
    requirement: '10 quizzes 5/5',
    unlocked: false,
    progress: 8,
    maxProgress: 10
  },
]

export default function QuizzesPage() {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState<'quiz' | 'history' | 'badges'>('quiz')
  const [showHistory, setShowHistory] = useState(false)

  const stats = mockStats

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-occident" />
            Quizzes Diarios
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Aprende y gana recompensas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
          <Flame className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-3xl font-bold">{stats.currentStreak}</div>
          <div className="text-sm opacity-90 mt-1">Racha actual</div>
          <div className="text-xs opacity-75 mt-1">Mejor: {stats.bestStreak} días</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-5 text-white">
          <Trophy className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-3xl font-bold">{stats.totalCompleted}</div>
          <div className="text-sm opacity-90 mt-1">Completados</div>
          <div className="text-xs opacity-75 mt-1">{stats.perfectQuizzes} perfectos</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-5 text-white">
          <Star className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-3xl font-bold">{stats.averageScore.toFixed(1)}</div>
          <div className="text-sm opacity-90 mt-1">Nota media</div>
          <div className="text-xs opacity-75 mt-1">sobre 5.0</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl p-5 text-white">
          <Coins className="w-8 h-8 mb-3 opacity-90" />
          <div className="text-3xl font-bold">{stats.totalCoins}</div>
          <div className="text-sm opacity-90 mt-1">Monedas ganadas</div>
          <div className="text-xs opacity-75 mt-1">{stats.totalXP} XP totales</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={cn(
            'px-4 py-3 font-medium transition-all border-b-2',
            activeTab === 'quiz'
              ? 'border-occident text-occident'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Quiz de Hoy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={cn(
            'px-4 py-3 font-medium transition-all border-b-2',
            activeTab === 'history'
              ? 'border-occident text-occident'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Historial
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('badges')}
          className={cn(
            'px-4 py-3 font-medium transition-all border-b-2',
            activeTab === 'badges'
              ? 'border-occident text-occident'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Award className="w-4 h-4 inline mr-2" />
          Insignias
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            <DailyQuizWidget />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Historial de Quizzes
              </h2>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {mockQuizHistory.length} quizzes recientes
              </div>
            </div>

            <div className="grid gap-3">
              {mockQuizHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Date */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center">
                      <div className="text-xs text-slate-500">
                        {formatDateShort(item.date).split(' ')[0]}
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {formatDateShort(item.date).split(' ')[1]}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.score}/{item.totalQuestions}
                      </div>
                      {item.perfectBonus && (
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                          Perfecto
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {item.score === item.totalQuestions ? 'Todas correctas' :
                       `${item.score} de ${item.totalQuestions} correctas`}
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold">+{item.xpEarned} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <Coins className="w-4 h-4" />
                      <span className="font-semibold">+{item.coinsEarned}</span>
                    </div>
                  </div>

                  {/* Visual Score */}
                  <div className="flex-shrink-0">
                    {item.score === item.totalQuestions ? (
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {Math.round((item.score / item.totalQuestions) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Insignias
              </h2>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {quizBadges.filter(b => b.unlocked).length} de {quizBadges.length} desbloqueadas
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all',
                    badge.unlocked
                      ? 'hover:shadow-lg'
                      : 'opacity-60'
                  )}
                >
                  <div className="text-center">
                    <div className={cn(
                      'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl',
                      badge.unlocked
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                        : 'bg-slate-200 dark:bg-slate-700 grayscale'
                    )}>
                      {badge.icon}
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {badge.description}
                    </p>

                    <div className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                      {badge.requirement}
                    </div>

                    {!badge.unlocked && badge.progress !== undefined && badge.maxProgress !== undefined && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <span>Progreso</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full bg-gradient-to-r from-occident to-red-700 rounded-full transition-all',
                              badge.progress / badge.maxProgress >= 0.75 ? 'w-3/4' :
                              badge.progress / badge.maxProgress >= 0.5 ? 'w-1/2' :
                              badge.progress / badge.maxProgress >= 0.25 ? 'w-1/4' : 'w-0'
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {badge.unlocked && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Desbloqueada</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
