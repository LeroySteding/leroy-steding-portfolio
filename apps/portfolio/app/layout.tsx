import type { Metadata } from "next";

const BASE_URL = "https://www.leroysteding.nl";

export const metadata: Metadata = {
  title: {
    default: "STEDING. | Full-Stack Developer & AI Automation Architect",
    template: "%s | STEDING.",
  },
  description:
    "Building scalable AI-driven web platforms & digital automation solutions.",
  metadataBase: new URL(BASE_URL),
  authors: [{ name: "Leroy Steding", url: BASE_URL }],
  creator: "Leroy Steding",
  publisher: "STEDING.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "STEDING.",
    title: "STEDING. | Full-Stack Developer & AI Automation Architect",
    description:
      "Building scalable AI-driven web platforms & digital automation solutions.",
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: "STEDING. - Full-Stack Developer & AI Automation Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@leroysteding",
    creator: "@leroysteding",
    title: "STEDING. | Full-Stack Developer & AI Automation Architect",
    description:
      "Building scalable AI-driven web platforms & digital automation solutions.",
    images: [`${BASE_URL}/api/og`],
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
  verification: {
    // Add your verification codes here if needed
    // google: "your-google-verification-code",
  },
};

// Minimal root layout - actual layouts are in route groups
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
