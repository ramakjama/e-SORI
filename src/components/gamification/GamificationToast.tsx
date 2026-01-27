'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Coins, Trophy, Award, Flame, Target, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------- Types ----------

export type GamificationToastType = 'xp' | 'coins' | 'level_up' | 'badge' | 'streak' | 'mission'

export interface GamificationToastProps {
  type: GamificationToastType
  title: string
  description?: string
  value?: number | string
  onClose: () => void
  autoClose?: number // ms, default 4000
}

// ---------- Config ----------

const toastConfig: Record<
  GamificationToastType,
  { gradient: string; icon: React.ElementType; iconColor: string }
> = {
  xp: {
    gradient: 'from-purple-500 to-violet-600',
    icon: Zap,
    iconColor: 'text-purple-100',
  },
  coins: {
    gradient: 'from-amber-400 to-orange-500',
    icon: Coins,
    iconColor: 'text-amber-100',
  },
  level_up: {
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    icon: Trophy,
    iconColor: 'text-yellow-200',
  },
  badge: {
    gradient: 'from-emerald-500 to-green-600',
    icon: Award,
    iconColor: 'text-emerald-100',
  },
  streak: {
    gradient: 'from-orange-500 to-red-500',
    icon: Flame,
    iconColor: 'text-orange-100',
  },
  mission: {
    gradient: 'from-blue-500 to-cyan-500',
    icon: Target,
    iconColor: 'text-blue-100',
  },
}

// ---------- Single Toast ----------

export function GamificationToast({
  type,
  title,
  description,
  value,
  onClose,
  autoClose = 4000,
}: GamificationToastProps) {
  const config = toastConfig[type]
  const Icon = config.icon
  const [progress, setProgress] = useState(100)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    startRef.current = Date.now()

    const tick = () => {
      if (!startRef.current) return
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, 100 - (elapsed / autoClose) * 100)
      setProgress(remaining)
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        onClose()
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [autoClose, onClose])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.85 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className={cn(
        'relative w-80 overflow-hidden rounded-2xl shadow-2xl pointer-events-auto',
        'bg-gradient-to-r',
        config.gradient
      )}
    >
      {/* Level-up sparkle overlay */}
      {type === 'level_up' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            />
          ))}
        </motion.div>
      )}

      <div className="relative z-10 flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          {type === 'streak' ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Icon className={cn('w-5 h-5', config.iconColor)} />
            </motion.div>
          ) : (
            <Icon className={cn('w-5 h-5', config.iconColor)} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-white truncate">{title}</p>
            {value !== undefined && (
              <span className="flex-shrink-0 px-2 py-0.5 bg-white/25 rounded-full text-xs font-bold text-white">
                {typeof value === 'number' ? `+${value}` : value}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-white/80 mt-0.5 line-clamp-2">{description}</p>
          )}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Cerrar notificacion"
        >
          <X className="w-4 h-4 text-white/80" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-black/20">
        <motion.div
          className="h-full bg-white/50"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0 }}
        />
      </div>
    </motion.div>
  )
}

// ---------- Toast Queue Hook ----------

interface ToastItem extends Omit<GamificationToastProps, 'onClose'> {
  id: string
}

export function useGamificationToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (props: Omit<GamificationToastProps, 'onClose'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => {
        const next = [...prev, { ...props, id }]
        // Max 3 visible at a time — drop oldest
        return next.length > 3 ? next.slice(next.length - 3) : next
      })
    },
    []
  )

  return { toasts, showToast, dismissToast }
}

// ---------- Container ----------

export function GamificationToastContainer({
  toasts,
  dismissToast,
}: {
  toasts: ToastItem[]
  dismissToast: (id: string) => void
}) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <GamificationToast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            description={toast.description}
            value={toast.value}
            autoClose={toast.autoClose}
            onClose={() => dismissToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
