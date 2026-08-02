import { SectionIntro } from '../components/common/SectionIntro'
import type { Translation } from '../types/translation'
import styles from './section.module.css'

interface AboutSectionProps {
  copy: Translation['about']
  sectionId: 'home' | 'about'
}

export function AboutSection({ copy, sectionId }: AboutSectionProps) {
  return (
    <section className={styles.section} id={sectionId} aria-labelledby="about-title">
      <div id="about-title">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.body} />
      </div>
    </section>
  )
}
