import { LandingContent } from '@/lib/landing/types'

export const cyberMondayLanding: LandingContent = {
  config: {
    slug: 'cyber-monday',
    title: 'Cyber Monday Seguros 2025 | Soriano Mediadores',
    description: 'Últimas horas de ofertas Cyber Monday en seguros. Descuentos especiales en contratación 100% online.',
    keywords: ['cyber monday seguros', 'descuento seguros online', 'oferta seguro digital'],
    insuranceType: 'GENERAL',
    theme: 'cyber-monday',
    source: 'landing-cyber-monday',
    campaign: 'cyber-monday-2025',
    gamificationPoints: 400,
    showCountdown: true,
  },
  hero: {
    title: 'CYBER MONDAY\n100% ONLINE',
    subtitle: 'Últimas ofertas del año. Contratación 100% digital con descuentos exclusivos. Solo hoy.',
    badge: 'Solo hoy',
    ctaPrimary: { text: 'Ver ofertas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Monitor', text: '100%', highlight: 'online' },
      { icon: 'Percent', text: 'Hasta', highlight: '35% dto.' },
      { icon: 'Zap', text: 'Activo', highlight: 'al instante' },
      { icon: 'Clock', text: 'Solo', highlight: '24 horas' },
    ],
  },
  coverages: {
    title: 'Ofertas Cyber Monday',
    cards: [
      {
        id: 'pack-digital',
        name: 'Pack Digital',
        price: 'Desde 20€',
        period: 'mes',
        features: ['Seguro móvil', 'Seguro portátil', 'Cyber protección', 'Gestión 100% app'],
      },
      {
        id: 'auto-online',
        name: 'Auto Online',
        price: 'Desde 18€',
        period: 'mes',
        features: ['Terceros+ completo', 'App conductor', 'Gestión digital', '35% dto. online', 'Firma digital'],
        popular: true,
      },
      {
        id: 'hogar-smart',
        name: 'Hogar Smart',
        price: 'Desde 10€',
        period: 'mes',
        features: ['Hogar completo', 'App gestión', 'Asistencia digital', '30% dto. online'],
      },
    ],
  },
  benefits: {
    title: 'Ventajas de contratar online',
    items: [
      { icon: 'Monitor', title: 'Proceso 100% digital', description: 'Contrata, firma y gestiona todo desde tu ordenador o móvil.' },
      { icon: 'Zap', title: 'Activo al instante', description: 'Tu seguro queda activo en el momento de la contratación.' },
      { icon: 'Percent', title: 'Descuento online', description: 'Precio especial por contratar digitalmente.' },
      { icon: 'Smartphone', title: 'Gestión desde app', description: 'Partes, modificaciones y consultas desde la app.' },
    ],
  },
  stats: {
    items: [
      { value: 35, suffix: '%', label: 'Descuento online' },
      { value: 5, suffix: 'min', label: 'Tiempo contratación' },
      { value: 24, suffix: 'h', label: 'Duración oferta' },
    ],
  },
  faq: {
    items: [
      { question: '¿Es seguro contratar online?', answer: 'Totalmente. Usamos firma digital certificada y todos los datos viajan encriptados.' },
      { question: '¿Recibo documentación física?', answer: 'Toda la documentación es digital (PDF). Si prefieres papel, te la enviamos gratis.' },
      { question: '¿Cómo hago un parte online?', answer: 'Desde la app o web, con fotos y descripción. Respuesta en menos de 24h.' },
      { question: '¿Puedo hablar con alguien?', answer: 'Sí, tienes chat, email y teléfono disponibles aunque contrates online.' },
    ],
  },
  cta: {
    title: 'Últimas horas',
    features: ['Contratación en 5 minutos', 'Firma digital', 'Activo al instante'],
    formButtonText: 'Contratar ahora',
    phone: '900 123 456',
  },
}
