"use client";

import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useEffect, useState } from "react";

interface CalendlyWidgetProps {
  url?: string;
  prefill?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  pageSettings?: {
    backgroundColor?: string;
    hideEventTypeDetails?: boolean;
    hideLandingPageDetails?: boolean;
    primaryColor?: string;
    textColor?: string;
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  styles?: React.CSSProperties;
  onEventScheduled?: (event: any) => void;
  onDateAndTimeSelected?: () => void;
  onEventTypeViewed?: () => void;
}

export default function CalendlyWidget({
  url,
  prefill,
  pageSettings,
  utm,
  styles = { height: "700px", width: "100%" },
  onEventScheduled,
  onDateAndTimeSelected,
  onEventTypeViewed,
}: CalendlyWidgetProps) {
  const [isClient, setIsClient] = useState(false);
  
  const calendlyUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set up event listeners for analytics and callbacks
  useCalendlyEventListener({
    onProfilePageViewed: () => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "calendly_profile_viewed", {
          event_category: "calendly",
          event_label: calendlyUrl,
        });
      }
    },
    onDateAndTimeSelected: () => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "calendly_date_selected", {
          event_category: "calendly",
          event_label: calendlyUrl,
        });
      }
      onDateAndTimeSelected?.();
    },
    onEventTypeViewed: () => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "calendly_event_type_viewed", {
          event_category: "calendly",
          event_label: calendlyUrl,
        });
      }
      onEventTypeViewed?.();
    },
    onEventScheduled: (e) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "calendly_event_scheduled", {
          event_category: "calendly",
          event_label: calendlyUrl,
          value: 1,
        });
      }
      onEventScheduled?.(e);
    },
  });

  if (!isClient) {
    // Show loading skeleton on server-side
    return (
      <div 
        className="w-full bg-surface rounded-lg animate-pulse"
        style={{ height: styles.height || "700px" }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-text-muted">Loading calendar...</div>
        </div>
      </div>
    );
  }

  if (!calendlyUrl) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 font-semibold mb-2">Calendly URL not configured</p>
        <p className="text-text-secondary text-sm">
          Please set NEXT_PUBLIC_CALENDLY_URL in your .env.local file
        </p>
      </div>
    );
  }

  return (
    <div className="calendly-widget-container w-full">
      <InlineWidget
        url={calendlyUrl}
        prefill={prefill}
        pageSettings={pageSettings}
        utm={utm}
        styles={styles}
      />
    </div>
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
