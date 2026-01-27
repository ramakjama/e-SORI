import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      user: {
        id: 'demo-user-001',
        email: 'demo@soriano.es',
        name: 'Carlos García López',
        phone: '+34 612 345 678',
        address: 'Calle Mayor 15, 3ºA',
        city: 'Valencia',
        postalCode: '46001',
        dni: '12345678A',
        birthDate: '1985-06-15T00:00:00.000Z',
        role: 'CLIENTE',
        level: 'PLATA',
        points: 750,
        createdAt: '2024-01-15T10:00:00.000Z',
      },
      soriano_club: {
        level: 'PLATA',
        points: 750,
        badges: [
          {
            id: 'badge-1',
            name: 'Bienvenida',
            description: 'Te has registrado en Soriano eCliente',
            icon: '🎉',
            color: '#4CAF50',
            earnedAt: '2024-01-15T10:00:00.000Z',
          },
        ],
        referralCode: 'CARLOS-REF-0001',
        referralsCount: 2,
        nextLevel: 'ORO',
        pointsToNextLevel: 250,
      },
      stats: {
        activePolicies: 3,
        openClaims: 1,
        totalReferrals: 3,
        convertedReferrals: 2,
      },
      pointsHistory: [
        { id: 'ph-1', userId: 'demo-user-001', action: 'PERFIL_COMPLETO', points: 50, description: 'Bienvenida: Registro completado', createdAt: '2024-01-15T10:00:00.000Z' },
        { id: 'ph-2', userId: 'demo-user-001', action: 'REFERIDO', points: 200, description: 'Referido convertido', createdAt: '2024-03-10T10:00:00.000Z' },
      ],
    })
  } catch (error) {
    console.error('User API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Datos actualizados correctamente',
      user: {
        id,
        email: 'demo@soriano.es',
        name: updates.name || 'Carlos García López',
        phone: updates.phone || '+34 612 345 678',
        address: updates.address || 'Calle Mayor 15, 3ºA',
        city: updates.city || 'Valencia',
        postalCode: updates.postalCode || '46001',
        birthDate: updates.birthDate || '1985-06-15T00:00:00.000Z',
        level: 'PLATA',
        points: 750,
      },
    })
  } catch (error) {
    console.error('Update User API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, points } = body

    if (!userId || !action || !points) {
      return NextResponse.json({ error: 'userId, action y points son requeridos' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      newPoints: 750 + points,
      levelUp: null,
    })
  } catch (error) {
    console.error('Add Points API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
