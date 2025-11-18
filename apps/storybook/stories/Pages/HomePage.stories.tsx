import type { Meta, StoryObj } from '@storybook/react';

// Mock complete home page layout
const HomePage = () => {
  return (
    <div className="bg-cyber-darker min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cyber-dark/80 backdrop-blur-lg border-b border-cyber-gray">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-neon-cyan">LS</div>
          <nav className="hidden md:flex gap-6">
            {['About', 'Projects', 'Experience', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-neon-cyan transition-colors">
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-neon-cyan">Leroy Steding</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-300 mb-8">
            Full Stack Developer
          </h2>
          <p className="text-lg text-gray-400 mb-12">
            Crafting exceptional digital experiences with modern web technologies
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-neon-cyan text-cyber-darker font-semibold rounded-lg">
              View Projects
            </button>
            <button className="px-8 py-3 border-2 border-neon-violet text-neon-violet rounded-lg">
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-cyber-dark">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Projects', value: '50+' },
            { label: 'Clients', value: '30+' },
            { label: 'Experience', value: '5 Years' },
            { label: 'Technologies', value: '20+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-cyber-gray-dark rounded-lg">
              <div className="text-3xl font-bold text-neon-cyan mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyber-darker border-t border-cyber-gray py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>© 2024 Leroy Steding. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const meta = {
  title: 'Pages/Home Page',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete home page template with header, hero section, stats, and footer. Showcases the full page layout and structure.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
