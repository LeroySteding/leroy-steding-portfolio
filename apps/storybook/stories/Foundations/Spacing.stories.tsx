import type { Meta, StoryObj } from '@storybook/react';
import { spacing, borderRadius } from '@steding/ui';

/**
 * Spacing System
 * 
 * Generous spacing scale extracted from the portfolio application.
 * 
 * ## Philosophy
 * - **Generous white space**: Large sections (10rem default) for bold layouts
 * - **Three-tier system**: Section → Container → Component
 * - **Responsive scaling**: Smaller spacing on mobile devices
 * - **Consistent rhythm**: Spacing creates visual hierarchy
 * 
 * ## Spacing Tiers
 * 1. **Section**: Large gaps between page sections (10rem/160px)
 * 2. **Container**: Padding within sections (5rem/80px)
 * 3. **Component**: Gaps between elements (0.25rem - 3rem)
 */
const meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SpacingBox = ({ size, label, value }: { size: string; label: string; value: string }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '2rem',
      marginBottom: '0.5rem'
    }}>
      <div style={{
        width: size,
        height: '40px',
        background: 'var(--color-accent-primary)',
        borderRadius: '0.25rem',
      }} />
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--color-text-secondary)',
          fontFamily: 'monospace'
        }}>
          {value}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Section Spacing
 * 
 * Large spacing between major page sections.
 * Creates bold, confident layouts with generous white space.
 */
export const SectionSpacing: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        Section Spacing
      </h1>
      <p style={{ 
        fontSize: '1.125rem', 
        color: 'var(--color-text-secondary)', 
        marginBottom: '3rem',
        lineHeight: 1.7 
      }}>
        Large gaps between major page sections. Default: 10rem (160px).
      </p>

      <SpacingBox 
        size={spacing.section.DEFAULT} 
        label="Section (Default)" 
        value={spacing.section.DEFAULT}
      />
      <SpacingBox 
        size={spacing.section.sm} 
        label="Section Small" 
        value={spacing.section.sm}
      />
      <SpacingBox 
        size={spacing.section.xs} 
        label="Section XSmall" 
        value={spacing.section.xs}
      />

      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'var(--color-secondary-bg)',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-surface)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Usage
        </h3>
        <ul style={{ 
          lineHeight: 1.8, 
          color: 'var(--color-text-secondary)',
          paddingLeft: '1.5rem'
        }}>
          <li>Use <code style={{ 
            background: 'var(--color-tertiary-bg)', 
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>section.DEFAULT</code> (10rem) for desktop layouts</li>
          <li>Use <code style={{ 
            background: 'var(--color-tertiary-bg)', 
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>section.sm</code> (6rem) for tablet breakpoints</li>
          <li>Use <code style={{ 
            background: 'var(--color-tertiary-bg)', 
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>section.xs</code> (4rem) for mobile devices</li>
          <li>Creates bold, confident layouts with generous white space</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Container Spacing
 * 
 * Padding within sections and containers.
 * Provides comfortable space around content blocks.
 */
export const ContainerSpacing: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        Container Spacing
      </h1>
      <p style={{ 
        fontSize: '1.125rem', 
        color: 'var(--color-text-secondary)', 
        marginBottom: '3rem',
        lineHeight: 1.7 
      }}>
        Padding within sections and content containers. Default: 5rem (80px).
      </p>

      <SpacingBox 
        size={spacing.container.DEFAULT} 
        label="Container (Default)" 
        value={spacing.container.DEFAULT}
      />
      <SpacingBox 
        size={spacing.container.sm} 
        label="Container Small" 
        value={spacing.container.sm}
      />
      <SpacingBox 
        size={spacing.container.xs} 
        label="Container XSmall" 
        value={spacing.container.xs}
      />

      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'var(--color-secondary-bg)',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-surface)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Usage
        </h3>
        <ul style={{ 
          lineHeight: 1.8, 
          color: 'var(--color-text-secondary)',
          paddingLeft: '1.5rem'
        }}>
          <li>Use for padding inside sections and content containers</li>
          <li>Creates comfortable space around text and content</li>
          <li>Responsive: Adjust based on screen size</li>
          <li>Maintains visual hierarchy within sections</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Component Spacing
 * 
 * Fine-grained spacing for UI components.
 * Eight sizes from xxs (0.25rem) to xl (3rem).
 */
export const ComponentSpacing: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        Component Spacing
      </h1>
      <p style={{ 
        fontSize: '1.125rem', 
        color: 'var(--color-text-secondary)', 
        marginBottom: '3rem',
        lineHeight: 1.7 
      }}>
        Fine-grained spacing for UI components and elements.
      </p>

      <SpacingBox 
        size={spacing.component.xxs} 
        label="XXSmall" 
        value={spacing.component.xxs}
      />
      <SpacingBox 
        size={spacing.component.xs} 
        label="XSmall" 
        value={spacing.component.xs}
      />
      <SpacingBox 
        size={spacing.component.sm} 
        label="Small" 
        value={spacing.component.sm}
      />
      <SpacingBox 
        size={spacing.component.DEFAULT} 
        label="Default" 
        value={spacing.component.DEFAULT}
      />
      <SpacingBox 
        size={spacing.component.md} 
        label="Medium" 
        value={spacing.component.md}
      />
      <SpacingBox 
        size={spacing.component.lg} 
        label="Large" 
        value={spacing.component.lg}
      />
      <SpacingBox 
        size={spacing.component.xl} 
        label="XLarge" 
        value={spacing.component.xl}
      />

      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'var(--color-secondary-bg)',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-surface)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Common Uses
        </h3>
        <ul style={{ 
          lineHeight: 1.8, 
          color: 'var(--color-text-secondary)',
          paddingLeft: '1.5rem'
        }}>
          <li><strong>xxs (0.25rem):</strong> Badge padding, tight gaps</li>
          <li><strong>xs (0.5rem):</strong> Button padding, small gaps</li>
          <li><strong>sm (0.75rem):</strong> Compact element spacing</li>
          <li><strong>DEFAULT (1rem):</strong> Standard element spacing</li>
          <li><strong>md (1.5rem):</strong> Comfortable spacing</li>
          <li><strong>lg (2rem):</strong> Card padding, section gaps</li>
          <li><strong>xl (3rem):</strong> Hero section padding</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Border Radius
 * 
 * Consistent corner rounding for cards, buttons, and containers.
 */
export const BorderRadius: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        Border Radius
      </h1>
      <p style={{ 
        fontSize: '1.125rem', 
        color: 'var(--color-text-secondary)', 
        marginBottom: '3rem',
        lineHeight: 1.7 
      }}>
        Consistent corner rounding for UI elements.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        {Object.entries(borderRadius).map(([key, value]) => (
          <div key={key}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'var(--color-accent-primary)',
              borderRadius: value,
              marginBottom: '1rem',
            }} />
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
              {key === 'DEFAULT' ? 'Default' : key}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-text-secondary)',
              fontFamily: 'monospace'
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'var(--color-secondary-bg)',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-surface)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Usage
        </h3>
        <ul style={{ 
          lineHeight: 1.8, 
          color: 'var(--color-text-secondary)',
          paddingLeft: '1.5rem'
        }}>
          <li><strong>sm (0.25rem):</strong> Small UI elements, badges</li>
          <li><strong>md / DEFAULT (0.5rem):</strong> Buttons, inputs, cards</li>
          <li><strong>lg (0.75rem):</strong> Cards, large containers</li>
          <li><strong>xl (1rem):</strong> Hero sections, featured content</li>
          <li><strong>2xl (1.5rem):</strong> Extra large containers</li>
          <li><strong>full (9999px):</strong> Pills, circular elements</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Spacing Examples
 * 
 * Real-world examples showing spacing in context.
 */
export const SpacingExamples: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
        Spacing Examples
      </h1>

      {/* Card Example */}
      <section style={{ marginBottom: spacing.section.sm }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Card with Component Spacing
        </h2>
        <div style={{
          background: 'var(--color-secondary-bg)',
          border: '1px solid var(--color-surface)',
          borderRadius: borderRadius.lg,
          padding: spacing.component.lg,
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: spacing.component.sm }}>
            Card Title
          </h3>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            lineHeight: 1.7,
            marginBottom: spacing.component.md 
          }}>
            This card uses lg (2rem) padding for comfortable space around content.
            The heading has sm (0.75rem) margin below, and the paragraph has md (1.5rem) margin.
          </p>
          <button style={{
            background: 'var(--color-accent-primary)',
            color: 'var(--color-primary-bg)',
            padding: `${spacing.component.sm} ${spacing.component.lg}`,
            borderRadius: borderRadius.md,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}>
            Learn More
          </button>
        </div>
      </section>

      {/* List Example */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          List with Consistent Gaps
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.component.DEFAULT }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--color-secondary-bg)',
                border: '1px solid var(--color-surface)',
                borderRadius: borderRadius.md,
                padding: spacing.component.md,
              }}
            >
              <h4 style={{ fontWeight: 600, marginBottom: spacing.component.xs }}>
                List Item {i}
              </h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Items separated by DEFAULT (1rem) gap for clear distinction.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
