import { LandingContent } from '@/lib/landing/types'

// Helper to get next Black Friday dates
const getBlackFridayDates = () => {
  const now = new Date()
  const year = now.getMonth() >= 11 ? now.getFullYear() + 1 : now.getFullYear()
  // Black Friday is the 4th Friday of November
  const november = new Date(year, 10, 1)
  const firstFriday = november.getDate() + (5 - november.getDay() + 7) % 7
  const blackFriday = new Date(year, 10, firstFriday + 21)
  const start = new Date(blackFriday)
  start.setDate(start.getDate() - 7) // Week before
  const end = new Date(blackFriday)
  end.setDate(end.getDate() + 3) // Until Monday (Cyber Monday)
  return { start, end, blackFriday }
}

const { end } = getBlackFridayDates()

export const blackFridayLanding: LandingContent = {
  config: {
    slug: 'black-friday',
    title: 'Black Friday Seguros 2025 | Soriano Mediadores',
    description: 'Ofertas exclusivas Black Friday en seguros. Hasta 40% descuento en auto, hogar, salud y vida. Solo hasta el lunes.',
    keywords: ['black friday seguros', 'descuento seguros', 'oferta seguro auto', 'promocion seguros'],
    insuranceType: 'GENERAL',
    theme: 'black-friday',
    source: 'landing-black-friday',
    campaign: 'black-friday-2025',
    gamificationPoints: 500,
    showCountdown: true,
    countdownDate: end.toISOString(),
  },
  hero: {
    title: 'BLACK FRIDAY\nSEGUROS',
    subtitle: 'Las mejores ofertas del año en seguros. Hasta 40% de descuento en toda nuestra gama. ¡Solo hasta el Cyber Monday!',
    badge: 'Hasta -40%',
    ctaPrimary: { text: 'Ver ofertas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Percent', text: 'Hasta', highlight: '40% dto.' },
      { icon: 'Clock', text: 'Tiempo', highlight: 'limitado' },
      { icon: 'Gift', text: 'Regalos', highlight: 'exclusivos' },
      { icon: 'Zap', text: 'Contratación', highlight: 'express' },
    ],
  },
  coverages: {
    title: 'Ofertas Black Friday',
    cards: [
      {
        id: 'auto-bf',
        name: 'Auto -35%',
        price: 'Desde 15€',
        period: 'mes',
        features: ['Terceros ampliado', 'Lunas incluidas', 'Asistencia 24h', '35% descuento primer año'],
      },
      {
        id: 'hogar-bf',
        name: 'Hogar -40%',
        price: 'Desde 8€',
        period: 'mes',
        features: ['Continente y contenido', 'RC familiar', 'Asistencia hogar', '40% descuento primer año', '🎁 Smart Home gratis'],
        popular: true,
      },
      {
        id: 'salud-bf',
        name: 'Salud -30%',
        price: 'Desde 35€',
        period: 'mes',
        features: ['Cuadro médico completo', 'Sin copagos', 'Dental incluido', '30% descuento primer año'],
      },
    ],
  },
  benefits: {
    title: 'Ventajas Black Friday',
    items: [
      { icon: 'Percent', title: 'Descuentos reales', description: 'Hasta 40% de descuento sobre tarifa normal. Precio garantizado.' },
      { icon: 'Gift', title: 'Regalos exclusivos', description: 'Smart Home Kit con cada hogar, dashcam con cada auto.' },
      { icon: 'Lock', title: 'Precio bloqueado', description: 'El descuento se mantiene en la primera renovación.' },
      { icon: 'Clock', title: 'Contratación express', description: 'Tu seguro activo en menos de 10 minutos.' },
    ],
  },
  stats: {
    items: [
      { value: 40, suffix: '%', label: 'Descuento máximo' },
      { value: 2500, suffix: '+', label: 'Pólizas contratadas' },
      { value: 72, suffix: 'h', label: 'Quedan de oferta' },
    ],
  },
  faq: {
    items: [
      { question: '¿El descuento es real?', answer: 'Sí, es un descuento sobre nuestra tarifa habitual, no sobre un precio inflado.' },
      { question: '¿Cuánto dura el descuento?', answer: 'El descuento aplica al primer año completo. En la renovación vuelve a tarifa normal (o la de ese momento).' },
      { question: '¿Puedo combinar con otros descuentos?', answer: 'El descuento Black Friday no es combinable con otros descuentos promocionales.' },
      { question: '¿Cuándo termina la oferta?', answer: 'La oferta termina el Cyber Monday a las 23:59h. Después, precios normales.' },
    ],
  },
  cta: {
    title: '¡No te lo pierdas!',
    features: ['Descuento inmediato', 'Regalo seguro', 'Contratación online'],
    formButtonText: 'Aprovechar oferta',
    phone: '900 123 456',
  },
}
