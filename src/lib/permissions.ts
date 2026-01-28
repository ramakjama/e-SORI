/**
 * Sistema de Permisos por Nivel de Cliente
 *
 * Define qué funcionalidades están disponibles para cada nivel de usuario.
 * El sistema es escalable y progresivo: mejores niveles = más funcionalidades.
 */

export type UserLevel = 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO'

export type Feature =
  // Dashboard básico
  | 'dashboard.view'
  | 'dashboard.analytics.basic'
  | 'dashboard.analytics.advanced'

  // Pólizas
  | 'polizas.view'
  | 'polizas.download'
  | 'polizas.cotizar.basic'
  | 'polizas.cotizar.advanced'
  | 'polizas.renovacion.auto'

  // Siniestros
  | 'siniestros.view'
  | 'siniestros.create'
  | 'siniestros.tracking'
  | 'siniestros.priority'

  // Pagos
  | 'pagos.view'
  | 'pagos.fraccionamiento'
  | 'pagos.domiciliacion'

  // Documentos
  | 'documentos.view'
  | 'documentos.upload.basic'
  | 'documentos.upload.unlimited'
  | 'documentos.storage.5gb'
  | 'documentos.storage.20gb'
  | 'documentos.storage.unlimited'

  // Mensajería
  | 'mensajes.view'
  | 'mensajes.send'
  | 'mensajes.priority'
  | 'mensajes.video.call'

  // Perfil
  | 'perfil.view'
  | 'perfil.edit'

  // Sori HUB (Gamificación)
  | 'Sori HUB.access'
  | 'Sori HUB.quizzes'
  | 'Sori HUB.clasificacion'
  | 'Sori HUB.referidos'
  | 'Sori HUB.logros'
  | 'Sori HUB.marketplace.view'
  | 'Sori HUB.marketplace.buy'
  | 'Sori HUB.premium.content'

  // Descuentos y beneficios
  | 'descuentos.basic'
  | 'descuentos.advanced'
  | 'descuentos.premium'

  // Soporte
  | 'soporte.email'
  | 'soporte.chat'
  | 'soporte.priority'
  | 'soporte.dedicated'

/**
 * Configuración de permisos por nivel
 * Cada nivel hereda los permisos del anterior + nuevos permisos
 */
export const LEVEL_PERMISSIONS: Record<UserLevel, Feature[]> = {
  BRONCE: [
    // Dashboard básico
    'dashboard.view',
    'dashboard.analytics.basic',

    // Pólizas básicas
    'polizas.view',
    'polizas.cotizar.basic',

    // Siniestros básicos
    'siniestros.view',
    'siniestros.create',

    // Pagos básicos
    'pagos.view',

    // Documentos limitados
    'documentos.view',
    'documentos.upload.basic', // Máx 5 archivos/mes
    'documentos.storage.5gb',

    // Mensajería básica
    'mensajes.view',
    'mensajes.send',

    // Perfil
    'perfil.view',
    'perfil.edit',

    // Sori HUB limitado
    'Sori HUB.access',
    'Sori HUB.quizzes',
    'Sori HUB.clasificacion',

    // Descuentos básicos
    'descuentos.basic', // 5% descuento

    // Soporte email
    'soporte.email',
  ],

  PLATA: [
    // Hereda todos los de BRONCE +
    ...[], // Se añadirán dinámicamente

    // Dashboard mejorado
    'dashboard.analytics.advanced',

    // Pólizas avanzadas
    'polizas.download',
    'polizas.cotizar.advanced',

    // Siniestros con tracking
    'siniestros.tracking',

    // Pagos con fraccionamiento
    'pagos.fraccionamiento',

    // Documentos ampliados
    'documentos.upload.unlimited',
    'documentos.storage.20gb',

    // Chat en tiempo real
    'soporte.chat',

    // Sori HUB ampliado
    'Sori HUB.referidos',
    'Sori HUB.logros',
    'Sori HUB.marketplace.view',

    // Descuentos mejorados
    'descuentos.advanced', // 10% descuento
  ],

  ORO: [
    // Hereda todos los de PLATA +
    ...[], // Se añadirán dinámicamente

    // Renovación automática
    'polizas.renovacion.auto',

    // Siniestros prioritarios
    'siniestros.priority',

    // Pagos con domiciliación
    'pagos.domiciliacion',

    // Mensajes prioritarios
    'mensajes.priority',

    // Marketplace con compras
    'Sori HUB.marketplace.buy',
    'Sori HUB.premium.content',

    // Descuentos premium
    'descuentos.premium', // 15% descuento

    // Soporte prioritario
    'soporte.priority', // Respuesta en 1h
  ],

  PLATINO: [
    // Hereda todos los de ORO +
    ...[], // Se añadirán dinámicamente

    // Storage ilimitado
    'documentos.storage.unlimited',

    // Videollamadas
    'mensajes.video.call',

    // Gestor dedicado
    'soporte.dedicated',

    // Acceso total a funcionalidades premium
  ],
}

/**
 * Construye el set completo de permisos para un nivel,
 * heredando los permisos de niveles inferiores
 */
const buildPermissionsHierarchy = () => {
  const levels: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']

  for (let i = 1; i < levels.length; i++) {
    const currentLevel = levels[i]
    const previousLevel = levels[i - 1]

    // Hereda permisos del nivel anterior
    const inherited = LEVEL_PERMISSIONS[previousLevel]
    const current = LEVEL_PERMISSIONS[currentLevel]

    // Filtra duplicados y combina
    LEVEL_PERMISSIONS[currentLevel] = [
      ...inherited,
      ...current.filter(p => !inherited.includes(p))
    ]
  }
}

// Construir jerarquía al cargar el módulo
buildPermissionsHierarchy()

/**
 * Verifica si un usuario tiene permiso para una funcionalidad
 */
export function hasPermission(userLevel: UserLevel | undefined, feature: Feature): boolean {
  if (!userLevel) return false

  const permissions = LEVEL_PERMISSIONS[userLevel]
  return permissions.includes(feature)
}

/**
 * Obtiene todos los permisos de un nivel
 */
export function getPermissions(userLevel: UserLevel): Feature[] {
  return LEVEL_PERMISSIONS[userLevel] || []
}

/**
 * Obtiene información del nivel de usuario
 */
export interface LevelInfo {
  level: UserLevel
  name: string
  icon: string
  color: string
  badge: string
  discount: string
  features: string[]
  supportResponseTime: string
  nextLevel: UserLevel | null
}

export function getLevelInfo(level: UserLevel): LevelInfo {
  const levelData: Record<UserLevel, LevelInfo> = {
    BRONCE: {
      level: 'BRONCE',
      name: 'Bronce',
      icon: '🥉',
      color: 'from-amber-700 to-amber-900',
      badge: 'badge-bronce',
      discount: '5%',
      features: [
        'Acceso básico a todas las funcionalidades',
        'Cotización de pólizas',
        'Gestión de siniestros',
        'Chat con soporte',
      ],
      supportResponseTime: '24h',
      nextLevel: 'PLATA',
    },
    PLATA: {
      level: 'PLATA',
      name: 'Plata',
      icon: '🥈',
      color: 'from-gray-400 to-gray-600',
      badge: 'badge-plata',
      discount: '10%',
      features: [
        'Todo lo de Bronce +',
        'Análisis avanzados',
        'Tracking de siniestros en tiempo real',
        'Fraccionamiento de pagos',
        '20GB de almacenamiento',
      ],
      supportResponseTime: '12h',
      nextLevel: 'ORO',
    },
    ORO: {
      level: 'ORO',
      name: 'Oro',
      icon: '🏆',
      color: 'from-yellow-500 to-yellow-700',
      badge: 'badge-oro',
      discount: '15%',
      features: [
        'Todo lo de Plata +',
        'Renovación automática de pólizas',
        'Atención prioritaria',
        'Acceso a marketplace premium',
        'Contenido exclusivo Sori HUB',
      ],
      supportResponseTime: '1h',
      nextLevel: 'PLATINO',
    },
    PLATINO: {
      level: 'PLATINO',
      name: 'Platino',
      icon: '👑',
      color: 'from-purple-500 to-purple-700',
      badge: 'badge-platino',
      discount: '20%',
      features: [
        'Todo lo de Oro +',
        'Gestor dedicado 24/7',
        'Videollamadas con tu gestor',
        'Almacenamiento ilimitado',
        'Todas las funcionalidades premium',
      ],
      supportResponseTime: 'Inmediato',
      nextLevel: null,
    },
  }

  return levelData[level]
}

/**
 * Calcula el progreso hacia el siguiente nivel
 */
export interface LevelProgress {
  currentLevel: UserLevel
  nextLevel: UserLevel | null
  currentPoints: number
  pointsToNext: number
  progressPercentage: number
}

export function calculateLevelProgress(
  currentLevel: UserLevel,
  points: number
): LevelProgress {
  const thresholds: Record<UserLevel, number> = {
    BRONCE: 0,
    PLATA: 1000,
    ORO: 5000,
    PLATINO: 15000,
  }

  const levelOrder: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']
  const currentIndex = levelOrder.indexOf(currentLevel)
  const nextLevel = currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null

  if (!nextLevel) {
    // Ya está en el nivel máximo
    return {
      currentLevel,
      nextLevel: null,
      currentPoints: points,
      pointsToNext: 0,
      progressPercentage: 100,
    }
  }

  const currentThreshold = thresholds[currentLevel]
  const nextThreshold = thresholds[nextLevel]
  const pointsInLevel = points - currentThreshold
  const pointsNeeded = nextThreshold - currentThreshold

  return {
    currentLevel,
    nextLevel,
    currentPoints: points,
    pointsToNext: nextThreshold - points,
    progressPercentage: Math.min(100, (pointsInLevel / pointsNeeded) * 100),
  }
}

/**
 * Hook helper para componentes React
 */
export function usePermissions(userLevel: UserLevel | undefined) {
  return {
    hasPermission: (feature: Feature) => hasPermission(userLevel, feature),
    getPermissions: () => userLevel ? getPermissions(userLevel) : [],
    getLevelInfo: () => userLevel ? getLevelInfo(userLevel) : null,
  }
}
