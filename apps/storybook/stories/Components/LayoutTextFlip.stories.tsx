import type { Meta, StoryObj } from '@storybook/react';
import { LayoutTextFlip } from '@steding/ui';

/**
 * Layout Text Flip Component
 * 
 * Animated text component that cycles through words with smooth flip transitions.
 * Uses Framer Motion's layout animations for seamless word changes.
 * 
 * ## Features
 * - ✅ Smooth word transitions with blur effect
 * - ✅ Customizable rotation interval
 * - ✅ Layout-based animations (no jarring jumps)
 * - ✅ Responsive design with flex wrapping
 * - ✅ Themed border and background
 * 
 * ## Usage
 * Perfect for:
 * - Hero section headlines
 * - Feature highlights
 * - Dynamic taglines
 * - Marketing copy
 * 
 * ## Animation Details
 * - **Entry**: Slides up from below with blur-in effect
 * - **Exit**: Slides down with blur-out effect
 * - **Duration**: 500ms smooth easing
 * - **Mode**: popLayout (maintains space during transition)
 */
const meta = {
  title: 'Components/Layout Text Flip',
  component: LayoutTextFlip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Static text before the flipping words',
    },
    words: {
      control: 'object',
      description: 'Array of words to cycle through',
    },
    duration: {
      control: { type: 'range', min: 1000, max: 10000, step: 500 },
      description: 'Duration in milliseconds between word changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof LayoutTextFlip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default
 * 
 * Basic usage with default props.
 * Shows "Build Amazing" followed by cycling development-related terms.
 */
export const Default: Story = {
  args: {
    text: 'Build Amazing',
    words: ['Landing Pages', 'Component Blocks', 'Page Sections', '3D Shaders'],
    duration: 3000,
  },
};

/**
 * Hero Headline
 * 
 * Perfect for hero sections with value proposition.
 */
export const HeroHeadline: Story = {
  args: {
    text: 'I create',
    words: ['Beautiful Websites', 'Scalable Apps', 'Modern Designs', 'User Experiences'],
    duration: 2500,
    className: 'text-4xl font-bold',
  },
};

/**
 * Product Features
 * 
 * Highlight key product capabilities.
 */
export const ProductFeatures: Story = {
  args: {
    text: 'Built for',
    words: ['Speed', 'Scale', 'Security', 'Performance', 'Reliability'],
    duration: 2000,
    className: 'text-3xl font-semibold',
  },
};

/**
 * Portfolio Tagline
 * 
 * Showcase different skills or roles.
 */
export const PortfolioTagline: Story = {
  args: {
    text: 'Full-Stack',
    words: ['Developer', 'Designer', 'Architect', 'Engineer', 'Creator'],
    duration: 2500,
    className: 'text-5xl font-black',
  },
};

/**
 * Marketing Copy
 * 
 * Emphasize benefits and outcomes.
 */
export const MarketingCopy: Story = {
  args: {
    text: 'Deliver',
    words: ['Faster', 'Better', 'Smarter', 'Stronger', 'Easier'],
    duration: 1800,
    className: 'text-2xl font-bold',
  },
};

/**
 * Technology Stack
 * 
 * Cycle through different technologies or frameworks.
 */
export const TechnologyStack: Story = {
  args: {
    text: 'Built with',
    words: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    duration: 2200,
    className: 'text-xl font-semibold',
  },
};

/**
 * CTA Button
 * 
 * Dynamic call-to-action text.
 */
export const CTAButton: Story = {
  args: {
    text: 'Start',
    words: ['Building', 'Creating', 'Designing', 'Developing', 'Shipping'],
    duration: 2000,
    className: 'text-lg font-bold',
  },
};

/**
 * Fast Rotation
 * 
 * Quick word changes for energetic feel.
 */
export const FastRotation: Story = {
  args: {
    text: 'Lightning',
    words: ['Fast', 'Quick', 'Rapid', 'Speedy', 'Swift'],
    duration: 1000,
    className: 'text-3xl font-bold',
  },
};

/**
 * Slow Rotation
 * 
 * Slow, deliberate word changes for emphasis.
 */
export const SlowRotation: Story = {
  args: {
    text: 'We are',
    words: ['Innovative', 'Professional', 'Reliable', 'Experienced'],
    duration: 5000,
    className: 'text-3xl font-semibold',
  },
};

/**
 * Long Words
 * 
 * Handles longer word content gracefully.
 */
export const LongWords: Story = {
  args: {
    text: 'Specializing in',
    words: [
      'Enterprise Applications',
      'Cloud Infrastructure',
      'Mobile Development',
      'Data Engineering',
      'DevOps Automation',
    ],
    duration: 3000,
    className: 'text-2xl font-semibold',
  },
};

/**
 * Two Words
 * 
 * Minimal word list for simple alternation.
 */
export const TwoWords: Story = {
  args: {
    text: 'Work',
    words: ['Smarter', 'Harder'],
    duration: 2000,
    className: 'text-4xl font-bold',
  },
};

/**
 * In Sentence
 * 
 * Example of using within a larger sentence context.
 */
export const InSentence: Story = {
  render: () => (
    <div className="max-w-3xl text-center">
      <h1 className="text-4xl font-bold text-text-primary mb-6">
        <LayoutTextFlip
          text="I help companies"
          words={['grow', 'scale', 'succeed', 'innovate', 'transform']}
          duration={2500}
        />
      </h1>
      <p className="text-lg text-text-secondary">
        with modern web solutions and expert consulting
      </p>
    </div>
  ),
};

/**
 * Multiple Instances
 * 
 * Using multiple LayoutTextFlip components in the same view.
 */
export const MultipleInstances: Story = {
  render: () => (
    <div className="space-y-8 text-center">
      <div>
        <LayoutTextFlip
          text="Build"
          words={['Fast', 'Secure', 'Scalable', 'Modern']}
          duration={2000}
          className="text-3xl font-bold"
        />
        <p className="text-text-secondary mt-2">Applications</p>
      </div>
      <div>
        <LayoutTextFlip
          text="Deploy to"
          words={['AWS', 'Vercel', 'Netlify', 'Azure', 'GCP']}
          duration={2500}
          className="text-2xl font-semibold"
        />
        <p className="text-text-secondary mt-2">with confidence</p>
      </div>
      <div>
        <LayoutTextFlip
          text="Used by"
          words={['Startups', 'Enterprises', 'Agencies', 'Developers']}
          duration={3000}
          className="text-xl font-medium"
        />
        <p className="text-text-secondary mt-2">worldwide</p>
      </div>
    </div>
  ),
};
