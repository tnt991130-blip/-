import { ArrowUp } from 'lucide-react'

import type { Translation } from '../../types/translation'
import styles from './SiteFooter.module.css'

interface SiteFooterProps {
  name: string
  copy: Translation['footer']
}

export function SiteFooter({ name, copy }: SiteFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>
          {name} <span aria-hidden="true">·</span> © {year} {copy.copyright}
        </p>
        <a href="#home">
          {copy.backToTop}
          <ArrowUp aria-hidden="true" size={16} />
        </a>
      </div>
    </footer>
  )
}
