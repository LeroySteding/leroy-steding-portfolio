import jsPDF from "jspdf";

export type CVVersion = "ats" | "tech" | "design";

interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
    technologies: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    achievements: string[];
    url?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    period: string;
    description?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}

export async function generateCVPDF(
  data: CVData,
  version: CVVersion,
  language: "en" | "nl",
  profileImageUrl?: string,
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Version-specific styling
  const colors =
    version === "design"
      ? {
          primary: [0, 255, 255] as [number, number, number],
          secondary: [138, 43, 226] as [number, number, number],
          text: [30, 30, 30] as [number, number, number],
        }
      : {
          primary: [0, 0, 0] as [number, number, number],
          secondary: [80, 80, 80] as [number, number, number],
          text: [0, 0, 0] as [number, number, number],
        };

  const useColors = version !== "ats";

  // Add profile picture if provided and not ATS version
  if (profileImageUrl && version !== "ats") {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = profileImageUrl;
      });

      doc.addImage(img, "JPEG", pageWidth - 40, yPosition, 30, 30);
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  }

  // Header - Personal Info
  doc.setFontSize(version === "ats" ? 16 : 24);
  doc.setFont("helvetica", "bold");
  if (useColors) doc.setTextColor(...colors.primary);
  doc.text(data.personalInfo.name, 20, yPosition);
  yPosition += 8;

  doc.setFontSize(version === "ats" ? 12 : 14);
  doc.setFont("helvetica", "normal");
  if (useColors) doc.setTextColor(...colors.secondary);
  doc.text(data.personalInfo.title, 20, yPosition);
  yPosition += 10;

  // Contact Info
  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  const contactInfo = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.website,
    data.personalInfo.linkedin,
    data.personalInfo.github,
  ]
    .filter(Boolean)
    .join(" | ");

  doc.text(contactInfo, 20, yPosition);
  yPosition += 8;

  // Add line separator (not for ATS)
  if (version !== "ats") {
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;
  } else {
    yPosition += 3;
  }

  // Professional Summary
  doc.setFontSize(version === "ats" ? 11 : 12);
  doc.setFont("helvetica", "bold");
  if (useColors) doc.setTextColor(...colors.primary);
  doc.text(
    language === "en" ? "PROFESSIONAL SUMMARY" : "PROFESSIONELE SAMENVATTING",
    20,
    yPosition,
  );
  yPosition += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.text);
  const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 40);
  doc.text(summaryLines, 20, yPosition);
  yPosition += summaryLines.length * 5 + 8;

  // Skills
  doc.setFontSize(version === "ats" ? 11 : 12);
  doc.setFont("helvetica", "bold");
  if (useColors) doc.setTextColor(...colors.primary);
  doc.text(
    language === "en" ? "CORE COMPETENCIES" : "KERNCOMPETENTIES",
    20,
    yPosition,
  );
  yPosition += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.text);

  data.skills.forEach((skillCategory) => {
    const skillText = `${skillCategory.category}: ${skillCategory.items.join(", ")}`;
    const skillLines = doc.splitTextToSize(skillText, pageWidth - 40);

    if (yPosition + skillLines.length * 5 > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(skillLines, 20, yPosition);
    yPosition += skillLines.length * 5 + 3;
  });
  yPosition += 5;

  // Professional Experience
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(version === "ats" ? 11 : 12);
  doc.setFont("helvetica", "bold");
  if (useColors) doc.setTextColor(...colors.primary);
  doc.text(
    language === "en" ? "PROFESSIONAL EXPERIENCE" : "PROFESSIONELE ERVARING",
    20,
    yPosition,
  );
  yPosition += 6;

  data.experience.forEach((exp, _index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.text);
    doc.text(exp.title, 20, yPosition);
    yPosition += 5;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    if (useColors) doc.setTextColor(...colors.secondary);
    doc.text(`${exp.company} | ${exp.location}`, 20, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "italic");
    doc.setTextColor(...colors.text);
    doc.text(exp.period, 20, yPosition);
    yPosition += 5;

    // Description
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(exp.description, pageWidth - 40);
    if (yPosition + descLines.length * 4.5 > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(descLines, 20, yPosition);
    yPosition += descLines.length * 4.5 + 2;

    // Achievements
    exp.achievements.forEach((achievement) => {
      const bulletLines = doc.splitTextToSize(
        `• ${achievement}`,
        pageWidth - 40,
      );

      if (yPosition + bulletLines.length * 4.5 > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(bulletLines, 20, yPosition);
      yPosition += bulletLines.length * 4.5;
    });

    // Technologies
    if (version !== "ats") {
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      if (useColors) doc.setTextColor(...colors.secondary);
      const techText = `Technologies: ${exp.technologies.join(", ")}`;
      const techLines = doc.splitTextToSize(techText, pageWidth - 40);
      if (yPosition + techLines.length * 4 > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(techLines, 20, yPosition);
      yPosition += techLines.length * 4 + 5;
      doc.setTextColor(...colors.text);
    } else {
      yPosition += 3;
    }
  });

  // Education
  if (data.education && data.education.length > 0) {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(version === "ats" ? 11 : 12);
    doc.setFont("helvetica", "bold");
    if (useColors) doc.setTextColor(...colors.primary);
    doc.text(language === "en" ? "EDUCATION" : "OPLEIDING", 20, yPosition);
    yPosition += 6;

    data.education.forEach((edu) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.text);
      doc.text(edu.degree, 20, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      if (useColors) doc.setTextColor(...colors.secondary);
      doc.text(`${edu.institution} | ${edu.period}`, 20, yPosition);
      yPosition += 5;

      if (edu.location) {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...colors.text);
        doc.text(edu.location, 20, yPosition);
        yPosition += 5;
      }

      yPosition += 3;
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(version === "ats" ? 11 : 12);
    doc.setFont("helvetica", "bold");
    if (useColors) doc.setTextColor(...colors.primary);
    doc.text(
      language === "en" ? "KEY PROJECTS" : "BELANGRIJKSTE PROJECTEN",
      20,
      yPosition,
    );
    yPosition += 6;

    data.projects.forEach((project) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.text);
      doc.text(project.name, 20, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(
        project.description,
        pageWidth - 40,
      );
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 4.5 + 2;

      // Achievements
      project.achievements.forEach((achievement) => {
        const bulletLines = doc.splitTextToSize(
          `• ${achievement}`,
          pageWidth - 40,
        );
        if (yPosition + bulletLines.length * 4.5 > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(bulletLines, 20, yPosition);
        yPosition += bulletLines.length * 4.5;
      });

      // Technologies
      if (version !== "ats") {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        if (useColors) doc.setTextColor(...colors.secondary);
        const techText = `Technologies: ${project.technologies.join(", ")}`;
        const techLines = doc.splitTextToSize(techText, pageWidth - 40);
        doc.text(techLines, 20, yPosition);
        yPosition += techLines.length * 4 + 5;
        doc.setTextColor(...colors.text);
      } else {
        yPosition += 3;
      }
    });
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(version === "ats" ? 11 : 12);
    doc.setFont("helvetica", "bold");
    if (useColors) doc.setTextColor(...colors.primary);
    doc.text(
      language === "en" ? "CERTIFICATIONS" : "CERTIFICERINGEN",
      20,
      yPosition,
    );
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);
    data.certifications.forEach((cert) => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${cert.name} - ${cert.issuer} (${cert.date})`, 20, yPosition);
      yPosition += 5;
    });
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(version === "ats" ? 11 : 12);
    doc.setFont("helvetica", "bold");
    if (useColors) doc.setTextColor(...colors.primary);
    doc.text(language === "en" ? "LANGUAGES" : "TALEN", 20, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);
    data.languages.forEach((lang) => {
      doc.text(`${lang.language}: ${lang.proficiency}`, 20, yPosition);
      yPosition += 5;
    });
  }

  // Generate filename
  const versionLabel =
    version === "ats" ? "ATS" : version === "tech" ? "Tech" : "Design";
  const filename = `Leroy_Steding_CV_${versionLabel}_${language.toUpperCase()}.pdf`;

  // Save PDF
  doc.save(filename);
}
