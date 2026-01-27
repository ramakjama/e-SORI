'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, AlertTriangle, FolderOpen, FolderArchive,
  User, MessageSquare, CreditCard, LogOut,
  ChevronLeft, Phone, Trophy, Gift, Star, Receipt
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mis Pólizas', href: '/polizas', icon: FileText },
  { name: 'Recibos', href: '/recibos', icon: Receipt },
  { name: 'Siniestros', href: '/siniestros', icon: AlertTriangle },
  { name: 'Documentos', href: '/documentos', icon: FolderOpen },
  { name: 'Mi Archivo', href: '/mi-archivo', icon: FolderArchive },
  { name: 'Mensajes', href: '/mensajes', icon: MessageSquare },
  { name: 'Pagos', href: '/pagos', icon: CreditCard },
  { name: 'Mi Perfil', href: '/perfil', icon: User },
]

const getLevelInfo = (level: string) => {
  switch (level) {
    case 'PLATINO': return { badge: 'badge-platino', icon: '👑', next: null, progress: 100 }
    case 'ORO': return { badge: 'badge-oro', icon: '🏆', next: 'PLATINO', progress: 75 }
    case 'PLATA': return { badge: 'badge-plata', icon: '🥈', next: 'ORO', progress: 50 }
    default: return { badge: 'badge-bronce', icon: '🥉', next: 'PLATA', progress: 25 }
  }
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, sidebarOpen, toggleSidebar, messages } = useStore()

  const unreadMessages = messages.filter((m) => !m.read).length
  const levelInfo = getLevelInfo(user?.level || 'BRONCE')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className={cn(
          'sidebar fixed left-0 top-0 h-full z-50',
          'flex flex-col transition-all duration-300',
          !sidebarOpen && 'lg:w-20',
          sidebarOpen ? 'w-72' : 'w-0 lg:w-20'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-occident to-occident-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <div className="font-bold whitespace-nowrap" style={{ color: 'var(--color-text)' }}>SORIANO</div>
                  <div className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>e-SORI</div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className={cn('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* User info with gamification */}
        {user && sidebarOpen && (
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-occident/20 to-occident/10 rounded-full flex items-center justify-center relative">
                <span className="text-occident font-semibold text-lg">
                  {user.name.charAt(0)}
                </span>
                <span className="absolute -bottom-1 -right-1 text-lg">{levelInfo.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{user.name}</div>
                <span className={`${levelInfo.badge} text-xs px-2 py-0.5 rounded-full`}>
                  Nivel {user.level || 'BRONCE'}
                </span>
              </div>
            </div>

            {/* Points & Progress */}
            <div className="card-glass p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    {user.points?.toLocaleString() || '0'} pts
                  </span>
                </div>
                {levelInfo.next && (
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    → {levelInfo.next}
                  </span>
                )}
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${levelInfo.progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-link', isActive && 'active')}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.name === 'Mensajes' && unreadMessages > 0 && sidebarOpen && (
                  <span className="ml-auto bg-occident text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Soriano Club Link */}
          {sidebarOpen && (
            <Link
              href="/soriano-club"
              className="sidebar-link mt-4 bg-gradient-to-r from-occident/10 to-accent-purple/10 border border-occident/20"
            >
              <Trophy className="w-5 h-5 text-occident" />
              <span className="gradient-text font-medium">Soriano Club</span>
              <Gift className="w-4 h-4 ml-auto text-accent-purple" />
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
          {/* Theme Toggle */}
          <div className={cn('flex items-center', sidebarOpen ? 'justify-between' : 'justify-center')}>
            {sidebarOpen && (
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Tema</span>
            )}
            <ThemeToggle />
          </div>

          {sidebarOpen && (
            <a
              href="tel:+34966810290"
              className="sidebar-link text-occident bg-occident/10 hover:bg-occident/20"
            >
              <Phone className="w-5 h-5" />
              <span>966 810 290</span>
            </a>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
