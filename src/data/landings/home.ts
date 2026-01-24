import { LandingContent } from '@/lib/landing/types'

export const homeLanding: LandingContent = {
  config: {
    slug: 'home',
    title: 'Soriano Mediadores | Seguros en la Costa Blanca',
    description: 'Tu correduría de seguros de confianza en Villajoyosa y Costa Blanca. Auto, hogar, salud, vida y más. Asesoramiento personalizado desde 1985.',
    keywords: ['seguros costa blanca', 'correduría seguros villajoyosa', 'seguros alicante', 'soriano mediadores'],
    insuranceType: 'GENERAL',
    theme: 'general',
    source: 'landing-home',
    gamificationPoints: 100,
  },
  hero: {
    title: 'Tus seguros,\nen buenas manos',
    subtitle: 'Más de 35 años protegiendo a familias y empresas en la Costa Blanca. Asesoramiento personalizado y las mejores coberturas al mejor precio.',
    badge: 'Desde 1985',
    ctaPrimary: { text: 'Calcular precio', scrollTo: 'cta-section' },
    ctaSecondary: { text: 'Ver productos', href: '#productos' },
  },
  trustBar: {
    items: [
      { icon: 'Shield', text: '+50.000', highlight: 'clientes' },
      { icon: 'Award', text: '35 años', highlight: 'experiencia' },
      { icon: 'Users', text: 'Atención', highlight: 'personal' },
      { icon: 'MapPin', text: 'Costa Blanca', highlight: 'local' },
    ],
  },
  coverages: {
    title: 'Nuestros productos',
    cards: [
      {
        id: 'auto',
        name: 'Seguro Auto',
        price: 'Desde 15€',
        period: 'mes',
        features: ['Todo riesgo disponible', 'Asistencia 24h', 'Sin permanencia'],
        ctaText: 'Ver más',
        ctaHref: '/landing/seguro-auto',
      },
      {
        id: 'hogar',
        name: 'Seguro Hogar',
        price: 'Desde 8€',
        period: 'mes',
        features: ['Asistencia urgencias', 'RC familiar', 'Todo incluido'],
        popular: true,
        ctaText: 'Ver más',
        ctaHref: '/landing/seguro-hogar',
      },
      {
        id: 'salud',
        name: 'Seguro Salud',
        price: 'Desde 35€',
        period: 'mes',
        features: ['+40.000 especialistas', 'Sin copagos', 'Dental incluido'],
        ctaText: 'Ver más',
        ctaHref: '/landing/seguro-salud',
      },
      {
        id: 'vida',
        name: 'Seguro Vida',
        price: 'Desde 5€',
        period: 'mes',
        features: ['Hasta 300.000€', 'Beneficio fiscal', 'Sin exámenes'],
        ctaText: 'Ver más',
        ctaHref: '/landing/seguro-vida',
      },
    ],
  },
  benefits: {
    title: '¿Por qué Soriano Mediadores?',
    items: [
      { icon: 'Users', title: 'Trato personal', description: 'No somos un call center. Te conocemos por tu nombre y cuidamos de ti.' },
      { icon: 'TrendingDown', title: 'Mejor precio', description: 'Comparamos entre +20 aseguradoras para darte siempre el mejor precio.' },
      { icon: 'Clock', title: 'Gestión rápida', description: 'Siniestros, modificaciones y consultas resueltas en menos de 24h.' },
      { icon: 'MapPin', title: 'Aquí cerca', description: 'Oficinas en Villajoyosa. Estamos donde tú estás, en la Costa Blanca.' },
    ],
  },
  stats: {
    items: [
      { value: 50000, suffix: '+', label: 'Clientes activos' },
      { value: 35, suffix: '+', label: 'Años de experiencia' },
      { value: 98, suffix: '%', label: 'Clientes satisfechos' },
      { value: 24, suffix: 'h', label: 'Respuesta garantizada' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'María García',
        role: 'Cliente desde 2018',
        content: 'Llevo años con ellos y la atención es excepcional. Cuando tuve un accidente, me gestionaron todo sin moverme del sofá.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Antonio Pérez',
        role: 'Empresario, cliente desde 2015',
        content: 'Tengo la flota de mi empresa y todos los seguros personales con Soriano. Precio y servicio inmejorables.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Laura Martínez',
        role: 'Cliente desde 2020',
        content: 'Cambié de una gran aseguradora y la diferencia es brutal. Aquí te escuchan y te ayudan de verdad.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Cómo puedo contratar un seguro?', answer: 'Puedes contactarnos por teléfono, email, WhatsApp o visitarnos en nuestra oficina de Villajoyosa. En menos de 10 minutos tienes tu presupuesto.' },
      { question: '¿Trabajáis con todas las aseguradoras?', answer: 'Trabajamos con más de 20 compañías aseguradoras de primer nivel, lo que nos permite ofrecerte siempre el mejor precio y cobertura.' },
      { question: '¿Qué pasa si tengo un siniestro?', answer: 'Nos encargamos de todo. Solo tienes que llamarnos y gestionamos el siniestro de principio a fin sin que tengas que preocuparte.' },
      { question: '¿Puedo traspasar mis seguros actuales?', answer: 'Por supuesto. Gestionamos el traspaso de tus pólizas sin coste y sin que pierdas cobertura ni un solo día.' },
    ],
  },
  cta: {
    title: 'Empieza a ahorrar hoy',
    subtitle: 'Solicita tu presupuesto sin compromiso',
    features: ['Presupuesto en 24h', 'Sin compromiso', 'Asesoramiento gratuito'],
    formButtonText: 'Solicitar presupuesto',
    phone: '900 123 456',
    showPhone: true,
  },
}
