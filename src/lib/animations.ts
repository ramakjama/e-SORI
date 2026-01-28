/**
 * Sistema de animaciones global
 * Variantes y transiciones reutilizables para Framer Motion
 */

import { Variants, Transition } from 'framer-motion'

// Transiciones base
export const transitions = {
  smooth: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,

  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  } as Transition,

  gentle: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  } as Transition,

  quick: {
    type: 'tween',
    duration: 0.2,
    ease: 'easeOut',
  } as Transition,

  slow: {
    type: 'tween',
    duration: 0.5,
    ease: 'easeInOut',
  } as Transition,
}

// Variantes de fade
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.quick,
  },
}

// Variantes de slide desde abajo
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.quick,
  },
}

// Variantes de slide desde arriba
export const slideDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: transitions.quick,
  },
}

// Variantes de slide desde la izquierda
export const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.quick,
  },
}

// Variantes de slide desde la derecha
export const slideRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.quick,
  },
}

// Variantes de scale
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.quick,
  },
}

// Variantes de scale suave
export const scaleSoftVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.gentle,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.quick,
  },
}

// Variantes para listas con stagger
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.quick,
  },
}

// Variantes para hover effects
export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: transitions.quick,
  },
  tap: {
    scale: 0.95,
    transition: transitions.quick,
  },
}

export const hoverGlow = {
  rest: {
    boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
    transition: transitions.gentle,
  },
}

// Variantes de shimmer para skeleton loaders
export const shimmerVariants: Variants = {
  start: {
    backgroundPosition: '-200% 0',
  },
  end: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Variantes de pulse
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Variantes de shake (para errores)
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
}

// Variantes de página completa
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

// Variantes para modals
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.quick,
  },
  exit: {
    opacity: 0,
    transition: transitions.quick,
  },
}

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: transitions.quick,
  },
}

// Helper para crear variantes de stagger personalizadas
export const createStaggerVariants = (delay = 0.1, stagger = 0.1) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.smooth,
    },
  },
})
