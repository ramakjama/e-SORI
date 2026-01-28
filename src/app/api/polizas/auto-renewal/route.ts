/**
 * API Route: Renovación Automática de Pólizas
 *
 * Requiere nivel ORO o superior
 */

import { NextRequest } from 'next/server'
import { withPermission, ApiResponse } from '@/lib/api-permissions'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/polizas/auto-renewal
 *
 * Configura la renovación automática de una póliza
 */
export const POST = withPermission('polizas.renovacion.auto', async (req, session) => {
  try {
    const body = await req.json()
    const { polizaId, enabled, preferences } = body

    // Validar que la póliza pertenezca al usuario
    const poliza = await prisma.poliza.findUnique({
      where: { id: polizaId },
    })

    if (!poliza) {
      return ApiResponse.notFound('Póliza no encontrada')
    }

    if (poliza.userId !== session.user.id) {
      return ApiResponse.forbidden('No tienes acceso a esta póliza')
    }

    // Actualizar configuración de renovación automática
    const updated = await prisma.poliza.update({
      where: { id: polizaId },
      data: {
        autoRenewal: enabled,
        autoRenewalPreferences: preferences,
        updatedAt: new Date(),
      },
    })

    // Registrar cambio
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: 'AUTO_RENEWAL_UPDATED',
        description: `Renovación automática ${enabled ? 'activada' : 'desactivada'} para póliza ${poliza.numero}`,
        metadata: { polizaId, enabled, preferences },
      },
    })

    // Si se activó, programar verificación periódica
    if (enabled) {
      // TODO: Añadir a cola de jobs para verificar vencimientos
      console.log(`[AutoRenewal] Programada verificación para póliza ${polizaId}`)
    }

    return ApiResponse.success({
      message: `Renovación automática ${enabled ? 'activada' : 'desactivada'}`,
      poliza: {
        id: updated.id,
        numero: updated.numero,
        autoRenewal: updated.autoRenewal,
        proximoVencimiento: updated.fechaFin,
      },
    })
  } catch (error) {
    console.error('[API] Error en renovación automática:', error)
    return ApiResponse.serverError('Error al configurar renovación automática')
  }
})

/**
 * GET /api/polizas/auto-renewal
 *
 * Obtiene el estado de renovación automática de todas las pólizas del usuario
 */
export const GET = withPermission('polizas.renovacion.auto', async (req, session) => {
  try {
    const polizas = await prisma.poliza.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        numero: true,
        tipo: true,
        compania: true,
        autoRenewal: true,
        fechaFin: true,
        prima: true,
      },
    })

    const resumen = {
      total: polizas.length,
      conAutoRenewal: polizas.filter((p) => p.autoRenewal).length,
      proximasRenovaciones: polizas
        .filter((p) => p.autoRenewal)
        .sort((a, b) => new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime())
        .slice(0, 5),
    }

    return ApiResponse.success(resumen)
  } catch (error) {
    console.error('[API] Error al obtener renovaciones automáticas:', error)
    return ApiResponse.serverError()
  }
})

/**
 * DELETE /api/polizas/auto-renewal?polizaId=xxx
 *
 * Desactiva la renovación automática de una póliza específica
 */
export const DELETE = withPermission('polizas.renovacion.auto', async (req, session) => {
  try {
    const { searchParams } = new URL(req.url)
    const polizaId = searchParams.get('polizaId')

    if (!polizaId) {
      return ApiResponse.error('ID de póliza requerido', 'INVALID_INPUT')
    }

    // Validar propiedad
    const poliza = await prisma.poliza.findFirst({
      where: {
        id: polizaId,
        userId: session.user.id,
      },
    })

    if (!poliza) {
      return ApiResponse.notFound('Póliza no encontrada')
    }

    // Desactivar
    await prisma.poliza.update({
      where: { id: polizaId },
      data: {
        autoRenewal: false,
        autoRenewalPreferences: null,
      },
    })

    // Registrar
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: 'AUTO_RENEWAL_DISABLED',
        description: `Renovación automática desactivada para póliza ${poliza.numero}`,
      },
    })

    return ApiResponse.success({
      message: 'Renovación automática desactivada',
    })
  } catch (error) {
    console.error('[API] Error al desactivar renovación automática:', error)
    return ApiResponse.serverError()
  }
})
