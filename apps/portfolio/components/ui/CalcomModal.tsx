"use client";

import { getCalApi } from "@calcom/embed-react";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface CalcomModalProps {
  calLink?: string;
  buttonText?: string;
  buttonClassName?: string;
  config?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    theme?: "light" | "dark" | "auto";
  };
  onEventScheduled?: (event: any) => void;
}

export default function CalcomModal({
  calLink,
  buttonText = "Schedule a Call",
  buttonClassName = "btn-primary",
  config,
  onEventScheduled,
}: CalcomModalProps) {
  const [isClient, setIsClient] = useState(false);
  
  const calUsername = calLink || process.env.NEXT_PUBLIC_CALCOM_USERNAME || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !calUsername) return;

    (async function () {
      const cal = await getCalApi();
      
      // Set up event listener for booking success
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "calcom_modal_booking", {
              event_category: "calcom",
              event_label: calUsername,
              value: 1,
            });
          }
          onEventScheduled?.(e);
        },
      });

      // Configure Cal.com UI
      cal("ui", {
        theme: config?.theme || "auto",
        styles: {
          branding: {
            brandColor: "#0ea5e9", // accent-primary color
          },
        },
      });
    })();
  }, [isClient, calUsername, config, onEventScheduled]);

  const handleOpenModal = async () => {
    if (!calUsername) return;

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "calcom_modal_opened", {
        event_category: "calcom",
        event_label: calUsername,
      });
    }

    const cal = await getCalApi();
    
    // Build config object with only defined values
    const calConfig: Record<string, any> = {};
    if (config?.name) calConfig.name = config.name;
    if (config?.email) calConfig.email = config.email;
    if (config?.notes) calConfig.notes = config.notes;
    if (config?.guests) calConfig.guests = config.guests;
    if (config?.theme) calConfig.theme = config.theme;
    
    cal("modal", {
      calLink: calUsername,
      config: calConfig,
    });
  };

  if (!isClient) {
    return (
      <button
        className={buttonClassName}
        disabled
        title="Loading..."
      >
        <Calendar className="w-5 h-5" />
        {buttonText}
      </button>
    );
  }

  if (!calUsername) {
    return (
      <button
        className={buttonClassName}
        disabled
        title="Cal.com username not configured"
      >
        <Calendar className="w-5 h-5" />
        {buttonText}
      </button>
    );
  }

  return (
    <button
      onClick={handleOpenModal}
      className={buttonClassName}
      type="button"
    >
      <Calendar className="w-5 h-5" />
      {buttonText}
    </button>
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
