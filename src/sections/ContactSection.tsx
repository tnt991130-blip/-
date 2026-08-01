import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { fadeUp, sectionViewport, staggerContainer } from '../animations/motion'
import { SectionIntro } from '../components/common/SectionIntro'
import type { Translation } from '../types/translation'
import { createMailtoUrl, type ContactValues } from '../utils/mailto'
import styles from './section.module.css'
import contactStyles from './ContactSection.module.css'

interface ContactSectionProps {
  copy: Translation['contact']
  validationCopy: Translation['validation']
  recipient: string
  onOpenMail?: (url: string) => void
}

type ContactErrors = Partial<Record<keyof ContactValues, string>>

const initialValues: ContactValues = { name: '', email: '', message: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function openMailClient(url: string) {
  window.location.href = url
}

export function ContactSection({ copy, validationCopy, recipient, onOpenMail = openMailClient }: ContactSectionProps) {
  const [values, setValues] = useState<ContactValues>(initialValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'opening'>('idle')
  const isOpeningRef = useRef(false)
  const resetStatusTimeoutRef = useRef<number | undefined>(undefined)
  const reduceMotion = useReducedMotion()

  useEffect(() => () => {
    if (resetStatusTimeoutRef.current !== undefined) {
      window.clearTimeout(resetStatusTimeoutRef.current)
    }
  }, [])

  const validate = (currentValues: ContactValues): ContactErrors => {
    const nextErrors: ContactErrors = {}

    const trimmedName = currentValues.name.trim()
    const trimmedEmail = currentValues.email.trim()
    const trimmedMessage = currentValues.message.trim()

    if (!trimmedName) {
      nextErrors.name = validationCopy.required
    } else if (trimmedName.length < 2) {
      nextErrors.name = validationCopy.nameTooShort
    } else if (trimmedName.length > 80) {
      nextErrors.name = validationCopy.nameTooLong
    }
    if (!trimmedEmail) {
      nextErrors.email = validationCopy.required
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = validationCopy.invalidEmail
    }
    if (!trimmedMessage) {
      nextErrors.message = validationCopy.required
    } else if (trimmedMessage.length < 10) {
      nextErrors.message = validationCopy.messageTooShort
    } else if (currentValues.message.length > 1000) {
      nextErrors.message = validationCopy.messageTooLong
    }

    return nextErrors
  }

  const updateField = (field: keyof ContactValues, value: string) => {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    if (errors[field]) {
      setErrors(validate(nextValues))
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || status === 'opening' || isOpeningRef.current) {
      return
    }

    isOpeningRef.current = true
    setStatus('opening')
    onOpenMail(createMailtoUrl(recipient, {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    }))
    resetStatusTimeoutRef.current = window.setTimeout(() => {
      isOpeningRef.current = false
      resetStatusTimeoutRef.current = undefined
      setStatus('idle')
    }, 1200)
  }

  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-title">
      <div id="contact-title">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      </div>
      <motion.form
        className={contactStyles.form}
        noValidate
        onSubmit={handleSubmit}
        variants={staggerContainer}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={sectionViewport}
      >
        <FormField
          error={errors.name}
          id="name"
          label={copy.nameLabel}
          onChange={(value) => updateField('name', value)}
          placeholder={copy.namePlaceholder}
          value={values.name}
        />
        <FormField
          error={errors.email}
          id="email"
          inputMode="email"
          label={copy.emailLabel}
          onChange={(value) => updateField('email', value)}
          placeholder={copy.emailPlaceholder}
          type="email"
          value={values.email}
        />
        <FormField
          error={errors.message}
          id="message"
          label={copy.messageLabel}
          multiline
          onChange={(value) => updateField('message', value)}
          placeholder={copy.messagePlaceholder}
          value={values.message}
        />
        <div className={contactStyles.submitArea} aria-live="polite">
          <button type="submit" disabled={status === 'opening'}>
            {status === 'opening' ? copy.openingMail : copy.submit}
          </button>
          {status === 'opening' ? <p>{copy.mailClientHelp}</p> : null}
        </div>
      </motion.form>
    </section>
  )
}

interface FormFieldProps {
  error?: string
  id: keyof ContactValues
  inputMode?: 'email'
  label: string
  multiline?: boolean
  onChange: (value: string) => void
  placeholder: string
  type?: 'email' | 'text'
  value: string
}

function FormField({ error, id, inputMode, label, multiline, onChange, placeholder, type = 'text', value }: FormFieldProps) {
  const errorId = `${id}-error`
  const sharedProps = {
    'aria-describedby': error ? errorId : undefined,
    'aria-invalid': Boolean(error),
    id,
    name: id,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
    placeholder,
    required: true,
    value,
  }

  return (
    <motion.div className={contactStyles.field} variants={fadeUp}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea {...sharedProps} rows={6} minLength={10} maxLength={1000} />
      ) : (
        <input {...sharedProps} type={type} inputMode={inputMode} minLength={id === 'name' ? 2 : undefined} maxLength={id === 'name' ? 80 : undefined} />
      )}
      {error ? (
        <p className={contactStyles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </motion.div>
  )
}
