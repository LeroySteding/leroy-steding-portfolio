import type { Meta, StoryObj } from '@storybook/react';

/**
 * Images & Assets
 * 
 * Guidelines for images and media assets in the Steding Design System.
 * 
 * ## Image Guidelines
 * 
 * 1. **Use WebP format** for modern browsers with JPG/PNG fallbacks
 * 2. **Optimize file sizes** - aim for <200KB per image
 * 3. **Provide responsive variants** - mobile, tablet, desktop sizes
 * 4. **Use lazy loading** for images below the fold
 * 5. **Always include alt text** for accessibility
 * 
 * ## Aspect Ratios
 * 
 * - **16:9**: Hero images, video thumbnails
 * - **4:3**: Standard images
 * - **1:1**: Profile pictures, square icons
 * - **3:2**: Photography
 * - **21:9**: Ultra-wide banners
 * 
 * ## Image Sizes
 * 
 * - **Thumbnail**: 150x150px
 * - **Small**: 400x300px
 * - **Medium**: 800x600px
 * - **Large**: 1200x900px
 * - **Hero**: 1920x1080px
 */
const meta = {
  title: 'Foundations/Images',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Aspect Ratios
 * 
 * Standard aspect ratios for different use cases.
 */
export const AspectRatios: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Image Aspect Ratios
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* 16:9 */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            16:9 - Widescreen
          </h3>
          <div style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-bg)',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>
            Hero images, video thumbnails
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Most common for hero sections and banners
          </p>
        </div>

        {/* 4:3 */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            4:3 - Standard
          </h3>
          <div style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '4 / 3',
            background: 'linear-gradient(135deg, var(--color-accent-secondary) 0%, var(--color-mint) 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-bg)',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>
            Standard images
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Traditional format for general content
          </p>
        </div>

        {/* 1:1 */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            1:1 - Square
          </h3>
          <div style={{
            width: '100%',
            maxWidth: '300px',
            aspectRatio: '1 / 1',
            background: 'linear-gradient(135deg, var(--color-mint) 0%, var(--color-accent-primary) 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-bg)',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>
            Profile pics
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Perfect for avatars and icons
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Image Loading
 * 
 * Best practices for image loading and optimization.
 */
export const ImageLoading: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Image Loading & Optimization
      </h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Next.js Image Component
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
          Use Next.js Image component for automatic optimization.
        </p>
        <pre style={{
          background: 'var(--color-tertiary-bg)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}>
{`import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero section background"
  width={1920}
  height={1080}
  priority // For above-the-fold images
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>`}
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Lazy Loading
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
          For images below the fold, use lazy loading.
        </p>
        <pre style={{
          background: 'var(--color-tertiary-bg)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}>
{`<Image
  src="/content-image.jpg"
  alt="Content illustration"
  width={800}
  height={600}
  loading="lazy" // Lazy load by default
  quality={80}
/>`}
        </pre>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Responsive Images
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
          Provide different sizes for different screen sizes.
        </p>
        <pre style={{
          background: 'var(--color-tertiary-bg)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}>
{`<Image
  src="/responsive-image.jpg"
  alt="Responsive content"
  fill
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
  style={{ objectFit: 'cover' }}
/>`}
        </pre>
      </section>
    </div>
  ),
};

/**
 * Image Placeholders
 * 
 * Loading states and placeholders.
 */
export const Placeholders: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
        Image Placeholders
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Skeleton Loading */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Skeleton Loading
          </h3>
          <div style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: 'linear-gradient(90deg, var(--color-tertiary-bg) 25%, var(--color-surface) 50%, var(--color-tertiary-bg) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
            borderRadius: '0.75rem',
          }}>
            <style>{`
              @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Animated skeleton for loading state
          </p>
        </div>

        {/* Blur-up */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Blur-up Placeholder
          </h3>
          <div style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
            borderRadius: '0.75rem',
            filter: 'blur(20px)',
            opacity: 0.5,
          }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Blurred preview while image loads
          </p>
        </div>

        {/* Color Placeholder */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Solid Color
          </h3>
          <div style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: 'var(--color-tertiary-bg)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Simple background with icon
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Best Practices
 * 
 * Guidelines for image usage.
 */
export const BestPractices: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Image Best Practices
      </h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          File Formats
        </h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', paddingLeft: '1.5rem' }}>
          <li><strong>WebP</strong>: Modern format, 25-35% smaller than JPG/PNG</li>
          <li><strong>AVIF</strong>: Next-gen format, even smaller, limited support</li>
          <li><strong>JPG</strong>: Photographs, fallback for older browsers</li>
          <li><strong>PNG</strong>: Images requiring transparency</li>
          <li><strong>SVG</strong>: Icons, logos, simple graphics</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Optimization
        </h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', paddingLeft: '1.5rem' }}>
          <li>Compress images to <strong>&lt;200KB</strong> for web</li>
          <li>Use quality setting of <strong>80-85</strong> for most images</li>
          <li>Generate <strong>multiple sizes</strong> for responsive loading</li>
          <li>Implement <strong>lazy loading</strong> for below-fold images</li>
          <li>Use <strong>blur placeholders</strong> for better perceived performance</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Accessibility
        </h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', paddingLeft: '1.5rem' }}>
          <li>Always provide descriptive <strong>alt text</strong></li>
          <li>Use empty alt="" for <strong>decorative images</strong></li>
          <li>Ensure sufficient <strong>contrast</strong> for text on images</li>
          <li>Don't use images for text content</li>
          <li>Provide text alternatives for complex images</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Performance
        </h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', paddingLeft: '1.5rem' }}>
          <li>Use <strong>priority</strong> prop for above-the-fold images</li>
          <li>Implement <strong>loading="lazy"</strong> by default</li>
          <li>Set explicit <strong>width and height</strong> to prevent layout shift</li>
          <li>Use <strong>CDN</strong> for image delivery</li>
          <li>Cache images with proper headers</li>
        </ul>
      </section>
    </div>
  ),
};
