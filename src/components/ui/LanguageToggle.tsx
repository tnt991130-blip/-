import { Languages } from 'lucide-react'

import type { Locale, Translation } from '../../types/translation'
import styles from './HeaderControls.module.css'

interface LanguageToggleProps {
  locale: Locale
  onToggle: () => void
  copy: Translation['common']
}

export function LanguageToggle({ locale, onToggle, copy }: LanguageToggleProps) {
  const isChinese = locale === 'zh-TW'

  return (
    <button
      className={styles.languageButton}
      type="button"
      onClick={onToggle}
      aria-label={isChinese ? copy.switchToEnglish : copy.switchToChinese}
    >
      <Languages aria-hidden="true" size={17} />
      <span>{isChinese ? 'EN' : '中'}</span>
    </button>
  )
}
