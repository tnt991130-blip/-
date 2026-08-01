import styles from './SectionIntro.module.css'

interface SectionIntroProps {
  eyebrow: string
  title: string
  description?: string
}

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={styles.intro}
      variants={staggerContainer}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={sectionViewport}
    >
      <motion.p className={styles.eyebrow} variants={fadeUp}>{eyebrow}</motion.p>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
      {description ? <motion.p className={styles.description} variants={fadeUp}>{description}</motion.p> : null}
    </motion.div>
  )
}
import { motion, useReducedMotion } from 'framer-motion'

import { fadeUp, sectionViewport, staggerContainer } from '../../animations/motion'
