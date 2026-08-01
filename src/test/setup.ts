import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

class MockIntersectionObserver {
  disconnect() {}

  observe() {}

  unobserve() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  configurable: true,
  value: MockIntersectionObserver,
})

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: vi.fn(() => null),
})
