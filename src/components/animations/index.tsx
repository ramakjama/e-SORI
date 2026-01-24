'use client'

import { ReactNode } from 'react'
import { motion, MotionProps, Variants } from 'framer-motion'

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

export const slideInFromBottom: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0 },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Transition presets
export const springTransition = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
}

export const smoothTransition = {
  duration: 0.3,
  ease: 'easeOut',
}

// Animated wrapper components
interface AnimatedProps extends MotionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const FadeIn = ({ children, className, delay = 0, ...props }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    transition={{ ...smoothTransition, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

export const FadeInUp = ({ children, className, delay = 0, ...props }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    transition={{ ...springTransition, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

export const FadeInDown = ({ children, className, delay = 0, ...props }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInDown}
    transition={{ ...springTransition, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

export const ScaleIn = ({ children, className, delay = 0, ...props }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={scaleIn}
    transition={{ ...springTransition, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

// Stagger container for lists
export const StaggerContainer = ({ children, className, ...props }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

// Stagger child item
export const StaggerItem = ({ children, className, ...props }: AnimatedProps) => (
  <motion.div
    variants={fadeInUp}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

// Hover scale effect
export const HoverScale = ({ children, className, scale = 1.02, ...props }: AnimatedProps & { scale?: number }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={springTransition}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

// Floating animation
export const Float = ({ children, className, duration = 3, distance = 10, ...props }: AnimatedProps & { duration?: number; distance?: number }) => (
  <motion.div
    animate={{ y: [-distance / 2, distance / 2, -distance / 2] }}
    transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

// Pulse animation
export const Pulse = ({ children, className, ...props }: AnimatedProps) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

// Shake animation (for errors)
export const Shake = ({ children, className, trigger, ...props }: AnimatedProps & { trigger?: boolean }) => (
  <motion.div
    animate={trigger ? { x: [-10, 10, -10, 10, 0] } : {}}
    transition={{ duration: 0.4 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

// Slide reveal (for text)
export const SlideReveal = ({ children, className, delay = 0, ...props }: AnimatedProps) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ ...springTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  </div>
)

// Page transition wrapper
export const PageTransition = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
)

// Counter animation for numbers
export const AnimatedCounter = ({
  value,
  duration = 1,
  className,
}: {
  value: number
  duration?: number
  className?: string
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={value}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  )
}

// Loading dots animation
export const LoadingDots = ({ className }: { className?: string }) => (
  <span className={className}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
      >
        .
      </motion.span>
    ))}
  </span>
)

// Confetti-like celebration animation
export const Celebrate = ({ show }: { show: boolean }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#E30613', '#FFD700', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)],
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            x: (Math.random() - 0.5) * 200,
            rotate: Math.random() * 720,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// Gradient text animation
export const GradientText = ({
  children,
  className,
  colors = ['#E30613', '#FF6B6B', '#E30613'],
}: {
  children: ReactNode
  className?: string
  colors?: string[]
}) => (
  <motion.span
    className={className}
    style={{
      backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
      backgroundSize: '200% auto',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    }}
    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
  >
    {children}
  </motion.span>
)
