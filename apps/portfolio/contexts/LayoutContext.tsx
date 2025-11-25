"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type LayoutMode = "full-width" | "contained";

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
  containerClass: string;
  gridClass: string;
  heroContainerClass: string;
  heroMaxWidthClass: string;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const LAYOUT_STORAGE_KEY = "portfolio-layout-mode";

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>("full-width");
  const [mounted, setMounted] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY) as LayoutMode | null;
    if (saved && (saved === "full-width" || saved === "contained")) {
      setLayoutModeState(saved);
    }
  }, []);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
  }, []);

  const toggleLayoutMode = useCallback(() => {
    setLayoutModeState((prev) => {
      const next = prev === "full-width" ? "contained" : "full-width";
      localStorage.setItem(LAYOUT_STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Container classes based on layout mode
  // Using max-w-[1600px] for contained mode (wider than 7xl which is 1280px)
  const containerClass =
    layoutMode === "full-width"
      ? "w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20"
      : "container mx-auto px-6 sm:px-8 lg:px-16 max-w-[1600px]";

  // Grid classes - 4 columns on xl for full-width, 3 for contained
  const gridClass =
    layoutMode === "full-width"
      ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
      : "grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";

  // Hero-specific classes for larger text and wider container
  const heroContainerClass =
    layoutMode === "full-width"
      ? "w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24"
      : "container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 max-w-[1600px]";

  // For full-width, use w-full to spread content; for contained, constrain with max-w
  const heroMaxWidthClass =
    layoutMode === "full-width" ? "w-full" : "max-w-7xl mx-auto";

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <LayoutContext.Provider
        value={{
          layoutMode: "full-width",
          setLayoutMode,
          toggleLayoutMode,
          containerClass: "w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20",
          gridClass:
            "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8",
          heroContainerClass: "w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24",
          heroMaxWidthClass: "w-full",
        }}
      >
        {children}
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        setLayoutMode,
        toggleLayoutMode,
        containerClass,
        gridClass,
        heroContainerClass,
        heroMaxWidthClass,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
