'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Car,
  Home,
  Heart,
  HeartPulse,
  Gift,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Trophy,
  Clock,
} from 'lucide-react'
import { CountdownTimer } from '@/components/gamification/CountdownTimer'
import { ParticleEffect } from '@/components/animations/ParticleEffect'
import { LeadForm } from '@/components/forms/LeadForm'
import { StatsCounter } from '@/components/marketing/StatsCounter'

// Black Friday ends December 1st
const blackFridayEnd = new Date('2025-12-01T00:00:00')

const offers = [
  {
    icon: Car,
    name: 'Seguro Auto',
    discount: '25%',
    originalPrice: '40€/mes',
    newPrice: '30€/mes',
    gift: 'Dashcam GRATIS',
    gradient: 'from-blue-500 to-blue-600',
    features: ['Todo riesgo sin franquicia', 'Vehículo sustitución 30 días', 'Asistencia Europa'],
  },
  {
    icon: Home,
    name: 'Seguro Hogar',
    discount: '20%',
    originalPrice: '25€/mes',
    newPrice: '20€/mes',
    gift: 'Alarma smart GRATIS',
    gradient: 'from-emerald-500 to-emerald-600',
    features: ['Continente + Contenido', 'Asistencia hogar 24h', 'Responsabilidad civil'],
  },
  {
    icon: HeartPulse,
    name: 'Seguro Salud',
    discount: '15%',
    originalPrice: '50€/mes',
    newPrice: '42€/mes',
    gift: '3 meses GRATIS',
    gradient: 'from-violet-500 to-violet-600',
    features: ['Sin copagos', '+40.000 especialistas', 'Hospitalización privada'],
  },
  {
    icon: Heart,
    name: 'Seguro Vida',
    discount: '20%',
    originalPrice: '15€/mes',
    newPrice: '12€/mes',
    gift: 'Capital +20%',
    gradient: 'from-rose-500 to-rose-600',
    features: ['Capital hasta 300.000€', 'Invalidez incluida', 'Beneficio fiscal'],
  },
]

const stats = [
  { value: 847, label: 'Pólizas vendidas hoy' },
  { value: 25, suffix: '%', label: 'Descuento máximo' },
  { value: 3, suffix: 'x', label: 'Puntos Soriano Club' },
  { value: 100, label: 'Primeros con +500 pts' },
]

export default function BlackFridayPage() {
  return (
    <>
      {/* Hero with particles */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <ParticleEffect type="confetti" count={50} />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-occident/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold mb-8"
            >
              <Zap className="w-5 h-5" />
              OFERTA LIMITADA - SOLO HASTA EL 30 DE NOVIEMBRE
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-4"
            >
              BLACK
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500">
                FRIDAY
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl text-gray-300 mb-8"
            >
              Hasta <span className="text-yellow-400 font-bold">25% de descuento</span> + regalos exclusivos
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <p className="text-gray-400 text-sm mb-4">La oferta termina en:</p>
              <CountdownTimer targetDate={blackFridayEnd} variant="large" />
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="#ofertas"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-500/30"
              >
                Ver Ofertas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#formulario"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
              >
                Te llamamos
              </Link>
            </motion.div>

            {/* Gamification banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-occident/20 to-purple-500/20 border border-white/10"
            >
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-white">
                <strong className="text-yellow-400">x3 PUNTOS</strong> en todas las contrataciones
              </span>
              <Star className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Live stats */}
      <section className="py-8 bg-black border-y border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section id="ofertas" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Ofertas <span className="text-yellow-400">Exclusivas</span>
            </motion.h2>
            <p className="text-gray-400 text-lg">
              Solo durante el Black Friday. No te las pierdas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.name}
                initial={{ opacity: 0, y: 30, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="card bg-gray-800 border-gray-700 p-6 h-full">
                  {/* Discount badge */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                    <span className="text-black font-black text-lg -rotate-12">
                      -{offer.discount}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${offer.gradient} flex items-center justify-center mb-6`}>
                    <offer.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-white mb-4">
                    {offer.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-gray-500 line-through text-sm">{offer.originalPrice}</span>
                    <div className="text-3xl font-bold text-yellow-400">{offer.newPrice}</div>
                  </div>

                  {/* Gift */}
                  <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-semibold">{offer.gift}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {offer.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="#formulario"
                    className="w-full flex items-center justify-center py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 transition-all"
                  >
                    Lo quiero
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-20 bg-gradient-to-r from-occident/20 via-purple-500/20 to-occident/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center"
            >
              <Trophy className="w-12 h-12 text-black" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <span className="text-yellow-400">x3 PUNTOS</span> Soriano Club
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Durante el Black Friday, todas las contrataciones acumulan el triple de puntos.
              ¡Sube de nivel más rápido!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { points: '+600', action: 'Contratar póliza', normal: '200 pts' },
              { points: '+300', action: 'Renovar póliza', normal: '100 pts' },
              { points: '+450', action: 'Referir amigo', normal: '150 pts' },
            ].map((item, index) => (
              <motion.div
                key={item.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card bg-white/10 border-white/20 p-6 text-center backdrop-blur-sm"
              >
                <div className="text-4xl font-black text-yellow-400 mb-2">{item.points}</div>
                <div className="text-white font-semibold mb-1">{item.action}</div>
                <div className="text-gray-400 text-sm">Normalmente {item.normal}</div>
              </motion.div>
            ))}
          </div>

          {/* Early bird bonus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="card bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-black" />
                <span className="text-black font-bold text-lg">BONUS MADRUGADOR</span>
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <p className="text-black/80">
                Los <strong>primeros 100 clientes</strong> reciben <strong>+500 puntos extra</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Oferta limitada</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                No dejes escapar esta oportunidad
              </h2>

              <p className="text-lg text-gray-300 mb-8">
                Déjanos tus datos y un asesor te contactará con el mejor precio del año.
                Sin compromiso y sin llamadas comerciales molestas.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Hasta 25% de descuento garantizado',
                  'Regalos exclusivos Black Friday',
                  'Triple de puntos Soriano Club',
                  'Sin permanencia ni letra pequeña',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <CountdownTimer targetDate={blackFridayEnd} variant="compact" />
                <p className="text-gray-400 text-sm mt-2">para que termine la oferta</p>
              </div>
            </div>

            <LeadForm
              source="landing-black-friday"
              campaign="black-friday-2024"
              title="Quiero mi descuento"
              subtitle="Te contactamos hoy mismo"
              buttonText="Reservar mi oferta"
            />
          </div>
        </div>
      </section>
    </>
  )
}
