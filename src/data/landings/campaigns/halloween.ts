import { LandingContent } from '@/lib/landing/types'

export const halloweenLanding: LandingContent = {
  config: {
    slug: 'halloween',
    title: 'Halloween - Seguros de Miedo | Soriano Mediadores',
    description: 'Ofertas terroríficamente buenas en seguros. Descuentos de miedo y sorpresas espeluznantes.',
    keywords: ['ofertas halloween', 'seguros descuento', 'promocion octubre seguros'],
    insuranceType: 'GENERAL',
    theme: 'halloween',
    source: 'landing-halloween',
    campaign: 'halloween-2025',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Seguros de\nMIEDO',
    subtitle: 'Ofertas terroríficamente buenas. Descuentos que dan miedo y sorpresas espeluznantes.',
    badge: 'Ofertas de miedo',
    ctaPrimary: { text: 'Ver ofertas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Percent', text: 'Descuentos', highlight: 'de miedo' },
      { icon: 'Gift', text: 'Sorpresas', highlight: 'terroríficas' },
      { icon: 'Zap', text: 'Solo', highlight: '7 días' },
      { icon: 'Star', text: 'Ofertas', highlight: 'limitadas' },
    ],
  },
  coverages: {
    title: 'Ofertas espeluznantes',
    cards: [
      {
        id: 'pack-susto',
        name: 'Pack Susto',
        price: 'Desde 13€',
        period: 'mes',
        features: ['Hogar básico', 'RC familiar', 'Asistencia urgencias', '31% dto. Halloween', '🎃 Sorpresa incluida'],
      },
      {
        id: 'pack-terror',
        name: 'Pack Terror',
        price: 'Desde 31€',
        period: 'mes',
        features: ['Hogar completo', 'Vida 50.000€', 'Accidentes', '31% dto. Halloween', '🎃 Pack decoración', '👻 Experiencia terror'],
        popular: true,
      },
      {
        id: 'pack-pesadilla',
        name: 'Pack Pesadilla',
        price: 'Desde 66€',
        period: 'mes',
        features: ['Todo lo anterior', 'Salud familiar', 'Mascotas', '31% dto. total', '🎃 Experiencia VIP'],
      },
    ],
  },
  benefits: {
    title: 'Sin trucos, solo tratos',
    items: [
      { icon: 'Percent', title: '31% descuento real', description: 'Descuento de verdad, sin letra pequeña terrorífica.' },
      { icon: 'Gift', title: 'Sorpresas incluidas', description: 'Pack de Halloween o entrada a experiencia de terror.' },
      { icon: 'Clock', title: 'Solo 7 días', description: 'Del 25 al 31 de octubre. Después, se esfuma.' },
      { icon: 'Shield', title: 'Protección real', description: 'Detrás del disfraz, seguros de verdad.' },
    ],
  },
  stats: {
    items: [
      { value: 31, suffix: '%', label: 'Descuento Halloween' },
      { value: 7, suffix: 'días', label: 'Duración oferta' },
      { value: 666, suffix: '+', label: 'Pólizas contratadas' },
    ],
  },
  faq: {
    items: [
      { question: '¿El 31% es un descuento real?', answer: 'Sí, es un descuento real sobre nuestra tarifa habitual. Sin trucos.' },
      { question: '¿Qué sorpresa incluye?', answer: 'Dependiendo del pack: decoración Halloween, entradas a pasaje del terror o experiencia escape room.' },
      { question: '¿Hasta cuándo puedo contratar?', answer: 'La oferta termina el 31 de octubre a medianoche. Como Cenicienta, pero más terrorífico.' },
      { question: '¿El seguro empieza en Halloween?', answer: 'Puedes elegir la fecha de inicio. Si lo quieres para el 31, lo tendrás.' },
    ],
  },
  cta: {
    title: 'Trato o... ¡TRATO!',
    features: ['31% descuento', 'Sorpresa incluida', 'Solo hasta el 31'],
    formButtonText: 'Quiero mi oferta',
    phone: '900 123 456',
  },
}
