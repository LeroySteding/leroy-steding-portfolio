// Type definitions for Cal.com and Calendly integrations

// Re-export types from @calcom/embed-core for proper typing
import type {
  PrefillAndIframeAttrsConfig,
  EmbedEvent,
} from "@calcom/embed-core";

// Cal.com Types - matches the actual library types
export type CalConfig = PrefillAndIframeAttrsConfig;

// Use the actual event type from Cal.com embed-core
export type CalBookingSuccessfulEvent = EmbedEvent<"bookingSuccessful">;

// Calendly Types - matches react-calendly library
export interface CalendlyEventScheduledEvent extends MessageEvent {
  data: {
    event: string;
    payload: {
      event: {
        uri: string;
      };
      invitee: {
        uri: string;
      };
    };
  };
}

// Google Analytics Types
export interface GtagParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface GtagFunction {
  (command: "event", action: string, params: GtagParams): void;
  (command: string, ...args: unknown[]): void;
}

// Global Window Extensions
declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}
