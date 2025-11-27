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
  lead_score?: number;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

// Lead scoring configuration
interface LeadScoringFactors {
  // Source scoring (0-25 points)
  sourceScores: Record<LeadSource, number>;
  // Engagement indicators (0-25 points)
  hasName: number;
  hasCompany: number;
  hasPhone: number;
  hasMessage: number;
  subscribedToNewsletter: number;
  // Content quality (0-25 points)
  messageLength: { short: number; medium: number; long: number };
  mentionsProject: number;
  mentionsBudget: number;
  mentionsTimeline: number;
  mentionsUrgent: number;
  // Context signals (0-25 points)
  hasUtmSource: number;
  linkedinReferrer: number;
  directVisit: number;
  returnVisitor: number;
}

const SCORING_CONFIG: LeadScoringFactors = {
  sourceScores: {
    booking: 25, // Highest intent - scheduling a call
    contact_form: 20, // High intent - filled out form
    chat: 15, // Medium intent - engaged with AI
    newsletter: 10, // Low intent - just wants updates
  },
  hasName: 5,
  hasCompany: 8,
  hasPhone: 7,
  hasMessage: 5,
  subscribedToNewsletter: 3,
  messageLength: {
    short: 2, // < 50 chars
    medium: 5, // 50-200 chars
    long: 10, // > 200 chars
  },
  mentionsProject: 8,
  mentionsBudget: 10,
  mentionsTimeline: 7,
  mentionsUrgent: 5,
  hasUtmSource: 3,
  linkedinReferrer: 5,
  directVisit: 2,
  returnVisitor: 10,
};

// Calculate lead score based on available data
export function calculateLeadScore(lead: Partial<PortfolioLead>): number {
  let score = 0;

  // Source scoring
  if (lead.source) {
    score += SCORING_CONFIG.sourceScores[lead.source] || 0;
  }

  // Engagement indicators
  if (lead.name && lead.name.trim().length > 0) score += SCORING_CONFIG.hasName;
  if (lead.company && lead.company.trim().length > 0)
    score += SCORING_CONFIG.hasCompany;
  if (lead.phone && lead.phone.trim().length > 0)
    score += SCORING_CONFIG.hasPhone;
  if (lead.message && lead.message.trim().length > 0)
    score += SCORING_CONFIG.hasMessage;
  if (lead.subscribed_to_newsletter)
    score += SCORING_CONFIG.subscribedToNewsletter;

  // Content quality (analyze message)
  if (lead.message) {
    const messageLength = lead.message.length;
    if (messageLength > 200) {
      score += SCORING_CONFIG.messageLength.long;
    } else if (messageLength > 50) {
      score += SCORING_CONFIG.messageLength.medium;
    } else {
      score += SCORING_CONFIG.messageLength.short;
    }

    const messageLower = lead.message.toLowerCase();
    // Project intent signals
    if (
      /\b(project|website|app|platform|build|develop|create)\b/.test(
        messageLower,
      )
    ) {
      score += SCORING_CONFIG.mentionsProject;
    }
    // Budget signals
    if (/\b(budget|cost|price|rate|invest|spend)\b/.test(messageLower)) {
      score += SCORING_CONFIG.mentionsBudget;
    }
    // Timeline signals
    if (
      /\b(deadline|timeline|when|asap|urgent|soon|month|week)\b/.test(
        messageLower,
      )
    ) {
      score += SCORING_CONFIG.mentionsTimeline;
    }
    // Urgency signals
    if (/\b(urgent|asap|immediately|rush|critical)\b/.test(messageLower)) {
      score += SCORING_CONFIG.mentionsUrgent;
    }
  }

  // Subject analysis (for contact forms)
  if (lead.subject) {
    const subjectLower = lead.subject.toLowerCase();
    if (/\b(project|hire|collaborate|opportunity)\b/.test(subjectLower)) {
      score += 5;
    }
  }

  // Context signals
  if (lead.utm_source) score += SCORING_CONFIG.hasUtmSource;
  if (lead.referrer?.includes("linkedin"))
    score += SCORING_CONFIG.linkedinReferrer;
  if (!lead.referrer || lead.referrer === "")
    score += SCORING_CONFIG.directVisit;

  // Metadata-based scoring (for return visitors, chat engagement, etc.)
  if (lead.metadata) {
    const metadata = lead.metadata as Record<string, unknown>;
    if (
      metadata.previous_interactions &&
      Array.isArray(metadata.previous_interactions)
    ) {
      score += SCORING_CONFIG.returnVisitor;
    }
    // Chat-specific scoring
    if (metadata.intent_score && typeof metadata.intent_score === "number") {
      // Add up to 15 points based on chat intent score (0-100 mapped to 0-15)
      score += Math.round((metadata.intent_score / 100) * 15);
    }
    if (metadata.message_count && typeof metadata.message_count === "number") {
      // Engaged chat users (5+ messages) get bonus
      if (metadata.message_count >= 5) score += 5;
      else if (metadata.message_count >= 3) score += 3;
    }
  }

  // Cap at 100
  return Math.min(score, 100);
}

// Get lead quality tier based on score
export function getLeadTier(score: number): "hot" | "warm" | "cool" | "cold" {
  if (score >= 70) return "hot";
  if (score >= 50) return "warm";
  if (score >= 30) return "cool";
  return "cold";
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

// Lead operations
export async function createLead(
  lead: Omit<PortfolioLead, "id" | "created_at" | "updated_at">,
): Promise<{
  success: boolean;
  id?: string;
  error?: string;
  score?: number;
  tier?: string;
}> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, skipping lead creation");
    return { success: true, id: "not-configured" };
  }

  try {
    // Calculate lead score
    const leadScore = calculateLeadScore(lead);
    const leadWithScore = { ...lead, lead_score: leadScore };

    const { data, error } = await supabase
      .from("portfolio_leads")
      .insert(leadWithScore)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      id: data.id,
      score: leadScore,
      tier: getLeadTier(leadScore),
    };
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
): Promise<{
  success: boolean;
  id?: string;
  error?: string;
  isNew?: boolean;
  score?: number;
  tier?: string;
}> {
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

      // Recalculate lead score with merged data
      const mergedLead = { ...existingLead, ...updates };
      const newScore = calculateLeadScore(mergedLead);
      updates.lead_score = newScore;

      const { error } = await supabase
        .from("portfolio_leads")
        .update(updates)
        .eq("id", existingLead.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        id: existingLead.id,
        isNew: false,
        score: newScore,
        tier: getLeadTier(newScore),
      };
    }

    // Create new lead (createLead already calculates score)
    const result = await createLead(lead);
    return { ...result, isNew: true };
  } catch (err) {
    console.error("Error upserting lead:", err);
    return { success: false, error: "Failed to upsert lead" };
  }
}
