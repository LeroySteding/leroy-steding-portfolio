"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  getCalendarProvider,
  isCalendarConfigured,
} from "@/lib/calendar-config";

// Dynamically import calendar widgets to avoid loading both
const CalendlyWidget = dynamic(() => import("./CalendlyWidget"), {
  loading: () => <CalendarLoadingSkeleton />,
  ssr: false,
});

const CalcomWidget = dynamic(() => import("./CalcomWidget"), {
  loading: () => <CalendarLoadingSkeleton />,
  ssr: false,
});

interface UniversalCalendarWidgetProps {
  // Common props
  url?: string;
  styles?: React.CSSProperties;
  onEventScheduled?: (event: any) => void;
  onDateAndTimeSelected?: () => void;
  onEventTypeViewed?: () => void;

  // Calendly-specific props
  calendlyPageSettings?: {
    backgroundColor?: string;
    hideEventTypeDetails?: boolean;
    hideLandingPageDetails?: boolean;
    primaryColor?: string;
    textColor?: string;
  };
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

  // Cal.com-specific props
  calcomConfig?: {
    name?: string;
    email?: string;
    notes?: string;
    guests?: string[];
    theme?: "light" | "dark" | "auto";
  };
}

function CalendarLoadingSkeleton() {
  return (
    <div
      className="w-full bg-surface rounded-lg animate-pulse flex items-center justify-center"
      style={{ height: "700px" }}
    >
      <div className="text-text-muted">Loading calendar...</div>
    </div>
  );
}

export default function UniversalCalendarWidget({
  url,
  styles = { height: "700px", width: "100%" },
  onEventScheduled,
  onDateAndTimeSelected,
  onEventTypeViewed,
  calendlyPageSettings,
  prefill,
  utm,
  calcomConfig,
}: UniversalCalendarWidgetProps) {
  const [isClient, setIsClient] = useState(false);
  const [provider, setProvider] = useState<"calendly" | "calcom">("calendly");

  useEffect(() => {
    setIsClient(true);
    setProvider(getCalendarProvider());
  }, []);

  if (!isClient) {
    return <CalendarLoadingSkeleton />;
  }

  if (!isCalendarConfigured()) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 font-semibold mb-2">
          Calendar not configured
        </p>
        <p className="text-text-secondary text-sm">
          Please set NEXT_PUBLIC_CALENDAR_PROVIDER and the corresponding URL in
          your .env.local file
        </p>
      </div>
    );
  }

  // Render based on provider
  if (provider === "calcom") {
    return (
      <CalcomWidget
        calLink={url}
        styles={styles}
        config={calcomConfig}
        onEventScheduled={onEventScheduled}
        onDateAndTimeSelected={onDateAndTimeSelected}
        onEventTypeViewed={onEventTypeViewed}
      />
    );
  }

  // Default to Calendly
  return (
    <CalendlyWidget
      url={url}
      styles={styles}
      pageSettings={calendlyPageSettings}
      prefill={prefill}
      utm={utm}
      onEventScheduled={onEventScheduled}
      onDateAndTimeSelected={onDateAndTimeSelected}
      onEventTypeViewed={onEventTypeViewed}
    />
  );
}
