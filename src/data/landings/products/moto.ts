import { LandingContent } from '@/lib/landing/types'

export const motoLanding: LandingContent = {
  config: {
    slug: 'seguro-moto',
    title: 'Seguro de Moto | Soriano Mediadores',
    description: 'Seguro de moto a todo riesgo desde 8€/mes. Robo, daños propios y asistencia en carretera 24h.',
    keywords: ['seguro moto', 'seguro motocicleta', 'seguro scooter', 'seguro ciclomotor'],
    insuranceType: 'MOTO',
    theme: 'moto',
    source: 'landing-seguro-moto',
    gamificationPoints: 150,
  },
  hero: {
    title: 'Tu moto,\ntu libertad',
    subtitle: 'Seguro de moto con las mejores coberturas. Robo, daños propios, asistencia 24h y mucho más.',
    badge: 'Desde 8€/mes',
    ctaPrimary: { text: 'Calcular precio', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Shield', text: 'Robo', highlight: 'cubierto' },
      { icon: 'Wrench', text: 'Asistencia', highlight: '24h' },
      { icon: 'Zap', text: 'Contratación', highlight: 'inmediata' },
      { icon: 'Award', text: 'Sin', highlight: 'franquicia' },
    ],
  },
  coverages: {
    title: 'Elige tu cobertura',
    cards: [
      {
        id: 'terceros',
        name: 'Terceros',
        price: 'Desde 8€',
        period: 'mes',
        features: ['RC obligatoria ilimitada', 'Defensa jurídica', 'Asistencia en viaje', 'Accidentes conductor'],
      },
      {
        id: 'terceros-ampliado',
        name: 'Terceros+',
        price: 'Desde 15€',
        period: 'mes',
        features: ['Todo lo de Terceros', 'Robo y hurto', 'Incendio', 'Lunas', 'Daños propios 50%'],
        popular: true,
      },
      {
        id: 'todo-riesgo',
        name: 'Todo Riesgo',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Cobertura total', 'Sin franquicia', 'Equipamiento incluido', 'Moto de sustitución', 'Valor a nuevo 2 años'],
      },
    ],
  },
  benefits: {
    title: 'Ventajas de nuestro seguro de moto',
    items: [
      { icon: 'Lock', title: 'Robo incluido', description: 'Cobertura completa contra robo y hurto de tu moto.' },
      { icon: 'Wrench', title: 'Asistencia 24h', description: 'Grúa y asistencia en carretera las 24 horas, 365 días.' },
      { icon: 'Shirt', title: 'Equipamiento cubierto', description: 'Casco, guantes, chaqueta y equipamiento protegido.' },
      { icon: 'Car', title: 'Moto sustitución', description: 'Moto de sustitución mientras reparan la tuya.' },
    ],
  },
  stats: {
    items: [
      { value: 12000, suffix: '+', label: 'Motos aseguradas' },
      { value: 45, suffix: 'min', label: 'Tiempo medio grúa' },
      { value: 97, suffix: '%', label: 'Clientes satisfechos' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'David López',
        role: 'BMW R1250GS',
        content: 'Me robaron la moto y en 15 días tenía el dinero. Servicio impecable.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Sara García',
        role: 'Yamaha MT-07',
        content: 'La asistencia en carretera es genial. Pinché en la autopista y vinieron en 30 minutos.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Miguel Fernández',
        role: 'Honda PCX 125',
        content: 'Muy buen precio para mi scooter y coberturas completas. Muy contento.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Aseguráis cualquier tipo de moto?', answer: 'Sí, aseguramos motos, scooters, ciclomotores, quads y triciclos de cualquier cilindrada.' },
      { question: '¿El equipamiento está incluido?', answer: 'Sí, en Todo Riesgo el equipamiento (casco, guantes, etc.) está cubierto hasta 1.500€.' },
      { question: '¿Hay descuento por experiencia?', answer: 'Sí, ofrecemos descuentos de hasta el 50% según tu historial de siniestralidad.' },
      { question: '¿Puedo asegurar una moto clásica?', answer: 'Sí, tenemos coberturas especiales para motos clásicas y de colección.' },
    ],
  },
  cta: {
    title: 'Asegura tu moto ahora',
    features: ['Precio en 2 minutos', 'Sin compromiso', 'Contratación online'],
    formButtonText: 'Calcular precio',
    phone: '900 123 456',
  },
}
