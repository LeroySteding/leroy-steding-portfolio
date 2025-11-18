"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ToastProps {
  /**
   * Toast ID (auto-generated)
   */
  id: string;
  /**
   * Toast title
   */
  title: string;
  /**
   * Toast description
   */
  description?: string;
  /**
   * Toast variant
   */
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  /**
   * Duration in milliseconds (0 = no auto-dismiss)
   */
  duration?: number;
  /**
   * Custom icon
   */
  icon?: React.ReactNode;
  /**
   * Action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  /**
   * On close callback
   */
  onClose?: () => void;
}

const variantStyles = {
  default: {
    bg: 'bg-surface border-surface-light',
    icon: '📋',
  },
  success: {
    bg: 'bg-green-500/10 border-green-500/30',
    icon: '✅',
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: '❌',
  },
  warning: {
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: 'ℹ️',
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  icon,
  action,
  onClose,
}) => {
  const style = variantStyles[variant];

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border-2',
        'shadow-lg backdrop-blur-sm',
        'max-w-md w-full',
        style.bg
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-2xl">
        {icon || style.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-text-primary mb-1">
          {title}
        </div>
        {description && (
          <div className="text-sm text-text-secondary">
            {description}
          </div>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-semibold text-accent-primary hover:text-accent-hover transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors p-1"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

Toast.displayName = 'Toast';

// ToastContainer component
export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
}) => {
  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-3',
        positionClasses[position]
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

ToastContainer.displayName = 'ToastContainer';

// Toast hook
let toastCount = 0;
const listeners: Array<(toast: ToastProps) => void> = [];

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  React.useEffect(() => {
    const addToast = (toast: ToastProps) => {
      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
      }
    };

    listeners.push(addToast);

    return () => {
      const index = listeners.indexOf(addToast);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = (props: Omit<ToastProps, 'id'>) => {
    const id = `toast-${++toastCount}`;
    const toastProps: ToastProps = {
      id,
      duration: 5000,
      ...props,
      onClose: () => {
        removeToast(id);
        props.onClose?.();
      },
    };

    listeners.forEach((listener) => listener(toastProps));
  };

  return {
    toasts,
    toast,
    success: (title: string, description?: string) =>
      toast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) =>
      toast({ title, description, variant: 'error' }),
    warning: (title: string, description?: string) =>
      toast({ title, description, variant: 'warning' }),
    info: (title: string, description?: string) =>
      toast({ title, description, variant: 'info' }),
  };
};
