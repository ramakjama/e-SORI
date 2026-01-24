import { LandingContent } from '@/lib/landing/types'

export const nuevosConductoresLanding: LandingContent = {
  config: {
    slug: 'nuevos-conductores',
    title: 'Seguro para Nuevos Conductores | Soriano Mediadores',
    description: 'Seguro de auto para conductores noveles. Precios especiales y app de conducción segura. Tu primer seguro fácil.',
    keywords: ['seguro conductor novel', 'seguro nuevo conductor', 'seguro carnet nuevo', 'seguro recien carnet'],
    insuranceType: 'AUTO',
    theme: 'nuevos-conductores',
    source: 'landing-nuevos-conductores',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Tu primer seguro\nde conductor',
    subtitle: 'Seguro de auto para noveles con app de conducción. Demuestra que conduces bien y baja tu precio cada año.',
    badge: 'Precio novel',
    ctaPrimary: { text: 'Calcular precio', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Car', text: 'Seguro', highlight: 'completo' },
      { icon: 'Smartphone', text: 'App', highlight: 'conductor' },
      { icon: 'TrendingDown', text: 'Precio', highlight: 'decreciente' },
      { icon: 'Award', text: 'Premios', highlight: 'buen conductor' },
    ],
  },
  coverages: {
    title: 'Seguros para nuevos conductores',
    cards: [
      {
        id: 'terceros-novel',
        name: 'Terceros Novel',
        price: 'Desde 35€',
        period: 'mes',
        features: ['RC obligatoria', 'Defensa jurídica', 'Asistencia viaje', 'Conductor asegurado', 'App conducción'],
      },
      {
        id: 'terceros-plus',
        name: 'Terceros+ Novel',
        price: 'Desde 50€',
        period: 'mes',
        features: ['Todo lo de Terceros', 'Robo e incendio', 'Lunas', 'Daños animales', 'Coche cortesía 5 días'],
        popular: true,
      },
      {
        id: 'todo-riesgo-novel',
        name: 'Todo Riesgo',
        price: 'Desde 80€',
        period: 'mes',
        features: ['Cobertura total', 'Franquicia 300€', 'Valor venal garantizado', 'Coche cortesía 15 días', 'App premium'],
      },
    ],
  },
  benefits: {
    title: 'Ventajas para noveles',
    items: [
      { icon: 'Smartphone', title: 'App de conducción', description: 'Mide tu forma de conducir y gana descuentos por conducción segura.' },
      { icon: 'TrendingDown', title: 'Precio decreciente', description: 'Cada año sin siniestros, tu precio baja automáticamente.' },
      { icon: 'Award', title: 'Premios y retos', description: 'Participa en retos de conducción y gana premios reales.' },
      { icon: 'MapPin', title: 'Localización coche', description: 'Encuentra tu coche aparcado desde la app.' },
    ],
  },
  stats: {
    items: [
      { value: 8000, suffix: '+', label: 'Noveles asegurados' },
      { value: 25, suffix: '%', label: 'Ahorro app conducción' },
      { value: 92, suffix: '%', label: 'Renovaciones' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Marcos T.',
        role: '19 años, carnet hace 6 meses',
        content: 'Mi padre pensaba que sería carísimo. Le sorprendió el precio y a mí me encanta la app.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Sara G.',
        role: '21 años, 1 año de carnet',
        content: 'El año que viene me baja el precio por usar bien la app. Motivación extra para conducir bien.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'David L.',
        role: '23 años, conductor novel',
        content: 'La asistencia en carretera me salvó cuando me quedé tirado en la autopista.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Por qué es más caro el seguro para noveles?', answer: 'Las estadísticas muestran más siniestros en conductores nuevos. Pero con nuestra app puedes demostrar que eres diferente.' },
      { question: '¿Cómo funciona la app de conducción?', answer: 'Mide velocidad, frenadas, aceleraciones y uso del móvil. Mejor puntuación = más descuento.' },
      { question: '¿Cuánto puedo ahorrar con la app?', answer: 'Hasta un 25% de descuento en la renovación si mantienes buena puntuación.' },
      { question: '¿Hasta cuándo soy "conductor novel"?', answer: 'Legalmente 2 años. Nuestras tarifas novel aplican 3 años o hasta cumplir 25.' },
    ],
  },
  cta: {
    title: 'Empieza a conducir protegido',
    features: ['Precio transparente', 'App gratuita incluida', 'Descuentos progresivos'],
    formButtonText: 'Calcular mi precio',
    phone: '900 123 456',
  },
}
