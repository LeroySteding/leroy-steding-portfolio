"use client";

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Label text for the checkbox
   */
  label?: string;
  /**
   * Description text below the label
   */
  description?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Indeterminate state
   */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      indeterminate = false,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const checkboxClasses = cn(
      // Base styles
      'rounded border-2 transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:ring-offset-2',
      'cursor-pointer',
      
      // Size
      sizeClasses[size],
      
      // States
      'border-surface hover:border-accent-primary',
      'checked:bg-accent-primary checked:border-accent-primary',
      'indeterminate:bg-accent-primary indeterminate:border-accent-primary',
      error && 'border-red-500 checked:bg-red-500 checked:border-red-500',
      disabled && 'opacity-50 cursor-not-allowed',
      
      className
    );

    React.useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={checkboxClasses}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {(label || description) && (
            <div className="flex flex-col gap-1">
              {label && (
                <label
                  htmlFor={inputId}
                  className={cn(
                    'font-semibold text-text-primary cursor-pointer select-none',
                    disabled && 'opacity-50 cursor-not-allowed',
                    size === 'sm' && 'text-sm',
                    size === 'md' && 'text-base',
                    size === 'lg' && 'text-lg'
                  )}
                >
                  {label}
                </label>
              )}

              {description && (
                <p
                  className={cn(
                    'text-text-muted',
                    disabled && 'opacity-50',
                    size === 'sm' && 'text-xs',
                    size === 'md' && 'text-sm',
                    size === 'lg' && 'text-base'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm font-medium text-red-500 ml-8"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
