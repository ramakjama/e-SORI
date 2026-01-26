import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import prisma from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

interface QuizAnswer {
  questionId: string
  selectedIndex: number
  timeSpent: number // milliseconds
}

interface SubmitQuizPayload {
  answers: QuizAnswer[]
}

interface QuestionOption {
  text: string
  index: number
}

interface QuizQuestionResponse {
  id: string
  category: string
  difficulty: number
  question: string
  options: QuestionOption[]
  xpReward: number
  coinsReward: number
}

interface DailyQuizResponse {
  id: string
  date: string
  questions: QuizQuestionResponse[]
  alreadyCompleted: boolean
  previousScore?: number
  previousXP?: number
  previousCoins?: number
}

interface AnswerResult {
  questionId: string
  correct: boolean
  correctIndex: number
  selectedIndex: number
  explanation: string | null
  xpEarned: number
  coinsEarned: number
  timeBonus: number
}

interface SubmitQuizResponse {
  success: boolean
  score: number
  totalQuestions: number
  percentage: number
  totalXP: number
  totalCoins: number
  results: AnswerResult[]
  streak?: number
  levelUp?: {
    newLevel: string
    message: string
  } | null
}

// ============================================
// HELPERS
// ============================================

function getTodayDateString(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

function calculateTimeBonus(timeSpent: number): number {
  // Bonus por respuesta rapida (menos de 10 segundos)
  if (timeSpent < 5000) return 5 // 5 bonus coins
  if (timeSpent < 10000) return 3 // 3 bonus coins
  if (timeSpent < 15000) return 1 // 1 bonus coin
  return 0
}

async function getOrCreateDailyQuiz(): Promise<{
  dailyQuiz: { id: string; date: Date; questions: unknown };
  questions: Array<{
    id: string;
    category: string;
    difficulty: number;
    question: string;
    options: unknown;
    correctIndex: number;
    explanation: string | null;
    xpReward: number;
    coinsReward: number;
  }>;
}> {
  const today = getStartOfDay()

  // Intentar obtener el quiz del dia
  let dailyQuiz = await prisma.dailyQuiz.findUnique({
    where: { date: today }
  })

  if (!dailyQuiz) {
    // Crear quiz del dia seleccionando 5 preguntas aleatorias
    const allQuestions = await prisma.quizQuestion.findMany({
      where: { isActive: true },
      select: { id: true }
    })

    if (allQuestions.length < 5) {
      // Si no hay suficientes preguntas, crear algunas por defecto
      const defaultQuestions = await createDefaultQuestions()
      const selectedIds = defaultQuestions.slice(0, 5).map(q => q.id)

      dailyQuiz = await prisma.dailyQuiz.create({
        data: {
          date: today,
          questions: selectedIds
        }
      })
    } else {
      // Seleccionar 5 preguntas aleatorias con variedad de dificultad
      const shuffled = allQuestions.sort(() => Math.random() - 0.5)
      const selectedIds = shuffled.slice(0, 5).map(q => q.id)

      dailyQuiz = await prisma.dailyQuiz.create({
        data: {
          date: today,
          questions: selectedIds
        }
      })
    }
  }

  // Obtener las preguntas completas
  const questionIds = dailyQuiz.questions as string[]
  const questions = await prisma.quizQuestion.findMany({
    where: {
      id: { in: questionIds }
    }
  })

  // Ordenar las preguntas en el mismo orden que los IDs
  const orderedQuestions = questionIds.map(id =>
    questions.find(q => q.id === id)
  ).filter((q): q is NonNullable<typeof q> => q !== undefined)

  return { dailyQuiz, questions: orderedQuestions }
}

async function createDefaultQuestions() {
  const defaultQuestions = [
    {
      category: 'SEGUROS',
      difficulty: 1,
      question: 'Que es una prima de seguro?',
      options: JSON.stringify([
        { text: 'El precio que pagas por tu poliza', index: 0 },
        { text: 'El beneficio que recibes', index: 1 },
        { text: 'El nombre del agente', index: 2 },
        { text: 'Un tipo de cobertura', index: 3 }
      ]),
      correctIndex: 0,
      explanation: 'La prima es el coste que el asegurado paga a la compania de seguros por la cobertura.',
      xpReward: 10,
      coinsReward: 5
    },
    {
      category: 'SEGUROS',
      difficulty: 1,
      question: 'Que cubre normalmente un seguro de hogar?',
      options: JSON.stringify([
        { text: 'Solo robos', index: 0 },
        { text: 'Danos materiales, robos y responsabilidad civil', index: 1 },
        { text: 'Solo incendios', index: 2 },
        { text: 'Solo inundaciones', index: 3 }
      ]),
      correctIndex: 1,
      explanation: 'El seguro de hogar tipicamente cubre danos materiales, robos, responsabilidad civil y otros riesgos.',
      xpReward: 10,
      coinsReward: 5
    },
    {
      category: 'PREVENCION',
      difficulty: 2,
      question: 'Cual es la mejor forma de prevenir accidentes de trafico?',
      options: JSON.stringify([
        { text: 'Conducir rapido para llegar antes', index: 0 },
        { text: 'Respetar los limites de velocidad y mantener distancia de seguridad', index: 1 },
        { text: 'Solo conducir de noche', index: 2 },
        { text: 'Evitar usar el cinturon', index: 3 }
      ]),
      correctIndex: 1,
      explanation: 'Respetar los limites de velocidad y mantener distancia de seguridad son claves para prevenir accidentes.',
      xpReward: 15,
      coinsReward: 8
    },
    {
      category: 'SORIANO',
      difficulty: 1,
      question: 'Cuantos anos de experiencia tiene Soriano Mediadores?',
      options: JSON.stringify([
        { text: 'Menos de 10 anos', index: 0 },
        { text: 'Entre 10 y 20 anos', index: 1 },
        { text: 'Mas de 30 anos', index: 2 },
        { text: 'Mas de 50 anos', index: 3 }
      ]),
      correctIndex: 2,
      explanation: 'Soriano Mediadores cuenta con mas de 30 anos de experiencia en el sector asegurador.',
      xpReward: 10,
      coinsReward: 5
    },
    {
      category: 'SEGUROS',
      difficulty: 2,
      question: 'Que es una franquicia en un seguro?',
      options: JSON.stringify([
        { text: 'Una tienda de seguros', index: 0 },
        { text: 'La cantidad que el asegurado paga antes de que el seguro cubra', index: 1 },
        { text: 'Un tipo de poliza especial', index: 2 },
        { text: 'El descuento por buen cliente', index: 3 }
      ]),
      correctIndex: 1,
      explanation: 'La franquicia es la cantidad que el asegurado debe pagar de su bolsillo antes de que la aseguradora cubra el resto.',
      xpReward: 15,
      coinsReward: 8
    },
    {
      category: 'PREVENCION',
      difficulty: 3,
      question: 'Cada cuanto se recomienda revisar los detectores de humo en el hogar?',
      options: JSON.stringify([
        { text: 'Una vez al ano', index: 0 },
        { text: 'Cada 5 anos', index: 1 },
        { text: 'Mensualmente', index: 2 },
        { text: 'Solo cuando suena', index: 3 }
      ]),
      correctIndex: 2,
      explanation: 'Se recomienda probar los detectores de humo mensualmente y cambiar las pilas al menos una vez al ano.',
      xpReward: 20,
      coinsReward: 10
    },
    {
      category: 'SEGUROS',
      difficulty: 3,
      question: 'Que significa el principio de buena fe en los seguros?',
      options: JSON.stringify([
        { text: 'Que el seguro siempre paga', index: 0 },
        { text: 'Que ambas partes deben actuar con honestidad y transparencia', index: 1 },
        { text: 'Que se puede mentir en la declaracion', index: 2 },
        { text: 'Que el precio es negociable', index: 3 }
      ]),
      correctIndex: 1,
      explanation: 'El principio de buena fe requiere que tanto el asegurado como la aseguradora actuen con honestidad y transparencia.',
      xpReward: 20,
      coinsReward: 10
    }
  ]

  const createdQuestions = await prisma.quizQuestion.createMany({
    data: defaultQuestions.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }))
  })

  return prisma.quizQuestion.findMany({
    where: { isActive: true },
    take: 7
  })
}

async function updateWallet(
  userId: string,
  type: 'XP' | 'COINS' | 'SHIELDS',
  amount: number,
  transactionType: string,
  description?: string
): Promise<void> {
  // Obtener o crear wallet
  let wallet = await prisma.wallet.findUnique({
    where: {
      userId_type: { userId, type }
    }
  })

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId,
        type,
        balance: 0
      }
    })
  }

  // Actualizar balance y crear transaccion
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } }
    }),
    prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: transactionType,
        description
      }
    })
  ])
}

async function updateLeaderboard(userId: string, xpEarned: number): Promise<void> {
  const now = new Date()
  const today = getTodayDateString()

  // Calcular semana ISO
  const weekNumber = getISOWeek(now)
  const year = now.getFullYear()

  const periods = [
    `daily_${today}`,
    `weekly_${year}-W${String(weekNumber).padStart(2, '0')}`,
    `monthly_${year}-${String(now.getMonth() + 1).padStart(2, '0')}`
  ]

  for (const period of periods) {
    await prisma.leaderboardEntry.upsert({
      where: {
        userId_period: { userId, period }
      },
      update: {
        xpEarned: { increment: xpEarned }
      },
      create: {
        userId,
        period,
        xpEarned
      }
    })
  }
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// ============================================
// GET - Obtener Quiz del Dia
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<DailyQuizResponse | { error: string }>> {
  try {
    // Verificar autenticacion
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado. Inicia sesion para acceder al quiz.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Obtener o crear el quiz del dia
    const { dailyQuiz, questions } = await getOrCreateDailyQuiz()

    // Verificar si el usuario ya completo el quiz hoy
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        userId_dailyQuizId: {
          userId,
          dailyQuizId: dailyQuiz.id
        }
      }
    })

    // Preparar respuesta de preguntas (sin correctIndex para el cliente)
    const questionsResponse: QuizQuestionResponse[] = questions.map(q => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options as QuestionOption[],
      xpReward: q.xpReward,
      coinsReward: q.coinsReward
    }))

    const response: DailyQuizResponse = {
      id: dailyQuiz.id,
      date: getTodayDateString(),
      questions: questionsResponse,
      alreadyCompleted: !!existingAttempt?.completedAt,
      previousScore: existingAttempt?.score,
      previousXP: existingAttempt?.totalXP,
      previousCoins: existingAttempt?.totalCoins
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Daily Quiz GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener el quiz.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Enviar Respuestas del Quiz
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<SubmitQuizResponse | { error: string }>> {
  try {
    // Verificar autenticacion
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado. Inicia sesion para enviar el quiz.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parsear body
    let body: SubmitQuizPayload
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de la solicitud invalido.' },
        { status: 400 }
      )
    }

    // Validar payload
    if (!body.answers || !Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de respuestas.' },
        { status: 400 }
      )
    }

    // Validar cada respuesta
    for (const answer of body.answers) {
      if (!answer.questionId || typeof answer.selectedIndex !== 'number') {
        return NextResponse.json(
          { error: 'Cada respuesta debe tener questionId y selectedIndex.' },
          { status: 400 }
        )
      }
    }

    // Obtener quiz del dia
    const { dailyQuiz, questions } = await getOrCreateDailyQuiz()

    // Verificar si ya completo el quiz
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        userId_dailyQuizId: {
          userId,
          dailyQuizId: dailyQuiz.id
        }
      }
    })

    if (existingAttempt?.completedAt) {
      return NextResponse.json(
        { error: 'Ya has completado el quiz de hoy. Vuelve manana para un nuevo quiz.' },
        { status: 400 }
      )
    }

    // Calcular resultados
    const results: AnswerResult[] = []
    let totalXP = 0
    let totalCoins = 0
    let correctCount = 0

    for (const answer of body.answers) {
      const question = questions.find(q => q.id === answer.questionId)

      if (!question) {
        continue // Ignorar preguntas no encontradas
      }

      const isCorrect = answer.selectedIndex === question.correctIndex
      const timeBonus = isCorrect ? calculateTimeBonus(answer.timeSpent || 30000) : 0
      const xpEarned = isCorrect ? question.xpReward : 0
      const coinsEarned = isCorrect ? question.coinsReward + timeBonus : 0

      if (isCorrect) {
        correctCount++
        totalXP += xpEarned
        totalCoins += coinsEarned
      }

      results.push({
        questionId: question.id,
        correct: isCorrect,
        correctIndex: question.correctIndex,
        selectedIndex: answer.selectedIndex,
        explanation: question.explanation,
        xpEarned,
        coinsEarned,
        timeBonus
      })
    }

    // Bonus por quiz perfecto
    if (correctCount === questions.length && questions.length > 0) {
      const perfectBonus = 25
      totalXP += perfectBonus
      totalCoins += 15
    }

    // Guardar intento
    const answersData = body.answers.map(a => {
      const question = questions.find(q => q.id === a.questionId)
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correct: question ? a.selectedIndex === question.correctIndex : false,
        timeSpent: a.timeSpent || 0
      }
    })

    await prisma.quizAttempt.upsert({
      where: {
        userId_dailyQuizId: {
          userId,
          dailyQuizId: dailyQuiz.id
        }
      },
      update: {
        answers: answersData,
        score: correctCount,
        totalXP,
        totalCoins,
        completedAt: new Date()
      },
      create: {
        userId,
        dailyQuizId: dailyQuiz.id,
        answers: answersData,
        score: correctCount,
        totalXP,
        totalCoins,
        completedAt: new Date()
      }
    })

    // Actualizar wallets
    if (totalXP > 0) {
      await updateWallet(userId, 'XP', totalXP, 'QUIZ_REWARD', `Quiz diario - ${correctCount}/${questions.length} correctas`)
    }
    if (totalCoins > 0) {
      await updateWallet(userId, 'COINS', totalCoins, 'QUIZ_REWARD', `Quiz diario - ${correctCount}/${questions.length} correctas`)
    }

    // Actualizar leaderboard
    if (totalXP > 0) {
      await updateLeaderboard(userId, totalXP)
    }

    // Actualizar puntos del usuario (sistema legacy)
    if (totalXP > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: { increment: totalXP }
        }
      })
    }

    // Calcular racha (streak)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const yesterdayQuiz = await prisma.dailyQuiz.findUnique({
      where: { date: yesterday }
    })

    let streak = 1
    if (yesterdayQuiz) {
      const yesterdayAttempt = await prisma.quizAttempt.findUnique({
        where: {
          userId_dailyQuizId: {
            userId,
            dailyQuizId: yesterdayQuiz.id
          }
        }
      })
      if (yesterdayAttempt?.completedAt) {
        // TODO: Implementar contador de racha persistente
        streak = 2
      }
    }

    const percentage = questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0

    const response: SubmitQuizResponse = {
      success: true,
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      totalXP,
      totalCoins,
      results,
      streak
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Daily Quiz POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el quiz.' },
      { status: 500 }
    )
  }
}
