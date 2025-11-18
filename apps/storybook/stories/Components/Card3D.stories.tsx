import type { Meta, StoryObj } from '@storybook/react';
import { CardContainer, CardBody, CardItem } from '@steding/ui';

/**
 * 3D Card Component
 * 
 * Interactive 3D card with mouse-tracking parallax effect.
 * Creates depth and dimension through layered elements that respond to mouse movement.
 * 
 * ## Features
 * - ✅ Mouse-tracking 3D rotation effect
 * - ✅ Parallax depth on hover with translateZ
 * - ✅ Smooth transitions and animations
 * - ✅ Composable structure (Container → Body → Items)
 * - ✅ Customizable transforms (translate, rotate)
 * - ✅ Context-based state management
 * 
 * ## Usage
 * Perfect for:
 * - Product showcases
 * - Feature highlights
 * - Interactive portfolios
 * - Engaging CTAs
 * 
 * ## Structure
 * - **CardContainer**: Provides 3D perspective and mouse tracking
 * - **CardBody**: Main card content wrapper with transform styles
 * - **CardItem**: Individual elements with custom 3D transforms
 */
const meta = {
  title: 'Components/Card 3D',
  component: CardContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic 3D Card
 * 
 * Simple 3D card with text content and layered depth.
 * Hover to see the 3D rotation effect.
 */
export const Basic: Story = {
  render: () => (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Make things float in air
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <div className="h-60 w-full rounded-xl bg-gradient-to-br from-purple-500 to-pink-500" />
        </CardItem>
        <div className="flex justify-between items-center mt-8">
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Try now →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  ),
};

/**
 * Product Card
 * 
 * E-commerce style product card with image and CTA buttons.
 */
export const ProductCard: Story = {
  render: () => (
    <CardContainer className="inter-var">
      <CardBody className="bg-primary-bg relative group/card border-2 border-surface w-auto sm:w-[30rem] h-auto rounded-xl p-6">
        <CardItem
          translateZ="50"
          className="text-2xl font-bold text-text-primary"
        >
          Premium Headphones
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-text-secondary text-sm mt-2"
        >
          Experience crystal-clear audio with our latest wireless headphones
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-6">
          <div className="h-48 w-full rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
            <span className="text-6xl">🎧</span>
          </div>
        </CardItem>
        <div className="flex justify-between items-center mt-8">
          <CardItem
            translateZ={20}
            className="text-2xl font-bold text-accent-primary"
          >
            $299
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-6 py-3 rounded-xl bg-accent-primary text-primary-bg text-sm font-bold hover:bg-accent-hover transition-colors"
          >
            Add to Cart
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  ),
};

/**
 * Feature Card
 * 
 * Highlight key features with icons and layered content.
 */
export const FeatureCard: Story = {
  render: () => (
    <CardContainer className="inter-var">
      <CardBody className="bg-secondary-bg relative group/card border-2 border-surface w-auto sm:w-[25rem] h-auto rounded-xl p-8">
        <CardItem translateZ="100" className="mb-6">
          <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <span className="text-3xl">⚡</span>
          </div>
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-2xl font-bold text-text-primary mb-3"
        >
          Lightning Fast
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-text-secondary leading-relaxed"
        >
          Built with performance in mind. Experience blazing fast load times and smooth interactions.
        </CardItem>
        <CardItem translateZ="80" className="mt-6">
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-center gap-2">
              <span className="text-accent-primary">✓</span>
              <span>Sub-second page loads</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-primary">✓</span>
              <span>Optimized bundle size</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-primary">✓</span>
              <span>Edge-native deployment</span>
            </li>
          </ul>
        </CardItem>
      </CardBody>
    </CardContainer>
  ),
};

/**
 * Profile Card
 * 
 * User profile card with avatar and social links.
 */
export const ProfileCard: Story = {
  render: () => (
    <CardContainer className="inter-var">
      <CardBody className="bg-primary-bg relative group/card border-2 border-surface w-auto sm:w-[22rem] h-auto rounded-xl p-8">
        <CardItem translateZ="100" className="mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-5xl">
            👨‍💻
          </div>
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-2xl font-bold text-text-primary"
        >
          John Developer
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-text-secondary text-sm mt-1 mb-4"
        >
          Full-Stack Engineer
        </CardItem>
        <CardItem
          as="p"
          translateZ="70"
          className="text-text-secondary text-sm leading-relaxed mb-6"
        >
          Building beautiful web experiences with modern technologies. Passionate about clean code and user experience.
        </CardItem>
        <div className="flex gap-3">
          <CardItem
            translateZ={80}
            as="button"
            className="flex-1 px-4 py-2 rounded-lg border-2 border-surface text-text-primary text-sm font-semibold hover:border-accent-primary transition-colors"
          >
            Follow
          </CardItem>
          <CardItem
            translateZ={80}
            as="button"
            className="flex-1 px-4 py-2 rounded-lg bg-accent-primary text-primary-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
          >
            Message
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  ),
};

/**
 * Layered Depth
 * 
 * Demonstrates different translateZ values for depth perception.
 * Notice how different layers appear at different distances.
 */
export const LayeredDepth: Story = {
  render: () => (
    <CardContainer className="inter-var">
      <CardBody className="bg-primary-bg relative group/card border-2 border-surface w-auto sm:w-[28rem] h-auto rounded-xl p-8">
        <CardItem
          translateZ="20"
          className="text-sm text-text-muted mb-2"
        >
          Layer 1 (Z: 20)
        </CardItem>
        <CardItem
          translateZ="40"
          className="text-base text-text-secondary mb-2"
        >
          Layer 2 (Z: 40)
        </CardItem>
        <CardItem
          translateZ="60"
          className="text-lg text-text-primary mb-2"
        >
          Layer 3 (Z: 60)
        </CardItem>
        <CardItem
          translateZ="80"
          className="text-xl font-semibold text-accent-primary mb-2"
        >
          Layer 4 (Z: 80)
        </CardItem>
        <CardItem
          translateZ="100"
          className="text-2xl font-bold text-accent-secondary mb-6"
        >
          Layer 5 (Z: 100)
        </CardItem>
        <CardItem
          as="p"
          translateZ="50"
          className="text-text-secondary text-sm"
        >
          Hover over the card to see how different Z-index values create depth perception through parallax effect.
        </CardItem>
      </CardBody>
    </CardContainer>
  ),
};
