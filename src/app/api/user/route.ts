import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { UserLevel } from '@prisma/client'

// Helper functions for Soriano Club
function getNextLevel(currentLevel: UserLevel): UserLevel | null {
  const levels: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']
  const currentIndex = levels.indexOf(currentLevel)
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null
}

function getPointsToNextLevel(currentLevel: UserLevel, currentPoints: number): number {
  const levelThresholds: Record<UserLevel, number> = {
    BRONCE: 500,
    PLATA: 1000,
    ORO: 2000,
    PLATINO: 0,
  }

  const threshold = levelThresholds[currentLevel] || 0
  return Math.max(0, threshold - currentPoints)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')

    if (!id && !email) {
      return NextResponse.json(
        { error: 'Se requiere ID o email del usuario' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        policies: {
          where: { status: 'ACTIVA' },
          select: { id: true },
        },
        claims: {
          where: {
            status: {
              notIn: ['RESUELTO', 'RECHAZADO'],
            },
          },
          select: { id: true },
        },
        pointsHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        referralsMade: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const referralCode = `${user.name?.split(' ')[0]?.toUpperCase() || 'USER'}-REF-${user.id.slice(-4).toUpperCase()}`

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        dni: user.dni,
        birthDate: user.birthDate,
        role: user.role,
        level: user.level,
        points: user.points,
        createdAt: user.createdAt,
      },
      soriano_club: {
        level: user.level,
        points: user.points,
        badges: user.badges.map(ub => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          color: ub.badge.color,
          earnedAt: ub.earnedAt,
        })),
        referralCode,
        referralsCount: user.referralsMade.filter(r => r.status === 'CONVERTIDO').length,
        nextLevel: getNextLevel(user.level),
        pointsToNextLevel: getPointsToNextLevel(user.level, user.points),
      },
      stats: {
        activePolicies: user.policies.length,
        openClaims: user.claims.length,
        totalReferrals: user.referralsMade.length,
        convertedReferrals: user.referralsMade.filter(r => r.status === 'CONVERTIDO').length,
      },
      pointsHistory: user.pointsHistory,
    })
  } catch (error) {
    console.error('User API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 })
    }

    const allowedFields = ['name', 'phone', 'address', 'city', 'postalCode', 'birthDate']
    const filteredUpdates: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'birthDate' && updates[field]) {
          filteredUpdates[field] = new Date(updates[field])
        } else {
          filteredUpdates[field] = updates[field]
        }
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos válidos para actualizar' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredUpdates,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        birthDate: true,
        level: true,
        points: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Datos actualizados correctamente',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update User API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, points, description } = body

    if (!userId || !action || !points) {
      return NextResponse.json(
        { error: 'userId, action y points son requeridos' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.pointsHistory.create({
        data: {
          userId,
          action,
          points,
          description,
        },
      })

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: points,
          },
        },
      })

      const levelThresholds: Record<string, UserLevel> = {
        '2000': 'PLATINO',
        '1000': 'ORO',
        '500': 'PLATA',
      }

      let newLevel: UserLevel | null = null
      for (const [threshold, level] of Object.entries(levelThresholds)) {
        if (user.points >= parseInt(threshold) && user.level !== level) {
          const levelOrder = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']
          if (levelOrder.indexOf(level) > levelOrder.indexOf(user.level)) {
            newLevel = level
            break
          }
        }
      }

      if (newLevel) {
        await tx.user.update({
          where: { id: userId },
          data: { level: newLevel },
        })
      }

      return { user, newLevel }
    })

    return NextResponse.json({
      success: true,
      newPoints: result.user.points,
      levelUp: result.newLevel ? {
        newLevel: result.newLevel,
        message: `¡Felicidades! Has subido al nivel ${result.newLevel}`,
      } : null,
    })
  } catch (error) {
    console.error('Add Points API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
