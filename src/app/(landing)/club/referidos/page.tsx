'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  Gift,
  Copy,
  Check,
  ArrowRight,
  Star,
  Trophy,
  Euro,
  Share2,
  Mail,
  MessageCircle,
} from 'lucide-react'

const levelRewards = [
  { level: 'BRONCE', emoji: '🥉', reward: '0€', status: 'locked' },
  { level: 'PLATA', emoji: '🥈', reward: '25€', status: 'current' },
  { level: 'ORO', emoji: '🥇', reward: '50€', status: 'locked' },
  { level: 'PLATINO', emoji: '👑', reward: '100€', status: 'locked' },
]

const steps = [
  {
    number: 1,
    title: 'Comparte tu código',
    description: 'Envía tu código único a amigos y familiares',
    icon: Share2,
  },
  {
    number: 2,
    title: 'Tu amigo contrata',
    description: 'Cuando contraten un seguro usando tu código',
    icon: Users,
  },
  {
    number: 3,
    title: 'Ambos ganáis',
    description: 'Tú ganas dinero y puntos, él un descuento',
    icon: Gift,
  },
]

const referrals = [
  { name: 'María G.', date: '15/11/2024', status: 'completed', reward: '25€' },
  { name: 'Carlos R.', date: '02/11/2024', status: 'completed', reward: '25€' },
  { name: 'Ana M.', date: '28/10/2024', status: 'pending', reward: 'Pendiente' },
]

export default function ReferidosPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'SORIANO2024'

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-occident/10 to-accent-purple/10 text-occident text-sm font-bold mb-6"
          >
            <Users className="w-4 h-4" />
            Programa de Referidos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Invita y <span className="gradient-text">Gana</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Recomienda Soriano a tus amigos y gana hasta 100€ por cada uno que contrate.
            Ellos también reciben un descuento especial.
          </motion.p>
        </div>

        {/* Referral Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto mb-16"
        >
          <div className="card p-8 text-center bg-gradient-to-br from-occident/5 to-accent-purple/5">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              Tu código de referido
            </h2>

            <div
              className="flex items-center justify-center gap-4 p-4 rounded-2xl mb-6"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              <span className="text-3xl font-mono font-bold text-occident">
                {referralCode}
              </span>
              <button
                onClick={copyCode}
                className={`p-3 rounded-xl transition-all ${
                  copied
                    ? 'bg-accent-green text-white'
                    : 'bg-occident/10 text-occident hover:bg-occident/20'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Comparte este código con tus amigos para que obtengan un descuento
            </p>

            <div className="flex justify-center gap-3">
              <button className="p-3 rounded-xl bg-[#25D366] text-white hover:opacity-90 transition-opacity">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl bg-[#0088CC] text-white hover:opacity-90 transition-opacity">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl bg-gray-600 text-white hover:opacity-90 transition-opacity">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--color-text)' }}>
            ¿Cómo funciona?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-occident/30 to-transparent" />
                )}

                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-occident/10 to-occident/5 flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-occident" />
                </div>

                <div className="w-8 h-8 mx-auto -mt-10 mb-4 rounded-full bg-occident text-white font-bold flex items-center justify-center text-sm">
                  {step.number}
                </div>

                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rewards by level */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-text)' }}>
            Gana más según tu nivel
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--color-text-secondary)' }}>
            Cuanto más alto tu nivel en Soriano Club, más ganas por cada referido
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {levelRewards.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`card p-6 text-center ${
                  level.status === 'current' ? 'ring-2 ring-occident' : ''
                }`}
              >
                <span className="text-4xl">{level.emoji}</span>
                <h4 className="font-bold mt-2" style={{ color: 'var(--color-text)' }}>
                  {level.level}
                </h4>
                <p className="text-2xl font-bold text-occident mt-2">{level.reward}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  por referido
                </p>
                {level.status === 'current' && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-occident/10 text-occident">
                    Tu nivel
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your referrals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                Tus referidos
              </h3>
              <span className="text-sm px-3 py-1 rounded-full bg-occident/10 text-occident font-medium">
                3 referidos
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {referrals.map((referral) => (
                <div
                  key={referral.name}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-occident/20 to-occident/10 flex items-center justify-center">
                      <span className="text-occident font-semibold">
                        {referral.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {referral.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {referral.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        referral.status === 'completed' ? 'text-accent-green' : 'text-yellow-500'
                      }`}
                    >
                      {referral.reward}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {referral.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-occident/10 to-accent-purple/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Total ganado
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    +450 puntos Soriano Club
                  </p>
                </div>
                <p className="text-3xl font-bold text-occident">50€</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            ¿Conoces a alguien que necesite un buen seguro?
          </p>

          <button
            onClick={copyCode}
            className="btn-primary text-lg px-8 py-4"
          >
            <Copy className="mr-2 w-5 h-5" />
            Copiar mi código
          </button>

          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Tus amigos recibirán un <strong>10% de descuento</strong> en su primera póliza
          </p>
        </motion.div>
      </div>
    </section>
  )
}
