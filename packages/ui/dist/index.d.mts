import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';
import { ClassValue } from 'clsx';

interface ButtonProps {
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
    children: React$1.ReactNode;
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
declare const Button: ({ variant, size, children, onClick, disabled, fullWidth, className, type, }: ButtonProps) => react_jsx_runtime.JSX.Element;

interface CardProps {
    /**
     * Card content
     */
    children: React$1.ReactNode;
    /**
     * Card variant
     */
    variant?: 'default' | 'elevated' | 'outlined' | 'flat';
    /**
     * Padding size
     */
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Hover effect
     */
    hoverable?: boolean;
    /**
     * Click handler
     */
    onClick?: () => void;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Full width card
     */
    fullWidth?: boolean;
}
/**
 * Card component with Navy & Beige theme
 *
 * Matches portfolio `.card` pattern with clean design.
 * Supports hover effects and multiple variants.
 */
declare const Card: ({ children, variant, padding, hoverable, onClick, className, fullWidth, }: CardProps) => react_jsx_runtime.JSX.Element;

interface BadgeProps {
    /**
     * Badge content
     */
    children: React$1.ReactNode;
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
declare const Badge: ({ children, variant, size, style, rounded, className, onClick, }: BadgeProps) => react_jsx_runtime.JSX.Element;

interface CardContainerProps {
    children?: React$1.ReactNode;
    className?: string;
    containerClassName?: string;
}
declare const CardContainer: React$1.FC<CardContainerProps>;
interface CardBodyProps {
    children: React$1.ReactNode;
    className?: string;
}
declare const CardBody: React$1.FC<CardBodyProps>;
interface CardItemProps {
    as?: React$1.ElementType;
    children: React$1.ReactNode;
    className?: string;
    translateX?: number | string;
    translateY?: number | string;
    translateZ?: number | string;
    rotateX?: number | string;
    rotateY?: number | string;
    rotateZ?: number | string;
    [key: string]: any;
}
declare const CardItem: React$1.FC<CardItemProps>;
declare const useMouseEnter: () => [boolean, React$1.Dispatch<React$1.SetStateAction<boolean>>];

interface LayoutTextFlipProps {
    text: string;
    words: string[];
    duration?: number;
    className?: string;
}
declare const LayoutTextFlip: React.FC<LayoutTextFlipProps>;

interface InputProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /**
     * Label text for the input
     */
    label?: string;
    /**
     * Error message to display
     */
    error?: string;
    /**
     * Helper text to display below the input
     */
    helperText?: string;
    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Visual variant
     */
    variant?: 'default' | 'filled' | 'outlined';
    /**
     * Icon to display on the left
     */
    leftIcon?: React$1.ReactNode;
    /**
     * Icon to display on the right
     */
    rightIcon?: React$1.ReactNode;
    /**
     * Full width
     */
    fullWidth?: boolean;
}
declare const Input: React$1.ForwardRefExoticComponent<InputProps & React$1.RefAttributes<HTMLInputElement>>;

interface TextAreaProps extends React$1.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
declare const TextArea: React$1.ForwardRefExoticComponent<TextAreaProps & React$1.RefAttributes<HTMLTextAreaElement>>;

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface SelectProps extends Omit<React$1.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    /**
     * Label text for the select
     */
    label?: string;
    /**
     * Error message to display
     */
    error?: string;
    /**
     * Helper text to display below the select
     */
    helperText?: string;
    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Visual variant
     */
    variant?: 'default' | 'filled' | 'outlined';
    /**
     * Options array
     */
    options: SelectOption[];
    /**
     * Placeholder text
     */
    placeholder?: string;
    /**
     * Full width
     */
    fullWidth?: boolean;
}
declare const Select: React$1.ForwardRefExoticComponent<SelectProps & React$1.RefAttributes<HTMLSelectElement>>;

interface CheckboxProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
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
declare const Checkbox: React$1.ForwardRefExoticComponent<CheckboxProps & React$1.RefAttributes<HTMLInputElement>>;

interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
interface RadioProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
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
declare const Radio: React$1.ForwardRefExoticComponent<RadioProps & React$1.RefAttributes<HTMLInputElement>>;
interface RadioGroupProps {
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
declare const RadioGroup: React$1.FC<RadioGroupProps>;

interface ToastProps {
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
    icon?: React$1.ReactNode;
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
declare const Toast: React$1.FC<ToastProps>;
interface ToastContainerProps {
    toasts: ToastProps[];
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
declare const ToastContainer: React$1.FC<ToastContainerProps>;
declare const useToast: () => {
    toasts: ToastProps[];
    toast: (props: Omit<ToastProps, "id">) => void;
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
};

interface SpinnerProps {
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
declare const Spinner: React$1.FC<SpinnerProps>;
interface LoadingOverlayProps {
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
declare const LoadingOverlay: React$1.FC<LoadingOverlayProps>;
interface SkeletonProps {
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
declare const Skeleton: React$1.FC<SkeletonProps>;

interface ProgressProps {
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
declare const Progress: React$1.FC<ProgressProps>;
interface CircularProgressProps {
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
declare const CircularProgress: React$1.FC<CircularProgressProps>;

interface TabItem {
    value: string;
    label: string;
    icon?: React$1.ReactNode;
    disabled?: boolean;
    content: React$1.ReactNode;
}
interface TabsProps {
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
declare const Tabs: React$1.FC<TabsProps>;

/**
 * Design Tokens - Colors
 * Extracted from portfolio app globals.css
 * Navy & Beige palette inspired by Magram
 */
declare const colors: {
    readonly dark: {
        readonly primary: {
            readonly bg: "#0f1419";
            readonly DEFAULT: "#0f1419";
        };
        readonly secondary: {
            readonly bg: "#1a2332";
            readonly DEFAULT: "#1a2332";
        };
        readonly tertiary: {
            readonly bg: "#242d3d";
            readonly DEFAULT: "#242d3d";
        };
        readonly surface: {
            readonly DEFAULT: "#2a3444";
            readonly light: "#354150";
        };
        readonly accent: {
            readonly primary: "#e8d5c4";
            readonly secondary: "#d4a574";
            readonly hover: "#f0e0d0";
            readonly DEFAULT: "#e8d5c4";
        };
        readonly text: {
            readonly primary: "#f5f5f5";
            readonly secondary: "#b8b8b8";
            readonly muted: "#808080";
            readonly DEFAULT: "#f5f5f5";
        };
        readonly mint: {
            readonly DEFAULT: "#a0d9b4";
            readonly dark: "#7ec99a";
        };
        readonly border: {
            readonly DEFAULT: "#2a3444";
            readonly light: "#354150";
        };
    };
    readonly light: {
        readonly primary: {
            readonly bg: "#ffffff";
            readonly DEFAULT: "#ffffff";
        };
        readonly secondary: {
            readonly bg: "#fafafa";
            readonly DEFAULT: "#fafafa";
        };
        readonly tertiary: {
            readonly bg: "#f5f5f5";
            readonly DEFAULT: "#f5f5f5";
        };
        readonly surface: {
            readonly DEFAULT: "#eeeeee";
            readonly light: "#e0e0e0";
        };
        readonly accent: {
            readonly primary: "#c4a574";
            readonly secondary: "#a08555";
            readonly hover: "#d4b584";
            readonly DEFAULT: "#c4a574";
        };
        readonly text: {
            readonly primary: "#0a0a0a";
            readonly secondary: "#525252";
            readonly muted: "#737373";
            readonly DEFAULT: "#0a0a0a";
        };
        readonly mint: {
            readonly DEFAULT: "#059669";
            readonly dark: "#047857";
        };
        readonly border: {
            readonly DEFAULT: "#e0e0e0";
            readonly light: "#eeeeee";
        };
    };
};
declare const semanticColors: {
    readonly background: {
        readonly primary: "var(--color-primary-bg)";
        readonly secondary: "var(--color-secondary-bg)";
        readonly tertiary: "var(--color-tertiary-bg)";
        readonly surface: "var(--color-surface)";
        readonly surfaceLight: "var(--color-surface-light)";
    };
    readonly text: {
        readonly primary: "var(--color-text-primary)";
        readonly secondary: "var(--color-text-secondary)";
        readonly muted: "var(--color-text-muted)";
    };
    readonly accent: {
        readonly primary: "var(--color-accent-primary)";
        readonly secondary: "var(--color-accent-secondary)";
        readonly hover: "var(--color-accent-hover)";
    };
    readonly mint: {
        readonly DEFAULT: "var(--color-mint)";
        readonly dark: "var(--color-mint-dark)";
    };
};
declare const cssVariables: {
    readonly 'primary-bg': "#0f1419";
    readonly 'secondary-bg': "#1a2332";
    readonly 'tertiary-bg': "#242d3d";
    readonly surface: "#2a3444";
    readonly 'surface-light': "#354150";
    readonly 'accent-primary': "#e8d5c4";
    readonly 'accent-secondary': "#d4a574";
    readonly 'accent-hover': "#f0e0d0";
    readonly 'text-primary': "#f5f5f5";
    readonly 'text-secondary': "#b8b8b8";
    readonly 'text-muted': "#808080";
    readonly mint: "#a0d9b4";
    readonly 'mint-dark': "#7ec99a";
};
type ThemeMode = 'light' | 'dark';
type ColorToken = keyof typeof cssVariables;

/**
 * Design Tokens - Spacing
 * Extracted from portfolio app globals.css
 */
declare const spacing: {
    readonly section: {
        readonly DEFAULT: "10rem";
        readonly sm: "6rem";
        readonly xs: "4rem";
    };
    readonly container: {
        readonly DEFAULT: "5rem";
        readonly sm: "3rem";
        readonly xs: "2rem";
    };
    readonly component: {
        readonly xl: "3rem";
        readonly lg: "2rem";
        readonly md: "1.5rem";
        readonly DEFAULT: "1rem";
        readonly sm: "0.75rem";
        readonly xs: "0.5rem";
        readonly xxs: "0.25rem";
    };
};
declare const borderRadius: {
    readonly sm: "0.25rem";
    readonly md: "0.5rem";
    readonly DEFAULT: "0.5rem";
    readonly lg: "0.75rem";
    readonly xl: "1rem";
    readonly '2xl': "1.5rem";
    readonly full: "9999px";
};
declare const spacingVariables: {
    readonly 'spacing-section': "10rem";
    readonly 'spacing-section-sm': "6rem";
    readonly 'spacing-container': "5rem";
    readonly 'radius-sm': "0.25rem";
    readonly 'radius-md': "0.5rem";
    readonly 'radius-lg': "0.75rem";
    readonly 'radius-xl': "1rem";
};
type SpacingToken = keyof typeof spacing;
type RadiusToken = keyof typeof borderRadius;

/**
 * Design Tokens - Typography
 * Extracted from portfolio app globals.css
 */
declare const fontFamily: {
    readonly sans: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    readonly display: "var(--font-space-grotesk), system-ui, sans-serif";
    readonly mono: "\"SF Mono\", Monaco, \"Cascadia Code\", \"Roboto Mono\", Consolas, monospace";
};
declare const fontSize: {
    readonly xs: "0.75rem";
    readonly sm: "0.875rem";
    readonly base: "1rem";
    readonly lg: "1.125rem";
    readonly xl: "1.25rem";
    readonly '2xl': "1.5rem";
    readonly '3xl': "1.875rem";
    readonly '4xl': "2.25rem";
    readonly '5xl': "3rem";
    readonly '6xl': "3.75rem";
    readonly '7xl': "4.5rem";
    readonly '8xl': "6rem";
    readonly '9xl': "8rem";
};
declare const fontWeight: {
    readonly normal: 400;
    readonly medium: 500;
    readonly semibold: 600;
    readonly bold: 700;
    readonly extrabold: 800;
};
declare const lineHeight: {
    readonly none: 1;
    readonly tight: 1.1;
    readonly snug: 1.25;
    readonly normal: 1.5;
    readonly relaxed: 1.7;
    readonly loose: 1.75;
    readonly extra: 2;
};
declare const letterSpacing: {
    readonly tighter: "-0.05em";
    readonly tight: "-0.02em";
    readonly normal: "0";
    readonly wide: "0.025em";
    readonly wider: "0.05em";
    readonly widest: "0.1em";
};
declare const headingScale: {
    readonly h1: {
        readonly fontSize: "4.5rem";
        readonly fontWeight: 800;
        readonly lineHeight: 1.1;
        readonly letterSpacing: "-0.02em";
        readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
    };
    readonly h2: {
        readonly fontSize: "3rem";
        readonly fontWeight: 800;
        readonly lineHeight: 1.1;
        readonly letterSpacing: "-0.02em";
        readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
    };
    readonly h3: {
        readonly fontSize: "2.25rem";
        readonly fontWeight: 700;
        readonly lineHeight: 1.1;
        readonly letterSpacing: "-0.02em";
        readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
    };
    readonly h4: {
        readonly fontSize: "1.875rem";
        readonly fontWeight: 700;
        readonly lineHeight: 1.1;
        readonly letterSpacing: "-0.02em";
        readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
    };
    readonly h5: {
        readonly fontSize: "1.5rem";
        readonly fontWeight: 600;
        readonly lineHeight: 1.1;
        readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
    };
    readonly h6: {
        readonly fontSize: "1.25rem";
        readonly fontWeight: 600;
        readonly lineHeight: 1.1;
        readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
    };
};
declare const bodyScale: {
    readonly large: {
        readonly fontSize: "1.125rem";
        readonly lineHeight: 1.7;
        readonly fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    };
    readonly base: {
        readonly fontSize: "1rem";
        readonly lineHeight: 1.5;
        readonly fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    };
    readonly small: {
        readonly fontSize: "0.875rem";
        readonly lineHeight: 1.5;
        readonly fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    };
};
type FontSize = keyof typeof fontSize;
type FontWeight = keyof typeof fontWeight;
type LineHeight = keyof typeof lineHeight;
declare const typography: {
    readonly fontFamily: {
        readonly sans: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
        readonly display: "var(--font-space-grotesk), system-ui, sans-serif";
        readonly mono: "\"SF Mono\", Monaco, \"Cascadia Code\", \"Roboto Mono\", Consolas, monospace";
    };
    readonly fontSize: {
        readonly xs: "0.75rem";
        readonly sm: "0.875rem";
        readonly base: "1rem";
        readonly lg: "1.125rem";
        readonly xl: "1.25rem";
        readonly '2xl': "1.5rem";
        readonly '3xl': "1.875rem";
        readonly '4xl': "2.25rem";
        readonly '5xl': "3rem";
        readonly '6xl': "3.75rem";
        readonly '7xl': "4.5rem";
        readonly '8xl': "6rem";
        readonly '9xl': "8rem";
    };
    readonly fontWeight: {
        readonly normal: 400;
        readonly medium: 500;
        readonly semibold: 600;
        readonly bold: 700;
        readonly extrabold: 800;
    };
    readonly lineHeight: {
        readonly none: 1;
        readonly tight: 1.1;
        readonly snug: 1.25;
        readonly normal: 1.5;
        readonly relaxed: 1.7;
        readonly loose: 1.75;
        readonly extra: 2;
    };
    readonly letterSpacing: {
        readonly tighter: "-0.05em";
        readonly tight: "-0.02em";
        readonly normal: "0";
        readonly wide: "0.025em";
        readonly wider: "0.05em";
        readonly widest: "0.1em";
    };
    readonly headingScale: {
        readonly h1: {
            readonly fontSize: "4.5rem";
            readonly fontWeight: 800;
            readonly lineHeight: 1.1;
            readonly letterSpacing: "-0.02em";
            readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
        };
        readonly h2: {
            readonly fontSize: "3rem";
            readonly fontWeight: 800;
            readonly lineHeight: 1.1;
            readonly letterSpacing: "-0.02em";
            readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
        };
        readonly h3: {
            readonly fontSize: "2.25rem";
            readonly fontWeight: 700;
            readonly lineHeight: 1.1;
            readonly letterSpacing: "-0.02em";
            readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
        };
        readonly h4: {
            readonly fontSize: "1.875rem";
            readonly fontWeight: 700;
            readonly lineHeight: 1.1;
            readonly letterSpacing: "-0.02em";
            readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
        };
        readonly h5: {
            readonly fontSize: "1.5rem";
            readonly fontWeight: 600;
            readonly lineHeight: 1.1;
            readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
        };
        readonly h6: {
            readonly fontSize: "1.25rem";
            readonly fontWeight: 600;
            readonly lineHeight: 1.1;
            readonly fontFamily: "var(--font-space-grotesk), system-ui, sans-serif";
        };
    };
    readonly bodyScale: {
        readonly large: {
            readonly fontSize: "1.125rem";
            readonly lineHeight: 1.7;
            readonly fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
        };
        readonly base: {
            readonly fontSize: "1rem";
            readonly lineHeight: 1.5;
            readonly fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
        };
        readonly small: {
            readonly fontSize: "0.875rem";
            readonly lineHeight: 1.5;
            readonly fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
        };
    };
};

/**
 * Design Tokens - Effects
 * Box shadows and elevation system
 */
declare const boxShadow: {
    readonly none: "none";
    readonly sm: "0 1px 3px rgba(0, 0, 0, 0.3)";
    readonly DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.3)";
    readonly md: "0 4px 12px rgba(0, 0, 0, 0.3)";
    readonly lg: "0 8px 24px rgba(0, 0, 0, 0.4)";
    readonly xl: "0 12px 32px rgba(0, 0, 0, 0.5)";
    readonly '2xl': "0 20px 48px rgba(0, 0, 0, 0.6)";
    readonly inner: "inset 0 2px 4px rgba(0, 0, 0, 0.3)";
};
declare const elevation: {
    readonly 0: "none";
    readonly 1: "0 1px 3px rgba(0, 0, 0, 0.3)";
    readonly 2: "0 4px 12px rgba(0, 0, 0, 0.3)";
    readonly 3: "0 8px 24px rgba(0, 0, 0, 0.4)";
    readonly 4: "0 12px 32px rgba(0, 0, 0, 0.5)";
    readonly 5: "0 20px 48px rgba(0, 0, 0, 0.6)";
};
declare const boxShadowLight: {
    readonly none: "none";
    readonly sm: "0 1px 3px rgba(0, 0, 0, 0.1)";
    readonly DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.08)";
    readonly md: "0 4px 12px rgba(0, 0, 0, 0.08)";
    readonly lg: "0 8px 24px rgba(0, 0, 0, 0.12)";
    readonly xl: "0 12px 32px rgba(0, 0, 0, 0.15)";
    readonly '2xl': "0 20px 48px rgba(0, 0, 0, 0.18)";
    readonly inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)";
};
declare const elevationLight: {
    readonly 0: "none";
    readonly 1: "0 1px 3px rgba(0, 0, 0, 0.1)";
    readonly 2: "0 4px 12px rgba(0, 0, 0, 0.08)";
    readonly 3: "0 8px 24px rgba(0, 0, 0, 0.12)";
    readonly 4: "0 12px 32px rgba(0, 0, 0, 0.15)";
    readonly 5: "0 20px 48px rgba(0, 0, 0, 0.18)";
};
declare const animationDuration: {
    readonly instant: "0ms";
    readonly quick: "150ms";
    readonly normal: "300ms";
    readonly slow: "500ms";
    readonly slower: "700ms";
};
declare const animationEasing: {
    readonly linear: "linear";
    readonly ease: "ease";
    readonly easeIn: "ease-in";
    readonly easeOut: "ease-out";
    readonly easeInOut: "ease-in-out";
};
type BoxShadow = keyof typeof boxShadow;
type Elevation = keyof typeof elevation;
type AnimationDuration = keyof typeof animationDuration;
type AnimationEasing = keyof typeof animationEasing;
declare const effects: {
    readonly boxShadow: {
        readonly none: "none";
        readonly sm: "0 1px 3px rgba(0, 0, 0, 0.3)";
        readonly DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.3)";
        readonly md: "0 4px 12px rgba(0, 0, 0, 0.3)";
        readonly lg: "0 8px 24px rgba(0, 0, 0, 0.4)";
        readonly xl: "0 12px 32px rgba(0, 0, 0, 0.5)";
        readonly '2xl': "0 20px 48px rgba(0, 0, 0, 0.6)";
        readonly inner: "inset 0 2px 4px rgba(0, 0, 0, 0.3)";
    };
    readonly boxShadowLight: {
        readonly none: "none";
        readonly sm: "0 1px 3px rgba(0, 0, 0, 0.1)";
        readonly DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.08)";
        readonly md: "0 4px 12px rgba(0, 0, 0, 0.08)";
        readonly lg: "0 8px 24px rgba(0, 0, 0, 0.12)";
        readonly xl: "0 12px 32px rgba(0, 0, 0, 0.15)";
        readonly '2xl': "0 20px 48px rgba(0, 0, 0, 0.18)";
        readonly inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)";
    };
    readonly elevation: {
        readonly 0: "none";
        readonly 1: "0 1px 3px rgba(0, 0, 0, 0.3)";
        readonly 2: "0 4px 12px rgba(0, 0, 0, 0.3)";
        readonly 3: "0 8px 24px rgba(0, 0, 0, 0.4)";
        readonly 4: "0 12px 32px rgba(0, 0, 0, 0.5)";
        readonly 5: "0 20px 48px rgba(0, 0, 0, 0.6)";
    };
    readonly elevationLight: {
        readonly 0: "none";
        readonly 1: "0 1px 3px rgba(0, 0, 0, 0.1)";
        readonly 2: "0 4px 12px rgba(0, 0, 0, 0.08)";
        readonly 3: "0 8px 24px rgba(0, 0, 0, 0.12)";
        readonly 4: "0 12px 32px rgba(0, 0, 0, 0.15)";
        readonly 5: "0 20px 48px rgba(0, 0, 0, 0.18)";
    };
    readonly animationDuration: {
        readonly instant: "0ms";
        readonly quick: "150ms";
        readonly normal: "300ms";
        readonly slow: "500ms";
        readonly slower: "700ms";
    };
    readonly animationEasing: {
        readonly linear: "linear";
        readonly ease: "ease";
        readonly easeIn: "ease-in";
        readonly easeOut: "ease-out";
        readonly easeInOut: "ease-in-out";
    };
};

declare function cn(...inputs: ClassValue[]): string;

export { type AnimationDuration, type AnimationEasing, Badge, type BadgeProps, type BoxShadow, Button, type ButtonProps, Card, CardBody, type CardBodyProps, CardContainer, type CardContainerProps, CardItem, type CardItemProps, type CardProps, Checkbox, type CheckboxProps, CircularProgress, type CircularProgressProps, type ColorToken, type Elevation, type FontSize, type FontWeight, Input, type InputProps, LayoutTextFlip, type LayoutTextFlipProps, type LineHeight, LoadingOverlay, type LoadingOverlayProps, Progress, type ProgressProps, Radio, RadioGroup, type RadioGroupProps, type RadioOption, type RadioProps, type RadiusToken, Select, type SelectOption, type SelectProps, Skeleton, type SkeletonProps, type SpacingToken, Spinner, type SpinnerProps, type TabItem, Tabs, type TabsProps, TextArea, type TextAreaProps, type ThemeMode, Toast, ToastContainer, type ToastContainerProps, type ToastProps, animationDuration, animationEasing, bodyScale, borderRadius, boxShadow, boxShadowLight, cn, colors, cssVariables, effects, elevation, elevationLight, fontFamily, fontSize, fontWeight, headingScale, letterSpacing, lineHeight, semanticColors, spacing, spacingVariables, typography, useMouseEnter, useToast };
