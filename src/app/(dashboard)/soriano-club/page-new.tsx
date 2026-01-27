'use client'

import { motion } from 'framer-motion'
import {
  Trophy, Star, Gift, Share2, Copy, CheckCircle,
  Crown, Medal, Award, Target, Sparkles, ArrowRight,
  Users, Percent, Clock, Shield, Zap, TrendingUp
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { MissionsPanel } from '@/components/gamification/MissionsPanel'
import { LEVEL_CONFIG, calculateProfileCompletion, PROFILE_SECTIONS } from '@/lib/gamification-engine'

const howToEarnPoints = [
  { action: 'Contratar nueva póliza', points: '+200', icon: Shield },
  { action: 'Renovar póliza existente', points: '+100', icon: CheckCircle },
  { action: 'Pago puntual', points: '+50', icon: Clock },
  { action: 'Referir a un amigo', points: '+150', icon: Users },
  { action: 'Completar perfil 100%', points: '+500', icon: Target, highlight: true },
  { action: 'Primera visita mensual', points: '+10', icon: Star },
  { action: 'Quiz diario', points: '+30', icon: Sparkles },
  { action: 'Ruleta diaria', points: '+15', icon: Gift },
]

const allBadges = [
  { id: '1', name: 'Primeros Pasos', description: 'Completa tu perfil básico', icon: '🎯', requirement: 'Perfil básico 100%' },
  { id: '2', name: 'Previsor', description: '3+ pólizas activas', icon: '🛡️', requirement: '3 pólizas' },
  { id: '3', name: 'Digital', description: 'Usa el portal 10 veces', icon: '💻', requirement: '10 visitas' },
  { id: '4', name: 'Puntual', description: 'Pagos siempre al día', icon: '⏰', requirement: '12 pagos' },
  { id: '5', name: 'Embajador', description: 'Refiere a 3 amigos', icon: '🤝', requirement: '3 referidos' },
  { id: '6', name: 'Veterano', description: '5+ años de cliente', icon: '🏆', requirement: '5 años' },
  { id: '7', name: 'Familia', description: '5+ asegurados', icon: '👨‍👩‍👧‍👦', requirement: '5 personas' },
  { id: '8', name: 'Platino', description: 'Alcanza nivel Platino', icon: '💎', requirement: '6000 pts' },
  { id: '9', name: 'Maestro del Perfil', description: 'Perfil 100% completo', icon: '👑', requirement: 'Todas las secciones' },
  { id: '10', name: 'Racha de Fuego', description: '7 días consecutivos', icon: '🔥', requirement: '7 días' },
  { id: '11', name: 'Experto en Seguros', description: '50 quizzes completados', icon: '🧠', requirement: '50 quizzes' },
  { id: '12', name: 'Diamante', description: 'Nivel máximo alcanzado', icon: '💠', requirement: '10000 pts' },
]

export default function SorianoClubPage() {
  const { user } = useStore()
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'missions' | 'badges'>('overview')

  // Valores por defecto si no hay usuario
  const safeUser = user || {
    level: 'BRONCE' as const,
    points: 0,
    referralCode: 'DEMO123',
    referralsCount: 0,
    badges: [],
  }

  const currentLevelConfig = LEVEL_CONFIG[safeUser.level]
  const pointsInLevel = safeUser.points - currentLevelConfig.min
  const pointsNeeded = currentLevelConfig.max - currentLevelConfig.min + 1
  const progress = currentLevelConfig.next
    ? Math.min((pointsInLevel / pointsNeeded) * 100, 100)
    : 100

  // Calcular completitud del perfil
  const profileCompletion = useMemo(() => {
    return calculateProfileCompletion(PROFILE_SECTIONS)
  }, [])

  const copyReferralCode = () => {
    navigator.clipboard.writeText(safeUser.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'DIAMANTE': return <Zap className="w-8 h-8" />
      case 'PLATINO': return <Crown className="w-8 h-8" />
      case 'ORO': return <Trophy className="w-8 h-8" />
      case 'PLATA': return <Medal className="w-8 h-8" />
      default: return <Award className="w-8 h-8" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'DIAMANTE': return 'from-cyan-400 to-blue-500'
      case 'PLATINO': return 'from-purple-500 to-purple-600'
      case 'ORO': return 'from-yellow-500 to-amber-500'
      case 'PLATA': return 'from-gray-400 to-gray-500'
      default: return 'from-orange-600 to-orange-700'
    }
  }

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
          <span className="font-medium" style={{ color: 'var(--color-text)' }}>Programa de fidelidad</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Soriano Club
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Acumula puntos, completa misiones y disfruta de beneficios exclusivos
        </p>
      </motion.div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'relative overflow-hidden rounded-3xl p-8 text-white',
          `bg-gradient-to-br ${getLevelColor(safeUser.level)}`
        )}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 mb-1">Tu nivel actual</p>
              <div className="flex items-center gap-3">
                {getLevelIcon(safeUser.level)}
                <h2 className="text-4xl font-bold">{safeUser.level}</h2>
              </div>
              <p className="text-white/60 text-sm mt-2">
                Multiplicador: x{currentLevelConfig.multiplier}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/80 mb-1">Puntos acumulados</p>
              <p className="text-4xl font-bold flex items-center gap-2">
                <Star className="w-8 h-8" />
                {safeUser.points.toLocaleString()}
              </p>
            </div>
          </div>

          {currentLevelConfig.next && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso a {currentLevelConfig.next}</span>
                <span>{currentLevelConfig.max + 1 - safeUser.points} pts restantes</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          )}

          {!currentLevelConfig.next && (
            <div className="flex items-center gap-2 mt-4 text-white/90">
              <Sparkles className="w-5 h-5" />
              <span>¡Has alcanzado el nivel máximo!</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          onClick={() => setActiveSection('overview')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
            activeSection === 'overview'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-occident'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          Resumen
        </button>
        <button
          onClick={() => setActiveSection('missions')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
            activeSection === 'missions'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-occident'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          Misiones
        </button>
        <button
          onClick={() => setActiveSection('badges')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
            activeSection === 'badges'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-occident'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          Insignias
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Benefits & Referral */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Gift className="w-5 h-5 text-occident" />
                Tus beneficios {safeUser.level}
              </h3>
              <div className="space-y-3">
                {currentLevelConfig.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-occident/5"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Referral */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Share2 className="w-5 h-5 text-occident" />
                Invita y gana
              </h3>

              <div className="p-4 rounded-xl bg-gradient-to-r from-occident/10 to-purple-500/10 border border-occident/20 mb-4">
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>Tu código de referido</p>
                <div className="flex items-center gap-3">
                  <code className="text-2xl font-mono font-bold tracking-wider" style={{ color: 'var(--color-text)' }}>
                    {safeUser.referralCode}
                  </code>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 rounded-lg bg-occident/10 hover:bg-occident/20 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-occident" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-card)' }}>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{safeUser.referralsCount}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Amigos referidos</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xl font-bold text-green-500">+{safeUser.referralsCount * 50}€</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Ganados</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* How to Earn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Target className="w-5 h-5 text-occident" />
              Cómo ganar puntos
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {howToEarnPoints.map((item, index) => (
                <motion.div
                  key={item.action}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl hover:bg-occident/5 transition-colors",
                    item.highlight && "ring-2 ring-occident/30 bg-occident/5"
                  )}
                  style={{ backgroundColor: item.highlight ? undefined : 'var(--color-card)' }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    item.highlight ? "bg-occident/20" : "bg-occident/10"
                  )}>
                    <item.icon className="w-5 h-5 text-occident" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{item.action}</p>
                  </div>
                  <span className={cn(
                    "font-bold",
                    item.highlight ? "text-occident text-lg" : "text-green-500"
                  )}>{item.points}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Level Progression */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <TrendingUp className="w-5 h-5 text-occident" />
              Niveles del programa
            </h3>

            <div className="flex flex-col md:flex-row gap-4">
              {(['BRONCE', 'PLATA', 'ORO', 'PLATINO', 'DIAMANTE'] as const).map((level, index) => {
                const isCurrentLevel = safeUser.level === level
                const isPastLevel = ['BRONCE', 'PLATA', 'ORO', 'PLATINO', 'DIAMANTE'].indexOf(safeUser.level) > index

                return (
                  <div
                    key={level}
                    className={cn(
                      'flex-1 p-4 rounded-2xl text-center transition-all',
                      isCurrentLevel && 'ring-2 ring-occident',
                      isPastLevel && 'opacity-60'
                    )}
                    style={{ backgroundColor: 'var(--color-card)' }}
                  >
                    <div className={cn(
                      'w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3',
                      `bg-gradient-to-br ${getLevelColor(level)} text-white`
                    )}>
                      {getLevelIcon(level)}
                    </div>
                    <p className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>{level}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {LEVEL_CONFIG[level].min.toLocaleString()}+ pts
                    </p>
                    {isCurrentLevel && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-occident text-white text-xs rounded-full">
                        Actual
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}

      {activeSection === 'missions' && (
        <MissionsPanel userLevel={safeUser.level} profileCompletion={profileCompletion} />
      )}

      {activeSection === 'badges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Award className="w-5 h-5 text-occident" />
            Colección de insignias
            <span className="ml-auto text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>
              {safeUser.badges.length}/{allBadges.length} desbloqueadas
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allBadges.map((badge) => {
              const unlocked = safeUser.badges.some((b) => b.id === badge.id)
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: unlocked ? 1.05 : 1 }}
                  className={cn(
                    'p-4 rounded-2xl text-center transition-all',
                    unlocked
                      ? 'bg-gradient-to-br from-occident/10 to-purple-500/10 border-2 border-occident/30'
                      : 'opacity-40 grayscale'
                  )}
                  style={{ backgroundColor: unlocked ? undefined : 'var(--color-card)' }}
                >
                  <span className="text-4xl block mb-2">{badge.icon}</span>
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                    {badge.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {unlocked ? badge.description : badge.requirement}
                  </p>
                  {unlocked && (
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto mt-2" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
