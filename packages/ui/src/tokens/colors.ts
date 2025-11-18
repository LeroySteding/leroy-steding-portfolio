/**
 * Design Tokens - Colors
 * Extracted from portfolio app globals.css
 * Navy & Beige palette inspired by Magram
 */

export const colors = {
  // Dark theme colors (default)
  dark: {
    primary: {
      bg: '#0f1419',
      DEFAULT: '#0f1419',
    },
    secondary: {
      bg: '#1a2332',
      DEFAULT: '#1a2332',
    },
    tertiary: {
      bg: '#242d3d',
      DEFAULT: '#242d3d',
    },
    surface: {
      DEFAULT: '#2a3444',
      light: '#354150',
    },
    accent: {
      primary: '#e8d5c4',
      secondary: '#d4a574',
      hover: '#f0e0d0',
      DEFAULT: '#e8d5c4',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#b8b8b8',
      muted: '#808080',
      DEFAULT: '#f5f5f5',
    },
    mint: {
      DEFAULT: '#a0d9b4',
      dark: '#7ec99a',
    },
    border: {
      DEFAULT: '#2a3444',
      light: '#354150',
    },
  },

  // Light theme colors
  light: {
    primary: {
      bg: '#ffffff',
      DEFAULT: '#ffffff',
    },
    secondary: {
      bg: '#fafafa',
      DEFAULT: '#fafafa',
    },
    tertiary: {
      bg: '#f5f5f5',
      DEFAULT: '#f5f5f5',
    },
    surface: {
      DEFAULT: '#eeeeee',
      light: '#e0e0e0',
    },
    accent: {
      primary: '#c4a574',
      secondary: '#a08555',
      hover: '#d4b584',
      DEFAULT: '#c4a574',
    },
    text: {
      primary: '#0a0a0a',
      secondary: '#525252',
      muted: '#737373',
      DEFAULT: '#0a0a0a',
    },
    mint: {
      DEFAULT: '#059669',
      dark: '#047857',
    },
    border: {
      DEFAULT: '#e0e0e0',
      light: '#eeeeee',
    },
  },
} as const;

// Semantic color aliases for easier usage
export const semanticColors = {
  background: {
    primary: 'var(--color-primary-bg)',
    secondary: 'var(--color-secondary-bg)',
    tertiary: 'var(--color-tertiary-bg)',
    surface: 'var(--color-surface)',
    surfaceLight: 'var(--color-surface-light)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
  },
  accent: {
    primary: 'var(--color-accent-primary)',
    secondary: 'var(--color-accent-secondary)',
    hover: 'var(--color-accent-hover)',
  },
  mint: {
    DEFAULT: 'var(--color-mint)',
    dark: 'var(--color-mint-dark)',
  },
} as const;

// CSS variable names for Tailwind configuration
export const cssVariables = {
  // Backgrounds
  'primary-bg': colors.dark.primary.bg,
  'secondary-bg': colors.dark.secondary.bg,
  'tertiary-bg': colors.dark.tertiary.bg,
  'surface': colors.dark.surface.DEFAULT,
  'surface-light': colors.dark.surface.light,
  
  // Accents
  'accent-primary': colors.dark.accent.primary,
  'accent-secondary': colors.dark.accent.secondary,
  'accent-hover': colors.dark.accent.hover,
  
  // Text
  'text-primary': colors.dark.text.primary,
  'text-secondary': colors.dark.text.secondary,
  'text-muted': colors.dark.text.muted,
  
  // Mint
  'mint': colors.dark.mint.DEFAULT,
  'mint-dark': colors.dark.mint.dark,
} as const;

export type ThemeMode = 'light' | 'dark';
export type ColorToken = keyof typeof cssVariables;
