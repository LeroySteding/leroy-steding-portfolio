import React from 'react';
import { colors, spacing, borderRadius } from '../../tokens';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Card variant
   */
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  /**
   * Padding size
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Hover effect
   */
  hoverable?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Full width card
   */
  fullWidth?: boolean;
}

/**
 * Card component with Navy & Beige theme
 * 
 * Matches portfolio `.card` pattern with clean design.
 * Supports hover effects and multiple variants.
 */
export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = true,
  onClick,
  className = '',
  fullWidth = false,
}: CardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyles: React.CSSProperties = {
    borderRadius: borderRadius.lg,
    transition: 'all 0.3s ease',
    width: fullWidth ? '100%' : 'auto',
    cursor: onClick ? 'pointer' : 'default',
  };

  const paddingStyles: Record<string, React.CSSProperties> = {
    none: { padding: '0' },
    sm: { padding: spacing.component.DEFAULT },
    md: { padding: spacing.component.lg },
    lg: { padding: spacing.component.xl },
    xl: { padding: `${spacing.component.xl} ${spacing.container.sm}` },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: colors.dark.secondary.bg,
      border: `1px solid ${colors.dark.surface.DEFAULT}`,
    },
    elevated: {
      background: colors.dark.secondary.bg,
      border: `1px solid ${colors.dark.surface.DEFAULT}`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
    outlined: {
      background: 'transparent',
      border: `2px solid ${colors.dark.surface.light}`,
    },
    flat: {
      background: colors.dark.tertiary.bg,
      border: 'none',
    },
  };

  const hoverStyles: React.CSSProperties = hoverable && isHovered
    ? {
        borderColor: colors.dark.accent.primary,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      }
    : {};

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...paddingStyles[padding],
        ...hoverStyles,
      }}
    >
      {children}
    </div>
  );
};
