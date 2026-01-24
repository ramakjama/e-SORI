'use client'

import { motion } from 'framer-motion'
import {
  Shield, Clock, Users, Award, Phone, CheckCircle,
  Star, Building2, Headphones, Lock
} from 'lucide-react'
import { TrustBarConfig, LandingTheme } from '@/lib/landing/types'

const iconMap: Record<string, any> = {
  Shield, Clock, Users, Award, Phone, CheckCircle,
  Star, Building2, Headphones, Lock
}

interface TrustBarProps {
  config?: TrustBarConfig
  theme: LandingTheme
}

const defaultItems = [
  { icon: 'Clock', text: '+25 años', highlight: 'de experiencia' },
  { icon: 'Building2', text: '+20 aseguradoras', highlight: '' },
  { icon: 'Phone', text: 'Respuesta', highlight: 'en 24h' },
  { icon: 'Headphones', text: 'Soporte', highlight: '24/7' },
  { icon: 'Users', text: '+10.000', highlight: 'clientes' },
  { icon: 'Lock', text: '100%', highlight: 'seguro' },
]

export function TrustBar({ config, theme }: TrustBarProps) {
  const items = config?.items || defaultItems
  const variant = config?.variant || 'horizontal'

  return (
    <section className="py-8 border-y" style={{ borderColor: 'var(--color-border)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`
          ${variant === 'horizontal'
            ? 'flex flex-wrap items-center justify-center gap-8 md:gap-12'
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'
          }
        `}>
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Shield
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 ${variant === 'grid' ? 'flex-col text-center' : ''}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primaryColor}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                </div>
                <div>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {item.text}
                  </span>
                  {item.highlight && (
                    <span className="ml-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.highlight}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
