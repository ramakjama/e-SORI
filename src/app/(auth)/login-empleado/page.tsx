'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Shield, CheckCircle, Loader2, AlertCircle,
  Scan, Fingerprint, KeyRound, Mail, ArrowRight, Camera,
  RefreshCw, Check, X
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

const steps = [
  { id: 1, title: 'Email Corporativo', icon: Mail, description: 'Introduce tu email de empresa' },
  { id: 2, title: 'Reconocimiento Facial', icon: Scan, description: 'Verifica tu identidad con la cámara' },
  { id: 3, title: 'Código OTP', icon: KeyRound, description: 'Introduce el código de tu app' },
  { id: 4, title: 'Huella Digital', icon: Fingerprint, description: 'Confirma con tu huella' },
]

export default function LoginEmpleadoPage() {
  const router = useRouter()
  const { login } = useStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [faceVerified, setFaceVerified] = useState(false)
  const [fingerprintVerified, setFingerprintVerified] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [faceDetecting, setFaceDetecting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Camera setup
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
    if (currentStep === 2) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [currentStep, startCamera, stopCamera])

  // Step 1: Email
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@sorianomediadores.es') || email.includes('@')) {
      setCurrentStep(2)
      toast.success('Email verificado')
    } else {
      toast.error('Email corporativo no válido')
    }
  }

  // Step 2: Face Recognition
  const handleFaceVerification = async () => {
    setFaceDetecting(true)

    // Simulate face detection
    await new Promise(resolve => setTimeout(resolve, 2500))

    setFaceVerified(true)
    setFaceDetecting(false)
    toast.success('Rostro verificado correctamente')

    setTimeout(() => {
      setCurrentStep(3)
    }, 1000)
  }

  // Step 3: OTP
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Check if complete
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''))
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const verifyOtp = async (code: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Accept any 6-digit code for demo
    if (code.length === 6) {
      toast.success('Código OTP verificado')
      setCurrentStep(4)
    } else {
      toast.error('Código incorrecto')
    }
    setIsLoading(false)
  }

  // Step 4: Fingerprint (WebAuthn simulation)
  const handleFingerprintVerification = async () => {
    setIsLoading(true)

    try {
      // Check if WebAuthn is available
      if (window.PublicKeyCredential) {
        // For demo, we'll simulate the fingerprint verification
        await new Promise(resolve => setTimeout(resolve, 2000))

        setFingerprintVerified(true)
        toast.success('Huella digital verificada')

        // Complete login
        setTimeout(async () => {
          const success = await login('empleado@sorianomediadores.es', 'empleado', 'EMPLEADO')
          if (success) {
            toast.success('¡Bienvenido! Acceso autorizado')
            router.push('/dashboard')
          }
        }, 1000)
      } else {
        // Fallback for browsers without WebAuthn
        await new Promise(resolve => setTimeout(resolve, 1500))
        setFingerprintVerified(true)

        const success = await login('empleado@sorianomediadores.es', 'empleado', 'EMPLEADO')
        if (success) {
          toast.success('¡Bienvenido! Acceso autorizado')
          router.push('/dashboard')
        }
      }
    } catch {
      toast.error('Error en verificación biométrica')
    }

    setIsLoading(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleEmailSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Email Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.nombre@sorianomediadores.es"
                  className="input pl-12"
                  required
                  autoFocus
                />
              </div>
              <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Usa tu email corporativo de Soriano Mediadores
              </p>
            </div>

            <button type="submit" className="btn-primary w-full">
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.form>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Camera View */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Face Detection Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={faceDetecting ? {
                    scale: [1, 1.05, 1],
                    borderColor: ['#10b981', '#3b82f6', '#10b981']
                  } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-48 h-48 rounded-full border-4 ${
                    faceVerified ? 'border-emerald-500 bg-emerald-500/20' :
                    faceDetecting ? 'border-blue-500' : 'border-white/50'
                  }`}
                />
              </div>

              {/* Status */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  faceVerified ? 'bg-emerald-500' : 'bg-black/50'
                } text-white text-sm`}>
                  {faceVerified ? (
                    <>
                      <Check className="w-4 h-4" />
                      Rostro Verificado
                    </>
                  ) : faceDetecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analizando rostro...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Posiciona tu rostro en el círculo
                    </>
                  )}
                </div>
              </div>
            </div>

            {!faceVerified && (
              <button
                type="button"
                onClick={handleFaceVerification}
                disabled={faceDetecting || !cameraActive}
                className="btn-primary w-full"
              >
                {faceDetecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-2" />
                    Iniciar Verificación Facial
                  </>
                )}
              </button>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                Código de Verificación
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Introduce el código de 6 dígitos de tu app autenticadora
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { otpRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-colors focus:border-occident focus:outline-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: digit ? 'var(--color-occident)' : 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              ))}
            </div>

            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-occident" />
              </div>
            )}

            <p className="text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Compatible con Google Authenticator, Authy y Microsoft Authenticator
            </p>

            {/* Demo hint */}
            <div className="p-3 rounded-xl text-center text-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>Demo:</span>
              <span style={{ color: 'var(--color-text-secondary)' }}> Introduce cualquier código de 6 dígitos</span>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <motion.div
                animate={fingerprintVerified ? {} : { scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  fingerprintVerified
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : 'bg-gradient-to-br from-occident/20 to-accent-purple/20'
                }`}
              >
                {fingerprintVerified ? (
                  <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Fingerprint className="w-12 h-12 text-occident" />
                )}
              </motion.div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                {fingerprintVerified ? '¡Verificación Completa!' : 'Verificación Biométrica'}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {fingerprintVerified
                  ? 'Todos los pasos completados correctamente'
                  : 'Usa tu huella digital o Windows Hello para confirmar'
                }
              </p>
            </div>

            {!fingerprintVerified && (
              <button
                type="button"
                onClick={handleFingerprintVerification}
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 mr-2" />
                    Verificar Huella Digital
                  </>
                )}
              </button>
            )}

            {fingerprintVerified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    Accediendo al sistema...
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="p-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-occident to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              AI-Authenticator
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Acceso Empleados - Alta Seguridad
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 px-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                      backgroundColor: currentStep > step.id
                        ? '#10b981'
                        : currentStep === step.id
                          ? '#E30613'
                          : 'var(--card-bg)'
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      currentStep >= step.id ? 'border-transparent' : ''
                    }`}
                    style={{
                      borderColor: currentStep < step.id ? 'var(--color-border)' : 'transparent'
                    }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${
                        currentStep === step.id ? 'text-white' : ''
                      }`} style={{
                        color: currentStep === step.id ? 'white' : 'var(--color-text-secondary)'
                      }} />
                    )}
                  </motion.div>
                  <span className="text-xs mt-1 hidden sm:block" style={{
                    color: currentStep >= step.id ? 'var(--color-text)' : 'var(--color-text-secondary)'
                  }}>
                    {step.title.split(' ')[0]}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="w-8 sm:w-12 h-0.5 mx-1"
                    style={{
                      backgroundColor: currentStep > step.id ? '#10b981' : 'var(--color-border)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="card p-6">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Security Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <Shield className="w-4 h-4 text-emerald-500" />
            Autenticación multifactor de alta seguridad
          </div>
        </motion.div>
      </main>
    </div>
  )
}
