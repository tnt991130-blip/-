import { Moon, Sun } from 'lucide-react'

import type { Translation } from '../../types/translation'
import styles from './HeaderControls.module.css'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
  copy: Translation['common']
}

export function ThemeToggle({ theme, onToggle, copy }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      className={styles.iconButton}
      type="button"
      onClick={onToggle}
      aria-label={isDark ? copy.switchToLight : copy.switchToDark}
      title={isDark ? copy.switchToLight : copy.switchToDark}
    >
      {isDark ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
    </button>
  )
}
