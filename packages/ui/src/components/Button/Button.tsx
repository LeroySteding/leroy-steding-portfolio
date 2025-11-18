import React from 'react';
import { colors, spacing, typography, borderRadius } from '../../tokens';

export interface ButtonProps {
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button component with Navy & Beige theme support
 * 
 * Matches portfolio `.btn-primary` and `.btn-secondary` patterns
 * with responsive sizing and hover effects.
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
}: ButtonProps) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.bold,
    borderRadius: borderRadius.md,
    transition: 'all 0.3s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.component.sm} ${spacing.component.lg}`,
      fontSize: typography.fontSize.base,
    },
    md: {
      padding: `${spacing.component.DEFAULT} ${spacing.component.xl}`,
      fontSize: typography.fontSize.lg,
    },
    lg: {
      padding: `${spacing.component.lg} ${spacing.component.xl}`,
      fontSize: typography.fontSize.xl,
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: colors.dark.accent.primary,
      color: colors.dark.primary.bg,
    },
    secondary: {
      background: 'transparent',
      color: colors.dark.accent.primary,
      border: `2px solid ${colors.dark.accent.primary}`,
    },
    outline: {
      background: 'transparent',
      color: colors.dark.text.primary,
      border: `2px solid ${colors.dark.surface.light}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.dark.accent.primary,
    },
  };

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const styles: Record<string, Partial<React.CSSProperties>> = {
      primary: {
        background: colors.dark.accent.hover,
        transform: 'scale(1.02)',
      },
      secondary: {
        background: colors.dark.accent.primary,
        color: colors.dark.primary.bg,
        transform: 'scale(1.02)',
      },
      outline: {
        background: colors.dark.surface.DEFAULT,
        borderColor: colors.dark.accent.primary,
      },
      ghost: {
        background: colors.dark.surface.DEFAULT,
      },
    };

    Object.assign(e.currentTarget.style, styles[variant]);
  };

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    Object.assign(e.currentTarget.style, variantStyles[variant]);
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      disabled={disabled}
      className={className}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  );
};
