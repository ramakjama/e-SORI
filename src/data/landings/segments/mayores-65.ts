import { LandingContent } from '@/lib/landing/types'

export const mayores65Landing: LandingContent = {
  config: {
    slug: 'mayores-65',
    title: 'Seguros para Mayores de 65 | Soriano Mediadores',
    description: 'Seguros pensados para seniors. Salud sin límite de edad, decesos y hogar con asistencia. Tranquilidad para ti y tu familia.',
    keywords: ['seguros mayores 65', 'seguro salud mayores', 'seguro decesos', 'seguro tercera edad'],
    insuranceType: 'GENERAL',
    theme: 'mayores-65',
    source: 'landing-mayores-65',
    gamificationPoints: 250,
  },
  hero: {
    title: 'Seguros sin\nlímite de edad',
    subtitle: 'Protección pensada para ti. Salud, decesos y hogar con coberturas adaptadas y asistencia personalizada.',
    badge: 'Sin límite de edad',
    ctaPrimary: { text: 'Ver coberturas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Heart', text: 'Salud', highlight: 'completa' },
      { icon: 'Shield', text: 'Decesos', highlight: 'familiar' },
      { icon: 'Home', text: 'Hogar', highlight: 'asistido' },
      { icon: 'Phone', text: 'Atención', highlight: 'personal' },
    ],
  },
  coverages: {
    title: 'Seguros para tu tranquilidad',
    cards: [
      {
        id: 'salud-senior',
        name: 'Salud Senior',
        price: 'Desde 85€',
        period: 'mes',
        features: ['Sin límite de edad', 'Hospitalización', 'Consultas especialistas', 'Pruebas diagnósticas', 'Dental básico'],
      },
      {
        id: 'pack-tranquilidad',
        name: 'Pack Tranquilidad',
        price: 'Desde 120€',
        period: 'mes',
        features: ['Salud completa', 'Decesos familiar', 'Hogar con asistencia', 'Teleasistencia incluida', 'Gestor personal'],
        popular: true,
      },
      {
        id: 'premium-senior',
        name: 'Premium Senior',
        price: 'Desde 180€',
        period: 'mes',
        features: ['Todo lo anterior', 'Reembolso médico', 'Segunda opinión', 'Acompañamiento hospital', 'Ayuda domicilio'],
      },
    ],
  },
  benefits: {
    title: 'Coberturas pensadas para ti',
    items: [
      { icon: 'Heart', title: 'Sin límite de edad', description: 'Acceso a seguros de salud sin importar tu edad.' },
      { icon: 'Phone', title: 'Teleasistencia 24h', description: 'Botón de emergencia conectado con central de asistencia.' },
      { icon: 'Home', title: 'Asistencia hogar', description: 'Reparaciones urgentes y pequeñas ayudas domésticas.' },
      { icon: 'Users', title: 'Acompañamiento', description: 'Servicio de acompañamiento a consultas médicas.' },
    ],
  },
  stats: {
    items: [
      { value: 9500, suffix: '+', label: 'Seniors asegurados' },
      { value: 0, suffix: '', label: 'Límite de edad' },
      { value: 97, suffix: '%', label: 'Satisfacción' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Carmen S.',
        role: '72 años, Madrid',
        content: 'Por fin encontré un seguro de salud que me acepta sin problemas. La atención es excelente.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Antonio L.',
        role: '68 años, Valencia',
        content: 'La teleasistencia da mucha tranquilidad a mis hijos. Y a mí también.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Pilar M.',
        role: '75 años, Sevilla',
        content: 'El servicio de acompañamiento al médico es maravilloso. No me siento sola.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Hay límite de edad para contratar?', answer: 'No, puedes contratar nuestros seguros a cualquier edad. No ponemos límites.' },
      { question: '¿Qué es la teleasistencia?', answer: 'Un dispositivo (pulsera o colgante) que te conecta 24h con una central de emergencias.' },
      { question: '¿Cubren enfermedades preexistentes?', answer: 'Sí, aunque algunas pueden tener carencias específicas. Te informamos con total transparencia.' },
      { question: '¿El seguro de decesos tiene carencia?', answer: 'Para fallecimiento por enfermedad hay 6 meses de carencia. Por accidente, cobertura inmediata.' },
    ],
  },
  cta: {
    title: 'Tu tranquilidad es lo primero',
    features: ['Asesoramiento telefónico', 'Sin reconocimiento médico', 'Atención personalizada'],
    formButtonText: 'Solicitar información',
    phone: '900 123 456',
  },
}
