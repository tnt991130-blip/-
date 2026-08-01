import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import App from './App'
import { profile } from './data/profile'

describe('portfolio interactions', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    document.documentElement.dataset.theme = 'light'
    document.documentElement.lang = 'zh-Hant'
  })

  it('defaults to Chinese and keeps project titles Chinese after switching to English', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('link', { name: '首頁' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('zh-Hant')

    await user.click(screen.getByRole('button', { name: 'Switch to English' }))

    expect(document.documentElement.lang).toBe('en')
    expect(window.localStorage.getItem('portfolio-locale')).toBe('en')
    for (const project of profile.projects) {
      expect(screen.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument()
    }
  })

  it('updates the theme preference and exposes useful navigation controls', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '切換為深色模式' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('dark')
    expect(screen.getByRole('link', { name: '查看我的作品' })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: '聯絡我' })).toHaveAttribute('href', '#contact')

    const menuButton = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-navigation"]')
    expect(menuButton).not.toBeNull()
    if (!menuButton) {
      throw new Error('The mobile navigation control is missing.')
    }
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-navigation')
  })

  it('renders complete, secure, keyboard-focusable project links without exposing the recipient email', () => {
    render(<App />)

    for (const project of profile.projects) {
      const link = screen.getByRole('link', { name: `${project.title}：瀏覽網站` })
      expect(link).toHaveAttribute('href', project.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link.tabIndex).toBe(0)
      expect(screen.getByAltText(project.imageAlt)).toBeInTheDocument()
    }

    expect(screen.queryByText(profile.contactEmail)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
  })
})
