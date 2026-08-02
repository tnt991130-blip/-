import { useEffect, useState } from 'react'

import type { NavigationId } from '../types/site'

export function useActiveSection(sectionIds: readonly NavigationId[]): NavigationId {
  const [activeSection, setActiveSection] = useState<NavigationId>('home')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id as NavigationId)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.5, 0.9] },
    )

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [sectionIds])

  return activeSection
}
