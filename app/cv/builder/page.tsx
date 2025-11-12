"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cvData } from "@/data/cv";
import { cvDataNL } from "@/data/cv-nl";
import { ResumeBuilderProvider, useResumeBuilder } from "@/contexts/ResumeBuilderContext";
import { EditableField } from "@/components/cv/EditableField";
import { EditableList } from "@/components/cv/EditableList";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Save,
  Download,
  Eye,
  Palette,
  Undo,
  Sparkles,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Languages,
  Globe,
} from "lucide-react";

function ResumeBuilderContent() {
  const { language } = useLanguage();
  const {
    cvData: data,
    isEditing,
    setIsEditing,
    customization,
    updateCustomization,
    resetToOriginal,
    exportData,
  } = useResumeBuilder();

  const [showCustomization, setShowCustomization] = useState(false);

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    const element = document.getElementById("cv-preview");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${data.personalInfo.name.replace(/\s+/g, "_")}_CV.pdf`);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(exportData(), null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cv-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const t = {
    title: language === "nl" ? "CV Builder" : "Resume Builder",
    editMode: language === "nl" ? "Bewerkingsmodus" : "Edit Mode",
    customize: language === "nl" ? "Aanpassen" : "Customize",
    preview: language === "nl" ? "Voorbeeld" : "Preview",
    download: language === "nl" ? "Download PDF" : "Download PDF",
    reset: language === "nl" ? "Reset" : "Reset",
    export: language === "nl" ? "Exporteer Data" : "Export Data",
    save: language === "nl" ? "Opslaan" : "Save",
    summary: language === "nl" ? "Samenvatting" : "Professional Summary",
    coreCompetencies: language === "nl" ? "Kerncompetenties" : "Core Competencies",
    experience: language === "nl" ? "Werkervaring" : "Professional Experience",
    projects: language === "nl" ? "Projecten" : "Key Projects",
    education: language === "nl" ? "Opleiding" : "Education",
    certifications: language === "nl" ? "Certificaten" : "Certifications",
    languages: language === "nl" ? "Talen" : "Languages",
    technologies: language === "nl" ? "Technologieën" : "Technologies",
    achievements: language === "nl" ? "Prestaties" : "Key Achievements",
  };

  // Apply customization styles
  const customStyles = {
    fontFamily:
      customization.fontFamily === "roboto"
        ? "Roboto, sans-serif"
        : customization.fontFamily === "merriweather"
        ? "Merriweather, serif"
        : customization.fontFamily === "playfair"
        ? "Playfair Display, serif"
        : "Inter, sans-serif",
    fontSize:
      customization.fontSize === "small"
        ? "0.9rem"
        : customization.fontSize === "large"
        ? "1.1rem"
        : "1rem",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/cv"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to CV</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isEditing
                    ? "bg-cyan-500 text-white hover:bg-cyan-600"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">{t.editMode}</span>
              </button>

              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">{t.customize}</span>
              </button>

              <button
                onClick={resetToOriginal}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                title={t.reset}
              >
                <Undo className="w-4 h-4" />
                <span className="hidden sm:inline">{t.reset}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t.download}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Customization Sidebar */}
          {showCustomization && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-violet-600" />
                  Customization
                </h3>

                {/* Color Scheme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["default", "professional", "modern", "creative"] as const).map(
                      (scheme) => (
                        <button
                          key={scheme}
                          onClick={() => updateCustomization({ colorScheme: scheme })}
                          className={`px-3 py-2 rounded-lg border-2 text-sm capitalize transition-colors ${
                            customization.colorScheme === scheme
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                              : "border-gray-200 dark:border-gray-700 hover:border-violet-300"
                          }`}
                        >
                          {scheme}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Family
                  </label>
                  <select
                    value={customization.fontFamily}
                    onChange={(e) =>
                      updateCustomization({
                        fontFamily: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="inter">Inter (Sans-serif)</option>
                    <option value="roboto">Roboto (Sans-serif)</option>
                    <option value="merriweather">Merriweather (Serif)</option>
                    <option value="playfair">Playfair Display (Serif)</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateCustomization({ fontSize: size })}
                        className={`px-3 py-2 rounded-lg border-2 text-sm capitalize transition-colors ${
                          customization.fontSize === size
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                            : "border-gray-200 dark:border-gray-700 hover:border-violet-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["compact", "normal", "relaxed"] as const).map((spacing) => (
                      <button
                        key={spacing}
                        onClick={() => updateCustomization({ spacing })}
                        className={`px-3 py-2 rounded-lg border-2 text-sm capitalize transition-colors ${
                          customization.spacing === spacing
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                            : "border-gray-200 dark:border-gray-700 hover:border-violet-300"
                        }`}
                      >
                        {spacing}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={customization.accentColor}
                    onChange={(e) =>
                      updateCustomization({ accentColor: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CV Preview */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div
                id="cv-preview"
                className="max-w-[210mm] mx-auto bg-white p-10 sm:p-14"
                style={customStyles}
              >
                {/* Gradient Header Bar */}
                <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-500 mb-8" />

                {/* Header Section */}
                <div className="relative mb-10">
                  <div className="pr-36">
                    <EditableField
                      path="personalInfo.name"
                      value={data.personalInfo.name}
                      className="text-4xl font-bold text-gray-900 mb-2"
                    />
                    <EditableField
                      path="personalInfo.title"
                      value={data.personalInfo.title}
                      className="text-xl text-gray-600 mb-4"
                    />

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                      <EditableField
                        path="personalInfo.email"
                        value={data.personalInfo.email}
                        className="hover:text-cyan-600"
                      />
                      <EditableField
                        path="personalInfo.location"
                        value={data.personalInfo.location}
                      />
                      <EditableField
                        path="personalInfo.linkedin"
                        value={data.personalInfo.linkedin}
                        className="hover:text-cyan-600"
                      />
                      <EditableField
                        path="personalInfo.github"
                        value={data.personalInfo.github}
                        className="hover:text-cyan-600"
                      />
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div className="absolute top-0 right-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-full blur-sm opacity-30" />
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
                </div>

                {/* Professional Summary */}
                <section className="mb-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-violet-600" />
                      {t.summary}
                    </span>
                  </h3>
                  <EditableField
                    path="summary"
                    value={data.summary}
                    multiline
                    className="text-gray-700 leading-relaxed"
                  />
                </section>

                {/* Core Competencies */}
                <section className="mb-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                    {t.coreCompetencies}
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {data.skills.map((skillGroup, index) => (
                      <div key={index}>
                        <EditableField
                          path={`skills[${index}].category`}
                          value={skillGroup.category}
                          className="font-semibold text-gray-900 mb-2"
                        />
                        <EditableList
                          path={`skills[${index}].items`}
                          items={skillGroup.items}
                          className="flex flex-wrap gap-2"
                          itemClassName="px-2.5 py-1 bg-gradient-to-r from-cyan-50 to-violet-50 text-gray-700 text-xs rounded-full border border-cyan-100"
                          renderItem={(item, itemIndex) => (
                            <EditableField
                              path={`skills[${index}].items[${itemIndex}]`}
                              value={item}
                              className="px-2.5 py-1 bg-gradient-to-r from-cyan-50 to-violet-50 text-gray-700 text-xs rounded-full border border-cyan-100"
                            />
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Professional Experience */}
                <section className="mb-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-cyan-600" />
                      {t.experience}
                    </span>
                  </h3>
                  {data.experience.map((exp, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <EditableField
                            path={`experience[${index}].title`}
                            value={exp.title}
                            className="text-lg font-bold text-gray-900"
                          />
                          <EditableField
                            path={`experience[${index}].company`}
                            value={exp.company}
                            className="text-base font-semibold text-cyan-600"
                          />
                          <EditableField
                            path={`experience[${index}].location`}
                            value={exp.location}
                            className="text-sm text-gray-600"
                          />
                        </div>
                        <EditableField
                          path={`experience[${index}].period`}
                          value={exp.period}
                          className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap ml-4"
                        />
                      </div>
                      <EditableField
                        path={`experience[${index}].description`}
                        value={exp.description}
                        multiline
                        className="text-sm text-gray-700 mb-3 leading-relaxed"
                      />
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            {t.achievements}:
                          </p>
                          <EditableList
                            path={`experience[${index}].achievements`}
                            items={exp.achievements}
                            itemClassName="text-sm text-gray-700 leading-relaxed"
                          />
                        </div>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            {t.technologies}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.slice(0, 8).map((tech, techIndex) => (
                              <EditableField
                                key={techIndex}
                                path={`experience[${index}].technologies[${techIndex}]`}
                                value={tech}
                                className="px-2.5 py-1 bg-gradient-to-r from-cyan-50 to-violet-50 text-gray-700 text-xs rounded-full border border-cyan-100"
                              />
                            ))}
                            {exp.technologies.length > 8 && (
                              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{exp.technologies.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </section>

                {/* Key Projects */}
                <section className="mb-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <FolderGit2 className="w-6 h-6 text-violet-600" />
                      {t.projects}
                    </span>
                  </h3>
                  {data.projects.map((project, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <EditableField
                        path={`projects[${index}].name`}
                        value={project.name}
                        className="text-lg font-bold text-gray-900 mb-2"
                      />
                      <EditableField
                        path={`projects[${index}].description`}
                        value={project.description}
                        multiline
                        className="text-sm text-gray-700 mb-3 leading-relaxed"
                      />
                      {project.achievements && project.achievements.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            {t.achievements}:
                          </p>
                          <EditableList
                            path={`projects[${index}].achievements`}
                            items={project.achievements}
                            itemClassName="text-sm text-gray-700 leading-relaxed"
                          />
                        </div>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            {t.technologies}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <EditableField
                                key={techIndex}
                                path={`projects[${index}].technologies[${techIndex}]`}
                                value={tech}
                                className="px-2.5 py-1 bg-gradient-to-r from-violet-50 to-blue-50 text-gray-700 text-xs rounded-full border border-violet-100"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </section>

                {/* Education */}
                <section className="mb-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                      {t.education}
                    </span>
                  </h3>
                  {data.education.map((edu, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <EditableField
                            path={`education[${index}].degree`}
                            value={edu.degree}
                            className="text-base font-bold text-gray-900"
                          />
                          <EditableField
                            path={`education[${index}].institution`}
                            value={edu.institution}
                            className="text-sm font-semibold text-blue-600"
                          />
                          <EditableField
                            path={`education[${index}].location`}
                            value={edu.location}
                            className="text-sm text-gray-600"
                          />
                        </div>
                        <EditableField
                          path={`education[${index}].period`}
                          value={edu.period}
                          className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap ml-4"
                        />
                      </div>
                      {edu.description && (
                        <EditableField
                          path={`education[${index}].description`}
                          value={edu.description}
                          className="text-sm text-gray-600 italic"
                        />
                      )}
                    </div>
                  ))}
                </section>

                {/* Certifications */}
                <section className="mb-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <Award className="w-6 h-6 text-amber-600" />
                      {t.certifications}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <EditableField
                            path={`certifications[${index}].name`}
                            value={cert.name}
                            className="text-sm font-semibold text-gray-900"
                          />
                          <EditableField
                            path={`certifications[${index}].issuer`}
                            value={cert.issuer}
                            className="text-xs text-gray-600"
                          />
                        </div>
                        <EditableField
                          path={`certifications[${index}].date`}
                          value={cert.date}
                          className="text-xs text-gray-600 bg-amber-50 px-2 py-1 rounded whitespace-nowrap ml-2"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Languages */}
                <section>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 pb-3 border-b-2 border-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <Languages className="w-6 h-6 text-green-600" />
                      {t.languages}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {data.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-100"
                      >
                        <Globe className="w-4 h-4 text-green-600" />
                        <div>
                          <EditableField
                            path={`languages[${index}].language`}
                            value={lang.language}
                            className="text-sm font-semibold text-gray-900"
                          />
                          <EditableField
                            path={`languages[${index}].proficiency`}
                            value={lang.proficiency}
                            className="text-xs text-gray-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  const { language } = useLanguage();
  const initialData = language === "nl" ? cvDataNL : cvData;

  return (
    <ResumeBuilderProvider initialData={initialData}>
      <ResumeBuilderContent />
    </ResumeBuilderProvider>
  );
}
