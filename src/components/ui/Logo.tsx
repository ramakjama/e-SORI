'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'full' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
}

const sizes = {
  sm: { full: { w: 120, h: 36 }, icon: { w: 32, h: 32 } },
  md: { full: { w: 160, h: 48 }, icon: { w: 40, h: 40 } },
  lg: { full: { w: 200, h: 60 }, icon: { w: 56, h: 56 } },
}

export function Logo({ variant = 'full', size = 'md', className, href }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const dimensions = sizes[size][variant]
  const isDark = resolvedTheme === 'dark'

  const logoSrc = variant === 'full'
    ? (mounted && isDark ? '/logo-dark.svg' : '/logo.svg')
    : '/logo-icon.svg'

  const content = (
    <div className={cn('relative flex items-center', className)}>
      {mounted ? (
        <Image
          src={logoSrc}
          alt="Soriano Mediadores"
          width={dimensions.w}
          height={dimensions.h}
          priority
          className="object-contain"
        />
      ) : (
        <div
          style={{ width: dimensions.w, height: dimensions.h }}
          className="bg-gradient-to-r from-occident/20 to-occident/10 rounded animate-pulse"
        />
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-occident/50 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}

export function LogoAnimated({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div className="w-16 h-16 bg-gradient-to-br from-occident to-occident-600 rounded-2xl flex items-center justify-center shadow-glow animate-pulse-slow">
        <span className="text-white font-bold text-3xl">S</span>
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
    </div>
  )
}
