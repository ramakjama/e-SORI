import { LandingContent } from '@/lib/landing/types'

export const veranoLanding: LandingContent = {
  config: {
    slug: 'verano',
    title: 'Seguros de Verano | Soriano Mediadores',
    description: 'Viaja seguro este verano. Seguros de viaje, auto para vacaciones y protección de segunda residencia.',
    keywords: ['seguro verano', 'seguro vacaciones', 'seguro viaje verano', 'seguro segunda residencia'],
    insuranceType: 'GENERAL',
    theme: 'verano',
    source: 'landing-verano',
    campaign: 'verano-2025',
    gamificationPoints: 250,
  },
  hero: {
    title: 'Vacaciones\nsin preocupaciones',
    subtitle: 'Todo lo que necesitas para unas vacaciones perfectas. Viaje, auto y segunda residencia cubiertos.',
    badge: 'Pack verano',
    ctaPrimary: { text: 'Ver packs', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Plane', text: 'Viaje', highlight: 'cubierto' },
      { icon: 'Car', text: 'Auto', highlight: 'vacacional' },
      { icon: 'Home', text: '2ª residencia', highlight: 'protegida' },
      { icon: 'Sun', text: 'Verano', highlight: 'tranquilo' },
    ],
  },
  coverages: {
    title: 'Packs de verano',
    cards: [
      {
        id: 'viajero',
        name: 'Viajero',
        price: 'Desde 25€',
        period: 'verano',
        features: ['Viajes ilimitados 3 meses', 'Asistencia médica', 'Cancelación', 'Equipaje', 'COVID incluido'],
      },
      {
        id: 'pack-verano',
        name: 'Pack Verano',
        price: 'Desde 45€',
        period: 'verano',
        features: ['Seguro viaje completo', 'Ampliación auto vacacional', '2ª residencia temporal', 'Mascota en viaje'],
        popular: true,
      },
      {
        id: 'segunda-residencia',
        name: '2ª Residencia',
        price: 'Desde 12€',
        period: 'mes',
        features: ['Casa playa/montaña', 'Ocupación temporal', 'Robo verano', 'Asistencia urgente'],
      },
    ],
  },
  benefits: {
    title: 'Disfruta sin preocuparte',
    items: [
      { icon: 'Plane', title: 'Viajes cubiertos', description: 'Todos tus viajes del verano con un solo seguro.' },
      { icon: 'Car', title: 'Auto preparado', description: 'Ampliación de coberturas para viajes largos.' },
      { icon: 'Home', title: 'Casa protegida', description: 'Tu casa vacía y tu segunda residencia aseguradas.' },
      { icon: 'Heart', title: 'Mascota incluida', description: 'Tu mascota viaja contigo con cobertura veterinaria.' },
    ],
  },
  stats: {
    items: [
      { value: 8500, suffix: '+', label: 'Veranos protegidos' },
      { value: 180, suffix: '+', label: 'Destinos cubiertos' },
      { value: 97, suffix: '%', label: 'Satisfacción' },
    ],
  },
  faq: {
    items: [
      { question: '¿Cuánto dura el seguro de verano?', answer: 'El pack verano cubre del 1 de junio al 30 de septiembre. Puedes contratar fechas específicas también.' },
      { question: '¿Cubre deportes de aventura?', answer: 'Sí, el pack incluye deportes de aventura habituales: snorkel, kayak, senderismo, etc.' },
      { question: '¿Qué pasa si ya tengo seguro de hogar?', answer: 'El seguro de 2ª residencia es independiente. Tu hogar habitual mantiene su póliza.' },
      { question: '¿Puedo añadir más viajeros?', answer: 'Sí, puedes añadir familiares al pack con un suplemento reducido.' },
    ],
  },
  cta: {
    title: 'Vacaciones tranquilas',
    features: ['Cobertura completa', 'Precio cerrado', 'Asistencia 24h'],
    formButtonText: 'Contratar pack',
    phone: '900 123 456',
  },
}
