"use client";

import React, { ReactNode } from "react";

export interface ExperienceCardProps {
  /**
   * Job title or position
   */
  title: string;
  /**
   * Company name
   */
  company: string;
  /**
   * Time period (e.g., "2024 - Present")
   */
  period: string;
  /**
   * Location
   */
  location?: string;
  /**
   * Job description
   */
  description: string;
  /**
   * Array of key achievements
   */
  achievements?: string[];
  /**
   * Array of technologies/skills
   */
  technologies: string[];
  /**
   * Company logo URL or emoji
   */
  companyLogo?: string;
  /**
   * Theme color (neon-violet, neon-cyan, etc.)
   * @default "violet"
   */
  color?: "violet" | "cyan" | "purple" | "blue" | "green" | "orange" | "pink";
  /**
   * Card width
   * @default 550
   */
  width?: number;
  /**
   * Link URL for the card
   */
  href?: string;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Custom content (overrides default layout)
   */
  children?: ReactNode;
  /**
   * Show "View Details" link
   * @default true
   */
  showViewDetails?: boolean;
  /**
   * View details text
   * @default "View Details"
   */
  viewDetailsText?: string;
}

const colorMap = {
  violet: "neon-violet",
  cyan: "neon-cyan",
  purple: "purple-500",
  blue: "blue-500",
  green: "green-500",
  orange: "orange-500",
  pink: "pink-500",
};

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  period,
  location,
  description,
  achievements = [],
  technologies,
  companyLogo,
  color = "violet",
  width = 550,
  href,
  className = "",
  children,
  showViewDetails = true,
  viewDetailsText = "View Details",
}) => {
  const colorClass = colorMap[color];

  const cardContent = (
    <div
      className={`relative p-8 rounded-2xl bg-linear-to-br from-cyber-darker to-cyber-black border-2 border-${colorClass}/30 hover:border-${colorClass}/70 transition-all duration-500 group hover:shadow-2xl hover:shadow-${colorClass}/20 ${href ? "cursor-pointer" : ""} ${className} flex flex-col justify-between`}
      style={{
        width: `${width}px`,
        height: "600px",
        minHeight: "600px",
        maxHeight: "600px",
        backgroundColor: "rgb(10, 10, 15)",
      }}
    >
      {/* Company Logo - Top Right */}
      {companyLogo && (
        <div className="absolute top-4 right-4 w-16 h-16 rounded-lg bg-white/95 backdrop-blur-sm border border-cyber-gray-light shadow-lg p-2 group-hover:scale-110 transition-transform duration-300 z-20 flex items-center justify-center">
          {companyLogo.startsWith("/") ? (
            <img
              src={companyLogo}
              alt={`${company} logo`}
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-3xl">{companyLogo}</span>
          )}
        </div>
      )}

      {/* Custom Content */}
      {children ? (
        children
      ) : (
        <div className="flex flex-col h-full">
          {/* Header Section - Fixed height */}
          <div className="pr-20 flex-shrink-0" style={{ height: '140px' }}>
            <div className="flex items-center gap-3 mb-3">
              <svg
                className={`w-5 h-5 text-${colorClass} flex-shrink-0`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span
                className={`text-sm font-bold text-${colorClass} uppercase tracking-wide`}
              >
                {period}
              </span>
            </div>

            <h3 className="text-2xl font-display font-bold mb-2 text-text-primary group-hover:text-neon-cyan transition-colors leading-tight line-clamp-2">
              {title}
            </h3>

            <h4
              className={`text-lg font-semibold text-${colorClass} mb-1 flex items-center gap-2`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="line-clamp-1">{company}</span>
            </h4>

            {location && (
              <p className="flex items-center gap-2 text-text-secondary text-sm line-clamp-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {location}
              </p>
            )}
          </div>

          {/* Description - Fixed height with overflow */}
          <div className="mb-3 flex-shrink-0 overflow-hidden" style={{ height: '90px' }}>
            <p className="text-text-secondary leading-relaxed text-sm line-clamp-4">
              {description}
            </p>
          </div>

          {/* Key Achievements - Fixed height */}
          <div className="mb-3 flex-shrink-0 overflow-hidden" style={{ height: '110px' }}>
            <h5 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wide">
              Key Achievements
            </h5>
            {achievements && achievements.length > 0 ? (
              <ul className="space-y-1.5">
                {achievements.slice(0, 3).map((achievement, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-text-secondary line-clamp-1"
                  >
                    <span className={`text-${colorClass} mt-0.5 flex-shrink-0`}>
                      ▸
                    </span>
                    <span className="line-clamp-1">{achievement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-secondary/50">No achievements listed</p>
            )}
          </div>

          {/* Technologies - Fixed height */}
          <div className="mb-3 flex-shrink-0 overflow-hidden" style={{ height: '90px' }}>
            <h5 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wide">
              Technologies
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg bg-${colorClass}/10 text-${colorClass} border border-${colorClass}/30 hover:bg-${colorClass}/20 transition-colors`}
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 6 && (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-lg bg-${colorClass}/10 text-${colorClass} border border-${colorClass}/30`}
                >
                  +{technologies.length - 6} more
                </span>
              )}
            </div>
          </div>

          {/* Spacer to push View Details to bottom */}
          <div className="flex-1"></div>

          {/* View Details Link - Fixed at bottom */}
          {showViewDetails && (
            <div
              className={`flex items-center gap-2 text-${colorClass} text-sm font-bold group-hover:gap-4 transition-all duration-300 pt-3 border-t border-cyber-gray-light flex-shrink-0 mt-auto`}
            >
              <span>{viewDetailsText}</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Wrap in anchor if href is provided
  if (href) {
    return <a href={href}>{cardContent}</a>;
  }

  return cardContent;
};

ExperienceCard.displayName = "ExperienceCard";
