'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  FileText, AlertTriangle, CreditCard, Calendar,
  ArrowRight, CheckCircle, Clock, TrendingUp, Shield,
  Star, Trophy, Gift, Sparkles, Bell, ChevronRight,
  Car, Home, Heart, Umbrella, Users, Phone, MessageCircle,
  Zap, Target, Award, BarChart3, PieChart, Wallet,
  ArrowUpRight, ArrowDownRight, Activity, Sun, Cloud, Droplets,
  Flame
} from 'lucide-react'
import { useStore, UserRole } from '@/store/useStore'
import { formatCurrency, formatDateShort, cn } from '@/lib/utils'
import { CircularProgress } from '@/components/ui/Progress'
import { Badge, LevelBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

// Gamification widgets
import { WalletSummary } from '@/components/gamification/WalletSummary'
import { DailyQuizWidget } from '@/components/gamification/DailyQuizWidget'
import { LeaderboardMini } from '@/components/gamification/LeaderboardMini'
import { RenewalCheckpoints } from '@/components/gamification/RenewalCheckpoints'
import { StreakDisplay } from '@/components/gamification/StreakDisplay'

const policyIcons: Record<string, React.ElementType> = {
  auto: Car,
  hogar: Home,
  vida: Heart,
  salud: Activity,
  decesos: Umbrella,
}

const policyColors: Record<string, { bg: string; icon: string; gradient: string }> = {
  auto: { bg: 'from-blue-500 to-blue-600', icon: 'text-white', gradient: 'from-blue-500/20 to-blue-600/20' },
  hogar: { bg: 'from-emerald-500 to-emerald-600', icon: 'text-white', gradient: 'from-emerald-500/20 to-emerald-600/20' },
  vida: { bg: 'from-rose-500 to-rose-600', icon: 'text-white', gradient: 'from-rose-500/20 to-rose-600/20' },
  salud: { bg: 'from-violet-500 to-violet-600', icon: 'text-white', gradient: 'from-violet-500/20 to-violet-600/20' },
  decesos: { bg: 'from-gray-500 to-gray-600', icon: 'text-white', gradient: 'from-gray-500/20 to-gray-600/20' },
}

const getLevelInfo = (level: string) => {
  switch (level) {
    case 'PLATINO': return { color: 'from-slate-300 via-white to-slate-400', text: 'text-slate-800', icon: '💎', progress: 100 }
    case 'ORO': return { color: 'from-yellow-400 via-amber-400 to-yellow-500', text: 'text-yellow-900', icon: '🥇', progress: 75 }
    case 'PLATA': return { color: 'from-slate-400 via-slate-300 to-slate-500', text: 'text-white', icon: '🥈', progress: 50 }
    default: return { color: 'from-amber-600 via-orange-500 to-amber-700', text: 'text-white', icon: '🥉', progress: 25 }
  }
}

// Animated Counter Component - Memoized for performance
interface AnimatedCounterProps {
  value: number | string
  duration?: number
}

const AnimatedCounter = memo(function AnimatedCounter({ value, duration = 1 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const numValue = useMemo(
    () => typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value,
    [value]
  )
  const isCurrency = useMemo(
    () => typeof value === 'string' && value.includes('EUR'),
    [value]
  )

  useEffect(() => {
    let start = 0
    const end = numValue
    if (start === end) return

    const incrementTime = (duration * 1000) / end
    const timer = setInterval(() => {
      start += Math.ceil(end / 50)
      if (start > end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [numValue, duration])

  if (isCurrency) {
    return <>{formatCurrency(displayValue)}</>
  }
  return <>{displayValue.toLocaleString()}</>
})

// Quick Tip Component - Memoized for performance
interface QuickTipProps {
  tip: string
}

const QuickTip = memo(function QuickTip({ tip }: QuickTipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200/50 dark:border-amber-800/30"
    >
      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
        <Zap className="w-4 h-4 text-amber-900" />
      </div>
      <div>
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Consejo del día</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{tip}</p>
      </div>
    </motion.div>
  )
})

// Tips data - moved outside component to prevent recreation
const TIPS = [
  'Revisa tus coberturas anualmente para asegurar que se ajusten a tus necesidades.',
  'Comunicar un siniestro a tiempo agiliza el proceso de resolución.',
  'Refiere a un amigo y gana 150 puntos Soriano Club.',
  'Mantén tus datos actualizados para recibir comunicaciones importantes.',
] as const

export default function DashboardPage() {
  const { user, policies, claims, messages, notifications, openChat } = useStore()
  const [greeting, setGreeting] = useState('Buenos días')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 14) setGreeting('Buenos días')
    else if (hour >= 14 && hour < 21) setGreeting('Buenas tardes')
    else setGreeting('Buenas noches')

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Memoized computed values for performance
  const activePolicies = useMemo(
    () => policies.filter((p) => p.status === 'active').length,
    [policies]
  )

  const pendingClaims = useMemo(
    () => claims.filter((c) => c.status !== 'resolved' && c.status !== 'rejected').length,
    [claims]
  )

  const totalPremium = useMemo(
    () => policies.reduce((sum, p) => sum + p.premium, 0),
    [policies]
  )

  const unreadMessages = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  )

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const nextPayment = useMemo(
    () => policies.reduce((nearest, policy) => {
      const paymentDate = new Date(policy.nextPayment)
      if (!nearest || paymentDate < nearest.date) {
        return { date: paymentDate, policy }
      }
      return nearest
    }, null as { date: Date; policy: typeof policies[0] } | null),
    [policies]
  )

  const activeClaim = useMemo(
    () => claims.find((c) => c.status === 'in_progress'),
    [claims]
  )

  const levelInfo = useMemo(
    () => getLevelInfo(user?.level || 'BRONCE'),
    [user?.level]
  )

  // Memoize random tip to prevent re-selection on each render
  const randomTip = useMemo(
    () => TIPS[Math.floor(Math.random() * TIPS.length)],
    [] // Empty deps - only calculate once on mount
  )

  // Calculate protection score - memoized
  const protectionScore = useMemo(
    () => Math.min(100, (activePolicies * 20) + (user?.points ? Math.min(20, user.points / 50) : 0)),
    [activePolicies, user?.points]
  )

  // Memoized callback for opening chat
  const handleOpenChat = useCallback(() => {
    openChat()
  }, [openChat])

  // Memoized callback for viewing policy
  const handleViewPolicy = useCallback((policyId: string) => {
    console.log('View policy:', policyId)
  }, [])

  // Memoized callback for quiz completion
  const handleQuizComplete = useCallback((score: number, xpEarned: number, coinsEarned: number) => {
    console.log('Quiz completed:', { score, xpEarned, coinsEarned })
    // Here you can update the global state with earned points
  }, [])

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Premium Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 md:p-8 text-white"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-red-200 text-sm font-medium mb-1">{greeting}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {user?.name.split(' ')[0]} 👋
              </h1>
              <p className="text-red-100 text-sm md:text-base max-w-md">
                Tienes <span className="font-semibold text-white">{activePolicies} pólizas activas</span> protegiéndote.
                {pendingClaims > 0 && (
                  <> Hay <span className="font-semibold text-amber-300">{pendingClaims} siniestro{pendingClaims > 1 ? 's' : ''}</span> en gestión.</>
                )}
              </p>
            </motion.div>

            {/* Quick Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 mt-6"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-red-200">Prima anual</p>
                  <p className="font-bold text-lg">{formatCurrency(totalPremium)}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-red-200">Próximo pago</p>
                  <p className="font-bold text-lg">{nextPayment ? formatDateShort(nextPayment.date) : '-'}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Level Card + Streak */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-3"
            >
              {/* Streak Display en Header */}
              <div className="flex justify-end">
                <StreakDisplay variant="badge" showTooltip />
              </div>

              <Link href="/soriano-club">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group min-w-[200px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                      `bg-gradient-to-br ${levelInfo.color}`
                    )}>
                      {levelInfo.icon}
                    </div>
                    <div>
                      <p className="text-xs text-red-200">Soriano Club</p>
                      <p className={cn('font-bold text-lg', levelInfo.text === 'text-slate-800' ? 'text-white' : '')}>{user.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold">{user.points.toLocaleString()} pts</span>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Tip */}
      <QuickTip tip={randomTip} />

      {/* Stats Grid - Premium Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pólizas Activas', value: activePolicies, icon: FileText, color: 'blue', href: '/polizas', change: '+1 este año' },
          { label: 'Siniestros Abiertos', value: pendingClaims, icon: AlertTriangle, color: 'amber', href: '/siniestros', change: pendingClaims > 0 ? 'En progreso' : 'Todo OK' },
          { label: 'Prima Mensual', value: formatCurrency(totalPremium / 12), icon: Wallet, color: 'emerald', href: '/pagos', change: 'Fraccionado' },
          { label: 'Mensajes Nuevos', value: unreadMessages, icon: MessageCircle, color: 'purple', href: '/mensajes', change: unreadMessages > 0 ? 'Por leer' : 'Al día' },
        ].map((stat, i) => {
          const colors = {
            blue: { bg: 'bg-blue-500', light: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-600 dark:text-blue-400' },
            amber: { bg: 'bg-amber-500', light: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-600 dark:text-amber-400' },
            emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100 dark:bg-emerald-950', text: 'text-emerald-600 dark:text-emerald-400' },
            purple: { bg: 'bg-purple-500', light: 'bg-purple-100 dark:bg-purple-950', text: 'text-purple-600 dark:text-purple-400' },
          }[stat.color]

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link href={stat.href}>
                <Card variant="glass" hover="lift" className="p-5 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors?.light)}>
                      <stat.icon className={cn('w-6 h-6', colors?.text)} />
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all text-slate-400 group-hover:translate-x-1" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} /> : stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
                  <div className={cn('text-xs mt-2 font-medium', colors?.text)}>{stat.change}</div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Protection Score + Active Claim Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Coverage Gap Analysis Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="gradient" className="p-6 h-full">
            {(() => {
              // Calculate coverage gaps
              const essentialPolicies = [
                {
                  type: 'hogar',
                  label: 'Hogar',
                  covered: policies.some(p => p.type === 'hogar'),
                  risk: 'Daños estructurales pueden costar más de 50.000€',
                  priority: 'Alta'
                },
                {
                  type: 'auto',
                  label: 'Auto',
                  covered: policies.some(p => p.type === 'auto'),
                  risk: 'Sin cobertura legal obligatoria - Multas desde 3.000€',
                  priority: 'Crítica'
                },
                {
                  type: 'salud',
                  label: 'Salud',
                  covered: policies.some(p => p.type === 'salud'),
                  risk: 'Tratamientos médicos privados pueden superar 15.000€',
                  priority: 'Alta'
                },
                {
                  type: 'vida',
                  label: 'Vida',
                  covered: policies.some(p => p.type === 'vida'),
                  risk: 'Sin protección financiera para tu familia',
                  priority: 'Media'
                },
              ]

              const coveredCount = essentialPolicies.filter(p => p.covered).length
              const totalCount = essentialPolicies.length
              const coveragePercentage = Math.round((coveredCount / totalCount) * 100)
              const gapPercentage = 100 - coveragePercentage
              const missingPolicies = essentialPolicies.filter(p => !p.covered)

              // Determine risk level badge
              const getRiskBadge = () => {
                if (gapPercentage === 0) return { variant: 'success' as const, label: 'Bien Protegido' }
                if (gapPercentage >= 75) return { variant: 'error' as const, label: 'Alto Riesgo' }
                if (gapPercentage >= 50) return { variant: 'warning' as const, label: 'Riesgo Medio' }
                if (gapPercentage >= 25) return { variant: 'warning' as const, label: 'Revisar Coberturas' }
                return { variant: 'success' as const, label: 'Baja Exposición' }
              }

              const riskBadge = getRiskBadge()

              return (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Análisis de Cobertura</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {gapPercentage === 0
                          ? 'Todas las coberturas esenciales activas'
                          : `Te faltan ${missingPolicies.length} de ${totalCount} coberturas esenciales`
                        }
                      </p>
                    </div>
                    <Badge variant={riskBadge.variant}>{riskBadge.label}</Badge>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Show GAP percentage in circular progress */}
                    <div className="relative">
                      <CircularProgress
                        value={gapPercentage}
                        size="xl"
                        strokeWidth={8}
                        variant={gapPercentage >= 50 ? 'error' : gapPercentage >= 25 ? 'warning' : 'success'}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{gapPercentage}%</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {gapPercentage === 0 ? 'Cubierto' : 'Descubierto'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {essentialPolicies.map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              {!item.covered && (
                                <span className="text-red-500" title={`Prioridad ${item.priority}`}>⚠️</span>
                              )}
                              <span className={cn(
                                'font-medium',
                                item.covered ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                              )}>
                                {item.label}
                              </span>
                            </div>
                            <span className={cn(
                              'font-medium text-xs',
                              item.covered
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            )}>
                              {item.covered ? '✓ Cubierto' : `✗ Sin cobertura - ${item.priority}`}
                            </span>
                          </div>

                          {/* Show risk message for uncovered policies */}
                          {!item.covered && (
                            <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                              <p className="text-xs text-red-700 dark:text-red-300">
                                {item.risk}
                              </p>
                            </div>
                          )}

                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: item.covered ? '100%' : '0%' }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                              className={cn(
                                'h-full rounded-full',
                                item.covered
                                  ? 'bg-emerald-500'
                                  : 'bg-red-300 dark:bg-red-700'
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Always show button if there are gaps */}
                  {gapPercentage > 0 && (
                    <Link href="/polizas">
                      <button type="button" className={cn(
                        'mt-6 w-full py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2',
                        gapPercentage >= 50
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                      )}>
                        <Shield className="w-4 h-4" />
                        {gapPercentage >= 50 ? 'Reducir riesgo urgentemente' : 'Completar protección'}
                      </button>
                    </Link>
                  )}

                  {/* If fully covered, show congratulations */}
                  {gapPercentage === 0 && (
                    <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 text-center font-medium">
                        ✅ Excelente - Todas tus coberturas esenciales están activas
                      </p>
                    </div>
                  )}
                </>
              )
            })()}
          </Card>
        </motion.div>

        {/* Active Claim Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeClaim ? (
            <Link href="/siniestros">
              <Card variant="elevated" hover="glow" className="p-6 h-full border-l-4 border-l-amber-500 cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge variant="warning" dot pulse className="mb-2">En progreso</Badge>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeClaim.type}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activeClaim.policyNumber}</p>
                  </div>
                  {activeClaim.assignedAgent && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Agente</p>
                      <p className="font-medium text-slate-900 dark:text-white">{activeClaim.assignedAgent}</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  {activeClaim.timeline.slice(0, 4).map((event, index) => (
                    <div key={event.id} className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        event.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      )}>
                        {event.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          'text-sm font-medium',
                          event.completed
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400'
                        )}>
                          {event.title}
                        </p>
                        {event.date && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDateShort(event.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {activeClaim.timeline.find((e) => !e.completed)?.title || 'Procesando...'}
                  </p>
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-medium">
                    Ver detalles <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Card>
            </Link>
          ) : (
            <Card variant="elevated" className="p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sin siniestros abiertos</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                ¡Excelente! No tienes ningún siniestro en gestión actualmente.
              </p>
              <Link href="/siniestros">
                <button type="button" className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Comunicar siniestro
                </button>
              </Link>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Renewal Checkpoints Section - Solo si hay polizas con checkpoints */}
      {policies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <RenewalCheckpoints
            maxVisible={2}
            onViewPolicy={(policyId) => {
              // Navegar a la poliza
              console.log('View policy:', policyId)
            }}
          />
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Policies List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mis Pólizas</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{policies.length} pólizas en total</p>
              </div>
              <Link href="/polizas" className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 font-medium hover:underline">
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {policies.slice(0, 4).map((policy, index) => {
                const colors = policyColors[policy.type] || policyColors.decesos
                const Icon = policyIcons[policy.type] || Shield

                return (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link href="/polizas">
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                        <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br', colors.bg)}>
                          <Icon className={cn('w-7 h-7', colors.icon)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white truncate">{policy.name}</span>
                            <Badge variant="success" size="xs">Activa</Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{policy.number}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                            Vence: {formatDateShort(policy.endDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatCurrency(policy.premium)}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">/año</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {policies.length === 0 && (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">No tienes pólizas activas</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* Wallet Summary Widget */}
          <WalletSummary variant="compact" />

          {/* Leaderboard Mini Widget */}
          <LeaderboardMini period="weekly" />

          {/* Next Payment Card */}
          {nextPayment && (
            <Card variant="premium" className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Próximo pago</p>
                    <p className="font-medium text-slate-900 dark:text-white">{formatDateShort(nextPayment.date)}</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {formatCurrency(nextPayment.policy.premium / 2)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{nextPayment.policy.name}</p>
                <Link href="/pagos">
                  <button type="button" className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pagar ahora
                  </button>
                </Link>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card variant="glass" className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Acciones rápidas</h3>
            <div className="space-y-2">
              <Link href="/siniestros">
                <button type="button" className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-left group">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">Comunicar siniestro</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </Link>
              <Link href="/documentos">
                <button type="button" className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-left group">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">Ver documentos</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </Link>
              <button
                type="button"
                onClick={openChat}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 hover:from-red-100 hover:to-red-200 dark:hover:from-red-950 dark:hover:to-red-900/50 active:scale-[0.98] transition-all text-left group border border-red-200 dark:border-red-800/50"
              >
                <Sparkles className="w-5 h-5 text-red-500" />
                <span className="flex-1 text-sm font-semibold text-red-700 dark:text-red-300">Hablar con SORI</span>
                <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-all" />
              </button>
              <a href="tel:966810290" className="block">
                <button type="button" className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-left group">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">Llamar ahora</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </a>
            </div>
          </Card>

          {/* Notifications */}
          {unreadNotifications > 0 && (
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {unreadNotifications} notificación{unreadNotifications > 1 ? 'es' : ''} nueva{unreadNotifications > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {notifications.filter((n) => !n.read).slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    {notif.type === 'points' && <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />}
                    {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />}
                    {notif.type === 'info' && <Bell className="w-4 h-4 text-blue-500 mt-0.5" />}
                    {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />}
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{notif.message}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Contact Card */}
          <Card variant="default" className="p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">¿Necesitas ayuda?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Estamos aquí para ti</p>
            <a href="tel:966810290" className="block w-full py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
              966 810 290
            </a>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">L-V 9:00-14:00 y 16:00-19:00</p>
          </Card>
        </motion.div>
      </div>

      {/* Daily Quiz Widget - Floating Component */}
      <DailyQuizWidget
        onComplete={(score, xpEarned, coinsEarned) => {
          console.log('Quiz completed:', { score, xpEarned, coinsEarned })
          // Aqui se puede actualizar el estado global con los puntos ganados
        }}
      />
    </div>
  )
}
