'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  X,
  Check,
  Zap,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  Trophy,
  Lightbulb,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Question {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  category: 'seguros' | 'hogar' | 'auto' | 'vida' | 'salud' | 'general'
}

interface QuizResult {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
  timeSpent: number
}

interface DailyQuizWidgetProps {
  onComplete?: (score: number, xpEarned: number, coinsEarned: number) => void
}

interface QuizAPIResponse {
  questions: Question[]
  streak: number
  hasCompletedToday: boolean
}

interface SubmitResultsResponse {
  xpEarned: number
  coinsEarned: number
  newStreak: number
  newTotalXP: number
  newTotalCoins: number
  achievements?: string[]
}

// ============================================================================
// Mock API Functions (Replace with real API calls)
// ============================================================================

async function fetchDailyQuiz(): Promise<QuizAPIResponse> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  const mockQuestions: Question[] = [
    {
      id: 'q1',
      question: '¿Que cubre generalmente un seguro de responsabilidad civil?',
      options: [
        'Solo danos propios',
        'Danos causados a terceros',
        'Gastos medicos propios',
        'Reparaciones del hogar',
      ],
      correctIndex: 1,
      explanation:
        'El seguro de responsabilidad civil cubre los danos que puedas causar a terceras personas, ya sean materiales o personales.',
      category: 'seguros',
    },
    {
      id: 'q2',
      question: '¿Cual es el plazo maximo para declarar un siniestro de auto?',
      options: ['24 horas', '48 horas', '7 dias', '30 dias'],
      correctIndex: 2,
      explanation:
        'Generalmente tienes 7 dias para comunicar un siniestro a tu aseguradora, aunque es recomendable hacerlo lo antes posible.',
      category: 'auto',
    },
    {
      id: 'q3',
      question: '¿Que es una franquicia en un seguro?',
      options: [
        'Un descuento en la prima',
        'La cantidad que pagas del siniestro',
        'El limite de cobertura',
        'Un tipo de poliza',
      ],
      correctIndex: 1,
      explanation:
        'La franquicia es la cantidad fija que el asegurado debe pagar de su bolsillo en caso de siniestro antes de que la aseguradora cubra el resto.',
      category: 'seguros',
    },
    {
      id: 'q4',
      question: '¿Que documento acredita que tienes un seguro vigente?',
      options: [
        'La factura de pago',
        'El certificado de seguro',
        'La carta de bienvenida',
        'El DNI del titular',
      ],
      correctIndex: 1,
      explanation:
        'El certificado de seguro es el documento oficial que acredita la existencia de una poliza de seguro vigente.',
      category: 'seguros',
    },
    {
      id: 'q5',
      question:
        '¿Cual es el beneficio principal de un seguro de vida con ahorro?',
      options: [
        'Solo proteccion por fallecimiento',
        'Acumulacion de capital + proteccion',
        'Cobertura de gastos medicos',
        'Descuentos en farmacias',
      ],
      correctIndex: 1,
      explanation:
        'Los seguros de vida con ahorro combinan la proteccion por fallecimiento con la posibilidad de acumular un capital que puedes rescatar.',
      category: 'vida',
    },
  ]

  return {
    questions: mockQuestions,
    streak: 3,
    hasCompletedToday: false,
  }
}

async function submitQuizResults(
  results: QuizResult[]
): Promise<SubmitResultsResponse> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const correctCount = results.filter((r) => r.isCorrect).length
  const isPerfect = correctCount === results.length

  return {
    xpEarned: correctCount * 20 + (isPerfect ? 50 : 0),
    coinsEarned: correctCount * 5 + (isPerfect ? 15 : 0),
    newStreak: 4,
    newTotalXP: 1250,
    newTotalCoins: 340,
    achievements: isPerfect ? ['perfect_quiz'] : undefined,
  }
}

// ============================================================================
// Constants
// ============================================================================

const QUESTIONS_PER_QUIZ = 5
const TIME_PER_QUESTION = 30

// ============================================================================
// Confetti Component (Pure CSS/JS implementation)
// ============================================================================

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  color: string
  size: number
  duration: number
}

function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (active) {
      const colors = ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
      const newPieces: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 2,
      }))
      setPieces(newPieces)

      const timer = setTimeout(() => setPieces([]), 5000)
      return () => clearTimeout(timer)
    } else {
      setPieces([])
    }
  }, [active])

  if (!active || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Sub-Components
// ============================================================================

// Circular Timer Component
interface CircularTimerProps {
  timeLeft: number
  totalTime: number
  isWarning: boolean
}

function CircularTimer({ timeLeft, totalTime, isWarning }: CircularTimerProps) {
  const percentage = (timeLeft / totalTime) * 100
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="4"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className={cn(
            'transition-colors duration-300',
            isWarning ? 'stroke-red-500' : 'stroke-amber-500'
          )}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
          animate={{
            strokeDashoffset,
          }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </svg>
      {/* Timer text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className={cn(
            'text-lg font-bold',
            isWarning
              ? 'text-red-500'
              : 'text-slate-700 dark:text-slate-300'
          )}
          animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  )
}

// Progress Bar Component
interface QuizProgressBarProps {
  current: number
  total: number
}

function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Pregunta {current} de {total}
        </span>
        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
          {current}/{total}
        </span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Option Button Component
interface OptionButtonProps {
  option: string
  index: number
  isSelected: boolean
  isCorrect: boolean | null
  isRevealed: boolean
  correctIndex: number
  onClick: () => void
  disabled: boolean
}

function OptionButton({
  option,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  correctIndex,
  onClick,
  disabled,
}: OptionButtonProps) {
  const letters = ['A', 'B', 'C', 'D']

  const getButtonStyles = () => {
    if (!isRevealed) {
      if (isSelected) {
        return 'border-amber-500 bg-amber-50 dark:bg-amber-950/50'
      }
      return 'border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:border-amber-700 dark:hover:bg-amber-950/30'
    }

    if (index === correctIndex) {
      return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
    }

    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-50 dark:bg-red-950/50'
    }

    return 'border-slate-200 dark:border-slate-700 opacity-50'
  }

  const getIconStyles = () => {
    if (!isRevealed) {
      if (isSelected) {
        return 'bg-amber-500 text-white'
      }
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    }

    if (index === correctIndex) {
      return 'bg-emerald-500 text-white'
    }

    if (isSelected && !isCorrect) {
      return 'bg-red-500 text-white'
    }

    return 'bg-slate-100 dark:bg-slate-800 text-slate-400'
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
        'flex items-center gap-4',
        getButtonStyles(),
        disabled && !isRevealed && 'cursor-not-allowed opacity-70'
      )}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <span
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0',
          getIconStyles()
        )}
      >
        {isRevealed && index === correctIndex ? (
          <Check className="w-5 h-5" />
        ) : isRevealed && isSelected && !isCorrect ? (
          <X className="w-5 h-5" />
        ) : (
          letters[index]
        )}
      </span>
      <span
        className={cn(
          'font-medium flex-1',
          isRevealed && index === correctIndex
            ? 'text-emerald-700 dark:text-emerald-400'
            : isRevealed && isSelected && !isCorrect
            ? 'text-red-700 dark:text-red-400'
            : 'text-slate-700 dark:text-slate-300'
        )}
      >
        {option}
      </span>
    </motion.button>
  )
}

// Results Screen Component
interface ResultsScreenProps {
  results: QuizResult[]
  questions: Question[]
  streak: number
  xpEarned: number
  coinsEarned: number
  onClose: () => void
  onViewLeaderboard: () => void
}

function ResultsScreen({
  results,
  questions,
  streak,
  xpEarned,
  coinsEarned,
  onClose,
  onViewLeaderboard,
}: ResultsScreenProps) {
  const correctCount = results.filter((r) => r.isCorrect).length
  const percentage = Math.round((correctCount / results.length) * 100)
  const [showExplanations, setShowExplanations] = useState(false)

  const getResultMessage = () => {
    if (percentage === 100) return 'Perfecto! Eres un experto'
    if (percentage >= 80) return 'Excelente! Muy buen trabajo'
    if (percentage >= 60) return 'Bien hecho! Sigue asi'
    if (percentage >= 40) return 'Puedes mejorar, sigue practicando'
    return 'No te rindas, vuelve a intentarlo'
  }

  const getResultEmoji = () => {
    if (percentage === 100) return '🏆'
    if (percentage >= 80) return '🌟'
    if (percentage >= 60) return '👍'
    if (percentage >= 40) return '💪'
    return '📚'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Results Header */}
      <div className="text-center py-8 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-6xl mb-4"
        >
          {getResultEmoji()}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
        >
          {getResultMessage()}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 dark:text-slate-400"
        >
          Has acertado {correctCount} de {results.length} preguntas
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-xl p-4 text-center"
        >
          <Star className="w-6 h-6 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
          <span className="block text-2xl font-bold text-amber-700 dark:text-amber-300">
            +{xpEarned}
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400">
            XP
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 rounded-xl p-4 text-center"
        >
          <Sparkles className="w-6 h-6 mx-auto mb-1 text-yellow-600 dark:text-yellow-400" />
          <span className="block text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            +{coinsEarned}
          </span>
          <span className="text-xs text-yellow-600 dark:text-yellow-400">
            Coins
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl p-4 text-center"
        >
          <Flame className="w-6 h-6 mx-auto mb-1 text-orange-600 dark:text-orange-400" />
          <span className="block text-2xl font-bold text-orange-700 dark:text-orange-300">
            {streak}
          </span>
          <span className="text-xs text-orange-600 dark:text-orange-400">
            Racha
          </span>
        </motion.div>
      </div>

      {/* Score Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mb-6"
      >
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              strokeWidth="8"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={cn(
                percentage >= 60 ? 'stroke-emerald-500' : 'stroke-amber-500'
              )}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 56 * (1 - percentage / 100),
              }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: 2 * Math.PI * 56,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'text-3xl font-bold',
                percentage >= 60
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              )}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* View Leaderboard Button */}
      <div className="px-6 mb-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onViewLeaderboard}
          className="w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy className="w-5 h-5" />
          Ver Clasificacion
        </motion.button>
      </div>

      {/* Explanations Toggle */}
      <div className="flex-1 overflow-y-auto px-6">
        <button
          onClick={() => setShowExplanations(!showExplanations)}
          className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4"
        >
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Ver explicaciones
          </span>
          <motion.span
            animate={{ rotate: showExplanations ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </motion.span>
        </button>

        <AnimatePresence>
          {showExplanations && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {results.map((result, index) => {
                const question = questions.find(
                  (q) => q.id === result.questionId
                )
                if (!question) return null

                return (
                  <motion.div
                    key={result.questionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'p-4 rounded-xl border-l-4',
                      result.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500'
                        : 'bg-red-50 dark:bg-red-950/30 border-red-500'
                    )}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0',
                          result.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                        )}
                      >
                        {result.isCorrect ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </span>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {question.question}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 ml-9">
                      {question.explanation}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Close Button */}
      <div className="p-6 pt-4">
        <motion.button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continuar
        </motion.button>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function DailyQuizWidget({ onComplete }: DailyQuizWidgetProps) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [results, setResults] = useState<QuizResult[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [streak, setStreak] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiResults, setApiResults] = useState<SubmitResultsResponse | null>(null)
  const [hasCompletedToday, setHasCompletedToday] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const questionStartTimeRef = useRef<number>(Date.now())

  // Memoized values
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  )

  const { xpEarned, coinsEarned } = useMemo(() => {
    if (apiResults) {
      return { xpEarned: apiResults.xpEarned, coinsEarned: apiResults.coinsEarned }
    }
    const correctCount = results.filter((r) => r.isCorrect).length
    const isPerfect = correctCount === QUESTIONS_PER_QUIZ
    return {
      xpEarned: correctCount * 20 + (isPerfect ? 50 : 0),
      coinsEarned: correctCount * 5 + (isPerfect ? 15 : 0),
    }
  }, [results, apiResults])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (!quizStarted || isRevealed || quizCompleted) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [quizStarted, isRevealed, quizCompleted, currentQuestionIndex])

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return

    if (selectedOption === null) {
      const timeSpent = TIME_PER_QUESTION
      const result: QuizResult = {
        questionId: currentQuestion.id,
        selectedIndex: -1,
        isCorrect: false,
        timeSpent,
      }
      setResults((prev) => [...prev, result])
    }
    setIsRevealed(true)
  }, [selectedOption, currentQuestion])

  // Load quiz from API
  const loadQuiz = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Real API call would be:
      // const response = await fetch('/api/quiz/daily')
      // const data = await response.json()

      const data = await fetchDailyQuiz()

      if (data.hasCompletedToday) {
        setHasCompletedToday(true)
        return
      }

      setQuestions(data.questions)
      setStreak(data.streak)
      setQuizStarted(true)
      setCurrentQuestionIndex(0)
      setSelectedOption(null)
      setIsRevealed(false)
      setTimeLeft(TIME_PER_QUESTION)
      setResults([])
      setQuizCompleted(false)
      setApiResults(null)
      questionStartTimeRef.current = Date.now()
    } catch (err) {
      setError('Error al cargar el quiz. Intenta de nuevo.')
      console.error('Error loading quiz:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Submit results to API
  const submitResults = useCallback(async (finalResults: QuizResult[]) => {
    try {
      // Real API call would be:
      // const response = await fetch('/api/quiz/daily', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ results: finalResults }),
      // })
      // const data = await response.json()

      const data = await submitQuizResults(finalResults)
      setApiResults(data)
      setStreak(data.newStreak)
    } catch (err) {
      console.error('Error submitting results:', err)
    }
  }, [])

  // Open modal and load quiz
  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  // Start quiz
  const startQuiz = useCallback(() => {
    loadQuiz()
  }, [loadQuiz])

  // Handle option selection
  const handleOptionSelect = useCallback(
    (index: number) => {
      if (isRevealed || selectedOption !== null || !currentQuestion) return

      setSelectedOption(index)
      const isCorrect = index === currentQuestion.correctIndex
      const timeSpent = Math.round((Date.now() - questionStartTimeRef.current) / 1000)

      const result: QuizResult = {
        questionId: currentQuestion.id,
        selectedIndex: index,
        isCorrect,
        timeSpent,
      }
      setResults((prev) => [...prev, result])

      // Small delay before revealing
      setTimeout(() => {
        setIsRevealed(true)
      }, 300)
    },
    [isRevealed, selectedOption, currentQuestion]
  )

  // Go to next question
  const nextQuestion = useCallback(async () => {
    if (currentQuestionIndex < QUESTIONS_PER_QUIZ - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsRevealed(false)
      setTimeLeft(TIME_PER_QUESTION)
      questionStartTimeRef.current = Date.now()
    } else {
      // Quiz completed
      setQuizCompleted(true)

      // Include the last result in the submission
      const finalResults = results
      await submitResults(finalResults)

      const correctCount = finalResults.filter((r) => r.isCorrect).length
      if (correctCount > 3) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
  }, [currentQuestionIndex, results, submitResults])

  // View leaderboard
  const handleViewLeaderboard = useCallback(() => {
    // Navigate to leaderboard or open leaderboard modal
    // This could be implemented with router.push('/leaderboard') or similar
    console.log('Navigate to leaderboard')
    handleClose()
    // You could emit an event or use a navigation callback here
  }, [])

  // Close and reset
  const handleClose = useCallback(() => {
    if (quizCompleted) {
      const correctCount = results.filter((r) => r.isCorrect).length
      onComplete?.(correctCount, xpEarned, coinsEarned)
    }
    setIsOpen(false)
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsRevealed(false)
    setResults([])
    setError(null)
    setApiResults(null)
  }, [quizCompleted, results, xpEarned, coinsEarned, onComplete])

  // Don't show widget if already completed today
  if (hasCompletedToday && !isOpen) {
    return null
  }

  return (
    <>
      {/* Floating Widget Button with Pulsating Animation */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Pulsating ring effect */}
        <motion.span
          className="absolute inset-0 rounded-full bg-amber-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-amber-400"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />

        <motion.span
          className="relative z-10"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
        >
          <Target className="w-5 h-5" />
        </motion.span>
        <span className="relative z-10">Quiz disponible 🎯</span>
        <motion.span
          className="absolute -top-1 -right-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full z-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Nuevo
        </motion.span>
      </motion.button>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-slate-900"
          >
            {/* Confetti */}
            <Confetti active={showConfetti} />

            {/* Header */}
            <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 z-10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h1 className="font-bold text-slate-900 dark:text-white">
                      Quiz Diario
                    </h1>
                    {quizStarted && !quizCompleted && (
                      <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                        <Flame className="w-4 h-4" />
                        <span>Racha: {streak} dias</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {quizStarted && !quizCompleted && (
                    <CircularTimer
                      timeLeft={timeLeft}
                      totalTime={TIME_PER_QUESTION}
                      isWarning={timeLeft <= 10}
                    />
                  )}
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {quizStarted && !quizCompleted && (
                <div className="px-4 pb-4">
                  <QuizProgressBar
                    current={currentQuestionIndex + 1}
                    total={QUESTIONS_PER_QUIZ}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-140px)] overflow-y-auto">
              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Cargando quiz...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Already Completed Today */}
              {hasCompletedToday && (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Quiz completado
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Ya has completado el quiz de hoy. Vuelve manana para un nuevo desafio.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              {!isLoading && !error && !hasCompletedToday && !quizStarted ? (
                // Start Screen
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-500/30"
                  >
                    <Zap className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Quiz Diario de Seguros
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                    Responde 5 preguntas sobre seguros y gana XP y monedas.
                    Tienes 30 segundos por pregunta.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs">
                    <div className="bg-amber-50 dark:bg-amber-950/50 rounded-xl p-4 text-center">
                      <Clock className="w-6 h-6 mx-auto mb-1 text-amber-600" />
                      <span className="block text-lg font-bold text-amber-700 dark:text-amber-300">
                        30s
                      </span>
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        por pregunta
                      </span>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-4 text-center">
                      <Star className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      <span className="block text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        +20
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        XP por acierto
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6 text-orange-600 dark:text-orange-400">
                    <Flame className="w-5 h-5" />
                    <span className="font-medium">
                      Racha actual: {streak} dias
                    </span>
                  </div>

                  <motion.button
                    onClick={startQuiz}
                    className="w-full max-w-xs py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Comenzar Quiz
                  </motion.button>
                </motion.div>
              ) : quizCompleted ? (
                // Results Screen
                <ResultsScreen
                  results={results}
                  questions={questions}
                  streak={apiResults?.newStreak || streak}
                  xpEarned={xpEarned}
                  coinsEarned={coinsEarned}
                  onClose={handleClose}
                  onViewLeaderboard={handleViewLeaderboard}
                />
              ) : quizStarted && currentQuestion ? (
                // Question Screen
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-6"
                >
                  {/* Question */}
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-sm font-medium rounded-full mb-4 capitalize">
                      {currentQuestion.category}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, index) => (
                      <OptionButton
                        key={index}
                        option={option}
                        index={index}
                        isSelected={selectedOption === index}
                        isCorrect={
                          selectedOption === index
                            ? index === currentQuestion.correctIndex
                            : null
                        }
                        isRevealed={isRevealed}
                        correctIndex={currentQuestion.correctIndex}
                        onClick={() => handleOptionSelect(index)}
                        disabled={isRevealed || selectedOption !== null}
                      />
                    ))}
                  </div>

                  {/* Explanation (shown after reveal) */}
                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Explicacion
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {currentQuestion.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  {isRevealed && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={nextQuestion}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {currentQuestionIndex < QUESTIONS_PER_QUIZ - 1
                        ? 'Siguiente Pregunta'
                        : 'Ver Resultados'}
                    </motion.button>
                  )}
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DailyQuizWidget
