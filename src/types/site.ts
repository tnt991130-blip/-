import type { Project } from './project'

export type NavigationId = 'home' | 'about' | 'projects' | 'contact'

export interface NavigationItem {
  id: NavigationId
  href: `#${NavigationId}`
}

export interface Profile {
  name: string
  heroTagline: string
  contactEmail: string
  avatar: string
  navigation: readonly NavigationItem[]
  projects: readonly Project[]
}
