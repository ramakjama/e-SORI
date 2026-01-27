'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {/* Icon Container */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 12 }}
        className="relative mb-6"
      >
        {/* Background glow */}
        <div className="absolute inset-0 scale-150 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl" />

        {/* Icon wrapper */}
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-app-surface to-app-elevated border border-app-border flex items-center justify-center shadow-card">
          <Icon className="w-12 h-12 text-t-muted" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-t-strong mb-3"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-t-muted max-w-md mb-8 leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onAction}
          className="px-6 py-3 rounded-xl text-sm font-medium bg-primary hover:bg-primary-hover text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export default EmptyState
