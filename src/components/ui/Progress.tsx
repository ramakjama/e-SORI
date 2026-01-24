'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium' | 'gradient'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
  labelPosition?: 'inside' | 'outside' | 'top'
  animated?: boolean
  striped?: boolean
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      showLabel = false,
      labelPosition = 'outside',
      animated = true,
      striped = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizes = {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    }

    const trackStyles = `
      w-full rounded-full overflow-hidden
      bg-slate-200 dark:bg-slate-700
    `

    const barVariants = {
      default: 'bg-red-500',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-rose-500',
      premium: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500',
      gradient: 'bg-gradient-to-r from-red-500 via-orange-500 to-amber-500',
    }

    const stripedClass = striped
      ? 'bg-[length:1rem_1rem] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1s_linear_infinite]'
      : ''

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Top Label */}
        {showLabel && labelPosition === 'top' && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Progreso
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Track */}
          <div className={cn(trackStyles, sizes[size], 'flex-1')}>
            {animated ? (
              <motion.div
                className={cn(
                  'h-full rounded-full transition-colors',
                  barVariants[variant],
                  stripedClass
                )}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {/* Inside Label */}
                {showLabel && labelPosition === 'inside' && size === 'lg' && (
                  <span className="flex items-center justify-center h-full text-[10px] font-bold text-white">
                    {Math.round(percentage)}%
                  </span>
                )}
              </motion.div>
            ) : (
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  barVariants[variant],
                  stripedClass
                )}
                style={{ width: `${percentage}%` }}
              />
            )}
          </div>

          {/* Outside Label */}
          {showLabel && labelPosition === 'outside' && (
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 min-w-[3rem] text-right">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'

// Circular Progress
interface CircularProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium'
  showLabel?: boolean
  label?: React.ReactNode
  animated?: boolean
  className?: string
}

export const CircularProgress = ({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 4,
  variant = 'default',
  showLabel = true,
  label,
  animated = true,
  className,
}: CircularProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 48,
    md: 64,
    lg: 96,
    xl: 128,
  }

  const fontSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-2xl',
  }

  const svgSize = sizes[size]
  const radius = (svgSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const strokeColors = {
    default: 'stroke-red-500',
    success: 'stroke-emerald-500',
    warning: 'stroke-amber-500',
    danger: 'stroke-rose-500',
    premium: 'stroke-amber-400',
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={svgSize}
        height={svgSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        {/* Progress circle */}
        {animated ? (
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={strokeColors[variant]}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        ) : (
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={strokeColors[variant]}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.3s ease',
            }}
          />
        )}
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label || (
            <span className={cn('font-bold text-slate-700 dark:text-slate-300', fontSizes[size])}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Steps Progress
interface StepsProgressProps {
  steps: string[]
  currentStep: number
  variant?: 'default' | 'success' | 'premium'
  className?: string
}

export const StepsProgress = ({
  steps,
  currentStep,
  variant = 'default',
  className,
}: StepsProgressProps) => {
  const colors = {
    default: {
      active: 'bg-red-500 text-white',
      completed: 'bg-red-500 text-white',
      inactive: 'bg-slate-200 dark:bg-slate-700 text-slate-500',
      line: 'bg-red-500',
      lineInactive: 'bg-slate-200 dark:bg-slate-700',
    },
    success: {
      active: 'bg-emerald-500 text-white',
      completed: 'bg-emerald-500 text-white',
      inactive: 'bg-slate-200 dark:bg-slate-700 text-slate-500',
      line: 'bg-emerald-500',
      lineInactive: 'bg-slate-200 dark:bg-slate-700',
    },
    premium: {
      active: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
      completed: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
      inactive: 'bg-slate-200 dark:bg-slate-700 text-slate-500',
      line: 'bg-gradient-to-r from-amber-400 to-yellow-500',
      lineInactive: 'bg-slate-200 dark:bg-slate-700',
    },
  }

  const styles = colors[variant]

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10',
                    isCompleted && styles.completed,
                    isActive && styles.active,
                    !isCompleted && !isActive && styles.inactive
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <span
                  className={cn(
                    'absolute -bottom-6 text-xs font-medium whitespace-nowrap',
                    isActive || isCompleted
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-2">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      isCompleted ? styles.line : styles.lineInactive
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Progress }
export default Progress
