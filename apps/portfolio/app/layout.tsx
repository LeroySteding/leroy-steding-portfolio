import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import HreflangTags from "@/components/seo/HreflangTags";
import { Analytics } from "@vercel/analytics/react";

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
  title: "Leroy Steding | Full-Stack Developer & AI Automation Architect",
  description: "Building scalable AI-driven web platforms & digital automation solutions. Full-stack developer specializing in Next.js, TypeScript, React, and AI automation.",
  keywords: ["Leroy Steding", "Full-Stack Developer", "AI Automation", "Next.js", "TypeScript", "React", "Hifive", "Web Development", "Netherlands"],
  authors: [{ name: "Leroy Steding" }],
  creator: "Leroy Steding",
  metadataBase: new URL("https://leroysteding.nl"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leroysteding.nl",
    siteName: "Leroy Steding Portfolio",
    title: "Leroy Steding | Full-Stack Developer & AI Automation Architect",
    description: "Building scalable AI-driven web platforms & digital automation solutions.",
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
    title: "Leroy Steding | Full-Stack Developer & AI Automation Architect",
    description: "Building scalable AI-driven web platforms & digital automation solutions.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-black text-gray-100">
        <HreflangTags />
        <ClientLayout>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
}
