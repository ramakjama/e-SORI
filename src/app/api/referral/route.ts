import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import prisma from '@/lib/prisma'
import { ReferralStage, WalletType } from '@prisma/client'
import { randomBytes } from 'crypto'

// ============================================
// TYPES
// ============================================

interface ReferralInfo {
  id: string
  code: string
  referredEmail: string | null
  referredPhone: string | null
  referredName: string | null
  stage: ReferralStage
  xpAwarded: number
  coinsAwarded: number
  createdAt: string
  updatedAt: string
}

interface ReferralListResponse {
  referrals: ReferralInfo[]
  stats: {
    total: number
    byStage: Record<ReferralStage, number>
    totalXPEarned: number
    totalCoinsEarned: number
    conversionRate: number // % que llegan a POLICY_PAID
  }
  myCode: string
  shareUrl: string
}

interface CreateReferralPayload {
  email?: string
  phone?: string
  name?: string
}

interface CreateReferralResponse {
  success: boolean
  referral: ReferralInfo
  shareUrl: string
}

interface UpdateReferralPayload {
  code: string
  newStage: ReferralStage
  referredUserId?: string
}

interface UpdateReferralResponse {
  success: boolean
  referral: ReferralInfo
  rewards?: {
    xpAwarded: number
    coinsAwarded: number
  }
}

// ============================================
// CONSTANTS - Recompensas por Stage
// ============================================

const STAGE_REWARDS: Record<ReferralStage, { xp: number; coins: number }> = {
  INVITED: { xp: 0, coins: 0 },
  INSTALL_OPEN: { xp: 10, coins: 5 },
  PROFILE_QUIZ: { xp: 25, coins: 15 },
  REQUESTED_REVIEW: { xp: 50, coins: 30 },
  POLICY_PAID: { xp: 200, coins: 100 }
}

const STAGE_ORDER: ReferralStage[] = [
  'INVITED',
  'INSTALL_OPEN',
  'PROFILE_QUIZ',
  'REQUESTED_REVIEW',
  'POLICY_PAID'
]

// ============================================
// HELPERS
// ============================================

function generateReferralCode(userName?: string | null): string {
  const randomPart = randomBytes(3).toString('hex').toUpperCase()
  const namePart = userName
    ? userName.split(' ')[0].toUpperCase().slice(0, 4)
    : 'SORI'
  return `${namePart}-${randomPart}`
}

function getShareUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://e-sori.soriano.es'
  return `${baseUrl}/r/${code}`
}

async function updateWallet(
  userId: string,
  type: WalletType,
  amount: number,
  transactionType: string,
  description?: string
): Promise<void> {
  if (amount <= 0) return

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

function calculateRewardsForStageChange(
  currentStage: ReferralStage,
  newStage: ReferralStage
): { xp: number; coins: number } {
  const currentIndex = STAGE_ORDER.indexOf(currentStage)
  const newIndex = STAGE_ORDER.indexOf(newStage)

  if (newIndex <= currentIndex) {
    return { xp: 0, coins: 0 }
  }

  // Sumar recompensas de todos los stages intermedios
  let totalXP = 0
  let totalCoins = 0

  for (let i = currentIndex + 1; i <= newIndex; i++) {
    const stage = STAGE_ORDER[i]
    totalXP += STAGE_REWARDS[stage].xp
    totalCoins += STAGE_REWARDS[stage].coins
  }

  return { xp: totalXP, coins: totalCoins }
}

async function getUserReferralCode(userId: string, userName?: string | null): Promise<string> {
  // Buscar si ya tiene un codigo de referido activo
  const existingReferral = await prisma.referralV2.findFirst({
    where: {
      referrerId: userId,
      referredEmail: null,
      referredPhone: null,
      stage: 'INVITED'
    },
    orderBy: { createdAt: 'desc' }
  })

  if (existingReferral) {
    return existingReferral.code
  }

  // Crear uno nuevo
  const code = generateReferralCode(userName)
  await prisma.referralV2.create({
    data: {
      referrerId: userId,
      code
    }
  })

  return code
}

// ============================================
// GET - Lista de Referidos
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<ReferralListResponse | { error: string }>> {
  try {
    // Verificar autenticacion
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado. Inicia sesion para ver tus referidos.' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const userName = session.user.name

    // Obtener todos los referidos del usuario
    const referrals = await prisma.referralV2.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: 'desc' }
    })

    // Calcular estadisticas
    const byStage: Record<ReferralStage, number> = {
      INVITED: 0,
      INSTALL_OPEN: 0,
      PROFILE_QUIZ: 0,
      REQUESTED_REVIEW: 0,
      POLICY_PAID: 0
    }

    let totalXPEarned = 0
    let totalCoinsEarned = 0

    for (const ref of referrals) {
      byStage[ref.stage]++
      totalXPEarned += ref.xpAwarded
      totalCoinsEarned += ref.coinsAwarded
    }

    // Excluir los INVITED vacios del conteo total para conversion
    const withContact = referrals.filter(r => r.referredEmail || r.referredPhone)
    const policyPaid = byStage.POLICY_PAID
    const conversionRate = withContact.length > 0
      ? Math.round((policyPaid / withContact.length) * 100)
      : 0

    // Obtener o crear codigo personal
    const myCode = await getUserReferralCode(userId, userName)
    const shareUrl = getShareUrl(myCode)

    // Formatear referidos para respuesta (excluir los vacios sin datos)
    const referralsResponse: ReferralInfo[] = referrals
      .filter(r => r.referredEmail || r.referredPhone || r.referredName)
      .map(r => ({
        id: r.id,
        code: r.code,
        referredEmail: r.referredEmail,
        referredPhone: r.referredPhone,
        referredName: r.referredName,
        stage: r.stage,
        xpAwarded: r.xpAwarded,
        coinsAwarded: r.coinsAwarded,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }))

    const response: ReferralListResponse = {
      referrals: referralsResponse,
      stats: {
        total: withContact.length,
        byStage,
        totalXPEarned,
        totalCoinsEarned,
        conversionRate
      },
      myCode,
      shareUrl
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Referral GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener referidos.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Crear Nuevo Referido
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<CreateReferralResponse | { error: string }>> {
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
    const userName = session.user.name

    // Parsear body
    let body: CreateReferralPayload
    try {
      body = await request.json()
    } catch {
      // Si no hay body, crear un codigo generico
      body = {}
    }

    // Validar que tenga al menos email o telefono si se proporciona alguno
    const hasContact = body.email || body.phone

    // Validar email si se proporciona
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Email invalido.' },
          { status: 400 }
        )
      }

      // Verificar que no se auto-refiera
      if (body.email.toLowerCase() === session.user.email?.toLowerCase()) {
        return NextResponse.json(
          { error: 'No puedes referirte a ti mismo.' },
          { status: 400 }
        )
      }

      // Verificar que el email no sea de un usuario existente
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email.toLowerCase() }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Este email ya esta registrado en el sistema.' },
          { status: 400 }
        )
      }

      // Verificar que no haya un referido activo con este email
      const existingReferral = await prisma.referralV2.findFirst({
        where: {
          referredEmail: body.email.toLowerCase(),
          stage: { not: 'POLICY_PAID' }
        }
      })

      if (existingReferral) {
        return NextResponse.json(
          { error: 'Ya existe una invitacion activa para este email.' },
          { status: 400 }
        )
      }
    }

    // Generar codigo unico
    const code = generateReferralCode(userName)

    // Crear referido
    const referral = await prisma.referralV2.create({
      data: {
        referrerId: userId,
        code,
        referredEmail: body.email?.toLowerCase() || null,
        referredPhone: body.phone || null,
        referredName: body.name || null,
        stage: 'INVITED'
      }
    })

    const shareUrl = getShareUrl(code)

    const response: CreateReferralResponse = {
      success: true,
      referral: {
        id: referral.id,
        code: referral.code,
        referredEmail: referral.referredEmail,
        referredPhone: referral.referredPhone,
        referredName: referral.referredName,
        stage: referral.stage,
        xpAwarded: referral.xpAwarded,
        coinsAwarded: referral.coinsAwarded,
        createdAt: referral.createdAt.toISOString(),
        updatedAt: referral.updatedAt.toISOString()
      },
      shareUrl
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Referral POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al crear referido.' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT - Avanzar Stage de Referido
// ============================================

export async function PUT(request: NextRequest): Promise<NextResponse<UpdateReferralResponse | { error: string }>> {
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

    // Parsear body
    let body: UpdateReferralPayload
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de la solicitud invalido.' },
        { status: 400 }
      )
    }

    // Validar payload
    if (!body.code) {
      return NextResponse.json(
        { error: 'Se requiere el codigo del referido.' },
        { status: 400 }
      )
    }

    if (!body.newStage || !STAGE_ORDER.includes(body.newStage)) {
      return NextResponse.json(
        { error: 'Stage invalido. Valores permitidos: INSTALL_OPEN, PROFILE_QUIZ, REQUESTED_REVIEW, POLICY_PAID' },
        { status: 400 }
      )
    }

    // Buscar el referido
    const referral = await prisma.referralV2.findUnique({
      where: { code: body.code }
    })

    if (!referral) {
      return NextResponse.json(
        { error: 'Codigo de referido no encontrado.' },
        { status: 404 }
      )
    }

    // Verificar que el usuario sea el dueno del referido O sea admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    const isOwner = referral.referrerId === userId
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'EMPLEADO'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este referido.' },
        { status: 403 }
      )
    }

    // Verificar que el nuevo stage sea posterior al actual
    const currentIndex = STAGE_ORDER.indexOf(referral.stage)
    const newIndex = STAGE_ORDER.indexOf(body.newStage)

    if (newIndex <= currentIndex) {
      return NextResponse.json(
        { error: `No se puede retroceder de ${referral.stage} a ${body.newStage}.` },
        { status: 400 }
      )
    }

    // Calcular recompensas
    const rewards = calculateRewardsForStageChange(referral.stage, body.newStage)

    // Actualizar referido
    const updatedReferral = await prisma.referralV2.update({
      where: { id: referral.id },
      data: {
        stage: body.newStage,
        referredUserId: body.referredUserId || referral.referredUserId,
        xpAwarded: referral.xpAwarded + rewards.xp,
        coinsAwarded: referral.coinsAwarded + rewards.coins
      }
    })

    // Otorgar recompensas al referidor
    if (rewards.xp > 0) {
      await updateWallet(
        referral.referrerId,
        'XP',
        rewards.xp,
        'REFERRAL_BONUS',
        `Referido avanzado a ${body.newStage}`
      )
    }

    if (rewards.coins > 0) {
      await updateWallet(
        referral.referrerId,
        'COINS',
        rewards.coins,
        'REFERRAL_BONUS',
        `Referido avanzado a ${body.newStage}`
      )
    }

    // Si llego a POLICY_PAID, dar bonus adicional de escudo
    if (body.newStage === 'POLICY_PAID') {
      await updateWallet(
        referral.referrerId,
        'SHIELDS',
        1,
        'REFERRAL_CONVERSION',
        'Escudo bonus por conversion de referido'
      )

      // Actualizar puntos legacy del usuario
      await prisma.user.update({
        where: { id: referral.referrerId },
        data: {
          points: { increment: rewards.xp }
        }
      })
    }

    const response: UpdateReferralResponse = {
      success: true,
      referral: {
        id: updatedReferral.id,
        code: updatedReferral.code,
        referredEmail: updatedReferral.referredEmail,
        referredPhone: updatedReferral.referredPhone,
        referredName: updatedReferral.referredName,
        stage: updatedReferral.stage,
        xpAwarded: updatedReferral.xpAwarded,
        coinsAwarded: updatedReferral.coinsAwarded,
        createdAt: updatedReferral.createdAt.toISOString(),
        updatedAt: updatedReferral.updatedAt.toISOString()
      },
      rewards: rewards.xp > 0 || rewards.coins > 0 ? {
        xpAwarded: rewards.xp,
        coinsAwarded: rewards.coins
      } : undefined
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Referral PUT Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar referido.' },
      { status: 500 }
    )
  }
}
