'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Phone, Play } from 'lucide-react'
import { HeroConfig } from '@/lib/landing/types'
import { LandingTheme } from '@/lib/landing/types'
import { CountdownTimer } from '@/components/gamification/CountdownTimer'
import { ParticleEffect } from '@/components/animations/ParticleEffect'

interface HeroSectionProps {
  config: HeroConfig
  theme: LandingTheme
  countdownDate?: string
  showCountdown?: boolean
}

export function HeroSection({ config, theme, countdownDate, showCountdown }: HeroSectionProps) {
  const {
    title,
    subtitle,
    badge,
    image,
    ctaPrimary,
    ctaSecondary,
    showParticles = false,
    darkMode = false,
  } = config

  // Parse title for line breaks
  const titleLines = title.split('\\n')

  return (
    <section
      className={`relative min-h-[85vh] flex items-center overflow-hidden ${
        darkMode ? 'bg-gray-900' : ''
      }`}
      style={{
        background: darkMode
          ? `linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)`
          : `linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%)`,
      }}
    >
      {/* Particle Effect */}
      {showParticles && theme.particleEffect && theme.particleEffect !== 'none' && (
        <ParticleEffect type={theme.particleEffect} />
      )}

      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: theme.primaryColor }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.secondaryColor }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor,
                }}
              >
                <span className="text-lg">{theme.emoji}</span>
                {badge}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: darkMode ? '#ffffff' : 'var(--color-text)' }}
            >
              {titleLines.map((line, i) => (
                <span key={i}>
                  {i === 0 ? (
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                      }}
                    >
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl mb-8 max-w-xl"
              style={{ color: darkMode ? '#a1a1aa' : 'var(--color-text-secondary)' }}
            >
              {subtitle}
            </motion.p>

            {/* Countdown */}
            {showCountdown && countdownDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <CountdownTimer
                  targetDate={new Date(countdownDate)}
                  variant="compact"
                />
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {ctaPrimary.href ? (
                <Link
                  href={ctaPrimary.href}
                  className="btn-primary text-lg px-8 py-4"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {ctaPrimary.text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    if (ctaPrimary.scrollTo) {
                      document.getElementById(ctaPrimary.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="btn-primary text-lg px-8 py-4"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {ctaPrimary.text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              )}

              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  {ctaSecondary.text}
                </Link>
              )}
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex items-center gap-6 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: darkMode ? '#a1a1aa' : 'var(--color-text-secondary)' }}
                >
                  +10.000 clientes
                </span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                <span
                  className="text-sm font-medium ml-1"
                  style={{ color: darkMode ? '#a1a1aa' : 'var(--color-text-secondary)' }}
                >
                  4.9/5
                </span>
              </div>
            </motion.div>
          </div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            ) : (
              // Placeholder visual
              <div
                className="w-full aspect-square rounded-3xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
                }}
              >
                <span className="text-9xl">{theme.emoji}</span>
              </div>
            )}

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 card p-4 shadow-premium-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primaryColor}20` }}
                >
                  <span className="text-2xl">{theme.emoji}</span>
                </div>
                <div>
                  <p className="font-bold" style={{ color: 'var(--color-text)' }}>
                    Ahorra hasta 25%
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Comparamos +20 aseguradoras
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
