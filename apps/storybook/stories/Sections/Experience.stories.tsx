import type { Meta, StoryObj } from '@storybook/react';

const ExperienceCard = ({ 
  company, 
  role, 
  period, 
  description 
}: { 
  company: string; 
  role: string; 
  period: string; 
  description: string;
}) => (
  <div className="relative pl-8 pb-8 border-l-2 border-neon-cyan/30">
    {/* Timeline dot */}
    <div className="absolute -left-2 top-0 w-4 h-4 bg-neon-cyan rounded-full" />
    
    <div className="bg-cyber-gray-dark border border-cyber-gray-light rounded-lg p-6 hover:border-neon-violet transition-all">
      <h3 className="text-xl font-bold text-neon-cyan mb-1">{role}</h3>
      <h4 className="text-lg text-neon-violet mb-2">{company}</h4>
      <p className="text-sm text-gray-500 mb-4">{period}</p>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const Experience = () => {
  const experiences = [
    {
      company: 'Tech Corp',
      role: 'Senior Frontend Developer',
      period: '2022 - Present',
      description: 'Leading frontend development for enterprise applications using React and TypeScript.',
    },
    {
      company: 'Startup Inc',
      role: 'Full Stack Developer',
      period: '2020 - 2022',
      description: 'Built scalable web applications from concept to deployment.',
    },
    {
      company: 'Digital Agency',
      role: 'Web Developer',
      period: '2018 - 2020',
      description: 'Developed responsive websites and web applications for various clients.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-cyber-dark">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-violet mb-12 text-center">
          Experience
        </h2>
        
        <div className="space-y-0">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.company} {...exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

const meta = {
  title: 'Sections/Experience',
  component: Experience,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Experience timeline section with vertical timeline layout showing work history.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Experience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleExperience: Story = {
  render: () => (
    <div className="p-8 bg-cyber-dark">
      <ExperienceCard
        company="Demo Company"
        role="Software Engineer"
        period="2023 - Present"
        description="Working on exciting projects with modern technologies."
      />
    </div>
  ),
};
