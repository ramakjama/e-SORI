/**
 * Configuración de Productos de Seguros
 *
 * Cada producto incluye:
 * - Información comercial
 * - Precios orientativos
 * - Coberturas
 * - Documentos asociados (PDFs)
 */

export interface ProductDocument {
  id: string
  name: string
  description: string
  type: 'condicionado' | 'folleto' | 'ipid' | 'nota-informativa' | 'contrato'
  url: string
  partner?: string // Aseguradora si es específico
}

export interface ProductCoverage {
  id: string
  name: string
  description: string
  included: boolean
  optional?: boolean
}

export interface ProductPrice {
  from: number
  to?: number
  period: 'mes' | 'año' | 'día'
  currency: '€'
}

export interface InsuranceProduct {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  icon: string
  color: string
  price: ProductPrice
  coverages: ProductCoverage[]
  documents: ProductDocument[]
  partners: string[] // IDs de aseguradoras que ofrecen este producto
  features: string[]
  targetAudience: string[]
  landingUrl: string
}

export const products: InsuranceProduct[] = [
  // ========================================
  // SEGURO DE AUTO
  // ========================================
  {
    id: 'auto',
    slug: 'seguro-auto',
    name: 'Seguro de Coche',
    shortName: 'Auto',
    description: 'Protección completa para tu vehículo con las mejores coberturas y asistencia 24 horas.',
    icon: 'Car',
    color: '#3B82F6',
    price: { from: 15, period: 'mes', currency: '€' },
    coverages: [
      { id: 'rc', name: 'Responsabilidad Civil', description: 'Obligatoria por ley', included: true },
      { id: 'defensa', name: 'Defensa Jurídica', description: 'Asistencia legal en accidentes', included: true },
      { id: 'lunas', name: 'Rotura de Lunas', description: 'Reparación o sustitución', included: true },
      { id: 'robo', name: 'Robo', description: 'Cobertura ante robo del vehículo', included: true, optional: true },
      { id: 'incendio', name: 'Incendio', description: 'Daños por fuego', included: true },
      { id: 'asistencia', name: 'Asistencia en Viaje', description: 'Grúa y ayuda 24h', included: true },
      { id: 'danos-propios', name: 'Daños Propios', description: 'Todo riesgo', included: false, optional: true },
    ],
    documents: [
      {
        id: 'auto-condicionado-occident',
        name: 'Condicionado General Auto',
        description: 'Condiciones generales del seguro de automóvil',
        type: 'condicionado',
        url: '/documents/productos/auto/condicionado-general-occident.pdf',
        partner: 'occident',
      },
      {
        id: 'auto-ipid-occident',
        name: 'IPID Auto',
        description: 'Documento de Información del Producto de Seguro',
        type: 'ipid',
        url: '/documents/productos/auto/ipid-auto-occident.pdf',
        partner: 'occident',
      },
      {
        id: 'auto-folleto',
        name: 'Folleto Informativo',
        description: 'Resumen de coberturas y ventajas',
        type: 'folleto',
        url: '/documents/folletos/folleto-auto.pdf',
      },
      {
        id: 'auto-nota-informativa',
        name: 'Nota Informativa Previa',
        description: 'Información previa a la contratación',
        type: 'nota-informativa',
        url: '/documents/productos/auto/nota-informativa-auto.pdf',
      },
    ],
    partners: ['occident', 'axa', 'mapfre', 'allianz', 'generali'],
    features: [
      'Asistencia en carretera 24h',
      'Vehículo de sustitución',
      'Sin franquicia en lunas',
      'Conductor ocasional gratis',
    ],
    targetAudience: ['particulares', 'familias', 'jovenes', 'autonomos'],
    landingUrl: '/landing/seguro-auto',
  },

  // ========================================
  // SEGURO DE HOGAR
  // ========================================
  {
    id: 'hogar',
    slug: 'seguro-hogar',
    name: 'Seguro de Hogar',
    shortName: 'Hogar',
    description: 'Protege tu vivienda y todo lo que hay en ella con coberturas completas.',
    icon: 'Home',
    color: '#10B981',
    price: { from: 8, period: 'mes', currency: '€' },
    coverages: [
      { id: 'continente', name: 'Continente', description: 'Estructura del edificio', included: true },
      { id: 'contenido', name: 'Contenido', description: 'Muebles y enseres', included: true },
      { id: 'rc-familiar', name: 'RC Familiar', description: 'Responsabilidad civil', included: true },
      { id: 'agua', name: 'Daños por Agua', description: 'Goteras y escapes', included: true },
      { id: 'robo', name: 'Robo', description: 'Hurto y atraco', included: true },
      { id: 'incendio', name: 'Incendio', description: 'Fuego y explosión', included: true },
      { id: 'asistencia', name: 'Asistencia Hogar', description: 'Fontanero, cerrajero, etc.', included: true },
      { id: 'joyas', name: 'Joyas y Objetos de Valor', description: 'Cobertura especial', included: false, optional: true },
    ],
    documents: [
      {
        id: 'hogar-condicionado-occident',
        name: 'Condicionado General Hogar',
        description: 'Condiciones generales del seguro de hogar',
        type: 'condicionado',
        url: '/documents/productos/hogar/condicionado-general-occident.pdf',
        partner: 'occident',
      },
      {
        id: 'hogar-ipid-occident',
        name: 'IPID Hogar',
        description: 'Documento de Información del Producto',
        type: 'ipid',
        url: '/documents/productos/hogar/ipid-hogar-occident.pdf',
        partner: 'occident',
      },
      {
        id: 'hogar-folleto',
        name: 'Folleto Informativo',
        description: 'Resumen de coberturas',
        type: 'folleto',
        url: '/documents/folletos/folleto-hogar.pdf',
      },
    ],
    partners: ['occident', 'axa', 'mapfre', 'allianz', 'generali', 'santalucia'],
    features: [
      'Asistencia urgencias 24h',
      'Sin franquicias',
      'RC familiar incluida',
      'Cobertura mundial temporal',
    ],
    targetAudience: ['particulares', 'familias', 'propietarios', 'inquilinos'],
    landingUrl: '/landing/seguro-hogar',
  },

  // ========================================
  // SEGURO DE SALUD
  // ========================================
  {
    id: 'salud',
    slug: 'seguro-salud',
    name: 'Seguro de Salud',
    shortName: 'Salud',
    description: 'Acceso a los mejores especialistas y centros médicos sin esperas.',
    icon: 'Heart',
    color: '#EF4444',
    price: { from: 35, period: 'mes', currency: '€' },
    coverages: [
      { id: 'medicina-general', name: 'Medicina General', description: 'Consultas sin límite', included: true },
      { id: 'especialistas', name: 'Especialistas', description: '+40.000 profesionales', included: true },
      { id: 'hospitalizacion', name: 'Hospitalización', description: 'Habitación individual', included: true },
      { id: 'urgencias', name: 'Urgencias 24h', description: 'Atención inmediata', included: true },
      { id: 'pruebas', name: 'Pruebas Diagnósticas', description: 'Análisis, radiografías, etc.', included: true },
      { id: 'dental', name: 'Dental Básico', description: 'Limpieza y revisiones', included: true },
      { id: 'cirugia', name: 'Cirugía', description: 'Intervenciones quirúrgicas', included: true },
      { id: 'reembolso', name: 'Reembolso de Gastos', description: 'Uso de médicos externos', included: false, optional: true },
    ],
    documents: [
      {
        id: 'salud-condicionado-dkv',
        name: 'Condicionado General Salud',
        description: 'Condiciones generales del seguro de salud',
        type: 'condicionado',
        url: '/documents/productos/salud/condicionado-general-dkv.pdf',
        partner: 'dkv',
      },
      {
        id: 'salud-cuadro-medico',
        name: 'Cuadro Médico',
        description: 'Listado de centros y profesionales',
        type: 'folleto',
        url: '/documents/productos/salud/cuadro-medico.pdf',
      },
      {
        id: 'salud-ipid',
        name: 'IPID Salud',
        description: 'Documento de Información del Producto',
        type: 'ipid',
        url: '/documents/productos/salud/ipid-salud.pdf',
      },
    ],
    partners: ['dkv', 'asisa', 'axa', 'allianz'],
    features: [
      'Sin copagos',
      '+44.000 servicios médicos',
      'App para citas',
      'Segunda opinión médica',
    ],
    targetAudience: ['particulares', 'familias', 'empresas', 'autonomos'],
    landingUrl: '/landing/seguro-salud',
  },

  // ========================================
  // SEGURO DE VIDA
  // ========================================
  {
    id: 'vida',
    slug: 'seguro-vida',
    name: 'Seguro de Vida',
    shortName: 'Vida',
    description: 'Protección económica para tu familia ante cualquier imprevisto.',
    icon: 'Shield',
    color: '#8B5CF6',
    price: { from: 5, period: 'mes', currency: '€' },
    coverages: [
      { id: 'fallecimiento', name: 'Fallecimiento', description: 'Capital a beneficiarios', included: true },
      { id: 'invalidez', name: 'Invalidez Absoluta', description: 'IPA', included: true },
      { id: 'invalidez-parcial', name: 'Invalidez Parcial', description: 'IPP', included: false, optional: true },
      { id: 'enfermedades-graves', name: 'Enfermedades Graves', description: 'Anticipo capital', included: false, optional: true },
      { id: 'doble-capital', name: 'Doble Capital Accidente', description: 'x2 por accidente', included: true },
    ],
    documents: [
      {
        id: 'vida-condicionado-occident',
        name: 'Condicionado General Vida',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/vida/condicionado-general-occident.pdf',
        partner: 'occident',
      },
      {
        id: 'vida-ipid',
        name: 'IPID Vida',
        description: 'Documento de Información del Producto',
        type: 'ipid',
        url: '/documents/productos/vida/ipid-vida.pdf',
      },
      {
        id: 'vida-folleto',
        name: 'Folleto Informativo',
        description: 'Guía del seguro de vida',
        type: 'folleto',
        url: '/documents/folletos/folleto-vida.pdf',
      },
    ],
    partners: ['occident', 'mapfre', 'allianz', 'generali', 'santalucia'],
    features: [
      'Hasta 300.000€ de capital',
      'Beneficio fiscal (IRPF)',
      'Sin exámenes médicos*',
      'Prima garantizada',
    ],
    targetAudience: ['particulares', 'familias', 'hipotecados'],
    landingUrl: '/landing/seguro-vida',
  },

  // ========================================
  // SEGURO DE DECESOS
  // ========================================
  {
    id: 'decesos',
    slug: 'seguro-decesos',
    name: 'Seguro de Decesos',
    shortName: 'Decesos',
    description: 'Tranquilidad para ti y tu familia. Todos los servicios cubiertos.',
    icon: 'Heart',
    color: '#6B7280',
    price: { from: 6, period: 'mes', currency: '€' },
    coverages: [
      { id: 'servicio-completo', name: 'Servicio Completo', description: 'Todos los gastos cubiertos', included: true },
      { id: 'traslados', name: 'Traslados', description: 'Nacional e internacional', included: true },
      { id: 'tramites', name: 'Gestión de Trámites', description: 'Documentación y papeleo', included: true },
      { id: 'asistencia-familia', name: 'Asistencia Familiar', description: 'Apoyo psicológico', included: true },
      { id: 'viaje-acompanante', name: 'Viaje Acompañante', description: 'Si fallece lejos', included: true },
    ],
    documents: [
      {
        id: 'decesos-condicionado-occident',
        name: 'Condicionado General Decesos',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/decesos/condicionado-general-occident.pdf',
        partner: 'occident',
      },
      {
        id: 'decesos-ipid',
        name: 'IPID Decesos',
        description: 'Documento de Información del Producto',
        type: 'ipid',
        url: '/documents/productos/decesos/ipid-decesos.pdf',
      },
    ],
    partners: ['occident', 'santalucia', 'mapfre'],
    features: [
      'Sin carencias',
      'Familia completa',
      'Cobertura mundial',
      'Servicios 24h',
    ],
    targetAudience: ['particulares', 'familias', 'mayores'],
    landingUrl: '/landing/seguro-decesos',
  },

  // ========================================
  // SEGURO DE COMERCIO
  // ========================================
  {
    id: 'comercio',
    slug: 'seguro-comercio',
    name: 'Seguro de Comercio',
    shortName: 'Comercio',
    description: 'Protección integral para tu negocio, local y mercancías.',
    icon: 'Store',
    color: '#F59E0B',
    price: { from: 25, period: 'mes', currency: '€' },
    coverages: [
      { id: 'continente', name: 'Continente', description: 'Local comercial', included: true },
      { id: 'contenido', name: 'Contenido', description: 'Mercancías y mobiliario', included: true },
      { id: 'rc', name: 'RC Explotación', description: 'Responsabilidad civil', included: true },
      { id: 'robo', name: 'Robo', description: 'Atraco y hurto', included: true },
      { id: 'perdida-beneficios', name: 'Pérdida de Beneficios', description: 'Por paralización', included: false, optional: true },
      { id: 'averia-maquinaria', name: 'Avería de Maquinaria', description: 'Equipos electrónicos', included: false, optional: true },
    ],
    documents: [
      {
        id: 'comercio-condicionado',
        name: 'Condicionado General Comercio',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/comercio/condicionado-general.pdf',
      },
      {
        id: 'comercio-ipid',
        name: 'IPID Comercio',
        description: 'Documento de Información del Producto',
        type: 'ipid',
        url: '/documents/productos/comercio/ipid-comercio.pdf',
      },
    ],
    partners: ['occident', 'axa', 'mapfre', 'allianz'],
    features: [
      'Asistencia 24h',
      'Defensa jurídica',
      'Cobertura de empleados',
      'Daños eléctricos',
    ],
    targetAudience: ['autonomos', 'empresas', 'comercios'],
    landingUrl: '/landing/seguro-comercio',
  },

  // ========================================
  // SEGURO DE MASCOTAS
  // ========================================
  {
    id: 'mascotas',
    slug: 'seguro-mascotas',
    name: 'Seguro de Mascotas',
    shortName: 'Mascotas',
    description: 'Protección veterinaria y RC para tu mejor amigo.',
    icon: 'Dog',
    color: '#EC4899',
    price: { from: 8, period: 'mes', currency: '€' },
    coverages: [
      { id: 'rc', name: 'Responsabilidad Civil', description: 'Daños a terceros', included: true },
      { id: 'veterinario', name: 'Gastos Veterinarios', description: 'Accidente y enfermedad', included: true },
      { id: 'robo', name: 'Robo/Extravío', description: 'Búsqueda y recompensa', included: true },
      { id: 'sacrificio', name: 'Sacrificio Necesario', description: 'Por accidente', included: true },
    ],
    documents: [
      {
        id: 'mascotas-condicionado',
        name: 'Condicionado General Mascotas',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/mascotas/condicionado-general.pdf',
      },
    ],
    partners: ['occident', 'mapfre'],
    features: [
      'Perros y gatos',
      'Sin límite de edad',
      'RC obligatoria PPP',
      'Consultas ilimitadas',
    ],
    targetAudience: ['particulares', 'familias'],
    landingUrl: '/landing/seguro-mascotas',
  },

  // ========================================
  // SEGURO DE MOTO
  // ========================================
  {
    id: 'moto',
    slug: 'seguro-moto',
    name: 'Seguro de Moto',
    shortName: 'Moto',
    description: 'Protección para tu moto, scooter o ciclomotor.',
    icon: 'Bike',
    color: '#0EA5E9',
    price: { from: 10, period: 'mes', currency: '€' },
    coverages: [
      { id: 'rc', name: 'Responsabilidad Civil', description: 'Obligatoria', included: true },
      { id: 'defensa', name: 'Defensa Jurídica', description: 'Asistencia legal', included: true },
      { id: 'robo', name: 'Robo', description: 'Sustracción', included: true },
      { id: 'asistencia', name: 'Asistencia en Viaje', description: 'Grúa 24h', included: true },
      { id: 'equipamiento', name: 'Equipamiento', description: 'Casco y ropa', included: false, optional: true },
    ],
    documents: [
      {
        id: 'moto-condicionado',
        name: 'Condicionado General Moto',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/moto/condicionado-general.pdf',
      },
    ],
    partners: ['occident', 'mapfre', 'axa'],
    features: [
      'Desde ciclomotor hasta gran cilindrada',
      'Equipamiento incluido',
      'Asistencia europea',
      'Sin franquicias',
    ],
    targetAudience: ['particulares', 'jovenes'],
    landingUrl: '/landing/seguro-moto',
  },

  // ========================================
  // SEGURO DE VIAJE
  // ========================================
  {
    id: 'viaje',
    slug: 'seguro-viaje',
    name: 'Seguro de Viaje',
    shortName: 'Viaje',
    description: 'Viaja tranquilo con cobertura médica y de equipaje en todo el mundo.',
    icon: 'Plane',
    color: '#14B8A6',
    price: { from: 3, period: 'día', currency: '€' },
    coverages: [
      { id: 'asistencia-medica', name: 'Asistencia Médica', description: 'Hasta 300.000€', included: true },
      { id: 'repatriacion', name: 'Repatriación', description: 'Sanitaria y funeraria', included: true },
      { id: 'equipaje', name: 'Equipaje', description: 'Pérdida y robo', included: true },
      { id: 'cancelacion', name: 'Cancelación', description: 'Anulación del viaje', included: true },
      { id: 'demora', name: 'Demora de Vuelo', description: 'Gastos por retrasos', included: true },
    ],
    documents: [
      {
        id: 'viaje-condicionado',
        name: 'Condicionado General Viaje',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/viaje/condicionado-general.pdf',
      },
    ],
    partners: ['axa', 'mapfre', 'allianz'],
    features: [
      'Cobertura mundial',
      'COVID-19 incluido',
      'App de asistencia',
      'Familiar o individual',
    ],
    targetAudience: ['particulares', 'familias', 'empresas'],
    landingUrl: '/landing/seguro-viaje',
  },

  // ========================================
  // RC PROFESIONAL
  // ========================================
  {
    id: 'rc-profesional',
    slug: 'seguro-rc-profesional',
    name: 'RC Profesional',
    shortName: 'RC Prof.',
    description: 'Protección ante reclamaciones por errores profesionales.',
    icon: 'Briefcase',
    color: '#6366F1',
    price: { from: 15, period: 'mes', currency: '€' },
    coverages: [
      { id: 'rc', name: 'RC Profesional', description: 'Errores y omisiones', included: true },
      { id: 'defensa', name: 'Defensa Jurídica', description: 'Costas judiciales', included: true },
      { id: 'inhabilitacion', name: 'Inhabilitación', description: 'Subsidio diario', included: false, optional: true },
    ],
    documents: [
      {
        id: 'rc-profesional-condicionado',
        name: 'Condicionado General RC Profesional',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/rc-profesional/condicionado-general.pdf',
      },
    ],
    partners: ['occident', 'axa', 'allianz'],
    features: [
      'Todas las profesiones',
      'Retroactividad ilimitada',
      'Cobertura mundial',
      'Defensa penal incluida',
    ],
    targetAudience: ['autonomos', 'profesionales', 'empresas'],
    landingUrl: '/landing/seguro-rc-profesional',
  },

  // ========================================
  // SEGURO DE COMUNIDADES
  // ========================================
  {
    id: 'comunidades',
    slug: 'seguro-comunidades',
    name: 'Seguro de Comunidades',
    shortName: 'Comunidades',
    description: 'Protección integral para comunidades de propietarios.',
    icon: 'Building',
    color: '#78716C',
    price: { from: 50, period: 'mes', currency: '€' },
    coverages: [
      { id: 'continente', name: 'Continente', description: 'Edificio completo', included: true },
      { id: 'rc', name: 'RC Comunidad', description: 'Responsabilidad civil', included: true },
      { id: 'agua', name: 'Daños por Agua', description: 'Tuberías y goteras', included: true },
      { id: 'defensa', name: 'Defensa Jurídica', description: 'Reclamaciones', included: true },
      { id: 'empleados', name: 'Accidentes Empleados', description: 'Porteros, limpiadores', included: true },
    ],
    documents: [
      {
        id: 'comunidades-condicionado',
        name: 'Condicionado General Comunidades',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/comunidades/condicionado-general.pdf',
      },
    ],
    partners: ['occident', 'mapfre', 'axa'],
    features: [
      'Asistencia 24h',
      'Daños estéticos',
      'RC del presidente',
      'Defensa de morosos',
    ],
    targetAudience: ['comunidades', 'administradores'],
    landingUrl: '/landing/seguro-comunidades',
  },

  // ========================================
  // SEGURO DE ACCIDENTES
  // ========================================
  {
    id: 'accidentes',
    slug: 'seguro-accidentes',
    name: 'Seguro de Accidentes',
    shortName: 'Accidentes',
    description: 'Protección económica ante accidentes personales.',
    icon: 'AlertTriangle',
    color: '#DC2626',
    price: { from: 5, period: 'mes', currency: '€' },
    coverages: [
      { id: 'fallecimiento', name: 'Fallecimiento', description: 'Por accidente', included: true },
      { id: 'invalidez', name: 'Invalidez Permanente', description: 'Total o parcial', included: true },
      { id: 'gastos-medicos', name: 'Gastos Médicos', description: 'Tratamientos', included: true },
      { id: 'hospitalizacion', name: 'Hospitalización', description: 'Subsidio diario', included: false, optional: true },
    ],
    documents: [
      {
        id: 'accidentes-condicionado',
        name: 'Condicionado General Accidentes',
        description: 'Condiciones generales',
        type: 'condicionado',
        url: '/documents/productos/accidentes/condicionado-general.pdf',
      },
    ],
    partners: ['occident', 'mapfre', 'generali'],
    features: [
      '24h cobertura',
      'Deportes incluidos',
      'Sin franquicias',
      'Convenios colectivos',
    ],
    targetAudience: ['particulares', 'deportistas', 'empresas'],
    landingUrl: '/landing/seguro-accidentes',
  },
]

// Helper para obtener producto por ID
export const getProductById = (id: string) => products.find(p => p.id === id)

// Helper para obtener producto por slug
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug)
