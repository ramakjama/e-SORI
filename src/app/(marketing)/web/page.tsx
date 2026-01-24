'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Car,
  Home,
  Heart,
  HeartPulse,
  Shield,
  Trophy,
  Gift,
  Sparkles,
  ArrowRight,
  Calculator,
  Users,
  Clock,
  CheckCircle,
  Star,
} from 'lucide-react'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { StatsCounter } from '@/components/marketing/StatsCounter'
import { TestimonialCarousel } from '@/components/marketing/TestimonialCarousel'
import { TrustBadges } from '@/components/marketing/TrustBadges'
import { LeadForm } from '@/components/forms/LeadForm'

const insuranceTypes = [
  {
    icon: Car,
    name: 'Seguro Auto',
    description: 'Protección completa para tu vehículo con las mejores coberturas',
    price: 'Desde 15€/mes',
    href: '/landing/seguro-auto',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Home,
    name: 'Seguro Hogar',
    description: 'Tu casa protegida 24/7 con asistencia inmediata',
    price: 'Desde 8€/mes',
    href: '/landing/seguro-hogar',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: HeartPulse,
    name: 'Seguro Salud',
    description: 'Cuida de ti y tu familia con el mejor cuadro médico',
    price: 'Desde 25€/mes',
    href: '/landing/seguro-salud',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    icon: Heart,
    name: 'Seguro Vida',
    description: 'Protege el futuro de los tuyos con total tranquilidad',
    price: 'Desde 5€/mes',
    href: '/landing/seguro-vida',
    gradient: 'from-rose-500 to-rose-600',
  },
]

const features = [
  {
    icon: Shield,
    title: 'Las mejores aseguradoras',
    description: 'Trabajamos con Occident, Mapfre, AXA, Zurich y las principales compañías del mercado.',
  },
  {
    icon: Calculator,
    title: 'Precio garantizado',
    description: 'Te garantizamos el mejor precio. Si encuentras algo mejor, lo igualamos.',
  },
  {
    icon: Users,
    title: 'Asesoramiento experto',
    description: 'Más de 25 años asesorando a familias y empresas con trato personalizado.',
  },
  {
    icon: Clock,
    title: 'Gestión inmediata',
    description: 'Siniestros gestionados en tiempo récord con seguimiento en tiempo real.',
  },
  {
    icon: Trophy,
    title: 'Programa Soriano Club',
    description: 'Acumula puntos, desbloquea beneficios exclusivos y gana premios.',
  },
  {
    icon: Gift,
    title: 'Beneficios exclusivos',
    description: 'Descuentos, regalos y promociones solo para clientes Soriano.',
  },
]

const stats = [
  { value: 10000, suffix: '+', label: 'Clientes satisfechos' },
  { value: 25, suffix: ' años', label: 'De experiencia' },
  { value: 98, suffix: '%', label: 'Renovaciones' },
  { value: 24, suffix: 'h', label: 'Atención continua' },
]

const testimonials = [
  {
    id: '1',
    name: 'María García',
    role: 'Cliente desde 2018',
    content: 'Llevo 6 años con Soriano y la atención es impecable. Cuando tuve un siniestro con el coche, me lo gestionaron todo en menos de 48 horas. Totalmente recomendable.',
    rating: 5,
    insuranceType: 'Seguro Auto',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    role: 'Cliente desde 2020',
    content: 'El programa Soriano Club es genial. Ya he conseguido varios descuentos y regalos simplemente por ser cliente. Además, el trato siempre es muy cercano.',
    rating: 5,
    insuranceType: 'Seguro Hogar',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    role: 'Cliente desde 2015',
    content: 'Contraté el seguro de salud familiar y no puedo estar más contenta. El cuadro médico es muy amplio y las citas se gestionan súper rápido desde la app.',
    rating: 5,
    insuranceType: 'Seguro Salud',
  },
]

export default function LandingHome() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        title="Protegemos lo que\\nmás te importa"
        subtitle="Encuentra el seguro perfecto al mejor precio. Más de 25 años de experiencia asesorando a familias como la tuya."
        ctaPrimary={{ text: 'Calcular Precio Gratis', href: '/herramientas/calculadora-ahorro' }}
        ctaSecondary={{ text: 'Ver Ofertas', href: '/ofertas' }}
        badge="Hasta 25% de descuento"
      />

      {/* Trust Badges */}
      <TrustBadges variant="horizontal" />

      {/* Insurance Types */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-occident/10 text-occident text-sm font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Nuestros Seguros
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              Seguros a tu medida
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Descubre nuestras soluciones de protección diseñadas para cada necesidad
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceTypes.map((insurance, index) => (
              <motion.div
                key={insurance.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={insurance.href} className="block group">
                  <div className="card p-6 h-full hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${insurance.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <insurance.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {insurance.name}
                    </h3>

                    <p
                      className="text-sm mb-4"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {insurance.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-occident font-bold">{insurance.price}</span>
                      <span className="flex items-center text-sm font-medium text-occident opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver más
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsCounter stats={stats} title="Números que hablan por nosotros" />

      {/* Features */}
      <FeatureGrid
        title="¿Por qué Soriano Mediadores?"
        subtitle="Descubre las ventajas de confiar en nosotros para proteger lo que más importa"
        features={features}
        columns={3}
      />

      {/* Soriano Club Promo */}
      <section className="py-20 bg-gradient-to-br from-occident/5 via-transparent to-accent-purple/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-sm font-semibold mb-6">
                <Trophy className="w-4 h-4" />
                Programa de Fidelidad
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                Únete al <span className="gradient-text">Soriano Club</span>
              </h2>

              <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                Acumula puntos con cada acción, sube de nivel y desbloquea beneficios exclusivos.
                Desde descuentos hasta regalos especiales.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { level: 'BRONCE', benefit: '10% dto. en primera póliza', icon: '🥉' },
                  { level: 'PLATA', benefit: '5% dto. en renovaciones + 25€/referido', icon: '🥈' },
                  { level: 'ORO', benefit: '10% dto. + Línea 24/7 + 50€/referido', icon: '🥇' },
                  { level: 'PLATINO', benefit: '15% dto. + Gestor personal + 100€/referido', icon: '👑' },
                ].map((item) => (
                  <div key={item.level} className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {item.level}:
                      </span>{' '}
                      <span style={{ color: 'var(--color-text-secondary)' }}>{item.benefit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/club/beneficios" className="btn-primary">
                  Descubrir beneficios
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link href="/club/ruleta" className="btn-secondary">
                  <Gift className="mr-2 w-4 h-4" />
                  Probar la Ruleta
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-yellow-900" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                    Gana puntos por todo
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { action: 'Contratar nueva póliza', points: '+200 pts' },
                    { action: 'Renovar póliza', points: '+100 pts' },
                    { action: 'Pago puntual', points: '+50 pts' },
                    { action: 'Referir un amigo', points: '+150 pts' },
                    { action: 'Completar perfil', points: '+100 pts' },
                  ].map((item) => (
                    <div
                      key={item.action}
                      className="flex items-center justify-between py-3 border-b"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <span style={{ color: 'var(--color-text)' }}>{item.action}</span>
                      <span className="font-bold text-occident">{item.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 card p-4 shadow-premium-lg"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                    +500 pts bonus
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Primeros 100 clientes
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel
        testimonials={testimonials}
        title="Lo que dicen nuestros clientes"
        subtitle="Miles de familias ya confían en nosotros"
      />

      {/* CTA + Form */}
      <section className="py-20 bg-gradient-to-br from-apple-gray-900 to-apple-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                ¿Listo para ahorrar en tu seguro?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Déjanos tus datos y un asesor especializado te contactará para ofrecerte
                el mejor precio sin compromiso.
              </p>

              <div className="space-y-4">
                {[
                  'Comparamos entre +20 aseguradoras',
                  'Asesoramiento 100% personalizado',
                  'Sin permanencia ni letra pequeña',
                  'Gestión de siniestros incluida',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <LeadForm
              source="landing-home"
              title="Te llamamos gratis"
              subtitle="Sin compromiso ni obligación"
              buttonText="Solicitar llamada"
            />
          </div>
        </div>
      </section>
    </>
  )
}
