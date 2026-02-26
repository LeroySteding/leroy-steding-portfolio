import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blog_posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.any(), // Tiptap JSON content
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    author: v.string(),
    authorName: v.optional(v.string()),
    authorAvatar: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    readingTime: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    translationGroup: v.optional(v.string()), // UUID to link translations
  })
    .index("by_slug", ["slug"])
    .index("by_locale", ["locale"])
    .index("by_status", ["status"])
    .index("by_published_at", ["publishedAt"])
    .index("by_translation_group", ["translationGroup"]),

  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.any(), // Tiptap JSON content
    coverImage: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    technologies: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    caseStudyUrl: v.optional(v.string()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    featured: v.optional(v.boolean()),
    featuredOrder: v.optional(v.number()),
    year: v.optional(v.number()),
    duration: v.optional(v.string()),
    role: v.optional(v.string()),
    client: v.optional(v.string()),
    order: v.optional(v.number()),
    published: v.optional(v.boolean()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_locale", ["locale"])
    .index("by_featured", ["featured", "featuredOrder"])
    .index("by_published", ["published"]),

  experiences: defineTable({
    title: v.string(),
    company: v.string(),
    position: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.any()), // Tiptap JSON content
    location: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()), // ISO date string, null = current
    isCurrent: v.optional(v.boolean()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    type: v.union(v.literal("work"), v.literal("education")),
    technologies: v.optional(v.array(v.string())),
    achievements: v.optional(v.array(v.string())),
    order: v.optional(v.number()),
    published: v.optional(v.boolean()),
  })
    .index("by_locale", ["locale"])
    .index("by_type", ["type"])
    .index("by_start_date", ["startDate"])
    .index("by_order", ["order"])
    .index("by_company", ["company"]),

  skills: defineTable({
    name: v.string(),
    category: v.string(),
    proficiency: v.number(), // 1-100
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    color: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    order: v.optional(v.number()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    published: v.optional(v.boolean()),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"])
    .index("by_name", ["name"]),

  media: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    fileSize: v.optional(v.number()),
    uploadedBy: v.string(), // Clerk user ID
  })
    .index("by_mime_type", ["mimeType"])
    .index("by_uploaded_by", ["uploadedBy"]),

  agent_feed: defineTable({
    type: v.union(
      v.literal("news"),
      v.literal("trend"),
      v.literal("alert"),
      v.literal("task_update"),
      v.literal("deploy"),
      v.literal("pr"),
      v.literal("briefing"),
      v.literal("insight")
    ),
    title: v.string(),
    content: v.string(),
    source: v.optional(v.string()),
    tags: v.array(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    read: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_priority", ["priority"])
    .index("by_created_at", ["createdAt"])
    .index("by_read", ["read"])
    .index("by_title_source", ["title", "source"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    category: v.union(
      v.literal("development"),
      v.literal("devops"),
      v.literal("content"),
      v.literal("seo"),
      v.literal("design"),
      v.literal("marketing"),
      v.literal("job_hunting"),
      v.literal("other")
    ),
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    tags: v.array(v.string()),
    relatedUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_category", ["category"])
    .index("by_assignee", ["assignee"])
    .index("by_due_date", ["dueDate"])
    .index("by_title", ["title"]),

  job_applications: defineTable({
    company: v.string(),
    position: v.string(),
    url: v.optional(v.string()),
    status: v.union(
      v.literal("discovered"),
      v.literal("researching"),
      v.literal("applying"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    remote: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    contacts: v.optional(
      v.array(
        v.object({
          name: v.string(),
          role: v.optional(v.string()),
          linkedin: v.optional(v.string()),
        })
      )
    ),
    appliedAt: v.optional(v.number()),
    nextAction: v.optional(v.string()),
    nextActionDate: v.optional(v.number()),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_company", ["company"])
    .index("by_company_position", ["company", "position"])
    .index("by_created_at", ["createdAt"]),

  seo_tracking: defineTable({
    url: v.string(),
    keyword: v.optional(v.string()),
    position: v.optional(v.number()),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    ctr: v.optional(v.number()),
    domain: v.string(),
    pageTitle: v.optional(v.string()),
    notes: v.optional(v.string()),
    checkedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_domain", ["domain"])
    .index("by_keyword", ["keyword"])
    .index("by_keyword_url", ["keyword", "url"])
    .index("by_checked_at", ["checkedAt"]),

  content_calendar: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("blog_post"),
      v.literal("social_post"),
      v.literal("newsletter"),
      v.literal("video"),
      v.literal("podcast"),
      v.literal("case_study")
    ),
    status: v.union(
      v.literal("idea"),
      v.literal("outline"),
      v.literal("drafting"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    platform: v.optional(v.string()),
    targetDate: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    relatedBlogPostId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_target_date", ["targetDate"])
    .index("by_title_targetDate", ["title", "targetDate"]),

  analytics_log: defineTable({
    event: v.string(),
    agent: v.optional(v.string()),
    model: v.optional(v.string()),
    tokensIn: v.optional(v.number()),
    tokensOut: v.optional(v.number()),
    cost: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_event", ["event"])
    .index("by_agent", ["agent"])
    .index("by_created_at", ["createdAt"])
    .index("by_model", ["model"]),

  deployments: defineTable({
    project: v.string(),
    environment: v.union(
      v.literal("production"),
      v.literal("preview"),
      v.literal("development")
    ),
    status: v.union(
      v.literal("building"),
      v.literal("ready"),
      v.literal("error"),
      v.literal("cancelled")
    ),
    url: v.optional(v.string()),
    commitSha: v.optional(v.string()),
    commitMessage: v.optional(v.string()),
    buildDuration: v.optional(v.number()),
    platform: v.string(),
    createdAt: v.number(),
  })
    .index("by_project", ["project"])
    .index("by_status", ["status"])
    .index("by_url", ["url"])
    .index("by_created_at", ["createdAt"]),

  github_activity: defineTable({
    repo: v.string(),
    type: v.union(
      v.literal("pr"),
      v.literal("issue"),
      v.literal("review"),
      v.literal("merge"),
      v.literal("release")
    ),
    number: v.number(),
    title: v.string(),
    status: v.string(),
    url: v.string(),
    author: v.optional(v.string()),
    labels: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_repo", ["repo"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_url", ["url"])
    .index("by_created_at", ["createdAt"]),

  site_settings: defineTable({
    key: v.string(),
    value: v.any(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    description: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  }).index("by_key", ["key"]),

  // Multi-Agent Coordination Tables
  agent_tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.array(v.string()), // agent names
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("blocked"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    context: v.optional(v.string()),
    dependencies: v.array(v.string()), // other task IDs
    createdBy: v.string(), // agent name
    linearIssueId: v.optional(v.string()), // link to Linear
    telegramMessageId: v.optional(v.string()),
    caseFileId: v.optional(v.id("case_files")),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_assigned_to", ["assignedTo"])
    .index("by_priority", ["priority"])
    .index("by_case_file", ["caseFileId"])
    .index("by_linear_issue", ["linearIssueId"])
    .index("by_created_at", ["createdAt"]),

  agent_memory: defineTable({
    agentName: v.string(),
    category: v.union(
      v.literal("decision"),
      v.literal("learning"),
      v.literal("context"),
      v.literal("reference"),
      v.literal("insight")
    ),
    content: v.string(),
    tags: v.array(v.string()),
    sharedWith: v.union(v.literal("all"), v.literal("team"), v.literal("private")),
    relatedTaskId: v.optional(v.id("agent_tasks")),
    relatedCaseId: v.optional(v.id("case_files")),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_agent", ["agentName"])
    .index("by_category", ["category"])
    .index("by_shared_with", ["sharedWith"])
    .index("by_tags", ["tags"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["agentName", "category", "sharedWith"],
    }),

  case_files: defineTable({
    projectName: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("archived")
    ),
    participants: v.array(v.string()), // agent names
    summary: v.string(),
    decisions: v.array(
      v.object({
        decision: v.string(),
        madeBy: v.string(),
        timestamp: v.number(),
        rationale: v.optional(v.string()),
      })
    ),
    resources: v.array(
      v.object({
        type: v.union(
          v.literal("link"),
          v.literal("file"),
          v.literal("code"),
          v.literal("note"),
          v.literal("reference")
        ),
        title: v.string(),
        content: v.string(),
        url: v.optional(v.string()),
        addedBy: v.string(),
        timestamp: v.number(),
      })
    ),
    tags: v.array(v.string()),
    linearProjectId: v.optional(v.string()),
    telegramGroupId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_project_name", ["projectName"])
    .index("by_participants", ["participants"])
    .index("by_created_at", ["createdAt"])
    .searchIndex("search_summary", {
      searchField: "summary",
      filterFields: ["status", "participants"],
    }),

  agent_sessions: defineTable({
    agentName: v.string(),
    sessionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.id("agent_tasks")),
    lastActivity: v.number(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_agent", ["agentName"])
    .index("by_status", ["status"])
    .index("by_session_id", ["sessionId"])
    .index("by_last_activity", ["lastActivity"]),

  // Templates marketplace
  templates: defineTable({
    name: v.string(),
    slug: v.string(),
    tagline: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    category: v.string(), // "saas", "ai", "fintech", "automation"
    stack: v.array(v.string()), // ["Next.js", "Convex", "Clerk"]
    features: v.array(v.string()),
    image: v.string(),
    previewImages: v.optional(v.array(v.string())),
    demoUrl: v.string(),
    githubUrl: v.optional(v.string()),
    published: v.boolean(),
    badge: v.optional(v.string()), // "New", "Bestseller", "Popular"
    rating: v.number(),
    reviewCount: v.number(),
    salesCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_published", ["published"])
    .index("by_sales", ["salesCount"]),

  template_purchases: defineTable({
    templateId: v.id("templates"),
    buyerEmail: v.string(),
    buyerName: v.optional(v.string()),
    licenseType: v.union(
      v.literal("standard"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    price: v.number(),
    stripeSessionId: v.string(),
    stripeCustomerId: v.optional(v.string()),
    githubRepoUrl: v.optional(v.string()),
    purchasedAt: v.number(),
  })
    .index("by_email", ["buyerEmail"])
    .index("by_template", ["templateId"])
    .index("by_stripe_session", ["stripeSessionId"]),

  // Portfolio leads (migrated from Supabase)
  portfolio_leads: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    source: v.union(
      v.literal("contact_form"),
      v.literal("newsletter"),
      v.literal("booking"),
      v.literal("chat")
    ),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("converted"),
      v.literal("archived")
    )),
    subject: v.optional(v.string()),
    message: v.optional(v.string()),
    subscribedToNewsletter: v.optional(v.boolean()),
    newsletterConfirmed: v.optional(v.boolean()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    locale: v.optional(v.string()),
    leadScore: v.optional(v.number()),
    tier: v.optional(v.union(
      v.literal("hot"),
      v.literal("warm"),
      v.literal("cool"),
      v.literal("cold")
    )),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_source", ["source"])
    .index("by_status", ["status"])
    .index("by_lead_score", ["leadScore"])
    .index("by_tier", ["tier"])
    .index("by_created_at", ["createdAt"]),

  // ========== ZZP SAAS APPS ==========
  // Shared ZZP Users
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

  // Belastingbot (Tax/BTW)
  belt_expenses: defineTable({
    userId: v.id("zzp_users"),
    description: v.string(),
    amount: v.number(),
    btw_rate: v.union(v.literal(21), v.literal(9), v.literal(0)),
    btw_amount: v.number(),
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
    date: v.number(),
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
      r1a: v.number(),
      r1b: v.number(),
      r1c: v.optional(v.number()),
      r1d: v.optional(v.number()),
      r1e: v.number(),
      r2a: v.optional(v.number()),
      r3a: v.optional(v.number()),
      r3b: v.optional(v.number()),
      r4a: v.optional(v.number()),
      r4b: v.optional(v.number()),
      r5a: v.optional(v.number()),
      r5b: v.number(),
      r5c: v.optional(v.number()),
      r5d: v.optional(v.number()),
      r5e: v.optional(v.number()),
      r5f: v.optional(v.number()),
      r5g: v.number(),
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

  // Factuur App (Invoicing)
  fact_invoices: defineTable({
    userId: v.id("zzp_users"),
    nummer: v.string(),
    clientId: v.id("fact_clients"),
    items: v.array(v.object({
      omschrijving: v.string(),
      aantal: v.number(),
      eenheidsprijs: v.number(),
      btw_tarief: v.union(v.literal(21), v.literal(9), v.literal(0)),
      subtotaal: v.number(),
    })),
    subtotal: v.number(),
    btw: v.number(),
    total: v.number(),
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
    sentTo: v.optional(v.array(v.string())),
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
    betalingstermijn: v.number(),
    notes: v.optional(v.string()),
    active: v.boolean(),
    totalInvoiced: v.optional(v.number()),
    outstandingBalance: v.optional(v.number()),
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
    invoice_prefix: v.string(),
    invoice_number: v.number(),
    default_payment_terms: v.number(),
    default_template: v.string(),
    footer_text: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_kvk", ["kvk"]),

  // Klantportaal (Client Portal)
  klant_projects: defineTable({
    userId: v.id("zzp_users"),
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
    progress: v.number(),
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
      v.literal("zzp"),
      v.literal("client")
    ),
    uploaderId: v.optional(v.string()),
    visible_to_client: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_uploaded_by", ["uploaded_by"])
    .index("by_created_at", ["createdAt"]),

  klant_project_comments: defineTable({
    projectId: v.id("klant_projects"),
    author: v.string(),
    authorType: v.union(v.literal("zzp"), v.literal("client")),
    text: v.string(),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
    }))),
    parentCommentId: v.optional(v.id("klant_project_comments")),
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
    portal_subdomain: v.string(),
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
    accessToken: v.string(),
    lastLoginAt: v.optional(v.number()),
    loginCount: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_email", ["email"])
    .index("by_access_token", ["accessToken"]),

  // Uren App (Time Tracking)
  uren_time_entries: defineTable({
    userId: v.id("zzp_users"),
    projectId: v.optional(v.id("uren_projects")),
    description: v.string(),
    start_time: v.number(),
    end_time: v.optional(v.number()),
    duration: v.optional(v.number()),
    date: v.number(),
    is_billable: v.boolean(),
    hourly_rate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    invoiceId: v.optional(v.id("fact_invoices")),
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
    hourly_rate: v.number(),
    budget_hours: v.optional(v.number()),
    budget_amount: v.optional(v.number()),
    color: v.string(),
    active: v.boolean(),
    totalHours: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
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
    total_amount: v.number(),
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
});
