import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, Badge } from '@steding/ui';

/**
 * Steding Design System
 * 
 * Welcome to the Steding Design System - a comprehensive component library
 * and design system for building modern web applications.
 * 
 * ## Navy & Beige Theme
 * 
 * Our design language is built around a professional Navy & Beige color palette,
 * inspired by modern, confident design with generous white space.
 * 
 * - **Dark Mode**: Navy backgrounds with warm beige accents (default)
 * - **Light Mode**: Clean white backgrounds with gold accents
 * - **High Contrast**: WCAG AA compliant for accessibility
 * 
 * ## Design Principles
 * 
 * 1. **Generous White Space**: Bold layouts with section spacing of 10rem
 * 2. **Typography at Scale**: 18px base text, Space Grotesk headings
 * 3. **Smooth Interactions**: Thoughtful animations and transitions
 * 4. **Mobile First**: Responsive components that work everywhere
 * 5. **Accessibility**: WCAG AA compliant with semantic HTML
 * 
 * ## Getting Started
 * 
 * Explore the sidebar to discover:
 * - **Foundations**: Colors, Typography, Spacing
 * - **Components**: Button, Card, Badge, Timeline
 * - **Patterns**: Real-world usage examples
 */
const meta = {
  title: 'Introduction',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Welcome
 * 
 * Introduction to the Steding Design System.
 */
export const Welcome: Story = {
  render: () => (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-primary-bg)',
      padding: '3rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '6rem' }}>
          <Badge variant="primary" size="md" style={{ marginBottom: '2rem' }}>
            Design System v0.1.0
          </Badge>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-display)',
          }}>
            Steding Design System
          </h1>
          <p style={{
            fontSize: '1.5rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: '700px',
            marginBottom: '3rem',
          }}>
            A comprehensive component library and design system for building modern,
            accessible web applications with Navy & Beige aesthetics.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg">
              Explore Components
            </Button>
            <Button variant="secondary" size="lg">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '6rem'
        }}>
          <Card variant="default" padding="lg">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              🎨 Design Tokens
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Centralized design tokens for colors, spacing, typography, and more.
              Extracted from the portfolio app for consistency.
            </p>
          </Card>

          <Card variant="default" padding="lg">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              🧩 Components
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Production-ready components built with React, TypeScript, and Framer Motion.
              From buttons to complex timelines.
            </p>
          </Card>

          <Card variant="default" padding="lg">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              ♿ Accessible
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              WCAG AA compliant with semantic HTML, keyboard navigation, and
              screen reader support built in.
            </p>
          </Card>

          <Card variant="default" padding="lg">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              📱 Responsive
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Mobile-first design with responsive breakpoints and adaptive spacing
              for all screen sizes.
            </p>
          </Card>

          <Card variant="default" padding="lg">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              🌓 Dark/Light Mode
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Beautiful dark mode by default with seamless light mode support.
              Switch themes using the toolbar.
            </p>
          </Card>

          <Card variant="default" padding="lg">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              📚 Documentation
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Comprehensive documentation with live examples, code snippets,
              and usage guidelines for every component.
            </p>
          </Card>
        </div>

        {/* Color Palette Preview */}
        <section style={{ marginBottom: '6rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            marginBottom: '2rem',
            fontFamily: 'var(--font-display)'
          }}>
            Navy & Beige Theme
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                height: '100px',
                background: '#0f1419',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
              }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Primary BG</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#0f1419</div>
            </div>
            <div>
              <div style={{
                height: '100px',
                background: '#1a2332',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
              }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Secondary BG</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#1a2332</div>
            </div>
            <div>
              <div style={{
                height: '100px',
                background: '#e8d5c4',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
              }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Accent</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#e8d5c4</div>
            </div>
            <div>
              <div style={{
                height: '100px',
                background: '#d4a574',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
              }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Accent Alt</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#d4a574</div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            marginBottom: '2rem',
            fontFamily: 'var(--font-display)'
          }}>
            Quick Start
          </h2>
          <Card variant="elevated" padding="xl">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Installation
            </h3>
            <pre style={{
              background: 'var(--color-tertiary-bg)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              marginBottom: '2rem',
            }}>
{`# Install the UI package
pnpm add @steding/ui

# Install the timeline package
pnpm add @steding/timeline-scroll

# Install peer dependencies
pnpm add react react-dom framer-motion`}
            </pre>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Usage
            </h3>
            <pre style={{
              background: 'var(--color-tertiary-bg)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}>
{`import { Button, Card, Badge, colors, spacing } from '@steding/ui';
import { HorizontalTimelineCarousel } from '@steding/timeline-scroll';

function App() {
  return (
    <Card padding="lg">
      <h1>Welcome</h1>
      <Button variant="primary">Get Started</Button>
    </Card>
  );
}`}
            </pre>
          </Card>
        </section>
      </div>
    </div>
  ),
};
