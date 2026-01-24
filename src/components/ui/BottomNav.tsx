'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, AlertTriangle,
  Trophy, User, Sparkles, Plus
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pólizas', href: '/polizas', icon: FileText },
  { name: 'SORI', href: '#sori', icon: Sparkles, isCenter: true },
  { name: 'Club', href: '/soriano-club', icon: Trophy },
  { name: 'Perfil', href: '/perfil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { messages, toggleChat } = useStore()
  const unreadMessages = messages.filter(m => !m.read).length

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.href === '#sori') {
      e.preventDefault()
      toggleChat?.()
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Glass background with blur */}
      <div
        className="absolute inset-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-white/20 dark:border-slate-800/50"
        style={{
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(20px)'
        }}
      />

      {/* Gradient glow effect at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-occident/30 to-transparent" />

      {/* Safe area padding for iOS */}
      <div className="relative px-2 pb-safe">
        <div className="flex items-center justify-around h-20">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const isCenter = item.isCenter

            if (isCenter) {
              return (
                <motion.button
                  key={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  whileTap={{ scale: 0.9 }}
                  className="relative -mt-8"
                >
                  {/* Outer glow ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-occident to-red-500 blur-xl"
                  />

                  {/* Main button */}
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-occident via-red-500 to-red-600 shadow-lg shadow-occident/40 flex items-center justify-center border-4 border-white dark:border-slate-900">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                  </div>

                  {/* Label */}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-occident whitespace-nowrap">
                    SORI
                  </span>
                </motion.button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(item, e as React.MouseEvent)}
                className="relative flex flex-col items-center justify-center w-16 h-full group"
              >
                {/* Active background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="navBg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-x-1 top-2 bottom-6 rounded-2xl bg-occident/10 dark:bg-occident/20"
                    />
                  )}
                </AnimatePresence>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute top-1 w-1 h-1 rounded-full bg-occident"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}

                {/* Icon with animation */}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    'relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200',
                    isActive && 'scale-110'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-6 h-6 transition-all duration-200',
                      isActive
                        ? 'text-occident'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Notification badge */}
                  {item.name === 'Perfil' && unreadMessages > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-occident text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg"
                    >
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </motion.span>
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  className={cn(
                    'text-[10px] font-semibold mt-0.5 transition-all duration-200',
                    isActive
                      ? 'text-occident'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {item.name}
                </motion.span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
