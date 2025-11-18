"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
}

export interface TabsProps {
  /**
   * Array of tab items
   */
  items: TabItem[];
  /**
   * Default active tab value
   */
  defaultValue?: string;
  /**
   * Controlled active tab value
   */
  value?: string;
  /**
   * Change handler for controlled mode
   */
  onChange?: (value: string) => void;
  /**
   * Variant style
   */
  variant?: 'default' | 'pills' | 'underline';
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Full width tabs
   */
  fullWidth?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value: controlledValue,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(
    defaultValue || items[0]?.value || ''
  );

  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleTabClick = (value: string) => {
    if (controlledValue === undefined) {
      setInternalValue(value);
    }
    onChange?.(value);
  };

  const activeTab = items.find((item) => item.value === activeValue);

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3',
  };

  const variantStyles = {
    default: {
      list: 'bg-surface p-1 rounded-lg',
      tab: 'rounded-md transition-all duration-200',
      activeTab: 'bg-accent-primary text-primary-bg',
      inactiveTab: 'text-text-secondary hover:text-text-primary hover:bg-surface-light',
    },
    pills: {
      list: 'gap-2',
      tab: 'rounded-full border-2 border-surface transition-all duration-200',
      activeTab: 'border-accent-primary bg-accent-primary text-primary-bg',
      inactiveTab: 'text-text-secondary hover:text-text-primary hover:border-accent-primary/50',
    },
    underline: {
      list: 'border-b-2 border-surface gap-4',
      tab: 'relative pb-2 transition-all duration-200',
      activeTab: 'text-accent-primary',
      inactiveTab: 'text-text-secondary hover:text-text-primary',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}
      <div
        className={cn(
          'flex',
          style.list,
          fullWidth && 'w-full'
        )}
        role="tablist"
      >
        {items.map((item) => {
          const isActive = item.value === activeValue;

          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${item.value}`}
              id={`tab-${item.value}`}
              disabled={item.disabled}
              onClick={() => handleTabClick(item.value)}
              className={cn(
                'relative font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent-primary/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeClasses[size],
                style.tab,
                isActive ? style.activeTab : style.inactiveTab,
                fullWidth && 'flex-1'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {item.icon}
                {item.label}
              </span>

              {/* Underline indicator */}
              {variant === 'underline' && isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {items.map((item) => (
          <div
            key={item.value}
            id={`tabpanel-${item.value}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.value}`}
            hidden={item.value !== activeValue}
          >
            {item.value === activeValue && item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
