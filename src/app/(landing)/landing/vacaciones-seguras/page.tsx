'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plane,
  Car,
  MapPin,
  Phone,
  Shield,
  CheckCircle,
  Sun,
  Umbrella,
  Wrench,
  AlertTriangle,
  Star,
} from 'lucide-react'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { LeadForm } from '@/components/forms/LeadForm'

const checklist = [
  { item: 'Revisar niveles del coche', checked: true },
  { item: 'Comprobar presión neumáticos', checked: true },
  { item: 'Verificar luces y frenos', checked: false },
  { item: 'Llevar documentación en regla', checked: false },
  { item: 'Tener asistencia en carretera', checked: false },
  { item: 'Seguro con cobertura viaje', checked: false },
]

const coverages = [
  {
    icon: Car,
    title: 'Asistencia en carretera',
    description: 'Grúa ilimitada en toda Europa. Reparación in situ cuando sea posible.',
  },
  {
    icon: Plane,
    title: 'Cobertura de viaje',
    description: 'Gastos médicos, repatriación y pérdida de equipaje incluidos.',
  },
  {
    icon: MapPin,
    title: 'Europa cubierta',
    description: 'Las mismas coberturas que en España en todo el territorio europeo.',
  },
  {
    icon: Phone,
    title: 'Teléfono 24h',
    description: 'Asistencia telefónica en español disponible las 24 horas.',
  },
]

const destinations = [
  { name: 'Francia', flag: '🇫🇷', popular: true },
  { name: 'Portugal', flag: '🇵🇹', popular: true },
  { name: 'Italia', flag: '🇮🇹', popular: true },
  { name: 'Alemania', flag: '🇩🇪', popular: false },
  { name: 'Países Bajos', flag: '🇳🇱', popular: false },
  { name: 'Reino Unido', flag: '🇬🇧', popular: false },
]

export default function VacacionesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 text-8xl opacity-20">☀️</div>
          <div className="absolute bottom-40 left-20 text-6xl opacity-20">🌴</div>
          <div className="absolute top-1/2 right-1/4 text-7xl opacity-20">🚗</div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm">
                <Sun className="w-4 h-4" />
                Verano 2025
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Vacaciones
                <span className="block">100% seguras</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8">
                Viaja tranquilo con la mejor asistencia en carretera y cobertura
                en toda Europa. Asistencia de viaje GRATIS con tu seguro de auto.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#ofertas"
                  className="btn-primary bg-white text-blue-600 hover:bg-blue-50"
                >
                  Ver coberturas
                </Link>
                <Link
                  href="#formulario"
                  className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all"
                >
                  Ampliar mi seguro
                </Link>
              </div>
            </motion.div>

            {/* Checklist Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-text)' }}>
                Checklist pre-viaje
              </h3>

              <div className="space-y-3 mb-6">
                {checklist.map((item, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-blue-500/5"
                    style={{ backgroundColor: item.checked ? 'rgb(34 197 94 / 0.05)' : undefined }}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      item.checked ? 'bg-accent-green border-accent-green' : 'border-gray-300'
                    }`}>
                      {item.checked && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={item.checked ? 'line-through opacity-60' : ''}
                      style={{ color: 'var(--color-text)' }}
                    >
                      {item.item}
                    </span>
                  </label>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-700 dark:text-yellow-400 text-sm">
                      ¿Tienes asistencia en Europa?
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500">
                      Revisa tu póliza antes de viajar
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)' }}>
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-medium mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Cobertura completa en destinos populares
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: 'var(--color-bg)' }}
              >
                <span className="text-xl">{dest.flag}</span>
                <span style={{ color: 'var(--color-text)' }}>{dest.name}</span>
                {dest.popular && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                    Popular
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverages */}
      <section id="ofertas" className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Viaja protegido
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Todo lo que necesitas para unas vacaciones sin preocupaciones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverages.map((coverage, index) => (
              <motion.div
                key={coverage.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 flex items-center justify-center mb-4">
                  <coverage.icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  {coverage.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {coverage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-20 bg-gradient-to-r from-sky-500/10 via-transparent to-blue-500/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
          >
            <span className="text-4xl">🎁</span>
          </motion.div>

          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Asistencia de viaje <span className="text-blue-500">GRATIS</span>
          </h2>

          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Contrata o renueva tu seguro de auto antes del verano y te regalamos
            la ampliación de cobertura de viaje para toda la familia.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              'Gastos médicos hasta 30.000€',
              'Repatriación incluida',
              'Pérdida de equipaje',
              'Cancelación de viaje',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <Link href="#formulario" className="btn-primary text-lg px-8 py-4">
            Quiero mi regalo
          </Link>
        </div>
      </section>

      {/* Form */}
      <section id="formulario" className="py-20 bg-gradient-to-br from-sky-900 to-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-6">
                <Plane className="w-4 h-4" />
                Vacaciones Seguras
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Prepara tu viaje con tranquilidad
              </h2>

              <p className="text-lg text-sky-100 mb-8">
                Revisa tu cobertura actual o amplíala para viajar con total seguridad.
                Te asesoramos sobre lo que necesitas.
              </p>

              <div className="space-y-4">
                {[
                  'Revisión gratuita de tu póliza',
                  'Ampliación Europa sin coste',
                  'Asistencia 24h en español',
                  '+200 puntos Soriano Club',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-300" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <LeadForm
              source="landing-vacaciones-seguras"
              campaign="verano-2025"
              title="Revisar mi cobertura"
              buttonText="Solicitar revisión gratis"
            />
          </div>
        </div>
      </section>
    </>
  )
}
