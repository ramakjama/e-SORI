'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Gift,
  Sparkles,
  Star,
  Trophy,
  Calendar,
  CheckCircle,
  ArrowRight,
  Plane,
  PartyPopper,
} from 'lucide-react'
import { ParticleEffect } from '@/components/animations/ParticleEffect'
import { CountdownTimer } from '@/components/gamification/CountdownTimer'
import { LeadForm } from '@/components/forms/LeadForm'

const christmasEnd = new Date('2024-12-25T00:00:00')

const packs = [
  {
    name: 'Pack Familia',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Auto + Hogar + Vida',
    discount: '20%',
    originalPrice: '90€/mes',
    newPrice: '72€/mes',
    features: ['3 seguros combinados', 'Ahorro garantizado', 'Gestión unificada'],
  },
  {
    name: 'Pack Salud Total',
    emoji: '❤️',
    description: 'Salud familiar completo',
    discount: '15%',
    originalPrice: '120€/mes',
    newPrice: '102€/mes',
    features: ['Sin copagos', 'Dental incluido', 'Medicina preventiva'],
  },
  {
    name: 'Pack Protección',
    emoji: '🛡️',
    description: 'Vida + Decesos',
    discount: '25%',
    originalPrice: '30€/mes',
    newPrice: '22€/mes',
    features: ['Capital hasta 300.000€', 'Servicio completo', 'Beneficio fiscal'],
  },
]

const adventPrizes = [
  { day: 1, prize: '50 puntos', claimed: true },
  { day: 2, prize: '5% dto', claimed: true },
  { day: 3, prize: 'Badge', claimed: true },
  { day: 4, prize: '100 puntos', claimed: false },
  { day: 5, prize: 'Tirada ruleta', claimed: false },
  { day: 6, prize: '10% dto', claimed: false },
  { day: 7, prize: '150 puntos', claimed: false },
  { day: 8, prize: 'Regalo sorpresa', claimed: false },
]

export default function NavidadPage() {
  const [openedDoors, setOpenedDoors] = useState<number[]>([1, 2, 3])

  return (
    <>
      {/* Hero with snow */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900">
        <ParticleEffect type="snow" count={60} />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-green-500 text-white text-sm font-bold mb-8"
            >
              <PartyPopper className="w-5 h-5" />
              NAVIDAD 2024 - OFERTAS ESPECIALES
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl font-black text-white mb-6"
            >
              <span className="text-4xl">🎄</span> Regala
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
                Tranquilidad
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            >
              Esta Navidad, protege a los tuyos con hasta un{' '}
              <span className="text-yellow-300 font-bold">25% de descuento</span>.
              Además, participa en nuestro sorteo de un viaje familiar.
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <p className="text-blue-200 text-sm mb-4">Quedan para Navidad:</p>
              <CountdownTimer targetDate={christmasEnd} variant="large" />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="#ofertas"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-red-600 bg-white rounded-xl hover:bg-gray-100 transition-all shadow-lg"
              >
                <Gift className="mr-2 w-5 h-5" />
                Ver Ofertas
              </Link>
              <Link
                href="#sorteo"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
              >
                <Plane className="mr-2 w-5 h-5" />
                Participar en Sorteo
              </Link>
            </motion.div>

            {/* Main Prize */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              <div className="text-4xl">✈️</div>
              <div className="text-left">
                <p className="text-yellow-300 font-bold">GRAN SORTEO</p>
                <p className="text-white">
                  Viaje familiar valorado en <strong>2.000€</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advent Calendar */}
      <section id="calendario" className="py-20 bg-gradient-to-b from-indigo-900 to-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-400 text-sm font-bold mb-4"
            >
              <Calendar className="w-4 h-4" />
              Calendario de Adviento Digital
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              24 Días de <span className="text-yellow-400">Premios</span>
            </h2>
            <p className="text-blue-200">
              Abre una puerta cada día y descubre tu premio
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 max-w-4xl mx-auto">
            {adventPrizes.map((item) => (
              <motion.button
                key={item.day}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: item.day * 0.02 }}
                whileHover={{ scale: item.claimed ? 1 : 1.1 }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  item.claimed
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : 'bg-white/10 border-2 border-white/20 hover:border-yellow-400'
                }`}
              >
                <span className="text-2xl font-bold text-white">{item.day}</span>
                {item.claimed && (
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                )}
              </motion.button>
            ))}
            {/* Remaining days */}
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square rounded-xl bg-white/5 border-2 border-white/10 flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-white/30">{9 + i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packs */}
      <section id="ofertas" className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Packs <span className="text-red-500">Navideños</span>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Combina seguros y ahorra aún más
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packs.map((pack, index) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 relative overflow-hidden"
              >
                {/* Discount badge */}
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-red-500 to-green-500 rounded-full flex items-center justify-center transform rotate-12">
                  <span className="text-white font-black text-lg -rotate-12">
                    -{pack.discount}
                  </span>
                </div>

                <div className="text-4xl mb-4">{pack.emoji}</div>

                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                  {pack.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {pack.description}
                </p>

                <div className="mb-6">
                  <span className="text-gray-400 line-through text-sm">{pack.originalPrice}</span>
                  <div className="text-3xl font-bold text-red-500">{pack.newPrice}</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pack.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="#formulario" className="btn-primary w-full">
                  Lo quiero
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sorteo */}
      <section id="sorteo" className="py-20 bg-gradient-to-r from-red-500/10 via-transparent to-green-500/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center"
          >
            <Plane className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Sorteo de <span className="text-yellow-500">Viaje Familiar</span>
          </h2>

          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Contrata cualquier seguro antes del 24 de diciembre y entra automáticamente
            en el sorteo de un viaje familiar valorado en 2.000€
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { icon: '🏆', title: '1er Premio', value: 'Viaje 2.000€' },
              { icon: '🥈', title: '2do Premio', value: 'Cheque 500€' },
              { icon: '🥉', title: '3er Premio', value: 'Cheque 200€' },
            ].map((premio) => (
              <div key={premio.title} className="card p-6">
                <span className="text-4xl">{premio.icon}</span>
                <p className="font-semibold mt-2" style={{ color: 'var(--color-text)' }}>
                  {premio.title}
                </p>
                <p className="text-occident font-bold">{premio.value}</p>
              </div>
            ))}
          </div>

          <Link href="#formulario" className="btn-primary text-lg px-8 py-4">
            Participar ahora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Form */}
      <section id="formulario" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Regala protección esta Navidad
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Déjanos tus datos y un asesor te contactará con las mejores ofertas navideñas.
                Además, entrarás automáticamente en el sorteo.
              </p>

              <div className="space-y-4">
                {[
                  'Hasta 25% de descuento',
                  'Participación automática en sorteo',
                  'x2 puntos Soriano Club',
                  'Regalos navideños exclusivos',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <LeadForm
              source="landing-navidad-2024"
              campaign="navidad-2024"
              title="Quiero participar"
              buttonText="Reservar mi oferta"
            />
          </div>
        </div>
      </section>
    </>
  )
}
