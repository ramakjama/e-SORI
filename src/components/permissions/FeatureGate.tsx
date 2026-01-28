'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Lock, TrendingUp, Sparkles } from 'lucide-react'
import { Feature, UserLevel, hasPermission, getLevelInfo } from '@/lib/permissions'
import { useStore } from '@/store/useStore'
import Link from 'next/link'

interface FeatureGateProps {
  feature: Feature
  children: ReactNode
  fallback?: ReactNode
  showUpgrade?: boolean
}

/**
 * Componente que controla el acceso a funcionalidades según el nivel del usuario
 *
 * @example
 * <FeatureGate feature="polizas.cotizar.advanced">
 *   <AdvancedQuoteForm />
 * </FeatureGate>
 */
export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgrade = true,
}: FeatureGateProps) {
  const { user } = useStore()
  const userLevel = user?.level as UserLevel | undefined

  const hasAccess = hasPermission(userLevel, feature)

  if (hasAccess) {
    return <>{children}</>
  }

  // Si hay fallback personalizado, mostrarlo
  if (fallback) {
    return <>{fallback}</>
  }

  // Si showUpgrade es false, no mostrar nada
  if (!showUpgrade) {
    return null
  }

  // Mostrar mensaje de upgrade por defecto
  return <UpgradePrompt feature={feature} userLevel={userLevel} />
}

/**
 * Mensaje visual para animar al usuario a mejorar su nivel
 */
function UpgradePrompt({
  feature,
  userLevel,
}: {
  feature: Feature
  userLevel: UserLevel | undefined
}) {
  // Determinar qué nivel se necesita para esta funcionalidad
  const requiredLevel = getRequiredLevel(feature)
  const requiredLevelInfo = requiredLevel ? getLevelInfo(requiredLevel) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-8 rounded-3xl text-center border-2"
      style={{
        borderColor: 'var(--color-border)',
        background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.05), rgba(168, 85, 247, 0.05))',
      }}
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-6">
        <Lock className="w-10 h-10" style={{ color: 'var(--accent-blue)' }} />
      </div>

      <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
        Funcionalidad Premium {requiredLevelInfo?.icon}
      </h3>

      <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Esta funcionalidad está disponible para clientes de nivel{' '}
        <span
          className="font-bold"
          style={{
            background: 'linear-gradient(135deg, var(--accent-blue), #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {requiredLevelInfo?.name || 'superior'}
        </span>
      </p>

      {userLevel && requiredLevelInfo && (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Tu nivel actual:
            </span>
            <span className={`${getLevelInfo(userLevel).badge} px-3 py-1`}>
              {getLevelInfo(userLevel).icon} {getLevelInfo(userLevel).name}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/Sori HUB"
              className="btn-primary inline-flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Ver cómo subir de nivel
            </Link>

            <Link
              href="/marketplace"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Desbloquear ahora
            </Link>
          </div>

          <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Beneficios del nivel {requiredLevelInfo.name}:
            </p>
            <ul className="space-y-2">
              {requiredLevelInfo.features.slice(0, 3).map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 justify-center text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  )
}

/**
 * Determina el nivel mínimo requerido para una funcionalidad
 */
function getRequiredLevel(feature: Feature): UserLevel | null {
  const levels: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']

  for (const level of levels) {
    if (hasPermission(level, feature)) {
      return level
    }
  }

  return null
}

/**
 * Badge simple para mostrar si una funcionalidad está disponible
 */
export function FeatureBadge({ feature }: { feature: Feature }) {
  const { user } = useStore()
  const userLevel = user?.level as UserLevel | undefined
  const hasAccess = hasPermission(userLevel, feature)

  if (hasAccess) {
    return null
  }

  const requiredLevel = getRequiredLevel(feature)
  const levelInfo = requiredLevel ? getLevelInfo(requiredLevel) : null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium">
      <Lock className="w-3 h-3" />
      {levelInfo?.icon} {levelInfo?.name}
    </span>
  )
}
