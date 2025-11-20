import { Metadata } from "next";
import BookingPageClient from "./BookingPageClient";

export const metadata: Metadata = {
  title: "Book a Free Consultation | Full-Stack Developer & AI Automation Architect",
  description: "Schedule a free consultation with Leroy Steding - Expert in Next.js, React, AI Automation, and SaaS Architecture. Get technical advice, architecture reviews, and project planning. Available for 15-min quick chats, 30-min consultations, or 60-min deep dives.",
  keywords: [
    "technical consultation",
    "web development consultation",
    "Next.js expert",
    "React developer",
    "AI automation architect",
    "SaaS architecture",
    "full-stack developer Netherlands",
    "technical advisor",
    "architecture review",
    "free consultation",
  ],
  authors: [{ name: "Leroy Steding", url: "https://steding.digital" }],
  creator: "Leroy Steding",
  publisher: "Leroy Steding",
  openGraph: {
    title: "Book a Free Consultation with Leroy Steding",
    description: "Expert technical consultation for web development, AI automation, and SaaS architecture. Choose from quick chats, project consultations, or technical deep dives.",
    url: "https://steding.digital/book",
    siteName: "Leroy Steding - Full-Stack Developer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image-booking.jpg", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "Book a consultation with Leroy Steding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Consultation | Leroy Steding",
    description: "Expert technical consultation for web development, AI automation, and SaaS architecture.",
    images: ["/og-image-booking.jpg"],
    creator: "@leroysteding", // Replace with actual Twitter handle if available
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
  alternates: {
    canonical: "https://steding.digital/book",
    languages: {
      "en-US": "https://steding.digital/en/book",
      "nl-NL": "https://steding.digital/nl/book",
    },
  },
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Technical Consultation Services",
  "description": "Professional technical consultation for web development, AI automation, and SaaS architecture",
  "provider": {
    "@type": "Person",
    "name": "Leroy Steding",
    "jobTitle": "Full-Stack Developer & AI Automation Architect",
    "url": "https://steding.digital",
    "sameAs": [
      "https://linkedin.com/in/leroysteding",
      "https://github.com/leroysteding"
    ]
  },
  "areaServed": "Worldwide",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://steding.digital/book",
    "servicePhone": "",
    "serviceLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      }
    }
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Quick Chat",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "15-minute quick consultation for brief questions or introductions"
    },
    {
      "@type": "Offer",
      "name": "Project Consultation",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "30-minute consultation to discuss project requirements in detail"
    },
    {
      "@type": "Offer",
      "name": "Technical Deep Dive",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "60-minute in-depth technical planning and architecture review"
    }
  ]
};

export default function BookingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BookingPageClient />
    </>
  );
}
