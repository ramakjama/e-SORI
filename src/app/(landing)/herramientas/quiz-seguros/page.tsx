'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  HelpCircle,
  Car,
  Home,
  Heart,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Star,
} from 'lucide-react'
import { LeadForm } from '@/components/forms/LeadForm'
import Confetti from 'react-confetti'

const questions = [
  {
    id: 1,
    question: '¿Qué es lo que más te preocupa proteger?',
    options: [
      { label: 'Mi vehículo', value: 'auto', icon: '🚗' },
      { label: 'Mi hogar', value: 'hogar', icon: '🏠' },
      { label: 'Mi salud', value: 'salud', icon: '❤️' },
      { label: 'Mi familia', value: 'vida', icon: '👨‍👩‍👧' },
    ],
  },
  {
    id: 2,
    question: '¿Cuál es tu situación actual?',
    options: [
      { label: 'Vivo solo/a', value: 'solo', icon: '🧑' },
      { label: 'En pareja', value: 'pareja', icon: '💑' },
      { label: 'Con hijos pequeños', value: 'hijos_peq', icon: '👶' },
      { label: 'Con hijos mayores', value: 'hijos_may', icon: '👨‍👩‍👧‍👦' },
    ],
  },
  {
    id: 3,
    question: '¿Tienes vivienda en propiedad?',
    options: [
      { label: 'Sí, propia', value: 'propia', icon: '🏡' },
      { label: 'De alquiler', value: 'alquiler', icon: '🔑' },
      { label: 'Con hipoteca', value: 'hipoteca', icon: '🏦' },
      { label: 'Vivo con familia', value: 'familia', icon: '👨‍👩‍👧' },
    ],
  },
  {
    id: 4,
    question: '¿Qué valoras más en un seguro?',
    options: [
      { label: 'El precio', value: 'precio', icon: '💰' },
      { label: 'Las coberturas', value: 'coberturas', icon: '🛡️' },
      { label: 'La atención', value: 'atencion', icon: '📞' },
      { label: 'La rapidez', value: 'rapidez', icon: '⚡' },
    ],
  },
  {
    id: 5,
    question: '¿Cuánto inviertes actualmente en seguros al año?',
    options: [
      { label: 'Menos de 500€', value: 'bajo', icon: '💵' },
      { label: '500€ - 1.000€', value: 'medio', icon: '💶' },
      { label: '1.000€ - 2.000€', value: 'alto', icon: '💷' },
      { label: 'Más de 2.000€', value: 'premium', icon: '💎' },
    ],
  },
]

const recommendations = {
  auto: {
    icon: Car,
    name: 'Seguro de Auto',
    description: 'Tu vehículo protegido con las mejores coberturas',
    href: '/landing/seguro-auto',
    color: 'from-blue-500 to-blue-600',
  },
  hogar: {
    icon: Home,
    name: 'Seguro de Hogar',
    description: 'Tu casa y tus cosas siempre protegidas',
    href: '/landing/seguro-hogar',
    color: 'from-emerald-500 to-emerald-600',
  },
  salud: {
    icon: HeartPulse,
    name: 'Seguro de Salud',
    description: 'Cuida de ti con el mejor cuadro médico',
    href: '/landing/seguro-salud',
    color: 'from-violet-500 to-violet-600',
  },
  vida: {
    icon: Heart,
    name: 'Seguro de Vida',
    description: 'Protege el futuro de los tuyos',
    href: '/landing/seguro-vida',
    color: 'from-rose-500 to-rose-600',
  },
}

export default function QuizSegurosPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setTimeout(() => {
        setShowResults(true)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }, 300)
    }
  }

  const getRecommendations = () => {
    // Simple logic to determine recommendations based on first answer
    const primary = answers[0] as keyof typeof recommendations
    const recommended = [recommendations[primary || 'auto']]

    // Add secondary recommendations based on situation
    if (answers[1] === 'pareja' || answers[1] === 'hijos_peq' || answers[1] === 'hijos_may') {
      if (primary !== 'vida') recommended.push(recommendations.vida)
      if (primary !== 'salud') recommended.push(recommendations.salud)
    }

    if (answers[2] === 'propia' || answers[2] === 'hipoteca') {
      if (primary !== 'hogar') recommended.push(recommendations.hogar)
    }

    return recommended.slice(0, 3)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <section className="py-20 min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {showConfetti && (
        <Confetti
          width={window?.innerWidth || 800}
          height={window?.innerHeight || 600}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-occident/10 text-occident text-sm font-semibold mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Quiz interactivo
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            ¿Qué seguro <span className="gradient-text">necesitas</span>?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Responde 5 preguntas y descubre los seguros ideales para ti
          </motion.p>
        </div>

        {!showResults ? (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-occident to-occident-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="card p-8"
              >
                <h2 className="text-xl font-semibold mb-8 text-center" style={{ color: 'var(--color-text)' }}>
                  {questions[currentQuestion].question}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.value)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        answers[currentQuestion] === option.value
                          ? 'border-occident bg-occident/5'
                          : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                      style={{
                        backgroundColor: answers[currentQuestion] === option.value
                          ? undefined
                          : 'var(--color-bg)',
                      }}
                    >
                      <span className="text-3xl mb-3 block">{option.icon}</span>
                      <span
                        className="font-medium"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {option.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                {currentQuestion > 0 && (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="mt-8 flex items-center gap-2 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Pregunta anterior
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </>
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
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-occident to-occident-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                ¡Tenemos tus recomendaciones!
              </h2>

              <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                Basándonos en tus respuestas, estos son los seguros que mejor se adaptan a ti
              </p>

              {/* Gamification */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-600 text-sm font-semibold mb-8">
                <Star className="w-4 h-4" />
                +50 puntos Soriano Club
              </div>

              {/* Recommendations */}
              <div className="space-y-4 mb-8">
                {getRecommendations().map((rec, index) => (
                  <motion.div
                    key={rec.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link href={rec.href} className="block group">
                      <div className="card p-6 flex items-center gap-4 hover:shadow-premium-lg transition-all">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rec.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <rec.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {rec.name}
                            {index === 0 && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-occident/10 text-occident">
                                Recomendado
                              </span>
                            )}
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {rec.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-occident opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Form */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  ¿Quieres un presupuesto personalizado?
                </h3>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  Un asesor experto te contactará para explicarte las mejores opciones
                  según tu perfil.
                </p>

                <div className="space-y-4">
                  {[
                    'Asesoramiento 100% personalizado',
                    'Sin compromiso ni permanencia',
                    'Comparamos +20 aseguradoras',
                    '+200 puntos Soriano Club',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                      <span style={{ color: 'var(--color-text)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <LeadForm
                source="quiz-seguros"
                title="Te asesoramos gratis"
                buttonText="Quiero mi asesoramiento"
              />
            </div>

            {/* Restart */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setShowResults(false)
                  setCurrentQuestion(0)
                  setAnswers({})
                }}
                className="text-sm text-occident hover:underline"
              >
                Volver a hacer el quiz
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
