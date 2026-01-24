'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  User, Building2, Shield, ChevronRight,
  Fingerprint, Scan, KeyRound, Sparkles,
  Apple, Chrome
} from 'lucide-react'

const userTypes = [
  {
    id: 'cliente',
    title: 'Soy Cliente',
    subtitle: 'Accede con tu cuenta social',
    icon: User,
    href: '/login-cliente',
    gradient: 'from-blue-500 to-blue-600',
    features: ['Google', 'Microsoft', 'Apple', 'Facebook', 'LinkedIn'],
    badge: 'OAuth 2.0',
  },
  {
    id: 'empleado',
    title: 'Soy Empleado',
    subtitle: 'Acceso seguro biométrico',
    icon: Building2,
    href: '/login-empleado',
    gradient: 'from-occident to-red-600',
    features: ['Reconocimiento Facial', 'Código OTP', 'Huella Digital'],
    badge: 'AI-Auth',
  },
]

export default function LoginPage() {
  const [hoveredType, setHoveredType] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-occident to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>e-SORI</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Soriano Mediadores</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Title */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.1 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-occident/10 to-accent-purple/10 rounded-3xl flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-occident" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              Bienvenido a e-SORI
            </h1>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Selecciona tu tipo de acceso
            </p>
          </div>

          {/* User Type Cards */}
          <div className="space-y-4">
            {userTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link href={type.href}>
                  <motion.div
                    onHoverStart={() => setHoveredType(type.id)}
                    onHoverEnd={() => setHoveredType(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="card p-6 cursor-pointer border-2 transition-all duration-300"
                    style={{
                      borderColor: hoveredType === type.id ? 'var(--color-occident)' : 'transparent',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <type.icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                            {type.title}
                          </h2>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-occident/10 text-occident">
                            {type.badge}
                          </span>
                        </div>
                        <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                          {type.subtitle}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {type.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 text-xs rounded-lg"
                              style={{
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-secondary)'
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        className="w-6 h-6 flex-shrink-0 transition-transform"
                        style={{
                          color: hoveredType === type.id ? 'var(--color-occident)' : 'var(--color-text-secondary)',
                          transform: hoveredType === type.id ? 'translateX(4px)' : 'none'
                        }}
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 rounded-2xl text-center"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Fingerprint className="w-5 h-5 text-emerald-500" />
              <Scan className="w-5 h-5 text-blue-500" />
              <KeyRound className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Autenticación de Alta Seguridad
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Protegido con reCAPTCHA Enterprise y verificación biométrica
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          © 2024 Soriano Mediadores de Seguros S.L.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <a href="#" className="text-xs hover:underline" style={{ color: 'var(--color-text-secondary)' }}>
            Política de Privacidad
          </a>
          <span style={{ color: 'var(--color-text-secondary)' }}>•</span>
          <a href="#" className="text-xs hover:underline" style={{ color: 'var(--color-text-secondary)' }}>
            Términos de Uso
          </a>
        </div>
      </footer>
    </div>
  )
}
