import type { Meta, StoryObj } from '@storybook/react';

const TechIcon = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-cyber-gray-dark border border-cyber-gray-light rounded-lg hover:border-neon-cyan transition-all group">
    <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 rounded-lg flex items-center justify-center">
      <span className="text-2xl font-bold text-neon-cyan">{name.slice(0, 2)}</span>
    </div>
    <span className="text-sm text-gray-400 group-hover:text-neon-cyan transition-colors">
      {name}
    </span>
  </div>
);

const TechStack = () => {
  const techCategories = [
    {
      title: 'Frontend',
      color: 'neon-cyan',
      techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      title: 'Backend',
      color: 'neon-violet',
      techs: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      title: 'Tools',
      color: 'neon-pink',
      techs: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma'],
    },
  ];

  return (
    <section className="py-20 px-4 bg-cyber-dark">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-12 text-center">
          Tech Stack
        </h2>
        
        <div className="space-y-12">
          {techCategories.map((category) => (
            <div key={category.title}>
              <h3 className={`text-2xl font-semibold text-${category.color} mb-6`}>
                {category.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {category.techs.map((tech) => (
                  <TechIcon key={tech} name={tech} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const meta = {
  title: 'Sections/Tech Stack',
  component: TechStack,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Tech stack showcase section displaying technologies organized by category with icon grid layout.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TechStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleCategory: Story = {
  render: () => (
    <div className="p-8 bg-cyber-dark">
      <h3 className="text-2xl font-semibold text-neon-cyan mb-6">Frontend</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer'].map((tech) => (
          <TechIcon key={tech} name={tech} />
        ))}
      </div>
    </div>
  ),
};
