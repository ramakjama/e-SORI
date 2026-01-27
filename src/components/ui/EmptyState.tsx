'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  variant?: 'default' | 'minimal' | 'card'
  iconColor?: string
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  variant = 'default',
  iconColor = 'text-slate-400 dark:text-slate-500'
}: EmptyStateProps) => {
  const containerVariants = {
    default: 'py-12 px-6',
    minimal: 'py-8 px-4',
    card: 'py-10 px-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        containerVariants[variant],
        className
      )}
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 15 }}
        className="relative mb-6"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 scale-150 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-full opacity-50" />

        {/* Icon wrapper */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shadow-sm">
          <Icon className={cn('w-10 h-10', iconColor)} strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm max-w-sm mb-6"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </motion.p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {action && (
            <Button
              onClick={action.onClick}
              variant="primary"
              size="md"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="md"
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// Preset empty states for common scenarios
export const NoPoliciesState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').FileText}
    title="No tienes polizas"
    description="Aun no tienes polizas registradas. Contacta con nosotros para contratar tu primer seguro."
    action={onAction ? { label: 'Contactar', onClick: onAction } : undefined}
    iconColor="text-occident"
  />
)

export const NoDocumentsState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').FolderOpen}
    title="Sin documentos"
    description="No hay documentos disponibles en esta seccion. Los documentos de tus polizas apareceran aqui."
    action={onAction ? { label: 'Ver polizas', onClick: onAction } : undefined}
    iconColor="text-blue-500"
  />
)

export const NoMessagesState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').MessageSquare}
    title="Sin mensajes"
    description="No tienes mensajes nuevos. Aqui apareceran las notificaciones y comunicaciones de tu mediador."
    action={onAction ? { label: 'Contactar mediador', onClick: onAction } : undefined}
    iconColor="text-emerald-500"
  />
)

export const NoSearchResultsState = ({ query, onClear }: { query?: string; onClear?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').Search}
    title="Sin resultados"
    description={query ? `No encontramos resultados para "${query}". Intenta con otros terminos de busqueda.` : 'No se encontraron resultados para tu busqueda.'}
    action={onClear ? { label: 'Limpiar busqueda', onClick: onClear } : undefined}
    iconColor="text-amber-500"
  />
)

export const NoSiniestrosState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').AlertTriangle}
    title="Sin siniestros"
    description="No tienes siniestros registrados. Esperamos que sigas sin necesitarlos."
    action={onAction ? { label: 'Reportar siniestro', onClick: onAction } : undefined}
    iconColor="text-rose-500"
  />
)

export const NoReceiptsState = ({ onAction }: { onAction?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').Receipt}
    title="Sin recibos pendientes"
    description="No tienes recibos pendientes de pago. Todos tus pagos estan al dia."
    iconColor="text-emerald-500"
  />
)

export const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').AlertCircle}
    title="Algo salio mal"
    description="Hubo un error al cargar los datos. Por favor, intentalo de nuevo."
    action={onRetry ? { label: 'Reintentar', onClick: onRetry } : undefined}
    iconColor="text-rose-500"
    variant="card"
  />
)

export const OfflineState = ({ onRetry }: { onRetry?: () => void }) => (
  <EmptyState
    icon={require('lucide-react').WifiOff}
    title="Sin conexion"
    description="Parece que no tienes conexion a internet. Verifica tu conexion e intentalo de nuevo."
    action={onRetry ? { label: 'Reintentar', onClick: onRetry } : undefined}
    iconColor="text-slate-500"
    variant="card"
  />
)

export default EmptyState
