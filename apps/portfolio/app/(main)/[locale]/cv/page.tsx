"use client";

import {
  ArrowLeft,
  Award,
  Briefcase,
  Download,
  Eye,
  FolderGit2,
  GraduationCap,
  Languages,
  Moon,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { cvData } from "@/data/cv";
import { cvDataNL } from "@/data/cv-nl";
import { getCVProjects } from "@/data/projects";
import { generateCVPDF } from "@/utils/generatePDF";

export default function CVPage() {
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const data = language === "nl" ? cvDataNL : cvData;
  const [atsMode, setAtsMode] = useState(false);
  const cvProjects = getCVProjects();

  const handleDownload = async () => {
    try {
      await generateCVPDF(
        data,
        atsMode ? "ats" : "design",
        language,
        "/leroy-profile-pic.jpeg", // Profile picture URL
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const sectionTitles = {
    en: {
      summary: "PROFESSIONAL SUMMARY",
      skills: "CORE COMPETENCIES",
      experience: "PROFESSIONAL EXPERIENCE",
      projects: "KEY PROJECTS",
      education: "EDUCATION",
      certifications: "CERTIFICATIONS",
      languages: "LANGUAGES",
      technologies: "Technologies:",
    },
    nl: {
      summary: "PROFESSIONELE SAMENVATTING",
      skills: "KERNCOMPETENTIES",
      experience: "PROFESSIONELE ERVARING",
      projects: "BELANGRIJKSTE PROJECTEN",
      education: "OPLEIDING",
      certifications: "CERTIFICERINGEN",
      languages: "TALEN",
      technologies: "Technologieën:",
    },
  };

  const t = sectionTitles[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-black via-cyber-darker to-cyber-black">
      {/* App Header - Hidden when printing */}
      <div className="fixed top-0 left-0 right-0 z-50 print:hidden bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-gray-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-black/50 hover:bg-cyber-black transition-all duration-300 border border-cyan-500/30 hover:border-neon-cyan group"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:text-neon-cyan transition-colors" />
              <span className="text-sm font-medium text-cyan-300 group-hover:text-neon-cyan transition-colors">
                {language === "nl"
                  ? "Terug naar Portfolio"
                  : "Back to Portfolio"}
              </span>
            </Link>

            {/* Page Title */}
            <h1 className="text-xl font-bold text-neon-cyan hidden sm:block">
              {language === "nl" ? "Curriculum Vitae" : "Curriculum Vitae"}
            </h1>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* ATS Mode Toggle */}
              <button
                type="button"
                onClick={() => setAtsMode(!atsMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border ${
                  atsMode
                    ? "bg-blue-500 border-blue-400 text-white"
                    : "bg-cyber-black/50 border-cyan-500/30 text-cyan-300 hover:border-neon-cyan hover:text-neon-cyan"
                }`}
                title={
                  language === "nl"
                    ? "ATS Modus (zonder kleuren/iconen)"
                    : "ATS Mode (no colors/icons)"
                }
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {atsMode
                    ? "ATS"
                    : language === "nl"
                      ? "Standaard"
                      : "Standard"}
                </span>
              </button>

              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all duration-300 border border-green-500"
                title={
                  atsMode
                    ? language === "nl"
                      ? "Download ATS PDF"
                      : "Download ATS PDF"
                    : language === "nl"
                      ? "Download Standaard PDF"
                      : "Download Standard PDF"
                }
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {language === "nl" ? "Download PDF" : "Download PDF"}
                </span>
              </button>

              {/* Theme and Language Switchers */}
              <div className="flex items-center gap-2 border-l border-cyan-500/30 pl-3">
                <LanguageSwitcher />
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-cyber-black/50 hover:bg-cyber-black transition-all duration-300 border border-cyan-500/30 hover:border-neon-cyan"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-violet-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-5xl mx-auto bg-white text-black shadow-2xl rounded-lg overflow-hidden">
          {/* Header Background Accent - Hidden in ATS mode */}
          {!atsMode && (
            <div className="h-2 bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-600"></div>
          )}

          <div className="p-10 sm:p-14">
            {/* Header with Profile Picture */}
            <header className="mb-10 pb-8 border-b-2 border-gray-200 relative">
              {/* Profile Picture with Ring - Hidden in ATS mode */}
              {!atsMode && (
                <div className="absolute top-0 right-0 print:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-full blur-sm opacity-30"></div>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gray-100 ring-2 ring-gray-200">
                      <Image
                        src="/leroy-profile-pic.jpeg"
                        alt={data.personalInfo.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className={atsMode ? "" : "pr-36"}>
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                  {data.personalInfo.name}
                </h1>
                <h2 className="text-xl text-gray-600 mb-6 font-medium flex items-center gap-2">
                  {!atsMode && (
                    <span className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-500"></span>
                  )}
                  {data.personalInfo.title}
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors">
                    📧 {data.personalInfo.email}
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors">
                    📍 {data.personalInfo.location}
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors">
                    💼 {data.personalInfo.linkedin}
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors">
                    🔗 {data.personalInfo.website}
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors">
                    💻 {data.personalInfo.github}
                  </div>
                </div>
              </div>
            </header>

            {/* Professional Summary */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gradient">
                <span className="inline-flex items-center gap-2">
                  {!atsMode && (
                    <span className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                  )}
                  {t.summary}
                </span>
              </h3>
              <p
                className="text-gray-700 leading-relaxed text-base pl-4"
                style={{ lineHeight: "1.7" }}
              >
                {data.summary}
              </p>
            </section>

            {/* Core Competencies */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                <span className="inline-flex items-center gap-2">
                  {!atsMode && (
                    <span className="w-1 h-8 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full"></span>
                  )}
                  {t.skills}
                </span>
              </h3>
              <div className="space-y-5 pl-4">
                {data.skills.map((skillCategory) => (
                  <div key={skillCategory.category}>
                    <h4 className="text-base font-bold text-gray-900 mb-2.5 tracking-wide">
                      {skillCategory.category}
                    </h4>
                    <p
                      className="text-gray-700 text-sm"
                      style={{ lineHeight: "1.8" }}
                    >
                      {skillCategory.items.join(" • ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Professional Experience */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                <span className="inline-flex items-center gap-2">
                  {!atsMode && <Briefcase className="w-6 h-6 text-cyan-600" />}
                  {t.experience}
                </span>
              </h3>
              <div className="space-y-7 pl-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1.5">
                          {exp.title}
                        </h4>
                        <p className="text-base font-semibold text-gray-700">
                          {exp.company} | {exp.location}
                        </p>
                      </div>
                      <p
                        className={
                          atsMode
                            ? "text-sm text-gray-600 font-semibold whitespace-nowrap ml-4"
                            : "text-sm text-gray-600 font-semibold whitespace-nowrap ml-4 bg-gray-50 px-3 py-1 rounded"
                        }
                      >
                        {exp.period}
                      </p>
                    </div>
                    <p
                      className="text-gray-700 mb-3 text-sm"
                      style={{ lineHeight: "1.7" }}
                    >
                      {exp.description}
                    </p>
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-outside space-y-1.5 text-sm text-gray-700 ml-5 mb-3">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{ lineHeight: "1.6" }}>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-3 relative">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        {t.technologies}
                      </p>
                      <div className="flex flex-wrap gap-2 pr-24">
                        {exp.technologies.slice(0, 8).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className={
                              atsMode
                                ? "px-2.5 py-1 text-gray-700 text-xs"
                                : "px-2.5 py-1 bg-gradient-to-r from-cyan-50 to-violet-50 text-gray-700 text-xs rounded-full border border-cyan-100"
                            }
                          >
                            {tech}
                          </span>
                        ))}
                        {!atsMode && exp.technologies.length > 8 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{exp.technologies.length - 8} more
                          </span>
                        )}
                      </div>
                      {/* Company Logo - Bottom Right */}
                      {!atsMode &&
                        exp.companyLogo &&
                        exp.companyLogo.startsWith("/logos/") && (
                          <div className="absolute bottom-0 right-0 w-20 h-20">
                            <Image
                              src={exp.companyLogo}
                              alt={`${exp.company} logo`}
                              width={80}
                              height={80}
                              unoptimized
                              className="rounded-lg object-contain bg-white p-2 border border-gray-200 shadow-sm"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Projects */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                <span className="inline-flex items-center gap-2">
                  {!atsMode && (
                    <FolderGit2 className="w-6 h-6 text-violet-600" />
                  )}
                  {t.projects}
                </span>
              </h3>
              <div className="space-y-6 pl-4">
                {cvProjects.map((project, _index) => (
                  <div key={project.id}>
                    <h4 className="text-base font-bold text-gray-900 mb-2.5">
                      {project.title}
                    </h4>
                    <p
                      className="text-gray-700 text-sm mb-3"
                      style={{ lineHeight: "1.7" }}
                    >
                      {project.description}
                    </p>
                    <ul className="list-disc list-outside space-y-1.5 text-sm text-gray-700 ml-5 mb-3">
                      {project.achievements?.map((achievement, i) => (
                        <li key={i} style={{ lineHeight: "1.6" }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        {t.technologies}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className={
                              atsMode
                                ? "px-2.5 py-1 text-gray-700 text-xs"
                                : "px-2.5 py-1 bg-gradient-to-r from-violet-50 to-blue-50 text-gray-700 text-xs rounded-full border border-violet-100"
                            }
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                <span className="inline-flex items-center gap-2">
                  {!atsMode && (
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  )}
                  {t.education}
                </span>
              </h3>
              <div className="space-y-5 pl-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-bold text-gray-900 mb-1">
                          {edu.degree}
                        </h4>
                        <p className="text-sm text-gray-700 font-medium">
                          {edu.institution}, {edu.location}
                        </p>
                      </div>
                      <p
                        className={
                          atsMode
                            ? "text-sm text-gray-600 font-semibold whitespace-nowrap ml-4"
                            : "text-sm text-gray-600 font-semibold whitespace-nowrap ml-4 bg-gray-50 px-3 py-1 rounded"
                        }
                      >
                        {edu.period}
                      </p>
                    </div>
                    {edu.description && (
                      <p
                        className="text-sm text-gray-600 mt-2"
                        style={{ lineHeight: "1.6" }}
                      >
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                <span className="inline-flex items-center gap-2">
                  {!atsMode && <Award className="w-6 h-6 text-amber-600" />}
                  {t.certifications}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pl-4">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {cert.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {cert.issuer} • {cert.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section className="mb-0">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                <span className="inline-flex items-center gap-2">
                  {!atsMode && <Languages className="w-6 h-6 text-green-600" />}
                  {t.languages}
                </span>
              </h3>
              <div className="flex gap-8 pl-4">
                {data.languages.map((lang, index) => (
                  <div
                    key={index}
                    className={
                      atsMode ? "px-4 py-2" : "bg-gray-50 px-4 py-2 rounded"
                    }
                  >
                    <span className="font-bold text-gray-900">
                      {lang.language}
                    </span>
                    <span className="text-gray-600 ml-2">
                      • {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
          }
          
          section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
