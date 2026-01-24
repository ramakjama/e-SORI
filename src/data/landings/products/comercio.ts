import { LandingContent } from '@/lib/landing/types'

export const comercioLanding: LandingContent = {
  config: {
    slug: 'seguro-comercio',
    title: 'Seguro de Comercio | Soriano Mediadores',
    description: 'Protege tu negocio con el seguro de comercio más completo. Incendio, robo, RC y más. Desde 25€/mes.',
    keywords: ['seguro comercio', 'seguro tienda', 'seguro negocio', 'seguro local comercial'],
    insuranceType: 'COMERCIO',
    theme: 'comercio',
    source: 'landing-seguro-comercio',
    gamificationPoints: 250,
  },
  hero: {
    title: 'Tu negocio,\nsiempre protegido',
    subtitle: 'Seguro integral para comercios y negocios. Cubre incendio, robo, daños y responsabilidad civil.',
    badge: 'Desde 25€/mes',
    ctaPrimary: { text: 'Calcular precio', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Store', text: 'Comercios', highlight: 'asegurados' },
      { icon: 'Shield', text: 'Cobertura', highlight: 'total' },
      { icon: 'Clock', text: 'Asistencia', highlight: '24h' },
      { icon: 'FileText', text: 'Trámites', highlight: 'sencillos' },
    ],
  },
  coverages: {
    title: 'Coberturas para tu negocio',
    cards: [
      {
        id: 'basico',
        name: 'Básico',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Incendio y explosión', 'Daños por agua', 'Robo y expoliación', 'Rotura de cristales'],
      },
      {
        id: 'profesional',
        name: 'Profesional',
        price: 'Desde 45€',
        period: 'mes',
        features: ['Todo lo de Básico', 'RC Explotación 300.000€', 'Pérdida de beneficios', 'Avería de maquinaria', 'Mercancías refrigeradas'],
        popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 75€',
        period: 'mes',
        features: ['Todo lo de Profesional', 'RC Patronal', 'Daños eléctricos', 'Asistencia informática', 'Defensa jurídica'],
      },
    ],
  },
  benefits: {
    title: 'Protección completa para tu comercio',
    items: [
      { icon: 'Flame', title: 'Incendio y explosión', description: 'Cobertura total ante incendios, explosiones y daños por humo.' },
      { icon: 'Lock', title: 'Robo y vandalismo', description: 'Protección contra robos, hurtos y actos vandálicos.' },
      { icon: 'Users', title: 'Responsabilidad Civil', description: 'Cubre daños a terceros en tu establecimiento.' },
      { icon: 'Wrench', title: 'Avería de equipos', description: 'Reparación o sustitución de maquinaria y equipos.' },
      { icon: 'TrendingDown', title: 'Pérdida de beneficios', description: 'Compensación si tienes que cerrar temporalmente.' },
      { icon: 'Gavel', title: 'Defensa jurídica', description: 'Asistencia legal en conflictos relacionados con tu negocio.' },
    ],
  },
  stats: {
    items: [
      { value: 3500, suffix: '+', label: 'Comercios protegidos' },
      { value: 98, suffix: '%', label: 'Satisfacción clientes' },
      { value: 48, suffix: 'h', label: 'Resolución siniestros' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Antonio García',
        role: 'Propietario de ferretería',
        content: 'Tuve un robo en mi tienda y el seguro cubrió todo. La gestión fue rapidísima.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'María López',
        role: 'Dueña de boutique',
        content: 'El mejor seguro para mi tienda. La asistencia 24h me da mucha tranquilidad.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Carlos Martínez',
        role: 'Propietario de restaurante',
        content: 'Excelente cobertura y precio. Muy recomendable para cualquier negocio.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Qué tipos de comercio puedo asegurar?', answer: 'Aseguramos todo tipo de comercios: tiendas, restaurantes, bares, peluquerías, talleres, oficinas y más.' },
      { question: '¿Está incluida la RC?', answer: 'Sí, todas las modalidades incluyen Responsabilidad Civil de explotación. En Premium además incluye RC Patronal.' },
      { question: '¿Cubre el robo de dinero en caja?', answer: 'Sí, cubrimos el robo de dinero en efectivo con límites según la modalidad contratada.' },
      { question: '¿Qué pasa si tengo que cerrar por un siniestro?', answer: 'La cobertura de pérdida de beneficios compensa los ingresos perdidos durante el cierre temporal.' },
    ],
  },
  cta: {
    title: 'Protege tu negocio hoy',
    features: ['Presupuesto en 24h', 'Sin compromiso', 'Asesoramiento personalizado'],
    formButtonText: 'Solicitar presupuesto',
    phone: '900 123 456',
  },
}
