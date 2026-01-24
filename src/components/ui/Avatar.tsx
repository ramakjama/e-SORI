'use client'

import { forwardRef, HTMLAttributes, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'circle' | 'rounded' | 'square'
  status?: 'online' | 'offline' | 'busy' | 'away'
  badge?: React.ReactNode
  bordered?: boolean
  borderColor?: 'default' | 'primary' | 'success' | 'warning' | 'premium'
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      name,
      size = 'md',
      variant = 'circle',
      status,
      badge,
      bordered = false,
      borderColor = 'default',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false)

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const sizes = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-24 h-24 text-2xl',
    }

    const imageSizes = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
      '2xl': 96,
    }

    const variants = {
      circle: 'rounded-full',
      rounded: 'rounded-xl',
      square: 'rounded-none',
    }

    const statusColors = {
      online: 'bg-emerald-500',
      offline: 'bg-slate-400',
      busy: 'bg-rose-500',
      away: 'bg-amber-500',
    }

    const statusPositions = {
      xs: '-bottom-0.5 -right-0.5 w-2 h-2',
      sm: '-bottom-0.5 -right-0.5 w-2.5 h-2.5',
      md: '-bottom-0.5 -right-0.5 w-3 h-3',
      lg: '-bottom-1 -right-1 w-3.5 h-3.5',
      xl: '-bottom-1 -right-1 w-4 h-4',
      '2xl': '-bottom-1.5 -right-1.5 w-5 h-5',
    }

    const borderColors = {
      default: 'ring-2 ring-white dark:ring-slate-900',
      primary: 'ring-2 ring-red-500',
      success: 'ring-2 ring-emerald-500',
      warning: 'ring-2 ring-amber-500',
      premium: 'ring-2 ring-gradient-to-r from-amber-400 to-yellow-500',
    }

    // Generate background color from name
    const getColorFromName = (name: string) => {
      const colors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-pink-500',
      ]
      const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return colors[index % colors.length]
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center flex-shrink-0',
          sizes[size],
          variants[variant],
          bordered && borderColors[borderColor],
          'overflow-hidden',
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || name || 'Avatar'}
            width={imageSizes[size]}
            height={imageSizes[size]}
            className={cn('object-cover w-full h-full', variants[variant])}
            onError={() => setImageError(true)}
          />
        ) : name ? (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center font-bold text-white',
              getColorFromName(name)
            )}
          >
            {getInitials(name)}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
            <svg
              className="w-1/2 h-1/2 text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              'absolute border-2 border-white dark:border-slate-900 rounded-full',
              statusColors[status],
              statusPositions[size]
            )}
          />
        )}

        {/* Badge */}
        {badge && (
          <span className="absolute -top-1 -right-1">
            {badge}
          </span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// Avatar Group
interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  max?: number
  size?: AvatarProps['size']
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 4, size = 'md', className, ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children]
    const visibleChildren = childArray.slice(0, max)
    const hiddenCount = childArray.length - max

    return (
      <div
        ref={ref}
        className={cn('flex -space-x-3', className)}
        {...props}
      >
        {visibleChildren}
        {hiddenCount > 0 && (
          <div
            className={cn(
              'relative inline-flex items-center justify-center rounded-full',
              'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
              'font-semibold ring-2 ring-white dark:ring-slate-900',
              size === 'xs' && 'w-6 h-6 text-[10px]',
              size === 'sm' && 'w-8 h-8 text-xs',
              size === 'md' && 'w-10 h-10 text-sm',
              size === 'lg' && 'w-12 h-12 text-base',
              size === 'xl' && 'w-16 h-16 text-lg',
              size === '2xl' && 'w-24 h-24 text-2xl'
            )}
          >
            +{hiddenCount}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

export { Avatar }
export default Avatar
