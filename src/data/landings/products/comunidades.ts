import { LandingContent } from '@/lib/landing/types'

export const comunidadesLanding: LandingContent = {
  config: {
    slug: 'seguro-comunidades',
    title: 'Seguro de Comunidades | Soriano Mediadores',
    description: 'Seguro para comunidades de propietarios. Daños al edificio, RC y defensa jurídica. Desde 15€/vivienda/año.',
    keywords: ['seguro comunidades', 'seguro comunidad propietarios', 'seguro edificio', 'seguro finca'],
    insuranceType: 'COMUNIDADES',
    theme: 'comunidades',
    source: 'landing-seguro-comunidades',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Tu comunidad,\nbien protegida',
    subtitle: 'Seguro integral para comunidades de propietarios. Daños al edificio, zonas comunes y responsabilidad civil.',
    badge: 'Desde 15€/viv./año',
    ctaPrimary: { text: 'Solicitar presupuesto', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Building', text: 'Edificio', highlight: 'cubierto' },
      { icon: 'Users', text: 'Zonas comunes', highlight: 'incluidas' },
      { icon: 'Shield', text: 'RC', highlight: 'completa' },
      { icon: 'Gavel', text: 'Defensa', highlight: 'jurídica' },
    ],
  },
  coverages: {
    title: 'Coberturas para tu comunidad',
    cards: [
      {
        id: 'basico',
        name: 'Básico',
        price: 'Desde 15€',
        period: 'viv./año',
        features: ['Incendio y explosión', 'Daños por agua', 'Fenómenos atmosféricos', 'RC comunidad 150.000€'],
      },
      {
        id: 'completo',
        name: 'Completo',
        price: 'Desde 25€',
        period: 'viv./año',
        features: ['Todo lo de Básico', 'RC ampliada 600.000€', 'Vandalismo', 'Rotura de cristales', 'Averías instalaciones'],
        popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 40€',
        period: 'viv./año',
        features: ['Todo lo de Completo', 'RC 1.500.000€', 'Daños estéticos', 'Defensa jurídica', 'Asistencia 24h hogar'],
      },
    ],
  },
  benefits: {
    title: 'Protección integral para tu edificio',
    items: [
      { icon: 'Flame', title: 'Incendio y explosión', description: 'Cobertura total del edificio ante incendios, explosiones y daños por humo.' },
      { icon: 'Droplet', title: 'Daños por agua', description: 'Roturas de tuberías, filtraciones y daños por agua en zonas comunes.' },
      { icon: 'Users', title: 'Responsabilidad Civil', description: 'Daños a terceros causados por elementos del edificio o zonas comunes.' },
      { icon: 'Gavel', title: 'Defensa jurídica', description: 'Asistencia legal para la comunidad en conflictos y reclamaciones.' },
      { icon: 'Wrench', title: 'Averías instalaciones', description: 'Reparación de ascensores, calderas, sistemas eléctricos y fontanería.' },
      { icon: 'Shield', title: 'Vandalismo', description: 'Daños causados por actos vandálicos en zonas comunes y fachada.' },
    ],
  },
  stats: {
    items: [
      { value: 850, suffix: '+', label: 'Comunidades aseguradas' },
      { value: 45000, suffix: '+', label: 'Viviendas protegidas' },
      { value: 96, suffix: '%', label: 'Renovaciones' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Comunidad Jardines del Sur',
        role: '48 viviendas, Sevilla',
        content: 'Tuvimos una inundación en el garaje y la respuesta fue inmediata. Muy profesionales.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Edificio Plaza Mayor',
        role: '24 viviendas, Madrid',
        content: 'El mejor seguro que hemos tenido. Precio competitivo y coberturas muy completas.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Qué incluye la RC de comunidad?', answer: 'Cubre daños a terceros causados por elementos del edificio: caída de tejas, desprendimientos, daños por obras, etc.' },
      { question: '¿Cubre las viviendas individuales?', answer: 'El seguro cubre elementos comunes y estructura. Cada propietario debe tener su seguro de hogar para el interior.' },
      { question: '¿Incluye el ascensor?', answer: 'Sí, las averías del ascensor están cubiertas, así como la RC por accidentes en el mismo.' },
      { question: '¿Qué pasa con las filtraciones entre pisos?', answer: 'Las filtraciones de zonas comunes están cubiertas. Para filtraciones entre viviendas, se coordina con los seguros individuales.' },
    ],
  },
  cta: {
    title: 'Protege tu comunidad',
    features: ['Presupuesto sin compromiso', 'Visita gratuita', 'Precio por vivienda'],
    formButtonText: 'Solicitar presupuesto',
    phone: '900 123 456',
  },
}
