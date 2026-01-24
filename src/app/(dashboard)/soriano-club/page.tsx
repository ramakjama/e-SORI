'use client'

import { motion } from 'framer-motion'
import {
  Trophy, Star, Gift, Share2, Copy, CheckCircle,
  Crown, Medal, Award, Target, Sparkles, ArrowRight,
  Users, Percent, Clock, Shield
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const levelBenefits = {
  BRONCE: [
    { icon: Gift, title: 'Bienvenida', desc: '10% dto. primera póliza nueva' },
    { icon: Clock, title: 'Soporte', desc: 'Atención en horario laboral' },
  ],
  PLATA: [
    { icon: Gift, title: 'Descuentos', desc: '5% dto. en renovaciones' },
    { icon: Clock, title: 'Prioridad', desc: 'Atención preferente' },
    { icon: Users, title: 'Referidos', desc: '25€ por cada amigo' },
  ],
  ORO: [
    { icon: Gift, title: 'Descuentos', desc: '10% dto. en renovaciones' },
    { icon: Clock, title: '24/7', desc: 'Línea directa personal' },
    { icon: Users, title: 'Referidos', desc: '50€ por cada amigo' },
    { icon: Shield, title: 'Siniestros', desc: 'Gestión express' },
  ],
  PLATINO: [
    { icon: Gift, title: 'VIP', desc: '15% dto. en todo' },
    { icon: Clock, title: 'Gestor personal', desc: 'Agente dedicado 24/7' },
    { icon: Users, title: 'Referidos', desc: '100€ por cada amigo' },
    { icon: Shield, title: 'Premium', desc: 'Resolución prioritaria' },
    { icon: Percent, title: 'Exclusivo', desc: 'Acceso a productos VIP' },
  ],
}

const levelThresholds = {
  BRONCE: { min: 0, max: 999, next: 'PLATA' as const },
  PLATA: { min: 1000, max: 2499, next: 'ORO' as const },
  ORO: { min: 2500, max: 4999, next: 'PLATINO' as const },
  PLATINO: { min: 5000, max: Infinity, next: null },
}

const howToEarnPoints = [
  { action: 'Contratar nueva póliza', points: '+200', icon: Shield },
  { action: 'Renovar póliza existente', points: '+100', icon: CheckCircle },
  { action: 'Pago puntual', points: '+50', icon: Clock },
  { action: 'Referir a un amigo', points: '+150', icon: Users },
  { action: 'Completar perfil 100%', points: '+100', icon: Target },
  { action: 'Primera visita mensual', points: '+10', icon: Star },
]

const allBadges = [
  { id: '1', name: 'Primeros Pasos', description: 'Completa tu perfil', icon: '🎯', requirement: 'Perfil 100%' },
  { id: '2', name: 'Previsor', description: '3+ pólizas activas', icon: '🛡️', requirement: '3 pólizas' },
  { id: '3', name: 'Digital', description: 'Usa el portal 10 veces', icon: '💻', requirement: '10 visitas' },
  { id: '4', name: 'Puntual', description: 'Pagos siempre al día', icon: '⏰', requirement: '12 pagos' },
  { id: '5', name: 'Embajador', description: 'Refiere a 3 amigos', icon: '🤝', requirement: '3 referidos' },
  { id: '6', name: 'Veterano', description: '5+ años de cliente', icon: '🏆', requirement: '5 años' },
  { id: '7', name: 'Familia', description: '5+ asegurados', icon: '👨‍👩‍👧‍👦', requirement: '5 personas' },
  { id: '8', name: 'Platino', description: 'Alcanza nivel Platino', icon: '👑', requirement: '5000 pts' },
]

export default function SorianoClubPage() {
  const { user } = useStore()
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const currentThreshold = levelThresholds[user.level]
  const pointsInLevel = user.points - currentThreshold.min
  const pointsNeeded = currentThreshold.max - currentThreshold.min + 1
  const progress = currentThreshold.next
    ? Math.min((pointsInLevel / pointsNeeded) * 100, 100)
    : 100

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'PLATINO': return <Crown className="w-8 h-8" />
      case 'ORO': return <Trophy className="w-8 h-8" />
      case 'PLATA': return <Medal className="w-8 h-8" />
      default: return <Award className="w-8 h-8" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
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
          Acumula puntos, sube de nivel y disfruta de beneficios exclusivos
        </p>
      </motion.div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'relative overflow-hidden rounded-3xl p-8 text-white',
          `bg-gradient-to-br ${getLevelColor(user.level)}`
        )}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 mb-1">Tu nivel actual</p>
              <div className="flex items-center gap-3">
                {getLevelIcon(user.level)}
                <h2 className="text-4xl font-bold">{user.level}</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 mb-1">Puntos acumulados</p>
              <p className="text-4xl font-bold flex items-center gap-2">
                <Star className="w-8 h-8" />
                {user.points.toLocaleString()}
              </p>
            </div>
          </div>

          {currentThreshold.next && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso a {currentThreshold.next}</span>
                <span>{currentThreshold.max + 1 - user.points} pts restantes</span>
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

          {!currentThreshold.next && (
            <div className="flex items-center gap-2 mt-4 text-white/90">
              <Sparkles className="w-5 h-5" />
              <span>Has alcanzado el nivel máximo</span>
            </div>
          )}
        </div>
      </motion.div>

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
            Tus beneficios {user.level}
          </h3>
          <div className="space-y-4">
            {levelBenefits[user.level].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-occident/5"
              >
                <div className="w-10 h-10 bg-occident/10 rounded-xl flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-occident" />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{benefit.title}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{benefit.desc}</p>
                </div>
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
                {user.referralCode}
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
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{user.referralsCount}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Amigos referidos</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xl font-bold text-green-500">+{user.referralsCount * 50}€</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Ganados</p>
            </div>
          </div>

          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Comparte tu código con amigos. Cuando contraten su primera póliza,
            ambos recibís recompensas según tu nivel.
          </p>
        </motion.div>
      </div>

      {/* Badges Collection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Award className="w-5 h-5 text-occident" />
          Colección de insignias
          <span className="ml-auto text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>
            {user.badges.length}/{allBadges.length} desbloqueadas
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {allBadges.map((badge) => {
            const unlocked = user.badges.some((b) => b.id === badge.id)
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  'p-4 rounded-2xl text-center transition-all',
                  unlocked
                    ? 'bg-gradient-to-br from-occident/10 to-purple-500/10 border-2 border-occident/30'
                    : 'opacity-50 grayscale'
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
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-occident/5 transition-colors"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <div className="w-10 h-10 bg-occident/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-occident" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{item.action}</p>
              </div>
              <span className="font-bold text-green-500">{item.points}</span>
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
          <ArrowRight className="w-5 h-5 text-occident" />
          Niveles del programa
        </h3>

        <div className="flex flex-col md:flex-row gap-4">
          {(['BRONCE', 'PLATA', 'ORO', 'PLATINO'] as const).map((level, index) => {
            const isCurrentLevel = user.level === level
            const isPastLevel = ['BRONCE', 'PLATA', 'ORO', 'PLATINO'].indexOf(user.level) > index

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
                  {level === 'PLATINO' && <Crown className="w-6 h-6" />}
                  {level === 'ORO' && <Trophy className="w-6 h-6" />}
                  {level === 'PLATA' && <Medal className="w-6 h-6" />}
                  {level === 'BRONCE' && <Award className="w-6 h-6" />}
                </div>
                <p className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>{level}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {levelThresholds[level].min.toLocaleString()}+ pts
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
  )
}
