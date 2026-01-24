'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Trophy,
  Star,
  Target,
  Clock,
  CheckCircle,
  Lock,
  Gift,
  Flame,
  Medal,
  Crown,
  ArrowRight,
} from 'lucide-react'

const activeChallenges = [
  {
    id: '1',
    name: 'Madrugador del Mes',
    description: 'Renueva tu póliza antes del día 15',
    points: 200,
    progress: 1,
    target: 1,
    deadline: '15 días',
    status: 'completed',
    badge: '🌅',
  },
  {
    id: '2',
    name: 'Embajador Activo',
    description: 'Refiere a 2 amigos este mes',
    points: 500,
    progress: 1,
    target: 2,
    deadline: '20 días',
    status: 'in_progress',
    badge: '🤝',
  },
  {
    id: '3',
    name: 'Digital Master',
    description: 'Visita el portal 10 veces este mes',
    points: 100,
    progress: 6,
    target: 10,
    deadline: '20 días',
    status: 'in_progress',
    badge: '💻',
  },
  {
    id: '4',
    name: 'Protector Familiar',
    description: 'Añade un nuevo asegurado a tu póliza',
    points: 300,
    progress: 0,
    target: 1,
    deadline: '20 días',
    status: 'not_started',
    badge: '👨‍👩‍👧',
  },
]

const leaderboard = [
  { rank: 1, name: 'Carlos M.', points: 2450, level: 'ORO', avatar: 'C' },
  { rank: 2, name: 'María L.', points: 2200, level: 'ORO', avatar: 'M' },
  { rank: 3, name: 'Pedro S.', points: 1980, level: 'PLATA', avatar: 'P' },
  { rank: 4, name: 'Ana R.', points: 1750, level: 'PLATA', avatar: 'A' },
  { rank: 5, name: 'Tú', points: 1520, level: 'PLATA', avatar: '😊', isUser: true },
]

const monthlyPrizes = [
  { position: '1º', prize: '500 puntos + Regalo', icon: Crown },
  { position: '2º', prize: '300 puntos', icon: Medal },
  { position: '3º', prize: '200 puntos', icon: Trophy },
  { position: 'Top 10', prize: '100 puntos', icon: Star },
]

export default function RetosPage() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400/10 to-red-500/10 text-orange-500 text-sm font-bold mb-6"
          >
            <Flame className="w-4 h-4" />
            Retos Mensuales
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Completa <span className="gradient-text">Retos</span>, Gana Premios
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Cada mes nuevos retos para ganar puntos extra y competir por los premios del ranking.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Challenges */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Retos Activos
              </h2>
              <span className="text-sm px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 font-medium">
                Noviembre 2024
              </span>
            </div>

            {activeChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`card p-6 ${
                  challenge.status === 'completed'
                    ? 'bg-gradient-to-r from-accent-green/5 to-transparent border-accent-green/30'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      challenge.status === 'completed'
                        ? 'bg-accent-green/10'
                        : 'bg-orange-500/10'
                    }`}
                  >
                    {challenge.badge}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                          {challenge.name}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {challenge.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-occident">
                          +{challenge.points}
                        </span>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          puntos
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          Progreso: {challenge.progress}/{challenge.target}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <Clock className="w-3 h-3" />
                          {challenge.deadline}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full rounded-full ${
                            challenge.status === 'completed'
                              ? 'bg-accent-green'
                              : 'bg-gradient-to-r from-orange-400 to-red-500'
                          }`}
                        />
                      </div>
                    </div>

                    {challenge.status === 'completed' && (
                      <div className="mt-4 flex items-center gap-2 text-accent-green">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">¡Reto completado!</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Monthly Prizes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  Premios del Mes
                </h3>
              </div>

              <div className="space-y-3">
                {monthlyPrizes.map((prize, index) => (
                  <div
                    key={prize.position}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <prize.icon
                        className={`w-5 h-5 ${
                          index === 0
                            ? 'text-yellow-500'
                            : index === 1
                            ? 'text-gray-400'
                            : index === 2
                            ? 'text-amber-600'
                            : 'text-occident'
                        }`}
                      />
                      <span style={{ color: 'var(--color-text)' }}>{prize.position}</span>
                    </div>
                    <span className="text-sm font-medium text-occident">{prize.prize}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  Ranking
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-occident/10 text-occident">
                  Noviembre
                </span>
              </div>

              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      user.isUser
                        ? 'bg-occident/10 ring-1 ring-occident'
                        : ''
                    }`}
                    style={{
                      backgroundColor: user.isUser ? undefined : 'var(--color-bg)',
                    }}
                  >
                    <span
                      className={`w-6 text-center font-bold ${
                        user.rank === 1
                          ? 'text-yellow-500'
                          : user.rank === 2
                          ? 'text-gray-400'
                          : user.rank === 3
                          ? 'text-amber-600'
                          : ''
                      }`}
                      style={{ color: user.rank > 3 ? 'var(--color-text-secondary)' : undefined }}
                    >
                      {user.rank}
                    </span>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        user.isUser
                          ? 'bg-occident text-white'
                          : 'bg-gradient-to-br from-occident/20 to-occident/10 text-occident'
                      }`}
                    >
                      {user.avatar}
                    </div>

                    <div className="flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {user.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {user.level}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-occident">
                      {user.points}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card p-6 bg-gradient-to-br from-occident/10 to-accent-purple/10"
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                Tu progreso este mes
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <div className="text-2xl font-bold text-occident">3</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Retos completados
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <div className="text-2xl font-bold text-accent-green">800</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Puntos ganados
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            ¿Quieres ganar más puntos rápidamente?
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/club/ruleta" className="btn-primary">
              <Gift className="mr-2 w-4 h-4" />
              Girar la Ruleta
            </Link>
            <Link href="/club/referidos" className="btn-secondary">
              <Star className="mr-2 w-4 h-4" />
              Programa Referidos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
