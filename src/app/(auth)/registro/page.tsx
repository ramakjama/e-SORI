'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, ArrowRight, CheckCircle, Loader2, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  scaleVariants,
  slideUpVariants,
  fadeVariants,
  transitions
} from '@/lib/animations'

type Step = 'info' | 'verify' | 'success'

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('info')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [registeredEmail, setRegisteredEmail] = useState('')

  // Paso 1: Enviar email y nombre
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast.error('Por favor completa todos los campos')
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al registrarse')
        return
      }

      // Si incluye código (modo desarrollo)
      if (data.code) {
        toast.success(`Código de verificación: ${data.code}`, { duration: 10000 })
      } else {
        toast.success('Código enviado a tu email')
      }

      setRegisteredEmail(formData.email)
      setStep('verify')

    } catch (error) {
      console.error('Register error:', error)
      toast.error('Error al procesar el registro')
    } finally {
      setIsLoading(false)
    }
  }

  // Paso 2: Verificar código
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    const code = verificationCode.join('')

    if (code.length !== 6) {
      toast.error('Introduce el código de 6 dígitos')
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          code,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Código incorrecto')
        return
      }

      toast.success('¡Registro completado!')
      setStep('success')

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login-cliente')
      }, 2000)

    } catch (error) {
      console.error('Verify error:', error)
      toast.error('Error al verificar el código')
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar input del código
  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value

    setVerificationCode(newCode)

    // Auto-focus al siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  // Reenviar código
  const handleResendCode = async () => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          name: formData.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al reenviar código')
        return
      }

      toast.success('Código reenviado a tu email')

    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Error al reenviar código')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Link href="/" className="inline-block mb-6">
              <motion.div
                className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-glow hover-glow"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={transitions.bouncy}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
          <motion.h1
            variants={staggerItem}
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            Registro
          </motion.h1>
          <motion.p
            variants={staggerItem}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Crea tu cuenta en Soriano e-Cliente
          </motion.p>
        </motion.div>

        {/* Paso 1: Información */}
        <AnimatePresence mode="wait">
          {step === 'info' && (
            <motion.div
              key="info-step"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="card-glass p-8 rounded-3xl hover-lift transition-smooth"
            >
              <motion.form
                onSubmit={handleRegister}
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Nombre */}
                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="input-field pl-12 transition-smooth focus:scale-[1.01] hover-glow"
                      required
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="input-field pl-12 transition-smooth focus:scale-[1.01] hover-glow"
                      required
                    />
                  </div>
                </motion.div>

                {/* Botón */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 hover-lift"
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Continuar
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </motion.form>

              {/* Link a login */}
              <motion.div
                className="mt-6 text-center"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login-cliente" className="text-blue-500 hover:text-blue-600 font-medium transition-smooth">
                    Inicia sesión
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Paso 2: Verificación */}
          {step === 'verify' && (
            <motion.div
              key="verify-step"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="card-glass p-8 rounded-3xl hover-lift transition-smooth"
            >
              <motion.button
                onClick={() => setStep('info')}
                className="flex items-center gap-2 mb-6 text-sm hover-scale-sm transition-smooth"
                style={{ color: 'var(--color-text-secondary)' }}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </motion.button>

              <motion.div
                className="text-center mb-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  variants={scaleVariants}
                  className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Mail className="w-8 h-8 text-blue-500" />
                  </motion.div>
                </motion.div>
                <motion.h2
                  variants={staggerItem}
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  Verifica tu email
                </motion.h2>
                <motion.p
                  variants={staggerItem}
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Hemos enviado un código de 6 dígitos a<br />
                  <strong>{registeredEmail}</strong>
                </motion.p>
              </motion.div>

              <motion.form
                onSubmit={handleVerify}
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Código de 6 dígitos */}
                <motion.div
                  className="flex gap-2 justify-center"
                  variants={staggerItem}
                >
                  {verificationCode.map((digit, index) => (
                    <motion.input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`code-${index - 1}`)
                          prevInput?.focus()
                        }
                      }}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-smooth focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:scale-105"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        borderColor: digit ? 'var(--accent-blue)' : 'var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, ...transitions.bouncy }}
                      whileFocus={{ scale: 1.1 }}
                    />
                  ))}
                </motion.div>

                {/* Botón verificar */}
                <motion.button
                  type="submit"
                  disabled={isLoading || verificationCode.join('').length !== 6}
                  className="btn-primary w-full flex items-center justify-center gap-2 hover-lift"
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verificar
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Reenviar código */}
                <motion.div
                  className="text-center"
                  variants={staggerItem}
                >
                  <motion.button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-smooth"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reenviar código
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
          )}

          {/* Paso 3: Éxito */}
          {step === 'success' && (
            <motion.div
              key="success-step"
              variants={scaleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card-glass p-8 rounded-3xl text-center hover-glow"
            >
              <motion.div
                className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                variants={scaleVariants}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <motion.h2
                className="text-2xl font-bold mb-3"
                style={{ color: 'var(--color-text)' }}
                variants={slideUpVariants}
              >
                ¡Registro completado!
              </motion.h2>
              <motion.p
                className="mb-6"
                style={{ color: 'var(--color-text-secondary)' }}
                variants={slideUpVariants}
              >
                Tu cuenta ha sido creada exitosamente.<br />
                Redirigiendo al login...
              </motion.p>
              <motion.div
                className="flex items-center justify-center gap-2"
                variants={fadeVariants}
              >
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Un momento...
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
