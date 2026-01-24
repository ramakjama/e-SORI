'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'premium'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  pulse?: boolean
  glow?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      pulse = false,
      glow = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-semibold rounded-xl transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98] transform
    `

    const variants = {
      primary: `
        bg-gradient-to-r from-red-600 to-red-700
        hover:from-red-700 hover:to-red-800
        text-white shadow-lg shadow-red-500/25
        focus:ring-red-500
        dark:from-red-500 dark:to-red-600
        dark:hover:from-red-600 dark:hover:to-red-700
      `,
      secondary: `
        bg-gradient-to-r from-slate-100 to-slate-200
        hover:from-slate-200 hover:to-slate-300
        text-slate-800 shadow-lg shadow-slate-300/25
        focus:ring-slate-400
        dark:from-slate-700 dark:to-slate-800
        dark:hover:from-slate-600 dark:hover:to-slate-700
        dark:text-white
      `,
      outline: `
        border-2 border-red-600 text-red-600
        hover:bg-red-600 hover:text-white
        focus:ring-red-500
        dark:border-red-500 dark:text-red-500
        dark:hover:bg-red-500 dark:hover:text-white
      `,
      ghost: `
        text-slate-600 hover:bg-slate-100
        focus:ring-slate-400
        dark:text-slate-300 dark:hover:bg-slate-800
      `,
      danger: `
        bg-gradient-to-r from-rose-600 to-rose-700
        hover:from-rose-700 hover:to-rose-800
        text-white shadow-lg shadow-rose-500/25
        focus:ring-rose-500
      `,
      success: `
        bg-gradient-to-r from-emerald-600 to-emerald-700
        hover:from-emerald-700 hover:to-emerald-800
        text-white shadow-lg shadow-emerald-500/25
        focus:ring-emerald-500
      `,
      premium: `
        bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600
        hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700
        text-black font-bold shadow-lg shadow-amber-500/40
        focus:ring-amber-500
        border border-amber-400/50
      `,
    }

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          pulse && 'animate-pulse',
          glow && 'after:absolute after:inset-0 after:rounded-xl after:animate-ping after:bg-current after:opacity-20',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Animated version with Framer Motion
export const MotionButton = forwardRef<HTMLButtonElement, ButtonProps & HTMLMotionProps<'button'>>(
  ({ children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {children}
      </motion.button>
    )
  }
)

MotionButton.displayName = 'MotionButton'

export { Button }
export default Button
