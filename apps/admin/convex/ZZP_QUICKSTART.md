# ZZP Apps - Quick Start Guide

Get your ZZP SaaS apps up and running with sample data.

## 🚀 Initial Setup

### 1. Deploy Schema

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
npx convex deploy --prod
```

### 2. Verify Deployment

Visit: https://dashboard.convex.dev/t/leroy-steding/honorable-elk-818/data

Check for these new tables:
- ✅ `zzp_users`
- ✅ `belt_expenses`, `belt_btw_reports`, `belt_waitlist`, `belt_bank_imports`
- ✅ `fact_invoices`, `fact_clients`, `fact_company_settings`
- ✅ `klant_projects`, `klant_project_files`, `klant_project_comments`, `klant_portal_branding`, `klant_client_access`
- ✅ `uren_time_entries`, `uren_projects`, `uren_timesheets`

---

## 📝 Create Test Data

### Step 1: Create a ZZP User

```typescript
// In Convex dashboard or your app
const userId = await ctx.runMutation(api.zzp_users.createUser, {
  email: "test@zzp.nl",
  naam: "Jan Janssen",
  kvk: "12345678",
  btw_nummer: "NL123456789B01",
  plan: "pro",
  bedrijf: "Janssen Webdevelopment",
  phone: "+31612345678",
  iban: "NL91ABNA0417164300",
  adres: {
    straat: "Keizersgracht",
    huisnummer: "123",
    postcode: "1015 CJ",
    plaats: "Amsterdam",
    land: "Nederland"
  }
});
```

### Step 2: Set Up Company Settings (for Invoicing)

```typescript
const settingsId = await ctx.runMutation(api.fact_settings.createCompanySettings, {
  userId,
  naam: "Janssen Webdevelopment",
  kvk: "12345678",
  btw_nummer: "NL123456789B01",
  iban: "NL91ABNA0417164300",
  email: "facturen@janssen.nl",
  telefoon: "+31612345678",
  website: "https://janssen.nl",
  adres: {
    straat: "Keizersgracht",
    huisnummer: "123",
    postcode: "1015 CJ",
    plaats: "Amsterdam",
    land: "Nederland"
  },
  invoice_prefix: "INV",
  default_payment_terms: 14,
  default_template: "professional"
});
```

### Step 3: Create a Client

```typescript
const clientId = await ctx.runMutation(api.fact_clients.createClient, {
  userId,
  naam: "Piet de Vries",
  bedrijf: "De Vries BV",
  email: "piet@devries.nl",
  phone: "+31687654321",
  kvk: "87654321",
  btw_nummer: "NL987654321B01",
  adres: {
    straat: "Prinsengracht",
    huisnummer: "456",
    postcode: "1016 HK",
    plaats: "Amsterdam",
    land: "Nederland"
  },
  betalingstermijn: 30,
  notes: "Prefers email communication"
});
```

### Step 4: Add Sample Expenses

```typescript
// Software subscription
await ctx.runMutation(api.belt_expenses.createExpense, {
  userId,
  kvk: "12345678",
  description: "Adobe Creative Cloud - Maandelijks",
  amount: 6099, // €60.99 in cents
  btw_rate: 21,
  category: "software",
  date: Date.now(),
  recurring: {
    frequency: "maandelijks",
    nextDate: Date.now() + (30 * 24 * 60 * 60 * 1000)
  }
});

// Office supplies
await ctx.runMutation(api.belt_expenses.createExpense, {
  userId,
  kvk: "12345678",
  description: "Kantoorartikelen Staples",
  amount: 15000, // €150.00
  btw_rate: 21,
  category: "kantoor",
  date: Date.now(),
  notes: "Bureaustoelen en bureaumateriaal"
});
```

### Step 5: Create a Time Tracking Project

```typescript
const urenProjectId = await ctx.runMutation(api.uren_tracking.createUrenProject, {
  userId,
  clientId,
  name: "Website Redesign",
  description: "Complete redesign of company website",
  hourly_rate: 7500, // €75.00/hour in cents
  budget_hours: 40,
  budget_amount: 300000, // €3000.00
  color: "#3b82f6"
});
```

### Step 6: Track Some Time

```typescript
// Manual entry (already completed)
await ctx.runMutation(api.uren_tracking.createTimeEntry, {
  userId,
  projectId: urenProjectId,
  description: "Initial wireframes and mockups",
  start_time: Date.now() - (4 * 60 * 60 * 1000), // 4 hours ago
  end_time: Date.now(),
  is_billable: true,
  hourly_rate: 7500
});

// Start active timer
const activeEntryId = await ctx.runMutation(api.uren_tracking.startTimeEntry, {
  userId,
  description: "Frontend development - Homepage",
  projectId: urenProjectId,
  is_billable: true
});

// Stop it later
// await ctx.runMutation(api.uren_tracking.stopTimeEntry, { entryId: activeEntryId });
```

### Step 7: Create an Invoice

```typescript
const invoiceId = await ctx.runMutation(api.fact_invoices.createInvoice, {
  userId,
  clientId,
  items: [
    {
      omschrijving: "Website Redesign - Initial Phase",
      aantal: 8, // 8 hours
      eenheidsprijs: 7500, // €75/hour
      btw_tarief: 21
    },
    {
      omschrijving: "Domain & Hosting Setup",
      aantal: 1,
      eenheidsprijs: 12000, // €120
      btw_tarief: 21
    }
  ],
  invoice_date: Date.now(),
  payment_terms: 30,
  notes: "Betaling binnen 30 dagen a.u.b.",
  template: "professional"
});
```

### Step 8: Create a Client Portal Project

```typescript
const portalProjectId = await ctx.runMutation(api.klant_projects.createProject, {
  userId,
  clientId,
  name: "Website Redesign",
  description: "Complete overhaul of your company website with modern design",
  status: "in_progress",
  priority: "high",
  startDate: Date.now(),
  deadline: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
  color: "#3b82f6",
  milestones: [
    {
      title: "Wireframes Approved",
      description: "Initial wireframes and site structure",
      dueDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
      completed: true,
      completedAt: Date.now()
    },
    {
      title: "Design Mockups",
      description: "Full color designs for all pages",
      dueDate: Date.now() + (14 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      title: "Development Complete",
      description: "Fully functional website ready for testing",
      dueDate: Date.now() + (25 * 24 * 60 * 60 * 1000),
      completed: false
    }
  ]
});

// Add a comment
await ctx.runMutation(api.klant_projects.addComment, {
  projectId: portalProjectId,
  author: "Jan Janssen",
  authorType: "zzp",
  text: "Wireframes zijn klaar! Zie bijgevoegde PDF voor de volledige mockups."
});
```

### Step 9: Set Up Portal Branding

```typescript
await ctx.runMutation(api.klant_portal.createPortalBranding, {
  userId,
  company_name: "Janssen Webdevelopment",
  portal_subdomain: "janssen",
  support_email: "support@janssen.nl",
  primary_color: "#3b82f6",
  secondary_color: "#1e40af",
  welcome_message: "Welkom in uw projectportaal! Hier kunt u de voortgang van uw project volgen."
});

// Create client access
await ctx.runMutation(api.klant_portal.createClientAccess, {
  clientId,
  email: "piet@devries.nl"
});
```

### Step 10: Generate BTW Report

```typescript
const btwReportId = await ctx.runMutation(api.belt_btw.generateBtwReportFromExpenses, {
  userId,
  kvk: "12345678",
  year: 2025,
  quarter: 1
});
```

---

## 🧪 Testing Queries

### Get User Dashboard Stats

```typescript
// User info
const user = await ctx.runQuery(api.zzp_users.getCurrentUser, {
  email: "test@zzp.nl"
});

// Invoice stats
const invoiceStats = await ctx.runQuery(api.fact_invoices.getInvoiceStats, {
  userId,
  year: 2025
});

// Time tracking stats
const timeStats = await ctx.runQuery(api.uren_tracking.getTimeEntryStats, {
  userId,
  startDate: new Date(2025, 0, 1).getTime(), // Jan 1, 2025
  endDate: Date.now()
});

// Expense stats
const expenseStats = await ctx.runQuery(api.belt_expenses.getExpenseStats, {
  userId,
  year: 2025,
  quarter: 1
});
```

### Get Client View

```typescript
const client = await ctx.runQuery(api.fact_clients.getClient, { clientId });
const clientStats = await ctx.runQuery(api.fact_clients.getClientStats, { clientId });
const clientProjects = await ctx.runQuery(api.klant_projects.getProjectsByClient, { clientId });
const clientInvoices = await ctx.runQuery(api.fact_invoices.getInvoicesByClient, { clientId });
```

---

## 📊 Example Workflows

### Complete Invoice Workflow

```typescript
// 1. Create timesheet from time entries
const entryIds = /* array of uren_time_entries IDs */;
const timesheetId = await ctx.runMutation(api.uren_tracking.createTimesheet, {
  userId,
  period_start: /* start date */,
  period_end: /* end date */,
  entries: entryIds
});

// 2. Approve timesheet
await ctx.runMutation(api.uren_tracking.approveTimesheet, {
  timesheetId,
  approvedBy: "Jan Janssen"
});

// 3. Create invoice from timesheet
const timesheet = await ctx.runQuery(api.uren_tracking.getTimesheet, { timesheetId });
const invoiceId = await ctx.runMutation(api.fact_invoices.createInvoice, {
  userId,
  clientId,
  items: [
    {
      omschrijving: `Werkzaamheden ${/* period */}`,
      aantal: 1,
      eenheidsprijs: timesheet.total_amount,
      btw_tarief: 21
    }
  ],
  invoice_date: Date.now(),
  payment_terms: 30
});

// 4. Link timesheet to invoice
await ctx.runMutation(api.uren_tracking.linkTimesheetToInvoice, {
  timesheetId,
  invoiceId
});

// 5. Send invoice
await ctx.runMutation(api.fact_invoices.markInvoiceSent, {
  invoiceId,
  sentTo: ["client@email.com"],
  pdf_url: "https://storage.url/invoice.pdf"
});

// 6. Mark as paid
await ctx.runMutation(api.fact_invoices.markInvoicePaid, {
  invoiceId,
  paid_date: Date.now()
});
```

### BTW Quarter Closing

```typescript
// 1. Get all expenses for quarter
const expenses = await ctx.runQuery(api.belt_expenses.getExpensesByDateRange, {
  userId,
  startDate: new Date(2025, 0, 1).getTime(), // Q1 2025
  endDate: new Date(2025, 2, 31, 23, 59, 59).getTime()
});

// 2. Generate BTW report
const reportId = await ctx.runMutation(api.belt_btw.generateBtwReportFromExpenses, {
  userId,
  kvk: "12345678",
  year: 2025,
  quarter: 1
});

// 3. Review and update rubrieken manually if needed
await ctx.runMutation(api.belt_btw.updateBtwReport, {
  reportId,
  rubrieken: {
    "1a": 500000, // €5000 omzet @ 21%
    "1b": 0,
    "1e": 0,
    "5b": 21099, // €210.99 voorbelasting
    "5g": -21099 // terug te krijgen
  }
});

// 4. Mark as submitted
await ctx.runMutation(api.belt_btw.updateBtwReport, {
  reportId,
  status: "ingediend",
  belastingdienst_reference: "BTW-2025-Q1-12345678",
  pdf_url: "https://storage.url/btw-report.pdf"
});
```

---

## 🎨 Frontend Integration

### React Query Example

```typescript
// hooks/useZzpUser.ts
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function useZzpUser(email: string) {
  return useQuery(api.zzp_users.getCurrentUser, { email });
}

// hooks/useInvoices.ts
export function useInvoices(userId: Id<"zzp_users">) {
  return useQuery(api.fact_invoices.listInvoices, { userId, limit: 20 });
}

// hooks/useTimeTracking.ts
export function useActiveTimer(userId: Id<"zzp_users">) {
  return useQuery(api.uren_tracking.getActiveTimeEntry, { userId });
}
```

### Mutation Hooks

```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useCreateInvoice() {
  return useMutation(api.fact_invoices.createInvoice);
}

export function useStartTimer() {
  return useMutation(api.uren_tracking.startTimeEntry);
}

export function useStopTimer() {
  return useMutation(api.uren_tracking.stopTimeEntry);
}
```

---

## 🔐 Access Control Example

```typescript
// middleware/auth.ts
export async function requireZzpUser(ctx: any, clerkUserId: string) {
  const user = await ctx.runQuery(api.zzp_users.getCurrentUser, { clerkUserId });
  
  if (!user) {
    throw new Error("User not found. Please complete onboarding.");
  }
  
  if (user.plan === "free") {
    throw new Error("This feature requires a Pro plan.");
  }
  
  return user;
}

// Check ownership
export async function requireInvoiceOwnership(ctx: any, invoiceId: Id<"fact_invoices">, userId: Id<"zzp_users">) {
  const invoice = await ctx.db.get(invoiceId);
  
  if (!invoice || invoice.userId !== userId) {
    throw new Error("Invoice not found or access denied");
  }
  
  return invoice;
}
```

---

## ✅ Validation Checklist

After running the quick start:

- [ ] User created successfully
- [ ] Company settings configured
- [ ] Client added
- [ ] Expenses tracked
- [ ] Time entries logged
- [ ] Invoice generated with correct numbering
- [ ] Portal project visible
- [ ] BTW report calculated
- [ ] All queries return data
- [ ] Indexes working (check performance in dashboard)

---

## 🆘 Troubleshooting

### "Invoice prefix already exists"
Solution: Each user should have unique company settings. Check `by_user` index.

### "Cannot create invoice - no company settings"
Solution: Run Step 2 (createCompanySettings) first.

### "Time entry has no duration"
Solution: Stop the timer first with `stopTimeEntry` before creating invoices.

### BTW calculations seem off
Solution: Double-check amounts are in **cents** (€10 = 1000 cents).

### Client portal subdomain taken
Solution: Subdomains must be unique. Try a different one.

---

## 🚀 Next Steps

1. **Build Frontend Apps**
   - Belastingbot: https://belastingbot.nl
   - Factuur: https://factuur.app
   - Portal: https://[subdomain].klantportaal.nl
   - Uren: https://uren.app

2. **Set Up Authentication**
   - Clerk integration
   - Magic links for client portal

3. **Add File Storage**
   - Convex file storage for receipts
   - PDF generation for invoices/reports

4. **Implement Notifications**
   - Email reminders for overdue invoices
   - BTW report deadlines
   - Client portal activity

5. **Analytics Dashboard**
   - Revenue tracking
   - Time utilization
   - Expense trends
   - Client profitability

---

**Happy Building! 🎉**

Questions? Check `ZZP_SCHEMA_README.md` for full documentation.
