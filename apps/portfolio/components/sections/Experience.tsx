"use client";

import {
  ExperienceCard,
  HorizontalTimelineCarousel,
} from "@steding/timeline-scroll";
import { useEffect, useState } from "react";
import { experiences } from "@/data/experiences";

export default function Experience() {
  const [windowWidth, setWindowWidth] = useState(1440);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Get responsive card width based on current viewport
  const getResponsiveWidth = (exp: (typeof experiences)[0]) => {
    if (windowWidth < 640) return 320;
    if (windowWidth < 768) return 400;
    if (windowWidth < 1024) return 450;
    // Desktop: Vary based on content length
    if (exp.achievements && exp.achievements.length > 3) return 600;
    if (exp.technologies.length > 15) return 580;
    return 550;
  };

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
        width={getResponsiveWidth(exp)}
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
        lineColor="rgba(232, 213, 196, 0.4)"
        showProgressBar={true}
        progressBarColor="rgba(232, 213, 196, 0.9)"
        sectionClassName="bg-primary-bg"
        header={
          <div className="text-center max-w-4xl mx-auto mb-6">
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
              Professional Journey
            </h2>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 font-medium">
              12+ years of experience across 17 companies, delivering 100+
              projects
            </p>

            {/* Career Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="text-4xl md:text-5xl font-black text-accent-primary mb-2">
                  12+
                </div>
                <div className="text-sm md:text-base text-text-muted font-semibold uppercase tracking-wide">
                  Years Experience
                </div>
              </div>
              <div className="card p-6">
                <div className="text-4xl md:text-5xl font-black text-accent-secondary mb-2">
                  17
                </div>
                <div className="text-sm md:text-base text-text-muted font-semibold uppercase tracking-wide">
                  Companies
                </div>
              </div>
              <div className="card p-6">
                <div className="text-4xl md:text-5xl font-black text-accent-primary mb-2">
                  100+
                </div>
                <div className="text-sm md:text-base text-text-muted font-semibold uppercase tracking-wide">
                  Projects
                </div>
              </div>
              <div className="card p-6">
                <div className="text-4xl md:text-5xl font-black text-accent-secondary mb-2">
                  50+
                </div>
                <div className="text-sm md:text-base text-text-muted font-semibold uppercase tracking-wide">
                  Clients
                </div>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="text-center">
            <p className="text-text-muted text-base md:text-lg font-medium">
              Scroll to explore my complete professional journey →
            </p>
          </div>
        }
      />
    </section>
  );
}
