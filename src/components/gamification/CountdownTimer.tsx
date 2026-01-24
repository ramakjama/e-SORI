'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: Date
  onComplete?: () => void
  variant?: 'default' | 'compact' | 'large'
  showLabels?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({
  targetDate,
  onComplete,
  variant = 'default',
  showLabels = true,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        onComplete?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      setIsUrgent(difference < 24 * 60 * 60 * 1000) // Less than 24 hours

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const timeUnits = [
    { value: timeLeft.days, label: 'Días', show: timeLeft.days > 0 || variant === 'large' },
    { value: timeLeft.hours, label: 'Horas', show: true },
    { value: timeLeft.minutes, label: 'Min', show: true },
    { value: timeLeft.seconds, label: 'Seg', show: true },
  ]

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-mono font-bold ${
        isUrgent ? 'bg-occident text-white animate-pulse' : 'bg-occident/10 text-occident'
      }`}>
        {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
        <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 sm:gap-4">
      {isUrgent && (
        <span className="text-occident text-sm font-semibold animate-pulse">
          ¡Últimas horas!
        </span>
      )}

      {timeUnits.filter(unit => unit.show).map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <motion.div
            key={`${unit.label}-${unit.value}`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`flex flex-col items-center ${
              variant === 'large' ? 'min-w-[80px]' : 'min-w-[50px]'
            }`}
          >
            <div
              className={`
                ${variant === 'large' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}
                font-bold font-mono rounded-xl px-3 py-2
                ${isUrgent ? 'bg-occident text-white' : 'bg-occident/10 text-occident'}
              `}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            {showLabels && (
              <span
                className={`
                  ${variant === 'large' ? 'text-sm' : 'text-xs'}
                  mt-1 font-medium uppercase tracking-wider
                `}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {unit.label}
              </span>
            )}
          </motion.div>

          {index < timeUnits.filter(u => u.show).length - 1 && (
            <span
              className={`${variant === 'large' ? 'text-3xl' : 'text-xl'} font-bold ${
                isUrgent ? 'text-occident' : ''
              }`}
              style={{ color: isUrgent ? undefined : 'var(--color-text-secondary)' }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
