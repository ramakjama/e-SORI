import { LandingContent } from '@/lib/landing/types'

export const autoLanding: LandingContent = {
  config: {
    slug: 'seguro-auto',
    title: 'Seguro de Coche | Soriano Mediadores',
    description: 'Seguro de coche completo al mejor precio. Comparamos +20 aseguradoras. Cobertura total, asistencia 24h y gestión de siniestros incluida.',
    keywords: ['seguro coche', 'seguro auto', 'seguro vehículo', 'comparador seguros', 'seguro barato'],
    insuranceType: 'AUTO',
    theme: 'auto',
    source: 'landing-seguro-auto',
    gamificationPoints: 200,
    showPricing: true,
  },

  hero: {
    title: 'Protege tu coche\\nal mejor precio',
    subtitle: 'Comparamos entre más de 20 aseguradoras para ofrecerte la mejor cobertura al precio más competitivo. Sin letra pequeña.',
    badge: 'Desde 15€/mes',
    ctaPrimary: { text: 'Calcular mi precio', scrollTo: 'cta-section' },
    ctaSecondary: { text: 'Ver coberturas', href: '#coverages' },
  },

  trustBar: {
    items: [
      { icon: 'Shield', text: 'Cobertura total', highlight: '' },
      { icon: 'Clock', text: 'Asistencia', highlight: '24/7' },
      { icon: 'Car', text: 'Coche sustitución', highlight: 'incluido' },
      { icon: 'Phone', text: 'Gestión siniestros', highlight: 'personal' },
    ],
  },

  coverages: {
    title: 'Elige tu cobertura ideal',
    subtitle: 'Todas incluyen asistencia en carretera 24h y gestión de siniestros',
    cards: [
      {
        id: 'terceros',
        name: 'Terceros',
        price: 'Desde 15€',
        period: 'mes',
        description: 'Cobertura básica obligatoria',
        features: [
          'Responsabilidad civil ilimitada',
          'Defensa jurídica',
          'Asistencia en carretera 24h',
          { text: 'Lunas', included: false },
          { text: 'Robo', included: false },
        ],
        ctaText: 'Solicitar precio',
      },
      {
        id: 'terceros-ampliado',
        name: 'Terceros Ampliado',
        price: 'Desde 22€',
        period: 'mes',
        description: 'Lo más contratado',
        popular: true,
        features: [
          'Todo lo de Terceros',
          'Rotura de lunas',
          'Robo e incendio',
          'Coche de sustitución',
          { text: 'Daños propios', included: false },
        ],
        ctaText: 'Solicitar precio',
      },
      {
        id: 'todo-riesgo',
        name: 'Todo Riesgo',
        price: 'Desde 35€',
        period: 'mes',
        description: 'Protección máxima',
        features: [
          'Todo lo anterior',
          'Daños propios sin franquicia',
          'Accidentes conductor',
          'Asistencia premium',
          'Vehículo de cortesía ilimitado',
        ],
        ctaText: 'Solicitar precio',
      },
    ],
  },

  benefits: {
    title: '¿Por qué asegurar tu coche con nosotros?',
    subtitle: 'Más de 25 años ayudando a conductores como tú',
    items: [
      {
        icon: 'Search',
        title: 'Comparamos por ti',
        description: 'Analizamos más de 20 aseguradoras para encontrar la mejor relación calidad-precio.',
      },
      {
        icon: 'Clock',
        title: 'Asistencia 24/7',
        description: 'Grúa, coche de sustitución y asistencia en carretera disponible las 24 horas.',
      },
      {
        icon: 'FileText',
        title: 'Gestión de siniestros',
        description: 'Nos encargamos de todo el papeleo. Tú solo preocúpate de conducir.',
      },
      {
        icon: 'Shield',
        title: 'Sin letra pequeña',
        description: 'Coberturas claras y transparentes. Sin sorpresas ni exclusiones ocultas.',
      },
      {
        icon: 'Percent',
        title: 'Precio garantizado',
        description: 'Si encuentras algo mejor, lo igualamos. Garantía de mejor precio.',
      },
      {
        icon: 'Trophy',
        title: '+200 puntos Soriano Club',
        description: 'Acumula puntos y canjéalos por descuentos y regalos exclusivos.',
      },
    ],
  },

  stats: {
    title: 'Números que nos avalan',
    items: [
      { value: 25000, suffix: '+', label: 'Coches asegurados' },
      { value: 98, suffix: '%', label: 'Clientes satisfechos' },
      { value: 24, suffix: 'h', label: 'Gestión siniestros' },
      { value: 25, suffix: ' años', label: 'De experiencia' },
    ],
    variant: 'default',
  },

  testimonials: {
    title: 'Lo que dicen nuestros clientes',
    subtitle: 'Miles de conductores ya confían en nosotros',
    items: [
      {
        id: '1',
        name: 'Carlos Rodríguez',
        role: 'Cliente desde 2019',
        content: 'Tuve un accidente y la gestión fue impecable. En 48h tenía coche de sustitución y todo resuelto. Muy recomendable.',
        rating: 5,
        insuranceType: 'Todo Riesgo',
      },
      {
        id: '2',
        name: 'María García',
        role: 'Cliente desde 2021',
        content: 'Cambié de mi anterior compañía y me ahorro 200€ al año con la misma cobertura. El trato es muy cercano.',
        rating: 5,
        insuranceType: 'Terceros Ampliado',
      },
      {
        id: '3',
        name: 'Antonio López',
        role: 'Cliente desde 2018',
        content: 'Llevo 6 años con ellos y nunca he tenido ningún problema. La asistencia en carretera funciona perfecta.',
        rating: 5,
        insuranceType: 'Todo Riesgo',
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    subtitle: 'Resolvemos tus dudas sobre el seguro de coche',
    items: [
      {
        question: '¿Qué documentación necesito para contratar?',
        answer: 'Solo necesitas el DNI del tomador, el permiso de circulación del vehículo y los datos del conductor habitual. Todo el proceso se puede hacer online.',
      },
      {
        question: '¿Puedo cambiar de compañía en cualquier momento?',
        answer: 'Sí, con un mes de antelación a la fecha de vencimiento puedes cambiar sin penalización. Nosotros nos encargamos de gestionar la baja con tu aseguradora anterior.',
      },
      {
        question: '¿Qué pasa si tengo un siniestro?',
        answer: 'Llámanos al 900 123 456 y nos encargamos de todo: grúa, coche de sustitución, gestión con talleres y peritaje. Tú solo firma el parte.',
      },
      {
        question: '¿Cubren conductores ocasionales?',
        answer: 'Sí, todas nuestras pólizas incluyen conductor ocasional sin coste adicional. Si hay conductor novel, lo indicamos al calcular el precio.',
      },
      {
        question: '¿Tienen descuento por segundo coche?',
        answer: 'Sí, ofrecemos hasta un 15% de descuento por asegurar más de un vehículo con nosotros.',
      },
    ],
  },

  cta: {
    title: '¿Listo para ahorrar en tu seguro de coche?',
    subtitle: 'Calcula tu precio en 1 minuto. Sin compromiso.',
    features: [
      'Comparamos +20 aseguradoras',
      'Precio final sin sorpresas',
      'Gestión de siniestros incluida',
      'Asistencia 24h desde el primer día',
    ],
    formTitle: 'Te llamamos gratis',
    formSubtitle: 'Un asesor te contactará con tu presupuesto personalizado',
    formButtonText: 'Quiero mi precio',
    phone: '900 123 456',
  },
}
