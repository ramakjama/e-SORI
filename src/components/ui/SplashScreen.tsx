'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Sparkles } from 'lucide-react'

interface SplashScreenProps {
  onComplete?: () => void
  minimumDuration?: number
}

export function SplashScreen({ onComplete, minimumDuration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / minimumDuration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsVisible(false)
          onComplete?.()
        }, 300)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [minimumDuration, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  y: [null, Math.random() * -200],
                  scale: [0, 1, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-2 h-2 bg-occident/30 rounded-full"
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              className="relative mb-8"
            >
              {/* Glow effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(227, 6, 19, 0.3)',
                    '0 0 60px rgba(227, 6, 19, 0.5)',
                    '0 0 20px rgba(227, 6, 19, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl"
              />

              {/* Logo container */}
              <div className="w-28 h-28 bg-gradient-to-br from-occident to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white font-bold text-5xl"
                >
                  S
                </motion.span>
              </div>

              {/* Orbiting element */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                e-SORI
              </h1>
              <p className="text-slate-400 text-sm">
                Soriano Mediadores de Seguros
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="w-[200px] h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-occident to-red-500 rounded-full"
                  style={{ transition: 'width 0.1s linear' }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-slate-500 text-xs mt-3"
              >
                Cargando experiencia premium...
              </motion.p>
            </motion.div>

            {/* Security badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex items-center gap-2 text-slate-500 text-xs"
            >
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Conexión segura SSL</span>
            </motion.div>
          </div>

          {/* Bottom branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 text-slate-600 text-xs"
          >
            © 2024 Soriano Mediadores S.L.
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
