import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  Organization,
  Person,
  WebSite,
  WithContext,
} from "schema-dts";

const BASE_URL = "https://www.leroysteding.nl";

export function getPersonSchema(locale: string): WithContext<Person> {
  const isNL = locale === "nl";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Leroy Steding",
    url: BASE_URL,
    image: `${BASE_URL}/images/profile.jpg`,
    jobTitle: isNL
      ? "Full-Stack Developer & AI Automation Architect"
      : "Full-Stack Developer & AI Automation Architect",
    description: isNL
      ? "Schaalbare AI-gestuurde webplatforms & digitale automatiseringsoplossingen bouwen."
      : "Building scalable AI-driven web platforms & digital automation solutions.",
    sameAs: [
      "https://github.com/leroysteding",
      "https://linkedin.com/in/leroysteding",
    ],
    knowsAbout: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "AI Automation",
      "Web Development",
      "Full-Stack Development",
    ],
    worksFor: {
      "@type": "Organization",
      name: "STEDING.",
      url: BASE_URL,
    },
  };
}

export function getWebsiteSchema(locale: string): WithContext<WebSite> {
  const isNL = locale === "nl";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "STEDING.",
    url: isNL ? BASE_URL : `${BASE_URL}/en`,
    description: isNL
      ? "Portfolio van Leroy Steding - Full-Stack Developer & AI Automation Architect"
      : "Portfolio of Leroy Steding - Full-Stack Developer & AI Automation Architect",
    inLanguage: isNL ? "nl-NL" : "en-US",
    author: {
      "@type": "Person",
      name: "Leroy Steding",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      // @ts-expect-error - query-input is valid schema.org but not in types
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "STEDING.",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@leroysteding.nl",
      contactType: "customer service",
    },
    sameAs: [
      "https://github.com/leroysteding",
      "https://linkedin.com/in/leroysteding",
    ],
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function getBlogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  image?: string;
  author?: string;
  locale: string;
}): WithContext<BlogPosting> {
  const isNL = post.locale === "nl";
  const postUrl = isNL
    ? `${BASE_URL}/blog/${post.slug}`
    : `${BASE_URL}/en/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: post.image || `${BASE_URL}/images/og-default.jpg`,
    author: {
      "@type": "Person",
      name: post.author || "Leroy Steding",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "STEDING.",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    inLanguage: isNL ? "nl-NL" : "en-US",
  };
}

export function getProjectSchema(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  technologies: string[];
  locale: string;
}): WithContext<Article> {
  const isNL = project.locale === "nl";
  const projectUrl = isNL
    ? `${BASE_URL}/projects/${project.slug}`
    : `${BASE_URL}/en/projects/${project.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    url: projectUrl,
    image: project.image || `${BASE_URL}/images/og-default.jpg`,
    author: {
      "@type": "Person",
      name: "Leroy Steding",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "STEDING.",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": projectUrl,
    },
    keywords: project.technologies.join(", "),
    inLanguage: isNL ? "nl-NL" : "en-US",
  };
}
