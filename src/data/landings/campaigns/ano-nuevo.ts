import { LandingContent } from '@/lib/landing/types'

export const anoNuevoLanding: LandingContent = {
  config: {
    slug: 'ano-nuevo',
    title: 'Año Nuevo, Seguros Nuevos | Soriano Mediadores',
    description: 'Empieza el año con buena protección. Ofertas especiales de enero en todos los seguros.',
    keywords: ['seguro año nuevo', 'ofertas enero seguros', 'nuevo año nuevo seguro'],
    insuranceType: 'GENERAL',
    theme: 'ano-nuevo',
    source: 'landing-ano-nuevo',
    campaign: 'ano-nuevo-2025',
    gamificationPoints: 300,
  },
  hero: {
    title: 'Año nuevo,\nprotección nueva',
    subtitle: 'Empieza el año con los mejores seguros. Ofertas especiales de enero para comenzar bien protegido.',
    badge: 'Ofertas enero',
    ctaPrimary: { text: 'Ver ofertas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Calendar', text: 'Nuevo', highlight: 'comienzo' },
      { icon: 'Percent', text: 'Hasta', highlight: '25% dto.' },
      { icon: 'Star', text: 'Propósitos', highlight: 'cumplidos' },
      { icon: 'RefreshCw', text: 'Renovación', highlight: 'fácil' },
    ],
  },
  coverages: {
    title: 'Propósitos de año nuevo',
    cards: [
      {
        id: 'proposito-salud',
        name: 'Cuidar mi Salud',
        price: 'Desde 40€',
        period: 'mes',
        features: ['Seguro salud completo', 'Chequeo incluido', 'Gimnasio 3 meses', '20% dto. enero'],
      },
      {
        id: 'proposito-familia',
        name: 'Proteger a mi Familia',
        price: 'Desde 55€',
        period: 'mes',
        features: ['Pack hogar + vida', 'Seguro accidentes', 'Asistencia 24h', '25% dto. enero', '🎁 Kit seguridad hogar'],
        popular: true,
      },
      {
        id: 'proposito-ahorrar',
        name: 'Ahorrar más',
        price: 'Ahorra hasta',
        period: '200€/año',
        features: ['Revisión pólizas gratis', 'Unificación seguros', 'Descuento multiseguro', 'Pago mensual sin recargo'],
      },
    ],
  },
  benefits: {
    title: 'Empieza el año bien',
    items: [
      { icon: 'Target', title: 'Cumple propósitos', description: 'Proteger a tu familia era tu propósito. Hazlo realidad.' },
      { icon: 'Percent', title: 'Descuentos enero', description: 'Mejores precios del año para empezar con buen pie.' },
      { icon: 'Gift', title: 'Regalos de bienvenida', description: 'Kit de seguridad, meses de gimnasio y más.' },
      { icon: 'Calendar', title: 'Cobertura inmediata', description: 'Empieza protegido desde el primer día del año.' },
    ],
  },
  stats: {
    items: [
      { value: 25, suffix: '%', label: 'Descuento enero' },
      { value: 5000, suffix: '+', label: 'Nuevos clientes/enero' },
      { value: 1, suffix: 'Ene', label: 'Inicio cobertura' },
    ],
  },
  faq: {
    items: [
      { question: '¿Hasta cuándo duran las ofertas?', answer: 'Las ofertas de año nuevo son válidas todo el mes de enero.' },
      { question: '¿Puedo cambiar mis seguros actuales?', answer: 'Sí, gestionamos el cambio y cancelación de tus seguros anteriores.' },
      { question: '¿Qué regalo recibo?', answer: 'Depende del seguro: kit seguridad (hogar), 3 meses gym (salud), gadget (auto).' },
      { question: '¿El descuento se mantiene?', answer: 'El 25% aplica al primer año. Después, precio normal con posibles descuentos por fidelidad.' },
    ],
  },
  cta: {
    title: 'Empieza protegido',
    features: ['Descuentos de enero', 'Regalo incluido', 'Cobertura desde el 1'],
    formButtonText: 'Comenzar el año bien',
    phone: '900 123 456',
  },
}
