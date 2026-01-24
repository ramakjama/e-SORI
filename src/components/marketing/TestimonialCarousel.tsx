'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  image?: string
  content: string
  rating: number
  insuranceType?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
  autoPlay?: boolean
}

export function TestimonialCarousel({
  testimonials,
  title = 'Lo que dicen nuestros clientes',
  subtitle,
  autoPlay = true,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play
  // useEffect(() => {
  //   if (!autoPlay) return
  //   const timer = setInterval(next, 5000)
  //   return () => clearInterval(timer)
  // }, [autoPlay])

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="card p-8 sm:p-12 text-center"
            >
              {/* Quote Icon */}
              <Quote className="w-12 h-12 mx-auto mb-6 text-occident/20" />

              {/* Content */}
              <p
                className="text-lg sm:text-xl leading-relaxed mb-8"
                style={{ color: 'var(--color-text)' }}
              >
                "{testimonials[activeIndex].content}"
              </p>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[activeIndex].rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                {testimonials[activeIndex].image ? (
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-occident/20 to-occident/10 flex items-center justify-center">
                    <span className="text-occident font-bold text-lg">
                      {testimonials[activeIndex].name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {testimonials[activeIndex].role}
                  </p>
                  {testimonials[activeIndex].insuranceType && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-occident/10 text-occident">
                      {testimonials[activeIndex].insuranceType}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:bg-occident hover:text-white hover:border-occident"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-occident w-8'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:bg-occident hover:text-white hover:border-occident"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
