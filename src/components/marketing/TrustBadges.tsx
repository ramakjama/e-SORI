'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Clock, HeadphonesIcon, CheckCircle, Lock } from 'lucide-react'

interface TrustBadge {
  icon: React.ElementType
  title: string
  description?: string
}

interface TrustBadgesProps {
  variant?: 'horizontal' | 'grid'
  showTitle?: boolean
  badges?: TrustBadge[]
}

const defaultBadges: TrustBadge[] = [
  {
    icon: Shield,
    title: '+25 años de experiencia',
    description: 'Protegiendo familias desde 1998',
  },
  {
    icon: Award,
    title: 'Las mejores aseguradoras',
    description: 'Occident, Mapfre, AXA y más',
  },
  {
    icon: Clock,
    title: 'Respuesta en 24h',
    description: 'Atención rápida garantizada',
  },
  {
    icon: HeadphonesIcon,
    title: 'Soporte personalizado',
    description: 'Tu asesor de confianza',
  },
  {
    icon: CheckCircle,
    title: '+10.000 clientes',
    description: 'Confían en nosotros',
  },
  {
    icon: Lock,
    title: '100% seguro',
    description: 'Datos protegidos',
  },
]

export function TrustBadges({
  variant = 'horizontal',
  showTitle = true,
  badges = defaultBadges,
}: TrustBadgesProps) {
  if (variant === 'horizontal') {
    return (
      <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {showTitle && (
            <p className="text-center text-sm font-medium mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              ¿Por qué elegirnos?
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {badges.slice(0, 4).map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-occident/10 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-occident" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    {badge.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Grid variant
  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
              ¿Por qué confiar en Soriano?
            </h2>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 text-center hover:shadow-premium-lg transition-shadow"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-occident/10 to-occident/5 flex items-center justify-center mb-4">
                <badge.icon className="w-7 h-7 text-occident" />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                {badge.title}
              </h3>
              {badge.description && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {badge.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
