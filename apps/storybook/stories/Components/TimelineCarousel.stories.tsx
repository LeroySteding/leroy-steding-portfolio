import type { Meta, StoryObj } from '@storybook/react';
import { HorizontalTimelineCarousel, ExperienceCard, TimelineCard } from '@steding/timeline-scroll';
import { Badge } from '@steding/ui';

/**
 * Horizontal Timeline Carousel
 * 
 * Smooth horizontal scrolling timeline with scroll-lock behavior.
 * Used in the portfolio for experience and projects sections.
 * 
 * ## Scroll-Lock Behavior ✅ VERIFIED WORKING
 * 
 * **How it works:**
 * 1. **Scroll Down** → Timeline section locks/sticks to viewport
 * 2. **Continue Scrolling** → Cards move horizontally (left to right)
 * 3. **All Cards Seen** → Timeline unlocks, normal scroll resumes
 * 
 * ### Technical Implementation:
 * - **Section Height**: `scrollHeight="auto"` calculates as `100vh + (items.length - 1) * 20vh`
 *   - Example: 3 items = 140vh (100 + 40), 5 items = 180vh (100 + 80)
 * - **Sticky Container**: Fixed at `height: 100vh` with `position: sticky`
 * - **Horizontal Movement**: Framer Motion's `useScroll` tracks vertical scroll progress
 *   - `scrollYProgress` (0-1) transforms to horizontal X position
 *   - Cards move from `startX` to `endX` as you scroll through the section
 * - **Unlock**: Once scroll completes the section height, viewport releases
 * 
 * ### Viewport-Based Highlighting:
 * - Tracks which card is closest to viewport center
 * - Centered card: `scale: 1.05`, `opacity: 1` 
 * - Other cards: `scale: 1`, `opacity: 0.75`
 * - Smooth transitions with easing
 * 
 * ## Features
 * - ✅ Scroll-lock/sticky behavior during horizontal movement
 * - ✅ Viewport-based card highlighting (centered card scales up)
 * - ✅ Auto-calculated scroll height: `100vh + (items - 1) * 20vh`
 * - ✅ Optional header/footer sections
 * - ✅ Configurable card gap and padding
 * - ✅ Progress dots indicator
 * - ✅ Connecting line between cards
 * 
 * ## Usage in Portfolio:
 * - Experience section: Shows professional journey with ExperienceCard components
 * - Projects section: Displays project timeline with custom card content
 * - Both use `scrollHeight="auto"` for optimal scroll-lock duration
 */
const meta = {
  title: 'Components/Timeline Carousel',
  component: HorizontalTimelineCarousel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HorizontalTimelineCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample experience data matching portfolio
const experiences = [
  {
    id: 1,
    role: 'Senior Full-Stack Developer',
    company: 'Tech Company Inc.',
    period: '2022 - Present',
    location: 'Remote',
    description: 'Leading development of enterprise applications using React, TypeScript, and Node.js. Architecting scalable solutions and mentoring junior developers.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    achievements: [
      'Reduced API response time by 60%',
      'Led migration to microservices architecture',
      'Mentored team of 5 developers',
    ],
  },
  {
    id: 2,
    role: 'Frontend Developer',
    company: 'Digital Agency Ltd.',
    period: '2020 - 2022',
    location: 'Berlin, Germany',
    description: 'Built responsive web applications with focus on performance and accessibility. Collaborated with designers to create pixel-perfect implementations.',
    technologies: ['React', 'Vue.js', 'Tailwind CSS', 'Figma'],
    achievements: [
      'Achieved 95+ Lighthouse scores',
      'Implemented design system used across 10+ projects',
      'Reduced bundle size by 40%',
    ],
  },
  {
    id: 3,
    role: 'Junior Web Developer',
    company: 'Startup XYZ',
    period: '2019 - 2020',
    location: 'Amsterdam, Netherlands',
    description: 'Developed features for SaaS platform. Gained experience in full-stack development and agile methodologies.',
    technologies: ['JavaScript', 'React', 'Express', 'MongoDB'],
    achievements: [
      'Shipped 15+ features in first 6 months',
      'Improved test coverage from 20% to 75%',
      'Participated in code reviews and pair programming',
    ],
  },
];

/**
 * Experience Timeline - Default
 * 
 * Full experience timeline with ExperienceCard components.
 * Shows role, company, period, and achievements.
 * 
 * **Scroll down to see the horizontal scroll effect!**
 * The timeline is pinned while you scroll, creating smooth horizontal movement.
 */
export const ExperienceTimeline: Story = {
  args: {
    items: experiences.map((exp) => ({
      id: exp.id,
      content: (
        <ExperienceCard
          role={exp.role}
          company={exp.company}
          period={exp.period}
          location={exp.location}
          description={exp.description}
          technologies={exp.technologies}
          achievements={exp.achievements}
        />
      ),
    })),
    header: (
      <div>
        <h2 style={{ 
          fontSize: '3rem', 
          fontWeight: 800, 
          marginBottom: '1rem',
          color: 'var(--color-text-primary)'
        }}>
          Experience
        </h2>
        <p style={{ 
          fontSize: '1.125rem', 
          color: 'var(--color-text-secondary)',
          maxWidth: '600px' 
        }}>
          My professional journey in web development
        </p>
      </div>
    ),
    scrollHeight: 'auto',
    startX: 'center',
    cardGap: 2,
    showProgressBar: true,
    progressBarColor: 'var(--color-accent-primary)',
  },
};

/**
 * Simple Timeline - Basic cards
 * 
 * Simplified timeline with TimelineCard components.
 */
export const SimpleTimeline: Story = {
  args: {
    items: [
      {
        id: 1,
        content: (
          <TimelineCard
            title="Project Launch"
            subtitle="January 2024"
            description="Successfully launched our flagship product to 10,000+ users."
          />
        ),
      },
      {
        id: 2,
        content: (
          <TimelineCard
            title="Series A Funding"
            subtitle="June 2023"
            description="Raised $5M in Series A funding from leading VCs."
          />
        ),
      },
      {
        id: 3,
        content: (
          <TimelineCard
            title="Company Founded"
            subtitle="March 2022"
            description="Started the company with a vision to revolutionize the industry."
          />
        ),
      },
    ],
    header: (
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
        Company Milestones
      </h2>
    ),
    scrollHeight: 'auto',
    startX: 'center',
    showLine: true,
    lineColor: 'var(--color-accent-primary)',
    showProgressBar: true,
  },
};

/**
 * Project Timeline - Custom content
 * 
 * Timeline with custom card content and styling.
 */
export const ProjectTimeline: Story = {
  args: {
    items: [
      {
        id: 1,
        content: (
          <div style={{
            background: 'var(--color-secondary-bg)',
            border: '1px solid var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '500px',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Badge variant="primary" size="sm">React</Badge>
              <Badge variant="primary" size="sm">TypeScript</Badge>
              <Badge variant="secondary" size="sm">AWS</Badge>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              E-Commerce Platform
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Built a scalable e-commerce platform handling 100k+ transactions monthly.
            </p>
          </div>
        ),
      },
      {
        id: 2,
        content: (
          <div style={{
            background: 'var(--color-secondary-bg)',
            border: '1px solid var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '500px',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Badge variant="primary" size="sm">Vue.js</Badge>
              <Badge variant="secondary" size="sm">Node.js</Badge>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Analytics Dashboard
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Real-time analytics dashboard with interactive data visualization.
            </p>
          </div>
        ),
      },
      {
        id: 3,
        content: (
          <div style={{
            background: 'var(--color-secondary-bg)',
            border: '1px solid var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '500px',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Badge variant="primary" size="sm">React Native</Badge>
              <Badge variant="secondary" size="sm">Firebase</Badge>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Mobile App
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Cross-platform mobile app with offline-first architecture.
            </p>
          </div>
        ),
      },
    ],
    header: (
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
        Featured Projects
      </h2>
    ),
    scrollHeight: 'auto',
    startX: 'center',
    cardGap: 3,
    showProgressBar: true,
  },
};

/**
 * With Footer - Additional content at bottom
 * 
 * Timeline with footer section for CTAs or additional info.
 */
export const WithFooter: Story = {
  args: {
    items: [
      {
        id: 1,
        content: (
          <TimelineCard
            title="Step 1"
            subtitle="Getting Started"
            description="Create your account and set up your profile."
          />
        ),
      },
      {
        id: 2,
        content: (
          <TimelineCard
            title="Step 2"
            subtitle="Configuration"
            description="Configure your preferences and integrations."
          />
        ),
      },
      {
        id: 3,
        content: (
          <TimelineCard
            title="Step 3"
            subtitle="Launch"
            description="Go live and start using the platform."
          />
        ),
      },
    ],
    header: (
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
        Onboarding Process
      </h2>
    ),
    footer: (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          Ready to get started?
        </p>
        <button style={{
          background: 'var(--color-accent-primary)',
          color: 'var(--color-primary-bg)',
          padding: '1rem 2.5rem',
          borderRadius: '0.5rem',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
        }}>
          Start Now
        </button>
      </div>
    ),
    scrollHeight: 'auto',
    startX: 'center',
    showLine: true,
    showProgressBar: true,
  },
};

/**
 * Minimal Configuration
 * 
 * Timeline with minimal configuration, no progress bar or line.
 */
export const Minimal: Story = {
  args: {
    items: [
      {
        id: 1,
        content: (
          <TimelineCard
            title="Phase 1"
            description="Initial research and planning."
          />
        ),
      },
      {
        id: 2,
        content: (
          <TimelineCard
            title="Phase 2"
            description="Development and testing."
          />
        ),
      },
      {
        id: 3,
        content: (
          <TimelineCard
            title="Phase 3"
            description="Launch and monitoring."
          />
        ),
      },
    ],
    scrollHeight: 'auto',
    startX: 'center',
    showLine: false,
    showProgressBar: false,
  },
};
