'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Shield, CheckCircle, Loader2,
  Mail, Lock, Eye, EyeOff, Fingerprint, ScanEye,
  Sparkles, ArrowRight, Check, Camera
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'

// OAuth Provider Icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
)

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const oauthProviders = [
  { id: 'google', name: 'Google', icon: GoogleIcon, bg: 'hover:bg-red-50 dark:hover:bg-red-950/20' },
  { id: 'microsoft', name: 'Microsoft', icon: MicrosoftIcon, bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/20' },
  { id: 'apple', name: 'Apple', icon: AppleIcon, bg: 'hover:bg-gray-100 dark:hover:bg-gray-800' },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon, bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/20' },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, bg: 'hover:bg-sky-50 dark:hover:bg-sky-950/20' },
]

type AuthPhase = 'oauth' | 'biometric' | 'complete'
type BiometricStep = 'choice' | 'fingerprint' | 'iris' | 'verifying' | 'success'

export default function LoginClientePage() {
  const router = useRouter()
  const { login } = useStore()
  const [phase, setPhase] = useState<AuthPhase>('oauth')
  const [biometricStep, setBiometricStep] = useState<BiometricStep>('choice')
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [irisScanning, setIrisScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  // Camera for iris scan
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch {
      toast.error('No se pudo acceder a la cámara')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setCameraActive(false)
    }
  }, [])

  useEffect(() => {
    if (biometricStep === 'iris') {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [biometricStep, startCamera, stopCamera])

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 }
      navigator.vibrate(patterns[type])
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(provider)
    triggerHaptic('light')

    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500))

    setConnectedProvider(provider)
    setPhase('biometric')
    setIsLoading(null)
    toast.success(`Conectado con ${provider}`)
    triggerHaptic('medium')
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading('email')
    triggerHaptic('light')

    await new Promise(resolve => setTimeout(resolve, 1000))

    setConnectedProvider('Email')
    setPhase('biometric')
    setIsLoading(null)
    toast.success('Email verificado')
    triggerHaptic('medium')
  }

  const handleFingerprintAuth = async () => {
    setBiometricStep('fingerprint')
    setIsLoading('fingerprint')
    triggerHaptic('medium')

    await new Promise(resolve => setTimeout(resolve, 2000))

    setBiometricStep('verifying')
    await new Promise(resolve => setTimeout(resolve, 1000))

    completeLogin()
  }

  const handleIrisAuth = async () => {
    setBiometricStep('iris')
    triggerHaptic('medium')
  }

  const startIrisScan = async () => {
    setIrisScanning(true)
    triggerHaptic('light')

    await new Promise(resolve => setTimeout(resolve, 3000))

    setIrisScanning(false)
    setBiometricStep('verifying')
    triggerHaptic('medium')

    await new Promise(resolve => setTimeout(resolve, 1000))
    completeLogin()
  }

  const completeLogin = async () => {
    setBiometricStep('success')
    setShowConfetti(true)
    triggerHaptic('heavy')

    // Play success sound
    try {
      const audio = new Audio('/sounds/success.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch {}

    await new Promise(resolve => setTimeout(resolve, 500))

    const success = await login('cliente@demo.com', 'demo', 'CLIENTE')

    if (success) {
      toast.success('¡Bienvenido a e-SORI!', {
        icon: '🎉',
        duration: 3000,
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  }

  const skipBiometric = async () => {
    setIsLoading('skip')
    const success = await login('cliente@demo.com', 'demo', 'CLIENTE')
    if (success) {
      toast.success('¡Bienvenido!')
      router.push('/dashboard')
    }
  }

  // Render OAuth phase
  const renderOAuthPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md"
    >
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Acceso Cliente
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Elige tu método de acceso preferido
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        {oauthProviders.map((provider, index) => (
          <motion.button
            key={provider.id}
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleOAuthLogin(provider.name)}
            disabled={isLoading !== null}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all ${provider.bg} disabled:opacity-50`}
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--color-border)'
            }}
          >
            {isLoading === provider.name ? (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-text)' }} />
            ) : (
              <provider.icon />
            )}
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
              Continuar con {provider.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
            o con email
          </span>
        </div>
      </div>

      {/* Email Form */}
      {!showEmailForm ? (
        <motion.button
          type="button"
          onClick={() => setShowEmailForm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--color-border)'
          }}
        >
          <Mail className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
          <span className="font-medium" style={{ color: 'var(--color-text)' }}>
            Acceder con Email
          </span>
        </motion.button>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleEmailLogin}
          className="space-y-4"
        >
          <div>
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
                className="input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="input pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading !== null}
            className="btn-primary w-full py-4 text-lg"
          >
            {isLoading === 'email' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Continuar'
            )}
          </button>
        </motion.form>
      )}

      {/* Demo Notice */}
      <div className="mt-6 p-4 rounded-2xl text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <strong>Demo:</strong> Haz clic en cualquier botón para continuar
        </span>
      </div>
    </motion.div>
  )

  // Render Biometric phase
  const renderBiometricPhase = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md"
    >
      {/* Success connection badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-emerald-700 dark:text-emerald-300">
              Conectado con {connectedProvider}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Ahora verifica tu identidad
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {biometricStep === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Verificación Biométrica
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Elige un método para confirmar tu identidad
              </p>
            </div>

            <div className="space-y-4">
              {/* Fingerprint Option */}
              <motion.button
                type="button"
                onClick={handleFingerprintAuth}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 rounded-2xl border-2 text-left transition-all hover:border-emerald-500"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <Fingerprint className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                      Huella Digital
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Touch ID, Windows Hello o sensor de huella
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              </motion.button>

              {/* Iris Scan Option */}
              <motion.button
                type="button"
                onClick={handleIrisAuth}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 rounded-2xl border-2 text-left transition-all hover:border-blue-500"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <ScanEye className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                      Escáner de Iris
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Verificación ocular de alta seguridad
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              </motion.button>
            </div>

            {/* Skip Option */}
            <button
              type="button"
              onClick={skipBiometric}
              disabled={isLoading === 'skip'}
              className="w-full mt-6 py-3 text-sm font-medium transition-colors hover:underline"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {isLoading === 'skip' ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                'Omitir por ahora'
              )}
            </button>
          </motion.div>
        )}

        {biometricStep === 'fingerprint' && (
          <motion.div
            key="fingerprint"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl"
            >
              <Fingerprint className="w-16 h-16 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Coloca tu dedo
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Mantén el dedo en el sensor
            </p>
            <div className="mt-6">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
            </div>
          </motion.div>
        )}

        {biometricStep === 'iris' && (
          <motion.div
            key="iris"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            {/* Camera View */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Iris Detection Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={irisScanning ? {
                    boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.5)', '0 0 0 20px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0.5)']
                  } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative"
                >
                  {/* Eye outline */}
                  <svg viewBox="0 0 200 100" className="w-48 h-24">
                    <motion.ellipse
                      cx="100"
                      cy="50"
                      rx="90"
                      ry="45"
                      fill="none"
                      stroke={irisScanning ? '#3b82f6' : 'rgba(255,255,255,0.5)'}
                      strokeWidth="3"
                      animate={irisScanning ? { strokeDashoffset: [0, 100] } : {}}
                      strokeDasharray="10 5"
                    />
                    <motion.circle
                      cx="100"
                      cy="50"
                      r="25"
                      fill="none"
                      stroke={irisScanning ? '#10b981' : 'rgba(255,255,255,0.3)'}
                      strokeWidth="2"
                      animate={irisScanning ? { r: [25, 28, 25] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Scanning lines */}
              {irisScanning && (
                <motion.div
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                />
              )}

              {/* Status */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  irisScanning ? 'bg-blue-500' : 'bg-black/50'
                } text-white text-sm`}>
                  {irisScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Escaneando iris...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Mira directamente a la cámara
                    </>
                  )}
                </div>
              </div>
            </div>

            {!irisScanning && (
              <button
                type="button"
                onClick={startIrisScan}
                className="btn-primary w-full py-4 text-lg"
              >
                <ScanEye className="w-5 h-5 mr-2" />
                Iniciar Escáner de Iris
              </button>
            )}
          </motion.div>
        )}

        {biometricStep === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-blue-200 border-t-blue-500"
            />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Verificando identidad
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Procesando datos biométricos...
            </p>
          </motion.div>
        )}

        {biometricStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              ¡Verificación Completa!
            </h3>
            <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Accediendo a tu cuenta...
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
              className="h-1 bg-emerald-500 rounded-full mx-auto max-w-xs"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Header */}
      <header className="p-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {phase === 'oauth' && renderOAuthPhase()}
          {(phase === 'biometric' || phase === 'complete') && renderBiometricPhase()}
        </AnimatePresence>
      </main>

      {/* Security Badge */}
      <footer className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <Shield className="w-4 h-4 text-emerald-500" />
          Autenticación de máxima seguridad
        </div>
      </footer>
    </div>
  )
}
