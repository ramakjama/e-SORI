'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'bg-slate-200 dark:bg-slate-700'

    const variants = {
      text: 'rounded-md h-4',
      circular: 'rounded-full',
      rectangular: '',
      rounded: 'rounded-xl',
    }

    const animations = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]',
      none: '',
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], animations[animation], className)}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Pre-built skeleton components
export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
)

export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }
  return <Skeleton variant="circular" className={sizes[size]} />
}

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn('p-4 rounded-xl border border-slate-200 dark:border-slate-700', className)}>
    <div className="flex items-center gap-3 mb-4">
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" height={12} />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
)

export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="w-full">
    {/* Header */}
    <div className="flex gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" className="flex-1" height={20} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="flex gap-4 p-4 border-b border-slate-100 dark:border-slate-800"
      >
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="flex-1" />
        ))}
      </div>
    ))}
  </div>
)

export const SkeletonList = ({ items = 5, withAvatar = true }: { items?: number; withAvatar?: boolean }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        {withAvatar && <SkeletonAvatar size="md" />}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" height={12} />
        </div>
      </div>
    ))}
  </div>
)

export const SkeletonStats = ({ items = 4 }: { items?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <Skeleton variant="text" width="60%" height={16} className="mb-2" />
        <Skeleton variant="text" width="80%" height={32} />
      </div>
    ))}
  </div>
)

// Policy Skeleton - for policy cards
export const PolicySkeleton = ({ className }: { className?: string }) => (
  <div className={cn('p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800', className)}>
    {/* Header with icon and status */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="rounded" className="w-12 h-12" />
        <div className="space-y-2">
          <Skeleton variant="text" width={120} height={18} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
      </div>
      <Skeleton variant="rounded" width={70} height={24} />
    </div>
    {/* Policy details */}
    <div className="space-y-3 mb-4">
      <div className="flex justify-between">
        <Skeleton variant="text" width="40%" height={14} />
        <Skeleton variant="text" width="30%" height={14} />
      </div>
      <div className="flex justify-between">
        <Skeleton variant="text" width="35%" height={14} />
        <Skeleton variant="text" width="25%" height={14} />
      </div>
    </div>
    {/* Footer with action */}
    <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
      <Skeleton variant="rounded" width="100%" height={36} />
    </div>
  </div>
)

// Document Skeleton - for document list items
export const DocumentSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700', className)}>
    {/* File icon */}
    <Skeleton variant="rounded" className="w-10 h-10 flex-shrink-0" />
    {/* Document info */}
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton variant="text" width="70%" height={16} />
      <div className="flex items-center gap-2">
        <Skeleton variant="text" width={60} height={12} />
        <Skeleton variant="circular" className="w-1 h-1" />
        <Skeleton variant="text" width={80} height={12} />
      </div>
    </div>
    {/* Action button */}
    <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
  </div>
)

// Message Skeleton - for message/notification items
export const MessageSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700', className)}>
    {/* Avatar */}
    <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
    {/* Message content */}
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={100} height={16} />
        <Skeleton variant="text" width={50} height={12} />
      </div>
      <Skeleton variant="text" width="90%" height={14} />
      <Skeleton variant="text" width="60%" height={14} />
    </div>
    {/* Unread indicator */}
    <Skeleton variant="circular" className="w-2 h-2 flex-shrink-0" />
  </div>
)

// Card Skeleton - improved generic card skeleton
export const CardSkeleton = ({
  className,
  variant = 'default'
}: {
  className?: string
  variant?: 'default' | 'compact' | 'detailed'
}) => {
  if (variant === 'compact') {
    return (
      <div className={cn('p-3 rounded-xl border border-slate-200 dark:border-slate-700', className)}>
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" className="w-10 h-10" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('p-5 rounded-2xl border border-slate-200 dark:border-slate-700', className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" className="w-14 h-14" />
            <div className="space-y-2">
              <Skeleton variant="text" width={140} height={18} />
              <Skeleton variant="text" width={100} height={14} />
            </div>
          </div>
          <Skeleton variant="rounded" width={80} height={28} />
        </div>
        {/* Content */}
        <div className="space-y-3 mb-4">
          <SkeletonText lines={3} />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Skeleton variant="text" width="50%" height={20} className="mx-auto mb-1" />
              <Skeleton variant="text" width="70%" height={12} className="mx-auto" />
            </div>
          ))}
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <Skeleton variant="rounded" className="flex-1 h-10" />
          <Skeleton variant="rounded" className="w-10 h-10" />
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('p-4 rounded-xl border border-slate-200 dark:border-slate-700', className)}>
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

// Receipt/Invoice Skeleton
export const ReceiptSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700', className)}>
    {/* Status indicator */}
    <Skeleton variant="circular" className="w-3 h-3 flex-shrink-0" />
    {/* Receipt info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <Skeleton variant="text" width={120} height={16} />
        <Skeleton variant="text" width={80} height={18} />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="text" width={100} height={12} />
        <Skeleton variant="circular" className="w-1 h-1" />
        <Skeleton variant="text" width={70} height={12} />
      </div>
    </div>
    {/* Action */}
    <Skeleton variant="rounded" width={70} height={32} className="flex-shrink-0" />
  </div>
)

export { Skeleton }
export default Skeleton
