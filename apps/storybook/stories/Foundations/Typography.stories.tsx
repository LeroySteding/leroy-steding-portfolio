import type { Meta, StoryObj } from '@storybook/react';
import { typography } from '@steding/ui';

/**
 * Typography System
 * 
 * Complete typography scale extracted from the portfolio application.
 * 
 * ## Font Families
 * - **Sans**: Inter - Body text and UI elements
 * - **Display**: Space Grotesk - Headings and hero text
 * - **Mono**: SF Mono - Code and technical content
 * 
 * ## Philosophy
 * - **Generous line height**: 1.7 default for body text (readability)
 * - **Large base size**: 18px body text for comfortable reading
 * - **Bold headings**: 700-800 weight for strong hierarchy
 * - **Tight letter spacing**: -0.02em on headings for modern feel
 */
const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Heading Scale
 * 
 * Six heading levels with Space Grotesk font.
 * Bold weights (700-800) with tight letter spacing.
 */
export const Headings: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
        Heading Scale
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            h1 - {typography.headingScale.h1.fontSize} / {typography.headingScale.h1.fontWeight} / {typography.headingScale.h1.letterSpacing}
          </div>
          <h1 style={{
            fontSize: typography.headingScale.h1.fontSize,
            fontWeight: typography.headingScale.h1.fontWeight,
            lineHeight: typography.headingScale.h1.lineHeight,
            letterSpacing: typography.headingScale.h1.letterSpacing,
            fontFamily: typography.headingScale.h1.fontFamily,
          }}>
            The quick brown fox jumps
          </h1>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            h2 - {typography.headingScale.h2.fontSize} / {typography.headingScale.h2.fontWeight} / {typography.headingScale.h2.letterSpacing}
          </div>
          <h2 style={{
            fontSize: typography.headingScale.h2.fontSize,
            fontWeight: typography.headingScale.h2.fontWeight,
            lineHeight: typography.headingScale.h2.lineHeight,
            letterSpacing: typography.headingScale.h2.letterSpacing,
            fontFamily: typography.headingScale.h2.fontFamily,
          }}>
            The quick brown fox jumps over
          </h2>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            h3 - {typography.headingScale.h3.fontSize} / {typography.headingScale.h3.fontWeight} / {typography.headingScale.h3.letterSpacing}
          </div>
          <h3 style={{
            fontSize: typography.headingScale.h3.fontSize,
            fontWeight: typography.headingScale.h3.fontWeight,
            lineHeight: typography.headingScale.h3.lineHeight,
            letterSpacing: typography.headingScale.h3.letterSpacing,
            fontFamily: typography.headingScale.h3.fontFamily,
          }}>
            The quick brown fox jumps over the lazy dog
          </h3>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            h4 - {typography.headingScale.h4.fontSize} / {typography.headingScale.h4.fontWeight}
          </div>
          <h4 style={{
            fontSize: typography.headingScale.h4.fontSize,
            fontWeight: typography.headingScale.h4.fontWeight,
            lineHeight: typography.headingScale.h4.lineHeight,
            letterSpacing: typography.headingScale.h4.letterSpacing,
            fontFamily: typography.headingScale.h4.fontFamily,
          }}>
            The quick brown fox jumps over the lazy dog
          </h4>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            h5 - {typography.headingScale.h5.fontSize} / {typography.headingScale.h5.fontWeight}
          </div>
          <h5 style={{
            fontSize: typography.headingScale.h5.fontSize,
            fontWeight: typography.headingScale.h5.fontWeight,
            lineHeight: typography.headingScale.h5.lineHeight,
            fontFamily: typography.headingScale.h5.fontFamily,
          }}>
            The quick brown fox jumps over the lazy dog
          </h5>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            h6 - {typography.headingScale.h6.fontSize} / {typography.headingScale.h6.fontWeight}
          </div>
          <h6 style={{
            fontSize: typography.headingScale.h6.fontSize,
            fontWeight: typography.headingScale.h6.fontWeight,
            lineHeight: typography.headingScale.h6.lineHeight,
            fontFamily: typography.headingScale.h6.fontFamily,
          }}>
            The quick brown fox jumps over the lazy dog
          </h6>
        </div>
      </div>
    </div>
  ),
};

/**
 * Body Text Scale
 * 
 * Three body text sizes with Inter font.
 * Default: 18px with 1.7 line height for comfortable reading.
 */
export const BodyText: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
        Body Text Scale
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Large (Default) - {typography.bodyScale.large.fontSize} / {typography.bodyScale.large.lineHeight}
          </div>
          <p style={{
            fontSize: typography.bodyScale.large.fontSize,
            lineHeight: typography.bodyScale.large.lineHeight,
            fontFamily: typography.bodyScale.large.fontFamily,
            color: 'var(--color-text-secondary)',
          }}>
            The default body text size is 18px with a generous 1.7 line height. This creates a comfortable reading experience, especially for longer form content. The Inter font family provides excellent legibility across all screen sizes and resolutions.
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Base - {typography.bodyScale.base.fontSize} / {typography.bodyScale.base.lineHeight}
          </div>
          <p style={{
            fontSize: typography.bodyScale.base.fontSize,
            lineHeight: typography.bodyScale.base.lineHeight,
            fontFamily: typography.bodyScale.base.fontFamily,
            color: 'var(--color-text-secondary)',
          }}>
            The base text size is 16px with a 1.5 line height. Use this for UI elements, labels, and secondary content where space efficiency is important. The slightly tighter line height works well for shorter text blocks.
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Small - {typography.bodyScale.small.fontSize} / {typography.bodyScale.small.lineHeight}
          </div>
          <p style={{
            fontSize: typography.bodyScale.small.fontSize,
            lineHeight: typography.bodyScale.small.lineHeight,
            fontFamily: typography.bodyScale.small.fontFamily,
            color: 'var(--color-text-secondary)',
          }}>
            The small text size is 14px with a 1.5 line height. Use this for metadata, captions, footnotes, and supporting information. While smaller, it remains highly readable due to Inter's excellent legibility characteristics.
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Font Weights
 * 
 * Five weight options from normal (400) to extrabold (800).
 */
export const FontWeights: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
        Font Weights
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Normal - {typography.fontWeight.normal}
          </div>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: typography.fontWeight.normal,
            fontFamily: typography.fontFamily.sans,
          }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Medium - {typography.fontWeight.medium}
          </div>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: typography.fontWeight.medium,
            fontFamily: typography.fontFamily.sans,
          }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Semibold - {typography.fontWeight.semibold}
          </div>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily.sans,
          }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Bold - {typography.fontWeight.bold}
          </div>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.sans,
          }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Extrabold - {typography.fontWeight.extrabold}
          </div>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: typography.fontWeight.extrabold,
            fontFamily: typography.fontFamily.sans,
          }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Font Families
 * 
 * Three font families for different purposes.
 */
export const FontFamilies: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
        Font Families
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Sans (Inter)
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: typography.fontFamily.sans,
            marginBottom: '0.5rem',
          }}>
            Heading in Inter
          </h3>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            fontFamily: typography.fontFamily.sans,
            color: 'var(--color-text-secondary)',
          }}>
            Inter is a carefully crafted typeface designed for computer screens. It features a tall x-height to aid in readability of mixed-case and lower-case text. Use Inter for body text, UI elements, and content that requires excellent legibility.
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Display (Space Grotesk)
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: typography.fontFamily.display,
            marginBottom: '0.5rem',
          }}>
            Heading in Space Grotesk
          </h3>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            fontFamily: typography.fontFamily.display,
            color: 'var(--color-text-secondary)',
          }}>
            Space Grotesk is a geometric sans-serif with a distinctive personality. It's perfect for headings, hero text, and any content that needs to make a bold statement. The tight letter spacing creates a modern, cohesive look.
          </p>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)', 
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>
            Mono (SF Mono)
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: typography.fontFamily.mono,
            marginBottom: '0.5rem',
          }}>
            Heading in SF Mono
          </h3>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            fontFamily: typography.fontFamily.mono,
            color: 'var(--color-text-secondary)',
          }}>
            SF Mono is a monospaced typeface perfect for code blocks, technical data, and any content requiring fixed-width characters. Each character occupies the same horizontal space, making it ideal for displaying structured data and code snippets.
          </p>
          <pre style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: '0.875rem',
            background: 'var(--color-tertiary-bg)',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginTop: '1rem',
            overflow: 'auto',
          }}>
{`const greeting = "Hello, World!";
console.log(greeting);`}
          </pre>
        </div>
      </div>
    </div>
  ),
};

/**
 * Usage Guidelines
 * 
 * Best practices for using the typography system.
 */
export const UsageGuidelines: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Typography Usage Guidelines
      </h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Hierarchy</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li><strong>H1:</strong> Page titles, hero headlines (one per page)</li>
          <li><strong>H2:</strong> Section headings, major divisions</li>
          <li><strong>H3:</strong> Subsection headings, card titles</li>
          <li><strong>H4-H6:</strong> Nested headings, less prominent titles</li>
          <li><strong>Body Large:</strong> Main body text, article content</li>
          <li><strong>Body Base:</strong> UI text, labels, secondary content</li>
          <li><strong>Body Small:</strong> Metadata, captions, footnotes</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Font Pairing</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li><strong>Space Grotesk</strong> for all headings (h1-h6)</li>
          <li><strong>Inter</strong> for all body text and UI elements</li>
          <li><strong>SF Mono</strong> for code, data, and technical content</li>
          <li>Never mix display fonts within the same content block</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Line Height</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li><strong>1.1 (Tight):</strong> Headings, display text</li>
          <li><strong>1.5 (Normal):</strong> UI elements, short text blocks</li>
          <li><strong>1.7 (Relaxed):</strong> Body text, articles (default)</li>
          <li>Tighter line height for larger text creates visual cohesion</li>
          <li>Generous line height improves readability for long-form content</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Accessibility</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <li>Minimum 16px font size for body text</li>
          <li>1.5+ line height for body text (ours is 1.7)</li>
          <li>Sufficient contrast ratios (WCAG AA minimum)</li>
          <li>Use semantic HTML for proper screen reader support</li>
          <li>Never rely on font weight alone to convey meaning</li>
        </ul>
      </section>
    </div>
  ),
};
