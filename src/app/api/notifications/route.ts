import { NextRequest, NextResponse } from 'next/server'

// ============================================
// MOCK DATA
// ============================================

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'info', title: 'Bienvenido a e-SORI', message: 'Tu portal de cliente esta listo. Explora todas las funcionalidades.', read: false, link: '/dashboard', createdAt: new Date().toISOString() },
  { id: 'n2', type: 'warning', title: 'Renovacion proxima', message: 'Tu poliza AUTO-2024-1234 vence en 22 dias. Reclama tu checkpoint T-30.', read: false, link: '/renovaciones', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n3', type: 'success', title: 'Quiz completado', message: 'Has ganado 50 XP y 25 monedas en el quiz diario.', read: true, link: '/quiz', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'n4', type: 'info', title: 'Nuevo referido', message: 'Maria Garcia se ha registrado con tu codigo de referido.', read: true, link: '/referidos', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'n5', type: 'success', title: 'Nivel alcanzado', message: 'Felicidades! Has alcanzado el nivel PLATA en Soriano Club.', read: true, link: '/club', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
]

// ============================================
// GET
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')

    let notifications = MOCK_NOTIFICATIONS
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read)
    }
    notifications = notifications.slice(0, limit)

    return NextResponse.json({
      notifications,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
      total: MOCK_NOTIFICATIONS.length,
    })
  } catch (error) {
    console.error('Notifications API Error:', error)
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

    if (!body.title || !body.message) {
      return NextResponse.json(
        { error: 'title y message son requeridos' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      notification: {
        id: 'n-new',
        type: body.type || 'info',
        title: body.title,
        message: body.message,
        read: false,
        link: body.link || null,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Create Notification API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH
// ============================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.action === 'mark_all_read') {
      return NextResponse.json({
        success: true,
        message: 'Todas las notificaciones marcadas como leidas',
      })
    }

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID de notificacion requerido' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notificacion actualizada',
      notification: {
        id: body.id,
        read: true,
      },
    })
  } catch (error) {
    console.error('Update Notification API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE
// ============================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de notificacion requerido' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notificacion eliminada',
    })
  } catch (error) {
    console.error('Delete Notification API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
