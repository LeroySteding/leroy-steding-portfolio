"use client";

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Label text for the radio button
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
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const radioClasses = cn(
      // Base styles
      'rounded-full border-2 transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:ring-offset-2',
      'cursor-pointer',
      
      // Size
      sizeClasses[size],
      
      // States
      'border-surface hover:border-accent-primary',
      'checked:bg-accent-primary checked:border-accent-primary',
      error && 'border-red-500 checked:bg-red-500 checked:border-red-500',
      disabled && 'opacity-50 cursor-not-allowed',
      
      className
    );

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            className={radioClasses}
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

Radio.displayName = 'Radio';

// RadioGroup component for managing multiple radio buttons
export interface RadioGroupProps {
  /**
   * Label for the radio group
   */
  label?: string;
  /**
   * Name for the radio group (required)
   */
  name: string;
  /**
   * Options array
   */
  options: RadioOption[];
  /**
   * Currently selected value
   */
  value?: string;
  /**
   * Change handler
   */
  onChange?: (value: string) => void;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Orientation
   */
  orientation?: 'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  size = 'md',
  orientation = 'vertical',
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <legend className="text-sm font-semibold text-text-secondary">
          {label}
        </legend>
      )}

      <div
        role="radiogroup"
        aria-labelledby={label ? groupId : undefined}
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            checked={value === option.value}
            onChange={(e) => {
              if (onChange && e.target.checked) {
                onChange(option.value);
              }
            }}
            size={size}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';
