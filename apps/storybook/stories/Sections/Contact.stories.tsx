import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-20 px-4 bg-cyber-darker">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-neon-cyan mb-12 text-center">
          Get In Touch
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-2 bg-cyber-gray-dark border border-cyber-gray-light rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-cyber-gray-dark border border-cyber-gray-light rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Your message..."
                className="w-full px-4 py-2 bg-cyber-gray-dark border border-cyber-gray-light rounded-lg text-gray-300 focus:border-neon-cyan focus:outline-none transition-colors resize-none"
              />
            </div>
            
            <button className="w-full px-6 py-3 bg-neon-cyan text-cyber-darker font-semibold rounded-lg hover:bg-neon-cyan/90 transition-all hover:shadow-lg hover:shadow-neon-cyan/50">
              Send Message
            </button>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neon-violet mb-4">
                Connect With Me
              </h3>
              <p className="text-gray-400 mb-6">
                Feel free to reach out for collaborations or just a friendly chat.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'Email', value: 'hello@example.com' },
                { icon: Github, label: 'GitHub', value: 'github.com/username' },
                { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/username' },
                { icon: Twitter, label: 'Twitter', value: '@username' },
              ].map(({ icon: Icon, label, value }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-3 p-3 bg-cyber-gray-dark border border-cyber-gray-light rounded-lg hover:border-neon-cyan transition-all group"
                >
                  <Icon className="w-5 h-5 text-neon-cyan group-hover:text-neon-violet transition-colors" />
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-gray-300">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const meta = {
  title: 'Sections/Contact',
  component: Contact,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Contact section with form and social media links. Features input validation styling and hover effects.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Contact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
