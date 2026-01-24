/**
 * Sistema de Promociones Dinámicas
 *
 * Gestiona campañas, ofertas y descuentos por temporada
 */

export interface Promotion {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  type: 'seasonal' | 'flash' | 'permanent' | 'referral'
  discount: {
    type: 'percentage' | 'fixed' | 'gift'
    value: number
    description: string
  }
  validFrom: string // ISO date
  validTo: string // ISO date
  products: string[] // IDs de productos aplicables, vacío = todos
  conditions: string[]
  code?: string // Código promocional si aplica
  maxUses?: number
  currentUses?: number
  banner: {
    image: string
    mobileImage?: string
    backgroundColor: string
    textColor: string
  }
  landingUrl: string
  isActive: boolean
  priority: number // Mayor = más importante
}

export const promotions: Promotion[] = [
  // ========================================
  // PROMOCIONES DE TEMPORADA
  // ========================================
  {
    id: 'black-friday-2025',
    slug: 'black-friday',
    name: 'Black Friday 2025',
    shortName: 'Black Friday',
    description: 'Los mejores descuentos del año en todos nuestros seguros',
    type: 'seasonal',
    discount: {
      type: 'percentage',
      value: 30,
      description: 'Hasta 30% de descuento',
    },
    validFrom: '2025-11-24T00:00:00',
    validTo: '2025-11-30T23:59:59',
    products: ['auto', 'hogar', 'vida', 'salud'],
    conditions: [
      'Nuevas contrataciones',
      'No acumulable con otras ofertas',
      'Sujeto a condiciones de cada aseguradora',
    ],
    code: 'BLACKFRIDAY25',
    banner: {
      image: '/assets/images/promotions/black-friday-2025.jpg',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
    },
    landingUrl: '/promo/black-friday',
    isActive: true,
    priority: 100,
  },

  {
    id: 'cyber-monday-2025',
    slug: 'cyber-monday',
    name: 'Cyber Monday 2025',
    shortName: 'Cyber Monday',
    description: 'Ofertas exclusivas online solo por 24 horas',
    type: 'flash',
    discount: {
      type: 'percentage',
      value: 25,
      description: '25% de descuento',
    },
    validFrom: '2025-12-01T00:00:00',
    validTo: '2025-12-01T23:59:59',
    products: ['auto', 'hogar'],
    conditions: [
      'Solo contratación online',
      'Válido 24 horas',
    ],
    code: 'CYBER25',
    banner: {
      image: '/assets/images/promotions/cyber-monday-2025.jpg',
      backgroundColor: '#1E40AF',
      textColor: '#FFFFFF',
    },
    landingUrl: '/promo/cyber-monday',
    isActive: true,
    priority: 95,
  },

  {
    id: 'navidad-2025',
    slug: 'navidad',
    name: 'Campaña de Navidad 2025',
    shortName: 'Navidad',
    description: 'Regala tranquilidad estas navidades',
    type: 'seasonal',
    discount: {
      type: 'gift',
      value: 50,
      description: 'Tarjeta regalo de 50€',
    },
    validFrom: '2025-12-01T00:00:00',
    validTo: '2025-12-31T23:59:59',
    products: ['vida', 'salud', 'decesos'],
    conditions: [
      'Al contratar seguros personales',
      'Tarjeta regalo para El Corte Inglés',
    ],
    banner: {
      image: '/assets/images/promotions/navidad-2025.jpg',
      backgroundColor: '#DC2626',
      textColor: '#FFFFFF',
    },
    landingUrl: '/promo/navidad',
    isActive: true,
    priority: 90,
  },

  {
    id: 'verano-2025',
    slug: 'verano',
    name: 'Ofertas de Verano 2025',
    shortName: 'Verano',
    description: 'Viaja seguro este verano con descuentos especiales',
    type: 'seasonal',
    discount: {
      type: 'percentage',
      value: 20,
      description: '20% en seguros de viaje',
    },
    validFrom: '2025-06-01T00:00:00',
    validTo: '2025-08-31T23:59:59',
    products: ['viaje', 'auto', 'mascotas'],
    conditions: [
      'Seguros de viaje y asistencia',
      'Cobertura COVID incluida',
    ],
    banner: {
      image: '/assets/images/promotions/verano-2025.jpg',
      backgroundColor: '#0EA5E9',
      textColor: '#FFFFFF',
    },
    landingUrl: '/promo/verano',
    isActive: false,
    priority: 80,
  },

  {
    id: 'vuelta-cole-2025',
    slug: 'vuelta-cole',
    name: 'Vuelta al Cole 2025',
    shortName: 'Vuelta al Cole',
    description: 'Protege a toda la familia con ofertas especiales',
    type: 'seasonal',
    discount: {
      type: 'percentage',
      value: 15,
      description: '15% para familias',
    },
    validFrom: '2025-09-01T00:00:00',
    validTo: '2025-09-30T23:59:59',
    products: ['salud', 'hogar', 'vida'],
    conditions: [
      'Familias con hijos menores de 18 años',
      'Mínimo 2 seguros contratados',
    ],
    banner: {
      image: '/assets/images/promotions/vuelta-cole-2025.jpg',
      backgroundColor: '#F59E0B',
      textColor: '#000000',
    },
    landingUrl: '/promo/vuelta-cole',
    isActive: false,
    priority: 75,
  },

  {
    id: 'san-valentin-2025',
    slug: 'san-valentin',
    name: 'San Valentín 2025',
    shortName: 'San Valentín',
    description: 'Protege lo que más quieres',
    type: 'seasonal',
    discount: {
      type: 'percentage',
      value: 20,
      description: '2x1 en seguros de vida',
    },
    validFrom: '2025-02-07T00:00:00',
    validTo: '2025-02-14T23:59:59',
    products: ['vida', 'hogar'],
    conditions: [
      'Parejas que contraten juntas',
      '2º asegurado al 50%',
    ],
    banner: {
      image: '/assets/images/promotions/san-valentin-2025.jpg',
      backgroundColor: '#EC4899',
      textColor: '#FFFFFF',
    },
    landingUrl: '/promo/san-valentin',
    isActive: false,
    priority: 70,
  },

  {
    id: 'primavera-2025',
    slug: 'primavera',
    name: 'Ofertas de Primavera 2025',
    shortName: 'Primavera',
    description: 'Renueva tu protección con descuentos frescos',
    type: 'seasonal',
    discount: {
      type: 'percentage',
      value: 15,
      description: '15% en renovaciones',
    },
    validFrom: '2025-03-21T00:00:00',
    validTo: '2025-05-31T23:59:59',
    products: ['hogar', 'auto', 'moto'],
    conditions: [
      'Clientes existentes',
      'Al renovar o añadir pólizas',
    ],
    banner: {
      image: '/assets/images/promotions/primavera-2025.jpg',
      backgroundColor: '#10B981',
      textColor: '#FFFFFF',
    },
    landingUrl: '/promo/primavera',
    isActive: false,
    priority: 65,
  },

  // ========================================
  // PROMOCIONES PERMANENTES
  // ========================================
  {
    id: 'referidos-permanente',
    slug: 'referidos',
    name: 'Programa de Referidos',
    shortName: 'Referidos',
    description: 'Gana 50€ por cada amigo que contrate',
    type: 'referral',
    discount: {
      type: 'fixed',
      value: 50,
      description: '50€ por referido',
    },
    validFrom: '2024-01-01T00:00:00',
    validTo: '2030-12-31T23:59:59',
    products: [],
    conditions: [
      'El referido debe contratar cualquier seguro',
      'Ambos reciben el bonus',
      'Sin límite de referidos',
    ],
    banner: {
      image: '/assets/images/promotions/referidos.jpg',
      backgroundColor: '#8B5CF6',
      textColor: '#FFFFFF',
    },
    landingUrl: '/club/referidos',
    isActive: true,
    priority: 50,
  },

  {
    id: 'paquete-familia',
    slug: 'pack-familia',
    name: 'Pack Familia',
    shortName: 'Pack Familia',
    description: 'Contrata 3 o más seguros y ahorra un 10% adicional',
    type: 'permanent',
    discount: {
      type: 'percentage',
      value: 10,
      description: '10% adicional',
    },
    validFrom: '2024-01-01T00:00:00',
    validTo: '2030-12-31T23:59:59',
    products: [],
    conditions: [
      'Mínimo 3 seguros diferentes',
      'Mismo titular o unidad familiar',
      'Acumulable con otras ofertas',
    ],
    banner: {
      image: '/assets/images/promotions/pack-familia.jpg',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
    },
    landingUrl: '/landing/familias',
    isActive: true,
    priority: 40,
  },

  {
    id: 'jovenes-25',
    slug: 'jovenes',
    name: 'Descuento Jóvenes',
    shortName: 'Jóvenes',
    description: 'Si tienes menos de 30 años, te hacemos precio especial',
    type: 'permanent',
    discount: {
      type: 'percentage',
      value: 15,
      description: '15% para menores de 30',
    },
    validFrom: '2024-01-01T00:00:00',
    validTo: '2030-12-31T23:59:59',
    products: ['auto', 'moto', 'viaje'],
    conditions: [
      'Menores de 30 años',
      'Primer seguro contratado',
    ],
    banner: {
      image: '/assets/images/promotions/jovenes.jpg',
      backgroundColor: '#14B8A6',
      textColor: '#FFFFFF',
    },
    landingUrl: '/landing/jovenes',
    isActive: true,
    priority: 35,
  },
]

// ========================================
// HELPERS
// ========================================

/**
 * Obtener promociones activas ahora mismo
 */
export const getActivePromotions = (): Promotion[] => {
  const now = new Date()
  return promotions
    .filter(p => {
      if (!p.isActive) return false
      const from = new Date(p.validFrom)
      const to = new Date(p.validTo)
      return now >= from && now <= to
    })
    .sort((a, b) => b.priority - a.priority)
}

/**
 * Obtener promoción por slug
 */
export const getPromotionBySlug = (slug: string): Promotion | undefined => {
  return promotions.find(p => p.slug === slug)
}

/**
 * Obtener promociones aplicables a un producto
 */
export const getPromotionsForProduct = (productId: string): Promotion[] => {
  return getActivePromotions().filter(p =>
    p.products.length === 0 || p.products.includes(productId)
  )
}

/**
 * Verificar si un código promocional es válido
 */
export const validatePromoCode = (code: string): Promotion | null => {
  const promo = promotions.find(
    p => p.code?.toUpperCase() === code.toUpperCase()
  )
  if (!promo) return null

  const now = new Date()
  const from = new Date(promo.validFrom)
  const to = new Date(promo.validTo)

  if (!promo.isActive || now < from || now > to) return null
  if (promo.maxUses && promo.currentUses && promo.currentUses >= promo.maxUses) return null

  return promo
}
