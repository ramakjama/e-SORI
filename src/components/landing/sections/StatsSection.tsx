'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { StatsConfig, LandingTheme } from '@/lib/landing/types'

interface StatsSectionProps {
  config: StatsConfig
  theme: LandingTheme
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection({ config, theme }: StatsSectionProps) {
  const { title, items, variant = 'default' } = config

  if (variant === 'inline') {
    return (
      <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {items.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-3xl font-bold"
                  style={{ color: theme.primaryColor }}
                >
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'cards') {
    return (
      <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
              style={{ color: 'var(--color-text)' }}
            >
              {title}
            </motion.h2>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: theme.primaryColor }}
                >
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                  {stat.label}
                </div>
                {stat.description && (
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {stat.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default variant with gradient background
  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}10, ${theme.secondaryColor}10)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </motion.h2>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div
                className="text-5xl lg:text-6xl font-bold mb-2"
                style={{ color: theme.primaryColor }}
              >
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {stat.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
