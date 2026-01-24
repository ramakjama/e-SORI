import { LandingContent } from '@/lib/landing/types'

export const viajeLanding: LandingContent = {
  config: {
    slug: 'seguro-viaje',
    title: 'Seguro de Viaje | Soriano Mediadores',
    description: 'Viaja tranquilo con el mejor seguro de viaje. Asistencia médica, cancelación y equipaje. Desde 1€/día.',
    keywords: ['seguro viaje', 'seguro vacaciones', 'asistencia viaje', 'seguro médico viaje'],
    insuranceType: 'VIAJE',
    theme: 'viaje',
    source: 'landing-seguro-viaje',
    gamificationPoints: 100,
  },
  hero: {
    title: 'Viaja sin\npreocupaciones',
    subtitle: 'Seguro de viaje con asistencia médica 24h en todo el mundo. Cancelación, equipaje y más.',
    badge: 'Desde 1€/día',
    ctaPrimary: { text: 'Calcular precio', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Globe', text: 'Cobertura', highlight: 'mundial' },
      { icon: 'Heart', text: 'Asistencia', highlight: 'médica 24h' },
      { icon: 'Briefcase', text: 'Equipaje', highlight: 'protegido' },
      { icon: 'Calendar', text: 'Cancelación', highlight: 'incluida' },
    ],
  },
  coverages: {
    title: 'Coberturas del seguro de viaje',
    cards: [
      {
        id: 'basico',
        name: 'Básico',
        price: 'Desde 1€',
        period: 'día',
        features: ['Asistencia médica 30.000€', 'Repatriación', 'Equipaje 500€', 'Responsabilidad civil'],
      },
      {
        id: 'completo',
        name: 'Completo',
        price: 'Desde 2€',
        period: 'día',
        features: ['Asistencia médica 100.000€', 'Cancelación 2.500€', 'Equipaje 1.500€', 'Demora de vuelo', 'Robo documentos'],
        popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 4€',
        period: 'día',
        features: ['Asistencia médica 300.000€', 'Cancelación 5.000€', 'Equipaje 3.000€', 'Deportes de aventura', 'COVID-19 incluido'],
      },
    ],
  },
  benefits: {
    title: 'Viaja protegido a cualquier destino',
    items: [
      { icon: 'Heart', title: 'Asistencia médica 24h', description: 'Atención médica en cualquier parte del mundo, las 24 horas.' },
      { icon: 'Plane', title: 'Cancelación de viaje', description: 'Recupera tu dinero si no puedes viajar por causas justificadas.' },
      { icon: 'Briefcase', title: 'Equipaje protegido', description: 'Cobertura por pérdida, robo o daños en tu equipaje.' },
      { icon: 'Clock', title: 'Demoras cubiertas', description: 'Compensación por retrasos de vuelo o conexiones perdidas.' },
    ],
  },
  stats: {
    items: [
      { value: 25000, suffix: '+', label: 'Viajes asegurados/año' },
      { value: 180, suffix: '+', label: 'Países cubiertos' },
      { value: 24, suffix: '/7', label: 'Asistencia disponible' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Laura Sánchez',
        role: 'Viajera frecuente',
        content: 'Me enfermé en Tailandia y el seguro cubrió todo, incluso el hospital privado. Increíble servicio.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Pedro Ruiz',
        role: 'Mochilero',
        content: 'Me perdieron la maleta y me compensaron en menos de una semana. Muy recomendable.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Ana Martín',
        role: 'Viaje en familia',
        content: 'Tuvimos que cancelar el viaje y nos devolvieron todo. Tranquilidad total.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Cubre COVID-19?', answer: 'Sí, la modalidad Premium incluye cobertura completa por COVID-19: asistencia médica, cuarentena y cancelación.' },
      { question: '¿Puedo contratar si ya estoy de viaje?', answer: 'Sí, puedes contratar el seguro hasta 72h después de iniciar el viaje, aunque algunas coberturas tienen carencia.' },
      { question: '¿Qué pasa si pierdo el vuelo?', answer: 'Cubrimos los gastos de alojamiento y transporte alternativo si pierdes una conexión por causas ajenas.' },
      { question: '¿Incluye deportes de aventura?', answer: 'La modalidad Premium incluye deportes de aventura. Para deportes extremos consulta condiciones especiales.' },
    ],
  },
  cta: {
    title: 'Contrata tu seguro de viaje',
    features: ['Contratación online inmediata', 'Certificado al instante', 'Asistencia en español'],
    formButtonText: 'Calcular precio',
    phone: '900 123 456',
  },
}
