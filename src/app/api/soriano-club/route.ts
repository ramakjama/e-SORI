import { NextRequest, NextResponse } from 'next/server'

// ============================================
// CONSTANTS
// ============================================

type UserLevel = 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO'

const LEVELS: Record<UserLevel, { minPoints: number; maxPoints: number; discount: number; benefits: string[] }> = {
  BRONCE: { minPoints: 0, maxPoints: 499, discount: 0, benefits: ['Acceso al portal', 'Atencion prioritaria'] },
  PLATA: { minPoints: 500, maxPoints: 999, discount: 5, benefits: ['5% descuento renovacion', 'Asistencia 24h', 'Revision anual gratis'] },
  ORO: { minPoints: 1000, maxPoints: 1999, discount: 10, benefits: ['10% descuento renovacion', 'Asistencia premium', 'Perito express', 'Regalo aniversario'] },
  PLATINO: { minPoints: 2000, maxPoints: Infinity, discount: 15, benefits: ['15% descuento renovacion', 'Concierge personal', 'Prioridad siniestros', 'Eventos exclusivos', 'Gestor dedicado'] },
}

const POINT_ACTIONS = {
  PERFIL_COMPLETO: { points: 100, description: 'Completar perfil al 100%' },
  NUEVA_POLIZA: { points: 500, description: 'Contratar nueva poliza' },
  RENOVACION: { points: 200, description: 'Renovar poliza' },
  REFERIDO_REGISTRO: { points: 100, description: 'Referido se registra' },
  REFERIDO_CONVERSION: { points: 250, description: 'Referido contrata poliza' },
  CHAT_SORI: { points: 10, description: 'Usar chat de SORI' },
  REVIEW: { points: 50, description: 'Dejar una resena' },
  LOGIN_DIARIO: { points: 5, description: 'Login diario' },
}

const REWARDS = [
  { id: 'r1', name: 'Descuento 10EUR', description: 'Descuento de 10EUR en tu proxima renovacion', points: 200, category: 'discount', available: true },
  { id: 'r2', name: 'Revision vehiculo gratis', description: 'Revision completa en talleres asociados', points: 500, category: 'service', available: true },
  { id: 'r3', name: 'Asistencia hogar premium', description: '3 servicios de asistencia hogar adicionales', points: 750, category: 'service', available: true },
  { id: 'r4', name: 'Descuento 50EUR', description: 'Descuento de 50EUR en cualquier nueva poliza', points: 1000, category: 'discount', available: true },
  { id: 'r5', name: 'Experiencia gastronomica', description: 'Cena para 2 en restaurante de la Costa Blanca', points: 1500, category: 'experience', available: true, minLevel: 'ORO' },
  { id: 'r6', name: 'Escapada fin de semana', description: 'Hotel 4* para 2 personas (1 noche)', points: 3000, category: 'experience', available: true, minLevel: 'PLATINO' },
]

// ============================================
// GET
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

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

    if (section === 'history') {
      return NextResponse.json({
        history: [
          { id: 'h1', action: 'LOGIN_DIARIO', points: 5, description: 'Login diario', date: new Date().toISOString() },
          { id: 'h2', action: 'CHAT_SORI', points: 10, description: 'Usar chat de SORI', date: new Date().toISOString() },
          { id: 'h3', action: 'RENOVACION', points: 200, description: 'Renovar poliza', date: new Date().toISOString() },
          { id: 'h4', action: 'REFERIDO_REGISTRO', points: 100, description: 'Referido se registra', date: new Date().toISOString() },
          { id: 'h5', action: 'REVIEW', points: 50, description: 'Dejar una resena', date: new Date().toISOString() },
        ],
        totalEarned: 365,
      })
    }

    // Default: full club data
    return NextResponse.json({
      levels: LEVELS,
      currentLevel: 'PLATA' as UserLevel,
      currentPoints: 850,
      levelInfo: LEVELS.PLATA,
      nextLevel: 'ORO' as UserLevel,
      pointsToNextLevel: 150,
      progressPercentage: 70,
      rewards: REWARDS,
      pointHistory: [
        { id: 'h1', action: 'LOGIN_DIARIO', points: 5, description: 'Login diario', date: new Date().toISOString() },
        { id: 'h2', action: 'RENOVACION', points: 200, description: 'Renovar poliza', date: new Date().toISOString() },
      ],
      pointActions: POINT_ACTIONS,
      badges: [
        { id: 'b1', name: 'Primer Login', description: 'Primer acceso al portal', icon: 'star', color: '#FFD700', earnedAt: new Date().toISOString() },
        { id: 'b2', name: 'Quiz Master', description: 'Completar 10 quizzes', icon: 'brain', color: '#4CAF50', earnedAt: new Date().toISOString() },
      ],
      referralsConverted: 1,
    })
  } catch (error) {
    console.error('Soriano Club API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================
// POST
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, rewardId } = body

    if (rewardId) {
      const reward = REWARDS.find((r) => r.id === rewardId)
      if (!reward) {
        return NextResponse.json(
          { error: 'Recompensa no encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Has canjeado "${reward.name}"! Te contactaremos para coordinar la entrega.`,
        pointsDeducted: reward.points,
        newBalance: 850 - reward.points,
      })
    }

    if (action === 'use_referral') {
      return NextResponse.json({
        success: true,
        message: 'Codigo aplicado! Recibiras tus puntos cuando completes tu primera poliza.',
        referralValid: true,
        referrerName: 'Demo Referrer',
      })
    }

    return NextResponse.json(
      { error: 'Accion no valida' },
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
