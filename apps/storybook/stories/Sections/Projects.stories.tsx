import type { Meta, StoryObj } from '@storybook/react';

const ProjectCard = ({ title, description, tags }: { title: string; description: string; tags: string[] }) => (
  <div className="bg-cyber-gray-dark border border-cyber-gray-light rounded-xl p-6 hover:border-neon-cyan transition-all duration-300 group">
    <div className="h-48 bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 rounded-lg mb-4" />
    <h3 className="text-xl font-bold text-neon-cyan mb-2 group-hover:animate-glow">
      {title}
    </h3>
    <p className="text-gray-400 mb-4">
      {description}
    </p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-1 bg-cyber-gray text-xs text-gray-300 rounded">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const Projects = () => {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce solution with real-time inventory and payment processing.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio showcasing projects with interactive 3D elements.',
      tags: ['Next.js', 'TypeScript', 'Framer Motion'],
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task manager with real-time updates and team features.',
      tags: ['React', 'Firebase', 'Tailwind CSS'],
    },
  ];

  return (
    <section className="py-20 px-4 bg-cyber-darker">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-12 text-center">
          Featured Projects
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-neon-violet text-neon-violet font-semibold rounded-lg hover:bg-neon-violet/10 transition-all">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

const meta = {
  title: 'Sections/Projects',
  component: Projects,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Projects showcase section with grid layout and project cards featuring hover effects.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Projects>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleProject: Story = {
  render: () => (
    <div className="p-8 bg-cyber-darker">
      <ProjectCard
        title="Demo Project"
        description="This is a demo project card showing all features."
        tags={['React', 'TypeScript', 'Tailwind']}
      />
    </div>
  ),
};
