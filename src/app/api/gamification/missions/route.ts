import { NextRequest, NextResponse } from 'next/server'

// ============================================
// MOCK DATA
// ============================================

const MOCK_MISSIONS = [
  {
    id: 'get_life_insurance',
    name: 'Contrata seguro de vida',
    description: 'Protege a 2 personas que dependen de ti',
    points: 600,
    experience: 300,
    type: 'policy',
    category: 'Seguros',
    progress: 0,
    target: 1,
    completed: false,
    priority: 'critical',
    urgency: 98,
    productRecommended: 'vida-riesgo',
    icon: 'shield'
  },
  {
    id: 'get_auto_insurance',
    name: 'Contrata seguro de auto',
    description: 'Protege tu vehiculo - OBLIGATORIO',
    points: 500,
    experience: 250,
    type: 'policy',
    category: 'Seguros',
    progress: 0,
    target: 1,
    completed: false,
    priority: 'critical',
    urgency: 95,
    productRecommended: 'auto-terceros-ampliado',
    icon: 'car'
  },
  {
    id: 'get_home_insurance',
    name: 'Contrata seguro de hogar',
    description: 'Protege tu vivienda',
    points: 500,
    experience: 250,
    type: 'policy',
    category: 'Seguros',
    progress: 0,
    target: 1,
    completed: false,
    priority: 'high',
    urgency: 90,
    productRecommended: 'hogar-completo',
    icon: 'home'
  },
  {
    id: 'complete_profile_datosPersonales',
    name: 'Completa tus datos personales',
    description: 'Completa el 40% restante para ganar 100 puntos',
    points: 100,
    experience: 50,
    type: 'profile',
    category: 'Perfil',
    progress: 60,
    target: 100,
    completed: false,
    priority: 'high',
    icon: 'user'
  },
  {
    id: 'complete_profile_datosContacto',
    name: 'Completa tus datos de contacto',
    description: 'Completa el 20% restante para ganar 80 puntos',
    points: 80,
    experience: 40,
    type: 'profile',
    category: 'Perfil',
    progress: 80,
    target: 100,
    completed: false,
    priority: 'medium',
    icon: 'user'
  },
  {
    id: 'upload_10_documents',
    name: 'Sube 10 documentos',
    description: 'Organiza tus documentos importantes en Mi Archivo',
    points: 200,
    experience: 100,
    type: 'document',
    category: 'Organizacion',
    progress: 3,
    target: 10,
    completed: false,
    priority: 'medium',
    icon: 'file'
  },
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
]

// ============================================
// GET - Obtener Misiones
// ============================================

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      missions: MOCK_MISSIONS,
      level: 'PLATA',
      points: 850,
      experience: 1200,
      totalMissions: MOCK_MISSIONS.length,
      criticalMissions: MOCK_MISSIONS.filter(m => m.priority === 'critical').length,
      completedToday: 0
    })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// POST - Completar Mision
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { missionId, points, experience } = await req.json()

    return NextResponse.json({
      success: true,
      gamification: {
        level: 'PLATA',
        points: 850 + (points || 0),
        experience: 1200 + (experience || 0)
      },
      rewards: {
        points: points || 0,
        experience: experience || 0
      },
      levelUp: false
    })
  } catch (error) {
    console.error('Error completing mission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
