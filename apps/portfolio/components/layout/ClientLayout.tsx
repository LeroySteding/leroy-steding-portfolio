"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
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

  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {!isCVPage && <Header onSearchClick={openSearch} />}
        {children}
        {!isCVPage && <Footer />}
        <GlobalSearch isOpen={isOpen} onClose={closeSearch} />
      </ThemeProvider>
    </LanguageProvider>
  );
}
