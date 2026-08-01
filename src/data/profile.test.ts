import { describe, expect, it } from 'vitest'

import { profile } from './profile'

describe('profile data', () => {
  it('contains three complete external project definitions', () => {
    expect(profile.projects).toHaveLength(3)

    for (const project of profile.projects) {
      expect(project.url).toMatch(/^https:\/\//)
      expect(project.image).toMatch(/^images\/projects\//)
      expect(project.imageAlt).not.toHaveLength(0)
    }
  })
})
