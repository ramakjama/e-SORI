'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Calculator,
  Car,
  Home,
  Heart,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Euro,
  Sparkles,
  Phone,
} from 'lucide-react'
import { LeadForm } from '@/components/forms/LeadForm'

const insuranceTypes = [
  { id: 'auto', name: 'Auto', icon: Car, avgPrice: 450, savings: 0.25 },
  { id: 'hogar', name: 'Hogar', icon: Home, avgPrice: 200, savings: 0.20 },
  { id: 'salud', name: 'Salud', icon: HeartPulse, avgPrice: 600, savings: 0.15 },
  { id: 'vida', name: 'Vida', icon: Heart, avgPrice: 180, savings: 0.20 },
]

export default function CalculadoraAhorroPage() {
  const [step, setStep] = useState(1)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const toggleType = (id: string) => {
    if (selectedTypes.includes(id)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== id))
      const newPrices = { ...currentPrices }
      delete newPrices[id]
      setCurrentPrices(newPrices)
    } else {
      setSelectedTypes([...selectedTypes, id])
    }
  }

  const calculateSavings = () => {
    let totalCurrent = 0
    let totalNew = 0
    let totalSavings = 0

    selectedTypes.forEach((id) => {
      const type = insuranceTypes.find((t) => t.id === id)
      if (type) {
        const current = currentPrices[id] || type.avgPrice
        const saving = current * type.savings
        totalCurrent += current
        totalNew += current - saving
        totalSavings += saving
      }
    })

    return {
      current: Math.round(totalCurrent),
      new: Math.round(totalNew),
      savings: Math.round(totalSavings),
      percentage: totalCurrent > 0 ? Math.round((totalSavings / totalCurrent) * 100) : 0,
    }
  }

  const results = calculateSavings()

  const handleNext = () => {
    if (step === 1 && selectedTypes.length > 0) {
      setStep(2)
    } else if (step === 2) {
      setShowResults(true)
    }
  }

  return (
    <section className="py-20 min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-occident/10 text-occident text-sm font-semibold mb-6"
          >
            <Calculator className="w-4 h-4" />
            Herramienta gratuita
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Calculadora de <span className="gradient-text">Ahorro</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Descubre cuánto puedes ahorrar en tus seguros en menos de 2 minutos
          </motion.p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= (showResults ? 3 : step)
                  ? 'bg-occident w-12'
                  : 'bg-gray-200 dark:bg-gray-700 w-8'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-8"
            >
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
                    ¿Qué seguros quieres comparar?
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {insuranceTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => toggleType(type.id)}
                        className={`p-6 rounded-2xl border-2 transition-all ${
                          selectedTypes.includes(type.id)
                            ? 'border-occident bg-occident/5'
                            : 'border-transparent hover:border-gray-200'
                        }`}
                        style={{
                          backgroundColor: selectedTypes.includes(type.id)
                            ? undefined
                            : 'var(--color-bg)',
                        }}
                      >
                        <div
                          className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                            selectedTypes.includes(type.id)
                              ? 'bg-occident text-white'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <type.icon className="w-7 h-7" />
                        </div>
                        <span
                          className="font-semibold"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {type.name}
                        </span>
                        {selectedTypes.includes(type.id) && (
                          <CheckCircle className="w-5 h-5 text-occident mx-auto mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
                    ¿Cuánto pagas actualmente?
                  </h2>

                  <div className="space-y-6 mb-8">
                    {selectedTypes.map((id) => {
                      const type = insuranceTypes.find((t) => t.id === id)!
                      return (
                        <div key={id}>
                          <label className="flex items-center gap-3 mb-2">
                            <type.icon className="w-5 h-5 text-occident" />
                            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                              Seguro de {type.name} (€/año)
                            </span>
                          </label>
                          <div className="relative">
                            <Euro
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                              style={{ color: 'var(--color-text-secondary)' }}
                            />
                            <input
                              type="number"
                              placeholder={`Ej: ${type.avgPrice}`}
                              value={currentPrices[id] || ''}
                              onChange={(e) =>
                                setCurrentPrices({
                                  ...currentPrices,
                                  [id]: parseInt(e.target.value) || 0,
                                })
                              }
                              className="input pl-12"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="btn-secondary"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Atrás
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  disabled={step === 1 && selectedTypes.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 2 ? 'Ver mi ahorro' : 'Siguiente'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Results */}
              <div className="card p-8 mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-green to-emerald-600 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                  ¡Podrías ahorrar hasta!
                </h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl font-black text-occident my-6"
                >
                  {results.savings}€
                  <span className="text-2xl font-normal">/año</span>
                </motion.div>

                <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                  Eso es un <strong className="text-occident">{results.percentage}% menos</strong> de
                  lo que pagas ahora
                </p>

                {/* Comparison */}
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Pagas ahora
                    </p>
                    <p className="text-2xl font-bold line-through text-gray-400">
                      {results.current}€
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-occident/10">
                    <p className="text-sm mb-1 text-occident">Con Soriano</p>
                    <p className="text-2xl font-bold text-occident">{results.new}€</p>
                  </div>
                </div>

                {/* Gamification */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-600 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  +50 puntos por usar esta herramienta
                </div>
              </div>

              {/* CTA Form */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                    ¿Quieres tu precio exacto?
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    Déjanos tus datos y un asesor te llamará para darte un presupuesto
                    personalizado sin compromiso.
                  </p>

                  <div className="space-y-4">
                    {[
                      'Presupuesto exacto en 24h',
                      'Sin compromiso ni permanencia',
                      'Bonificación garantizada',
                      '+200 puntos Soriano Club',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent-green" />
                        <span style={{ color: 'var(--color-text)' }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      ¿Prefieres llamar?
                    </p>
                    <a
                      href="tel:+34900123456"
                      className="flex items-center gap-2 text-lg font-bold text-occident"
                    >
                      <Phone className="w-5 h-5" />
                      900 123 456
                    </a>
                  </div>
                </div>

                <LeadForm
                  source="calculadora-ahorro"
                  title="Te llamamos gratis"
                  subtitle="Un asesor te contactará con tu precio exacto"
                  buttonText="Quiero mi presupuesto"
                />
              </div>

              {/* Back button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setShowResults(false)
                    setStep(1)
                    setSelectedTypes([])
                    setCurrentPrices({})
                  }}
                  className="text-sm text-occident hover:underline"
                >
                  Volver a calcular
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
