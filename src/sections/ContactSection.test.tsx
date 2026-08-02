import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { translations } from '../i18n/translations'
import { ContactSection } from './ContactSection'

const copy = translations.en

function renderContact(onOpenMail = vi.fn()) {
  render(
    <ContactSection
      copy={copy.contact}
      validationCopy={copy.validation}
      recipient="wei20100818@gmail.com"
      onOpenMail={onOpenMail}
    />,
  )
  return onOpenMail
}

describe('ContactSection', () => {
  it('blocks empty and invalid values with associated text feedback', async () => {
    const user = userEvent.setup()
    const onOpenMail = renderContact()

    await user.click(screen.getByRole('button', { name: 'Open mail application' }))
    expect(screen.getAllByRole('alert')).toHaveLength(3)
    expect(onOpenMail).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText('Name'), 'A')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Message'), 'short')
    await user.click(screen.getByRole('button', { name: 'Open mail application' }))

    expect(screen.getByText('Your name must contain at least 2 characters.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Your message must contain at least 10 characters.')).toBeInTheDocument()
    expect(onOpenMail).not.toHaveBeenCalled()
  })

  it('opens an encoded mailto URL for valid data and never claims it was sent', async () => {
    const user = userEvent.setup()
    const onOpenMail = renderContact()

    await user.type(screen.getByLabelText('Name'), ' 王宥崴 & Co. ')
    await user.type(screen.getByLabelText('Email'), 'person@example.com')
    await user.type(screen.getByLabelText('Message'), '你好！請問 1 + 1 = 2？')
    await user.click(screen.getByRole('button', { name: 'Open mail application' }))

    expect(onOpenMail).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Opening your mail application.' }))
    expect(onOpenMail).toHaveBeenCalledTimes(1)
    const mailtoUrl = onOpenMail.mock.calls[0][0]
    expect(mailtoUrl).toContain('subject=%E4%BD%9C%E5%93%81%E9%9B%86%E7%B6%B2%E7%AB%99%E8%81%AF%E7%B5%A1')
    expect(decodeURIComponent(mailtoUrl)).toContain('姓名：王宥崴 & Co.')
    expect(decodeURIComponent(mailtoUrl)).toContain('留言：\n你好！請問 1 + 1 = 2？')
    expect(screen.queryByText(/sent successfully/i)).not.toBeInTheDocument()
  })
})
