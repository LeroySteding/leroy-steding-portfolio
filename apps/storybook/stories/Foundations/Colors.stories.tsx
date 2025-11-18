import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@steding/ui';

/**
 * Color System - Navy & Beige Theme
 * 
 * Complete color palette extracted from the portfolio application.
 * Inspired by modern, professional design with generous contrast.
 * 
 * ## Philosophy
 * - **Dark theme default**: Navy backgrounds with warm beige accents
 * - **High contrast**: Ensures readability and accessibility
 * - **Semantic naming**: Colors named by purpose, not appearance
 * - **Light theme support**: Clean, professional light mode variant
 */
const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ColorSwatch = ({ color, name, value }: { color: string; name: string; value: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: color,
        borderRadius: '0.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '0.5rem',
      }}
    />
    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{name}</div>
    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
      {value}
    </div>
  </div>
);

const ColorSection = ({ title, description, colorGroup }: { 
  title: string; 
  description: string; 
  colorGroup: Array<{ name: string; value: string }>;
}) => (
  <div style={{ marginBottom: '3rem' }}>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h2>
    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
      {description}
    </p>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
      gap: '1.5rem' 
    }}>
      {colorGroup.map((color) => (
        <ColorSwatch key={color.name} color={color.value} name={color.name} value={color.value} />
      ))}
    </div>
  </div>
);

/**
 * Dark Theme Colors
 * 
 * Default color palette for dark mode.
 * Navy backgrounds create depth, beige accents provide warmth.
 */
export const DarkTheme: Story = {
  render: () => (
    <div style={{ padding: '3rem', background: 'var(--color-primary-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          Dark Theme Colors
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: 'var(--color-text-secondary)', 
          marginBottom: '3rem',
          lineHeight: 1.7 
        }}>
          Navy & Beige palette inspired by modern, professional design.
        </p>

        <ColorSection
          title="Background Colors"
          description="Layered backgrounds create depth and hierarchy."
          colorGroup={[
            { name: 'Primary BG', value: colors.dark.primary.bg },
            { name: 'Secondary BG', value: colors.dark.secondary.bg },
            { name: 'Tertiary BG', value: colors.dark.tertiary.bg },
            { name: 'Surface', value: colors.dark.surface.DEFAULT },
            { name: 'Surface Light', value: colors.dark.surface.light },
          ]}
        />

        <ColorSection
          title="Accent Colors"
          description="Warm beige tones for highlights and interactive elements."
          colorGroup={[
            { name: 'Accent Primary', value: colors.dark.accent.primary },
            { name: 'Accent Secondary', value: colors.dark.accent.secondary },
            { name: 'Accent Hover', value: colors.dark.accent.hover },
          ]}
        />

        <ColorSection
          title="Text Colors"
          description="High-contrast text colors for optimal readability."
          colorGroup={[
            { name: 'Text Primary', value: colors.dark.text.primary },
            { name: 'Text Secondary', value: colors.dark.text.secondary },
            { name: 'Text Muted', value: colors.dark.text.muted },
          ]}
        />

        <ColorSection
          title="Border Colors"
          description="Subtle borders for separating content."
          colorGroup={[
            { name: 'Border Default', value: colors.dark.border.DEFAULT },
            { name: 'Border Light', value: colors.dark.border.light },
          ]}
        />

        <ColorSection
          title="Alternative Accent"
          description="Mint green accent for variety and emphasis."
          colorGroup={[
            { name: 'Mint', value: colors.dark.mint.DEFAULT },
            { name: 'Mint Dark', value: colors.dark.mint.dark },
          ]}
        />
      </div>
    </div>
  ),
};

/**
 * Light Theme Colors
 * 
 * Clean, professional palette for light mode.
 * White backgrounds with gold accents.
 */
export const LightTheme: Story = {
  render: () => (
    <div className="light" style={{ padding: '3rem', background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#0a0a0a' }}>
          Light Theme Colors
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#525252', 
          marginBottom: '3rem',
          lineHeight: 1.7 
        }}>
          Clean, professional palette with white backgrounds and gold accents.
        </p>

        <ColorSection
          title="Background Colors"
          description="Subtle grays create depth without overwhelming content."
          colorGroup={[
            { name: 'Primary BG', value: colors.light.primary.bg },
            { name: 'Secondary BG', value: colors.light.secondary.bg },
            { name: 'Tertiary BG', value: colors.light.tertiary.bg },
            { name: 'Surface', value: colors.light.surface.DEFAULT },
            { name: 'Surface Light', value: colors.light.surface.light },
          ]}
        />

        <ColorSection
          title="Accent Colors"
          description="Gold tones for warmth and emphasis."
          colorGroup={[
            { name: 'Accent Primary', value: colors.light.accent.primary },
            { name: 'Accent Secondary', value: colors.light.accent.secondary },
            { name: 'Accent Hover', value: colors.light.accent.hover },
          ]}
        />

        <ColorSection
          title="Text Colors"
          description="High-contrast blacks and grays for readability."
          colorGroup={[
            { name: 'Text Primary', value: colors.light.text.primary },
            { name: 'Text Secondary', value: colors.light.text.secondary },
            { name: 'Text Muted', value: colors.light.text.muted },
          ]}
        />

        <ColorSection
          title="Border Colors"
          description="Clean borders that don't compete with content."
          colorGroup={[
            { name: 'Border Default', value: colors.light.border.DEFAULT },
            { name: 'Border Light', value: colors.light.border.light },
          ]}
        />

        <ColorSection
          title="Alternative Accent"
          description="Emerald green for fresh emphasis."
          colorGroup={[
            { name: 'Mint', value: colors.light.mint.DEFAULT },
            { name: 'Mint Dark', value: colors.light.mint.dark },
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
};

/**
 * Color Comparison
 * 
 * Side-by-side comparison of dark and light themes.
 */
export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* Dark Theme */}
      <div style={{ padding: '3rem', background: colors.dark.primary.bg }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Dark Theme</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ColorSwatch color={colors.dark.primary.bg} name="Primary BG" value={colors.dark.primary.bg} />
          <ColorSwatch color={colors.dark.accent.primary} name="Accent" value={colors.dark.accent.primary} />
          <ColorSwatch color={colors.dark.text.primary} name="Text" value={colors.dark.text.primary} />
          <ColorSwatch color={colors.dark.surface.DEFAULT} name="Surface" value={colors.dark.surface.DEFAULT} />
        </div>
      </div>

      {/* Light Theme */}
      <div className="light" style={{ padding: '3rem', background: colors.light.primary.bg }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: colors.light.text.primary }}>
          Light Theme
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ColorSwatch color={colors.light.primary.bg} name="Primary BG" value={colors.light.primary.bg} />
          <ColorSwatch color={colors.light.accent.primary} name="Accent" value={colors.light.accent.primary} />
          <ColorSwatch color={colors.light.text.primary} name="Text" value={colors.light.text.primary} />
          <ColorSwatch color={colors.light.surface.DEFAULT} name="Surface" value={colors.light.surface.DEFAULT} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Usage Guidelines
 * 
 * Best practices for using the color system.
 */
export const UsageGuidelines: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Color Usage Guidelines</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Backgrounds</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li><strong>Primary BG:</strong> Main background color for pages</li>
          <li><strong>Secondary BG:</strong> Cards, sections, and elevated content</li>
          <li><strong>Tertiary BG:</strong> Nested content and hover states</li>
          <li><strong>Surface:</strong> Interactive elements like buttons and inputs</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Accents</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li><strong>Accent Primary:</strong> Primary CTAs, links, and highlights</li>
          <li><strong>Accent Secondary:</strong> Secondary actions and subtle emphasis</li>
          <li><strong>Accent Hover:</strong> Hover states for interactive elements</li>
          <li><strong>Mint:</strong> Alternative accent for variety and freshness</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Text</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li><strong>Text Primary:</strong> Headings, important content</li>
          <li><strong>Text Secondary:</strong> Body text, descriptions</li>
          <li><strong>Text Muted:</strong> Labels, metadata, less important text</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Accessibility</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li>All text colors meet WCAG AA contrast requirements (4.5:1 minimum)</li>
          <li>Accent colors provide 3:1 contrast against backgrounds</li>
          <li>Never rely on color alone to convey information</li>
          <li>Use semantic color names for clarity and maintainability</li>
        </ul>
      </section>
    </div>
  ),
};
