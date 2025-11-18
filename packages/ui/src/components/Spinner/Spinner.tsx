"use client";

import React from 'react';
import { cn } from '../../lib/utils';

export interface SpinnerProps {
  /**
   * Size variant
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color variant
   */
  variant?: 'primary' | 'secondary' | 'white' | 'current';
  /**
   * Label for accessibility
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

const variantClasses = {
  primary: 'border-accent-primary border-t-transparent',
  secondary: 'border-accent-secondary border-t-transparent',
  white: 'border-white border-t-transparent',
  current: 'border-current border-t-transparent',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  className,
}) => {
  return (
    <div
      role="status"
      className={cn('inline-block', className)}
      aria-label={label}
    >
      <div
        className={cn(
          'animate-spin rounded-full',
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';

// Loading overlay component
export interface LoadingOverlayProps {
  /**
   * Whether the loading overlay is visible
   */
  visible: boolean;
  /**
   * Loading message
   */
  message?: string;
  /**
   * Spinner size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Blur background
   */
  blur?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  size = 'lg',
  blur = true,
}) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-primary-bg/80',
        blur && 'backdrop-blur-sm'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size={size} variant="primary" />
        {message && (
          <p className="text-lg font-semibold text-text-primary">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

// Skeleton component for loading states
export interface SkeletonProps {
  /**
   * Width of the skeleton
   */
  width?: string | number;
  /**
   * Height of the skeleton
   */
  height?: string | number;
  /**
   * Border radius variant
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /**
   * Additional CSS classes
   */
  className?: string;
}

const radiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height = '1rem',
  radius = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface',
        radiusClasses[radius],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

Skeleton.displayName = 'Skeleton';
