"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useRef } from "react";
import Footer from "@/components/layout/Footer";
import { FrozenRouter } from "@/components/layout/FrozenRouter";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import GlobalSearch from "@/components/ui/GlobalSearch";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCVPage = pathname === "/cv";
  const { isOpen, openSearch, closeSearch } = useGlobalSearch();
  const isNavigatingRef = useRef(false);
  const previousPathRef = useRef(pathname);

  // Scroll to top after exit animation completes (on route change)
  const handleExitComplete = useCallback(() => {
    isNavigatingRef.current = false;
    if (previousPathRef.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      previousPathRef.current = pathname;
    }
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

        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={handleExitComplete}
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            onAnimationStart={() => {
              isNavigatingRef.current = true;
            }}
            onAnimationComplete={() => {
              isNavigatingRef.current = false;
            }}
          >
            <FrozenRouter>{children}</FrozenRouter>
          </motion.div>
        </AnimatePresence>

        {!isCVPage && <Footer />}
        <GlobalSearch isOpen={isOpen} onClose={closeSearch} />
      </ThemeProvider>
    </LanguageProvider>
  );
}
