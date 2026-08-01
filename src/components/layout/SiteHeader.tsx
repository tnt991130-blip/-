import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { LanguageToggle } from '../ui/LanguageToggle'
import { ThemeToggle } from '../ui/ThemeToggle'
import type { NavigationId, NavigationItem } from '../../types/site'
import type { Locale, Translation } from '../../types/translation'
import styles from './SiteHeader.module.css'

interface SiteHeaderProps {
  activeSection: NavigationId
  brand: string
  copy: Translation
  locale: Locale
  navigation: readonly NavigationItem[]
  onLocaleToggle: () => void
  onThemeToggle: () => void
  theme: 'light' | 'dark'
}

export function SiteHeader({
  activeSection,
  brand,
  copy,
  locale,
  navigation,
  onLocaleToggle,
  onThemeToggle,
  theme,
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateHeaderState = () => setHasScrolled(window.scrollY > 12)

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })
    return () => window.removeEventListener('scroll', updateHeaderState)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const focusFrame = window.requestAnimationFrame(() => {
      mobilePanelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    })

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        window.requestAnimationFrame(() => menuButtonRef.current?.focus())
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`${styles.header} ${hasScrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#home" aria-label={`${brand} ${copy.navigation.home}`}>
          {brand}
        </a>

        <nav className={styles.desktopNavigation} aria-label={copy.navigation.home}>
          <NavigationLinks activeSection={activeSection} copy={copy} navigation={navigation} />
        </nav>

        <div className={styles.desktopControls}>
          <LanguageToggle locale={locale} onToggle={onLocaleToggle} copy={copy.common} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} copy={copy.common} />
        </div>

        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? copy.common.closeMenu : copy.common.openMenu}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className={styles.mobilePanel} id="mobile-navigation" ref={mobilePanelRef}>
          <nav aria-label={copy.navigation.home}>
            <NavigationLinks
              activeSection={activeSection}
              copy={copy}
              navigation={navigation}
              onNavigate={closeMenu}
            />
          </nav>
          <div className={styles.mobileControls}>
            <LanguageToggle locale={locale} onToggle={onLocaleToggle} copy={copy.common} />
            <ThemeToggle theme={theme} onToggle={onThemeToggle} copy={copy.common} />
          </div>
        </div>
      ) : null}
    </header>
  )
}

interface NavigationLinksProps {
  activeSection: NavigationId
  copy: Translation
  navigation: readonly NavigationItem[]
  onNavigate?: () => void
}

function NavigationLinks({ activeSection, copy, navigation, onNavigate }: NavigationLinksProps) {
  return (
    <ul className={styles.navigationList}>
      {navigation.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            aria-current={activeSection === item.id ? 'page' : undefined}
            onClick={onNavigate}
          >
            {copy.navigation[item.id]}
          </a>
        </li>
      ))}
    </ul>
  )
}
