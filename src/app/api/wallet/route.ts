import { NextRequest, NextResponse } from 'next/server'

// ============================================
// TYPES
// ============================================

type WalletType = 'XP' | 'COINS' | 'SHIELDS'

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
  totalValue: number
  recentTransactions: TransactionInfo[]
  stats: {
    totalXPEarned: number
    totalCoinsEarned: number
    totalShieldsEarned: number
    currentStreak: number
    longestStreak: number
  }
}

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

// ============================================
// GET - Obtener Estado de Wallets
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<WalletResponse | { error: string }>> {
  try {
    const now = new Date().toISOString()

    const response: WalletResponse = {
      wallets: {
        XP: { type: 'XP', balance: 2850, lastUpdated: now },
        COINS: { type: 'COINS', balance: 450, lastUpdated: now },
        SHIELDS: { type: 'SHIELDS', balance: 3, lastUpdated: now }
      },
      totalValue: 2850 + (450 * 2),
      recentTransactions: [
        { id: 'tx1', walletType: 'XP', amount: 50, type: 'QUIZ_REWARD', description: 'Quiz diario - 4/5 correctas', createdAt: now },
        { id: 'tx2', walletType: 'COINS', amount: 25, type: 'QUIZ_REWARD', description: 'Quiz diario - 4/5 correctas', createdAt: now },
        { id: 'tx3', walletType: 'XP', amount: 25, type: 'SPIN_WHEEL_WIN', description: 'Premio ruleta: 25 XP', createdAt: now },
        { id: 'tx4', walletType: 'COINS', amount: -50, type: 'SPIN_WHEEL_COST', description: 'Giro de ruleta', createdAt: now },
        { id: 'tx5', walletType: 'SHIELDS', amount: 1, type: 'REFERRAL_CONVERSION', description: 'Escudo bonus por conversion de referido', createdAt: now }
      ],
      stats: {
        totalXPEarned: 3200,
        totalCoinsEarned: 680,
        totalShieldsEarned: 5,
        currentStreak: 7,
        longestStreak: 14
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
// POST - Operaciones de Wallet
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<WalletOperationResponse | { error: string }>> {
  try {
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

    switch (body.operation) {
      case 'USE_SHIELD':
        return NextResponse.json({
          success: true,
          message: 'Escudo activado. Tu racha esta protegida hasta manana.',
          newBalance: 2
        })

      case 'REDEEM':
        return NextResponse.json({
          success: true,
          message: `Has canjeado ${body.amount || 0} monedas correctamente.`,
          newBalance: 450 - (body.amount || 0),
          transaction: {
            id: 'tx-redeem-demo',
            walletType: 'COINS',
            amount: -(body.amount || 0),
            type: 'REDEMPTION',
            description: 'Canje de monedas',
            createdAt: new Date().toISOString()
          }
        })

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
