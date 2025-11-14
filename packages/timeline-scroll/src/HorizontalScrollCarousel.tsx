"use client";

import React, { useRef, ReactNode, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

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
   * Height of the scroll section in viewport heights or CSS value
   * Use 'auto' to calculate based on number of items
   * @default 300
   */
  scrollHeight?: number | string | "auto";
  /**
   * Optional header content to display at top of sticky viewport
   */
  header?: ReactNode;
  /**
   * Optional footer content to display at bottom of sticky viewport
   */
  footer?: ReactNode;
  /**
   * Starting X position as percentage or "center" to center first card
   * @default "1%"
   */
  startX?: string | "center";
  /**
   * Additional offset to apply to startX (e.g., "100px", "10%", "-50px")
   * Useful for fine-tuning the center position
   * @default "0px"
   */
  startXOffset?: string;
  /**
   * Ending X position as percentage or "auto" to center last card
   * @default "-95%"
   */
  endX?: string | "auto";
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

export const HorizontalTimelineCarousel: React.FC<
  HorizontalTimelineCarouselProps
> = ({
  items,
  scrollHeight = 300,
  header,
  footer,
  startX = "1%",
  startXOffset = "0px",
  endX = "-95%",
  cardGap = 1,
  sidePadding = 4,
  showLine = false,
  lineColor = "rgba(139, 92, 246, 0.3)",
  showProgressBar = false,
  progressBarColor = "rgba(139, 92, 246, 0.8)",
  sectionClassName = "",
  containerClassName = "",
  cardsContainerClassName = "",
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const isCentered = startX === "center";

  // For centering: use offset from center (50vw - half card width)
  // Average card width ~575px, so half is ~287px
  // Then apply user offset on top
  const baseStartX = isCentered ? "calc(50vw - 287px)" : startX;
  const calculatedStartX =
    startXOffset !== "0px"
      ? `calc(${baseStartX} + ${startXOffset})`
      : baseStartX;

  const x = useTransform(scrollYProgress, [0, 1], [calculatedStartX, endX]);
  
  // Track which card is currently centered based on viewport position
  const [centeredIndex, setCenteredIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Calculate which card is closest to viewport center
  useEffect(() => {
    const updateCenteredCard = () => {
      if (typeof window === "undefined") return;
      
      const viewportCenter = window.innerWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      setCenteredIndex(closestIndex);
    };
    
    // Update on scroll
    const unsubscribe = scrollYProgress.on("change", updateCenteredCard);
    
    // Initial calculation
    updateCenteredCard();
    
    return unsubscribe;
  }, [scrollYProgress]);

  // Convert rem to pixels for inline styles (assuming 16px = 1rem)
  const gapPx = cardGap * 16;
  const paddingPx = sidePadding * 16;

  // Auto-calculate scroll height based on items
  // Formula: Base height (100vh for sticky section) + scroll distance for each card
  // Optimized: 100vh base + (items.length - 1) * 20vh for smooth scrolling
  const calculatedScrollHeight =
    scrollHeight === "auto" ? 100 + (items.length - 1) * 20 : scrollHeight;

  const heightValue =
    typeof calculatedScrollHeight === "string"
      ? calculatedScrollHeight
      : `${calculatedScrollHeight}vh`;

  return (
    <section
      ref={targetRef}
      className={`relative ${sectionClassName}`}
      style={{ height: heightValue, position: "relative" }}
    >
      {/* Progress Dots */}
      {showProgressBar && (
        <div className="sticky bottom-8 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none">
          {items.map((item, index) => {
            const dotProgress = index / Math.max(items.length - 1, 1);
            const opacity = useTransform(
              scrollYProgress,
              [dotProgress - 0.05, dotProgress, dotProgress + 0.05],
              [0.2, 1, 0.2],
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

      <div className={`sticky top-0 overflow-hidden ${containerClassName}`} style={{ height: '100vh' }}>
        <div className="flex flex-col justify-between h-full">
          {/* Header - Fixed at top */}
          {header && (
            <div className="flex-shrink-0 w-full pt-24 pb-4">
              <div className="container mx-auto px-6">
                {header}
              </div>
            </div>
          )}

          {/* Cards Container - Takes remaining space, centered */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Connecting Line - Behind cards */}
            {showLine && (
              <div
                className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 pointer-events-none z-0"
                style={{
                  backgroundColor: lineColor,
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
              className={`flex items-center relative z-10 ${cardsContainerClassName}`}
            >
              {items.map((item, index) => {
                const isCentered = index === centeredIndex;
                
                return (
                  <motion.div
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="relative z-20"
                    animate={{
                      scale: isCentered ? 1.05 : 1,
                      opacity: isCentered ? 1 : 0.75,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {item.content}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Footer - Fixed at bottom */}
          {footer && (
            <div className="flex-shrink-0 w-full pb-8 pointer-events-none">
              <div className="container mx-auto px-6">
                {footer}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

HorizontalTimelineCarousel.displayName = "HorizontalTimelineCarousel";
