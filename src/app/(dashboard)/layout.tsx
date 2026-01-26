'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Search, Sparkles, Shield } from 'lucide-react'
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
  const { sidebarOpen, toggleSidebar, messages, user, openChat } = useStore()
  const [showSplash, setShowSplash] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const unreadMessages = messages.filter((m) => !m.read).length

  useEffect(() => {
    // Animate loading progress
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 2
      })
    }, 30)

    // Hide splash after animation
    const splashTimer = setTimeout(() => setShowSplash(false), 2000)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(splashTimer)
    }
  }, [])

  // Premium Splash Screen
  if (showSplash) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
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
                  delay: i * 0.15,
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${50 + Math.random() * 50}%`,
                  backgroundColor: 'var(--color-accent)',
                  opacity: 0.2,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, duration: 0.8 }}
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
              className="w-28 h-28 bg-gradient-to-br from-occident to-red-600 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <span className="text-white font-bold text-5xl">S</span>
            </motion.div>
          </motion.div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center z-10"
          >
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              e-SORI
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Soriano Mediadores de Seguros
            </p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 z-10"
          >
            <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                className="h-full bg-gradient-to-r from-occident to-red-500 rounded-full"
              />
            </div>
            <p className="text-xs mt-3 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
              Cargando tu experiencia...
            </p>
          </motion.div>

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-2 z-10"
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Conexión segura
            </span>
          </motion.div>

          {/* Version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 z-10"
          >
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              v2.0.0 • Costa Blanca
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
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
        <header
          className="sticky top-0 z-30 backdrop-blur-xl border-b"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg transition-colors"
                aria-label="Toggle menu"
                style={{ color: 'var(--color-text)' }}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl w-72"
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
              >
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
              <button
                type="button"
                className="relative p-2.5 rounded-xl transition-colors"
                aria-label="Notifications"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Bell className="w-5 h-5" />
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
              <div
                className="hidden lg:flex items-center gap-3 pl-3 border-l"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {user?.name?.split(' ')[0] || 'Usuario'}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {user?.level || 'BRONCE'}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-occident/20 to-occident/10 rounded-full flex items-center justify-center">
                  <span className="text-occident font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
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
