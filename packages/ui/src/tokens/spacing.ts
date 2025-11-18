/**
 * Design Tokens - Spacing
 * Extracted from portfolio app globals.css
 */

export const spacing = {
  // Section spacing - generous white space
  section: {
    DEFAULT: '10rem',    // 160px - Main section padding
    sm: '6rem',          // 96px - Smaller section padding
    xs: '4rem',          // 64px - Extra small section padding
  },
  
  // Container spacing
  container: {
    DEFAULT: '5rem',     // 80px - Container padding
    sm: '3rem',          // 48px - Smaller container padding
    xs: '2rem',          // 32px - Extra small container padding
  },
  
  // Component spacing
  component: {
    xl: '3rem',          // 48px
    lg: '2rem',          // 32px
    md: '1.5rem',        // 24px
    DEFAULT: '1rem',     // 16px
    sm: '0.75rem',       // 12px
    xs: '0.5rem',        // 8px
    xxs: '0.25rem',      // 4px
  },
} as const;

// Border radius values
export const borderRadius = {
  sm: '0.25rem',         // 4px
  md: '0.5rem',          // 8px
  DEFAULT: '0.5rem',     // 8px
  lg: '0.75rem',         // 12px
  xl: '1rem',            // 16px
  '2xl': '1.5rem',       // 24px
  full: '9999px',        // Fully rounded
} as const;

// CSS variable mappings
export const spacingVariables = {
  'spacing-section': spacing.section.DEFAULT,
  'spacing-section-sm': spacing.section.sm,
  'spacing-container': spacing.container.DEFAULT,
  'radius-sm': borderRadius.sm,
  'radius-md': borderRadius.md,
  'radius-lg': borderRadius.lg,
  'radius-xl': borderRadius.xl,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof borderRadius;
