'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'premium' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
  icon?: React.ReactNode
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'sm',
      dot = false,
      pulse = false,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center gap-1.5 font-semibold
      rounded-full transition-all duration-200
    `

    const variants = {
      default: `
        bg-slate-100 text-slate-700
        dark:bg-slate-800 dark:text-slate-300
      `,
      primary: `
        bg-red-100 text-red-700
        dark:bg-red-950 dark:text-red-400
      `,
      secondary: `
        bg-slate-200 text-slate-800
        dark:bg-slate-700 dark:text-slate-200
      `,
      success: `
        bg-emerald-100 text-emerald-700
        dark:bg-emerald-950 dark:text-emerald-400
      `,
      warning: `
        bg-amber-100 text-amber-700
        dark:bg-amber-950 dark:text-amber-400
      `,
      danger: `
        bg-rose-100 text-rose-700
        dark:bg-rose-950 dark:text-rose-400
      `,
      info: `
        bg-blue-100 text-blue-700
        dark:bg-blue-950 dark:text-blue-400
      `,
      premium: `
        bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-900
        dark:from-amber-800 dark:to-yellow-800 dark:text-amber-100
        shadow-sm shadow-amber-200/50 dark:shadow-amber-800/50
      `,
      outline: `
        bg-transparent border-2 border-current
        text-slate-600 dark:text-slate-400
      `,
    }

    const sizes = {
      xs: 'px-1.5 py-0.5 text-[10px]',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }

    const dotColors = {
      default: 'bg-slate-500',
      primary: 'bg-red-500',
      secondary: 'bg-slate-600',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-rose-500',
      info: 'bg-blue-500',
      premium: 'bg-amber-500',
      outline: 'bg-current',
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {dot && (
          <span className="relative flex h-2 w-2">
            {pulse && (
              <span
                className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                  dotColors[variant]
                )}
              />
            )}
            <span
              className={cn(
                'relative inline-flex rounded-full h-2 w-2',
                dotColors[variant]
              )}
            />
          </span>
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Status Badge with predefined states
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success'
  className?: string
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Activo', dot: true, pulse: true },
    inactive: { variant: 'default' as const, label: 'Inactivo', dot: true, pulse: false },
    pending: { variant: 'warning' as const, label: 'Pendiente', dot: true, pulse: true },
    error: { variant: 'danger' as const, label: 'Error', dot: true, pulse: true },
    success: { variant: 'success' as const, label: 'Completado', dot: false, pulse: false },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      pulse={config.pulse}
      className={className}
    >
      {config.label}
    </Badge>
  )
}

// Level Badge for Soriano Club
interface LevelBadgeProps {
  level: 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO'
  showIcon?: boolean
  className?: string
}

export const LevelBadge = ({ level, showIcon = true, className }: LevelBadgeProps) => {
  const levelConfig = {
    BRONCE: {
      gradient: 'from-amber-600 to-amber-800',
      text: 'text-amber-100',
      icon: '🥉',
    },
    PLATA: {
      gradient: 'from-slate-400 to-slate-600',
      text: 'text-white',
      icon: '🥈',
    },
    ORO: {
      gradient: 'from-yellow-400 to-amber-500',
      text: 'text-yellow-900',
      icon: '🥇',
    },
    PLATINO: {
      gradient: 'from-slate-200 via-white to-slate-300',
      text: 'text-slate-800',
      icon: '💎',
    },
  }

  const config = levelConfig[level]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm',
        `bg-gradient-to-r ${config.gradient} ${config.text}`,
        'shadow-lg',
        className
      )}
    >
      {showIcon && <span>{config.icon}</span>}
      {level}
    </span>
  )
}

export { Badge }
export default Badge
