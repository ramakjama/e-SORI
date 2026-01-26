import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import prisma from '@/lib/prisma'
import { WalletType } from '@prisma/client'

// ============================================
// TYPES
// ============================================

interface SpinWheelPrize {
  id: string
  name: string
  description: string | null
  type: string
  value: number
  color: string | null
  icon: string | null
  probability: number
}

interface SpinResult {
  success: boolean
  prize: SpinWheelPrize
  winningIndex: number
  message: string
  walletUpdated?: {
    type: WalletType
    newBalance: number
    amountAdded: number
  }
}

interface SpinWheelGetResponse {
  canSpin: boolean
  reason?: string
  nextSpinAvailable?: string
  prizes: SpinWheelPrize[]
  spinsToday: number
  maxSpinsPerDay: number
  spinCost: {
    type: WalletType
    amount: number
  }
  freeSpinAvailable: boolean
}

// ============================================
// CONSTANTS
// ============================================

const MAX_SPINS_PER_DAY = 3
const SPIN_COST = { type: 'COINS' as WalletType, amount: 50 }
const FREE_SPIN_AFTER_QUIZ = true

// Premios por defecto si no hay en la base de datos
const DEFAULT_PRIZES: Omit<SpinWheelPrize, 'id'>[] = [
  { name: '10 XP', description: 'Bonus de experiencia', type: 'XP', value: 10, color: '#4CAF50', icon: 'star', probability: 0.25 },
  { name: '25 XP', description: 'Bonus de experiencia', type: 'XP', value: 25, color: '#8BC34A', icon: 'star', probability: 0.15 },
  { name: '50 XP', description: 'Gran bonus de experiencia', type: 'XP', value: 50, color: '#CDDC39', icon: 'stars', probability: 0.08 },
  { name: '10 Monedas', description: 'Monedas para la tienda', type: 'COINS', value: 10, color: '#FFC107', icon: 'coin', probability: 0.20 },
  { name: '25 Monedas', description: 'Monedas para la tienda', type: 'COINS', value: 25, color: '#FF9800', icon: 'coin', probability: 0.12 },
  { name: '50 Monedas', description: 'Muchas monedas', type: 'COINS', value: 50, color: '#FF5722', icon: 'coins', probability: 0.05 },
  { name: '1 Escudo', description: 'Protege tu racha', type: 'SHIELDS', value: 1, color: '#2196F3', icon: 'shield', probability: 0.10 },
  { name: 'Suerte!', description: 'Sigue intentando', type: 'NOTHING', value: 0, color: '#9E9E9E', icon: 'refresh', probability: 0.05 }
]

// ============================================
// HELPERS
// ============================================

function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

function getEndOfDay(date: Date = new Date()): Date {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

async function ensurePrizesExist(): Promise<SpinWheelPrize[]> {
  const existingPrizes = await prisma.spinWheelPrize.findMany({
    where: { isActive: true }
  })

  if (existingPrizes.length > 0) {
    return existingPrizes.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      type: p.type,
      value: p.value,
      color: p.color,
      icon: p.icon,
      probability: p.probability
    }))
  }

  // Crear premios por defecto
  const createdPrizes = await prisma.$transaction(
    DEFAULT_PRIZES.map(prize =>
      prisma.spinWheelPrize.create({
        data: prize
      })
    )
  )

  return createdPrizes.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    type: p.type,
    value: p.value,
    color: p.color,
    icon: p.icon,
    probability: p.probability
  }))
}

function selectPrize(prizes: SpinWheelPrize[]): { prize: SpinWheelPrize; index: number } {
  // Normalizar probabilidades
  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0)
  const normalizedPrizes = prizes.map(p => ({
    ...p,
    probability: p.probability / totalProbability
  }))

  // Seleccionar premio basado en probabilidad ponderada
  const random = Math.random()
  let cumulative = 0

  for (let i = 0; i < normalizedPrizes.length; i++) {
    cumulative += normalizedPrizes[i].probability
    if (random <= cumulative) {
      return { prize: prizes[i], index: i }
    }
  }

  // Fallback al ultimo premio
  return { prize: prizes[prizes.length - 1], index: prizes.length - 1 }
}

async function getUserSpinsToday(userId: string): Promise<number> {
  const startOfDay = getStartOfDay()
  const endOfDay = getEndOfDay()

  return prisma.spinWheelSpin.count({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  })
}

async function hasCompletedQuizToday(userId: string): Promise<boolean> {
  const startOfDay = getStartOfDay()

  const dailyQuiz = await prisma.dailyQuiz.findUnique({
    where: { date: startOfDay }
  })

  if (!dailyQuiz) return false

  const attempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_dailyQuizId: {
        userId,
        dailyQuizId: dailyQuiz.id
      }
    }
  })

  return !!attempt?.completedAt
}

async function hasUsedFreeSpinToday(userId: string): Promise<boolean> {
  const startOfDay = getStartOfDay()
  const endOfDay = getEndOfDay()

  // Buscar un spin gratis (el primero del dia despues de completar quiz)
  const spins = await prisma.spinWheelSpin.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    orderBy: { createdAt: 'asc' },
    take: 1
  })

  // Si hay al menos un spin y el usuario completo el quiz, el primero fue gratis
  return spins.length > 0
}

async function updateWallet(
  userId: string,
  type: WalletType,
  amount: number,
  transactionType: string,
  description?: string
): Promise<number> {
  if (amount === 0) return 0

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
  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: { increment: amount } }
  })

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      amount,
      type: transactionType,
      description
    }
  })

  return updatedWallet.balance
}

// ============================================
// GET - Informacion de la Ruleta
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<SpinWheelGetResponse | { error: string }>> {
  try {
    // Verificar autenticacion
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado. Inicia sesion para girar la ruleta.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Obtener premios
    const prizes = await ensurePrizesExist()

    // Obtener spins de hoy
    const spinsToday = await getUserSpinsToday(userId)

    // Verificar si completo el quiz hoy (spin gratis)
    const completedQuiz = FREE_SPIN_AFTER_QUIZ && await hasCompletedQuizToday(userId)
    const usedFreeSpin = await hasUsedFreeSpinToday(userId)
    const freeSpinAvailable = completedQuiz && !usedFreeSpin

    // Determinar si puede girar
    let canSpin = spinsToday < MAX_SPINS_PER_DAY
    let reason: string | undefined

    if (!canSpin) {
      reason = 'Has alcanzado el limite de giros diarios.'
    }

    // Si tiene spin gratis disponible, siempre puede
    if (freeSpinAvailable && !usedFreeSpin) {
      canSpin = true
      reason = undefined
    }

    // Calcular proxima disponibilidad si no puede girar
    let nextSpinAvailable: string | undefined
    if (!canSpin) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      nextSpinAvailable = tomorrow.toISOString()
    }

    const response: SpinWheelGetResponse = {
      canSpin,
      reason,
      nextSpinAvailable,
      prizes,
      spinsToday,
      maxSpinsPerDay: MAX_SPINS_PER_DAY,
      spinCost: SPIN_COST,
      freeSpinAvailable
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('SpinWheel GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Girar la Ruleta
// ============================================

interface SpinWheelPayload {
  useFreeSpins?: boolean
}

export async function POST(request: NextRequest): Promise<NextResponse<SpinResult | { error: string }>> {
  try {
    // Verificar autenticacion
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parsear body (opcional)
    let body: SpinWheelPayload = {}
    try {
      body = await request.json()
    } catch {
      // Body opcional
    }

    // Verificar limite diario
    const spinsToday = await getUserSpinsToday(userId)
    if (spinsToday >= MAX_SPINS_PER_DAY) {
      return NextResponse.json(
        { error: 'Has alcanzado el limite de giros diarios. Vuelve manana.' },
        { status: 400 }
      )
    }

    // Verificar si tiene spin gratis
    const completedQuiz = FREE_SPIN_AFTER_QUIZ && await hasCompletedQuizToday(userId)
    const usedFreeSpin = await hasUsedFreeSpinToday(userId)
    const hasFreeSpinNow = completedQuiz && !usedFreeSpin

    // Si no tiene spin gratis, debe pagar con monedas
    if (!hasFreeSpinNow) {
      const coinsWallet = await prisma.wallet.findUnique({
        where: { userId_type: { userId, type: 'COINS' } }
      })

      if (!coinsWallet || coinsWallet.balance < SPIN_COST.amount) {
        return NextResponse.json(
          { error: `Necesitas ${SPIN_COST.amount} monedas para girar. Completa el quiz diario para un giro gratis.` },
          { status: 400 }
        )
      }

      // Descontar monedas
      await updateWallet(userId, 'COINS', -SPIN_COST.amount, 'SPIN_WHEEL_COST', 'Giro de ruleta')
    }

    // Obtener premios y seleccionar ganador
    const prizes = await ensurePrizesExist()
    const { prize, index } = selectPrize(prizes)

    // Registrar el spin
    await prisma.spinWheelSpin.create({
      data: {
        userId,
        prizeId: prize.id,
        claimed: prize.type !== 'PHYSICAL', // Auto-claim para premios virtuales
        claimedAt: prize.type !== 'PHYSICAL' ? new Date() : null
      }
    })

    // Entregar premio si es virtual
    let walletUpdated: SpinResult['walletUpdated']

    if (prize.type === 'XP' && prize.value > 0) {
      const newBalance = await updateWallet(userId, 'XP', prize.value, 'SPIN_WHEEL_WIN', `Premio ruleta: ${prize.name}`)
      walletUpdated = { type: 'XP', newBalance, amountAdded: prize.value }

      // Actualizar puntos legacy
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: prize.value } }
      })
    } else if (prize.type === 'COINS' && prize.value > 0) {
      const newBalance = await updateWallet(userId, 'COINS', prize.value, 'SPIN_WHEEL_WIN', `Premio ruleta: ${prize.name}`)
      walletUpdated = { type: 'COINS', newBalance, amountAdded: prize.value }
    } else if (prize.type === 'SHIELDS' && prize.value > 0) {
      const newBalance = await updateWallet(userId, 'SHIELDS', prize.value, 'SPIN_WHEEL_WIN', `Premio ruleta: ${prize.name}`)
      walletUpdated = { type: 'SHIELDS', newBalance, amountAdded: prize.value }
    }

    // Generar mensaje
    let message: string
    if (prize.type === 'NOTHING' || prize.value === 0) {
      message = 'No has ganado esta vez. Sigue intentando!'
    } else if (prize.type === 'PHYSICAL') {
      message = `Has ganado ${prize.name}! Te contactaremos pronto para la entrega.`
    } else {
      message = `Felicidades! Has ganado ${prize.name}!`
    }

    const response: SpinResult = {
      success: true,
      prize,
      winningIndex: index,
      message,
      walletUpdated
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('SpinWheel POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al girar la ruleta.' },
      { status: 500 }
    )
  }
}
