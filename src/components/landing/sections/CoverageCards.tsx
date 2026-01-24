'use client'

import { motion } from 'framer-motion'
import { Check, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CoveragesConfig, LandingTheme } from '@/lib/landing/types'

interface CoverageCardsProps {
  config: CoveragesConfig
  theme: LandingTheme
}

export function CoverageCards({ config, theme }: CoverageCardsProps) {
  const { title, subtitle, cards, columns = 3 } = config

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
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

        {/* Cards */}
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`
                card p-6 relative overflow-hidden
                ${card.popular ? 'ring-2 scale-105' : ''}
              `}
              style={card.popular ? {
                borderColor: theme.primaryColor,
                boxShadow: `0 0 30px ${theme.primaryColor}20`
              } : undefined}
            >
              {/* Popular Badge */}
              {card.popular && (
                <div
                  className="absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white rounded-bl-xl"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Star className="w-3 h-3 inline mr-1" />
                  Más popular
                </div>
              )}

              {/* Card Content */}
              <div className="mb-6">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {card.name}
                </h3>
                {card.description && (
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {card.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <span
                  className="text-3xl font-bold"
                  style={{ color: card.popular ? theme.primaryColor : 'var(--color-text)' }}
                >
                  {card.price}
                </span>
                {card.period && (
                  <span className="text-sm ml-1" style={{ color: 'var(--color-text-secondary)' }}>
                    /{card.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {card.features.map((feature, i) => {
                  const text = typeof feature === 'string' ? feature : feature.text
                  const included = typeof feature === 'string' ? true : feature.included
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          included ? '' : 'opacity-30'
                        }`}
                        style={{ color: included ? theme.primaryColor : 'var(--color-text-secondary)' }}
                      />
                      <span
                        className={`text-sm ${included ? '' : 'line-through opacity-50'}`}
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {text}
                      </span>
                    </li>
                  )
                })}
              </ul>

              {/* CTA */}
              <Link
                href={card.ctaHref || '#cta-section'}
                className={`
                  w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all
                  ${card.popular
                    ? 'text-white hover:opacity-90'
                    : 'border hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
                style={card.popular
                  ? { backgroundColor: theme.primaryColor }
                  : { borderColor: 'var(--color-border)', color: 'var(--color-text)' }
                }
              >
                {card.ctaText || 'Solicitar'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
