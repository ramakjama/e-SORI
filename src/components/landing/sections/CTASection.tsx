'use client'

import { motion } from 'framer-motion'
import { Phone, CheckCircle } from 'lucide-react'
import { CTAConfig, LandingTheme, InsuranceType } from '@/lib/landing/types'
import { LeadForm } from '@/components/forms/LeadForm'

interface CTASectionProps {
  config: CTAConfig
  theme: LandingTheme
  source: string
  campaign?: string
  insuranceType: InsuranceType
  gamificationPoints: number
}

export function CTASection({
  config,
  theme,
  source,
  campaign,
  insuranceType,
  gamificationPoints
}: CTASectionProps) {
  const {
    title,
    subtitle,
    features,
    showForm = true,
    formTitle,
    formSubtitle,
    formButtonText,
    phone = '900 123 456',
    showPhone = true
  } = config

  return (
    <section
      id="cta-section"
      className="py-20"
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}F0, ${theme.secondaryColor}F0)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {title}
            </h2>

            {subtitle && (
              <p className="text-lg text-white/90 mb-8">
                {subtitle}
              </p>
            )}

            {/* Features */}
            {features && features.length > 0 && (
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Phone CTA */}
            {showPhone && (
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Llamar: {phone}
                </a>
                <span className="text-white/70 text-sm">
                  Lun-Vie 9:00-20:00
                </span>
              </div>
            )}

            {/* Gamification badge */}
            {gamificationPoints > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full"
              >
                <span className="text-2xl">🎁</span>
                <span className="text-white font-medium">
                  +{gamificationPoints} puntos Soriano Club al contratar
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <LeadForm
                source={source}
                campaign={campaign}
                insuranceType={insuranceType}
                title={formTitle || 'Te llamamos gratis'}
                subtitle={formSubtitle || 'Un asesor te contactará en menos de 24h'}
                buttonText={formButtonText || 'Solicitar llamada'}
                gamificationPoints={gamificationPoints}
                accentColor={theme.primaryColor}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
