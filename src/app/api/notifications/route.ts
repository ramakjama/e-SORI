import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'Se requiere userId' },
        { status: 400 }
      )
    }

    const where: Record<string, unknown> = { userId }

    if (unreadOnly) {
      where.isRead = false
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })

    const total = await prisma.notification.count({
      where: { userId },
    })

    return NextResponse.json({
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.isRead,
        link: n.link,
        createdAt: n.createdAt,
      })),
      unreadCount,
      total,
    })
  } catch (error) {
    console.error('Notifications API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, message, type, link } = body

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'userId, title y message son requeridos' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type || 'info',
        link,
        isRead: false,
      },
    })

    return NextResponse.json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error('Create Notification API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, userId, action } = body

    if (action === 'mark_all_read' && userId) {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Todas las notificaciones marcadas como leídas',
      })
    }

    if (!id) {
      return NextResponse.json(
        { error: 'ID de notificación requerido' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Notificación actualizada',
      notification,
    })
  } catch (error) {
    console.error('Update Notification API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de notificación requerido' },
        { status: 400 }
      )
    }

    await prisma.notification.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Notificación eliminada',
    })
  } catch (error) {
    console.error('Delete Notification API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
