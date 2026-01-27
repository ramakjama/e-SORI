import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { PRODUCTS_CATALOG } from '@/data/products-catalog'

// GENERADOR DE MISIONES PERSONALIZADAS BASADAS EN DATOS DEL USUARIO
async function generatePersonalizedMissions(userId: string): Promise<any[]> {
  const missions = []
  
  // Obtener todos los datos del usuario
  const [
    datosPersonales,
    datosContacto,
    datosLaborales,
    datosFamiliares,
    datosFinancieros,
    datosVehiculo,
    datosVivienda,
    datosSalud,
    datosPreferencias,
    datosAficiones,
    polizas,
    documentos,
    pagos
  ] = await Promise.all([
    prisma.datosPersonales.findUnique({ where: { userId } }),
    prisma.datosContacto.findUnique({ where: { userId } }),
    prisma.datosLaborales.findUnique({ where: { userId } }),
    prisma.datosFamiliares.findUnique({ where: { userId } }),
    prisma.datosFinancieros.findUnique({ where: { userId } }),
    prisma.datosVehiculo.findUnique({ where: { userId } }),
    prisma.datosVivienda.findUnique({ where: { userId } }),
    prisma.datosSalud.findUnique({ where: { userId } }),
    prisma.datosPreferencias.findUnique({ where: { userId } }),
    prisma.datosAficiones.findUnique({ where: { userId } }),
    prisma.poliza.findMany({ where: { userId, estado: 'activa' } }),
    prisma.documento.findMany({ where: { userId } }),
    prisma.pago.findMany({ where: { userId, estado: 'pendiente' } })
  ])
  
  // MISIONES DE PERFIL - Basadas en completitud
  const profileSections = [
    { data: datosPersonales, key: 'datosPersonales', name: 'Completa tus datos personales', points: 100, exp: 50 },
    { data: datosContacto, key: 'datosContacto', name: 'Completa tus datos de contacto', points: 80, exp: 40 },
    { data: datosLaborales, key: 'datosLaborales', name: 'Completa tus datos laborales', points: 90, exp: 45 },
    { data: datosFamiliares, key: 'datosFamiliares', name: 'Completa tus datos familiares', points: 90, exp: 45 },
    { data: datosFinancieros, key: 'datosFinancieros', name: 'Completa tus datos financieros', points: 100, exp: 50 },
    { data: datosVehiculo, key: 'datosVehiculo', name: 'Completa tus datos de vehículo', points: 80, exp: 40 },
    { data: datosVivienda, key: 'datosVivienda', name: 'Completa tus datos de vivienda', points: 80, exp: 40 },
    { data: datosSalud, key: 'datosSalud', name: 'Completa tus datos de salud', points: 90, exp: 45 },
    { data: datosPreferencias, key: 'datosPreferencias', name: 'Completa tus preferencias', points: 70, exp: 35 },
    { data: datosAficiones, key: 'datosAficiones', name: 'Completa tus aficiones', points: 70, exp: 35 }
  ]
  
  profileSections.forEach(section => {
    const completitud = section.data?.completitud || 0
    
    if (completitud < 100) {
      missions.push({
        id: `complete_profile_${section.key}`,
        name: section.name,
        description: `Completa el ${100 - completitud}% restante para ganar ${section.points} puntos`,
        points: section.points,
        experience: section.exp,
        type: 'profile',
        category: 'Perfil',
        progress: completitud,
        target: 100,
        completed: false,
        priority: completitud < 50 ? 'high' : 'medium',
        icon: 'user'
      })
    }
  })
  
  // MISIONES DE PÓLIZAS - Cruzadas con catálogo de productos
  const policyTypes = polizas.map((p: any) => p.tipo)
  
  // Auto
  if (datosVehiculo?.tieneVehiculo && !policyTypes.includes('auto')) {
    const producto = PRODUCTS_CATALOG.find(p => p.id === 'auto-terceros-ampliado')
    missions.push({
      id: 'get_auto_insurance',
      name: 'Contrata seguro de auto',
      description: `Protege tu ${datosVehiculo.tipoVehiculo || 'vehículo'} - OBLIGATORIO`,
      points: 500,
      experience: 250,
      type: 'policy',
      category: 'Seguros',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'critical',
      urgency: 95,
      productRecommended: producto?.id,
      icon: 'car'
    })
  }
  
  // Hogar
  if (datosVivienda && !policyTypes.includes('hogar')) {
    const producto = PRODUCTS_CATALOG.find(p => p.id === 'hogar-completo')
    missions.push({
      id: 'get_home_insurance',
      name: 'Contrata seguro de hogar',
      description: `Protege tu ${datosVivienda.tipoVivienda || 'vivienda'}`,
      points: 500,
      experience: 250,
      type: 'policy',
      category: 'Seguros',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'high',
      urgency: 90,
      productRecommended: producto?.id,
      icon: 'home'
    })
  }
  
  // Vida
  if (datosFamiliares && (datosFamiliares.numeroHijos > 0 || datosFamiliares.personasACargo > 0) && !policyTypes.includes('vida')) {
    const producto = PRODUCTS_CATALOG.find(p => p.id === 'vida-riesgo')
    missions.push({
      id: 'get_life_insurance',
      name: 'Contrata seguro de vida',
      description: `Protege a ${datosFamiliares.numeroHijos + datosFamiliares.personasACargo} personas que dependen de ti`,
      points: 600,
      experience: 300,
      type: 'policy',
      category: 'Seguros',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'critical',
      urgency: 98,
      productRecommended: producto?.id,
      icon: 'shield'
    })
  }
  
  // Salud
  if (!policyTypes.includes('salud')) {
    const producto = PRODUCTS_CATALOG.find(p => p.id === 'salud-completo')
    missions.push({
      id: 'get_health_insurance',
      name: 'Contrata seguro de salud',
      description: 'Acceso inmediato a atención médica privada',
      points: 550,
      experience: 275,
      type: 'policy',
      category: 'Seguros',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'high',
      urgency: 85,
      productRecommended: producto?.id,
      icon: 'heart'
    })
  }
  
  // Dental
  if (!policyTypes.includes('dental')) {
    const producto = PRODUCTS_CATALOG.find(p => p.id === 'salud-dental')
    missions.push({
      id: 'get_dental_insurance',
      name: 'Contrata seguro dental',
      description: 'Cuida tu salud bucodental',
      points: 300,
      experience: 150,
      type: 'policy',
      category: 'Seguros',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'medium',
      productRecommended: producto?.id,
      icon: 'smile'
    })
  }
  
  // Mascotas
  if (datosAficiones?.mascotasCantidad > 0 && !policyTypes.includes('mascotas')) {
    const producto = PRODUCTS_CATALOG.find(p => p.id === 'mascotas-completo')
    missions.push({
      id: 'get_pet_insurance',
      name: 'Contrata seguro de mascotas',
      description: `Protege a tus ${datosAficiones.mascotasCantidad} mascota(s)`,
      points: 350,
      experience: 175,
      type: 'policy',
      category: 'Seguros',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'medium',
      productRecommended: producto?.id,
      icon: 'paw'
    })
  }
  
  // MISIONES DE DOCUMENTOS
  const documentCount = documentos.length
  if (documentCount < 10) {
    missions.push({
      id: 'upload_10_documents',
      name: 'Sube 10 documentos',
      description: 'Organiza tus documentos importantes en Mi Archivo',
      points: 200,
      experience: 100,
      type: 'document',
      category: 'Organización',
      progress: documentCount,
      target: 10,
      completed: false,
      priority: 'medium',
      icon: 'file'
    })
  }
  
  // MISIONES DE PAGOS
  if (pagos.length > 0) {
    missions.push({
      id: 'pay_pending_bills',
      name: 'Paga tus recibos pendientes',
      description: `Tienes ${pagos.length} pago(s) pendiente(s)`,
      points: 150,
      experience: 75,
      type: 'payment',
      category: 'Pagos',
      progress: 0,
      target: pagos.length,
      completed: false,
      priority: 'high',
      icon: 'credit-card'
    })
  }
  
  // MISIONES DIARIAS
  missions.push(
    {
      id: 'daily_quiz',
      name: 'Quiz diario',
      description: 'Completa el quiz de hoy',
      points: 50,
      experience: 25,
      type: 'quiz',
      category: 'Diario',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'low',
      daily: true,
      icon: 'brain'
    },
    {
      id: 'spin_wheel_daily',
      name: 'Ruleta diaria',
      description: 'Gira la ruleta de premios',
      points: 30,
      experience: 15,
      type: 'wheel',
      category: 'Diario',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'low',
      daily: true,
      icon: 'gift'
    },
    {
      id: 'chat_with_sori',
      name: 'Chatea con SORI',
      description: 'Pregunta algo a nuestro asistente',
      points: 40,
      experience: 20,
      type: 'chat',
      category: 'Diario',
      progress: 0,
      target: 1,
      completed: false,
      priority: 'low',
      daily: true,
      icon: 'message-circle'
    }
  )
  
  // Ordenar por prioridad
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  missions.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99))
  
  return missions
}

function calculateLevel(experience: number): string {
  if (experience >= 10000) return 'DIAMANTE'
  if (experience >= 5000) return 'PLATINO'
  if (experience >= 2000) return 'ORO'
  if (experience >= 500) return 'PLATA'
  return 'BRONCE'
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generar misiones personalizadas
    const personalizedMissions = await generatePersonalizedMissions(session.user.id)

    const gamification = await prisma.gamification.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({
      missions: personalizedMissions,
      level: gamification?.level || 'BRONCE',
      points: gamification?.points || 0,
      experience: gamification?.experience || 0,
      totalMissions: personalizedMissions.length,
      criticalMissions: personalizedMissions.filter(m => m.priority === 'critical').length,
      completedToday: 0 // TODO: calcular desde DB
    })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { missionId, points, experience } = await req.json()

    const gamification = await prisma.gamification.findUnique({
      where: { userId: session.user.id }
    })

    const newPoints = (gamification?.points || 0) + points
    const newExperience = (gamification?.experience || 0) + experience
    const newLevel = calculateLevel(newExperience)

    const updatedGamification = await prisma.gamification.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        points: newPoints,
        experience: newExperience,
        level: newLevel,
        streak: 1,
        lastActivityDate: new Date()
      },
      update: {
        points: newPoints,
        experience: newExperience,
        level: newLevel,
        lastActivityDate: new Date()
      }
    })

    // Registrar misión completada
    await prisma.userMission.create({
      data: {
        userId: session.user.id,
        missionId,
        status: 'completed',
        progress: 100,
        target: 100,
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      gamification: updatedGamification,
      rewards: {
        points,
        experience
      },
      levelUp: gamification?.level !== newLevel
    })
  } catch (error) {
    console.error('Error completing mission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
