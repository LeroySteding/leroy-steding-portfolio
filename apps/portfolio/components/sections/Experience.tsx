'use client';

import { HorizontalTimelineCarousel, ExperienceCard } from '@steding/timeline-scroll';
import { experiences } from '@/data/experiences';

export default function Experience() {
  // Transform experiences data into carousel items
  const experienceItems = experiences.map((exp) => ({
    id: exp.id,
    content: (
      <ExperienceCard
        title={exp.title}
        company={exp.company}
        period={exp.period}
        location={exp.location}
        description={exp.description}
        achievements={exp.achievements}
        technologies={exp.technologies}
        companyLogo={exp.companyLogo}
        color={exp.color}
        href={`/experience/${exp.id}`}
        width={
          // Vary card widths based on content length
          exp.achievements && exp.achievements.length > 3 ? 600 :
          exp.technologies.length > 15 ? 580 :
          550
        }
        showViewDetails={true}
      />
    ),
  }));

  return (
    <section id="experience" className="relative">
      <HorizontalTimelineCarousel
        items={experienceItems}
        startX="center"
        startXOffset="0px"
        endX="-95%"
        cardGap={5}
        sidePadding={8}
        scrollHeight="auto"
        showLine={true}
        lineColor="rgba(139, 92, 246, 0.3)"
        showProgressBar={true}
        progressBarColor="rgba(139, 92, 246, 0.8)"
        sectionClassName="bg-cyber-black"
        header={
          <div className="text-center max-w-3xl mx-auto mb-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Professional Journey
            </h2>
            <p className="text-base text-cyber-lighter/80 mb-4">
              12+ years of experience across 17 companies, delivering 100+ projects
            </p>
            
            {/* Career Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass p-3 rounded-lg border border-violet-500/30">
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-0.5">
                  12+
                </div>
                <div className="text-xs text-cyber-lighter/70">Years Experience</div>
              </div>
              <div className="glass p-3 rounded-lg border border-cyan-500/30">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-0.5">
                  17
                </div>
                <div className="text-xs text-cyber-lighter/70">Companies</div>
              </div>
              <div className="glass p-3 rounded-lg border border-fuchsia-500/30">
                <div className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-0.5">
                  100+
                </div>
                <div className="text-xs text-cyber-lighter/70">Projects</div>
              </div>
              <div className="glass p-3 rounded-lg border border-violet-500/30">
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-0.5">
                  50+
                </div>
                <div className="text-xs text-cyber-lighter/70">Clients</div>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="text-center">
            <p className="text-cyber-lighter/60 text-sm">
              Scroll to explore my complete professional journey →
            </p>
          </div>
        }
      />
    </section>
  );
}
