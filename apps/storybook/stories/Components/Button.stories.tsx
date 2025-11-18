import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@steding/ui';

/**
 * Button component with Navy & Beige theme
 * 
 * Matches portfolio `.btn-primary` and `.btn-secondary` patterns.
 * Supports multiple variants, sizes, and states.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button - Main call-to-action
 * 
 * Uses accent-primary color (#e8d5c4) with navy background.
 * Scales on hover with color change to accent-hover.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Primary Button',
  },
};

/**
 * Secondary button - Outlined style
 * 
 * Transparent background with accent-primary border.
 * Fills with accent-primary on hover.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Secondary Button',
  },
};

/**
 * Outline button - Subtle border variant
 * 
 * Uses surface-light border color.
 * Fills with surface color on hover.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    children: 'Outline Button',
  },
};

/**
 * Ghost button - Minimal style
 * 
 * No border, just text color.
 * Subtle background on hover.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'Ghost Button',
  },
};

/**
 * Small size - Compact button
 * 
 * 0.75rem padding, 1rem font size.
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Medium size - Default button
 * 
 * 1rem padding, 1.125rem font size.
 */
export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Button',
  },
};

/**
 * Large size - Prominent button
 * 
 * 2rem padding, 1.25rem font size.
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Disabled state - Non-interactive
 * 
 * 50% opacity, no hover effects.
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Full width - Spans container
 * 
 * Useful for mobile layouts and forms.
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * With icon - Button with emoji
 * 
 * Demonstrates content flexibility.
 */
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: (
      <>
        <span style={{ marginRight: '0.5rem' }}>📧</span>
        Contact Me
      </>
    ),
  },
};

/**
 * Long text - Handles overflow
 * 
 * Tests button with lengthy content.
 */
export const LongText: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Download My Resume & Portfolio',
  },
};

/**
 * All variants comparison
 * 
 * Shows all button variants side-by-side.
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

/**
 * All sizes comparison
 * 
 * Shows all button sizes side-by-side.
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

/**
 * Interactive states grid
 * 
 * Shows all combinations of variants and states.
 */
export const StateGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>Normal</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button variant="primary" size="sm">Primary</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="outline" size="sm">Outline</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>Hover (over me)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button variant="primary" size="sm">Primary</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="outline" size="sm">Outline</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>Disabled</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button variant="primary" size="sm" disabled>Primary</Button>
          <Button variant="secondary" size="sm" disabled>Secondary</Button>
          <Button variant="outline" size="sm" disabled>Outline</Button>
          <Button variant="ghost" size="sm" disabled>Ghost</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
