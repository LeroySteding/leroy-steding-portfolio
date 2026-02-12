import React, { ReactNode } from 'react';

interface CarouselItem {
    id: string | number;
    content: ReactNode;
}
interface HorizontalTimelineCarouselProps {
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
declare const HorizontalTimelineCarousel: React.FC<HorizontalTimelineCarouselProps>;

interface TimelineCardProps {
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
declare const TimelineCard: React.FC<TimelineCardProps>;

interface ExperienceCardProps {
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
declare const ExperienceCard: React.FC<ExperienceCardProps>;

interface TimelineItem {
    id: string;
    content: ReactNode;
    dotColor?: string;
    dotClassName?: string;
}
interface TimelineScrollProps {
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
declare const TimelineScroll: React.FC<TimelineScrollProps>;

export { type CarouselItem, ExperienceCard, type ExperienceCardProps, HorizontalTimelineCarousel, type HorizontalTimelineCarouselProps, TimelineCard, type TimelineCardProps, type TimelineItem, TimelineScroll, type TimelineScrollProps };
