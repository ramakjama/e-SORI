'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HiCheckCircle, HiXCircle, HiExclamation, HiInformationCircle, HiX } from 'react-icons/hi'

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
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
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export const ToastProvider = ({ children, position = 'top-right' }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}

      {/* Toast Container */}
      <div className={cn('fixed z-[100] flex flex-col gap-3', positionStyles[position])}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
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
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const icons = {
    success: <HiCheckCircle className="w-6 h-6 text-emerald-500" />,
    error: <HiXCircle className="w-6 h-6 text-rose-500" />,
    warning: <HiExclamation className="w-6 h-6 text-amber-500" />,
    info: <HiInformationCircle className="w-6 h-6 text-blue-500" />,
  }

  const borderColors = {
    success: 'border-l-emerald-500',
    error: 'border-l-rose-500',
    warning: 'border-l-amber-500',
    info: 'border-l-blue-500',
  }

  const bgColors = {
    success: 'bg-emerald-50 dark:bg-emerald-950/30',
    error: 'bg-rose-50 dark:bg-rose-950/30',
    warning: 'bg-amber-50 dark:bg-amber-950/30',
    info: 'bg-blue-50 dark:bg-blue-950/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'w-80 sm:w-96 rounded-xl shadow-xl border-l-4 overflow-hidden',
        'bg-white dark:bg-slate-900',
        borderColors[toast.type],
        bgColors[toast.type]
      )}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type]}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
          aria-label="Cerrar notificacion"
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration ?? 5000) / 1000, ease: 'linear' }}
        className={cn(
          'h-1',
          toast.type === 'success' && 'bg-emerald-500',
          toast.type === 'error' && 'bg-rose-500',
          toast.type === 'warning' && 'bg-amber-500',
          toast.type === 'info' && 'bg-blue-500'
        )}
      />
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
    success: <HiCheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <HiXCircle className="w-5 h-5 text-rose-500" />,
    warning: <HiExclamation className="w-5 h-5 text-amber-500" />,
    info: <HiInformationCircle className="w-5 h-5 text-blue-500" />,
  }

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
    error: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
  }

  return (
    <div className={cn('rounded-xl border p-4', bgColors[type], className)}>
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
              className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              {action.label}
            </button>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Cerrar alerta"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ToastProvider
