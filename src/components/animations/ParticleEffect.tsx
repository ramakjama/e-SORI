'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ParticleEffectProps {
  type: 'confetti' | 'snow' | 'hearts' | 'stars'
  count?: number
}

interface Particle {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  color?: string
}

const colors = {
  confetti: ['#E30613', '#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF2D55'],
  snow: ['#FFFFFF', '#E5E5EA', '#F5F5F7'],
  hearts: ['#FF2D55', '#E30613', '#FF6B8A'],
  stars: ['#FFD700', '#FFA500', '#FF6B8A', '#87CEEB', '#E5E5EA'],
}

const emojis = {
  confetti: ['🎉', '🎊', '✨', '🌟', '⭐'],
  snow: ['❄️', '❅', '❆', '✻'],
  hearts: ['❤️', '💖', '💕', '💗'],
  stars: ['⭐', '🌟', '✨', '💫', '✦'],
}

export function ParticleEffect({ type, count = 30 }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 10 + Math.random() * 20,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
      })
    }
    setParticles(newParticles)
  }, [type, count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: -50,
            rotate: 0,
            opacity: 0.8,
          }}
          animate={{
            y: '110vh',
            rotate: type === 'confetti' ? 360 : 0,
            opacity: [0.8, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: type === 'snow' ? 'linear' : 'easeOut',
          }}
          style={{
            position: 'absolute',
            fontSize: particle.size,
            left: 0,
            top: 0,
          }}
        >
          {type === 'confetti' ? (
            Math.random() > 0.5 ? (
              <span>{emojis.confetti[Math.floor(Math.random() * emojis.confetti.length)]}</span>
            ) : (
              <div
                style={{
                  width: particle.size * 0.5,
                  height: particle.size * 0.5,
                  backgroundColor: particle.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            )
          ) : type === 'snow' ? (
            <span style={{ color: particle.color, opacity: 0.8 }}>
              {emojis.snow[Math.floor(Math.random() * emojis.snow.length)]}
            </span>
          ) : (
            <span>{emojis.hearts[Math.floor(Math.random() * emojis.hearts.length)]}</span>
          )}
        </motion.div>
      ))}
    </div>
  )
}
