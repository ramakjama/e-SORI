'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  variant = 'danger'
}: ConfirmDialogProps) {
  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-state-dangerBg',
      iconColor: 'text-state-danger',
      buttonBg: 'bg-state-danger hover:bg-state-danger/90',
      buttonText: 'text-white'
    },
    warning: {
      icon: AlertCircle,
      iconBg: 'bg-state-warningBg',
      iconColor: 'text-state-warning',
      buttonBg: 'bg-state-warning hover:bg-state-warning/90',
      buttonText: 'text-white'
    },
    info: {
      icon: Info,
      iconBg: 'bg-state-infoBg',
      iconColor: 'text-state-info',
      buttonBg: 'bg-primary hover:bg-primary-hover',
      buttonText: 'text-white'
    }
  }

  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onCancel}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md rounded-2xl bg-app-elevated border border-app-border shadow-elevated overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4 relative">
                <button
                  type="button"
                  onClick={onCancel}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-t-muted hover:text-t-strong hover:bg-app-surface transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4 pr-8">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${config.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-lg font-semibold text-t-strong mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-t-muted leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-t-strong bg-app-surface hover:bg-app-surfaceHover border border-app-border transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${config.buttonBg} ${config.buttonText}`}
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog
