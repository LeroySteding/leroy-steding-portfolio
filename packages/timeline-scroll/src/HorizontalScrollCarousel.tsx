'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface CarouselItem {
  id: string | number;
  content: ReactNode;
}

export interface HorizontalTimelineCarouselProps {
  /**
   * Array of items to display in the carousel
   */
  items: CarouselItem[];
  /**
   * Height of the scroll section in viewport heights
   * @default 300
   */
  scrollHeight?: number;
  /**
   * Starting X position as percentage or "center" to center first card
   * @default "1%"
   */
  startX?: string | 'center';
  /**
   * Additional offset to apply to startX (e.g., "100px", "10%", "-50px")
   * Useful for fine-tuning the center position
   * @default "0px"
   */
  startXOffset?: string;
  /**
   * Ending X position as percentage
   * @default "-95%"
   */
  endX?: string;
  /**
   * Gap between cards in rem units
   * @default 1 (16px)
   */
  cardGap?: number;
  /**
   * Padding on left/right of carousel in rem units
   * @default 4 (64px)
   */
  sidePadding?: number;
  /**
   * Show connecting line between cards
   * @default false
   */
  showLine?: boolean;
  /**
   * Color of the connecting line
   * @default "rgba(139, 92, 246, 0.3)"
   */
  lineColor?: string;
  /**
   * Show progress bar at top
   * @default false
   */
  showProgressBar?: boolean;
  /**
   * Color of the progress bar
   * @default "rgba(139, 92, 246, 0.8)"
   */
  progressBarColor?: string;
  /**
   * Additional className for the scroll section
   */
  sectionClassName?: string;
  /**
   * Additional className for the sticky container
   */
  containerClassName?: string;
  /**
   * Additional className for the motion div containing cards
   */
  cardsContainerClassName?: string;
}

export const HorizontalTimelineCarousel: React.FC<HorizontalTimelineCarouselProps> = ({
  items,
  scrollHeight = 300,
  startX = '1%',
  startXOffset = '0px',
  endX = '-95%',
  cardGap = 1,
  sidePadding = 4,
  showLine = false,
  lineColor = 'rgba(139, 92, 246, 0.3)',
  showProgressBar = false,
  progressBarColor = 'rgba(139, 92, 246, 0.8)',
  sectionClassName = '',
  containerClassName = '',
  cardsContainerClassName = '',
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const isCentered = startX === 'center';
  
  // For centering: use offset from center (50vw - half card width)
  // Average card width ~575px, so half is ~287px
  // Then apply user offset on top
  const baseStartX = isCentered ? 'calc(50vw - 287px)' : startX;
  const calculatedStartX = startXOffset !== '0px' ? `calc(${baseStartX} + ${startXOffset})` : baseStartX;
  
  const x = useTransform(scrollYProgress, [0, 1], [calculatedStartX, endX]);

  // Convert rem to pixels for inline styles (assuming 16px = 1rem)
  const gapPx = cardGap * 16;
  const paddingPx = sidePadding * 16;

  return (
    <section
      ref={targetRef}
      className={`relative ${sectionClassName}`}
      style={{ height: `${scrollHeight}vh`, position: 'relative' }}
    >
      {/* Progress Dots */}
      {showProgressBar && (
        <div className="sticky bottom-8 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none">
          {items.map((item, index) => {
            const dotProgress = index / Math.max(items.length - 1, 1);
            const opacity = useTransform(
              scrollYProgress,
              [dotProgress - 0.05, dotProgress, dotProgress + 0.05],
              [0.2, 1, 0.2]
            );
            return (
              <motion.div
                key={item.id}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: progressBarColor,
                  opacity,
                }}
              />
            );
          })}
        </div>
      )}

      <div className={`sticky top-0 flex h-screen items-center overflow-hidden ${containerClassName}`}>
        {/* Connecting Line */}
        {showLine && (
          <div
            className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 pointer-events-none"
            style={{
              backgroundColor: lineColor,
              zIndex: 0,
            }}
          />
        )}

        <motion.div
          style={{ 
            x,
            gap: `${gapPx}px`,
            paddingLeft: `${paddingPx}px`,
            paddingRight: `${paddingPx}px`,
          }}
          className={`flex relative z-10 ${cardsContainerClassName}`}
        >
          {items.map((item) => (
            <div key={item.id}>
              {item.content}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

HorizontalTimelineCarousel.displayName = 'HorizontalTimelineCarousel';
