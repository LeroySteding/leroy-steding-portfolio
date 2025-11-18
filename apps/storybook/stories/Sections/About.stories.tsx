import type { Meta, StoryObj } from '@storybook/react';

const About = () => {
  return (
    <section className="py-20 px-4 bg-cyber-dark">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-violet mb-12 text-center">
          About Me
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image/Avatar placeholder */}
          <div className="relative">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border-2 border-neon-cyan/50" />
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              I'm a passionate Full Stack Developer with expertise in modern web technologies. 
              I specialize in creating beautiful, performant, and accessible user experiences.
            </p>
            <p className="text-gray-400">
              With a focus on React, TypeScript, and cutting-edge frontend frameworks, 
              I bring ideas to life through clean code and thoughtful design.
            </p>
            
            <div className="pt-4">
              <h3 className="text-xl font-semibold text-neon-cyan mb-3">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS', 'UI/UX Design'].map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-cyber-gray-light border border-neon-cyan/30 text-gray-300 rounded-lg text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const meta = {
  title: 'Sections/About',
  component: About,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'About section featuring personal introduction, image, and skills showcase.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
