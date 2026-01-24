import { LandingContent } from '@/lib/landing/types'

export const jovenesLanding: LandingContent = {
  config: {
    slug: 'jovenes',
    title: 'Seguros para Jóvenes | Soriano Mediadores',
    description: 'Seguros económicos para menores de 30. Auto, viaje y móvil con precios especiales. Protección a tu medida.',
    keywords: ['seguros jovenes', 'seguro auto joven', 'seguro barato jovenes', 'primer seguro'],
    insuranceType: 'GENERAL',
    theme: 'jovenes',
    source: 'landing-jovenes',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Seguros para\ntu momento',
    subtitle: 'Protección adaptada a tu estilo de vida. Auto, viajes y tecnología con precios que puedes pagar.',
    badge: 'Precios jóvenes',
    ctaPrimary: { text: 'Ver ofertas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Car', text: 'Auto', highlight: 'económico' },
      { icon: 'Plane', text: 'Viaje', highlight: 'incluido' },
      { icon: 'Smartphone', text: 'Móvil', highlight: 'protegido' },
      { icon: 'Percent', text: 'Precio', highlight: 'joven' },
    ],
  },
  coverages: {
    title: 'Seguros pensados para ti',
    cards: [
      {
        id: 'movil',
        name: 'Pack Móvil',
        price: 'Desde 5€',
        period: 'mes',
        features: ['Rotura pantalla', 'Robo y hurto', 'Daños por líquidos', 'Sustitución rápida'],
      },
      {
        id: 'auto-joven',
        name: 'Auto Joven',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Terceros ampliado', 'Lunas incluidas', 'Asistencia 24h', 'App de conductor', 'Descuento buen conductor'],
        popular: true,
      },
      {
        id: 'pack-viajero',
        name: 'Pack Viajero',
        price: 'Desde 45€',
        period: 'año',
        features: ['Viajes ilimitados', 'Hasta 90 días/viaje', 'Cancelación incluida', 'Deportes aventura', 'App asistencia'],
      },
    ],
  },
  benefits: {
    title: 'Ventajas para menores de 30',
    items: [
      { icon: 'Percent', title: 'Precios especiales', description: 'Tarifas reducidas diseñadas para tu presupuesto.' },
      { icon: 'Smartphone', title: 'Todo desde el móvil', description: 'Gestiona tus seguros, partes y asistencia desde la app.' },
      { icon: 'Zap', title: 'Contratación express', description: 'En 5 minutos tienes tu seguro activo.' },
      { icon: 'Award', title: 'Premios por ser buen conductor', description: 'Descuentos progresivos sin siniestros.' },
    ],
  },
  stats: {
    items: [
      { value: 15000, suffix: '+', label: 'Jóvenes asegurados' },
      { value: 35, suffix: '%', label: 'Ahorro vs. competencia' },
      { value: 5, suffix: 'min', label: 'Contratación' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Alejandro M.',
        role: '24 años, primer coche',
        content: 'Mi primer seguro de auto y fue superfácil. Precio increíble para mi edad.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Lucía P.',
        role: '27 años, viajera',
        content: 'El pack viajero es genial. Un año de viajes cubiertos por menos de 50€.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Pablo R.',
        role: '22 años, estudiante',
        content: 'El seguro de móvil me salvó cuando se me cayó el iPhone. Pantalla nueva en 2 días.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Hasta qué edad soy "joven"?', answer: 'Nuestras tarifas jóvenes aplican hasta los 30 años. Después pasas a tarifas adulto (también muy competitivas).' },
      { question: '¿Por qué el seguro de auto es más caro para jóvenes?', answer: 'La estadística muestra más siniestros. Pero con nuestra app de conductor puedes demostrar que conduces bien y bajar precio.' },
      { question: '¿Puedo pagar mensualmente?', answer: 'Sí, todos nuestros seguros permiten pago mensual sin recargo.' },
      { question: '¿Qué cubre el seguro de móvil?', answer: 'Rotura de pantalla, daños por agua, robo y hurto. Cualquier smartphone hasta 1.500€ de valor.' },
    ],
  },
  cta: {
    title: 'Tu primer seguro, fácil',
    features: ['Contratación online', 'Pago mensual', 'Cancelación sin penalización'],
    formButtonText: 'Calcular precio',
    phone: '900 123 456',
  },
}
