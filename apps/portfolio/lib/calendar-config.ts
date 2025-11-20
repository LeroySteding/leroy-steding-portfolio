// Calendar provider configuration
export type CalendarProvider = "calendly" | "calcom";

export interface CalendarConfig {
  provider: CalendarProvider;
  url: string;
  username?: string;
}

// Get the active calendar provider from environment
export function getCalendarProvider(): CalendarProvider {
  const provider = process.env.NEXT_PUBLIC_CALENDAR_PROVIDER as CalendarProvider;
  return provider || "calendly"; // Default to Calendly
}

// Get calendar configuration based on active provider
export function getCalendarConfig(): CalendarConfig {
  const provider = getCalendarProvider();

  if (provider === "calcom") {
    return {
      provider: "calcom",
      url: process.env.NEXT_PUBLIC_CALCOM_URL || "",
      username: process.env.NEXT_PUBLIC_CALCOM_USERNAME || "",
    };
  }

  // Default to Calendly
  return {
    provider: "calendly",
    url: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
    username: process.env.NEXT_PUBLIC_CALENDLY_USERNAME || "",
  };
}

// Check if calendar is configured
export function isCalendarConfigured(): boolean {
  const config = getCalendarConfig();
  return !!config.url;
}

// Get calendar URL for direct links
export function getCalendarUrl(): string {
  const config = getCalendarConfig();
  return config.url;
}
