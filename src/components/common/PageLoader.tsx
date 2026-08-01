import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { motionDuration, motionEase } from '../../animations/motion'
import styles from './PageLoader.module.css'

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false

    return window.sessionStorage.getItem('portfolio-loader-seen') !== 'true'
  })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isVisible) return undefined

    if (typeof window === 'undefined') return undefined

    const finish = () => {
      window.sessionStorage.setItem('portfolio-loader-seen', 'true')
      setIsVisible(false)
    }
    const frame = window.requestAnimationFrame(finish)
    const safeguard = window.setTimeout(finish, 1600)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(safeguard)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className={styles.loader}
          aria-label="Loading portfolio"
          initial={reduceMotion ? false : { opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
          transition={{ duration: motionDuration.normal, ease: motionEase }}
        >
          <div className={styles.mark} aria-hidden="true">WY</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
