'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Sparkles, TrendingDown, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'

interface ExitIntentModalProps {
  enabled?: boolean
  cookieDays?: number
  onLeadCaptured?: (email: string) => void
}

export function ExitIntentModal({
  enabled = true,
  cookieDays = 30,
  onLeadCaptured,
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [variant, setVariant] = useState<'discount' | 'ebook' | 'consultation'>('discount')

  useEffect(() => {
    if (!enabled) return

    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('exitIntentShown')
    if (hasSeenModal) return

    let exitIntentTriggered = false

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the viewport
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true
        showModal()
      }
    }

    const handleBackButton = () => {
      if (!exitIntentTriggered) {
        exitIntentTriggered = true
        showModal()
      }
    }

    // Inactivity trigger (60 seconds)
    let inactivityTimer: NodeJS.Timeout
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        if (!exitIntentTriggered) {
          exitIntentTriggered = true
          showModal()
        }
      }, 60000) // 60 seconds
    }

    // Scroll depth trigger (75%)
    let scrollTriggered = false
    const handleScroll = () => {
      if (scrollTriggered) return

      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (scrollPercentage >= 0.75 && !exitIntentTriggered) {
        scrollTriggered = true
        setTimeout(() => {
          if (!exitIntentTriggered) {
            exitIntentTriggered = true
            showModal()
          }
        }, 3000) // Wait 3 seconds after reaching 75%
      }
    }

    const showModal = () => {
      // Random variant (A/B testing)
      const variants: Array<'discount' | 'ebook' | 'consultation'> = ['discount', 'ebook', 'consultation']
      const randomVariant = variants[Math.floor(Math.random() * variants.length)]
      setVariant(randomVariant)

      setIsOpen(true)
      localStorage.setItem('exitIntentShown', 'true')

      // Set expiration cookie
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + cookieDays)
      document.cookie = `exitIntentShown=true; expires=${expirationDate.toUTCString()}; path=/`
    }

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('popstate', handleBackButton)
    document.addEventListener('mousemove', resetInactivityTimer)
    document.addEventListener('keydown', resetInactivityTimer)
    window.addEventListener('scroll', handleScroll)
    resetInactivityTimer()

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('popstate', handleBackButton)
      document.removeEventListener('mousemove', resetInactivityTimer)
      document.removeEventListener('keydown', resetInactivityTimer)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(inactivityTimer)
    }
  }, [enabled, cookieDays])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('Por favor introduce un email válido')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'exit_intent',
          variant,
          metadata: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setShowConfetti(true)
      toast.success('¡Gracias! Te enviaremos tu oferta especial por email', {
        duration: 5000,
        icon: '🎉',
      })

      onLeadCaptured?.(email)

      // Close modal after success
      setTimeout(() => {
        setIsOpen(false)
        setShowConfetti(false)
      }, 3000)

    } catch (error) {
      toast.error('Error al enviar. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const getVariantContent = () => {
    switch (variant) {
      case 'discount':
        return {
          icon: <TrendingDown className="w-12 h-12 text-white" />,
          title: '¡Espera! Obtén 15% de Descuento',
          subtitle: 'No te vayas sin tu oferta exclusiva',
          description: 'Introduce tu email y recibe un cupón de 15% de descuento en tu primer seguro.',
          buttonText: 'Quiero mi Descuento',
          gradient: 'from-red-500 to-pink-600',
        }
      case 'ebook':
        return {
          icon: <Gift className="w-12 h-12 text-white" />,
          title: 'Descarga GRATIS la Guía Definitiva',
          subtitle: 'Guía de Seguros 2026 - Totalmente GRATIS',
          description: 'Descubre cómo ahorrar hasta 40% en seguros con nuestra guía exclusiva de 50 páginas.',
          buttonText: 'Descargar Guía Gratis',
          gradient: 'from-purple-500 to-indigo-600',
        }
      case 'consultation':
        return {
          icon: <Sparkles className="w-12 h-12 text-white" />,
          title: 'Consultoría Gratuita Personalizada',
          subtitle: '30 minutos con un experto - Sin compromiso',
          description: 'Analizaremos tu situación y te mostraremos cómo ahorrar en tus seguros.',
          buttonText: 'Reservar mi Consultoría',
          gradient: 'from-emerald-500 to-teal-600',
        }
    }
  }

  const content = getVariantContent()

  if (!enabled) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Header with gradient */}
              <div className={`bg-gradient-to-br ${content.gradient} p-8 text-center`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4"
                >
                  {content.icon}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-white mb-2"
                >
                  {content.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90"
                >
                  {content.subtitle}
                </motion.p>
              </div>

              {/* Content */}
              <div className="p-8">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-gray-600 dark:text-gray-400 mb-6"
                >
                  {content.description}
                </motion.p>

                {/* Form */}
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${content.gradient} hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {content.buttonText}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.form>

                {/* Trust signals */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span>Sin compromiso</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span>Cancela cuando quieras</span>
                    </div>
                  </div>
                </motion.div>

                {/* Urgency timer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    ⏰ Esta oferta expira en 24 horas
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
