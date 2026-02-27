import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  ExternalLink,
  Github,
  Tag,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import ProjectGallery from "@/components/projects/ProjectGallery";
import CTA from "@/components/ui/CTA";
import { getProjectByIdOrSlug } from "@/lib/convex-content";
import { getTranslations } from "@/lib/translations";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await getProjectByIdOrSlug(id, locale);

  if (!project) {
    return {
      title: "Project Not Found | Leroy Steding",
    };
  }

  const isNL = locale === "nl";
  const ogImageUrl = new URL("/api/og", "https://www.leroysteding.nl");
  ogImageUrl.searchParams.set("title", project.title);
  ogImageUrl.searchParams.set("description", project.description);
  ogImageUrl.searchParams.set("type", "project");

  return {
    title: `${project.title} | Leroy Steding`,
    description: project.description,
    alternates: {
      canonical: isNL
        ? `https://leroysteding.nl/projects/${id}`
        : `https://leroysteding.nl/en/projects/${id}`,
      languages: {
        nl: `https://leroysteding.nl/projects/${id}`,
        en: `https://leroysteding.nl/en/projects/${id}`,
        "x-default": `https://leroysteding.nl/projects/${id}`,
      },
    },
    openGraph: {
      title: project.title,
      description: project.description,
      locale: isNL ? "nl_NL" : "en_US",
      images: [
        {
          url: project.image || ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.image || ogImageUrl.toString()],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = getTranslations(locale);

  // Fetch project from Convex (handles both IDs and slugs)
  const project = await getProjectByIdOrSlug(id, locale);

  if (!project) {
    notFound();
  }

  const pageUrl = `https://leroysteding.nl/${locale === "nl" ? "" : "en/"}projects/${id}`;

  // Generate JSON-LD structured data for SEO using CreativeWork schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: pageUrl,
    image: project.image || "https://www.leroysteding.nl/images/og-default.jpg",
    creator: {
      "@type": "Person",
      name: "Leroy Steding",
      url: "https://www.leroysteding.nl",
    },
    author: {
      "@type": "Person",
      name: "Leroy Steding",
      url: "https://www.leroysteding.nl",
    },
    dateCreated: project.year ? `${project.year}-01-01` : undefined,
    keywords: project.technologies.join(", "),
    inLanguage: locale === "nl" ? "nl-NL" : "en-US",
    programmingLanguage: project.technologies.filter((t: string) =>
      [
        "TypeScript",
        "JavaScript",
        "Python",
        "Go",
        "Rust",
        "Java",
        "PHP",
      ].includes(t),
    ),
    ...(project.liveUrl && { mainEntityOfPage: project.liveUrl }),
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
  };

  const hasDetails = project.role || project.duration || project.client;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-primary-bg">
        {/* Hero Section with Featured Image */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          {/* Featured Image Background */}
          {project.image ? (
            <div className="absolute inset-0">
              <Image
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              {/* Dark gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/60 via-primary-bg/80 to-primary-bg" />
            </div>
          ) : (
            <>
              {/* Fallback background decoration */}
              <div className="absolute inset-0 bg-secondary-bg" />
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent-primary/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-secondary/30 rounded-full blur-3xl" />
              </div>
            </>
          )}

          <div className="container relative z-10 mx-auto px-8 lg:px-16 h-full flex flex-col justify-end pb-16">
            {/* Back button */}
            <div className="mb-8">
              <Link
                href={`/${locale === "nl" ? "" : "en/"}projects`}
                className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.projects.detail.backToProjects}
              </Link>
            </div>

            {/* Project Header */}
            <div>
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="px-5 py-2.5 rounded-full bg-accent-primary/10 border-2 border-accent-primary text-accent-primary text-sm font-bold">
                    {project.category === "product"
                      ? `🚀 ${t.projects.categories.product}`
                      : project.category === "client"
                        ? `💼 ${t.projects.categories.client}`
                        : `🏢 ${t.projects.categories.internal}`}
                  </span>
                  <div className="flex items-center gap-2 text-text-secondary font-semibold">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base">{project.year}</span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight text-text-primary">
                  {project.title}
                </h1>

                <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl">
                  {project.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-3"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Live Site
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-3"
                  >
                    <Github className="w-5 h-5" />
                    View on GitHub
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24">
          <div className="container relative z-10 mx-auto px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content - 2/3 width on desktop */}
              <div className="lg:col-span-2 space-y-20">
                {/* Technologies */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-black mb-8 flex items-center gap-4">
                    <Tag className="w-8 h-8 text-accent-primary" />
                    {t.projects.detail.technologies}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-5 py-2.5 text-base font-bold rounded-xl bg-surface border-2 border-surface-light text-text-secondary hover:border-accent-primary hover:text-accent-primary hover:bg-surface-light transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overview */}
                {project.longDescription && (
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-black mb-8">
                      {t.projects.detail.overview}
                    </h2>
                    <div className="prose prose-invert max-w-none">
                      {project.longDescription
                        .split("\n\n")
                        .map((paragraph, index) => (
                          <p
                            key={index}
                            className="text-lg text-text-secondary leading-relaxed mb-6"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                {/* Challenge → Solution → Results Narrative */}
                {project.challenges && project.challenges.length > 0 && (
                  <div className="space-y-16">
                    {/* The Challenge */}
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-black">
                          {t.projects.detail.theChallenge}
                        </h2>
                      </div>
                      <ul className="space-y-4">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="card flex gap-4 p-6">
                            <span className="text-red-500 font-bold text-2xl">
                              ⚠️
                            </span>
                            <span className="text-text-secondary text-base leading-relaxed">
                              {challenge}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* The Solution */}
                    {project.solutions && project.solutions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-full bg-accent-primary/10 border-2 border-accent-primary flex items-center justify-center">
                            <span className="text-2xl">💡</span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-display font-black">
                            {t.projects.detail.theSolution}
                          </h2>
                        </div>
                        <ul className="space-y-4">
                          {project.solutions.map((solution, index) => (
                            <li key={index} className="card flex gap-4 p-6">
                              <span className="text-accent-primary font-bold text-2xl">
                                ✅
                              </span>
                              <span className="text-text-secondary text-base leading-relaxed">
                                {solution}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* The Results */}
                    {project.impact && (
                      <div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                            <span className="text-2xl">🚀</span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-display font-black">
                            {t.projects.detail.theResults}
                          </h2>
                        </div>
                        <div className="card p-8 hover:border-accent-primary/50 transition-all duration-300">
                          <div className="text-5xl mb-4">📈</div>
                          <p className="text-lg text-text-secondary leading-relaxed">
                            {project.impact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Gallery */}
                {project.galleryImages && project.galleryImages.length > 0 && (
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-black mb-8">
                      {t.projects.detail.gallery}
                    </h2>
                    <ProjectGallery
                      images={project.galleryImages}
                      projectTitle={project.title}
                    />
                  </div>
                )}

                {/* Testimonial */}
                {project.testimonial && (
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-black mb-8">
                      {t.projects.detail.testimonial}
                    </h2>
                    <div className="card p-10 border-l-8 border-accent-primary">
                      <p className="text-2xl text-text-secondary italic mb-6 leading-relaxed">
                        "{project.testimonial}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - 1/3 width on desktop */}
              {hasDetails && (
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-24 space-y-8">
                    <div className="card p-8">
                      <h3 className="text-2xl font-display font-black mb-6">
                        {t.projects.detail.projectDetails}
                      </h3>
                      <div className="space-y-6">
                        {project.role && (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-5 h-5 text-accent-primary" />
                              <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                                {t.projects.detail.role}
                              </h4>
                            </div>
                            <p className="text-base text-text-primary font-semibold pl-8">
                              {project.role}
                            </p>
                          </div>
                        )}
                        {project.duration && (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Clock className="w-5 h-5 text-accent-primary" />
                              <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                                {t.projects.detail.duration}
                              </h4>
                            </div>
                            <p className="text-base text-text-primary font-semibold pl-8">
                              {project.duration}
                            </p>
                          </div>
                        )}
                        {project.client && (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Briefcase className="w-5 h-5 text-accent-primary" />
                              <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                                {t.projects.detail.client}
                              </h4>
                            </div>
                            <p className="text-base text-text-primary font-semibold pl-8">
                              {project.client}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-20">
              <CTA variant="project" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
