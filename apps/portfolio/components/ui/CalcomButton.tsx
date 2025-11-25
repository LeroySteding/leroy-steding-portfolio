"use client";

import { getCalApi } from "@calcom/embed-react";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import type { CalConfig } from "@/types/calendar";

interface CalcomButtonProps {
  calLink?: string;
  text?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  config?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    theme?: "light" | "dark" | "auto";
  };
}

export default function CalcomButton({
  calLink,
  text = "Schedule a Call",
  className,
  variant = "primary",
  config,
}: CalcomButtonProps) {
  const [isClient, setIsClient] = useState(false);

  const calUsername = calLink || process.env.NEXT_PUBLIC_CALCOM_USERNAME || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !calUsername) return;

    (async () => {
      const cal = await getCalApi();

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
  }, [isClient, calUsername, config]);

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

  const handleClick = async () => {
    if (!calUsername) return;

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "calcom_popup_opened", {
        event_category: "calcom",
        event_label: calUsername,
      });
    }

    const cal = await getCalApi();

    // Build config object with only defined values
    const calConfig: CalConfig = {};
    if (config?.name) calConfig.name = config.name;
    if (config?.email) calConfig.email = config.email;
    if (config?.notes) calConfig.notes = config.notes;
    if (config?.guests) calConfig.guests = config.guests.join(",");

    cal("modal", {
      calLink: calUsername,
      config: calConfig,
    });
  };

  if (!isClient) {
    return (
      <button
        type="button"
        className={getButtonClass()}
        disabled
        title="Loading..."
      >
        <Calendar className="w-5 h-5" />
        {text}
      </button>
    );
  }

  if (!calUsername) {
    return (
      <button
        type="button"
        className={getButtonClass()}
        disabled
        title="Cal.com username not configured"
      >
        <Calendar className="w-5 h-5" />
        {text}
      </button>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={getButtonClass()}>
      <Calendar className="w-5 h-5" />
      {text}
    </button>
  );
}

// Note: Window.gtag type is defined in @/types/calendar.d.ts
