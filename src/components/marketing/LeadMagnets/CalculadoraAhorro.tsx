'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  TrendingDown,
  Mail,
  ArrowRight,
  Check,
  Sparkles,
  DollarSign,
  Calendar,
  Shield,
  Home,
  Car,
  Heart,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'

type InsuranceType = 'auto' | 'hogar' | 'vida' | 'salud' | 'multiple'

interface FormData {
  insuranceType: InsuranceType
  currentPremium: string
  age: string
  hasMultiplePolicies: boolean
  yearsWithCompany: string
}

export function CalculadoraAhorro() {
  const [step, setStep] = useState<'form' | 'calculating' | 'result' | 'email'>('form')
  const [formData, setFormData] = useState<FormData>({
    insuranceType: 'auto',
    currentPremium: '',
    age: '',
    hasMultiplePolicies: false,
    yearsWithCompany: '',
  })
  const [savings, setSavings] = useState({
    monthly: 0,
    annual: 0,
    percentage: 0,
  })
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const insuranceOptions = [
    { id: 'auto' as const, name: 'Auto', icon: Car, color: 'blue' },
    { id: 'hogar' as const, name: 'Hogar', icon: Home, color: 'emerald' },
    { id: 'vida' as const, name: 'Vida', icon: Heart, color: 'red' },
    { id: 'salud' as const, name: 'Salud', icon: Shield, color: 'purple' },
    { id: 'multiple' as const, name: 'Varios', icon: Sparkles, color: 'orange' },
  ]

  const calculateSavings = () => {
    setStep('calculating')

    // Simulate calculation
    setTimeout(() => {
      const premium = parseFloat(formData.currentPremium)
      const age = parseInt(formData.age)
      const yearsWithCompany = parseInt(formData.yearsWithCompany)

      // Base savings percentage
      let savingsPercentage = 0

      // Insurance type factor
      switch (formData.insuranceType) {
        case 'auto':
          savingsPercentage = 15
          break
        case 'hogar':
          savingsPercentage = 20
          break
        case 'vida':
          savingsPercentage = 25
          break
        case 'salud':
          savingsPercentage = 18
          break
        case 'multiple':
          savingsPercentage = 30
          break
      }

      // Age factor (younger = more savings potential)
      if (age < 30) savingsPercentage += 5
      else if (age < 50) savingsPercentage += 3

      // Multiple policies bonus
      if (formData.hasMultiplePolicies) savingsPercentage += 8

      // Loyalty penalty (if staying too long with same company)
      if (yearsWithCompany > 5) savingsPercentage += 10

      // Cap at 45%
      savingsPercentage = Math.min(savingsPercentage, 45)

      const monthlySavings = (premium * savingsPercentage) / 100
      const annualSavings = monthlySavings * 12

      setSavings({
        monthly: Math.round(monthlySavings),
        annual: Math.round(annualSavings),
        percentage: savingsPercentage,
      })

      setStep('result')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 2000)
  }

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('Por favor introduce un email válido')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'savings_calculator',
          metadata: {
            insuranceType: formData.insuranceType,
            currentPremium: formData.currentPremium,
            estimatedSavings: savings.annual,
            savingsPercentage: savings.percentage,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast.success('¡Análisis completo enviado a tu email!', {
        duration: 5000,
        icon: '📧',
      })

      // Show confetti again
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)

    } catch (error) {
      toast.error('Error al enviar. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderForm = () => (
    <div className="space-y-6">
      {/* Insurance Type */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          ¿Qué tipo de seguro tienes?
        </label>
        <div className="grid grid-cols-5 gap-2">
          {insuranceOptions.map((option) => {
            const Icon = option.icon
            const isSelected = formData.insuranceType === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFormData({ ...formData, insuranceType: option.id })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-1 ${isSelected ? `text-${option.color}-500` : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${isSelected ? `text-${option.color}-600 dark:text-${option.color}-400` : 'text-gray-600 dark:text-gray-400'}`}>
                  {option.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Current Premium */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          ¿Cuánto pagas mensualmente?
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            value={formData.currentPremium}
            onChange={(e) => setFormData({ ...formData, currentPremium: e.target.value })}
            placeholder="Ej: 50"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-white dark:bg-gray-800"
            required
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€/mes</span>
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          ¿Cuál es tu edad?
        </label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          placeholder="Ej: 35"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-white dark:bg-gray-800"
          required
        />
      </div>

      {/* Multiple Policies */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hasMultiplePolicies}
            onChange={(e) => setFormData({ ...formData, hasMultiplePolicies: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            Tengo más de un seguro
          </span>
        </label>
      </div>

      {/* Years with Company */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          ¿Cuántos años llevas con tu aseguradora actual?
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            value={formData.yearsWithCompany}
            onChange={(e) => setFormData({ ...formData, yearsWithCompany: e.target.value })}
            placeholder="Ej: 3"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-white dark:bg-gray-800"
            required
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">años</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={calculateSavings}
        disabled={!formData.currentPremium || !formData.age || !formData.yearsWithCompany}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        Calcular mi Ahorro
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )

  const renderCalculating = () => (
    <div className="py-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
      >
        <Calculator className="w-10 h-10 text-white" />
      </motion.div>

      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        Analizando tu caso...
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Comparando con más de 20 aseguradoras
      </p>

      <div className="mt-8 space-y-2">
        {['Calculando prima óptima', 'Analizando coberturas', 'Optimizando descuentos'].map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {text}
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderResult = () => (
    <div className="space-y-6">
      {/* Big Savings Number */}
      <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
        >
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
            Podrías ahorrar hasta
          </p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingDown className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {savings.annual}€
            </span>
          </div>
          <p className="text-lg font-medium text-emerald-700 dark:text-emerald-300">
            al año ({savings.monthly}€/mes)
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {savings.percentage}% de ahorro
            </span>
          </div>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
          Con Soriano Mediadores también obtienes:
        </h4>
        {[
          'Comparación con +20 aseguradoras',
          'Asesoramiento personalizado gratuito',
          'Gestión completa de tu póliza',
          'Sin costes ocultos ni sorpresas',
          'Atención al cliente 24/7',
        ].map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>
              {benefit}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA to Email */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setStep('email')}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Recibir Análisis Completo por Email
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  const renderEmail = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Recibe tu Análisis Completo
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Te enviaremos un informe detallado con las mejores ofertas personalizadas
        </p>
      </div>

      <form onSubmit={handleSubmitEmail} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-white dark:bg-gray-800"
          />
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tu ahorro estimado:</strong> {savings.annual}€/año ({savings.percentage}%)
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Enviar Análisis Completo
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setStep('result')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Volver al resultado
        </button>
      </div>
    </div>
  )

  return (
    <div className="relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="max-w-2xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Calculadora de Ahorro
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Descubre cuánto puedes ahorrar en tu seguro
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['form', 'result', 'email'].map((s, index) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                step === s ? 'w-12 bg-blue-600' : 'w-6 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'form' && renderForm()}
            {step === 'calculating' && renderCalculating()}
            {step === 'result' && renderResult()}
            {step === 'email' && renderEmail()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
