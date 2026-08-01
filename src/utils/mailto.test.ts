import { describe, expect, it } from 'vitest'

import { createMailtoUrl } from './mailto'

describe('createMailtoUrl', () => {
  it('encodes Chinese and reserved characters in the subject and message', () => {
    const url = createMailtoUrl('wei20100818@gmail.com', {
      name: '王宥崴 & Co.',
      email: 'person@example.com',
      message: '你好！請問 1 + 1 = 2？',
    })

    expect(url).toContain('subject=%E4%BD%9C%E5%93%81%E9%9B%86%E7%B6%B2%E7%AB%99%E8%81%AF%E7%B5%A1%EF%BD%9C')
    expect(url).toContain('%26')
    expect(url).toContain('%E4%BD%A0%E5%A5%BD')
  })
})
