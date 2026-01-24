import { LandingContent } from '@/lib/landing/types'

export const primaveraLanding: LandingContent = {
  config: {
    slug: 'primavera',
    title: 'Promoción Primavera Seguros | Soriano Mediadores',
    description: 'Renueva tus seguros esta primavera. Ofertas especiales en hogar, auto y salud. Limpieza de pólizas.',
    keywords: ['promocion primavera seguros', 'renovar seguro', 'cambiar seguro'],
    insuranceType: 'GENERAL',
    theme: 'primavera',
    source: 'landing-primavera',
    campaign: 'primavera-2025',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Renueva\ntu protección',
    subtitle: 'Primavera: momento perfecto para revisar tus seguros. Mejores coberturas, mejores precios.',
    badge: 'Revisión gratis',
    ctaPrimary: { text: 'Revisar seguros', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'RefreshCw', text: 'Revisión', highlight: 'gratuita' },
      { icon: 'Percent', text: 'Hasta', highlight: '20% ahorro' },
      { icon: 'FileCheck', text: 'Mejor', highlight: 'cobertura' },
      { icon: 'Leaf', text: 'Primavera', highlight: 'de cambio' },
    ],
  },
  coverages: {
    title: 'Ofertas de primavera',
    cards: [
      {
        id: 'revision-auto',
        name: 'Mejora tu Auto',
        price: 'Ahorra hasta',
        period: '150€/año',
        features: ['Análisis póliza actual', 'Comparativa mercado', 'Mejores coberturas', 'Mismo precio o menos'],
      },
      {
        id: 'revision-hogar',
        name: 'Mejora tu Hogar',
        price: 'Ahorra hasta',
        period: '100€/año',
        features: ['Revisión capital', 'Actualización coberturas', 'RC familiar incluida', 'Precio optimizado'],
        popular: true,
      },
      {
        id: 'pack-primavera',
        name: 'Pack Primavera',
        price: 'Ahorra hasta',
        period: '300€/año',
        features: ['Revisión completa', 'Todos tus seguros', 'Descuento multiseguro', 'Gestor personal'],
      },
    ],
  },
  benefits: {
    title: 'Por qué revisar ahora',
    items: [
      { icon: 'Search', title: 'Análisis gratuito', description: 'Revisamos todas tus pólizas sin compromiso.' },
      { icon: 'TrendingDown', title: 'Ahorro garantizado', description: 'Si no mejoramos tu precio/cobertura, te regalamos 50€.' },
      { icon: 'FileCheck', title: 'Coberturas actualizadas', description: 'Adaptamos tu seguro a tu situación actual.' },
      { icon: 'Clock', title: 'Sin esperas', description: 'Gestionamos la cancelación de tu anterior seguro.' },
    ],
  },
  stats: {
    items: [
      { value: 180, suffix: '€', label: 'Ahorro medio anual' },
      { value: 4500, suffix: '+', label: 'Pólizas mejoradas' },
      { value: 95, suffix: '%', label: 'Clientes ahorran' },
    ],
  },
  faq: {
    items: [
      { question: '¿Puedo cambiar de seguro en cualquier momento?', answer: 'Sí, la mayoría de seguros permiten cancelación con 30 días de antelación al vencimiento.' },
      { question: '¿Perdré coberturas si cambio?', answer: 'No, nos aseguramos de que las nuevas coberturas sean iguales o mejores.' },
      { question: '¿Quién gestiona la cancelación?', answer: 'Nosotros nos encargamos de todo el papeleo de cancelación con tu aseguradora anterior.' },
      { question: '¿Es realmente gratis la revisión?', answer: 'Sí, 100% gratis y sin compromiso. Si no te convence, no cambias nada.' },
    ],
  },
  cta: {
    title: 'Mejora tus seguros',
    features: ['Revisión 100% gratis', 'Sin compromiso', 'Ahorro garantizado'],
    formButtonText: 'Solicitar revisión',
    phone: '900 123 456',
  },
}
