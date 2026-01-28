'use client'

import { useState } from 'react'
import {
  Copy,
  Check,
  Share2,
  Users,
  Coins,
  TrendingUp,
  Gift,
  MessageCircle,
  Mail,
  Send,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Trophy,
  UserPlus,
  ExternalLink
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import {
  ReferralTracker,
  ReferralTrackerMini,
  type ReferralStage
} from '@/components/gamification/ReferralTracker'

// ============================================
// TYPES
// ============================================

interface ReferralInfo {
  id: string
  code: string
  referredEmail: string | null
  referredPhone: string | null
  referredName: string | null
  stage: ReferralStage
  xpAwarded: number
  coinsAwarded: number
  createdAt: string
  updatedAt: string
}

interface ReferralStats {
  total: number
  byStage: Record<ReferralStage, number>
  totalXPEarned: number
  totalCoinsEarned: number
  conversionRate: number
}

// ============================================
// MOCK DATA (para demo, en prod viene de API)
// ============================================

const MOCK_REFERRALS: ReferralInfo[] = [
  {
    id: '1',
    code: 'JUAN-A1B2C3',
    referredName: 'Maria Lopez',
    referredEmail: 'maria.lopez@email.com',
    referredPhone: '666111222',
    stage: 'POLICY_PAID',
    xpAwarded: 285,
    coinsAwarded: 1350,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
  {
    id: '2',
    code: 'JUAN-D4E5F6',
    referredName: 'Carlos Martinez',
    referredEmail: 'carlos.m@email.com',
    referredPhone: '677333444',
    stage: 'REQUESTED_REVIEW',
    xpAwarded: 85,
    coinsAwarded: 350,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-10T16:30:00Z',
  },
  {
    id: '3',
    code: 'JUAN-G7H8I9',
    referredName: 'Ana Garcia',
    referredEmail: 'ana.garcia@email.com',
    referredPhone: null,
    stage: 'PROFILE_QUIZ',
    xpAwarded: 35,
    coinsAwarded: 150,
    createdAt: '2024-03-05T11:15:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '4',
    code: 'JUAN-J1K2L3',
    referredName: 'Pedro Sanchez',
    referredEmail: 'pedro.s@email.com',
    referredPhone: '688555666',
    stage: 'INSTALL_OPEN',
    xpAwarded: 10,
    coinsAwarded: 50,
    createdAt: '2024-03-20T14:45:00Z',
    updatedAt: '2024-03-22T09:30:00Z',
  },
  {
    id: '5',
    code: 'JUAN-M4N5O6',
    referredName: null,
    referredEmail: 'nuevo@email.com',
    referredPhone: null,
    stage: 'INVITED',
    xpAwarded: 0,
    coinsAwarded: 0,
    createdAt: '2024-03-25T08:00:00Z',
    updatedAt: '2024-03-25T08:00:00Z',
  },
]

const MOCK_STATS: ReferralStats = {
  total: 5,
  byStage: {
    INVITED: 1,
    INSTALL_OPEN: 1,
    PROFILE_QUIZ: 1,
    REQUESTED_REVIEW: 1,
    POLICY_PAID: 1,
  },
  totalXPEarned: 415,
  totalCoinsEarned: 1900,
  conversionRate: 20,
}

// ============================================
// STAGE REWARDS CONFIG
// ============================================

const STAGE_REWARDS = {
  INSTALL_OPEN: { coins: 50, label: 'Instala app' },
  PROFILE_QUIZ: { coins: 100, label: 'Completa perfil' },
  REQUESTED_REVIEW: { coins: 200, label: 'Pide presupuesto' },
  POLICY_PAID: { coins: 1000, label: 'Contrata poliza' },
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ReferidosPage() {
  const { user } = useStore()
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState<ReferralInfo[]>(MOCK_REFERRALS)
  const [stats, setStats] = useState<ReferralStats>(MOCK_STATS)
  const [loading, setLoading] = useState(false)
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null)

  const referralCode = user?.referralCode || 'ESORI2024'
  const shareUrl = `https://e-sori.soriano.es/r/${referralCode}`

  // Copy referral code
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying:', error)
    }
  }

  // Copy share URL
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying URL:', error)
    }
  }

  // Share functions
  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Te invito a unirte a e-SORI, la app de Soriano Seguros. Usa mi codigo ${referralCode} y ambos ganaremos recompensas: ${shareUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareTelegram = () => {
    const text = encodeURIComponent(
      `Te invito a unirte a e-SORI, la app de Soriano Seguros. Usa mi codigo ${referralCode} y ambos ganaremos recompensas!`
    )
    const url = encodeURIComponent(shareUrl)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
  }

  const shareEmail = () => {
    const subject = encodeURIComponent('Te invito a e-SORI de Soriano Seguros')
    const body = encodeURIComponent(
      `Hola,

Te invito a unirte a e-SORI, el portal de clientes de Soriano Mediadores de Seguros.

Usa mi codigo de referido: ${referralCode}

O registrate directamente con este enlace: ${shareUrl}

Ambos ganaremos recompensas cuando contrates tu primera poliza.

Saludos!`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  // Toggle expanded referral
  const toggleExpanded = (id: string) => {
    setExpandedReferral(expandedReferral === id ? null : id)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Get stage label
  const getStageLabel = (stage: ReferralStage) => {
    switch (stage) {
      case 'INVITED':
        return 'Invitado'
      case 'INSTALL_OPEN':
        return 'App instalada'
      case 'PROFILE_QUIZ':
        return 'Perfil completado'
      case 'REQUESTED_REVIEW':
        return 'Presupuesto solicitado'
      case 'POLICY_PAID':
        return 'Poliza contratada'
      default:
        return stage
    }
  }

  // Get stage color
  const getStageColor = (stage: ReferralStage) => {
    switch (stage) {
      case 'INVITED':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      case 'INSTALL_OPEN':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      case 'PROFILE_QUIZ':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
      case 'REQUESTED_REVIEW':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
      case 'POLICY_PAID':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (!user) return null

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-occident/10 to-purple-500/10 rounded-full mb-4">
          <UserPlus className="w-5 h-5 text-occident" />
          <span className="font-medium text-slate-900 dark:text-white">
            Programa de Referidos
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          Invita y Gana
        </h1>
        <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400">
          Comparte tu codigo con amigos y familia. Gana coins por cada paso que completen.
        </p>
      </div>

      {/* Referral Code Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-occident/5 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/5 to-orange-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Gift className="w-5 h-5 text-occident" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Tu Codigo de Referido
            </h2>
          </div>

          {/* Code Display */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
            <div className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-dashed border-occident/30 bg-gradient-to-r from-occident/5 to-purple-500/5">
              <code className="text-2xl sm:text-3xl font-mono font-bold tracking-widest block text-center text-slate-900 dark:text-white">
                {referralCode}
              </code>
            </div>

            <button
              type="button"
              onClick={copyCode}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-occident text-white hover:bg-red-700'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar
                </>
              )}
            </button>
          </div>

          {/* Share URL */}
          <div className="mb-6">
            <p className="text-sm mb-2 text-center text-slate-600 dark:text-slate-400">
              O comparte tu enlace personal:
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl mx-auto max-w-md bg-slate-100 dark:bg-slate-900">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm outline-none truncate text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={copyUrl}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                aria-label="Copiar enlace"
              >
                <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#20BD5A] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={shareTelegram}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0088cc] text-white font-medium hover:bg-[#0077b5] transition-colors"
            >
              <Send className="w-5 h-5" />
              Telegram
            </button>

            <button
              type="button"
              onClick={shareEmail}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {stats.total}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total referidos
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {stats.conversionRate}%
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tasa conversion
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-500">
            {stats.totalCoinsEarned.toLocaleString()}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Coins ganados
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-500">
            {stats.byStage.POLICY_PAID}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Conversiones
          </p>
        </div>
      </div>

      {/* Rewards Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-occident" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recompensas por Etapa
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STAGE_REWARDS).map(([stage, reward]) => (
            <div
              key={stage}
              className="p-4 rounded-xl text-center bg-slate-50 dark:bg-slate-900"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="text-xl font-bold text-amber-500">+{reward.coins}</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {reward.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Total potencial por referido:
            </span>
            <span className="text-xl font-bold text-amber-500">1,350 coins</span>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-occident" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Tus Referidos
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-occident/10 text-occident">
              {referrals.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setLoading(true)}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Actualizar"
          >
            <RefreshCw className={cn('w-5 h-5 text-slate-600 dark:text-slate-400', loading && 'animate-spin')} />
          </button>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-20 text-slate-900 dark:text-white" />
            <p className="text-lg font-medium mb-2 text-slate-900 dark:text-white">
              Aun no tienes referidos
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Comparte tu codigo y empieza a ganar recompensas
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(referral.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-occident/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-occident">
                      {(referral.referredName || referral.referredEmail || '?')[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold truncate text-slate-900 dark:text-white">
                      {referral.referredName || 'Invitado'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <ReferralTrackerMini currentStage={referral.stage} />
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          getStageColor(referral.stage)
                        )}
                      >
                        {getStageLabel(referral.stage)}
                      </span>
                    </div>
                  </div>

                  {/* Coins */}
                  {referral.coinsAwarded > 0 && (
                    <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-amber-500">
                        +{referral.coinsAwarded}
                      </span>
                    </div>
                  )}

                  {/* Expand Icon */}
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform',
                      expandedReferral === referral.id && 'rotate-180'
                    )}
                  />
                </button>

                {/* Expanded Content */}
                {expandedReferral === referral.id && (
                  <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-700">
                    {/* Contact Info */}
                    <div className="mb-4 pt-4 flex flex-wrap gap-4 text-sm">
                      {referral.referredEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-900 dark:text-white">{referral.referredEmail}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 dark:text-slate-400">Invitado:</span>
                        <span className="text-slate-900 dark:text-white">{formatDate(referral.createdAt)}</span>
                      </div>
                    </div>

                    {/* Full Tracker */}
                    <ReferralTracker
                      currentStage={referral.stage}
                      coinsEarned={referral.coinsAwarded}
                      compact
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Share2 className="w-5 h-5 text-occident" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Como Funciona
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-500">1</span>
            </div>
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
              Comparte tu codigo
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Envia tu codigo por WhatsApp, Telegram o email a amigos y familiares
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-500">2</span>
            </div>
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
              Ellos se registran
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Cuando usen tu codigo al registrarse, empezaras a ganar coins por cada paso
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-500">3</span>
            </div>
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
              Gana recompensas
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Acumula hasta 1,350 coins por cada referido que contrate una poliza
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
