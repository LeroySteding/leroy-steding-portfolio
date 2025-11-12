"use client";

import { Download, FileText, Palette } from "lucide-react";
import { useState } from "react";

export type CVVersion = "ats" | "tech" | "design";

interface CVDownloadOptionsProps {
  onDownload: (version: CVVersion) => void;
  language: "en" | "nl";
}

export default function CVDownloadOptions({ onDownload, language }: CVDownloadOptionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (version: CVVersion) => {
    setIsDownloading(true);
    await onDownload(version);
    setIsDownloading(false);
  };

  const downloadOptions = {
    en: {
      title: "Download CV",
      ats: {
        label: "ATS Optimized",
        description: "Simple format for applicant tracking systems"
      },
      tech: {
        label: "Tech Version",
        description: "Technical details and projects highlighted"
      },
      design: {
        label: "Design Version",
        description: "Visual design with colors and styling"
      }
    },
    nl: {
      title: "Download CV",
      ats: {
        label: "ATS Geoptimaliseerd",
        description: "Eenvoudig formaat voor sollicitatie systemen"
      },
      tech: {
        label: "Tech Versie",
        description: "Technische details en projecten uitgelicht"
      },
      design: {
        label: "Design Versie",
        description: "Visueel ontwerp met kleuren en styling"
      }
    }
  };

  const t = downloadOptions[language];

  return (
    <div className="fixed top-4 right-4 z-50 print:hidden">
      <div className="bg-cyber-darker border border-cyber-gray-light rounded-xl p-4 shadow-2xl backdrop-blur-md">
        <h3 className="text-lg font-display font-bold text-text-primary mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-neon-cyan" />
          {t.title}
        </h3>
        
        <div className="space-y-3">
          {/* ATS Version */}
          <button
            onClick={() => handleDownload("ats")}
            disabled={isDownloading}
            className="w-full flex items-start gap-3 p-3 rounded-lg bg-cyber-gray hover:bg-cyber-gray-light transition-all duration-200 group text-left disabled:opacity-50"
          >
            <FileText className="w-5 h-5 text-neon-cyan mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-text-primary group-hover:text-neon-cyan transition-colors">
                {t.ats.label}
              </div>
              <div className="text-xs text-text-secondary">
                {t.ats.description}
              </div>
            </div>
          </button>

          {/* Tech Version */}
          <button
            onClick={() => handleDownload("tech")}
            disabled={isDownloading}
            className="w-full flex items-start gap-3 p-3 rounded-lg bg-cyber-gray hover:bg-cyber-gray-light transition-all duration-200 group text-left disabled:opacity-50"
          >
            <FileText className="w-5 h-5 text-neon-violet mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-text-primary group-hover:text-neon-violet transition-colors">
                {t.tech.label}
              </div>
              <div className="text-xs text-text-secondary">
                {t.tech.description}
              </div>
            </div>
          </button>

          {/* Design Version */}
          <button
            onClick={() => handleDownload("design")}
            disabled={isDownloading}
            className="w-full flex items-start gap-3 p-3 rounded-lg bg-cyber-gray hover:bg-cyber-gray-light transition-all duration-200 group text-left disabled:opacity-50"
          >
            <Palette className="w-5 h-5 text-neon-cyan mt-0.5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-text-primary group-hover:text-neon-cyan transition-colors">
                {t.design.label}
              </div>
              <div className="text-xs text-text-secondary">
                {t.design.description}
              </div>
            </div>
          </button>
        </div>

        {isDownloading && (
          <div className="mt-3 text-xs text-center text-neon-cyan animate-pulse">
            {language === "en" ? "Generating PDF..." : "PDF genereren..."}
          </div>
        )}
      </div>
    </div>
  );
}
