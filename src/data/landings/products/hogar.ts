import { LandingContent } from '@/lib/landing/types'

export const hogarLanding: LandingContent = {
  config: {
    slug: 'seguro-hogar',
    title: 'Seguro de Hogar | Soriano Mediadores',
    description: 'Seguro de hogar completo con asistencia 24h. Protege tu casa, tus pertenencias y a tu familia al mejor precio.',
    keywords: ['seguro hogar', 'seguro casa', 'seguro vivienda', 'protección hogar'],
    insuranceType: 'HOGAR',
    theme: 'hogar',
    source: 'landing-seguro-hogar',
    gamificationPoints: 200,
    showPricing: true,
  },

  hero: {
    title: 'Tu hogar,\\nsiempre protegido',
    subtitle: 'Cobertura total para tu casa y pertenencias. Asistencia urgente 24h: fontanero, electricista, cerrajero y más.',
    badge: 'Desde 8€/mes',
    ctaPrimary: { text: 'Calcular mi precio', scrollTo: 'cta-section' },
    ctaSecondary: { text: 'Ver coberturas', href: '#coverages' },
  },

  trustBar: {
    items: [
      { icon: 'Home', text: 'Continente + Contenido', highlight: '' },
      { icon: 'Wrench', text: 'Asistencia', highlight: '24h' },
      { icon: 'Shield', text: 'RC familiar', highlight: 'incluida' },
      { icon: 'Clock', text: 'Respuesta', highlight: '<2h' },
    ],
  },

  coverages: {
    title: 'Protección a tu medida',
    subtitle: 'Todas incluyen asistencia urgente y responsabilidad civil',
    cards: [
      {
        id: 'basico',
        name: 'Básico',
        price: 'Desde 8€',
        period: 'mes',
        description: 'Protección esencial',
        features: [
          'Incendio y explosión',
          'Daños por agua',
          'Robo con fuerza',
          'Responsabilidad civil 150.000€',
          { text: 'Asistencia hogar', included: false },
        ],
        ctaText: 'Solicitar precio',
      },
      {
        id: 'completo',
        name: 'Completo',
        price: 'Desde 15€',
        period: 'mes',
        description: 'El más contratado',
        popular: true,
        features: [
          'Todo lo de Básico',
          'Asistencia hogar 24h ilimitada',
          'Rotura de cristales',
          'Daños estéticos',
          'RC familiar 300.000€',
        ],
        ctaText: 'Solicitar precio',
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 25€',
        period: 'mes',
        description: 'Máxima tranquilidad',
        features: [
          'Todo lo anterior',
          'Valor a nuevo sin límite',
          'Joyas y objetos de valor',
          'RC familiar 600.000€',
          'Alojamiento alternativo',
        ],
        ctaText: 'Solicitar precio',
      },
    ],
  },

  benefits: {
    title: 'Servicios de asistencia incluidos',
    subtitle: 'Profesionales en tu puerta en menos de 2 horas',
    items: [
      { icon: 'Droplet', title: 'Fontanería urgente', description: 'Reparación de fugas, atascos y averías de agua 24h.' },
      { icon: 'Zap', title: 'Electricidad', description: 'Averías eléctricas, cortocircuitos y apagones.' },
      { icon: 'Key', title: 'Cerrajería', description: 'Apertura de puertas, cambio de cerraduras y urgencias.' },
      { icon: 'Thermometer', title: 'Calefacción/AC', description: 'Reparación de calderas y aires acondicionados.' },
      { icon: 'Bug', title: 'Control de plagas', description: 'Desinsectación y desratización profesional.' },
      { icon: 'Shield', title: 'Seguridad', description: 'Vigilancia temporal tras robo o intrusión.' },
    ],
  },

  stats: {
    items: [
      { value: 18000, suffix: '+', label: 'Hogares protegidos' },
      { value: 2, suffix: 'h', label: 'Tiempo respuesta' },
      { value: 99, suffix: '%', label: 'Satisfacción' },
      { value: 50000, suffix: '+', label: 'Asistencias/año' },
    ],
  },

  testimonials: {
    title: 'Hogares satisfechos',
    items: [
      {
        id: '1',
        name: 'Laura Martínez',
        role: 'Cliente desde 2020',
        content: 'Tuve una fuga a las 3 de la mañana y en 1 hora tenía al fontanero en casa. Increíble servicio.',
        rating: 5,
        insuranceType: 'Completo',
      },
      {
        id: '2',
        name: 'Pedro Sánchez',
        role: 'Cliente desde 2018',
        content: 'Nos robaron y la gestión fue impecable. Nos repusieron todo el valor de lo robado sin problemas.',
        rating: 5,
        insuranceType: 'Premium',
      },
    ],
  },

  faq: {
    title: 'Dudas frecuentes',
    items: [
      {
        question: '¿Qué diferencia hay entre continente y contenido?',
        answer: 'El continente es la estructura de la vivienda (paredes, suelos, techos). El contenido son tus pertenencias (muebles, electrodomésticos, ropa, etc.).',
      },
      {
        question: '¿Cubre a los inquilinos o solo a propietarios?',
        answer: 'Cubrimos ambos casos. Si eres inquilino, aseguramos tu contenido y responsabilidad civil. Si eres propietario, también el continente.',
      },
      {
        question: '¿La asistencia tiene límite de llamadas?',
        answer: 'En las modalidades Completo y Premium, la asistencia es ilimitada. Puedes llamar tantas veces como necesites.',
      },
    ],
  },

  cta: {
    title: 'Protege tu hogar desde hoy',
    subtitle: 'Presupuesto inmediato sin compromiso',
    features: [
      'Asistencia urgente 24h incluida',
      'RC familiar para toda tu familia',
      'Sin franquicias ocultas',
      '+200 puntos Soriano Club',
    ],
    formTitle: 'Calcular precio gratis',
    formButtonText: 'Quiero mi presupuesto',
    phone: '900 123 456',
  },
}
