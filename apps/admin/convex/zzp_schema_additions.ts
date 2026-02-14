/**
 * ZZP SaaS Apps - Unified Schema Additions
 * 
 * This file contains schema additions for 4 ZZP apps sharing the same Convex deployment:
 * 1. Belastingbot (belt_*) - Tax/BTW tracking
 * 2. Factuur App (fact_*) - Invoicing
 * 3. Klantportaal (klant_*) - Client portal
 * 4. Uren App (uren_*) - Time tracking
 * 
 * Add these to schema.ts
 */

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const zzpSchemaAdditions = {
  // ========== SHARED: ZZP Users ==========
  zzp_users: defineTable({
    email: v.string(),
    naam: v.string(),
    bedrijf: v.optional(v.string()),
    kvk: v.string(),
    btw_nummer: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    clerkUserId: v.optional(v.string()),
    phone: v.optional(v.string()),
    iban: v.optional(v.string()),
    adres: v.optional(v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    })),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_kvk", ["kvk"])
    .index("by_plan", ["plan"])
    .index("by_clerk_user", ["clerkUserId"]),

  // ========== BELASTINGBOT (Tax/BTW) ==========
  belt_expenses: defineTable({
    userId: v.id("zzp_users"),
    description: v.string(),
    amount: v.number(), // in cents
    btw_rate: v.union(v.literal(21), v.literal(9), v.literal(0)),
    btw_amount: v.number(), // calculated, in cents
    category: v.union(
      v.literal("hardware"),
      v.literal("software"),
      v.literal("marketing"),
      v.literal("kantoor"),
      v.literal("reiskosten"),
      v.literal("telefoon_internet"),
      v.literal("zakelijke_diensten"),
      v.literal("overig")
    ),
    date: v.number(), // timestamp
    receipt_url: v.optional(v.string()),
    recurring: v.optional(v.object({
      frequency: v.union(
        v.literal("maandelijks"),
        v.literal("kwartaal"),
        v.literal("jaarlijks")
      ),
      nextDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
    })),
    kvk: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_kvk", ["kvk"])
    .index("by_category", ["category"])
    .index("by_user_date", ["userId", "date"]),

  belt_btw_reports: defineTable({
    userId: v.id("zzp_users"),
    quarter: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4)),
    year: v.number(),
    kvk: v.string(),
    rubrieken: v.object({
      "1a": v.number(), // Leveringen/diensten belast met hoog tarief (21%)
      "1b": v.number(), // Leveringen/diensten belast met laag tarief (9%)
      "1c": v.optional(v.number()), // Leveringen/diensten belast met overige tarieven
      "1d": v.optional(v.number()), // Privégebruik
      "1e": v.number(), // Leveringen/diensten belast met 0% of niet bij u belast
      "2a": v.optional(v.number()), // Verleggingsregelingen
      "3a": v.optional(v.number()), // Leveringen naar landen buiten de EU
      "3b": v.optional(v.number()), // Leveringen naar landen binnen de EU
      "4a": v.optional(v.number()), // Leveringen/diensten uit andere landen
      "4b": v.optional(v.number()), // Verleggingsregelingen
      "5a": v.optional(v.number()), // Subtotaal - Te betalen omzetbelasting
      "5b": v.number(), // Voorbelasting (BTW die je hebt betaald)
      "5c": v.optional(v.number()), // Subtotaal
      "5d": v.optional(v.number()), // Kleine ondernemersregeling
      "5e": v.optional(v.number()), // Schatting vorige aangifte
      "5f": v.optional(v.number()), // Schatting deze aangifte
      "5g": v.number(), // Totaal te betalen of terug te ontvangen
    }),
    status: v.union(
      v.literal("concept"),
      v.literal("ingediend"),
      v.literal("goedgekeurd"),
      v.literal("betaald")
    ),
    pdf_url: v.optional(v.string()),
    belastingdienst_reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    submittedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_quarter_year", ["year", "quarter"])
    .index("by_user_quarter_year", ["userId", "year", "quarter"])
    .index("by_status", ["status"]),

  belt_waitlist: defineTable({
    email: v.string(),
    naam: v.optional(v.string()),
    bedrijf: v.optional(v.string()),
    source: v.optional(v.string()),
    referrer: v.optional(v.string()),
    inviteSent: v.boolean(),
    invitedAt: v.optional(v.number()),
    convertedToUser: v.boolean(),
    userId: v.optional(v.id("zzp_users")),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_created_at", ["createdAt"])
    .index("by_converted", ["convertedToUser"]),

  belt_bank_imports: defineTable({
    userId: v.id("zzp_users"),
    bank_name: v.string(),
    file_name: v.string(),
    file_url: v.optional(v.string()),
    transactions: v.array(v.object({
      date: v.string(),
      description: v.string(),
      amount: v.number(),
      counterparty: v.optional(v.string()),
      counterparty_account: v.optional(v.string()),
      type: v.union(v.literal("debit"), v.literal("credit")),
      matched: v.boolean(),
      expenseId: v.optional(v.id("belt_expenses")),
    })),
    status: v.union(
      v.literal("processing"),
      v.literal("matched"),
      v.literal("completed"),
      v.literal("failed")
    ),
    totalTransactions: v.number(),
    matchedCount: v.number(),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // ========== FACTUUR APP (Invoicing) ==========
  fact_invoices: defineTable({
    userId: v.id("zzp_users"),
    nummer: v.string(), // INV-2024-001
    clientId: v.id("fact_clients"),
    items: v.array(v.object({
      omschrijving: v.string(),
      aantal: v.number(),
      eenheidsprijs: v.number(), // in cents
      btw_tarief: v.union(v.literal(21), v.literal(9), v.literal(0)),
      subtotaal: v.number(), // in cents
    })),
    subtotal: v.number(), // in cents
    btw: v.number(), // in cents
    total: v.number(), // in cents
    status: v.union(
      v.literal("concept"),
      v.literal("verzonden"),
      v.literal("betaald"),
      v.literal("achterstallig"),
      v.literal("geannuleerd")
    ),
    invoice_date: v.number(),
    due_date: v.number(),
    paid_date: v.optional(v.number()),
    template: v.union(
      v.literal("default"),
      v.literal("modern"),
      v.literal("minimal"),
      v.literal("professional")
    ),
    recurring: v.optional(v.object({
      frequency: v.union(
        v.literal("maandelijks"),
        v.literal("kwartaal"),
        v.literal("jaarlijks")
      ),
      nextInvoiceDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
      active: v.boolean(),
    })),
    pdf_url: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    sentTo: v.optional(v.array(v.string())), // email addresses
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_nummer", ["nummer"])
    .index("by_status", ["status"])
    .index("by_invoice_date", ["invoice_date"])
    .index("by_due_date", ["due_date"])
    .index("by_user_status", ["userId", "status"]),

  fact_clients: defineTable({
    userId: v.id("zzp_users"),
    naam: v.string(),
    bedrijf: v.optional(v.string()),
    adres: v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    }),
    email: v.string(),
    phone: v.optional(v.string()),
    kvk: v.optional(v.string()),
    btw_nummer: v.optional(v.string()),
    betalingstermijn: v.number(), // dagen
    notes: v.optional(v.string()),
    active: v.boolean(),
    totalInvoiced: v.optional(v.number()), // calculated field
    outstandingBalance: v.optional(v.number()), // calculated field
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_naam", ["naam"])
    .index("by_kvk", ["kvk"])
    .index("by_active", ["active"])
    .searchIndex("search_naam", {
      searchField: "naam",
      filterFields: ["userId", "active"],
    }),

  fact_company_settings: defineTable({
    userId: v.id("zzp_users"),
    naam: v.string(),
    adres: v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    }),
    kvk: v.string(),
    btw_nummer: v.optional(v.string()),
    iban: v.string(),
    bic: v.optional(v.string()),
    email: v.string(),
    telefoon: v.optional(v.string()),
    website: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    invoice_prefix: v.string(), // "INV"
    invoice_number: v.number(), // counter
    default_payment_terms: v.number(), // days
    default_template: v.string(),
    footer_text: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_kvk", ["kvk"]),

  // ========== KLANTPORTAAL (Client Portal) ==========
  klant_projects: defineTable({
    userId: v.id("zzp_users"), // ZZP'er who owns the project
    clientId: v.id("fact_clients"),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("on_hold")
    ),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
    startDate: v.optional(v.number()),
    deadline: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    progress: v.number(), // 0-100
    milestones: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      completed: v.boolean(),
      completedAt: v.optional(v.number()),
    })),
    color: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_deadline", ["deadline"])
    .index("by_user_status", ["userId", "status"]),

  klant_project_files: defineTable({
    projectId: v.id("klant_projects"),
    name: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    storageId: v.optional(v.id("_storage")),
    mimeType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    uploaded_by: v.union(
      v.literal("zzp"), // The ZZP'er
      v.literal("client") // The client
    ),
    uploaderId: v.optional(v.string()), // email or user id
    visible_to_client: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_uploaded_by", ["uploaded_by"])
    .index("by_created_at", ["createdAt"]),

  klant_project_comments: defineTable({
    projectId: v.id("klant_projects"),
    author: v.string(), // name or email
    authorType: v.union(v.literal("zzp"), v.literal("client")),
    text: v.string(),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
    }))),
    parentCommentId: v.optional(v.id("klant_project_comments")), // for replies
    edited: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_author_type", ["authorType"])
    .index("by_created_at", ["createdAt"]),

  klant_portal_branding: defineTable({
    userId: v.id("zzp_users"),
    company_name: v.string(),
    primary_color: v.string(),
    secondary_color: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    favicon_url: v.optional(v.string()),
    portal_subdomain: v.string(), // e.g., "acme" -> acme.klantportaal.nl
    custom_domain: v.optional(v.string()),
    welcome_message: v.optional(v.string()),
    terms_url: v.optional(v.string()),
    privacy_url: v.optional(v.string()),
    support_email: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_subdomain", ["portal_subdomain"])
    .index("by_custom_domain", ["custom_domain"]),

  klant_client_access: defineTable({
    clientId: v.id("fact_clients"),
    email: v.string(),
    accessToken: v.string(), // unique token for passwordless login
    lastLoginAt: v.optional(v.number()),
    loginCount: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_email", ["email"])
    .index("by_access_token", ["accessToken"]),

  // ========== UREN APP (Time Tracking) ==========
  uren_time_entries: defineTable({
    userId: v.id("zzp_users"),
    projectId: v.optional(v.id("uren_projects")),
    description: v.string(),
    start_time: v.number(), // timestamp
    end_time: v.optional(v.number()), // null if currently running
    duration: v.optional(v.number()), // seconds, calculated when stopped
    date: v.number(), // date timestamp (for grouping)
    is_billable: v.boolean(),
    hourly_rate: v.optional(v.number()), // can override project rate
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    invoiceId: v.optional(v.id("fact_invoices")), // linked when invoiced
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userId", "date"])
    .index("by_invoice", ["invoiceId"])
    .index("by_billable", ["is_billable"]),

  uren_projects: defineTable({
    userId: v.id("zzp_users"),
    clientId: v.optional(v.id("fact_clients")),
    name: v.string(),
    description: v.optional(v.string()),
    hourly_rate: v.number(), // in cents
    budget_hours: v.optional(v.number()),
    budget_amount: v.optional(v.number()), // in cents
    color: v.string(),
    active: v.boolean(),
    totalHours: v.optional(v.number()), // calculated
    totalAmount: v.optional(v.number()), // calculated
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_client", ["clientId"])
    .index("by_active", ["active"])
    .index("by_user_active", ["userId", "active"]),

  uren_timesheets: defineTable({
    userId: v.id("zzp_users"),
    period_start: v.number(),
    period_end: v.number(),
    status: v.union(
      v.literal("concept"),
      v.literal("goedgekeurd"),
      v.literal("gefactureerd")
    ),
    entries: v.array(v.id("uren_time_entries")),
    total_hours: v.number(),
    total_billable_hours: v.number(),
    total_amount: v.number(), // in cents
    invoiceId: v.optional(v.id("fact_invoices")),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_period", ["period_start", "period_end"])
    .index("by_status", ["status"])
    .index("by_invoice", ["invoiceId"]),
};
