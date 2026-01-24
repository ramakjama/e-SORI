'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { FAQConfig, LandingTheme } from '@/lib/landing/types'

interface FAQSectionProps {
  config: FAQConfig
  theme: LandingTheme
}

export function FAQSection({ config, theme }: FAQSectionProps) {
  const { title, subtitle, items } = config
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (items.length === 0) return null

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Preguntas frecuentes</span>
          </motion.div>

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
              className="text-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-semibold pr-4" style={{ color: 'var(--color-text)' }}>
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  style={{ color: theme.primaryColor }}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-6 pb-5 text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            ¿No encuentras lo que buscas?
          </p>
          <a
            href="tel:+34900000000"
            className="inline-flex items-center gap-2 font-semibold hover:underline"
            style={{ color: theme.primaryColor }}
          >
            Llámanos y te ayudamos
          </a>
        </motion.div>
      </div>
    </section>
  )
}
