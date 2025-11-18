"use client";

import React, { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea
   */
  label?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Helper text to display below the textarea
   */
  helperText?: string;
  /**
   * Visual variant
   */
  variant?: 'default' | 'filled' | 'outlined';
  /**
   * Show character count
   */
  showCount?: boolean;
  /**
   * Full width
   */
  fullWidth?: boolean;
  /**
   * Resize behavior
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      showCount = false,
      fullWidth = false,
      resize = 'vertical',
      className,
      disabled,
      required,
      id,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    const currentLength = typeof value === 'string' ? value.length : 0;

    const variantClasses = {
      default: 'bg-transparent border-2 border-surface focus:border-accent-primary',
      filled: 'bg-surface border-2 border-surface focus:border-accent-primary',
      outlined: 'bg-transparent border-2 border-text-muted focus:border-accent-primary',
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const textareaClasses = cn(
      // Base styles
      'w-full rounded-lg px-4 py-3 text-base font-medium transition-all duration-200',
      'text-text-primary placeholder:text-text-muted',
      'focus:outline-none focus:ring-2 focus:ring-accent-primary/20',
      'min-h-[100px]',
      
      // Variant
      variantClasses[variant],
      
      // Resize
      resizeClasses[resize],
      
      // States
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      disabled && 'opacity-50 cursor-not-allowed bg-surface-light',
      
      className
    );

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-semibold text-text-secondary"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {showCount && maxLength && (
            <span className="text-xs text-text-muted font-medium">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={inputId}
          className={textareaClasses}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm font-medium text-red-500"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-text-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
