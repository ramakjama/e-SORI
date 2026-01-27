'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info'
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string, options?: Partial<Toast>) => void
  error: (title: string, message?: string, options?: Partial<Toast>) => void
  warning: (title: string, message?: string, options?: Partial<Toast>) => void
  info: (title: string, message?: string, options?: Partial<Toast>) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
  position?: ToastPosition
  maxToasts?: number
}

export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id, dismissible: toast.dismissible ?? true }

    setToasts((prev) => {
      const updated = [...prev, newToast]
      // Limit number of toasts shown
      if (updated.length > maxToasts) {
        return updated.slice(-maxToasts)
      }
      return updated
    })

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [maxToasts, removeToast])

  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'success', title, message, ...options })
  }, [addToast])

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'error', title, message, duration: 7000, ...options })
  }, [addToast])

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'warning', title, message, ...options })
  }, [addToast])

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'info', title, message, ...options })
  }, [addToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const positionStyles: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  // Calculate animation direction based on position
  const getAnimationDirection = () => {
    if (position.includes('right')) return { x: 100 }
    if (position.includes('left')) return { x: -100 }
    if (position.includes('top')) return { y: -50 }
    return { y: 50 }
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info, clearAll }}>
      {children}

      {/* Toast Container */}
      <div
        className={cn('fixed z-[100] flex flex-col gap-3 pointer-events-none', positionStyles[position])}
        role="region"
        aria-label="Notificaciones"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
              animationDirection={getAnimationDirection()}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Individual Toast Item
interface ToastItemProps {
  toast: Toast
  onClose: () => void
  animationDirection: { x?: number; y?: number }
  position: ToastPosition
}

const ToastItem = ({ toast, onClose, animationDirection, position }: ToastItemProps) => {
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(100)

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const styles = {
    success: {
      border: 'border-emerald-200 dark:border-emerald-800',
      bg: 'bg-emerald-50/95 dark:bg-emerald-950/95',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      progress: 'bg-emerald-500'
    },
    error: {
      border: 'border-rose-200 dark:border-rose-800',
      bg: 'bg-rose-50/95 dark:bg-rose-950/95',
      iconBg: 'bg-rose-100 dark:bg-rose-900/50',
      progress: 'bg-rose-500'
    },
    warning: {
      border: 'border-amber-200 dark:border-amber-800',
      bg: 'bg-amber-50/95 dark:bg-amber-950/95',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
      progress: 'bg-amber-500'
    },
    info: {
      border: 'border-blue-200 dark:border-blue-800',
      bg: 'bg-blue-50/95 dark:bg-blue-950/95',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      progress: 'bg-blue-500'
    }
  }

  const style = styles[toast.type]
  const duration = toast.duration ?? 5000

  // Progress bar animation with pause on hover
  useEffect(() => {
    if (duration <= 0) return

    let startTime: number | null = null
    let remaining = (progress / 100) * duration
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp

      if (!isPaused) {
        const elapsed = timestamp - startTime
        remaining = Math.max(0, ((progress / 100) * duration) - elapsed)
        const newProgress = (remaining / duration) * 100
        setProgress(newProgress)
      } else {
        startTime = timestamp
      }

      if (remaining > 0) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isPaused, duration, progress])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, ...animationDirection, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, ...animationDirection, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'w-80 sm:w-96 rounded-xl shadow-xl border overflow-hidden pointer-events-auto',
        'backdrop-blur-lg',
        style.border,
        style.bg
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon with background */}
        <div className={cn('flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', style.iconBg)}>
          {icons[toast.type]}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {toast.message}
            </p>
          )}
          {/* Action button */}
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick()
                onClose()
              }}
              className="mt-2 text-sm font-semibold text-occident hover:text-occident-600 transition-colors"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        {toast.dismissible !== false && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Cerrar notificacion"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-slate-200/50 dark:bg-slate-700/50">
          <div
            className={cn('h-full transition-all duration-100 ease-linear', style.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}

// Standalone Alert component
interface AlertProps {
  type: ToastType
  title: string
  message?: string
  onClose?: () => void
  className?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const Alert = ({ type, title, message, onClose, className, action }: AlertProps) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
    error: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
  }

  return (
    <div className={cn('rounded-xl border p-4', styles[type], className)} role="alert">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h4>
          {message && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {message}
            </p>
          )}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-sm font-semibold text-occident hover:text-occident-600 dark:text-occident-400 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Cerrar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Convenience function for creating toasts outside of React components
// Usage: toast.success('Title', 'Message')
export const createToastHelpers = () => {
  let toastRef: ToastContextType | null = null

  return {
    setRef: (ref: ToastContextType) => {
      toastRef = ref
    },
    success: (title: string, message?: string) => toastRef?.success(title, message),
    error: (title: string, message?: string) => toastRef?.error(title, message),
    warning: (title: string, message?: string) => toastRef?.warning(title, message),
    info: (title: string, message?: string) => toastRef?.info(title, message),
  }
}

export default ToastProvider
