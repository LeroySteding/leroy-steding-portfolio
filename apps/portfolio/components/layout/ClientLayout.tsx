"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalSearch from "@/components/ui/GlobalSearch";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCVPage = pathname === "/cv";
  const { isOpen, openSearch, closeSearch } = useGlobalSearch();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent Framer Motion cleanup errors and double-click navigation
  useEffect(() => {
    // Clear any pending navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Set navigating state and add CSS class to prevent clicks
    setIsNavigating(true);
    document.body.classList.add('navigating');

    // Scroll to top on route change with small delay for animation
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);

    // Reset navigation state after animations complete
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      document.body.classList.remove('navigating');
    }, 400); // Slightly longer to ensure cleanup completes

    return () => {
      clearTimeout(scrollTimeout);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      // Ensure class is removed on unmount
      document.body.classList.remove('navigating');
    };
  }, [pathname]);

  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {!isCVPage && <Header onSearchClick={openSearch} />}
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => setIsNavigating(false)}>
          <div 
            key={pathname}
            style={{ pointerEvents: isNavigating ? 'none' : 'auto' }}
          >
            {children}
          </div>
        </AnimatePresence>
        {!isCVPage && <Footer />}
        <GlobalSearch isOpen={isOpen} onClose={closeSearch} />
      </ThemeProvider>
    </LanguageProvider>
  );
}
