import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import prisma from '@/lib/prisma'
import { WalletType } from '@prisma/client'

// ============================================
// TYPES
// ============================================

interface WalletInfo {
  type: WalletType
  balance: number
  lastUpdated: string
}

interface TransactionInfo {
  id: string
  walletType: WalletType
  amount: number
  type: string
  description: string | null
  createdAt: string
}

interface WalletResponse {
  wallets: {
    XP: WalletInfo
    COINS: WalletInfo
    SHIELDS: WalletInfo
  }
  totalValue: number // Valor equivalente en puntos
  recentTransactions: TransactionInfo[]
  stats: {
    totalXPEarned: number
    totalCoinsEarned: number
    totalShieldsEarned: number
    currentStreak: number
    longestStreak: number
  }
}

// ============================================
// HELPERS
// ============================================

async function ensureWalletsExist(userId: string): Promise<void> {
  const walletTypes: WalletType[] = ['XP', 'COINS', 'SHIELDS']

  for (const type of walletTypes) {
    await prisma.wallet.upsert({
      where: {
        userId_type: { userId, type }
      },
      update: {},
      create: {
        userId,
        type,
        balance: 0
      }
    })
  }
}

async function getWalletStats(userId: string): Promise<{
  totalXPEarned: number
  totalCoinsEarned: number
  totalShieldsEarned: number
}> {
  // Obtener todas las transacciones positivas por tipo de wallet
  const wallets = await prisma.wallet.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          amount: { gt: 0 }
        }
      }
    }
  })

  let totalXPEarned = 0
  let totalCoinsEarned = 0
  let totalShieldsEarned = 0

  for (const wallet of wallets) {
    const total = wallet.transactions.reduce((sum, t) => sum + t.amount, 0)

    switch (wallet.type) {
      case 'XP':
        totalXPEarned = total
        break
      case 'COINS':
        totalCoinsEarned = total
        break
      case 'SHIELDS':
        totalShieldsEarned = total
        break
    }
  }

  return { totalXPEarned, totalCoinsEarned, totalShieldsEarned }
}

async function getStreakInfo(userId: string): Promise<{
  currentStreak: number
  longestStreak: number
}> {
  const streak = await prisma.userStreak.findUnique({
    where: { userId }
  })

  if (!streak) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // Verificar si la racha sigue activa
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (streak.lastActivityDate) {
    const lastActivity = new Date(streak.lastActivityDate)
    lastActivity.setHours(0, 0, 0, 0)

    // Si la ultima actividad fue antes de ayer, la racha se rompio
    // A menos que tenga un escudo activo
    if (lastActivity < yesterday && (!streak.freezeUntil || streak.freezeUntil < today)) {
      // Racha rota - actualizar en segundo plano
      prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: 0,
          streakStartDate: null
        }
      }).catch(console.error)

      return { currentStreak: 0, longestStreak: streak.longestStreak }
    }
  }

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak
  }
}

// ============================================
// GET - Obtener Estado de Wallets
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<WalletResponse | { error: string }>> {
  try {
    // Verificar autenticacion
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado. Inicia sesion para ver tu wallet.' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Asegurar que existan las wallets
    await ensureWalletsExist(userId)

    // Obtener wallets con transacciones recientes
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    // Estructurar respuesta de wallets
    const walletsMap: Record<WalletType, WalletInfo> = {
      XP: { type: 'XP', balance: 0, lastUpdated: new Date().toISOString() },
      COINS: { type: 'COINS', balance: 0, lastUpdated: new Date().toISOString() },
      SHIELDS: { type: 'SHIELDS', balance: 0, lastUpdated: new Date().toISOString() }
    }

    const allTransactions: TransactionInfo[] = []

    for (const wallet of wallets) {
      walletsMap[wallet.type] = {
        type: wallet.type,
        balance: wallet.balance,
        lastUpdated: wallet.updatedAt.toISOString()
      }

      for (const tx of wallet.transactions) {
        allTransactions.push({
          id: tx.id,
          walletType: wallet.type,
          amount: tx.amount,
          type: tx.type,
          description: tx.description,
          createdAt: tx.createdAt.toISOString()
        })
      }
    }

    // Ordenar transacciones por fecha
    allTransactions.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Calcular valor total (XP + COINS * 2)
    const totalValue = walletsMap.XP.balance + (walletsMap.COINS.balance * 2)

    // Obtener estadisticas
    const stats = await getWalletStats(userId)
    const streakInfo = await getStreakInfo(userId)

    const response: WalletResponse = {
      wallets: walletsMap,
      totalValue,
      recentTransactions: allTransactions.slice(0, 20),
      stats: {
        ...stats,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Wallet GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener la wallet.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Operaciones de Wallet (uso interno/admin)
// ============================================

interface WalletOperationPayload {
  operation: 'USE_SHIELD' | 'TRANSFER' | 'REDEEM'
  amount?: number
  metadata?: Record<string, unknown>
}

interface WalletOperationResponse {
  success: boolean
  message: string
  newBalance?: number
  transaction?: TransactionInfo
}

export async function POST(request: NextRequest): Promise<NextResponse<WalletOperationResponse | { error: string }>> {
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
    let body: WalletOperationPayload
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de la solicitud invalido.' },
        { status: 400 }
      )
    }

    if (!body.operation) {
      return NextResponse.json(
        { error: 'Se requiere especificar una operacion.' },
        { status: 400 }
      )
    }

    // Asegurar que existan las wallets
    await ensureWalletsExist(userId)

    switch (body.operation) {
      case 'USE_SHIELD': {
        // Usar un escudo para proteger la racha
        const shieldWallet = await prisma.wallet.findUnique({
          where: { userId_type: { userId, type: 'SHIELDS' } }
        })

        if (!shieldWallet || shieldWallet.balance < 1) {
          return NextResponse.json(
            { error: 'No tienes escudos disponibles.' },
            { status: 400 }
          )
        }

        // Verificar que no tenga ya un escudo activo
        const streak = await prisma.userStreak.findUnique({
          where: { userId }
        })

        const now = new Date()
        if (streak?.freezeUntil && streak.freezeUntil > now) {
          return NextResponse.json(
            { error: 'Ya tienes un escudo activo.' },
            { status: 400 }
          )
        }

        // Usar escudo
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(23, 59, 59, 999)

        await prisma.$transaction([
          prisma.wallet.update({
            where: { id: shieldWallet.id },
            data: { balance: { decrement: 1 } }
          }),
          prisma.walletTransaction.create({
            data: {
              walletId: shieldWallet.id,
              amount: -1,
              type: 'SHIELD_USED',
              description: 'Escudo usado para proteger racha'
            }
          }),
          prisma.userStreak.upsert({
            where: { userId },
            update: {
              freezeUntil: tomorrow,
              shieldsUsedCount: { increment: 1 }
            },
            create: {
              userId,
              currentStreak: 0,
              longestStreak: 0,
              freezeUntil: tomorrow,
              shieldsUsedCount: 1
            }
          })
        ])

        return NextResponse.json({
          success: true,
          message: 'Escudo activado. Tu racha esta protegida hasta manana.',
          newBalance: shieldWallet.balance - 1
        })
      }

      case 'REDEEM': {
        // Canjear monedas por beneficios (futuro marketplace)
        const amount = body.amount
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { error: 'Cantidad invalida para canjear.' },
            { status: 400 }
          )
        }

        const coinsWallet = await prisma.wallet.findUnique({
          where: { userId_type: { userId, type: 'COINS' } }
        })

        if (!coinsWallet || coinsWallet.balance < amount) {
          return NextResponse.json(
            { error: 'No tienes suficientes monedas.' },
            { status: 400 }
          )
        }

        // Descontar monedas
        const [updatedWallet, transaction] = await prisma.$transaction([
          prisma.wallet.update({
            where: { id: coinsWallet.id },
            data: { balance: { decrement: amount } }
          }),
          prisma.walletTransaction.create({
            data: {
              walletId: coinsWallet.id,
              amount: -amount,
              type: 'REDEMPTION',
              description: 'Canje de monedas',
              metadata: body.metadata
            }
          })
        ])

        return NextResponse.json({
          success: true,
          message: `Has canjeado ${amount} monedas correctamente.`,
          newBalance: updatedWallet.balance,
          transaction: {
            id: transaction.id,
            walletType: 'COINS',
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            createdAt: transaction.createdAt.toISOString()
          }
        })
      }

      default:
        return NextResponse.json(
          { error: 'Operacion no soportada.' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Wallet POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
