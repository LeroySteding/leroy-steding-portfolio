import post from './post'
import page from './page'
import project from './project'
import experience from './experience'
import { sections } from './sections'
import { settings } from './settings'

export const schemaTypes = [
  // Content Types
  post,
  project,
  experience,
  
  // Pages
  page,
  
  // Sections
  ...sections,
  
  // Settings
  ...settings,
]
