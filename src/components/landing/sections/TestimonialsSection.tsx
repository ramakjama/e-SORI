'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { TestimonialsConfig, LandingTheme } from '@/lib/landing/types'

interface TestimonialsSectionProps {
  config: TestimonialsConfig
  theme: LandingTheme
}

export function TestimonialsSection({ config, theme }: TestimonialsSectionProps) {
  const { title, subtitle, items, autoPlay = true } = config
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, items.length])

  const goTo = (index: number) => setCurrentIndex(index)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length)

  if (items.length === 0) return null

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
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
        )}

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="card p-8 md:p-12 text-center"
            >
              {/* Quote Icon */}
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.primaryColor}15` }}
              >
                <Quote className="w-8 h-8" style={{ color: theme.primaryColor }} />
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= items[currentIndex].rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p
                className="text-lg md:text-xl leading-relaxed mb-8 italic"
                style={{ color: 'var(--color-text)' }}
              >
                "{items[currentIndex].content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                {items[currentIndex].image ? (
                  <img
                    src={items[currentIndex].image}
                    alt={items[currentIndex].name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {items[currentIndex].name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {items[currentIndex].name}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {items[currentIndex].role}
                  </div>
                  {items[currentIndex].insuranceType && (
                    <div
                      className="text-xs font-medium mt-1"
                      style={{ color: theme.primaryColor }}
                    >
                      {items[currentIndex].insuranceType}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                style={{ color: 'var(--color-text)' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                style={{ color: 'var(--color-text)' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'w-8' : ''
                    }`}
                    style={{
                      backgroundColor: index === currentIndex
                        ? theme.primaryColor
                        : 'var(--color-border)'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
