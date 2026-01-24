'use client'

import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { BenefitsConfig, LandingTheme } from '@/lib/landing/types'

interface BenefitsGridProps {
  config: BenefitsConfig
  theme: LandingTheme
}

export function BenefitsGrid({ config, theme }: BenefitsGridProps) {
  const { title, subtitle, items, columns = 3 } = config

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: 'var(--color-text)' }}
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg max-w-2xl mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {items.map((item, index) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Shield
            const itemColor = item.color || theme.primaryColor

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-premium-lg transition-all duration-300 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${itemColor}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: itemColor }} />
                </div>

                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
