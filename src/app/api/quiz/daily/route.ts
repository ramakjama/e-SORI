// Using native Response instead of NextResponse to avoid module resolution issues in Next.js 14.2.29

// ============================================
// TYPES
// ============================================

interface QuizAnswer {
  questionId: string
  selectedIndex: number
  timeSpent: number
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
// MOCK DATA
// ============================================

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

const MOCK_QUESTIONS: QuizQuestionResponse[] = [
  {
    id: 'q1',
    category: 'SEGUROS',
    difficulty: 1,
    question: 'Que es una prima de seguro?',
    options: [
      { text: 'El precio que pagas por tu poliza', index: 0 },
      { text: 'El beneficio que recibes', index: 1 },
      { text: 'El nombre del agente', index: 2 },
      { text: 'Un tipo de cobertura', index: 3 }
    ],
    xpReward: 10,
    coinsReward: 5
  },
  {
    id: 'q2',
    category: 'SEGUROS',
    difficulty: 1,
    question: 'Que cubre normalmente un seguro de hogar?',
    options: [
      { text: 'Solo robos', index: 0 },
      { text: 'Danos materiales, robos y responsabilidad civil', index: 1 },
      { text: 'Solo incendios', index: 2 },
      { text: 'Solo inundaciones', index: 3 }
    ],
    xpReward: 10,
    coinsReward: 5
  },
  {
    id: 'q3',
    category: 'PREVENCION',
    difficulty: 2,
    question: 'Cual es la mejor forma de prevenir accidentes de trafico?',
    options: [
      { text: 'Conducir rapido para llegar antes', index: 0 },
      { text: 'Respetar los limites de velocidad y mantener distancia de seguridad', index: 1 },
      { text: 'Solo conducir de noche', index: 2 },
      { text: 'Evitar usar el cinturon', index: 3 }
    ],
    xpReward: 15,
    coinsReward: 8
  },
  {
    id: 'q4',
    category: 'SORIANO',
    difficulty: 1,
    question: 'Cuantos anos de experiencia tiene Soriano Mediadores?',
    options: [
      { text: 'Menos de 10 anos', index: 0 },
      { text: 'Entre 10 y 20 anos', index: 1 },
      { text: 'Mas de 30 anos', index: 2 },
      { text: 'Mas de 50 anos', index: 3 }
    ],
    xpReward: 10,
    coinsReward: 5
  },
  {
    id: 'q5',
    category: 'SEGUROS',
    difficulty: 2,
    question: 'Que es una franquicia en un seguro?',
    options: [
      { text: 'Una tienda de seguros', index: 0 },
      { text: 'La cantidad que el asegurado paga antes de que el seguro cubra', index: 1 },
      { text: 'Un tipo de poliza especial', index: 2 },
      { text: 'El descuento por buen cliente', index: 3 }
    ],
    xpReward: 15,
    coinsReward: 8
  }
]

// Correct answers for mock grading
const CORRECT_ANSWERS: Record<string, number> = {
  q1: 0, q2: 1, q3: 1, q4: 2, q5: 1
}

const EXPLANATIONS: Record<string, string> = {
  q1: 'La prima es el coste que el asegurado paga a la compania de seguros por la cobertura.',
  q2: 'El seguro de hogar tipicamente cubre danos materiales, robos, responsabilidad civil y otros riesgos.',
  q3: 'Respetar los limites de velocidad y mantener distancia de seguridad son claves para prevenir accidentes.',
  q4: 'Soriano Mediadores cuenta con mas de 30 anos de experiencia en el sector asegurador.',
  q5: 'La franquicia es la cantidad que el asegurado debe pagar de su bolsillo antes de que la aseguradora cubra el resto.'
}

// ============================================
// GET - Obtener Quiz del Dia
// ============================================

export async function GET(request: Request): Promise<Response> {
  try {
    const response: DailyQuizResponse = {
      id: 'daily-quiz-demo',
      date: getTodayDateString(),
      questions: MOCK_QUESTIONS,
      alreadyCompleted: false
    }

    return Response.json(response)
  } catch (error) {
    console.error('Daily Quiz GET Error:', error)
    return Response.json(
      { error: 'Error interno del servidor al obtener el quiz.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Enviar Respuestas del Quiz
// ============================================

export async function POST(request: Request): Promise<Response> {
  try {
    let body: SubmitQuizPayload
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { error: 'Cuerpo de la solicitud invalido.' },
        { status: 400 }
      )
    }

    if (!body.answers || !Array.isArray(body.answers) || body.answers.length === 0) {
      return Response.json(
        { error: 'Se requiere un array de respuestas.' },
        { status: 400 }
      )
    }

    const results: AnswerResult[] = []
    let totalXP = 0
    let totalCoins = 0
    let correctCount = 0

    for (const answer of body.answers) {
      const correctIndex = CORRECT_ANSWERS[answer.questionId] ?? 0
      const question = MOCK_QUESTIONS.find(q => q.id === answer.questionId)
      const isCorrect = answer.selectedIndex === correctIndex
      const timeBonus = isCorrect && answer.timeSpent < 10000 ? 3 : 0
      const xpEarned = isCorrect ? (question?.xpReward ?? 10) : 0
      const coinsEarned = isCorrect ? (question?.coinsReward ?? 5) + timeBonus : 0

      if (isCorrect) {
        correctCount++
        totalXP += xpEarned
        totalCoins += coinsEarned
      }

      results.push({
        questionId: answer.questionId,
        correct: isCorrect,
        correctIndex,
        selectedIndex: answer.selectedIndex,
        explanation: EXPLANATIONS[answer.questionId] || null,
        xpEarned,
        coinsEarned,
        timeBonus
      })
    }

    const percentage = MOCK_QUESTIONS.length > 0
      ? Math.round((correctCount / MOCK_QUESTIONS.length) * 100)
      : 0

    const response: SubmitQuizResponse = {
      success: true,
      score: correctCount,
      totalQuestions: MOCK_QUESTIONS.length,
      percentage,
      totalXP,
      totalCoins,
      results,
      streak: 1
    }

    return Response.json(response)
  } catch (error) {
    console.error('Daily Quiz POST Error:', error)
    return Response.json(
      { error: 'Error interno del servidor al procesar el quiz.' },
      { status: 500 }
    )
  }
}
