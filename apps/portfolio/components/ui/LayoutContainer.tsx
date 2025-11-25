"use client";

import { useLayout } from "@/contexts/LayoutContext";
import { cn } from "@/lib/utils";

interface LayoutContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "article" | "header" | "footer" | "nav";
}

/**
 * A responsive container that switches between full-width and contained layouts
 * based on the global layout mode setting.
 */
export default function LayoutContainer({
  children,
  className,
  as: Component = "div",
}: LayoutContainerProps) {
  const { containerClass } = useLayout();

  return (
    <Component className={cn("relative z-10", containerClass, className)}>
      {children}
    </Component>
  );
}

interface LayoutGridProps {
  children: React.ReactNode;
  className?: string;
  /** Override columns for contained mode */
  containedCols?: 2 | 3;
  /** Override columns for full-width mode */
  fullWidthCols?: 3 | 4 | 5;
}

/**
 * A responsive grid that adapts column count based on layout mode.
 */
export function LayoutGrid({
  children,
  className,
  containedCols = 3,
  fullWidthCols = 4,
}: LayoutGridProps) {
  const { layoutMode } = useLayout();

  const getGridClass = () => {
    if (layoutMode === "full-width") {
      switch (fullWidthCols) {
        case 3:
          return "grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";
        case 4:
          return "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8";
        case 5:
          return "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8";
        default:
          return "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8";
      }
    } else {
      switch (containedCols) {
        case 2:
          return "grid md:grid-cols-2 gap-6 lg:gap-8";
        case 3:
          return "grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";
        default:
          return "grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";
      }
    }
  };

  return <div className={cn(getGridClass(), className)}>{children}</div>;
}

interface LayoutContentProps {
  children: React.ReactNode;
  className?: string;
  /** Max width constraint for contained mode (no effect in full-width) */
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
}

/**
 * Content wrapper that applies max-width in contained mode only.
 */
export function LayoutContent({
  children,
  className,
  maxWidth = "6xl",
}: LayoutContentProps) {
  const { layoutMode } = useLayout();

  const maxWidthClass =
    layoutMode === "contained" ? `max-w-${maxWidth} mx-auto` : "";

  return <div className={cn(maxWidthClass, className)}>{children}</div>;
}
