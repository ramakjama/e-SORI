'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { Gift, Star, Percent, Award, X } from 'lucide-react'

interface WheelSegment {
  id: string
  label: string
  shortLabel: string
  color: string
  textColor: string
  prize: {
    type: 'points' | 'discount' | 'badge' | 'gift' | 'nothing'
    value: number | string
    description: string
  }
  probability: number
}

interface SpinWheelProps {
  segments?: WheelSegment[]
  onSpinEnd?: (prize: WheelSegment['prize']) => void
  disabled?: boolean
  spinsRemaining?: number
}

const defaultSegments: WheelSegment[] = [
  {
    id: '1',
    label: '50 Puntos',
    shortLabel: '50 pts',
    color: '#E30613',
    textColor: '#FFFFFF',
    prize: { type: 'points', value: 50, description: '¡+50 puntos para tu cuenta!' },
    probability: 0.25,
  },
  {
    id: '2',
    label: '5% Descuento',
    shortLabel: '5%',
    color: '#007AFF',
    textColor: '#FFFFFF',
    prize: { type: 'discount', value: 5, description: '5% de descuento en tu próxima póliza' },
    probability: 0.15,
  },
  {
    id: '3',
    label: '100 Puntos',
    shortLabel: '100 pts',
    color: '#34C759',
    textColor: '#FFFFFF',
    prize: { type: 'points', value: 100, description: '¡+100 puntos para tu cuenta!' },
    probability: 0.10,
  },
  {
    id: '4',
    label: 'Badge Especial',
    shortLabel: 'Badge',
    color: '#AF52DE',
    textColor: '#FFFFFF',
    prize: { type: 'badge', value: 'spinner', description: '¡Has desbloqueado el badge Afortunado!' },
    probability: 0.05,
  },
  {
    id: '5',
    label: '10% Descuento',
    shortLabel: '10%',
    color: '#FF9500',
    textColor: '#FFFFFF',
    prize: { type: 'discount', value: 10, description: '10% de descuento en tu próxima póliza' },
    probability: 0.05,
  },
  {
    id: '6',
    label: '¡Sigue intentando!',
    shortLabel: 'Suerte',
    color: '#86868B',
    textColor: '#FFFFFF',
    prize: { type: 'nothing', value: 0, description: '¡No te rindas! Vuelve mañana.' },
    probability: 0.30,
  },
  {
    id: '7',
    label: '200 Puntos',
    shortLabel: '200 pts',
    color: '#FF2D55',
    textColor: '#FFFFFF',
    prize: { type: 'points', value: 200, description: '¡Increíble! +200 puntos' },
    probability: 0.05,
  },
  {
    id: '8',
    label: 'Regalo Sorpresa',
    shortLabel: 'Regalo',
    color: '#5856D6',
    textColor: '#FFFFFF',
    prize: { type: 'gift', value: 'mystery', description: '¡Un regalo sorpresa te espera!' },
    probability: 0.05,
  },
]

/**
 * SEGURIDAD: Normaliza probabilidades para asegurar que sumen exactamente 1.0
 * Esto previene manipulación de probabilidades y garantiza distribución justa
 */
function normalizeProbabilities(segments: WheelSegment[]): WheelSegment[] {
  // Validar que existan segmentos
  if (!segments || segments.length === 0) {
    console.error('⚠️ SpinWheel: No hay segmentos definidos')
    return []
  }

  // Validar que todas las probabilidades sean números válidos y no negativos
  const invalidSegments = segments.filter(
    seg => typeof seg.probability !== 'number' ||
           seg.probability < 0 ||
           isNaN(seg.probability) ||
           !isFinite(seg.probability)
  )

  if (invalidSegments.length > 0) {
    console.error('⚠️ SpinWheel: Probabilidades inválidas detectadas:', invalidSegments)
    // Asignar probabilidades iguales si hay valores inválidos
    const equalProbability = 1.0 / segments.length
    return segments.map(seg => ({
      ...seg,
      probability: equalProbability
    }))
  }

  // Calcular suma total de probabilidades
  const total = segments.reduce((sum, seg) => sum + seg.probability, 0)

  // Validar que la suma no sea cero
  if (total === 0) {
    console.error('⚠️ SpinWheel: La suma de probabilidades es 0. Asignando probabilidades iguales.')
    const equalProbability = 1.0 / segments.length
    return segments.map(seg => ({
      ...seg,
      probability: equalProbability
    }))
  }

  // Normalizar SIEMPRE para garantizar que sumen exactamente 1.0
  // Umbral de tolerancia muy pequeño (0.0001)
  const needsNormalization = Math.abs(total - 1.0) > 0.0001

  if (needsNormalization) {
    // Advertir en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️ SpinWheel: Probabilidades suman ${total.toFixed(6)}, normalizando a 1.0...`,
        '\nSegmentos:', segments.map(s => ({ label: s.label, probability: s.probability }))
      )
    }

    // Normalizar dividiendo cada probabilidad por el total
    const normalized = segments.map(seg => ({
      ...seg,
      probability: seg.probability / total
    }))

    // Verificar que la normalización fue exitosa
    const normalizedTotal = normalized.reduce((sum, seg) => sum + seg.probability, 0)

    if (process.env.NODE_ENV === 'development') {
      console.info(
        `✅ SpinWheel: Probabilidades normalizadas. Nueva suma: ${normalizedTotal.toFixed(6)}`
      )
    }

    return normalized
  }

  // Las probabilidades ya suman 1.0, retornar sin cambios
  return segments
}

function getWeightedRandomIndex(segments: WheelSegment[]): number {
  // Ensure probabilities are normalized
  const normalizedSegments = normalizeProbabilities(segments)
  
  const random = Math.random()
  let cumulative = 0

  for (let i = 0; i < normalizedSegments.length; i++) {
    cumulative += normalizedSegments[i].probability
    if (random <= cumulative) {
      return i
    }
  }

  // Fallback to last segment (should never happen with normalized probabilities)
  return normalizedSegments.length - 1
}

export function SpinWheel({
  segments = defaultSegments,
  onSpinEnd,
  disabled = false,
  spinsRemaining = 1,
}: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<WheelSegment | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const segmentAngle = 360 / segments.length

  const spin = () => {
    if (isSpinning || disabled || spinsRemaining <= 0) return

    setIsSpinning(true)
    setResult(null)
    setShowResult(false)

    // Get weighted random winner
    const winnerIndex = getWeightedRandomIndex(segments)
    const winner = segments[winnerIndex]

    // Calculate rotation (multiple full spins + landing on winner)
    const fullSpins = 5 + Math.floor(Math.random() * 3)
    const segmentOffset = winnerIndex * segmentAngle
    const randomOffset = Math.random() * (segmentAngle * 0.6) + segmentAngle * 0.2
    const finalRotation = rotation + fullSpins * 360 + (360 - segmentOffset) - randomOffset

    setRotation(finalRotation)

    // Show result after spin
    setTimeout(() => {
      setIsSpinning(false)
      setResult(winner)
      setShowResult(true)

      if (winner.prize.type !== 'nothing') {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }

      onSpinEnd?.(winner.prize)
    }, 5000)
  }

  const getPrizeIcon = (type: string) => {
    switch (type) {
      case 'points':
        return <Star className="w-8 h-8" />
      case 'discount':
        return <Percent className="w-8 h-8" />
      case 'badge':
        return <Award className="w-8 h-8" />
      case 'gift':
        return <Gift className="w-8 h-8" />
      default:
        return <X className="w-8 h-8" />
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      {showConfetti && (
        <Confetti
          width={600}
          height={600}
          recycle={false}
          numberOfPieces={200}
          style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)' }}
        />
      )}

      {/* Wheel Container */}
      <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-occident drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <motion.div
          className="w-full h-full rounded-full shadow-premium-lg relative overflow-hidden"
          style={{
            background: 'conic-gradient(from 0deg, ' +
              segments.map((s, i) => `${s.color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ') +
              ')',
          }}
          animate={{ rotate: rotation }}
          transition={{
            duration: 5,
            ease: [0.2, 0.8, 0.2, 1],
          }}
        >
          {/* Segment Labels */}
          {segments.map((segment, index) => {
            const angle = index * segmentAngle + segmentAngle / 2
            const radian = (angle * Math.PI) / 180

            return (
              <div
                key={segment.id}
                className="absolute top-1/2 left-1/2 origin-center"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-120px)`,
                }}
              >
                <span
                  className="text-xs sm:text-sm font-bold whitespace-nowrap"
                  style={{
                    color: segment.textColor,
                    transform: 'rotate(-90deg)',
                    display: 'block',
                  }}
                >
                  {segment.shortLabel}
                </span>
              </div>
            )
          })}

          {/* Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-occident to-occident-600 flex items-center justify-center">
              <Gift className="w-10 h-10 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-white/20 pointer-events-none" />
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={spin}
        disabled={isSpinning || disabled || spinsRemaining <= 0}
        className="mt-8 btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isSpinning ? 1 : 1.05 }}
        whileTap={{ scale: isSpinning ? 1 : 0.95 }}
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              🎰
            </motion.span>
            Girando...
          </span>
        ) : spinsRemaining <= 0 ? (
          'Vuelve mañana'
        ) : (
          <>
            <Gift className="mr-2 w-5 h-5" />
            ¡Girar la Ruleta!
          </>
        )}
      </motion.button>

      {spinsRemaining > 0 && !isSpinning && (
        <p className="mt-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Te quedan <strong>{spinsRemaining}</strong> tirada{spinsRemaining !== 1 ? 's' : ''} hoy
        </p>
      )}

      {/* Result Modal */}
      {showResult && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowResult(false)}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="card p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                result.prize.type === 'nothing'
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-gradient-to-br from-occident to-occident-600 text-white'
              }`}
            >
              {getPrizeIcon(result.prize.type)}
            </div>

            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              {result.prize.type === 'nothing' ? '¡Casi!' : '¡Felicidades!'}
            </h3>

            <p
              className="text-lg mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {result.prize.description}
            </p>

            {result.prize.type !== 'nothing' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-occident/10 text-occident font-bold mb-6">
                {result.label}
              </div>
            )}

            <button
              onClick={() => setShowResult(false)}
              className="btn-primary w-full"
            >
              {result.prize.type === 'nothing' ? 'Volver a intentar mañana' : '¡Genial!'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
