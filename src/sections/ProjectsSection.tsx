import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { fadeUp, sectionViewport, staggerContainer } from '../animations/motion'
import { SectionIntro } from '../components/common/SectionIntro'
import { profile } from '../data/profile'
import type { Translation } from '../types/translation'
import { publicAsset } from '../utils/publicAsset'
import styles from './section.module.css'
import projectStyles from './ProjectsSection.module.css'

interface ProjectsSectionProps {
  copy: Translation['projects']
  commonCopy: Translation['common']
}

export function ProjectsSection({ copy, commonCopy }: ProjectsSectionProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className={styles.section} id="projects" aria-labelledby="projects-title">
      <div id="projects-title">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      </div>
      <motion.div
        className={projectStyles.projectList}
        variants={staggerContainer}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={sectionViewport}
      >
        {profile.projects.map((project) => (
          <motion.a
            className={projectStyles.project}
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title}：${commonCopy.browseWebsite}`}
            variants={fadeUp}
            whileHover={reduceMotion ? undefined : { y: -5 }}
          >
            <div className={projectStyles.browserPreview}>
              <div className={projectStyles.browserBar} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <img src={publicAsset(project.image)} alt={project.imageAlt} loading="lazy" decoding="async" />
            </div>
            <div className={projectStyles.content}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className={projectStyles.visitLink}>
                {copy.previewLabel}
                <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.8} />
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
