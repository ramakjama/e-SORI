'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Trophy, Star, CheckCircle, Lock, Clock,
  TrendingUp, Award, Gift, Zap, Calendar, Flame
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Mission,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  PROFILE_MISSIONS,
  calculatePointsWithMultiplier,
} from '@/lib/gamification-engine'
import Confetti from 'react-confetti'

interface MissionsPanelProps {
  userLevel: 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO' | 'DIAMANTE'
  profileCompletion: number
}

export function MissionsPanel({ userLevel, profileCompletion }: MissionsPanelProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'profile'>('daily')
  const [showConfetti, setShowConfetti] = useState(false)

  // Simular progreso de misiones (en producción vendría del backend)
  const dailyMissions: Mission[] = DAILY_MISSIONS.map((m, i) => ({
    ...m,
    progress: { current: i === 0 ? 1 : 0, target: 1 },
    completed: i === 0,
  }))

  const weeklyMissions: Mission[] = WEEKLY_MISSIONS.map((m, i) => ({
    ...m,
    progress: { current: i === 0 ? 3 : 0, target: 5 },
    completed: false,
  }))

  const profileMissions: Mission[] = PROFILE_MISSIONS.map((m) => {
    const sectionId = m.id.replace('profile_', '')
    const progress = sectionId === 'master' ? profileCompletion : Math.floor(Math.random() * 100)
    return {
      ...m,
      progress: { current: progress, target: 100 },
      completed: progress >= 100,
    }
  })

  const getMissions = () => {
    switch (activeTab) {
      case 'daily':
        return dailyMissions
      case 'weekly':
        return weeklyMissions
      case 'profile':
        return profileMissions
      default:
        return []
    }
  }

  const missions = getMissions()
  const completedCount = missions.filter((m) => m.completed).length
  const totalCount = missions.length

  const handleClaimReward = (mission: Mission) => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    // Aquí iría la lógica para reclamar la recompensa
  }

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Target className="w-6 h-6 text-occident" />
            Misiones
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Completa misiones para ganar puntos y recompensas
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Progreso</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            {completedCount}/{totalCount}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab('daily')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            activeTab === 'daily'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-occident'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Calendar className="w-4 h-4" />
          Diarias
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs',
            activeTab === 'daily' ? 'bg-occident/10 text-occident' : 'bg-slate-200 dark:bg-slate-600'
          )}>
            {dailyMissions.filter(m => m.completed).length}/{dailyMissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('weekly')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            activeTab === 'weekly'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-occident'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Flame className="w-4 h-4" />
          Semanales
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs',
            activeTab === 'weekly' ? 'bg-occident/10 text-occident' : 'bg-slate-200 dark:bg-slate-600'
          )}>
            {weeklyMissions.filter(m => m.completed).length}/{weeklyMissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            activeTab === 'profile'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-occident'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Trophy className="w-4 h-4" />
          Perfil
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs',
            activeTab === 'profile' ? 'bg-occident/10 text-occident' : 'bg-slate-200 dark:bg-slate-600'
          )}>
            {profileMissions.filter(m => m.completed).length}/{profileMissions.length}
          </span>
        </button>
      </div>

      {/* Missions List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-3"
        >
          {missions.map((mission, index) => {
            const progress = (mission.progress.current / mission.progress.target) * 100
            const pointsWithMultiplier = calculatePointsWithMultiplier(mission.points, userLevel)

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'card p-4 transition-all hover:shadow-lg',
                  mission.completed && 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
                    mission.completed
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-occident/10'
                  )}>
                    {mission.completed ? '✅' : mission.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                          {mission.title}
                          {mission.type === 'daily' && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                              Diaria
                            </span>
                          )}
                          {mission.type === 'weekly' && (
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                              Semanal
                            </span>
                          )}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                          {mission.description}
                        </p>
                      </div>

                      {mission.completed ? (
                        <button
                          onClick={() => handleClaimReward(mission)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <Gift className="w-4 h-4" />
                          Reclamar
                        </button>
                      ) : (
                        <div className="text-right">
                          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Recompensa</p>
                          <p className="font-bold text-occident">+{pointsWithMultiplier} pts</p>
                          <p className="text-xs text-green-600">+{mission.xp} XP</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!mission.completed && (
                      <div>
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <span>Progreso</span>
                          <span>{mission.progress.current}/{mission.progress.target}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-occident to-red-500 rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    {mission.reward && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {mission.reward.badge && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Badge
                          </span>
                        )}
                        {mission.reward.discount && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {mission.reward.discount}% dto
                          </span>
                        )}
                        {mission.reward.coins && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {mission.reward.coins} monedas
                          </span>
                        )}
                        {mission.reward.multiplier && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            x{mission.reward.multiplier} multiplicador
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {missions.length === 0 && (
        <div className="card p-12 text-center">
          <Lock className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            No hay misiones disponibles
          </h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Vuelve mañana para nuevas misiones
          </p>
        </div>
      )}
    </div>
  )
}
