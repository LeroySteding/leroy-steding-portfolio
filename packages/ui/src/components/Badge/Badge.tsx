import React from 'react';
import { colors, spacing, typography, borderRadius } from '../../tokens';

export interface BadgeProps {
  /**
   * Badge content
   */
  children: React.ReactNode;
  /**
   * Badge variant
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Badge style
   */
  style?: 'filled' | 'outlined' | 'subtle';
  /**
   * Rounded corners
   */
  rounded?: 'sm' | 'md' | 'full';
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Badge component with Navy & Beige theme
 * 
 * Small status indicators and labels.
 * Supports multiple variants, sizes, and styles.
 */
export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  style = 'filled',
  rounded = 'md',
  className = '',
  onClick,
}: BadgeProps) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    transition: 'all 0.2s ease',
    cursor: onClick ? 'pointer' : 'default',
    whiteSpace: 'nowrap',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.component.xxs} ${spacing.component.sm}`,
      fontSize: typography.fontSize.xs,
      height: '1.25rem',
    },
    md: {
      padding: `${spacing.component.xs} ${spacing.component.DEFAULT}`,
      fontSize: typography.fontSize.sm,
      height: '1.5rem',
    },
    lg: {
      padding: `${spacing.component.sm} ${spacing.component.lg}`,
      fontSize: typography.fontSize.base,
      height: '2rem',
    },
  };

  const roundedStyles: Record<string, React.CSSProperties> = {
    sm: { borderRadius: borderRadius.sm },
    md: { borderRadius: borderRadius.md },
    full: { borderRadius: borderRadius.full },
  };

  const variantColors = {
    primary: {
      filled: {
        background: colors.dark.accent.primary,
        color: colors.dark.primary.bg,
      },
      outlined: {
        background: 'transparent',
        color: colors.dark.accent.primary,
        border: `1px solid ${colors.dark.accent.primary}`,
      },
      subtle: {
        background: `${colors.dark.accent.primary}20`,
        color: colors.dark.accent.primary,
      },
    },
    secondary: {
      filled: {
        background: colors.dark.accent.secondary,
        color: colors.dark.primary.bg,
      },
      outlined: {
        background: 'transparent',
        color: colors.dark.accent.secondary,
        border: `1px solid ${colors.dark.accent.secondary}`,
      },
      subtle: {
        background: `${colors.dark.accent.secondary}20`,
        color: colors.dark.accent.secondary,
      },
    },
    success: {
      filled: {
        background: '#10b981',
        color: '#ffffff',
      },
      outlined: {
        background: 'transparent',
        color: '#10b981',
        border: '1px solid #10b981',
      },
      subtle: {
        background: '#10b98120',
        color: '#10b981',
      },
    },
    warning: {
      filled: {
        background: '#f59e0b',
        color: '#ffffff',
      },
      outlined: {
        background: 'transparent',
        color: '#f59e0b',
        border: '1px solid #f59e0b',
      },
      subtle: {
        background: '#f59e0b20',
        color: '#f59e0b',
      },
    },
    error: {
      filled: {
        background: '#ef4444',
        color: '#ffffff',
      },
      outlined: {
        background: 'transparent',
        color: '#ef4444',
        border: '1px solid #ef4444',
      },
      subtle: {
        background: '#ef444420',
        color: '#ef4444',
      },
    },
    info: {
      filled: {
        background: '#3b82f6',
        color: '#ffffff',
      },
      outlined: {
        background: 'transparent',
        color: '#3b82f6',
        border: '1px solid #3b82f6',
      },
      subtle: {
        background: '#3b82f620',
        color: '#3b82f6',
      },
    },
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.opacity = '0.9';
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...roundedStyles[rounded],
        ...variantColors[variant][style],
      }}
    >
      {children}
    </div>
  );
};
