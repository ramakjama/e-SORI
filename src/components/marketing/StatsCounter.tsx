'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  value: number
  suffix?: string
  prefix?: string
  label: string
  description?: string
}

interface StatsCounterProps {
  stats: Stat[]
  title?: string
  variant?: 'default' | 'cards' | 'inline'
}

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const stepValue = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, isInView])

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsCounter({ stats, title, variant = 'default' }: StatsCounterProps) {
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap justify-center gap-8 py-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl sm:text-4xl font-bold text-occident">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--color-text)' }}>
              {title}
            </h2>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-occident">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-sm font-medium mt-2" style={{ color: 'var(--color-text)' }}>
                  {stat.label}
                </div>
                {stat.description && (
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
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

  // Default variant
  return (
    <section className="bg-gradient-to-r from-occident to-occident-600 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl font-bold text-center text-white mb-12">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-white">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-white/80 mt-2 font-medium">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-white/60 text-sm mt-1">
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
