import type { Meta, StoryObj } from '@storybook/react';
import { Card, Button } from '@steding/ui';

/**
 * Card component with Navy & Beige theme
 * 
 * Matches portfolio `.card` pattern with clean design.
 * Supports hover effects, multiple variants, and flexible padding.
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'flat'],
      description: 'Visual style variant',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Internal padding size',
    },
    hoverable: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width card',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card - Standard design
 * 
 * Secondary background with surface border.
 * Hover effect with accent border and lift.
 */
export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    hoverable: true,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Card Title
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This is a default card with standard styling. Hover over it to see the interactive effect.
        </p>
      </div>
    ),
  },
};

/**
 * Elevated card - Prominent shadow
 * 
 * Includes box-shadow for depth.
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    hoverable: true,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Elevated Card
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This card has a shadow to create depth and hierarchy.
        </p>
      </div>
    ),
  },
};

/**
 * Outlined card - Transparent background
 * 
 * No background fill, just border outline.
 */
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
    hoverable: true,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Outlined Card
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This card has a transparent background with a visible border.
        </p>
      </div>
    ),
  },
};

/**
 * Flat card - Minimal design
 * 
 * No border, subtle background.
 */
export const Flat: Story = {
  args: {
    variant: 'flat',
    padding: 'md',
    hoverable: true,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Flat Card
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This card has a flat design with no border.
        </p>
      </div>
    ),
  },
};

/**
 * With button - Interactive content
 * 
 * Card containing a call-to-action button.
 */
export const WithButton: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    hoverable: true,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Featured Project
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          A modern web application built with React, TypeScript, and Tailwind CSS.
        </p>
        <Button variant="secondary" size="sm">
          View Project
        </Button>
      </div>
    ),
  },
};

/**
 * No padding - Custom content spacing
 * 
 * Useful for cards with custom layouts.
 */
export const NoPadding: Story = {
  args: {
    variant: 'default',
    padding: 'none',
    hoverable: true,
    children: (
      <div>
        <div style={{ 
          background: 'var(--color-accent-primary)', 
          padding: '2rem', 
          borderRadius: '0.75rem 0.75rem 0 0' 
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-bg)' }}>
            Card Header
          </h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Card content with custom header section.
          </p>
        </div>
      </div>
    ),
  },
};

/**
 * Small padding - Compact card
 * 
 * Tight spacing for dense layouts.
 */
export const SmallPadding: Story = {
  args: {
    variant: 'default',
    padding: 'sm',
    hoverable: true,
    children: (
      <div>
        <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: 700 }}>
          Compact Card
        </h4>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Small padding for compact layouts.
        </p>
      </div>
    ),
  },
};

/**
 * Large padding - Spacious card
 * 
 * Generous spacing for prominent content.
 */
export const LargePadding: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    hoverable: true,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
          Spacious Card
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Large padding creates a more prominent, comfortable reading experience.
        </p>
      </div>
    ),
  },
};

/**
 * XL padding - Maximum spacing
 * 
 * Extra-large padding for hero sections.
 */
export const XLPadding: Story = {
  args: {
    variant: 'default',
    padding: 'xl',
    hoverable: true,
    children: (
      <div>
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 800 }}>
          Hero Card
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '1.125rem' }}>
          Extra-large padding suitable for hero sections and prominent features.
        </p>
      </div>
    ),
  },
};

/**
 * Non-hoverable - Static card
 * 
 * Disabled hover effects.
 */
export const NonHoverable: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    hoverable: false,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Static Card
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This card has no hover effects.
        </p>
      </div>
    ),
  },
};

/**
 * Clickable card - Interactive
 * 
 * Card with onClick handler and pointer cursor.
 */
export const Clickable: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    hoverable: true,
    onClick: () => alert('Card clicked!'),
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Click Me
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This card is clickable. Try clicking it!
        </p>
      </div>
    ),
  },
};

/**
 * Full width - Responsive card
 * 
 * Spans entire container width.
 */
export const FullWidth: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    hoverable: true,
    fullWidth: true,
    children: (
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Full Width Card
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This card spans the full width of its container.
        </p>
      </div>
    ),
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All variants comparison
 * 
 * Shows all card variants side-by-side.
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', maxWidth: '800px' }}>
      <Card variant="default" padding="md">
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Default</h4>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Standard card with border
        </p>
      </Card>
      <Card variant="elevated" padding="md">
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Elevated</h4>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Card with shadow
        </p>
      </Card>
      <Card variant="outlined" padding="md">
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Outlined</h4>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Transparent background
        </p>
      </Card>
      <Card variant="flat" padding="md">
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Flat</h4>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Minimal design
        </p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
