"use client";

import { PopupButton } from "react-calendly";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

interface CalendlyButtonProps {
  url?: string;
  text?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  prefill?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
}

export default function CalendlyButton({
  url,
  text = "Schedule a Call",
  className,
  variant = "primary",
  prefill,
  utm,
}: CalendlyButtonProps) {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  
  const calendlyUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL || "";

  useEffect(() => {
    setRootElement(document.getElementById("root") || document.body);
  }, []);

  // Determine button class based on variant
  const getButtonClass = () => {
    if (className) return className;
    
    switch (variant) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "outline":
        return "px-6 py-3 rounded-lg border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white transition-all duration-300 font-semibold flex items-center gap-2";
      default:
        return "btn-primary";
    }
  };

  if (!calendlyUrl || !rootElement) {
    return (
      <button
        className={getButtonClass()}
        disabled
        title="Calendly URL not configured"
      >
        <Calendar className="w-5 h-5" />
        {text}
      </button>
    );
  }

  return (
    <PopupButton
      url={calendlyUrl}
      rootElement={rootElement}
      text={text}
      className={getButtonClass()}
      prefill={prefill}
      utm={utm}
    />
  );
}
