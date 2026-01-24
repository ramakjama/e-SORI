'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'gradient' | 'premium' | 'outlined'
  hover?: 'none' | 'lift' | 'glow' | 'scale' | 'border'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = 'none',
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-2xl transition-all duration-300 relative overflow-hidden
    `

    const variants = {
      default: `
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        shadow-sm
      `,
      glass: `
        bg-white/70 dark:bg-slate-900/70
        backdrop-blur-xl backdrop-saturate-150
        border border-white/20 dark:border-slate-700/50
        shadow-xl shadow-black/5
      `,
      elevated: `
        bg-white dark:bg-slate-900
        shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50
        border border-slate-100 dark:border-slate-800
      `,
      gradient: `
        bg-gradient-to-br from-white to-slate-50
        dark:from-slate-900 dark:to-slate-800
        border border-slate-200/50 dark:border-slate-700/50
        shadow-lg
      `,
      premium: `
        bg-gradient-to-br from-amber-50 via-white to-amber-50
        dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/30
        border-2 border-amber-200 dark:border-amber-800/50
        shadow-xl shadow-amber-200/30 dark:shadow-amber-900/30
      `,
      outlined: `
        bg-transparent
        border-2 border-slate-200 dark:border-slate-700
      `,
    }

    const hoverEffects = {
      none: '',
      lift: 'hover:-translate-y-1 hover:shadow-xl',
      glow: 'hover:shadow-xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20',
      scale: 'hover:scale-[1.02]',
      border: 'hover:border-red-500 dark:hover:border-red-500',
    }

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
      xl: 'p-10',
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          hoverEffects[hover],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

// Card Title
const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-xl font-bold leading-none tracking-tight text-slate-900 dark:text-white',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

// Card Description
const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-slate-600 dark:text-slate-400', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

// Card Content
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

// Card Footer
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 border-t border-slate-100 dark:border-slate-800', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

// Animated Card with Framer Motion
export const MotionCard = forwardRef<HTMLDivElement, CardProps & HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...(props as HTMLMotionProps<'div'>)}
      >
        <Card {...(props as CardProps)}>{children}</Card>
      </motion.div>
    )
  }
)
MotionCard.displayName = 'MotionCard'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
