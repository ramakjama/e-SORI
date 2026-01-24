'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { CountdownTimer } from '@/components/gamification/CountdownTimer'
import { ParticleEffect } from '@/components/animations/ParticleEffect'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaPrimary: { text: string; href: string }
  ctaSecondary?: { text: string; href: string }
  image?: string
  particles?: 'confetti' | 'snow' | 'hearts' | 'none'
  countdown?: Date
  badge?: string
  gradient?: string
  dark?: boolean
}

export function HeroSection({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  image,
  particles = 'none',
  countdown,
  badge,
  gradient = 'from-occident/5 via-transparent to-accent-purple/5',
  dark = false,
}: HeroSectionProps) {
  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-apple-gray-900' : ''}`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Particles */}
      {particles !== 'none' && <ParticleEffect type={particles} />}

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-occident/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-occident/10 text-occident text-sm font-semibold mb-6"
              >
                <Sparkles className="w-4 h-4" />
                {badge}
              </motion.div>
            )}

            {/* Title */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${
                dark ? 'text-white' : ''
              }`}
              style={{ color: dark ? undefined : 'var(--color-text)' }}
            >
              {title.split('\\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.split('\\n').length - 1 && <br />}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-6 text-lg sm:text-xl max-w-xl ${
                dark ? 'text-gray-300' : ''
              }`}
              style={{ color: dark ? undefined : 'var(--color-text-secondary)' }}
            >
              {subtitle}
            </p>

            {/* Countdown */}
            {countdown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <CountdownTimer targetDate={countdown} />
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={ctaPrimary.href}
                className="btn-primary group text-base px-8 py-4"
              >
                {ctaPrimary.text}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="btn-secondary text-base px-8 py-4"
                >
                  {ctaSecondary.text}
                </Link>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-occident/20 to-accent-purple/20 flex items-center justify-center text-xs font-bold"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>+10,000</strong> clientes satisfechos
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {image ? (
              <img
                src={image}
                alt="Hero"
                className="w-full h-auto rounded-3xl shadow-premium-lg"
              />
            ) : (
              <div className="relative">
                {/* Abstract Visual */}
                <div className="aspect-square relative">
                  {/* Floating Cards */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 left-10 card p-6 shadow-premium-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3">
                      <span className="text-white text-2xl">🚗</span>
                    </div>
                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Seguro Auto</p>
                    <p className="text-sm text-occident font-bold">Desde 15€/mes</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-32 right-0 card p-6 shadow-premium-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3">
                      <span className="text-white text-2xl">🏠</span>
                    </div>
                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Seguro Hogar</p>
                    <p className="text-sm text-occident font-bold">Desde 8€/mes</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-20 left-20 card p-6 shadow-premium-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-3">
                      <span className="text-white text-2xl">❤️</span>
                    </div>
                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Seguro Vida</p>
                    <p className="text-sm text-occident font-bold">Desde 5€/mes</p>
                  </motion.div>

                  {/* Central Badge */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-32 h-32 bg-gradient-to-br from-occident to-occident-600 rounded-full flex items-center justify-center shadow-glow"
                    >
                      <div className="text-center text-white">
                        <span className="text-3xl font-bold">25%</span>
                        <p className="text-xs">AHORRO</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
