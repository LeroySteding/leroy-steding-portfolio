import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter, Space_Grotesk } from "next/font/google";
import { draftMode } from "next/headers";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import ClientLayout from "@/components/layout/ClientLayout";
import { VisualEditing } from "@/components/sanity/VisualEditing";
import CookieConsent from "@/components/ui/CookieConsent";
import LayoutSwitcher from "@/components/ui/LayoutSwitcher";
import { LayoutProvider } from "@/contexts/LayoutContext";

// Dynamic import for ChatWidget - loaded after initial render (~35KB savings)
const ChatWidget = dynamic(() => import("@/components/ui/ChatWidget"));

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "STEDING. | Full-Stack Developer & AI Automation Architect",
  description:
    "Building scalable AI-driven web platforms & digital automation solutions. Full-stack developer specializing in Next.js, TypeScript, React, and AI automation.",
  keywords: [
    "Leroy Steding",
    "Full-Stack Developer",
    "AI Automation",
    "Next.js",
    "TypeScript",
    "React",
    "Hifive",
    "Web Development",
    "Netherlands",
  ],
  authors: [{ name: "Leroy Steding" }],
  creator: "Leroy Steding",
  metadataBase: new URL("https://leroysteding.nl"),
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    url: "https://leroysteding.nl",
    siteName: "STEDING. Portfolio",
    title: "Steding | Full-Stack Developer & AI Automation Architect",
    description:
      "Building scalable AI-driven web platforms & digital automation solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Leroy Steding Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full-Stack Developer & AI Automation Architect",
    description:
      "Building scalable AI-driven web platforms & digital automation solutions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased bg-black text-gray-100">
        <NextIntlClientProvider messages={messages}>
          <LayoutProvider>
            <ClientLayout>
              {children}
              <Analytics />
              <SpeedInsights />
              <CookieConsent />
              <ChatWidget />
              <LayoutSwitcher />
            </ClientLayout>
          </LayoutProvider>
        </NextIntlClientProvider>
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
