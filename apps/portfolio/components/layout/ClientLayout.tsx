"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCVPage = pathname === "/cv";

  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {!isCVPage && <Header />}
        {children}
        {!isCVPage && <Footer />}
      </ThemeProvider>
    </LanguageProvider>
  );
}
