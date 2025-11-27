import { createClient } from "@supabase/supabase-js";

// Supabase client for server-side operations (API routes)
// Uses service role key for full access to leads table
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Supabase credentials not configured. Lead capture will be disabled.",
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseServiceKey || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Types for portfolio leads
export type LeadSource = "contact_form" | "newsletter" | "booking" | "chat";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "archived";

export interface PortfolioLead {
  id?: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: LeadSource;
  status?: LeadStatus;
  subject?: string;
  message?: string;
  subscribed_to_newsletter?: boolean;
  newsletter_confirmed?: boolean;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  locale?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

// Lead operations
export async function createLead(
  lead: Omit<PortfolioLead, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, skipping lead creation");
    return { success: true, id: "not-configured" };
  }

  try {
    const { data, error } = await supabase
      .from("portfolio_leads")
      .insert(lead)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.error("Error creating lead:", err);
    return { success: false, error: "Failed to create lead" };
  }
}

// Update existing lead (e.g., to mark newsletter as confirmed)
export async function updateLeadByEmail(
  email: string,
  updates: Partial<PortfolioLead>,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from("portfolio_leads")
      .update(updates)
      .eq("email", email);

    if (error) {
      console.error("Error updating lead:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Error updating lead:", err);
    return { success: false, error: "Failed to update lead" };
  }
}

// Check if email already exists as a lead
export async function getLeadByEmail(
  email: string,
): Promise<PortfolioLead | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("portfolio_leads")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error fetching lead:", error);
    }

    return data;
  } catch {
    return null;
  }
}

// Upsert lead - create or update if exists
export async function upsertLead(
  lead: Omit<PortfolioLead, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; id?: string; error?: string; isNew?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { success: true, id: "not-configured", isNew: true };
  }

  try {
    // Check if lead exists
    const existingLead = await getLeadByEmail(lead.email);

    if (existingLead) {
      // Update existing lead with new info
      const updates: Partial<PortfolioLead> = {
        ...lead,
        // Merge metadata
        metadata: {
          ...(existingLead.metadata || {}),
          ...(lead.metadata || {}),
          previous_interactions: [
            ...(((existingLead.metadata as Record<string, unknown>)
              ?.previous_interactions as unknown[]) || []),
            {
              source: lead.source,
              timestamp: new Date().toISOString(),
              subject: lead.subject,
            },
          ],
        },
      };

      // If they're subscribing to newsletter, update that flag
      if (lead.subscribed_to_newsletter) {
        updates.subscribed_to_newsletter = true;
      }

      const { error } = await supabase
        .from("portfolio_leads")
        .update(updates)
        .eq("id", existingLead.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, id: existingLead.id, isNew: false };
    }

    // Create new lead
    return createLead(lead);
  } catch (err) {
    console.error("Error upserting lead:", err);
    return { success: false, error: "Failed to upsert lead" };
  }
}
