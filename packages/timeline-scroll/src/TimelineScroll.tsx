'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

export interface TimelineItem {
  id: string;
  content: ReactNode;
  dotColor?: string;
  dotClassName?: string;
}

export interface TimelineScrollProps {
  items: TimelineItem[];
  /**
   * Height multiplier per item for scroll distance calculation
   * @default 20
   */
  itemHeightVh?: number;
  /**
   * Width of each card in pixels
   * @default 550
   */
  cardWidth?: number;
  /**
   * Gap between cards in pixels
   * @default 64
   */
  cardGap?: number;
  /**
   * Horizontal distance multiplier
   * @default 60
   */
  distanceMultiplier?: number;
  /**
   * Starting position as percentage
   * @default "20%"
   */
  startPosition?: string;
  /**
   * Show progress indicator at bottom
   * @default true
   */
  showProgressIndicator?: boolean;
  /**
   * Progress indicator text
   * @default "Scroll to explore timeline"
   */
  progressText?: string;
  /**
   * Show timeline line
   * @default true
   */
  showTimelineLine?: boolean;
  /**
   * Timeline line className for styling
   */
  timelineLineClassName?: string;
  /**
   * Container className for the sticky wrapper
   */
  containerClassName?: string;
  /**
   * Cards container className
   */
  cardsContainerClassName?: string;
  /**
   * Individual card wrapper className
   */
  cardClassName?: string;
  /**
   * Render function for timeline dots
   */
  renderDot?: (item: TimelineItem, index: number) => ReactNode;
  /**
   * Render function for card number/index
   */
  renderCardNumber?: (index: number) => ReactNode;
}

export const TimelineScroll: React.FC<TimelineScrollProps> = ({
  items,
  itemHeightVh = 20,
  cardWidth = 550,
  cardGap = 64,
  distanceMultiplier = 60,
  startPosition = '20%',
  showProgressIndicator = true,
  progressText = 'Scroll to explore timeline',
  showTimelineLine = true,
  timelineLineClassName = '',
  containerClassName = '',
  cardsContainerClassName = '',
  cardClassName = '',
  renderDot,
  renderCardNumber,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [startPosition, `-${items.length * distanceMultiplier}%`]
  );

  const defaultDotRender = (item: TimelineItem, index: number) => (
    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20">
      <div
        className={
          item.dotClassName ||
          `w-6 h-6 rounded-full border-4 ${item.dotColor || 'bg-blue-500 border-gray-900'}`
        }
      />
    </div>
  );

  const defaultCardNumberRender = (index: number) => (
    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gray-900 border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-lg shadow-lg z-20">
      {String(index + 1).padStart(2, '0')}
    </div>
  );

  return (
    <section
      ref={targetRef}
      className="timeline-scroll-section relative"
      style={{ height: `${items.length * itemHeightVh}vh` }}
    >
      <div
        className={`sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden py-12 ${containerClassName}`}
      >
        {/* Timeline Line */}
        {showTimelineLine && (
          <div
            className={
              timelineLineClassName ||
              'absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30 z-0'
            }
          />
        )}

        {/* Scrolling Cards Container */}
        <motion.div
          className={`flex relative z-10 ${cardsContainerClassName}`}
          style={{
            gap: `${cardGap}px`,
            paddingLeft: `${cardGap}px`,
            paddingRight: `${cardGap}px`,
            x,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex-shrink-0 relative ${cardClassName}`}
              style={{ width: `${cardWidth}px` }}
            >
              {/* Timeline Dot */}
              {renderDot ? renderDot(item, index) : defaultDotRender(item, index)}

              {/* Card Content */}
              {item.content}

              {/* Card Number */}
              {renderCardNumber
                ? renderCardNumber(index)
                : defaultCardNumberRender(index)}
            </div>
          ))}
        </motion.div>

        {/* Progress Indicator */}
        {showProgressIndicator && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-400 z-10">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-pulse"
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
              <span className="text-sm font-medium">{progressText}</span>
            </div>
            <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 origin-left"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

TimelineScroll.displayName = 'TimelineScroll';
