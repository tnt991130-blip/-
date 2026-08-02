import type { Transition, Variants } from 'framer-motion'

export const motionEase = [0.22, 1, 0.36, 1] as const

export const motionDuration = {
  fast: 0.18,
  normal: 0.42,
  slow: 0.65,
} as const

export const sectionViewport = { amount: 0.2, once: true }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.normal, ease: motionEase },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.05, staggerChildren: 0.1 },
  },
}

export const heroTransition: Transition = {
  duration: motionDuration.slow,
  ease: motionEase,
}
