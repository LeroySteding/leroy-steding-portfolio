import type { Meta, StoryObj } from '@storybook/react';

/**
 * Icons & Symbols
 * 
 * Icon system for the Steding Design System.
 * 
 * ## Recommended Icon Libraries
 * 
 * We recommend using these icon libraries for consistency:
 * 
 * - **Lucide React**: Modern, clean icons (preferred)
 * - **Heroicons**: Beautiful hand-crafted icons
 * - **React Icons**: Massive collection from popular icon sets
 * 
 * ## Installation
 * 
 * ```bash
 * pnpm add lucide-react
 * # or
 * pnpm add @heroicons/react
 * # or
 * pnpm add react-icons
 * ```
 * 
 * ## Icon Sizing
 * 
 * Use consistent sizes across your application:
 * - **xs**: 12px - Inline text icons
 * - **sm**: 16px - Small UI elements
 * - **md**: 20px - Default size
 * - **lg**: 24px - Section headers
 * - **xl**: 32px - Feature highlights
 * - **2xl**: 48px - Hero sections
 */
const meta = {
  title: 'Foundations/Icons',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Icon Sizes
 * 
 * Standard icon sizing scale.
 */
export const IconSizes: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Icon Sizes
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <div style={{ fontWeight: 600 }}>XSmall (12px)</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Inline text icons
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <div style={{ fontWeight: 600 }}>Small (16px)</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Small UI elements, buttons
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <div style={{ fontWeight: 600 }}>Medium (20px) - Default</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Default icon size
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <div style={{ fontWeight: 600 }}>Large (24px)</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Section headers, prominent UI
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <div style={{ fontWeight: 600 }}>XLarge (32px)</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Feature highlights, cards
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <div style={{ fontWeight: 600 }}>2XLarge (48px)</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Hero sections, empty states
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Common Icons
 * 
 * Frequently used icons in the design system.
 */
export const CommonIcons: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Common Icons
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Menu */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Menu</div>
        </div>

        {/* Close */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Close</div>
        </div>

        {/* Search */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Search</div>
        </div>

        {/* User */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>User</div>
        </div>

        {/* Mail */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Mail</div>
        </div>

        {/* Phone */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Phone</div>
        </div>

        {/* Arrow Right */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Arrow Right</div>
        </div>

        {/* Check */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Check</div>
        </div>

        {/* Star */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Star</div>
        </div>

        {/* Heart */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Heart</div>
        </div>

        {/* Settings */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Settings</div>
        </div>

        {/* Download */}
        <div style={{ textAlign: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Download</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Usage Examples
 * 
 * How to use icons in components.
 */
export const UsageExamples: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Icon Usage
      </h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Installation
        </h2>
        <pre style={{
          background: 'var(--color-tertiary-bg)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}>
{`# Lucide React (Recommended)
pnpm add lucide-react

# Usage
import { Menu, User, Mail } from 'lucide-react';

<Menu size={20} />
<User size={24} color="var(--color-accent-primary)" />
<Mail size={16} strokeWidth={2.5} />`}
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          With Buttons
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--color-accent-primary)',
            color: 'var(--color-primary-bg)',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            color: 'var(--color-accent-primary)',
            border: '2px solid var(--color-accent-primary)',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Contact
          </button>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Best Practices
        </h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', paddingLeft: '1.5rem' }}>
          <li>Use consistent sizing across similar UI elements</li>
          <li>Match icon color to surrounding text for visual harmony</li>
          <li>Add aria-label for accessibility when icons stand alone</li>
          <li>Use stroke-width of 2 for consistency with design system</li>
          <li>Prefer outline style over filled for a modern, clean look</li>
        </ul>
      </section>
    </div>
  ),
};
