import { LandingContent } from '@/lib/landing/types'

export const familiasLanding: LandingContent = {
  config: {
    slug: 'familias',
    title: 'Seguros para Familias | Soriano Mediadores',
    description: 'Pack de seguros para familias. Hogar, auto y vida con descuentos especiales. Protección completa para los tuyos.',
    keywords: ['seguros familia', 'pack seguros', 'seguro hogar familia', 'protección familiar'],
    insuranceType: 'GENERAL',
    theme: 'familias',
    source: 'landing-familias',
    gamificationPoints: 300,
  },
  hero: {
    title: 'Protección completa\npara tu familia',
    subtitle: 'Combina hogar, auto y vida con descuentos exclusivos. Una sola gestión para toda la protección que necesitas.',
    badge: 'Hasta 30% dto.',
    ctaPrimary: { text: 'Ver packs', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Home', text: 'Hogar', highlight: 'protegido' },
      { icon: 'Car', text: 'Vehículos', highlight: 'asegurados' },
      { icon: 'Heart', text: 'Salud', highlight: 'cubierta' },
      { icon: 'Shield', text: 'Vida', highlight: 'garantizada' },
    ],
  },
  coverages: {
    title: 'Packs familiares',
    cards: [
      {
        id: 'esencial',
        name: 'Esencial',
        price: 'Desde 45€',
        period: 'mes',
        features: ['Hogar completo', 'Auto terceros+', '15% descuento', 'Un solo recibo'],
      },
      {
        id: 'completo',
        name: 'Completo',
        price: 'Desde 85€',
        period: 'mes',
        features: ['Hogar todo riesgo', 'Auto todo riesgo', 'Vida 100.000€', '25% descuento', 'Asistencia familia 24h'],
        popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 150€',
        period: 'mes',
        features: ['Pack Completo', 'Salud familiar', '2º vehículo incluido', '30% descuento', 'Gestor personal'],
      },
    ],
  },
  benefits: {
    title: 'Ventajas de los packs familiares',
    items: [
      { icon: 'Percent', title: 'Hasta 30% descuento', description: 'Ahorra combinando seguros. Más proteges, más ahorras.' },
      { icon: 'FileText', title: 'Un solo recibo', description: 'Simplifica tu economía con un único pago mensual o anual.' },
      { icon: 'Phone', title: 'Gestor personal', description: 'Un asesor dedicado para todas tus consultas y gestiones.' },
      { icon: 'Clock', title: 'Asistencia 24h', description: 'Atención telefónica para emergencias cualquier día del año.' },
    ],
  },
  stats: {
    items: [
      { value: 12000, suffix: '+', label: 'Familias aseguradas' },
      { value: 30, suffix: '%', label: 'Ahorro medio' },
      { value: 98, suffix: '%', label: 'Renovaciones' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Familia García-López',
        role: '4 miembros, Madrid',
        content: 'Teníamos seguros en 3 compañías distintas. Ahora todo con Soriano y ahorramos 400€ al año.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Familia Martínez',
        role: '5 miembros, Barcelona',
        content: 'El gestor personal es genial. Una llamada y te lo solucionan todo.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Puedo añadir seguros al pack?', answer: 'Sí, puedes añadir cualquier seguro (mascotas, viaje, accidentes) manteniendo el descuento.' },
      { question: '¿El descuento es permanente?', answer: 'Sí, mientras mantengas el pack activo el descuento se aplica en todas las renovaciones.' },
      { question: '¿Puedo pagar mensualmente?', answer: 'Sí, ofrecemos pago mensual sin intereses ni recargos adicionales.' },
      { question: '¿Qué pasa si cancelo un seguro del pack?', answer: 'Puedes cancelar cualquier seguro. El descuento se recalcula según los seguros activos.' },
    ],
  },
  cta: {
    title: 'Protege a toda tu familia',
    features: ['Estudio gratuito', 'Comparamos tus seguros actuales', 'Sin compromiso'],
    formButtonText: 'Solicitar estudio',
    phone: '900 123 456',
  },
}
