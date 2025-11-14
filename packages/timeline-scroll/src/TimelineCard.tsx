'use client';

import React, { ReactNode } from 'react';

export interface TimelineCardProps {
  /**
   * Card title
   */
  title: string;
  /**
   * Subtitle or company name
   */
  subtitle?: string;
  /**
   * Time period (e.g., "2024 - Present")
   */
  period?: string;
  /**
   * Location
   */
  location?: string;
  /**
   * Main description text
   */
  description?: string;
  /**
   * Array of technology/skill tags
   */
  tags?: string[];
  /**
   * Background image URL
   */
  imageUrl?: string;
  /**
   * Background gradient classes
   */
  backgroundGradient?: string;
  /**
   * Custom content to render inside the card
   */
  children?: ReactNode;
  /**
   * Card width (default: 450px)
   */
  width?: number | string;
  /**
   * Card height (default: 450px)
   */
  height?: number | string;
  /**
   * Additional className for the card
   */
  className?: string;
  /**
   * Theme variant
   */
  variant?: 'default' | 'gradient' | 'image' | 'minimal';
  /**
   * Color scheme for gradient variant
   */
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan';
}

const colorSchemes = {
  blue: {
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-700',
  },
  purple: {
    bg: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    tagBg: 'bg-purple-100',
    tagText: 'text-purple-700',
  },
  green: {
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    text: 'text-green-600',
    tagBg: 'bg-green-100',
    tagText: 'text-green-700',
  },
  orange: {
    bg: 'from-orange-50 to-red-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    tagBg: 'bg-orange-100',
    tagText: 'text-orange-700',
  },
  pink: {
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    text: 'text-pink-600',
    tagBg: 'bg-pink-100',
    tagText: 'text-pink-700',
  },
  cyan: {
    bg: 'from-cyan-50 to-blue-50',
    border: 'border-cyan-200',
    text: 'text-cyan-600',
    tagBg: 'bg-cyan-100',
    tagText: 'text-cyan-700',
  },
};

export const TimelineCard: React.FC<TimelineCardProps> = ({
  title,
  subtitle,
  period,
  location,
  description,
  tags = [],
  imageUrl,
  backgroundGradient,
  children,
  width = 450,
  height = 450,
  className = '',
  variant = 'default',
  colorScheme = 'blue',
}) => {
  const colors = colorSchemes[colorScheme];
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  // // Image variant - full background image
  // if (variant === 'image' && imageUrl) {
  //   return (
  //     <div
  //       className={`relative overflow-hidden rounded-lg group ${className}`}
  //       style={{ width: widthStyle, height: heightStyle }}
  //     >
  //       {/* Background Image */}
  //       <div
  //         style={{
  //           backgroundImage: `url(${imageUrl})`,
  //           backgroundSize: 'cover',
  //           backgroundPosition: 'center',
  //         }}
  //         className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
  //       />
        
  //       {/* Overlay Content */}
  //       <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/40 flex flex-col justify-end p-8">
  //         {period && (
  //           <span className="text-sm font-bold text-white/90 uppercase tracking-wide mb-2">
  //             {period} minimal
  //           </span>
  //         )}
  //         <h3 className="text-4xl font-black uppercase text-white mb-2 drop-shadow-lg">
  //           {title}
  //         </h3>
  //         {subtitle && (
  //           <p className="text-xl font-semibold text-white/90 mb-4">
  //             {subtitle}
  //           </p>
  //         )}
  //         {description && (
  //           <p className="text-white/80 text-sm leading-relaxed backdrop-blur-sm bg-white/10 p-3 rounded">
  //             {description}
  //           </p>
  //         )}
  //       </div>
        
  //       {children}
  //     </div>
  //   );
  // }

  // // Gradient variant - colorful gradient background
  // if (variant === 'gradient') {
  //   return (
  //     <div
  //       className={`p-8 rounded-2xl bg-gradient-to-br ${backgroundGradient || colors.bg} border-2 ${colors.border} transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}
  //       style={{ width: widthStyle, height: heightStyle }}
  //     >
  //       {period && (
  //         <div className="mb-4">
  //           <span className={`text-sm font-bold ${colors.text} uppercase tracking-wide`}>
  //             {period} gradient
  //           </span>
  //         </div>
  //       )}
        
  //       <h3 className="text-3xl font-bold mb-2 text-gray-900">{title}</h3>
        
  //       {subtitle && (
  //         <h4 className={`text-xl font-semibold ${colors.text} mb-4`}>
  //           {subtitle}
  //         </h4>
  //       )}
        
  //       {location && (
  //         <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
  //           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  //           </svg>
  //           {location}
  //         </p>
  //       )}
        
  //       {description && (
  //         <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>
  //       )}
        
  //       {tags.length > 0 && (
  //         <div className="flex flex-wrap gap-2">
  //           {tags.map((tag, index) => (
  //             <span
  //               key={index}
  //               className={`px-3 py-1 text-sm font-semibold rounded-full ${colors.tagBg} ${colors.tagText}`}
  //             >
  //               {tag}
  //             </span>
  //           ))}
  //         </div>
  //       )}
        
  //       {children}
  //     </div>
  //   );
  // }

  // // Minimal variant - clean and simple
  // if (variant === 'minimal') {
  //   return (
  //     <div
  //       className={`p-8 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
  //       style={{ width: widthStyle, height: heightStyle }}
  //     >
  //       {period && (
  //         <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
  //           {period}minimal 
  //         </span>
  //       )}
        
  //       <h3 className="text-2xl font-bold mb-2 text-gray-900">{title}</h3>
        
  //       {subtitle && (
  //         <p className="text-lg text-gray-600 mb-4">{subtitle}</p>
  //       )}
        
  //       {description && (
  //         <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
  //       )}
        
  //       {tags.length > 0 && (
  //         <div className="flex flex-wrap gap-2 mt-auto">
  //           {tags.map((tag, index) => (
  //             <span
  //               key={index}
  //               className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
  //             >
  //               {tag}
  //             </span>
  //           ))}
  //         </div>
  //       )}
        
  //       {children}
  //     </div>
  //   );
  // }

  // Default variant - balanced design
  return (
    <div
      className={`p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={{ width: widthStyle, height: heightStyle }}
    >
      {period && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gray-900 rounded-full uppercase tracking-wide">
            {period}
          </span>
        </div>
      )}
      
      <h3 className="text-3xl font-bold mb-2 text-gray-900">{title}</h3>
      
      {subtitle && (
        <h4 className="text-xl font-semibold text-gray-700 mb-4">{subtitle}</h4>
      )}
      
      {location && (
        <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>
      )}
      
      {description && (
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
};

TimelineCard.displayName = 'TimelineCard';
