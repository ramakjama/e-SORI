'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, AlertTriangle, FolderOpen, FolderArchive,
  User, MessageSquare, CreditCard, LogOut,
  ChevronLeft, Phone, Trophy, Gift, Star, Receipt,
  Gamepad2, Target, Users, Award, ShoppingBag, BarChart3
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { staggerContainer, staggerItem, slideLeftVariants, hoverScale, transitions } from '@/lib/animations'

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

const gamificationItems = [
  { name: 'Sori HUB', href: '/soriano-club', icon: Gamepad2 },
  { name: 'Quizzes', href: '/quizzes', icon: Target },
  { name: 'Clasificación', href: '/clasificacion', icon: Trophy },
  { name: 'Referidos', href: '/referidos', icon: Users },
  { name: 'Logros', href: '/logros', icon: Award },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
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
        animate={{
          width: sidebarOpen ? 280 : 80,
          transition: transitions.smooth
        }}
        className={cn(
          'sidebar fixed left-0 top-0 h-full z-50',
          'flex flex-col',
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
          <motion.button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={transitions.smooth}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            </motion.div>
          </motion.button>
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
            <motion.div
              className="card-glass p-3 rounded-xl"
              variants={slideLeftVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                  </motion.div>
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
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Navigation */}
        <motion.nav
          className="flex-1 p-4 space-y-1 overflow-y-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <motion.div
                key={item.href}
                variants={staggerItem}
                custom={index}
              >
                <Link
                  href={item.href}
                  className={cn('sidebar-link group', isActive && 'active')}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={transitions.quick}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </motion.div>
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={transitions.smooth}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.name === 'Mensajes' && unreadMessages > 0 && sidebarOpen && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto bg-occident text-white text-xs px-2 py-0.5 rounded-full"
                    >
                      {unreadMessages}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )
          })}

          {/* Admin Section */}
          {user?.role === 'ADMIN' && (
            <>
              {sidebarOpen && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-3" style={{ color: 'var(--color-text-tertiary)' }}>
                    Administración
                  </p>
                  <Link
                    href="/analytics"
                    className={cn('sidebar-link', pathname === '/analytics' && 'active')}
                  >
                    <BarChart3 className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap overflow-hidden">Análisis</span>
                  </Link>
                </div>
              )}
              {!sidebarOpen && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <Link
                    href="/analytics"
                    className={cn('sidebar-link', pathname === '/analytics' && 'active')}
                    title="Análisis"
                  >
                    <BarChart3 className="w-5 h-5 flex-shrink-0" />
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Gamification Section */}
          {sidebarOpen && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-3" style={{ color: 'var(--color-text-tertiary)' }}>
                Sori HUB
              </p>
              {gamificationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('sidebar-link', isActive && 'active')}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
          {!sidebarOpen && (
            <div className="mt-4 pt-4 border-t space-y-1" style={{ borderColor: 'var(--color-border)' }}>
              {gamificationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('sidebar-link', isActive && 'active')}
                    title={item.name}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
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
            <motion.a
              href="tel:+34966810290"
              className="sidebar-link text-occident bg-occident/10 hover:bg-occident/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <Phone className="w-5 h-5" />
              </motion.div>
              <span>966 810 290</span>
            </motion.a>
          )}

          <motion.button
            type="button"
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}
