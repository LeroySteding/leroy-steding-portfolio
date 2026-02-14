import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

// Initialize Convex client for server-side usage
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn(
    "NEXT_PUBLIC_CONVEX_URL not configured — lead capture will be disabled",
  );
}

export const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Check if Convex is properly configured
export function isConvexConfigured(): boolean {
  return Boolean(convexUrl && convex);
}

// Upsert lead (create or update)
export async function upsertLead(data: {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: "contact_form" | "newsletter" | "chat" | "booking";
  subject?: string;
  message?: string;
  subscribedToNewsletter?: boolean;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  locale?: string;
  metadata?: Record<string, any>;
}) {
  if (!convex) {
    console.warn("Convex not configured, skipping lead upsert");
    return { success: false, error: "Not configured", id: "not-configured" };
  }

  try {
    // Map contact_form to contact for Convex schema
    const source = data.source === "contact_form" ? "contact" : data.source;

    const leadId = await convex.mutation(api.leads.upsertLead, {
      email: data.email,
      name: data.name,
      source,
      message: data.message,
      subject: data.subject,
      phone: data.phone,
      company: data.company,
      metadata: {
        ...data.metadata,
        subscribedToNewsletter: data.subscribedToNewsletter,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        locale: data.locale,
      },
    });

    return { success: true, id: leadId };
  } catch (error) {
    console.error("Failed to upsert lead in Convex:", error);
    return { success: false, error: String(error) };
  }
}

// Get lead by email
export async function getLeadByEmail(email: string) {
  if (!convex) {
    console.warn("Convex not configured, skipping lead lookup");
    return null;
  }

  try {
    return await convex.query(api.leads.getLeadByEmail, { email });
  } catch (error) {
    console.error("Failed to get lead by email:", error);
    return null;
  }
}

// Update lead by email
export async function updateLeadByEmail(
  email: string,
  updates: {
    name?: string;
    phone?: string;
    company?: string;
    status?: "new" | "contacted" | "qualified" | "converted" | "archived";
    bookingUrl?: string;
    metadata?: Record<string, any>;
  },
) {
  if (!convex) {
    console.warn("Convex not configured, skipping lead update");
    return { success: false, error: "Not configured" };
  }

  try {
    const leadId = await convex.mutation(api.leads.updateLeadByEmail, {
      email,
      ...updates,
    });

    return { success: true, id: leadId };
  } catch (error) {
    console.error("Failed to update lead:", error);
    return { success: false, error: String(error) };
  }
}

// Create detailed contact submission
export async function createContactSubmission(data: {
  email: string;
  name: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  if (!convex) {
    console.warn("Convex not configured, skipping contact submission");
    return { success: false, error: "Not configured" };
  }

  try {
    const result = await convex.mutation(
      api.leads.createContactSubmission,
      data,
    );
    return { success: true, ...result };
  } catch (error) {
    console.error("Failed to create contact submission:", error);
    return { success: false, error: String(error) };
  }
}
