import { LandingContent } from '@/lib/landing/types'

export const mascotasLanding: LandingContent = {
  config: {
    slug: 'seguro-mascotas',
    title: 'Seguro para Mascotas | Soriano Mediadores',
    description: 'Seguro veterinario completo para perros y gatos. Consultas, urgencias, operaciones y responsabilidad civil incluida.',
    keywords: ['seguro mascotas', 'seguro perros', 'seguro gatos', 'seguro veterinario'],
    insuranceType: 'MASCOTAS',
    theme: 'mascotas',
    source: 'landing-seguro-mascotas',
    gamificationPoints: 200,
    showPricing: true,
  },

  hero: {
    title: 'Tu mascota,\\nsiempre protegida',
    subtitle: 'Seguro veterinario completo para perros y gatos. Consultas ilimitadas, urgencias 24h, operaciones y responsabilidad civil.',
    badge: 'Desde 12€/mes',
    ctaPrimary: { text: 'Proteger a mi mascota', scrollTo: 'cta-section' },
    ctaSecondary: { text: 'Ver coberturas', href: '#coverages' },
  },

  trustBar: {
    items: [
      { icon: 'Stethoscope', text: 'Consultas', highlight: 'ilimitadas' },
      { icon: 'Clock', text: 'Urgencias', highlight: '24h' },
      { icon: 'Shield', text: 'RC', highlight: '60.000€' },
      { icon: 'Heart', text: 'Sin límite', highlight: 'de edad' },
    ],
  },

  coverages: {
    title: 'Protección para tu mejor amigo',
    subtitle: 'Perros y gatos de todas las razas y edades',
    cards: [
      {
        id: 'basico',
        name: 'Básico',
        price: 'Desde 12€',
        period: 'mes',
        features: [
          'Consultas veterinarias ilimitadas',
          'Vacunas incluidas',
          'Desparasitación',
          'Chip identificativo',
          { text: 'Operaciones', included: false },
        ],
      },
      {
        id: 'completo',
        name: 'Completo',
        price: 'Desde 25€',
        period: 'mes',
        popular: true,
        features: [
          'Todo lo de Básico',
          'Operaciones y hospitalización',
          'Urgencias 24h',
          'Responsabilidad civil 60.000€',
          'Robo y extravío',
        ],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 40€',
        period: 'mes',
        features: [
          'Cobertura total',
          'Oncología y tratamientos especiales',
          'Fisioterapia',
          'Seguro de viaje internacional',
          'Eutanasia y cremación',
        ],
      },
    ],
  },

  benefits: {
    title: '¿Por qué asegurar a tu mascota?',
    items: [
      { icon: 'Stethoscope', title: 'Veterinarios 24/7', description: 'Atención veterinaria de urgencia las 24 horas.' },
      { icon: 'Syringe', title: 'Vacunas incluidas', description: 'Todas las vacunas anuales obligatorias sin coste.' },
      { icon: 'Heart', title: 'Sin límite de edad', description: 'Aseguramos mascotas de cualquier edad.' },
      { icon: 'Shield', title: 'RC incluida', description: 'Responsabilidad civil por daños a terceros.' },
      { icon: 'MapPin', title: '+500 clínicas', description: 'Amplia red de centros veterinarios concertados.' },
      { icon: 'Plane', title: 'Viaja tranquilo', description: 'Cobertura internacional en la modalidad Premium.' },
    ],
  },

  stats: {
    items: [
      { value: 15000, suffix: '+', label: 'Mascotas aseguradas' },
      { value: 99, suffix: '%', label: 'Siniestros resueltos' },
      { value: 4, suffix: 'h', label: 'Tiempo respuesta urgencias' },
      { value: 500, suffix: '+', label: 'Clínicas concertadas' },
    ],
  },

  testimonials: {
    title: 'Dueños felices, mascotas protegidas',
    items: [
      {
        id: '1',
        name: 'Sandra M.',
        role: 'Dueña de Max (Golden Retriever)',
        content: 'Max tuvo una operación de cadera y el seguro lo cubrió todo. El proceso fue muy fácil y rápido.',
        rating: 5,
        insuranceType: 'Completo',
      },
      {
        id: '2',
        name: 'Pablo R.',
        role: 'Dueño de Luna (Gata persa)',
        content: 'Las consultas ilimitadas son geniales. Luna va al veterinario cada vez que lo necesita sin preocuparme por el coste.',
        rating: 5,
        insuranceType: 'Básico',
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      { question: '¿Hay límite de edad para asegurar a mi mascota?', answer: 'No, aseguramos mascotas de cualquier edad. Para mayores de 8 años puede haber un periodo de carencia mayor.' },
      { question: '¿Qué razas están cubiertas?', answer: 'Todas las razas de perros y gatos, incluyendo razas PPP con la documentación correspondiente.' },
      { question: '¿Puedo elegir mi veterinario?', answer: 'Sí, puedes acudir a cualquier veterinario. Con nuestra red concertada tendrás pago directo.' },
      { question: '¿Cubre enfermedades preexistentes?', answer: 'Las enfermedades preexistentes conocidas no están cubiertas, pero sí las que se detecten después de la contratación.' },
    ],
  },

  cta: {
    title: 'Protege a tu mejor amigo',
    subtitle: 'Calcula el precio del seguro para tu mascota en 1 minuto',
    features: [
      'Consultas veterinarias ilimitadas',
      'Urgencias 24h',
      'Responsabilidad civil incluida',
      '+200 puntos Soriano Club',
    ],
    formTitle: 'Calcular precio',
    formButtonText: 'Proteger a mi mascota',
    phone: '900 123 456',
  },
}
