'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Lock, Star, Sparkles, Calendar, Gift, Shield,
  Award, CheckCircle2, Filter
} from 'lucide-react'
import { ACHIEVEMENTS } from '@/lib/gamification-engine'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

// ============================================
// TYPES & CONSTANTS
// ============================================

type FilterCategory = 'Todos' | 'Perfil' | 'Actividad' | 'Social' | 'Seguros' | 'Educativo' | 'Nivel' | 'Lealtad' | 'Financiero'

const FILTER_TABS: FilterCategory[] = [
  'Todos', 'Perfil', 'Actividad', 'Social', 'Seguros', 'Educativo', 'Nivel', 'Lealtad', 'Financiero'
]

const UNLOCKED_IDS = ['first_steps', 'streak_7', 'policies_3', 'digital_master']

const RARITY_CONFIG = {
  common: {
    label: 'Comun',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-300 dark:border-green-700',
    glow: 'shadow-green-500/20',
  },
  rare: {
    label: 'Raro',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-300 dark:border-blue-700',
    glow: 'shadow-blue-500/20',
  },
  epic: {
    label: 'Epico',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-300 dark:border-purple-700',
    glow: 'shadow-purple-500/20',
  },
  legendary: {
    label: 'Legendario',
    bg: 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-400 dark:border-amber-600',
    glow: 'shadow-amber-500/30',
  },
}

// ============================================
// MOCK DATA: mark some achievements as unlocked
// ============================================

const achievementsData = ACHIEVEMENTS.map((a) => {
  const isUnlocked = UNLOCKED_IDS.includes(a.id)
  return {
    ...a,
    unlocked: isUnlocked,
    unlockedAt: isUnlocked ? new Date('2025-01-15') : undefined,
  }
})

// ============================================
// COMPONENTS
// ============================================

function RarityBadge({ rarity }: { rarity: keyof typeof RARITY_CONFIG }) {
  const config = RARITY_CONFIG[rarity]
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border',
      config.bg, config.text, config.border
    )}>
      {rarity === 'legendary' && <Sparkles className="w-3 h-3 mr-1" />}
      {config.label}
    </span>
  )
}

function AchievementCard({ achievement, index }: { achievement: typeof achievementsData[0]; index: number }) {
  const config = RARITY_CONFIG[achievement.rarity]
  const isUnlocked = achievement.unlocked

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        'relative rounded-2xl border p-5 transition-all',
        isUnlocked
          ? `bg-white dark:bg-slate-800/80 ${config.border} shadow-lg ${config.glow}`
          : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-70'
      )}
    >
      {/* Lock overlay for locked achievements */}
      {!isUnlocked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-slate-400" />
        </div>
      )}

      {/* Unlocked check */}
      {isUnlocked && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        'text-4xl mb-3',
        !isUnlocked && 'grayscale opacity-50'
      )}>
        {achievement.icon}
      </div>

      {/* Name */}
      <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
        {achievement.name}
      </h3>

      {/* Description */}
      <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
        {achievement.description}
      </p>

      {/* Rarity badge */}
      <RarityBadge rarity={achievement.rarity} />

      {/* Progress bar for locked */}
      {!isUnlocked && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>Progreso</span>
            <span>{Math.floor(Math.random() * 70)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-slate-400 dark:bg-slate-500"
              style={{ width: `${Math.floor(Math.random() * 70)}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlock date */}
      {isUnlocked && achievement.unlockedAt && (
        <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          <Calendar className="w-3 h-3" />
          {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(achievement.unlockedAt)}
        </div>
      )}

      {/* Reward info */}
      <div className="mt-2 flex flex-wrap gap-1">
        {achievement.reward.points && (
          <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <Star className="w-3 h-3" /> {achievement.reward.points} pts
          </span>
        )}
        {achievement.reward.xp && (
          <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            +{achievement.reward.xp} XP
          </span>
        )}
        {achievement.reward.discount && (
          <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <Gift className="w-3 h-3" /> {achievement.reward.discount}% dto
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function LogrosPage() {
  const [filter, setFilter] = useState<FilterCategory>('Todos')
  const { user } = useStore()

  const unlockedCount = achievementsData.filter(a => a.unlocked).length
  const totalCount = achievementsData.length

  const filteredAchievements = useMemo(() => {
    if (filter === 'Todos') return achievementsData
    return achievementsData.filter(a => a.category === filter)
  }, [filter])

  const rarityBreakdown = useMemo(() => {
    const unlocked = achievementsData.filter(a => a.unlocked)
    return {
      common: unlocked.filter(a => a.rarity === 'common').length,
      rare: unlocked.filter(a => a.rarity === 'rare').length,
      epic: unlocked.filter(a => a.rarity === 'epic').length,
      legendary: unlocked.filter(a => a.rarity === 'legendary').length,
    }
  }, [])

  const totalPoints = useMemo(() => {
    return achievementsData
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + (a.reward.points || 0), 0)
  }, [])

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
            Galeria de Logros
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Mis Logros
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {unlockedCount} de {totalCount} logros desbloqueados
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-2xl text-center border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-5 h-5 text-occident" />
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{unlockedCount}</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Desbloqueados</p>
        </div>
        <div className="p-4 rounded-2xl text-center border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{totalPoints}</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Puntos ganados</p>
        </div>
        <div className="p-4 rounded-2xl text-center border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-center flex-wrap gap-1 mb-1">
            <span className="text-xs font-semibold text-green-600">{rarityBreakdown.common}C</span>
            <span className="text-xs font-semibold text-blue-600">{rarityBreakdown.rare}R</span>
            <span className="text-xs font-semibold text-purple-600">{rarityBreakdown.epic}E</span>
            <span className="text-xs font-semibold text-amber-600">{rarityBreakdown.legendary}L</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Por rareza</p>
        </div>
        <div className="p-4 rounded-2xl text-center border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Completado</p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
              filter === tab
                ? 'bg-occident text-white shadow-lg shadow-occident/30'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
            style={{
              color: filter === tab ? undefined : 'var(--color-text-secondary)'
            }}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Achievement Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Filter className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>
                No hay logros en esta categoria
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
