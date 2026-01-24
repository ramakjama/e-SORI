'use client'

import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { HiEye, HiEyeOff, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'underlined'
  inputSize?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      fullWidth = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const baseStyles = `
      w-full transition-all duration-200 outline-none
      placeholder:text-slate-400 dark:placeholder:text-slate-500
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const variants = {
      default: `
        bg-white dark:bg-slate-900
        border-2 border-slate-200 dark:border-slate-700
        rounded-xl
        focus:border-red-500 focus:ring-2 focus:ring-red-500/20
        ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}
        ${success ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20' : ''}
      `,
      filled: `
        bg-slate-100 dark:bg-slate-800
        border-2 border-transparent
        rounded-xl
        focus:bg-white dark:focus:bg-slate-900
        focus:border-red-500 focus:ring-2 focus:ring-red-500/20
        ${error ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500' : ''}
        ${success ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500' : ''}
      `,
      underlined: `
        bg-transparent
        border-0 border-b-2 border-slate-200 dark:border-slate-700
        rounded-none
        focus:border-red-500
        ${error ? 'border-rose-500' : ''}
        ${success ? 'border-emerald-500' : ''}
      `,
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    }

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <span className={iconSizes[inputSize]}>{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            className={cn(
              baseStyles,
              variants[variant],
              sizes[inputSize],
              leftIcon && 'pl-10',
              (rightIcon || isPassword || error || success) && 'pr-10',
              'text-slate-900 dark:text-white',
              className
            )}
            {...props}
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <HiEyeOff className={iconSizes[inputSize]} />
                ) : (
                  <HiEye className={iconSizes[inputSize]} />
                )}
              </button>
            )}

            {error && !isPassword && (
              <HiExclamationCircle className={cn(iconSizes[inputSize], 'text-rose-500')} />
            )}

            {success && !isPassword && !error && (
              <HiCheckCircle className={cn(iconSizes[inputSize], 'text-emerald-500')} />
            )}

            {rightIcon && !error && !success && !isPassword && (
              <span className={cn(iconSizes[inputSize], 'text-slate-400')}>
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {/* Helper text */}
        {(error || success || hint) && (
          <p
            className={cn(
              'mt-2 text-sm',
              error && 'text-rose-500',
              success && !error && 'text-emerald-500',
              !error && !success && 'text-slate-500 dark:text-slate-400'
            )}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export default Input
