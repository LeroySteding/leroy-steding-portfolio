"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

interface CalcomWidgetProps {
  calLink?: string;
  config?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    theme?: "light" | "dark" | "auto";
  };
  styles?: React.CSSProperties;
  onEventScheduled?: (event: any) => void;
  onDateAndTimeSelected?: () => void;
  onEventTypeViewed?: () => void;
}

export default function CalcomWidget({
  calLink,
  config,
  styles = { height: "700px", width: "100%" },
  onEventScheduled,
  onDateAndTimeSelected,
  onEventTypeViewed,
}: CalcomWidgetProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Get Cal.com event URL from config or env (e.g., "steding/consultation")
  const calEventUrl = calLink || process.env.NEXT_PUBLIC_CALCOM_URL || process.env.NEXT_PUBLIC_CALCOM_USERNAME || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !calEventUrl) return;

    (async function () {
      const cal = await getCalApi();
      
      // Set up event listeners for analytics and callbacks
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "calcom_event_scheduled", {
              event_category: "calcom",
              event_label: calEventUrl,
              value: 1,
            });
          }
          onEventScheduled?.(e);
        },
      });

      // Note: Cal.com doesn't have direct equivalents for date/time selection events
      // We only track the successful booking event

      // Configure Cal.com UI
      cal("ui", {
        theme: config?.theme || "auto",
        styles: {
          branding: {
            brandColor: "#0ea5e9", // accent-primary color
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [isClient, calEventUrl, config, onEventScheduled, onDateAndTimeSelected, onEventTypeViewed]);

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

  if (!calEventUrl) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 font-semibold mb-2">Cal.com event URL not configured</p>
        <p className="text-text-secondary text-sm">
          Please set NEXT_PUBLIC_CALCOM_URL in your .env.local file (e.g., "steding/consultation")
        </p>
      </div>
    );
  }

  // Build config object with only defined values
  const calConfig: Record<string, any> = {
    layout: 'month_view',
    hideEventTypeDetails: true
  };
  if (config?.name) calConfig.name = config.name;
  if (config?.email) calConfig.email = config.email;
  if (config?.notes) calConfig.notes = config.notes;
  if (config?.guests) calConfig.guests = config.guests;
  if (config?.theme) calConfig.theme = config.theme || 'dark';

  return (
    <div 
      className="calcom-widget-container overflow-hidden" 
    
    >
      <Cal
        style={{width:"100%",height:"100%",overflow:"scroll"}}
        calLink={calEventUrl}
        config={calConfig}
        embedJsUrl="https://app.cal.com/embed/embed.js"
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
