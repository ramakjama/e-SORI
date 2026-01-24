import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { UserLevel } from '@prisma/client'

// Soriano Club configuration
const LEVELS = {
  BRONCE: { minPoints: 0, maxPoints: 499, discount: 0, benefits: ['Acceso al portal', 'Atención prioritaria'] },
  PLATA: { minPoints: 500, maxPoints: 999, discount: 5, benefits: ['5% descuento renovación', 'Asistencia 24h', 'Revisión anual gratis'] },
  ORO: { minPoints: 1000, maxPoints: 1999, discount: 10, benefits: ['10% descuento renovación', 'Asistencia premium', 'Perito express', 'Regalo aniversario'] },
  PLATINO: { minPoints: 2000, maxPoints: Infinity, discount: 15, benefits: ['15% descuento renovación', 'Concierge personal', 'Prioridad siniestros', 'Eventos exclusivos', 'Gestor dedicado'] },
}

const POINT_ACTIONS = {
  PERFIL_COMPLETO: { points: 100, description: 'Completar perfil al 100%' },
  NUEVA_POLIZA: { points: 500, description: 'Contratar nueva póliza' },
  RENOVACION: { points: 200, description: 'Renovar póliza' },
  REFERIDO_REGISTRO: { points: 100, description: 'Referido se registra' },
  REFERIDO_CONVERSION: { points: 250, description: 'Referido contrata póliza' },
  CHAT_SORI: { points: 10, description: 'Usar chat de SORI' },
  REVIEW: { points: 50, description: 'Dejar una reseña' },
  LOGIN_DIARIO: { points: 5, description: 'Login diario' },
}

const REWARDS = [
  { id: 'r1', name: 'Descuento 10€', description: 'Descuento de 10€ en tu próxima renovación', points: 200, category: 'discount', available: true },
  { id: 'r2', name: 'Revisión vehículo gratis', description: 'Revisión completa en talleres asociados', points: 500, category: 'service', available: true },
  { id: 'r3', name: 'Asistencia hogar premium', description: '3 servicios de asistencia hogar adicionales', points: 750, category: 'service', available: true },
  { id: 'r4', name: 'Descuento 50€', description: 'Descuento de 50€ en cualquier nueva póliza', points: 1000, category: 'discount', available: true },
  { id: 'r5', name: 'Experiencia gastronómica', description: 'Cena para 2 en restaurante de la Costa Blanca', points: 1500, category: 'experience', available: true, minLevel: 'ORO' },
  { id: 'r6', name: 'Escapada fin de semana', description: 'Hotel 4* para 2 personas (1 noche)', points: 3000, category: 'experience', available: true, minLevel: 'PLATINO' },
]

function getNextLevel(currentLevel: UserLevel): UserLevel | null {
  const levels: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']
  const currentIndex = levels.indexOf(currentLevel)
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null
}

function getPointsToNextLevel(currentLevel: UserLevel, currentPoints: number): number {
  const nextLevel = getNextLevel(currentLevel)
  if (!nextLevel) return 0
  const nextLevelConfig = LEVELS[nextLevel]
  return Math.max(0, nextLevelConfig.minPoints - currentPoints)
}

function getProgressPercentage(currentLevel: UserLevel, currentPoints: number): number {
  const levelConfig = LEVELS[currentLevel]
  const nextLevel = getNextLevel(currentLevel)
  if (!nextLevel) return 100
  const nextLevelConfig = LEVELS[nextLevel]
  const pointsInCurrentLevel = currentPoints - levelConfig.minPoints
  const pointsNeededForNextLevel = nextLevelConfig.minPoints - levelConfig.minPoints
  return Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const userId = searchParams.get('userId')

    if (section === 'rewards') {
      return NextResponse.json({
        rewards: REWARDS,
        categories: ['discount', 'service', 'experience'],
      })
    }

    if (section === 'actions') {
      return NextResponse.json({
        actions: POINT_ACTIONS,
      })
    }

    if (section === 'history' && userId) {
      const history = await prisma.pointsHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })

      const totalEarned = history.reduce((sum, h) => sum + h.points, 0)

      return NextResponse.json({
        history: history.map(h => ({
          id: h.id,
          action: h.action,
          points: h.points,
          description: h.description,
          date: h.createdAt,
        })),
        totalEarned,
      })
    }

    if (!userId) {
      return NextResponse.json({
        levels: LEVELS,
        rewards: REWARDS,
        pointActions: POINT_ACTIONS,
      })
    }

    // Get user with club data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pointsHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        badges: {
          include: { badge: true },
        },
        referralsMade: {
          where: { status: 'CONVERTIDO' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      levels: LEVELS,
      currentLevel: user.level,
      currentPoints: user.points,
      levelInfo: LEVELS[user.level],
      nextLevel: getNextLevel(user.level),
      pointsToNextLevel: getPointsToNextLevel(user.level, user.points),
      progressPercentage: getProgressPercentage(user.level, user.points),
      rewards: REWARDS,
      pointHistory: user.pointsHistory.map(h => ({
        id: h.id,
        action: h.action,
        points: h.points,
        description: h.description,
        date: h.createdAt,
      })),
      pointActions: POINT_ACTIONS,
      badges: user.badges.map(ub => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        color: ub.badge.color,
        earnedAt: ub.earnedAt,
      })),
      referralsConverted: user.referralsMade.length,
    })
  } catch (error) {
    console.error('Soriano Club API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, rewardId, userId, code } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Redeem a reward
    if (rewardId) {
      const reward = REWARDS.find((r) => r.id === rewardId)
      if (!reward) {
        return NextResponse.json(
          { error: 'Recompensa no encontrada' },
          { status: 404 }
        )
      }

      if (user.points < reward.points) {
        return NextResponse.json(
          { error: 'Puntos insuficientes' },
          { status: 400 }
        )
      }

      // Deduct points
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { points: { decrement: reward.points } },
        }),
        prisma.pointsHistory.create({
          data: {
            userId,
            action: 'REVIEW', // Using as generic point deduction
            points: -reward.points,
            description: `Canje: ${reward.name}`,
          },
        }),
      ])

      return NextResponse.json({
        success: true,
        message: `¡Has canjeado "${reward.name}"! Te contactaremos para coordinar la entrega.`,
        pointsDeducted: reward.points,
        newBalance: user.points - reward.points,
      })
    }

    // Use referral code
    if (action === 'use_referral' && code) {
      const referral = await prisma.referral.findUnique({
        where: { code },
        include: { referrer: true },
      })

      if (!referral) {
        return NextResponse.json(
          { error: 'Código de referido no válido' },
          { status: 400 }
        )
      }

      if (referral.status !== 'PENDIENTE') {
        return NextResponse.json(
          { error: 'Este código ya ha sido utilizado' },
          { status: 400 }
        )
      }

      // Update referral status
      await prisma.referral.update({
        where: { code },
        data: {
          status: 'REGISTRADO',
          referredId: userId,
        },
      })

      return NextResponse.json({
        success: true,
        message: '¡Código aplicado! Recibirás tus puntos cuando completes tu primera póliza.',
        referralValid: true,
        referrerName: referral.referrer.name,
      })
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Soriano Club POST API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
