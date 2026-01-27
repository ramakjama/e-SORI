'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Star,
  Zap,
  Gift,
  Target,
  Brain,
  Users,
  ShoppingBag,
  FolderOpen,
  RotateCcw,
  ChevronRight,
  Lock,
  CheckCircle2,
  Flame,
  Crown,
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
  UserCircle,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import {
  LEVEL_CONFIG,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  ACHIEVEMENTS,
  PROFILE_SECTIONS,
  calculateProfileCompletion,
  calculateLevelProgress,
} from '@/lib/gamification-engine'
import type { Achievement } from '@/lib/gamification-engine'
import { WalletSummary } from '@/components/gamification/WalletSummary'
import { StreakDisplay } from '@/components/gamification/StreakDisplay'
import { SpinWheel } from '@/components/gamification/SpinWheel'

// ============================================
// TIPOS
// ============================================

type LevelKey = keyof typeof LEVEL_CONFIG

interface DailyMissionProgress {
  id: string
  current: number
  target: number
  completed: boolean
}

interface WeeklyMissionProgress {
  id: string
  current: number
  target: number
  completed: boolean
}

// ============================================
// DATOS MOCK DE PROGRESO
// ============================================

const MOCK_DAILY_PROGRESS: DailyMissionProgress[] = [
  { id: 'daily_login', current: 1, target: 1, completed: true },
  { id: 'daily_quiz', current: 0, target: 1, completed: false },
  { id: 'daily_spin', current: 0, target: 1, completed: false },
  { id: 'daily_profile_update', current: 1, target: 1, completed: true },
  { id: 'daily_document_upload', current: 0, target: 1, completed: false },
]

const MOCK_WEEKLY_PROGRESS: WeeklyMissionProgress[] = [
  { id: 'weekly_streak', current: 3, target: 5, completed: false },
  { id: 'weekly_profile', current: 1, target: 2, completed: false },
  { id: 'weekly_quizzes', current: 2, target: 5, completed: false },
  { id: 'weekly_social', current: 3, target: 3, completed: true },
]

const FEATURED_ACHIEVEMENT_IDS = [
  'first_steps',
  'streak_7',
  'quiz_master',
  'referral_5',
  'policies_3',
  'profile_master',
]

// ============================================
// CONSTANTES DE GRADIENTES POR NIVEL
// ============================================

const LEVEL_GRADIENTS: Record<LevelKey, string> = {
  BRONCE: 'from-amber-700 via-orange-600 to-yellow-700',
  PLATA: 'from-gray-400 via-slate-300 to-gray-500',
  ORO: 'from-yellow-500 via-amber-400 to-yellow-600',
  PLATINO: 'from-indigo-300 via-purple-200 to-slate-300',
  DIAMANTE: 'from-cyan-300 via-sky-200 to-blue-400',
}

const LEVEL_ICONS: Record<LevelKey, React.ReactNode> = {
  BRONCE: <Shield className="w-8 h-8" />,
  PLATA: <Star className="w-8 h-8" />,
  ORO: <Trophy className="w-8 h-8" />,
  PLATINO: <Crown className="w-8 h-8" />,
  DIAMANTE: <Sparkles className="w-8 h-8" />,
}

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

const RARITY_LABELS: Record<string, string> = {
  common: 'Comun',
  rare: 'Raro',
  epic: 'Epico',
  legendary: 'Legendario',
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && <span className="text-occident">{icon}</span>}
      <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
        {children}
      </h2>
    </div>
  )
}

function ProgressBar({ value, max, color = 'bg-occident' }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full h-2 rounded-full bg-gray-700/50 overflow-hidden">
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function SorianoClubPage() {
  const user = useStore((s) => s.user)
  const [showSpinWheel, setShowSpinWheel] = useState(false)

  // Datos del usuario (con fallback)
  const userLevel = (user?.level ?? 'BRONCE') as LevelKey
  const userPoints = user?.points ?? 350
  const userName = user?.name ?? 'Usuario'
  const userAvatar = user?.avatar

  const levelConfig = LEVEL_CONFIG[userLevel]
  const nextLevel = levelConfig.next as LevelKey | null
  const nextLevelConfig = nextLevel ? LEVEL_CONFIG[nextLevel] : null
  const xpProgress = calculateLevelProgress(userPoints, userLevel)
  const pointsToNext = nextLevelConfig ? nextLevelConfig.min - userPoints : 0

  const profileCompletion = useMemo(() => {
    const sections = PROFILE_SECTIONS.map((s) => ({
      ...s,
      completedFields: Math.floor(s.totalFields * 0.4),
    }))
    return calculateProfileCompletion(sections)
  }, [])

  const featuredAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter((a) => FEATURED_ACHIEVEMENT_IDS.includes(a.id)).map((a) => ({
      ...a,
      unlocked: a.id === 'first_steps' || a.id === 'policies_3',
    }))
  }, [])

  // ============================================
  // QUICK ACCESS ITEMS
  // ============================================

  const quickAccessItems = [
    { label: 'Quiz', href: '/quizzes', icon: <Brain className="w-6 h-6" />, color: 'text-purple-400' },
    { label: 'Clasificacion', href: '/clasificacion', icon: <TrendingUp className="w-6 h-6" />, color: 'text-yellow-400' },
    { label: 'Referidos', href: '/referidos', icon: <Users className="w-6 h-6" />, color: 'text-green-400' },
    { label: 'Marketplace', href: '/marketplace', icon: <ShoppingBag className="w-6 h-6" />, color: 'text-blue-400' },
    { label: 'Mi Archivo', href: '/mi-archivo', icon: <FolderOpen className="w-6 h-6" />, color: 'text-orange-400' },
    {
      label: 'Ruleta',
      href: '#',
      icon: <RotateCcw className="w-6 h-6" />,
      color: 'text-pink-400',
      onClick: () => setShowSpinWheel(true),
    },
  ]

  const howItWorksSteps = [
    { icon: <UserCircle className="w-8 h-8" />, title: 'Completa perfil', desc: 'Rellena todas las secciones de tu perfil para ganar puntos iniciales.' },
    { icon: <Brain className="w-8 h-8" />, title: 'Haz quizzes', desc: 'Responde quizzes diarios sobre seguros y aprende mientras ganas.' },
    { icon: <TrendingUp className="w-8 h-8" />, title: 'Sube de nivel', desc: 'Acumula puntos y XP para ascender de Bronce a Diamante.' },
    { icon: <Gift className="w-8 h-8" />, title: 'Gana premios', desc: 'Canjea tus puntos por descuentos, regalos y beneficios exclusivos.' },
  ]

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen pb-12 space-y-8">
      {/* ==========================================
          HERO BANNER
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          'relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-r',
          LEVEL_GRADIENTS[userLevel]
        )}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {LEVEL_ICONS[userLevel]}
            </motion.div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-white/80 text-sm mb-1">Bienvenido al Club</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{userName}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                Nivel {userLevel}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                x{levelConfig.multiplier} multiplicador
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="max-w-md mx-auto md:mx-0">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>{userPoints.toLocaleString()} pts</span>
                {nextLevel && (
                  <span>
                    {pointsToNext.toLocaleString()} pts para {nextLevel}
                  </span>
                )}
              </div>
              <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/90"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Points Counter */}
          <div className="text-center">
            <motion.div
              className="text-4xl md:text-5xl font-bold text-white"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {userPoints.toLocaleString()}
            </motion.div>
            <p className="text-white/80 text-sm">puntos totales</p>
          </div>
        </div>
      </motion.section>

      {/* ==========================================
          NIVEL BENEFICIOS + STREAK
      ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beneficios del nivel actual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card lg:col-span-2 p-6"
        >
          <SectionTitle icon={<Award className="w-5 h-5" />}>Beneficios de tu Nivel</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nivel actual */}
            <div>
              <h3
                className="text-sm font-semibold mb-3 flex items-center gap-2"
                style={{ color: levelConfig.color }}
              >
                {LEVEL_ICONS[userLevel]}
                <span>Nivel {userLevel}</span>
              </h3>
              <ul className="space-y-2">
                {levelConfig.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Siguiente nivel */}
            {nextLevel && nextLevelConfig && (
              <div className="opacity-70">
                <h3
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{ color: LEVEL_CONFIG[nextLevel].color }}
                >
                  <Lock className="w-4 h-4" />
                  <span>Desbloquea en {nextLevel}</span>
                </h3>
                <ul className="space-y-2">
                  {nextLevelConfig.benefits
                    .filter((b) => !levelConfig.benefits.includes(b))
                    .map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <Lock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StreakDisplay />
        </motion.div>
      </div>

      {/* ==========================================
          WALLET OVERVIEW
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SectionTitle icon={<Zap className="w-5 h-5" />}>Tu Cartera</SectionTitle>
        <WalletSummary variant="full" />
      </motion.section>

      {/* ==========================================
          MISIONES DIARIAS
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SectionTitle icon={<Target className="w-5 h-5" />}>Misiones Diarias</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAILY_MISSIONS.map((mission) => {
            const progress = MOCK_DAILY_PROGRESS.find((p) => p.id === mission.id)
            const isCompleted = progress?.completed ?? false
            return (
              <motion.div
                key={mission.id}
                className={cn('card p-4 transition-all', isCompleted && 'ring-1 ring-emerald-500/30')}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{mission.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                        {mission.title}
                      </h4>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                      {mission.description}
                    </p>
                    <div className="mt-2">
                      <ProgressBar
                        value={progress?.current ?? 0}
                        max={progress?.target ?? 1}
                        color={isCompleted ? 'bg-emerald-500' : 'bg-occident'}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" /> +{mission.points} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-400" /> +{mission.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ==========================================
          MISIONES SEMANALES
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <SectionTitle icon={<Clock className="w-5 h-5" />}>Misiones Semanales</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WEEKLY_MISSIONS.map((mission) => {
            const progress = MOCK_WEEKLY_PROGRESS.find((p) => p.id === mission.id)
            const isCompleted = progress?.completed ?? false
            const current = progress?.current ?? 0
            const target = progress?.target ?? 1
            return (
              <motion.div
                key={mission.id}
                className={cn('card p-5 transition-all', isCompleted && 'ring-1 ring-emerald-500/30')}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{mission.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {mission.title}
                      </h4>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                          {current}/{target}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {mission.description}
                    </p>
                    <div className="mt-3">
                      <ProgressBar
                        value={current}
                        max={target}
                        color={isCompleted ? 'bg-emerald-500' : 'bg-occident'}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" /> +{mission.points} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-400" /> +{mission.xp} XP
                      </span>
                      {mission.reward?.badge && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-purple-400" /> Badge
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ==========================================
          ACCESO RAPIDO
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SectionTitle icon={<Zap className="w-5 h-5" />}>Acceso Rapido</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickAccessItems.map((item) => {
            const content = (
              <motion.div
                className="card p-4 flex flex-col items-center gap-3 cursor-pointer hover:ring-1 hover:ring-occident/40 transition-all text-center"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={cn('p-3 rounded-xl bg-white/5', item.color)}>{item.icon}</div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {item.label}
                </span>
              </motion.div>
            )

            if (item.onClick) {
              return (
                <button key={item.label} onClick={item.onClick} className="text-left">
                  {content}
                </button>
              )
            }

            return (
              <Link key={item.label} href={item.href}>
                {content}
              </Link>
            )
          })}
        </div>
      </motion.section>

      {/* ==========================================
          LOGROS DESTACADOS
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center justify-between mb-6">
          <SectionTitle icon={<Trophy className="w-5 h-5" />}>Logros Destacados</SectionTitle>
          <Link
            href="/logros"
            className="text-sm text-occident hover:underline flex items-center gap-1"
          >
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </motion.section>

      {/* ==========================================
          COMO FUNCIONA
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SectionTitle icon={<Sparkles className="w-5 h-5" />}>Como Funciona Soriano Club</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step, idx) => (
            <motion.div
              key={idx}
              className="card p-6 text-center relative"
              whileHover={{ y: -4 }}
            >
              {idx < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-occident" />
                </div>
              )}
              <div className="w-14 h-14 rounded-full bg-occident/10 text-occident flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-occident mb-2">
                PASO {idx + 1}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ==========================================
          SPIN WHEEL MODAL
      ========================================== */}
      <AnimatePresence>
        {showSpinWheel && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSpinWheel(false)}
          >
            <motion.div
              className="card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Ruleta de la Suerte
                </h2>
                <button
                  onClick={() => setShowSpinWheel(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  &times;
                </button>
              </div>
              <SpinWheel
                onSpinEnd={(prize) => {
                  console.log('Premio:', prize)
                }}
                spinsRemaining={
                  userLevel === 'DIAMANTE'
                    ? 99
                    : userLevel === 'PLATINO'
                      ? 5
                      : userLevel === 'ORO'
                        ? 3
                        : userLevel === 'PLATA'
                          ? 2
                          : 1
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// COMPONENTE DE LOGRO
// ============================================

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarityClass = RARITY_COLORS[achievement.rarity] ?? ''
  const rarityLabel = RARITY_LABELS[achievement.rarity] ?? ''

  return (
    <motion.div
      className={cn(
        'card p-4 relative overflow-hidden transition-all',
        !achievement.unlocked && 'opacity-60 grayscale'
      )}
      whileHover={{ scale: 1.02 }}
    >
      {/* Rarity badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{achievement.icon}</span>
        <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', rarityClass)}>
          {rarityLabel}
        </span>
      </div>

      <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
        {achievement.name}
      </h4>
      <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
        {achievement.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" /> +{achievement.reward.points ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-400" /> +{achievement.reward.xp ?? 0}
          </span>
        </div>
        {achievement.unlocked ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <Lock className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
        )}
      </div>

      {/* Glow effect for unlocked legendary */}
      {achievement.unlocked && achievement.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.08) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      )}
    </motion.div>
  )
}
