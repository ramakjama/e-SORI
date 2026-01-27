/**
 * 🎮 SISTEMA DE GAMIFICACIÓN PROFESIONAL - e-SORI
 * Sistema completo de puntos, niveles, misiones, logros y recompensas
 */

// ============================================
// TIPOS Y INTERFACES
// ============================================

export interface UserProgress {
  level: 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO' | 'DIAMANTE'
  points: number
  xp: number
  streak: number
  totalMissionsCompleted: number
  profileCompletion: number
}

export interface Mission {
  id: string
  type: 'daily' | 'weekly' | 'monthly' | 'permanent' | 'special'
  category: 'perfil' | 'actividad' | 'social' | 'financiero' | 'educativo'
  title: string
  description: string
  icon: string
  points: number
  xp: number
  progress: { current: number; target: number }
  completed: boolean
  expiresAt?: Date
  reward?: MissionReward
}

export interface MissionReward {
  points?: number
  xp?: number
  badge?: string
  discount?: number
  coins?: number
  unlocks?: string[]
  multiplier?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: string
  requirement: string
  unlocked: boolean
  unlockedAt?: Date
  reward: MissionReward
}

export interface ProfileSection {
  id: string
  name: string
  category: string
  totalFields: number
  completedFields: number
  points: number
  required: boolean
  weight: number // Para calcular % total
}

// ============================================
// CONFIGURACIÓN DE NIVELES
// ============================================

export const LEVEL_CONFIG = {
  BRONCE: {
    min: 0,
    max: 999,
    next: 'PLATA' as const,
    color: '#CD7F32',
    benefits: [
      '10% descuento primera póliza',
      'Soporte horario laboral',
      'Acceso al portal',
      '1 giro ruleta/día',
    ],
    multiplier: 1.0,
  },
  PLATA: {
    min: 1000,
    max: 2999,
    next: 'ORO' as const,
    color: '#C0C0C0',
    benefits: [
      '5% descuento renovaciones',
      'Atención preferente',
      '25€ por referido',
      '2 giros ruleta/día',
      'Quiz diario +25% puntos',
    ],
    multiplier: 1.25,
  },
  ORO: {
    min: 3000,
    max: 5999,
    next: 'PLATINO' as const,
    color: '#FFD700',
    benefits: [
      '10% descuento renovaciones',
      'Línea directa 24/7',
      '50€ por referido',
      '3 giros ruleta/día',
      'Gestión siniestros express',
      'Quiz diario +50% puntos',
    ],
    multiplier: 1.5,
  },
  PLATINO: {
    min: 6000,
    max: 9999,
    next: 'DIAMANTE' as const,
    color: '#E5E4E2',
    benefits: [
      '15% descuento en todo',
      'Gestor personal 24/7',
      '100€ por referido',
      '5 giros ruleta/día',
      'Resolución prioritaria',
      'Productos VIP exclusivos',
      'Quiz diario +75% puntos',
    ],
    multiplier: 2.0,
  },
  DIAMANTE: {
    min: 10000,
    max: Infinity,
    next: null,
    color: '#B9F2FF',
    benefits: [
      '20% descuento permanente',
      'Agente VIP dedicado',
      '200€ por referido',
      'Giros ilimitados',
      'Prioridad absoluta',
      'Eventos exclusivos',
      'Regalos premium',
      'Quiz diario +100% puntos',
    ],
    multiplier: 3.0,
  },
}

// ============================================
// SECCIONES DEL PERFIL
// ============================================

export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: 'personal',
    name: 'Datos Personales',
    category: 'Básico',
    totalFields: 10,
    completedFields: 0,
    points: 50,
    required: true,
    weight: 1.5,
  },
  {
    id: 'contacto',
    name: 'Datos de Contacto',
    category: 'Básico',
    totalFields: 10,
    completedFields: 0,
    points: 50,
    required: true,
    weight: 1.5,
  },
  {
    id: 'laboral',
    name: 'Información Laboral',
    category: 'Profesional',
    totalFields: 7,
    completedFields: 0,
    points: 75,
    required: false,
    weight: 1.0,
  },
  {
    id: 'familiar',
    name: 'Datos Familiares',
    category: 'Personal',
    totalFields: 5,
    completedFields: 0,
    points: 75,
    required: false,
    weight: 1.0,
  },
  {
    id: 'financiero',
    name: 'Perfil Financiero',
    category: 'Financiero',
    totalFields: 6,
    completedFields: 0,
    points: 100,
    required: false,
    weight: 1.2,
  },
  {
    id: 'educativo',
    name: 'Formación Académica',
    category: 'Profesional',
    totalFields: 4,
    completedFields: 0,
    points: 50,
    required: false,
    weight: 0.8,
  },
  {
    id: 'social',
    name: 'Redes Sociales',
    category: 'Social',
    totalFields: 5,
    completedFields: 0,
    points: 25,
    required: false,
    weight: 0.5,
  },
  {
    id: 'vehiculo',
    name: 'Datos del Vehículo',
    category: 'Seguros',
    totalFields: 8,
    completedFields: 0,
    points: 75,
    required: false,
    weight: 1.0,
  },
  {
    id: 'vivienda',
    name: 'Datos de Vivienda',
    category: 'Seguros',
    totalFields: 7,
    completedFields: 0,
    points: 75,
    required: false,
    weight: 1.0,
  },
  {
    id: 'salud',
    name: 'Información de Salud',
    category: 'Salud',
    totalFields: 6,
    completedFields: 0,
    points: 100,
    required: false,
    weight: 1.2,
  },
  {
    id: 'preferencias',
    name: 'Preferencias de Seguros',
    category: 'Configuración',
    totalFields: 8,
    completedFields: 0,
    points: 50,
    required: false,
    weight: 0.8,
  },
  {
    id: 'aficiones',
    name: 'Aficiones y Estilo de Vida',
    category: 'Personal',
    totalFields: 6,
    completedFields: 0,
    points: 50,
    required: false,
    weight: 0.7,
  },
]

// ============================================
// MISIONES DIARIAS
// ============================================

export const DAILY_MISSIONS: Omit<Mission, 'progress' | 'completed'>[] = [
  {
    id: 'daily_login',
    type: 'daily',
    category: 'actividad',
    title: 'Visita Diaria',
    description: 'Inicia sesión en el portal',
    icon: '🌅',
    points: 10,
    xp: 5,
  },
  {
    id: 'daily_quiz',
    type: 'daily',
    category: 'educativo',
    title: 'Quiz del Día',
    description: 'Completa el quiz diario de seguros',
    icon: '🧠',
    points: 30,
    xp: 20,
    reward: { coins: 5 },
  },
  {
    id: 'daily_spin',
    type: 'daily',
    category: 'actividad',
    title: 'Ruleta de la Suerte',
    description: 'Gira la ruleta diaria',
    icon: '🎰',
    points: 15,
    xp: 10,
  },
  {
    id: 'daily_profile_update',
    type: 'daily',
    category: 'perfil',
    title: 'Actualiza tu Perfil',
    description: 'Completa al menos 1 campo de tu perfil',
    icon: '📝',
    points: 20,
    xp: 15,
  },
  {
    id: 'daily_document_upload',
    type: 'daily',
    category: 'actividad',
    title: 'Organiza tus Documentos',
    description: 'Sube un documento a Mi Archivo',
    icon: '📄',
    points: 25,
    xp: 15,
  },
]

// ============================================
// MISIONES SEMANALES
// ============================================

export const WEEKLY_MISSIONS: Omit<Mission, 'progress' | 'completed'>[] = [
  {
    id: 'weekly_streak',
    type: 'weekly',
    category: 'actividad',
    title: 'Racha Semanal',
    description: 'Inicia sesión 5 días esta semana',
    icon: '🔥',
    points: 100,
    xp: 50,
    reward: { multiplier: 1.1 },
  },
  {
    id: 'weekly_profile',
    type: 'weekly',
    category: 'perfil',
    title: 'Perfil Completo',
    description: 'Completa 2 secciones de tu perfil',
    icon: '✅',
    points: 150,
    xp: 75,
  },
  {
    id: 'weekly_quizzes',
    type: 'weekly',
    category: 'educativo',
    title: 'Experto en Seguros',
    description: 'Completa 5 quizzes esta semana',
    icon: '🎓',
    points: 200,
    xp: 100,
    reward: { badge: 'quiz_master' },
  },
  {
    id: 'weekly_social',
    type: 'weekly',
    category: 'social',
    title: 'Comparte y Gana',
    description: 'Comparte tu código de referido 3 veces',
    icon: '📢',
    points: 75,
    xp: 40,
  },
]

// ============================================
// MISIONES DE PERFIL
// ============================================

export const PROFILE_MISSIONS: Omit<Mission, 'progress' | 'completed'>[] = [
  {
    id: 'profile_basic',
    type: 'permanent',
    category: 'perfil',
    title: 'Información Básica',
    description: 'Completa datos personales y de contacto (100%)',
    icon: '👤',
    points: 100,
    xp: 50,
    reward: { badge: 'first_steps', coins: 10 },
  },
  {
    id: 'profile_work',
    type: 'permanent',
    category: 'perfil',
    title: 'Vida Laboral',
    description: 'Completa tu información laboral (100%)',
    icon: '💼',
    points: 75,
    xp: 40,
  },
  {
    id: 'profile_family',
    type: 'permanent',
    category: 'perfil',
    title: 'Círculo Familiar',
    description: 'Completa los datos de tu familia (100%)',
    icon: '👨‍👩‍👧‍👦',
    points: 75,
    xp: 40,
  },
  {
    id: 'profile_financial',
    type: 'permanent',
    category: 'perfil',
    title: 'Perfil Financiero',
    description: 'Añade tu información financiera (100%)',
    icon: '💰',
    points: 100,
    xp: 60,
    reward: { discount: 2, coins: 15 },
  },
  {
    id: 'profile_health',
    type: 'permanent',
    category: 'perfil',
    title: 'Datos de Salud',
    description: 'Completa tu perfil de salud (100%)',
    icon: '🏥',
    points: 100,
    xp: 60,
  },
  {
    id: 'profile_preferences',
    type: 'permanent',
    category: 'perfil',
    title: 'Preferencias Personalizadas',
    description: 'Define tus preferencias de seguros (100%)',
    icon: '⚙️',
    points: 50,
    xp: 30,
  },
  {
    id: 'profile_lifestyle',
    type: 'permanent',
    category: 'perfil',
    title: 'Estilo de Vida',
    description: 'Comparte tus aficiones y hobbies (100%)',
    icon: '🎯',
    points: 50,
    xp: 30,
  },
  {
    id: 'profile_vehicle',
    type: 'permanent',
    category: 'perfil',
    title: 'Datos del Vehículo',
    description: 'Completa información de tu vehículo (100%)',
    icon: '🚗',
    points: 75,
    xp: 40,
  },
  {
    id: 'profile_home',
    type: 'permanent',
    category: 'perfil',
    title: 'Datos de Vivienda',
    description: 'Completa información de tu hogar (100%)',
    icon: '🏠',
    points: 75,
    xp: 40,
  },
  {
    id: 'profile_education',
    type: 'permanent',
    category: 'perfil',
    title: 'Formación Académica',
    description: 'Añade tu formación educativa (100%)',
    icon: '🎓',
    points: 50,
    xp: 30,
  },
  {
    id: 'profile_social_media',
    type: 'permanent',
    category: 'perfil',
    title: 'Conectado',
    description: 'Vincula tus redes sociales (100%)',
    icon: '🌐',
    points: 25,
    xp: 15,
  },
  {
    id: 'profile_master',
    type: 'permanent',
    category: 'perfil',
    title: '🏆 ¡PERFIL MAESTRO!',
    description: 'Completa TODAS las secciones al 100%',
    icon: '👑',
    points: 500,
    xp: 300,
    reward: {
      badge: 'profile_master',
      discount: 5,
      coins: 50,
      unlocks: ['premium_support', 'priority_claims', 'vip_products'],
    },
  },
]

// ============================================
// LOGROS / ACHIEVEMENTS
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'Primeros Pasos',
    description: 'Completa tu perfil básico',
    icon: '🎯',
    rarity: 'common',
    category: 'Perfil',
    requirement: 'Completa datos personales y contacto',
    unlocked: false,
    reward: { points: 50, xp: 25 },
  },
  {
    id: 'profile_master',
    name: 'Maestro del Perfil',
    description: 'Perfil 100% completado',
    icon: '👑',
    rarity: 'legendary',
    category: 'Perfil',
    requirement: 'Completa todas las secciones',
    unlocked: false,
    reward: { points: 500, xp: 300, discount: 5 },
  },
  {
    id: 'quiz_master',
    name: 'Experto en Seguros',
    description: 'Completa 50 quizzes',
    icon: '🧠',
    rarity: 'epic',
    category: 'Educativo',
    requirement: '50 quizzes completados',
    unlocked: false,
    reward: { points: 300, xp: 150 },
  },
  {
    id: 'streak_7',
    name: 'Racha de Fuego',
    description: '7 días consecutivos',
    icon: '🔥',
    rarity: 'rare',
    category: 'Actividad',
    requirement: '7 días de racha',
    unlocked: false,
    reward: { points: 150, xp: 75, multiplier: 1.1 },
  },
  {
    id: 'streak_30',
    name: 'Dedicación Total',
    description: '30 días consecutivos',
    icon: '💎',
    rarity: 'legendary',
    category: 'Actividad',
    requirement: '30 días de racha',
    unlocked: false,
    reward: { points: 1000, xp: 500, multiplier: 1.5 },
  },
  {
    id: 'referral_5',
    name: 'Embajador',
    description: 'Refiere a 5 amigos',
    icon: '🤝',
    rarity: 'epic',
    category: 'Social',
    requirement: '5 referidos activos',
    unlocked: false,
    reward: { points: 500, xp: 250, coins: 25 },
  },
  {
    id: 'policies_3',
    name: 'Previsor',
    description: '3+ pólizas activas',
    icon: '🛡️',
    rarity: 'rare',
    category: 'Seguros',
    requirement: '3 pólizas activas',
    unlocked: false,
    reward: { points: 200, xp: 100, discount: 3 },
  },
  {
    id: 'veteran_5',
    name: 'Veterano',
    description: '5+ años de cliente',
    icon: '🏆',
    rarity: 'legendary',
    category: 'Lealtad',
    requirement: '5 años como cliente',
    unlocked: false,
    reward: { points: 1500, xp: 750, discount: 10 },
  },
  {
    id: 'punctual_12',
    name: 'Puntual',
    description: '12 pagos consecutivos al día',
    icon: '⏰',
    rarity: 'epic',
    category: 'Financiero',
    requirement: '12 pagos puntuales',
    unlocked: false,
    reward: { points: 400, xp: 200, discount: 2 },
  },
  {
    id: 'digital_master',
    name: 'Maestro Digital',
    description: '100 visitas al portal',
    icon: '💻',
    rarity: 'rare',
    category: 'Actividad',
    requirement: '100 visitas',
    unlocked: false,
    reward: { points: 250, xp: 125 },
  },
  {
    id: 'family_protector',
    name: 'Protector Familiar',
    description: '5+ personas aseguradas',
    icon: '👨‍👩‍👧‍👦',
    rarity: 'epic',
    category: 'Seguros',
    requirement: '5 personas aseguradas',
    unlocked: false,
    reward: { points: 600, xp: 300, discount: 5 },
  },
  {
    id: 'platinum_level',
    name: 'Élite Platino',
    description: 'Alcanza nivel Platino',
    icon: '💎',
    rarity: 'legendary',
    category: 'Nivel',
    requirement: '6000 puntos',
    unlocked: false,
    reward: { points: 1000, xp: 500, unlocks: ['vip_lounge'] },
  },
]

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export function calculateProfileCompletion(sections: ProfileSection[]): number {
  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0)
  const completedWeight = sections.reduce((sum, s) => {
    const sectionCompletion = s.completedFields / s.totalFields
    return sum + sectionCompletion * s.weight
  }, 0)
  return Math.round((completedWeight / totalWeight) * 100)
}

export function calculateLevelProgress(points: number, level: keyof typeof LEVEL_CONFIG) {
  const config = LEVEL_CONFIG[level]
  const pointsInLevel = points - config.min
  const pointsNeeded = config.max - config.min + 1
  return Math.min((pointsInLevel / pointsNeeded) * 100, 100)
}

export function getNextLevel(currentLevel: keyof typeof LEVEL_CONFIG) {
  return LEVEL_CONFIG[currentLevel].next
}

export function calculatePointsWithMultiplier(basePoints: number, level: keyof typeof LEVEL_CONFIG): number {
  return Math.round(basePoints * LEVEL_CONFIG[level].multiplier)
}

export function checkMissionCompletion(mission: Mission): boolean {
  return mission.progress.current >= mission.progress.target
}

export function awardMissionReward(reward: MissionReward): {
  points: number
  xp: number
  message: string
} {
  const points = reward.points || 0
  const xp = reward.xp || 0
  let message = `+${points} puntos, +${xp} XP`

  if (reward.badge) message += `, Badge: ${reward.badge}`
  if (reward.discount) message += `, ${reward.discount}% descuento`
  if (reward.coins) message += `, +${reward.coins} monedas`
  if (reward.unlocks) message += `, Desbloqueado: ${reward.unlocks.join(', ')}`

  return { points, xp, message }
}
