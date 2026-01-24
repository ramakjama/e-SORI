'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  color?: string
}

interface FeatureGridProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export function FeatureGrid({
  title,
  subtitle,
  features,
  columns = 3,
}: FeatureGridProps) {
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
                className="text-3xl sm:text-4xl font-bold"
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
                className="mt-4 text-lg max-w-2xl mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  feature.color || 'bg-gradient-to-br from-occident/10 to-occident/5'
                }`}
              >
                <feature.icon
                  className={`w-7 h-7 ${
                    feature.color ? 'text-white' : 'text-occident'
                  }`}
                />
              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                {feature.title}
              </h3>

              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
