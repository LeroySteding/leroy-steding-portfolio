"use client";

import { PopupModal, useCalendlyEventListener } from "react-calendly";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface CalendlyModalProps {
  url?: string;
  buttonText?: string;
  buttonClassName?: string;
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
  onEventScheduled?: (event: any) => void;
}

export default function CalendlyModal({
  url,
  buttonText = "Schedule a Call",
  buttonClassName = "btn-primary",
  prefill,
  utm,
  onEventScheduled,
}: CalendlyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  
  const calendlyUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL || "";

  useEffect(() => {
    setRootElement(document.getElementById("root") || document.body);
  }, []);

  // Set up event listeners
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "calendly_modal_booking", {
          event_category: "calendly",
          event_label: calendlyUrl,
          value: 1,
        });
      }
      onEventScheduled?.(e);
      // Auto-close modal after booking
      setTimeout(() => setIsOpen(false), 2000);
    },
  });

  const handleOpenModal = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "calendly_modal_opened", {
        event_category: "calendly",
        event_label: calendlyUrl,
      });
    }
    setIsOpen(true);
  };

  if (!calendlyUrl || !rootElement) {
    return (
      <button
        className={buttonClassName}
        disabled
        title="Calendly URL not configured"
      >
        <Calendar className="w-5 h-5" />
        {buttonText}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={buttonClassName}
        type="button"
      >
        <Calendar className="w-5 h-5" />
        {buttonText}
      </button>

      <PopupModal
        url={calendlyUrl}
        onModalClose={() => setIsOpen(false)}
        open={isOpen}
        rootElement={rootElement}
        prefill={prefill}
        utm={utm}
      />
    </>
  );
}

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: Record<string, any>
    ) => void;
  }
}
