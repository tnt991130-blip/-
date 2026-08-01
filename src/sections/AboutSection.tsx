import { SectionIntro } from '../components/common/SectionIntro'
import type { Translation } from '../types/translation'
import styles from './section.module.css'

interface AboutSectionProps {
  copy: Translation['about']
}

export function AboutSection({ copy }: AboutSectionProps) {
  return (
    <section className={styles.section} id="about" aria-labelledby="about-title">
      <div id="about-title">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.body} />
      </div>
    </section>
  )
}
