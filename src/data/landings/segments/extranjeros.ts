import { LandingContent } from '@/lib/landing/types'

export const extranjerosLanding: LandingContent = {
  config: {
    slug: 'extranjeros',
    title: 'Seguros para Extranjeros en España | Soriano Mediadores',
    description: 'Seguros para expatriados y extranjeros residentes en España. Salud, hogar y auto sin complicaciones.',
    keywords: ['seguros extranjeros españa', 'seguro expatriados', 'seguro salud extranjero', 'insurance spain'],
    insuranceType: 'GENERAL',
    theme: 'extranjeros',
    source: 'landing-extranjeros',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Tu seguro\nen España',
    subtitle: 'Seguros pensados para extranjeros y expatriados. Salud privada, hogar y auto. Sin complicaciones.',
    badge: 'Expat friendly',
    ctaPrimary: { text: 'Ver seguros', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Heart', text: 'Salud', highlight: 'privada' },
      { icon: 'FileText', text: 'Visado', highlight: 'válido' },
      { icon: 'Globe', text: 'Atención', highlight: 'multilingüe' },
      { icon: 'Home', text: 'Hogar', highlight: 'alquiler' },
    ],
  },
  coverages: {
    title: 'Seguros para tu nueva vida',
    cards: [
      {
        id: 'salud-expat',
        name: 'Salud Expat',
        price: 'Desde 55€',
        period: 'mes',
        features: ['Válido para visado/NIE', 'Sin copagos', 'Medicina general', 'Urgencias 24h', 'Atención en inglés'],
      },
      {
        id: 'pack-expat',
        name: 'Pack Expat',
        price: 'Desde 95€',
        period: 'mes',
        features: ['Salud completa', 'Hogar alquiler', 'Repatriación', 'Dental básico', 'Gestor multilingüe'],
        popular: true,
      },
      {
        id: 'pack-completo',
        name: 'Pack Completo',
        price: 'Desde 150€',
        period: 'mes',
        features: ['Pack Expat', 'Auto en España', 'Salud reembolso', 'Viajes a tu país', 'Asistencia legal'],
      },
    ],
  },
  benefits: {
    title: 'Pensados para ti',
    items: [
      { icon: 'FileText', title: 'Válido para visado', description: 'Nuestro seguro de salud cumple los requisitos para visado y NIE.' },
      { icon: 'Globe', title: 'Atención multilingüe', description: 'Te atendemos en español, inglés, francés y alemán.' },
      { icon: 'CreditCard', title: 'Pago flexible', description: 'Paga mensualmente sin necesidad de cuenta bancaria española.' },
      { icon: 'Plane', title: 'Viajes a tu país', description: 'Cobertura de salud cuando visites tu país de origen.' },
    ],
  },
  stats: {
    items: [
      { value: 4500, suffix: '+', label: 'Expats asegurados' },
      { value: 85, suffix: '+', label: 'Nacionalidades' },
      { value: 4, suffix: '', label: 'Idiomas de atención' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Emma Johnson',
        role: 'British, Barcelona',
        content: 'Getting insurance was surprisingly easy. The English support made everything smooth.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Hans Mueller',
        role: 'German, Madrid',
        content: 'Die Krankenversicherung wurde sofort für mein Visum akzeptiert. Sehr professionell.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Marie Dubois',
        role: 'French, Valencia',
        content: 'Le pack expat est parfait pour nous. Santé et logement en un seul contrat.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: 'Is the health insurance valid for visa/NIE?', answer: 'Yes, our health insurance meets all requirements for non-lucrative visa and NIE applications.' },
      { question: '¿Necesito cuenta bancaria española?', answer: 'No, puedes pagar con tarjeta extranjera o transferencia internacional.' },
      { question: 'Can I get coverage for pre-existing conditions?', answer: 'Yes, though some conditions may have waiting periods. We\'ll explain everything clearly.' },
      { question: '¿El seguro de auto acepta carnet extranjero?', answer: 'Sí, aceptamos carnets de la UE y de terceros países con traducción oficial.' },
    ],
  },
  cta: {
    title: 'Start your life in Spain protected',
    features: ['Multilingual support', 'Visa-compliant', 'No Spanish bank needed'],
    formButtonText: 'Get a quote',
    phone: '900 123 456',
  },
}
