'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield, FileText, Bell, Trophy, ArrowRight, ArrowLeft,
  CheckCircle, Star, Sparkles, Gift, Clock, Phone,
  Lock, Heart, Car, Home, Activity, Users
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    title: 'Bienvenido a e-SORI',
    subtitle: 'Tu portal de seguros personal',
    description: 'Gestiona todas tus pólizas, siniestros y documentos desde un único lugar. Diseñado para hacerte la vida más fácil.',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    features: [
      'Acceso 24/7 a toda tu información',
      'Gestión de pólizas en tiempo real',
      'Comunicación directa con tu agente',
    ],
  },
  {
    id: 2,
    title: 'Tus Pólizas al Alcance',
    subtitle: 'Todo bajo control',
    description: 'Visualiza el estado de todas tus pólizas, fechas de vencimiento, coberturas y mucho más. Nunca más perderás un detalle importante.',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Consulta coberturas al instante',
      'Descarga tus documentos',
      'Renovaciones simplificadas',
    ],
  },
  {
    id: 3,
    title: 'Siniestros Sin Estrés',
    subtitle: 'Te acompañamos en cada paso',
    description: 'Comunica y sigue tus siniestros como si rastrearás un paquete. Transparencia total en cada etapa del proceso.',
    icon: Clock,
    color: 'from-amber-500 to-amber-600',
    features: [
      'Comunicación rápida de siniestros',
      'Seguimiento en tiempo real',
      'Agente asignado a tu caso',
    ],
  },
  {
    id: 4,
    title: 'Soriano Club',
    subtitle: 'Porque ser cliente tiene sus ventajas',
    description: '¡Bienvenido al programa de fidelidad exclusivo! Acumula puntos, sube de nivel y disfruta de beneficios únicos.',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-500',
    features: [
      'Gana puntos con cada acción',
      'Descuentos exclusivos por nivel',
      'Canjea por experiencias únicas',
    ],
  },
  {
    id: 5,
    title: '¡Todo Listo!',
    subtitle: 'Empieza a explorar',
    description: 'Ya tienes todo preparado para disfrutar de la mejor experiencia de gestión de seguros. ¿Empezamos?',
    icon: Sparkles,
    color: 'from-emerald-500 to-emerald-600',
    features: [
      'Tu panel personalizado te espera',
      'SORI, tu asistente virtual, está listo',
      'Explora todas las funcionalidades',
    ],
  },
]

const insuranceTypes = [
  { id: 'auto', icon: Car, label: 'Auto', color: 'bg-blue-500' },
  { id: 'hogar', icon: Home, label: 'Hogar', color: 'bg-emerald-500' },
  { id: 'vida', icon: Heart, label: 'Vida', color: 'bg-rose-500' },
  { id: 'salud', icon: Activity, label: 'Salud', color: 'bg-violet-500' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([])
  const [isCompleting, setIsCompleting] = useState(false)

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsCompleting(true)
    // Save onboarding completion to localStorage
    localStorage.setItem('onboarding_completed', 'true')
    localStorage.setItem('onboarding_date', new Date().toISOString())

    // Redirect to dashboard after animation
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  const toggleInsurance = (id: string) => {
    setSelectedInsurances((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Skip button */}
      <div className="absolute top-6 right-6 z-50">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Saltar tour
          </Button>
        </Link>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-icon.svg" alt="Soriano" width={40} height={40} />
          <span className="font-bold text-lg text-slate-900 dark:text-white hidden sm:block">
            Soriano Mediadores
          </span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* Left side - Illustration/Icon */}
              <div className="order-2 md:order-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  {/* Main icon container */}
                  <div className={cn(
                    'w-64 h-64 mx-auto rounded-3xl bg-gradient-to-br flex items-center justify-center',
                    step.color
                  )}>
                    <step.icon className="w-32 h-32 text-white" />
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center"
                  >
                    <Star className="w-8 h-8 text-amber-500" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                    className="absolute -bottom-4 -left-4 w-14 h-14 bg-white dark:bg-slate-800 rounded-xl shadow-xl flex items-center justify-center"
                  >
                    <CheckCircle className="w-7 h-7 text-emerald-500" />
                  </motion.div>

                  {/* Background decoration */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-full blur-3xl scale-150" />
                </motion.div>
              </div>

              {/* Right side - Content */}
              <div className="order-1 md:order-2 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                    {step.subtitle}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    {step.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    {step.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-3 mb-8">
                    {step.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br',
                          step.color
                        )}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Insurance selection on step 1 */}
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-8"
                    >
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                        ¿Qué tipos de seguro te interesan?
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {insuranceTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => toggleInsurance(type.id)}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all',
                              selectedInsurances.includes(type.id)
                                ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            )}
                          >
                            <type.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    {!isFirstStep && (
                      <Button
                        variant="outline"
                        onClick={handlePrev}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                      >
                        Anterior
                      </Button>
                    )}

                    <Button
                      variant={isLastStep ? 'premium' : 'primary'}
                      onClick={handleNext}
                      rightIcon={isLastStep ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      isLoading={isCompleting}
                      size="lg"
                    >
                      {isLastStep ? '¡Empezar!' : 'Siguiente'}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="pb-8">
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentStep(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                currentStep === index
                  ? 'w-8 bg-red-500'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
              )}
              aria-label={`Ir al paso ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
          Paso {currentStep + 1} de {steps.length}
        </p>
      </div>

      {/* Completion overlay */}
      <AnimatePresence>
        {isCompleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                ¡Preparando tu experiencia!
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Te estamos llevando a tu panel de control...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
