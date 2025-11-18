/**
 * Design Tokens - Effects
 * Box shadows and elevation system
 */

export const boxShadow = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
  DEFAULT: '0 4px 12px rgba(0, 0, 0, 0.3)',
  md: '0 4px 12px rgba(0, 0, 0, 0.3)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.4)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.5)',
  '2xl': '0 20px 48px rgba(0, 0, 0, 0.6)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
} as const;

export const elevation = {
  0: boxShadow.none,
  1: boxShadow.sm,
  2: boxShadow.md,
  3: boxShadow.lg,
  4: boxShadow.xl,
  5: boxShadow['2xl'],
} as const;

// Light theme shadows (less opacity for light backgrounds)
export const boxShadowLight = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  DEFAULT: '0 4px 12px rgba(0, 0, 0, 0.08)',
  md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.15)',
  '2xl': '0 20px 48px rgba(0, 0, 0, 0.18)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

export const elevationLight = {
  0: boxShadowLight.none,
  1: boxShadowLight.sm,
  2: boxShadowLight.md,
  3: boxShadowLight.lg,
  4: boxShadowLight.xl,
  5: boxShadowLight['2xl'],
} as const;

// Animation timing
export const animationDuration = {
  instant: '0ms',
  quick: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
} as const;

// Easing functions
export const animationEasing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

export type BoxShadow = keyof typeof boxShadow;
export type Elevation = keyof typeof elevation;
export type AnimationDuration = keyof typeof animationDuration;
export type AnimationEasing = keyof typeof animationEasing;

// Combined effects export
export const effects = {
  boxShadow,
  boxShadowLight,
  elevation,
  elevationLight,
  animationDuration,
  animationEasing,
} as const;
