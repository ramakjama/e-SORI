import { LandingContent } from '@/lib/landing/types'

export const diaPadreLanding: LandingContent = {
  config: {
    slug: 'dia-padre',
    title: 'Día del Padre - Regalos que Protegen | Soriano Mediadores',
    description: 'El mejor regalo para papá: protección. Seguros de vida, salud y auto con descuentos especiales.',
    keywords: ['regalo dia del padre', 'seguro para papa', 'regalo proteccion padre'],
    insuranceType: 'GENERAL',
    theme: 'dia-padre',
    source: 'landing-dia-padre',
    campaign: 'dia-padre-2025',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Para el mejor\npapá del mundo',
    subtitle: 'Este 19 de marzo, regálale protección. Seguros de vida, salud y auto con ofertas especiales.',
    badge: 'Regalo especial',
    ctaPrimary: { text: 'Ver regalos', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Heart', text: 'Para', highlight: 'papá' },
      { icon: 'Gift', text: 'Regalo', highlight: 'incluido' },
      { icon: 'Shield', text: 'Protección', highlight: 'real' },
      { icon: 'Percent', text: 'Hasta', highlight: '25% dto.' },
    ],
  },
  coverages: {
    title: 'Regalos para papá',
    cards: [
      {
        id: 'vida-papa',
        name: 'Protege a Papá',
        price: 'Desde 15€',
        period: 'mes',
        features: ['Seguro de vida 100.000€', 'Invalidez incluida', 'Enfermedades graves', '🎁 Gadget tech'],
      },
      {
        id: 'salud-papa',
        name: 'Salud para Papá',
        price: 'Desde 55€',
        period: 'mes',
        features: ['Salud completa', 'Chequeo incluido', 'Sin copagos', '25% dto. marzo', '🎁 Experiencia wellness'],
        popular: true,
      },
      {
        id: 'auto-papa',
        name: 'Su Coche Protegido',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Todo riesgo', 'Asistencia premium', 'Coche sustitución', '20% dto.', '🎁 Kit premium auto'],
      },
    ],
  },
  benefits: {
    title: 'El mejor regalo',
    items: [
      { icon: 'Heart', title: 'Regalo con sentido', description: 'No es un calcetín más. Es protección real para él.' },
      { icon: 'Gift', title: 'Regalo físico incluido', description: 'Gadget tech, experiencia spa o kit premium de auto.' },
      { icon: 'CreditCard', title: 'Tarjeta regalo', description: 'Presentación elegante para el día del padre.' },
      { icon: 'Calendar', title: 'Cobertura desde el 19', description: 'El seguro empieza el día del padre.' },
    ],
  },
  stats: {
    items: [
      { value: 25, suffix: '%', label: 'Descuento marzo' },
      { value: 2000, suffix: '+', label: 'Papás protegidos' },
      { value: 19, suffix: 'Mar', label: 'Día del Padre' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'María L.',
        role: 'Hija agradecida',
        content: 'Regalé a mi padre el seguro de salud. Fue el mejor regalo que le he hecho.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Carlos M.',
        role: 'Padre de 3',
        content: 'Mis hijos me regalaron el seguro de vida. Me emocioné. Es pensar en ellos.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Cómo regalo un seguro?', answer: 'Contratas, recibes tarjeta regalo elegante, y el regalo físico llega antes del 19.' },
      { question: '¿Papá tiene que hacer algo?', answer: 'Solo firmar la póliza. Puedes hacerlo juntos el día del padre.' },
      { question: '¿Qué regalo físico incluye?', answer: 'Vida: gadget tech. Salud: spa/wellness. Auto: kit limpieza premium.' },
      { question: '¿Y si no le gusta?', answer: '30 días para cancelar sin coste. El regalo físico se lo queda.' },
    ],
  },
  cta: {
    title: 'Regala protección a papá',
    features: ['Entrega antes del 19', 'Regalo incluido', 'Tarjeta elegante'],
    formButtonText: 'Regalar ahora',
    phone: '900 123 456',
  },
}
