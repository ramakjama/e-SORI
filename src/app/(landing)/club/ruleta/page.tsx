'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Gift, Star, Trophy, Clock, Sparkles, ArrowRight, Info } from 'lucide-react'
import { SpinWheel } from '@/components/gamification/SpinWheel'

const rules = [
  'Tienes 1 tirada gratuita al día',
  'Los puntos se añaden automáticamente a tu cuenta',
  'Los descuentos son válidos durante 30 días',
  'Puedes ganar tiradas extra completando acciones',
]

const extraSpins = [
  { action: 'Referir un amigo', spins: '+1 tirada' },
  { action: 'Compartir en redes', spins: '+1 tirada' },
  { action: 'Contratar nueva póliza', spins: '+3 tiradas' },
]

export default function RuletaPage() {
  const [spinsRemaining, setSpinsRemaining] = useState(1)

  const handleSpinEnd = (prize: any) => {
    setSpinsRemaining((prev) => Math.max(0, prev - 1))

    // In production, this would update the store/backend
    console.log('Prize won:', prize)
  }

  return (
    <section className="py-20 min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold mb-6"
          >
            <Gift className="w-4 h-4" />
            Soriano Club
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Ruleta de <span className="gradient-text">Premios</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Gira la ruleta y gana puntos, descuentos, badges exclusivos y mucho más.
            ¡Tienes una tirada gratuita cada día!
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left column - Rules */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Rules Card */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-occident/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-occident" />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  Cómo funciona
                </h3>
              </div>

              <ul className="space-y-3">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-occident/10 text-occident text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extra Spins */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  Consigue más tiradas
                </h3>
              </div>

              <ul className="space-y-3">
                {extraSpins.map((item) => (
                  <li
                    key={item.action}
                    className="flex items-center justify-between py-2 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      {item.action}
                    </span>
                    <span className="text-sm font-bold text-accent-purple">{item.spins}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Center - Wheel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <SpinWheel onSpinEnd={handleSpinEnd} spinsRemaining={spinsRemaining} />
          </motion.div>

          {/* Right column - Prizes & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Available Prizes */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  Premios disponibles
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  { prize: '50-200 Puntos', probability: 'Alta', color: 'text-accent-green' },
                  { prize: '5-10% Descuento', probability: 'Media', color: 'text-accent-blue' },
                  { prize: 'Badge Afortunado', probability: 'Baja', color: 'text-accent-purple' },
                  { prize: 'Regalo Sorpresa', probability: 'Muy baja', color: 'text-yellow-500' },
                ].map((item) => (
                  <div
                    key={item.prize}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {item.prize}
                    </span>
                    <span className={`text-xs ${item.color}`}>{item.probability}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <div className="card p-6 bg-gradient-to-br from-occident/10 to-accent-purple/10">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                Tus estadísticas
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <div className="text-2xl font-bold text-occident">12</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Tiradas totales
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <div className="text-2xl font-bold text-accent-green">450</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Puntos ganados
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <div className="text-2xl font-bold text-accent-purple">2</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Badges ganados
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <div className="text-2xl font-bold text-yellow-500">15%</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Mejor descuento
                  </div>
                </div>
              </div>
            </div>

            {/* Next spin */}
            {spinsRemaining === 0 && (
              <div className="card p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-3 text-occident" />
                <p className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  Próxima tirada disponible en:
                </p>
                <p className="text-2xl font-bold text-occident">23:45:30</p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                  o consigue tiradas extra con acciones
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* CTA to more club features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            ¿Quieres ganar más puntos? Explora todas las formas de acumular
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/club/beneficios" className="btn-primary">
              Ver beneficios
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/club/retos" className="btn-secondary">
              <Trophy className="mr-2 w-4 h-4" />
              Retos mensuales
            </Link>
            <Link href="/club/referidos" className="btn-secondary">
              <Star className="mr-2 w-4 h-4" />
              Programa referidos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
