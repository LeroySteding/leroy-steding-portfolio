"use client";

import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps {
  /**
   * Current value (0-100)
   */
  value: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color variant
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /**
   * Show label
   */
  showLabel?: boolean;
  /**
   * Label position
   */
  labelPosition?: 'inside' | 'outside';
  /**
   * Custom label formatter
   */
  labelFormatter?: (value: number, max: number) => string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  primary: 'bg-accent-primary',
  secondary: 'bg-accent-secondary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  labelPosition = 'outside',
  labelFormatter,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const label = labelFormatter
    ? labelFormatter(value, max)
    : `${Math.round(percentage)}%`;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && labelPosition === 'outside' && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-secondary">
            {label}
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-full bg-surface rounded-full overflow-hidden relative',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        >
          {showLabel && labelPosition === 'inside' && size === 'lg' && (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs font-bold text-primary-bg px-2">
                {label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Progress.displayName = 'Progress';

// CircularProgress component
export interface CircularProgressProps {
  /**
   * Current value (0-100)
   */
  value: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Size in pixels
   */
  size?: number;
  /**
   * Stroke width in pixels
   */
  strokeWidth?: number;
  /**
   * Color variant
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /**
   * Show label in center
   */
  showLabel?: boolean;
  /**
   * Custom label formatter
   */
  labelFormatter?: (value: number, max: number) => string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const circularVariantClasses = {
  primary: 'stroke-accent-primary',
  secondary: 'stroke-accent-secondary',
  success: 'stroke-green-500',
  warning: 'stroke-yellow-500',
  error: 'stroke-red-500',
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  labelFormatter,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const label = labelFormatter
    ? labelFormatter(value, max)
    : `${Math.round(percentage)}%`;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-300', circularVariantClasses[variant])}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-text-primary">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

CircularProgress.displayName = 'CircularProgress';
