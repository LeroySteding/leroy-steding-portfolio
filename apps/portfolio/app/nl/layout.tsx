import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STEDING. | Full-Stack Developer & AI Automatisering Architect",
  description: "Bouwt schaalbare AI-gedreven webplatforms & digitale automatiseringsoplossingen. Full-stack developer gespecialiseerd in Next.js, TypeScript, React en AI-automatisering.",
  keywords: ["Leroy Steding", "Full-Stack Developer", "AI Automatisering", "Next.js", "TypeScript", "React", "Hifive", "Webontwikkeling", "Nederland"],
  authors: [{ name: "Leroy Steding" }],
  creator: "Leroy Steding",
  metadataBase: new URL("https://leroysteding.nl"),
  alternates: {
    canonical: "https://leroysteding.nl/nl",
    languages: {
      'en': 'https://leroysteding.nl',
      'nl': 'https://leroysteding.nl/nl',
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://leroysteding.nl/nl",
    siteName: "STEDING. Portfolio",
    title: "Steding | Full-Stack Developer & AI Automatisering Architect",
    description: "Bouwt schaalbare AI-gedreven webplatforms & digitale automatiseringsoplossingen.",
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
    title: "Full-Stack Developer & AI Automatisering Architect",
    description: "Bouwt schaalbare AI-gedreven webplatforms & digitale automatiseringsoplossingen.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function NLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
