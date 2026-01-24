'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navigation = [
  {
    name: 'Seguros',
    href: '#',
    children: [
      { name: 'Seguro de Auto', href: '/landing/seguro-auto', description: 'Protege tu vehículo' },
      { name: 'Seguro de Hogar', href: '/landing/seguro-hogar', description: 'Tu casa segura' },
      { name: 'Seguro de Salud', href: '/landing/seguro-salud', description: 'Cuida tu bienestar' },
      { name: 'Seguro de Vida', href: '/landing/seguro-vida', description: 'Protege a los tuyos' },
    ],
  },
  { name: 'Ofertas', href: '/ofertas' },
  { name: 'Soriano Club', href: '/club/beneficios' },
  { name: 'Herramientas', href: '/herramientas/calculadora-ahorro' },
]

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl shadow-premium'
          : 'bg-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? 'var(--card-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-occident to-occident-600 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Soriano
              </span>
              <span className="text-xl font-light text-occident"> Mediadores</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-occident/10"
                  style={{ color: 'var(--color-text)' }}
                >
                  {item.name}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-premium-lg border overflow-hidden"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-3 transition-colors hover:bg-occident/5"
                        >
                          <span
                            className="block text-sm font-medium"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {child.name}
                          </span>
                          <span
                            className="block text-xs mt-0.5"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {child.description}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Phone */}
            <a
              href="tel:+34900123456"
              className="hidden md:flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Phone className="w-4 h-4" />
              900 123 456
            </a>

            <ThemeToggle />

            {/* CTA Buttons */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 hover:border-occident hover:text-occident"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              Acceder
            </Link>

            <Link href="/herramientas/calculadora-ahorro" className="btn-primary">
              Calcular Precio
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl"
              style={{ color: 'var(--color-text)' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium rounded-xl"
                      style={{ color: 'var(--color-text)' }}
                      onClick={() => !item.children && setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm rounded-xl"
                            style={{ color: 'var(--color-text-secondary)' }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-3 text-base font-medium rounded-xl border mb-2"
                    style={{
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-border)',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Acceder
                  </Link>
                  <Link
                    href="/herramientas/calculadora-ahorro"
                    className="btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Calcular Precio
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
