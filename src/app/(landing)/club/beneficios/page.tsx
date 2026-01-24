'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Trophy,
  Star,
  Gift,
  Percent,
  Phone,
  Clock,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Lock,
  Crown,
} from 'lucide-react'

const levels = [
  {
    name: 'BRONCE',
    emoji: '🥉',
    points: '0 - 999 pts',
    color: 'from-amber-600 to-amber-700',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600',
    benefits: [
      { icon: Percent, text: '10% descuento primera póliza nueva' },
      { icon: Phone, text: 'Soporte en horario laboral' },
      { icon: Gift, text: 'Acceso a promociones básicas' },
    ],
  },
  {
    name: 'PLATA',
    emoji: '🥈',
    points: '1.000 - 2.499 pts',
    color: 'from-gray-400 to-gray-500',
    borderColor: 'border-gray-400',
    bgColor: 'bg-gray-400/10',
    textColor: 'text-gray-500',
    benefits: [
      { icon: Percent, text: '5% descuento en renovaciones' },
      { icon: Clock, text: 'Atención preferente' },
      { icon: Users, text: '25€ por cada amigo referido' },
      { icon: Gift, text: 'Acceso a sorteos mensuales' },
    ],
  },
  {
    name: 'ORO',
    emoji: '🥇',
    points: '2.500 - 4.999 pts',
    color: 'from-yellow-400 to-yellow-500',
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-400/10',
    textColor: 'text-yellow-600',
    benefits: [
      { icon: Percent, text: '10% descuento en renovaciones' },
      { icon: Phone, text: 'Línea directa personal 24/7' },
      { icon: Users, text: '50€ por cada amigo referido' },
      { icon: Shield, text: 'Gestión express de siniestros' },
      { icon: Gift, text: 'Regalos exclusivos' },
    ],
  },
  {
    name: 'PLATINO',
    emoji: '👑',
    points: '5.000+ pts',
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-400/10',
    textColor: 'text-purple-600',
    benefits: [
      { icon: Percent, text: '15% descuento en TODO' },
      { icon: Crown, text: 'Gestor personal dedicado 24/7' },
      { icon: Users, text: '100€ por cada amigo referido' },
      { icon: Shield, text: 'Resolución prioritaria siniestros' },
      { icon: Gift, text: 'Acceso a productos VIP exclusivos' },
      { icon: Sparkles, text: 'Eventos y experiencias únicas' },
    ],
  },
]

const earnPoints = [
  { action: 'Contratar nueva póliza', points: '+200 pts', icon: Shield },
  { action: 'Renovar póliza existente', points: '+100 pts', icon: CheckCircle },
  { action: 'Pago puntual', points: '+50 pts', icon: Clock },
  { action: 'Referir a un amigo', points: '+150 pts', icon: Users },
  { action: 'Completar perfil 100%', points: '+100 pts', icon: Star },
  { action: 'Primera visita mensual', points: '+10 pts', icon: Gift },
]

const partners = [
  { name: 'Repsol', discount: '5% en gasolina', category: 'Combustible' },
  { name: 'Decathlon', discount: '10% en compras', category: 'Deportes' },
  { name: 'El Corte Inglés', discount: '5% en moda', category: 'Moda' },
  { name: 'Booking.com', discount: '10% en hoteles', category: 'Viajes' },
]

export default function BeneficiosPage() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold mb-6"
          >
            <Trophy className="w-4 h-4" />
            Programa de Fidelidad
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Beneficios <span className="gradient-text">Soriano Club</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Cuantos más puntos acumules, más beneficios exclusivos desbloqueas.
            Descubre todo lo que puedes conseguir siendo cliente Soriano.
          </motion.p>
        </div>

        {/* Levels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {levels.map((level, index) => (
            <motion.div
              key={level.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 border-2 ${level.borderColor}`}
            >
              {/* Level Header */}
              <div className={`rounded-xl p-4 mb-6 bg-gradient-to-br ${level.color} text-white text-center`}>
                <span className="text-4xl">{level.emoji}</span>
                <h3 className="text-xl font-bold mt-2">{level.name}</h3>
                <p className="text-sm opacity-80">{level.points}</p>
              </div>

              {/* Benefits */}
              <ul className="space-y-3">
                {level.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${level.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <benefit.icon className={`w-4 h-4 ${level.textColor}`} />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* How to earn points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Cómo ganar puntos
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Acumula puntos con cada acción y sube de nivel más rápido
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnPoints.map((item, index) => (
              <motion.div
                key={item.action}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-occident/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-occident" />
                  </div>
                  <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                    {item.action}
                  </span>
                </div>
                <span className="text-lg font-bold text-occident">{item.points}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Descuentos con partners
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Disfruta de descuentos exclusivos en marcas colaboradoras (nivel ORO o superior)
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center relative overflow-hidden"
              >
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-occident/10 to-occident/5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-occident">{partner.name.charAt(0)}</span>
                </div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  {partner.name}
                </h4>
                <p className="text-occident font-bold mb-1">{partner.discount}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {partner.category}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-8 sm:p-12 bg-gradient-to-br from-occident/10 via-transparent to-accent-purple/10 text-center"
        >
          <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-500" />

          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            ¿Aún no eres cliente?
          </h2>

          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Contrata tu primer seguro y comienza a acumular puntos desde el primer día.
            Te regalamos 200 puntos de bienvenida.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/herramientas/calculadora-ahorro" className="btn-primary text-lg px-8 py-4">
              Calcular mi precio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/club/ruleta" className="btn-secondary text-lg px-8 py-4">
              <Gift className="mr-2 w-5 h-5" />
              Probar la ruleta
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
