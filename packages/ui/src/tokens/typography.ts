/**
 * Design Tokens - Typography
 * Extracted from portfolio app globals.css
 */

export const fontFamily = {
  sans: 'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  display: 'var(--font-space-grotesk), system-ui, sans-serif',
  mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
} as const;

export const fontSize = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px - Body text default
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
  '8xl': '6rem',      // 96px
  '9xl': '8rem',      // 128px
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const lineHeight = {
  none: 1,
  tight: 1.1,         // Headings
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.7,       // Body text default
  loose: 1.75,
  extra: 2,
} as const;

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.02em',   // Headings default
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Typography scale for headings
export const headingScale = {
  h1: {
    fontSize: fontSize['7xl'],      // 72px mobile, 96-128px desktop
    fontWeight: fontWeight.extrabold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display,
  },
  h2: {
    fontSize: fontSize['5xl'],      // 48px mobile, 60-72px desktop
    fontWeight: fontWeight.extrabold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display,
  },
  h3: {
    fontSize: fontSize['4xl'],      // 36px mobile, 48px desktop
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display,
  },
  h4: {
    fontSize: fontSize['3xl'],      // 30px mobile, 36px desktop
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display,
  },
  h5: {
    fontSize: fontSize['2xl'],      // 24px mobile, 30px desktop
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    fontFamily: fontFamily.display,
  },
  h6: {
    fontSize: fontSize.xl,          // 20px mobile, 24px desktop
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    fontFamily: fontFamily.display,
  },
} as const;

// Body text variants
export const bodyScale = {
  large: {
    fontSize: fontSize.lg,          // 18px - Default body text
    lineHeight: lineHeight.relaxed, // 1.7
    fontFamily: fontFamily.sans,
  },
  base: {
    fontSize: fontSize.base,        // 16px
    lineHeight: lineHeight.normal,  // 1.5
    fontFamily: fontFamily.sans,
  },
  small: {
    fontSize: fontSize.sm,          // 14px
    lineHeight: lineHeight.normal,
    fontFamily: fontFamily.sans,
  },
} as const;

export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
export type LineHeight = keyof typeof lineHeight;

// Combined typography export for convenience
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  headingScale,
  bodyScale,
} as const;
