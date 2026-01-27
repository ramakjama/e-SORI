'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  MessageSquare,
  AlertCircle,
  FolderOpen,
  CreditCard,
  Bell,
  Shield,
  Search,
  Inbox,
  Package,
  Users,
  TrendingUp,
  LucideIcon,
} from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
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
}

/**
 * Generic empty state component
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center"
      >
        <Icon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </motion.div>

      {/* Title */}
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-sm max-w-md mb-6"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="btn-primary"
            >
              {action.label}
            </motion.button>
          )}
          {secondaryAction && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={secondaryAction.onClick}
              className="btn-secondary"
            >
              {secondaryAction.label}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ============================================
// PREDEFINED EMPTY STATES
// ============================================

export function NoPoliciesEmptyState({ onCreatePolicy }: { onCreatePolicy?: () => void }) {
  return (
    <EmptyState
      icon={Shield}
      title="No tienes pólizas activas"
      description="Comienza a proteger lo que más te importa. Explora nuestros seguros y encuentra la cobertura perfecta para ti."
      action={
        onCreatePolicy
          ? {
              label: 'Explorar seguros',
              onClick: onCreatePolicy,
            }
          : undefined
      }
      secondaryAction={{
        label: 'Contactar agente',
        onClick: () => (window.location.href = 'tel:+34966810290'),
      }}
    />
  )
}

export function NoClaimsEmptyState({ onCreateClaim }: { onCreateClaim?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="No tienes siniestros registrados"
      description="¡Eso es una buena noticia! Si necesitas comunicar un siniestro, puedes hacerlo fácilmente desde aquí."
      action={
        onCreateClaim
          ? {
              label: 'Comunicar siniestro',
              onClick: onCreateClaim,
            }
          : undefined
      }
      secondaryAction={{
        label: 'Llamar al 966 810 290',
        onClick: () => (window.location.href = 'tel:+34966810290'),
      }}
    />
  )
}

export function NoDocumentsEmptyState({ onUploadDocument }: { onUploadDocument?: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No hay documentos"
      description="Sube tus documentos importantes para tenerlos siempre a mano. Contratos, facturas, certificados y más."
      action={
        onUploadDocument
          ? {
              label: 'Subir documento',
              onClick: onUploadDocument,
            }
          : undefined
      }
    />
  )
}

export function NoMessagesEmptyState() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No tienes mensajes"
      description="Cuando recibas comunicaciones de tu agente o de la aseguradora, aparecerán aquí."
      secondaryAction={{
        label: 'Contactar agente',
        onClick: () => (window.location.href = 'tel:+34966810290'),
      }}
    />
  )
}

export function NoPaymentsEmptyState() {
  return (
    <EmptyState
      icon={CreditCard}
      title="No hay pagos pendientes"
      description="Todos tus pagos están al día. Aquí verás el historial de tus recibos y próximos vencimientos."
    />
  )
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      icon={Bell}
      title="No tienes notificaciones"
      description="Cuando haya novedades importantes, te avisaremos aquí."
    />
  )
}

export function NoSearchResultsEmptyState({ 
  query, 
  onClearSearch 
}: { 
  query: string
  onClearSearch?: () => void 
}) {
  return (
    <EmptyState
      icon={Search}
      title="No se encontraron resultados"
      description={`No encontramos nada que coincida con "${query}". Intenta con otros términos de búsqueda.`}
      action={
        onClearSearch
          ? {
              label: 'Limpiar búsqueda',
              onClick: onClearSearch,
            }
          : undefined
      }
    />
  )
}

export function NoReferralsEmptyState({ onShare }: { onShare?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Aún no has referido a nadie"
      description="Comparte tu código de referido con amigos y familiares. Ambos recibiréis puntos extra cuando contraten un seguro."
      action={
        onShare
          ? {
              label: 'Compartir código',
              onClick: onShare,
            }
          : undefined
      }
    />
  )
}

export function NoRewardsEmptyState() {
  return (
    <EmptyState
      icon={Package}
      title="No hay recompensas disponibles"
      description="Sigue acumulando puntos para desbloquear increíbles recompensas en el marketplace."
      secondaryAction={{
        label: 'Ver cómo ganar puntos',
        onClick: () => (window.location.href = '/soriano-club'),
      }}
    />
  )
}

export function NoActivityEmptyState() {
  return (
    <EmptyState
      icon={TrendingUp}
      title="Sin actividad reciente"
      description="Aquí verás un resumen de tu actividad: nuevas pólizas, pagos, siniestros y más."
    />
  )
}

export function ErrorEmptyState({ 
  onRetry,
  message = "Ha ocurrido un error al cargar los datos"
}: { 
  onRetry?: () => void
  message?: string
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Algo salió mal"
      description={message}
      action={
        onRetry
          ? {
              label: 'Reintentar',
              onClick: onRetry,
            }
          : undefined
      }
      secondaryAction={{
        label: 'Contactar soporte',
        onClick: () => (window.location.href = 'tel:+34966810290'),
      }}
    />
  )
}

// ============================================
// EXPORT ALL
// ============================================

export const EmptyStates = {
  Generic: EmptyState,
  NoPolicies: NoPoliciesEmptyState,
  NoClaims: NoClaimsEmptyState,
  NoDocuments: NoDocumentsEmptyState,
  NoMessages: NoMessagesEmptyState,
  NoPayments: NoPaymentsEmptyState,
  NoNotifications: NoNotificationsEmptyState,
  NoSearchResults: NoSearchResultsEmptyState,
  NoReferrals: NoReferralsEmptyState,
  NoRewards: NoRewardsEmptyState,
  NoActivity: NoActivityEmptyState,
  Error: ErrorEmptyState,
}
