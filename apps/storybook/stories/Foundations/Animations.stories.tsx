import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/**
 * Animations & Effects
 * 
 * Animation system for the Steding Design System.
 * 
 * ## Animation Principles
 * 
 * 1. **Purposeful**: Every animation should have a purpose
 * 2. **Subtle**: Animations should enhance, not distract
 * 3. **Fast**: Keep duration under 300ms for UI feedback
 * 4. **Smooth**: Use easing functions for natural movement
 * 5. **Consistent**: Use the same timing across similar interactions
 * 
 * ## Timing Scale
 * 
 * - **Instant**: 0ms - No animation
 * - **Quick**: 150ms - Micro-interactions
 * - **Normal**: 300ms - Standard transitions (default)
 * - **Slow**: 500ms - Complex animations
 * - **Slower**: 700ms - Page transitions
 * 
 * ## Easing Functions
 * 
 * - **ease-out**: Most UI interactions (default)
 * - **ease-in**: Elements leaving the screen
 * - **ease-in-out**: Elements moving within view
 * - **linear**: Loading indicators, continuous animations
 */
const meta = {
  title: 'Foundations/Animations',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Animation Timing
 * 
 * Standard timing scale for animations.
 */
export const AnimationTiming: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    const timings = [
      { label: 'Instant', duration: 0, description: 'No animation - immediate state change' },
      { label: 'Quick', duration: 150, description: 'Micro-interactions, hover states' },
      { label: 'Normal', duration: 300, description: 'Standard transitions (default)' },
      { label: 'Slow', duration: 500, description: 'Complex animations, modals' },
      { label: 'Slower', duration: 700, description: 'Page transitions, large movements' },
    ];

    return (
      <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
          Animation Timing
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {timings.map((timing, index) => (
            <div
              key={timing.label}
              style={{
                background: 'var(--color-secondary-bg)',
                border: '1px solid var(--color-surface)',
                borderRadius: '0.75rem',
                padding: '2rem',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {timing.label}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {timing.description}
                  </p>
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  background: 'var(--color-tertiary-bg)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                }}>
                  {timing.duration}ms
                </div>
              </div>

              {/* Animation Demo Box */}
              <div style={{
                width: '100%',
                height: '60px',
                background: 'var(--color-tertiary-bg)',
                borderRadius: '0.5rem',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-accent-primary)',
                  borderRadius: '0.5rem',
                  transition: `transform ${timing.duration}ms ease-out`,
                  transform: activeIndex === index ? 'translateX(calc(100% - 60px))' : 'translateX(0)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Easing Functions
 * 
 * Different easing curves for animations.
 */
export const EasingFunctions: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    const easings = [
      { label: 'Linear', value: 'linear', description: 'Constant speed, no acceleration' },
      { label: 'Ease', value: 'ease', description: 'Default - Slow start and end, fast middle' },
      { label: 'Ease-In', value: 'ease-in', description: 'Slow start, fast end - Elements leaving' },
      { label: 'Ease-Out', value: 'ease-out', description: 'Fast start, slow end - Most UI interactions' },
      { label: 'Ease-In-Out', value: 'ease-in-out', description: 'Slow start and end - Moving elements' },
    ];

    return (
      <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
          Easing Functions
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {easings.map((easing, index) => (
            <div
              key={easing.label}
              style={{
                background: 'var(--color-secondary-bg)',
                border: '1px solid var(--color-surface)',
                borderRadius: '0.75rem',
                padding: '2rem',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {easing.label}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  {easing.description}
                </p>
              </div>

              {/* Animation Demo Box */}
              <div style={{
                width: '100%',
                height: '60px',
                background: 'var(--color-tertiary-bg)',
                borderRadius: '0.5rem',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-accent-primary)',
                  borderRadius: '0.5rem',
                  transition: `transform 500ms ${easing.value}`,
                  transform: activeIndex === index ? 'translateX(calc(100% - 60px))' : 'translateX(0)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Common Animations
 * 
 * Frequently used animation patterns.
 */
export const CommonAnimations: Story = {
  render: () => {
    return (
      <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
          Common Animations
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Hover Scale */}
          <div style={{
            background: 'var(--color-secondary-bg)',
            border: '1px solid var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '2rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Hover Scale
            </h3>
            <div style={{
              background: 'var(--color-accent-primary)',
              color: 'var(--color-primary-bg)',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: 700,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 300ms ease-out',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Hover me
            </div>
            <pre style={{
              marginTop: '1rem',
              background: 'var(--color-tertiary-bg)',
              padding: '1rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              overflow: 'auto',
            }}>
{`transition: transform 300ms ease-out;
&:hover {
  transform: scale(1.05);
}`}
            </pre>
          </div>

          {/* Fade In */}
          <div style={{
            background: 'var(--color-secondary-bg)',
            border: '1px solid var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '2rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Fade In
            </h3>
            <div style={{
              background: 'var(--color-tertiary-bg)',
              padding: '1rem',
              borderRadius: '0.5rem',
              animation: 'fadeIn 600ms ease-out',
            }}>
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
              `}</style>
              Content fades in
            </div>
            <pre style={{
              marginTop: '1rem',
              background: 'var(--color-tertiary-bg)',
              padding: '1rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              overflow: 'auto',
            }}>
{`@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 600ms ease-out;`}
            </pre>
          </div>

          {/* Slide Up */}
          <div style={{
            background: 'var(--color-secondary-bg)',
            border: '1px solid var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '2rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Slide Up
            </h3>
            <div style={{
              background: 'var(--color-tertiary-bg)',
              padding: '1rem',
              borderRadius: '0.5rem',
              animation: 'slideUp 600ms ease-out',
            }}>
              <style>{`
                @keyframes slideUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
              Content slides up
            </div>
            <pre style={{
              marginTop: '1rem',
              background: 'var(--color-tertiary-bg)',
              padding: '1rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              overflow: 'auto',
            }}>
{`@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideUp 600ms ease-out;`}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Box Shadows & Elevation
 * 
 * Elevation system using shadows.
 */
export const Elevation: Story = {
  render: () => (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
        Elevation & Shadows
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
        {/* Level 0 - None */}
        <div>
          <div style={{
            background: 'var(--color-secondary-bg)',
            padding: '2rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--color-surface)',
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Level 0 - None</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Flat surface
            </p>
          </div>
          <pre style={{
            marginTop: '1rem',
            background: 'var(--color-tertiary-bg)',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
          }}>
            box-shadow: none;
          </pre>
        </div>

        {/* Level 1 - Low */}
        <div>
          <div style={{
            background: 'var(--color-secondary-bg)',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Level 1 - Low</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Cards, buttons
            </p>
          </div>
          <pre style={{
            marginTop: '1rem',
            background: 'var(--color-tertiary-bg)',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
          }}>
{`box-shadow: 
  0 1px 3px rgba(0, 0, 0, 0.3);`}
          </pre>
        </div>

        {/* Level 2 - Medium */}
        <div>
          <div style={{
            background: 'var(--color-secondary-bg)',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Level 2 - Medium</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Hover states, dropdowns
            </p>
          </div>
          <pre style={{
            marginTop: '1rem',
            background: 'var(--color-tertiary-bg)',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
          }}>
{`box-shadow: 
  0 4px 12px rgba(0, 0, 0, 0.3);`}
          </pre>
        </div>

        {/* Level 3 - High */}
        <div>
          <div style={{
            background: 'var(--color-secondary-bg)',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Level 3 - High</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Modals, popovers
            </p>
          </div>
          <pre style={{
            marginTop: '1rem',
            background: 'var(--color-tertiary-bg)',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
          }}>
{`box-shadow: 
  0 8px 24px rgba(0, 0, 0, 0.4);`}
          </pre>
        </div>
      </div>
    </div>
  ),
};
