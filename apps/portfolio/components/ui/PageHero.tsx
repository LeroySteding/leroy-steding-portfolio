"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  Code,
  FileText,
  FolderKanban,
  Home,
  Layers,
  type LucideIcon,
  Mail,
  Settings,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";

interface Breadcrumb {
  label: string;
  href?: string;
}

// Icon name type for common page icons
type IconName =
  | "FolderKanban"
  | "User"
  | "Briefcase"
  | "Mail"
  | "BookOpen"
  | "Settings"
  | "Code"
  | "Layers"
  | "FileText"
  | "Calendar"
  | "Star";

// Icon map for tree-shakeable imports (avoids barrel import)
const iconMap: Record<IconName, LucideIcon> = {
  FolderKanban,
  User,
  Briefcase,
  Mail,
  BookOpen,
  Settings,
  Code,
  Layers,
  FileText,
  Calendar,
  Star,
};

interface PageHeroProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  /** @deprecated Use iconName for Server Components. icon still works from Client Components. */
  icon?: LucideIcon;
  /** Icon name as string - use this from Server Components */
  iconName?: IconName;
  breadcrumbs?: Breadcrumb[];
  backgroundImage?: string;
  centered?: boolean;
  children?: React.ReactNode;
}

export default function PageHero({
  title,
  titleHighlight,
  subtitle,
  icon: IconProp,
  iconName,
  breadcrumbs,
  backgroundImage,
  centered = true,
  children,
}: PageHeroProps) {
  const { containerClass, layoutMode } = useLayout();

  // Get the icon component from the name (for Server Components) or use the direct prop (for Client Components)
  const Icon = IconProp || (iconName ? iconMap[iconName] : null);

  // Scale text sizes based on layout mode
  const titleSizes =
    layoutMode === "full-width"
      ? "text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
      : "text-4xl md:text-5xl lg:text-6xl xl:text-7xl";

  const subtitleSizes =
    layoutMode === "full-width"
      ? "text-lg md:text-xl lg:text-2xl"
      : "text-base md:text-lg lg:text-xl";

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary-bg/95 via-primary-bg/85 to-primary-bg" />
        </>
      )}

      {/* Gradient Background (fallback when no image) */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-linear-to-b from-secondary-bg to-primary-bg" />
      )}

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-[400px] h-[400px] bg-accent-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] bg-accent-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Dynamic container based on layout mode */}
      <div className={`relative z-10 ${containerClass}`}>
        {/* Breadcrumbs - Full width */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-8"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-accent-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-text-muted/50" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-accent-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-secondary font-medium">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {/* Main content - Horizontal layout using full width */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
          {/* Left side - Title and subtitle */}
          <div>
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className={`font-display font-black mb-4 ${titleSizes} tracking-tight`}
              >
                {title}{" "}
                {titleHighlight && (
                  <span className="text-gradient">{titleHighlight}</span>
                )}
              </h1>

              {/* Accent Line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ transformOrigin: "left" }}
                className="w-32 h-1.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full mb-6"
              />

              {/* Subtitle */}
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`${subtitleSizes} text-text-secondary max-w-2xl leading-relaxed`}
                >
                  {subtitle}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Right side - Icon */}
          {Icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:flex p-6 xl:p-8 rounded-3xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 backdrop-blur-sm border border-accent-primary/10"
            >
              <Icon className="w-16 h-16 xl:w-20 xl:h-20 text-accent-primary" />
            </motion.div>
          )}
        </div>

        {/* Children - Full width below */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
