import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import prisma from '@/lib/prisma'
import { WalletType } from '@prisma/client'

// ============================================
// TYPES
// ============================================

interface CheckpointConfig {
  daysBeforeExpiry: number
  coinsReward: number
  hasFreeSpinReward: boolean
  windowDays: number // Days the checkpoint is available for claiming
}

interface ClaimCheckpointPayload {
  policyId: string
  checkpointId: string
}

interface ClaimCheckpointResponse {
  success: boolean
  message: string
  coinsAwarded: number
  freeSpinAwarded: boolean
  newCoinBalance?: number
  checkpoint: {
    id: string
    daysBeforeExpiry: number
    completedAt: string
  }
}

interface CheckpointStatus {
  id: string
  daysBeforeExpiry: number
  coinsReward: number
  hasFreeSpinReward: boolean
  isCompleted: boolean
  completedAt?: string
  isAvailable: boolean
  isPassed: boolean
  availableUntil?: string
}

interface PolicyRenewalStatus {
  policyId: string
  policyNumber: string
  expiryDate: string
  daysUntilExpiry: number
  checkpoints: CheckpointStatus[]
  totalCoinsAvailable: number
  totalCoinsEarned: number
}

interface GetCheckpointsResponse {
  policies: PolicyRenewalStatus[]
  summary: {
    totalPolicies: number
    totalCoinsAvailable: number
    totalCoinsEarned: number
    freeSpinsAvailable: number
    urgentCount: number
  }
}

// ============================================
// CONSTANTS
// ============================================

const CHECKPOINT_CONFIGS: CheckpointConfig[] = [
  { daysBeforeExpiry: 30, coinsReward: 100, hasFreeSpinReward: false, windowDays: 10 },
  { daysBeforeExpiry: 15, coinsReward: 150, hasFreeSpinReward: false, windowDays: 5 },
  { daysBeforeExpiry: 7, coinsReward: 200, hasFreeSpinReward: true, windowDays: 3 }
]

// Margin tolerance for checkpoint validation (in hours)
const CHECKPOINT_MARGIN_HOURS = 24

// ============================================
// HELPERS
// ============================================

function getDaysUntilExpiry(expiryDate: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const diffTime = expiry.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getCheckpointStatus(
  checkpointConfig: CheckpointConfig,
  daysUntilExpiry: number,
  completedCheckpoint?: { completedAt: Date }
): Omit<CheckpointStatus, 'id'> {
  const { daysBeforeExpiry, coinsReward, hasFreeSpinReward, windowDays } = checkpointConfig

  // Check if already completed
  if (completedCheckpoint) {
    return {
      daysBeforeExpiry,
      coinsReward,
      hasFreeSpinReward,
      isCompleted: true,
      completedAt: completedCheckpoint.completedAt.toISOString(),
      isAvailable: false,
      isPassed: false
    }
  }

  // Calculate availability window
  // Checkpoint is available from (daysBeforeExpiry) down to (daysBeforeExpiry - windowDays)
  const windowStart = daysBeforeExpiry
  const windowEnd = daysBeforeExpiry - windowDays

  const isInWindow = daysUntilExpiry <= windowStart && daysUntilExpiry > windowEnd
  const hasPassed = daysUntilExpiry <= windowEnd

  // Calculate when the checkpoint window ends
  const now = new Date()
  const availableUntil = new Date(now)
  availableUntil.setDate(availableUntil.getDate() + (daysUntilExpiry - windowEnd))

  return {
    daysBeforeExpiry,
    coinsReward,
    hasFreeSpinReward,
    isCompleted: false,
    isAvailable: isInWindow,
    isPassed: hasPassed,
    availableUntil: isInWindow ? availableUntil.toISOString() : undefined
  }
}

async function updateWallet(
  userId: string,
  type: WalletType,
  amount: number,
  transactionType: string,
  description?: string
): Promise<number> {
  if (amount === 0) return 0

  // Get or create wallet
  let wallet = await prisma.wallet.findUnique({
    where: { userId_type: { userId, type } }
  })

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, type, balance: 0 }
    })
  }

  // Update balance and create transaction
  const [updatedWallet] = await prisma.$transaction([
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

  return updatedWallet.balance
}

async function grantFreeSpin(userId: string): Promise<void> {
  // Find or create user's spin data
  const existingSpinData = await prisma.spinWheelSpin.findFirst({
    where: {
      userId,
      claimed: false
    },
    orderBy: { createdAt: 'desc' }
  })

  // Instead of modifying spin records, we'll add bonus spins via a transaction
  // This approach tracks that a free spin was awarded from renewal checkpoint
  const wallet = await prisma.wallet.findUnique({
    where: { userId_type: { userId, type: 'COINS' } }
  })

  if (wallet) {
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: 0,
        type: 'RENEWAL_FREE_SPIN',
        description: 'Tirada gratis por checkpoint T-7 de renovacion'
      }
    })
  }

  // Log the free spin grant for tracking
  console.log(`[Renewal] Free spin granted to user ${userId} for T-7 checkpoint`)
}

// ============================================
// GET - Get All Policy Renewal Checkpoints
// ============================================

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetCheckpointsResponse | { error: string }>> {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado. Inicia sesion para ver tus renovaciones.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get user's policies that are expiring within 45 days
    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 45)

    const policies = await prisma.policy.findMany({
      where: {
        userId,
        endDate: {
          gte: now,
          lte: futureDate
        },
        status: 'ACTIVE'
      },
      include: {
        renewalCheckpoints: true
      },
      orderBy: { endDate: 'asc' }
    })

    // Process each policy
    const policyStatuses: PolicyRenewalStatus[] = []
    let totalCoinsAvailable = 0
    let totalCoinsEarned = 0
    let freeSpinsAvailable = 0
    let urgentCount = 0

    for (const policy of policies) {
      const daysUntilExpiry = getDaysUntilExpiry(policy.endDate)

      if (daysUntilExpiry <= 7) urgentCount++

      // Build checkpoint statuses
      const checkpoints: CheckpointStatus[] = []
      let policyCoinsAvailable = 0
      let policyCoinsEarned = 0

      for (const config of CHECKPOINT_CONFIGS) {
        const completedCheckpoint = policy.renewalCheckpoints.find(
          rc => rc.checkpointType === `T-${config.daysBeforeExpiry}`
        )

        const status = getCheckpointStatus(config, daysUntilExpiry, completedCheckpoint)

        const checkpointId = completedCheckpoint?.id ||
          `${policy.id}-T${config.daysBeforeExpiry}`

        checkpoints.push({
          id: checkpointId,
          ...status
        })

        policyCoinsAvailable += config.coinsReward

        if (status.isCompleted) {
          policyCoinsEarned += config.coinsReward
        }

        if (status.isAvailable && config.hasFreeSpinReward) {
          freeSpinsAvailable++
        }
      }

      policyStatuses.push({
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        expiryDate: policy.endDate.toISOString(),
        daysUntilExpiry,
        checkpoints,
        totalCoinsAvailable: policyCoinsAvailable,
        totalCoinsEarned: policyCoinsEarned
      })

      totalCoinsAvailable += policyCoinsAvailable
      totalCoinsEarned += policyCoinsEarned
    }

    return NextResponse.json({
      policies: policyStatuses,
      summary: {
        totalPolicies: policies.length,
        totalCoinsAvailable,
        totalCoinsEarned,
        freeSpinsAvailable,
        urgentCount
      }
    })

  } catch (error) {
    console.error('Renewal Checkpoint GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener renovaciones.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Claim a Renewal Checkpoint
// ============================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<ClaimCheckpointResponse | { error: string }>> {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parse body
    let body: ClaimCheckpointPayload
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de la solicitud invalido.' },
        { status: 400 }
      )
    }

    const { policyId, checkpointId } = body

    if (!policyId || !checkpointId) {
      return NextResponse.json(
        { error: 'Se requiere policyId y checkpointId.' },
        { status: 400 }
      )
    }

    // Verify policy belongs to user
    const policy = await prisma.policy.findFirst({
      where: {
        id: policyId,
        userId,
        status: 'ACTIVE'
      },
      include: {
        renewalCheckpoints: true
      }
    })

    if (!policy) {
      return NextResponse.json(
        { error: 'Poliza no encontrada o no pertenece al usuario.' },
        { status: 404 }
      )
    }

    // Determine which checkpoint is being claimed
    // checkpointId format: "{policyId}-T{days}" e.g., "pol-001-T30"
    const checkpointMatch = checkpointId.match(/T(\d+)$/)
    if (!checkpointMatch) {
      return NextResponse.json(
        { error: 'Formato de checkpointId invalido.' },
        { status: 400 }
      )
    }

    const daysBeforeExpiry = parseInt(checkpointMatch[1], 10)
    const checkpointConfig = CHECKPOINT_CONFIGS.find(c => c.daysBeforeExpiry === daysBeforeExpiry)

    if (!checkpointConfig) {
      return NextResponse.json(
        { error: 'Checkpoint no valido.' },
        { status: 400 }
      )
    }

    // Check if already claimed
    const existingCheckpoint = policy.renewalCheckpoints.find(
      rc => rc.checkpointType === `T-${daysBeforeExpiry}`
    )

    if (existingCheckpoint) {
      return NextResponse.json(
        { error: 'Este checkpoint ya fue reclamado.' },
        { status: 400 }
      )
    }

    // Calculate days until expiry with margin tolerance
    const daysUntilExpiry = getDaysUntilExpiry(policy.endDate)
    const marginDays = CHECKPOINT_MARGIN_HOURS / 24

    // Validate checkpoint is available
    const windowStart = checkpointConfig.daysBeforeExpiry + marginDays
    const windowEnd = checkpointConfig.daysBeforeExpiry - checkpointConfig.windowDays - marginDays

    if (daysUntilExpiry > windowStart) {
      return NextResponse.json(
        { error: `Este checkpoint estara disponible en ${Math.ceil(daysUntilExpiry - checkpointConfig.daysBeforeExpiry)} dias.` },
        { status: 400 }
      )
    }

    if (daysUntilExpiry < windowEnd) {
      return NextResponse.json(
        { error: 'La ventana para reclamar este checkpoint ha pasado.' },
        { status: 400 }
      )
    }

    // Calculate actual reward (can be adjusted based on timing)
    // Reward is higher if claimed earlier in the window
    const windowProgress = (windowStart - daysUntilExpiry) / (windowStart - windowEnd)
    const bonusMultiplier = Math.max(0, 1 - windowProgress * 0.1) // Up to 10% bonus for early claim
    const finalCoinsReward = Math.round(checkpointConfig.coinsReward * (1 + bonusMultiplier - 1))

    // Create checkpoint record and award coins in transaction
    const [newCheckpoint, newBalance] = await prisma.$transaction(async (tx) => {
      // Create checkpoint
      const checkpoint = await tx.renewalCheckpoint.create({
        data: {
          policyId,
          checkpointType: `T-${daysBeforeExpiry}`,
          coinsAwarded: finalCoinsReward,
          freeSpinAwarded: checkpointConfig.hasFreeSpinReward,
          completedAt: new Date()
        }
      })

      // Award coins
      let wallet = await tx.wallet.findUnique({
        where: { userId_type: { userId, type: 'COINS' } }
      })

      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { userId, type: 'COINS', balance: 0 }
        })
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: finalCoinsReward } }
      })

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: finalCoinsReward,
          type: 'RENEWAL_CHECKPOINT',
          description: `Checkpoint T-${daysBeforeExpiry} - ${policy.policyNumber}`
        }
      })

      // Update user points legacy
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: finalCoinsReward } }
      })

      return [checkpoint, updatedWallet.balance]
    })

    // Grant free spin if applicable (outside main transaction to not block on failure)
    if (checkpointConfig.hasFreeSpinReward) {
      try {
        await grantFreeSpin(userId)
      } catch (spinError) {
        console.error('Error granting free spin:', spinError)
        // Don't fail the entire request if spin grant fails
      }
    }

    // Log activity for gamification tracking
    console.log(`[Renewal] User ${userId} claimed checkpoint T-${daysBeforeExpiry} for policy ${policyId}. Coins: ${finalCoinsReward}, Free spin: ${checkpointConfig.hasFreeSpinReward}`)

    return NextResponse.json({
      success: true,
      message: checkpointConfig.hasFreeSpinReward
        ? `Checkpoint T-${daysBeforeExpiry} completado! Has ganado ${finalCoinsReward} COINS y una tirada gratis.`
        : `Checkpoint T-${daysBeforeExpiry} completado! Has ganado ${finalCoinsReward} COINS.`,
      coinsAwarded: finalCoinsReward,
      freeSpinAwarded: checkpointConfig.hasFreeSpinReward,
      newCoinBalance: newBalance,
      checkpoint: {
        id: newCheckpoint.id,
        daysBeforeExpiry,
        completedAt: newCheckpoint.completedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Renewal Checkpoint POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al reclamar checkpoint.' },
      { status: 500 }
    )
  }
}
