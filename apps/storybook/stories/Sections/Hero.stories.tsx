import type { Meta, StoryObj } from '@storybook/react';

// Mock Hero section based on portfolio
const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-cyber-darker relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl -top-48 -left-48" />
        <div className="absolute w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl -bottom-48 -right-48" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-neon-cyan animate-glow">Leroy Steding</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-300 mb-8">
          Full Stack Developer & UI/UX Designer
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Crafting exceptional digital experiences with modern web technologies and innovative solutions.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-neon-cyan text-cyber-darker font-semibold rounded-lg hover:bg-neon-cyan/90 transition-all hover:shadow-lg hover:shadow-neon-cyan/50">
            View Projects
          </button>
          <button className="px-8 py-3 border-2 border-neon-violet text-neon-violet font-semibold rounded-lg hover:bg-neon-violet/10 transition-all">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
};

const meta = {
  title: 'Sections/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Hero section with animated background, title, subtitle, and call-to-action buttons. Full-screen layout with cyber aesthetic.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-cyber-darker">
        <Story />
      </div>
    ),
  ],
};
