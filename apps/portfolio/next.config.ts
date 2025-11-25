import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Bundle analyzer - enable with ANALYZE=true
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// next-intl plugin
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Performance budgets
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "framer-motion",
    ],
  },

  // Webpack bundle analyzer (development only)
  webpack: (config, { dev, isServer }) => {
    // Bundle size analysis in development
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
      };
    }

    return config;
  },

  // Performance settings
  compress: true,
  poweredByHeader: false,

  // Generate build ID for cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Redirects for old /nl/ URLs to new root structure
  async redirects() {
    return [
      {
        source: "/nl",
        destination: "/",
        permanent: true,
      },
      {
        source: "/nl/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
