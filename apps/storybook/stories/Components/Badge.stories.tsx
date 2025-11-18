import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@steding/ui';

/**
 * Badge component with Navy & Beige theme
 * 
 * Small status indicators and labels for highlighting information.
 * Supports multiple variants, sizes, and styles.
 */
const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    style: {
      control: 'select',
      options: ['filled', 'outlined', 'subtle'],
      description: 'Visual style',
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'full'],
      description: 'Border radius',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary badge - Default style
 * 
 * Uses accent-primary color (#e8d5c4).
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Primary',
  },
};

/**
 * Secondary badge - Alternate color
 * 
 * Uses accent-secondary color (#d4a574).
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Secondary',
  },
};

/**
 * Success badge - Positive status
 * 
 * Green color for success states.
 */
export const Success: Story = {
  args: {
    variant: 'success',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Success',
  },
};

/**
 * Warning badge - Caution status
 * 
 * Orange color for warning states.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Warning',
  },
};

/**
 * Error badge - Negative status
 * 
 * Red color for error states.
 */
export const Error: Story = {
  args: {
    variant: 'error',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Error',
  },
};

/**
 * Info badge - Informational
 * 
 * Blue color for informational states.
 */
export const Info: Story = {
  args: {
    variant: 'info',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Info',
  },
};

/**
 * Small size - Compact badge
 * 
 * 0.25rem padding, 0.75rem font size.
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    style: 'filled',
    rounded: 'md',
    children: 'Small',
  },
};

/**
 * Medium size - Default badge
 * 
 * 0.5rem padding, 0.875rem font size.
 */
export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Medium',
  },
};

/**
 * Large size - Prominent badge
 * 
 * 0.75rem padding, 1rem font size.
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    style: 'filled',
    rounded: 'md',
    children: 'Large',
  },
};

/**
 * Filled style - Solid background
 * 
 * Full color fill.
 */
export const Filled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Filled',
  },
};

/**
 * Outlined style - Border only
 * 
 * Transparent background with colored border.
 */
export const Outlined: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'outlined',
    rounded: 'md',
    children: 'Outlined',
  },
};

/**
 * Subtle style - Tinted background
 * 
 * Light background with colored text.
 */
export const Subtle: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'subtle',
    rounded: 'md',
    children: 'Subtle',
  },
};

/**
 * Rounded small - Sharp corners
 * 
 * 0.25rem border radius.
 */
export const RoundedSmall: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'filled',
    rounded: 'sm',
    children: 'Rounded SM',
  },
};

/**
 * Rounded medium - Soft corners
 * 
 * 0.5rem border radius.
 */
export const RoundedMedium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'filled',
    rounded: 'md',
    children: 'Rounded MD',
  },
};

/**
 * Rounded full - Pill shape
 * 
 * 9999px border radius for perfect pill.
 */
export const RoundedFull: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'filled',
    rounded: 'full',
    children: 'Rounded Full',
  },
};

/**
 * Clickable badge - Interactive
 * 
 * Badge with onClick handler.
 */
export const Clickable: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    style: 'filled',
    rounded: 'full',
    children: 'Click Me',
    onClick: () => alert('Badge clicked!'),
  },
};

/**
 * With icon - Badge with emoji
 * 
 * Demonstrates content flexibility.
 */
export const WithIcon: Story = {
  args: {
    variant: 'success',
    size: 'md',
    style: 'filled',
    rounded: 'full',
    children: (
      <>
        <span style={{ marginRight: '0.25rem' }}>✓</span>
        Verified
      </>
    ),
  },
};

/**
 * Count badge - Numerical indicator
 * 
 * Useful for notification counts.
 */
export const Count: Story = {
  args: {
    variant: 'error',
    size: 'sm',
    style: 'filled',
    rounded: 'full',
    children: '99+',
  },
};

/**
 * All variants comparison - Filled
 * 
 * Shows all color variants in filled style.
 */
export const AllVariantsFilled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary" style="filled">Primary</Badge>
      <Badge variant="secondary" style="filled">Secondary</Badge>
      <Badge variant="success" style="filled">Success</Badge>
      <Badge variant="warning" style="filled">Warning</Badge>
      <Badge variant="error" style="filled">Error</Badge>
      <Badge variant="info" style="filled">Info</Badge>
    </div>
  ),
};

/**
 * All variants comparison - Outlined
 * 
 * Shows all color variants in outlined style.
 */
export const AllVariantsOutlined: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary" style="outlined">Primary</Badge>
      <Badge variant="secondary" style="outlined">Secondary</Badge>
      <Badge variant="success" style="outlined">Success</Badge>
      <Badge variant="warning" style="outlined">Warning</Badge>
      <Badge variant="error" style="outlined">Error</Badge>
      <Badge variant="info" style="outlined">Info</Badge>
    </div>
  ),
};

/**
 * All variants comparison - Subtle
 * 
 * Shows all color variants in subtle style.
 */
export const AllVariantsSubtle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary" style="subtle">Primary</Badge>
      <Badge variant="secondary" style="subtle">Secondary</Badge>
      <Badge variant="success" style="subtle">Success</Badge>
      <Badge variant="warning" style="subtle">Warning</Badge>
      <Badge variant="error" style="subtle">Error</Badge>
      <Badge variant="info" style="subtle">Info</Badge>
    </div>
  ),
};

/**
 * All sizes comparison
 * 
 * Shows all badge sizes side-by-side.
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

/**
 * Style matrix - All combinations
 * 
 * Grid showing all style and variant combinations.
 */
export const StyleMatrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>Filled</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <Badge variant="primary" style="filled">Primary</Badge>
          <Badge variant="success" style="filled">Success</Badge>
          <Badge variant="warning" style="filled">Warning</Badge>
          <Badge variant="error" style="filled">Error</Badge>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>Outlined</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <Badge variant="primary" style="outlined">Primary</Badge>
          <Badge variant="success" style="outlined">Success</Badge>
          <Badge variant="warning" style="outlined">Warning</Badge>
          <Badge variant="error" style="outlined">Error</Badge>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>Subtle</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <Badge variant="primary" style="subtle">Primary</Badge>
          <Badge variant="success" style="subtle">Success</Badge>
          <Badge variant="warning" style="subtle">Warning</Badge>
          <Badge variant="error" style="subtle">Error</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
