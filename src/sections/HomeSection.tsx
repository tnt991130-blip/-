import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

import { fadeUp, heroTransition, motionDuration, motionEase, staggerContainer } from '../animations/motion'
import { AmbientCanvas } from '../components/effects/AmbientCanvas'
import type { Profile } from '../types/site'
import type { Translation } from '../types/translation'
import { publicAsset } from '../utils/publicAsset'
import styles from './section.module.css'
import homeStyles from './HomeSection.module.css'

interface HomeSectionProps {
  profile: Profile
  copy: Translation['hero']
  sectionId: 'home' | 'about'
  theme: 'light' | 'dark'
}

export function HomeSection({ profile, copy, sectionId, theme }: HomeSectionProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className={`${styles.section} ${homeStyles.home}`} id={sectionId} aria-labelledby="home-title">
      <div className={homeStyles.ambient} aria-hidden="true"><AmbientCanvas theme={theme} /></div>
      <motion.div
        className={homeStyles.copy}
        variants={staggerContainer}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <motion.p className={homeStyles.eyebrow} variants={fadeUp}>{copy.eyebrow}</motion.p>
        <motion.h1 id="home-title" variants={fadeUp}>{profile.name}</motion.h1>
        <motion.p className={homeStyles.tagline} variants={fadeUp}>{profile.heroTagline}</motion.p>
        <motion.div className={homeStyles.actions} variants={fadeUp}>
          <motion.a
            className={homeStyles.primaryAction}
            href="#projects"
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: motionDuration.fast, ease: motionEase }}
          >
            {copy.primaryAction}
            <ArrowDown aria-hidden="true" size={18} strokeWidth={1.75} />
          </motion.a>
          <motion.a
            className={homeStyles.secondaryAction}
            href="#contact"
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: motionDuration.fast, ease: motionEase }}
          >
            {copy.secondaryAction}
          </motion.a>
        </motion.div>
      </motion.div>
      <motion.div
        className={homeStyles.profileFrame}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 2.5 }}
        transition={heroTransition}
      >
        <img
          className={homeStyles.profileImage}
          src={publicAsset(profile.avatar)}
          alt="王宥崴的大頭貼"
          decoding="async"
          fetchPriority="high"
        />
      </motion.div>
    </section>
  )
}
