'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Search, Sparkles, Loader2, Shield, X } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { SoriChatWidget } from '@/components/chat/SoriChatWidget'
import { BottomNav } from '@/components/ui/BottomNav'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, sidebarOpen, toggleSidebar, messages, user, openChat } = useStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  const unreadMessages = messages.filter((m) => !m.read).length

  useEffect(() => {
    // Mark as hydrated after first render
    setIsHydrated(true)

    // Hide splash after delay
    const timer = setTimeout(() => setShowSplash(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only redirect after hydration is complete
    if (isHydrated && !isAuthenticated) {
      router.push('/login')
    }
  }, [isHydrated, isAuthenticated, router])

  // Premium Splash Screen
  if (!isHydrated || showSplash) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        >
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                  y: [0, -100],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="absolute w-2 h-2 bg-occident/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${50 + Math.random() * 50}%`,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(227, 6, 19, 0.3)',
                  '0 0 50px rgba(227, 6, 19, 0.5)',
                  '0 0 20px rgba(227, 6, 19, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-br from-occident to-red-600 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <span className="text-white font-bold text-4xl">S</span>
            </motion.div>
          </motion.div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center z-10"
          >
            <h1 className="text-3xl font-bold text-white mb-1">e-SORI</h1>
            <p className="text-slate-400 text-sm">Soriano Mediadores</p>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 z-10"
          >
            <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-occident to-red-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center gap-2 text-slate-500 text-xs z-10"
          >
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Conexión segura</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-slate-600 dark:text-slate-400">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />

      {/* Main content */}
      <div className={cn(
        'transition-all duration-300',
        sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800"
              >
                <Menu className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl w-72" style={{ backgroundColor: 'var(--color-bg)' }}>
                <Search className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Buscar pólizas, documentos..."
                  className="bg-transparent text-sm outline-none w-full"
                  style={{ color: 'var(--color-text)' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button type="button" className="relative p-2.5 rounded-xl hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors">
                <Bell className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-occident rounded-full animate-pulse" />
                )}
              </button>

              {/* SORI Quick Access */}
              <button
                type="button"
                onClick={openChat}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-occident to-red-500 rounded-xl hover:shadow-lg hover:shadow-occident/30 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Pregunta a SORI
              </button>

              {/* User Avatar */}
              <div className="hidden lg:flex items-center gap-3 pl-3 border-l" style={{ borderColor: 'var(--color-border)' }}>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {user?.name?.split(' ')[0]}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {user?.level || 'BRONCE'}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-occident/20 to-occident/10 rounded-full flex items-center justify-center">
                  <span className="text-occident font-semibold">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - with bottom padding for mobile nav */}
        <main className="p-4 lg:p-8 pb-24 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />

      {/* SORI Chat Widget */}
      <SoriChatWidget />
    </div>
  )
}
