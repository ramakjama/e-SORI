import { LandingContent } from '@/lib/landing/types'

export const navidadLanding: LandingContent = {
  config: {
    slug: 'navidad',
    title: 'Promoción Navidad Seguros | Soriano Mediadores',
    description: 'Regala tranquilidad estas navidades. Seguros con regalo incluido y condiciones especiales. El mejor regalo para los tuyos.',
    keywords: ['regalo seguro navidad', 'promocion navidad seguros', 'regalar seguro'],
    insuranceType: 'GENERAL',
    theme: 'navidad',
    source: 'landing-navidad',
    campaign: 'navidad-2025',
    gamificationPoints: 350,
  },
  hero: {
    title: 'Regala\ntranquilidad',
    subtitle: 'El mejor regalo para los tuyos: protección. Seguros con condiciones especiales y regalo incluido.',
    badge: 'Regalo incluido',
    ctaPrimary: { text: 'Ver regalos', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Gift', text: 'Regalo', highlight: 'incluido' },
      { icon: 'Heart', text: 'Para', highlight: 'los tuyos' },
      { icon: 'Percent', text: 'Hasta', highlight: '25% dto.' },
      { icon: 'Star', text: 'Edición', highlight: 'limitada' },
    ],
  },
  coverages: {
    title: 'Ideas para regalar',
    cards: [
      {
        id: 'regalo-hogar',
        name: 'Pack Hogar',
        price: 'Desde 15€',
        period: 'mes',
        features: ['Hogar completo', 'Asistencia 24h', '🎁 Cesta Navidad', 'Tarjeta regalo'],
      },
      {
        id: 'regalo-salud',
        name: 'Pack Salud',
        price: 'Desde 45€',
        period: 'mes',
        features: ['Salud familiar', 'Dental incluido', '🎁 Spa para 2', 'Chequeo gratis', 'Tarjeta regalo'],
        popular: true,
      },
      {
        id: 'regalo-mascota',
        name: 'Pack Mascota',
        price: 'Desde 15€',
        period: 'mes',
        features: ['Seguro mascota', 'Veterinario 24h', '🎁 Kit mascota', 'Tarjeta regalo'],
      },
    ],
  },
  benefits: {
    title: 'El regalo perfecto',
    items: [
      { icon: 'Gift', title: 'Regalo físico incluido', description: 'Cada seguro incluye un regalo tangible además de la protección.' },
      { icon: 'CreditCard', title: 'Tarjeta regalo', description: 'Entrega una tarjeta regalo elegante con el seguro.' },
      { icon: 'Heart', title: 'Protección real', description: 'Un regalo que realmente cuida a quien lo recibe.' },
      { icon: 'Calendar', title: 'Empieza cuando quieras', description: 'El seguro puede empezar el día que elijas.' },
    ],
  },
  stats: {
    items: [
      { value: 3500, suffix: '+', label: 'Regalos entregados' },
      { value: 25, suffix: '%', label: 'Descuento navideño' },
      { value: 98, suffix: '%', label: 'Satisfacción regalo' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Laura M.',
        role: 'Regaló a sus padres',
        content: 'Regalé el seguro de salud a mis padres. El mejor regalo que les he hecho nunca.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Carlos P.',
        role: 'Regaló a su pareja',
        content: 'Un seguro de mascota para nuestra perrita. Original y útil.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Cómo funciona el regalo?', answer: 'Contratas el seguro, recibes una tarjeta regalo elegante para entregar, y el regalo físico llega a casa.' },
      { question: '¿Puedo elegir la fecha de inicio?', answer: 'Sí, el seguro puede empezar el día que quieras (hasta 60 días después de contratar).' },
      { question: '¿Qué pasa si no le gusta?', answer: 'Tiene 30 días para cancelar sin coste y quedarse con el regalo físico.' },
      { question: '¿Llega antes de Navidad?', answer: 'Pedidos antes del 20 de diciembre llegan garantizados para Nochebuena.' },
    ],
  },
  cta: {
    title: 'El mejor regalo',
    features: ['Entrega garantizada', 'Regalo incluido', 'Tarjeta elegante'],
    formButtonText: 'Regalar ahora',
    phone: '900 123 456',
  },
}
