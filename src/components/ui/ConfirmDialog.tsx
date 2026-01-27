'use client'

import { Fragment, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
      iconColor: 'text-rose-600 dark:text-rose-400',
      confirmBg: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
      confirmText: 'text-white'
    },
    warning: {
      icon: AlertCircle,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      confirmBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      confirmText: 'text-white'
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      confirmText: 'text-white'
    }
  }

  const config = variantConfig[variant]
  const Icon = config.icon

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={!isLoading ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-description"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                aria-label="Cerrar dialogo"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center', config.iconBg)}>
                    <Icon className={cn('w-6 h-6', config.iconColor)} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3
                      id="confirm-dialog-title"
                      className="text-lg font-semibold text-slate-900 dark:text-white"
                    >
                      {title}
                    </h3>
                    <p
                      id="confirm-dialog-description"
                      className="mt-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      {description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <Button
                    ref={cancelButtonRef}
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={cn(
                      'w-full sm:w-auto',
                      config.confirmBg,
                      config.confirmText
                    )}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      confirmText
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}

// Pre-configured dialog variants for common use cases
export const LogoutConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Cerrar sesion"
    description="Estas a punto de cerrar tu sesion. Tendras que volver a iniciar sesion para acceder a tu cuenta."
    confirmText="Si, cerrar sesion"
    cancelText="Cancelar"
    variant="warning"
    isLoading={isLoading}
  />
)

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'este elemento',
  isLoading
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName?: string
  isLoading?: boolean
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Eliminar elemento"
    description={`Estas seguro de que deseas eliminar ${itemName}? Esta accion no se puede deshacer.`}
    confirmText="Si, eliminar"
    cancelText="Cancelar"
    variant="danger"
    isLoading={isLoading}
  />
)

export const CancelConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  actionName = 'esta accion',
  isLoading
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  actionName?: string
  isLoading?: boolean
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Cancelar operacion"
    description={`Estas seguro de que deseas cancelar ${actionName}? Los cambios no guardados se perderan.`}
    confirmText="Si, cancelar"
    cancelText="Continuar"
    variant="warning"
    isLoading={isLoading}
  />
)

export default ConfirmDialog
