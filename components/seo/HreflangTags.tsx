"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const siteUrl = "https://leroysteding.nl";

export default function HreflangTags() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove existing hreflang tags
    const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingTags.forEach(tag => tag.remove());

    // Generate URLs for both languages
    const enUrl = `${siteUrl}${pathname}?lang=en`;
    const nlUrl = `${siteUrl}${pathname}?lang=nl`;
    const defaultUrl = `${siteUrl}${pathname}`;

    // Create and append new hreflang tags
    const enLink = document.createElement('link');
    enLink.rel = 'alternate';
    enLink.hreflang = 'en';
    enLink.href = enUrl;
    document.head.appendChild(enLink);

    const nlLink = document.createElement('link');
    nlLink.rel = 'alternate';
    nlLink.hreflang = 'nl';
    nlLink.href = nlUrl;
    document.head.appendChild(nlLink);

    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = defaultUrl;
    document.head.appendChild(defaultLink);
  }, [pathname]);

  return null;
}
