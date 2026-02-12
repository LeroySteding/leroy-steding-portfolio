/**
 * Shared utility functions for Steding projects
 */
/**
 * Combines CSS class names, filtering out falsy values
 */
declare function cn(...classes: (string | undefined | null | false)[]): string;
/**
 * Format a date to a localized string
 */
declare function formatDate(date: Date | string, locale?: string): string;
/**
 * Delay execution for a specified number of milliseconds
 */
declare function delay(ms: number): Promise<void>;
/**
 * Truncate a string to a specified length
 */
declare function truncate(str: string, length: number, suffix?: string): string;

export { cn, delay, formatDate, truncate };
