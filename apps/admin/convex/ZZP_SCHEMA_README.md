# ZZP SaaS Apps - Unified Convex Schema

This document describes the unified Convex schema for 4 ZZP (Dutch freelancer) SaaS applications sharing the same Convex deployment.

## 🚀 Deployment Info

**Production Convex URL:** `honorable-elk-818.eu-west-1.convex.cloud`

## 📋 Apps Overview

### 1. **Belastingbot** (Tax/BTW Management)
- **Prefix:** `belt_*`
- **Purpose:** Track expenses, calculate BTW, generate quarterly reports
- **Tables:** `belt_expenses`, `belt_btw_reports`, `belt_waitlist`, `belt_bank_imports`

### 2. **Factuur App** (Invoicing)
- **Prefix:** `fact_*`
- **Purpose:** Create invoices, manage clients, track payments
- **Tables:** `fact_invoices`, `fact_clients`, `fact_company_settings`

### 3. **Klantportaal** (Client Portal)
- **Prefix:** `klant_*`
- **Purpose:** Project collaboration, file sharing, client communication
- **Tables:** `klant_projects`, `klant_project_files`, `klant_project_comments`, `klant_portal_branding`, `klant_client_access`

### 4. **Uren App** (Time Tracking)
- **Prefix:** `uren_*`
- **Purpose:** Track billable hours, manage projects, generate timesheets
- **Tables:** `uren_time_entries`, `uren_projects`, `uren_timesheets`

### Shared
- **Table:** `zzp_users`
- **Purpose:** Central user management across all apps

---

## 📊 Schema Structure

### Shared Tables

#### `zzp_users`
Central user table for all ZZP professionals using the platform.

**Fields:**
- `email` (string, indexed) - Primary email
- `naam` (string) - Full name
- `bedrijf` (string?, optional) - Company name
- `kvk` (string, indexed) - KVK number (Dutch Chamber of Commerce)
- `btw_nummer` (string?, optional) - VAT number
- `plan` (enum: free/pro/enterprise, indexed) - Subscription plan
- `clerkUserId` (string?, indexed) - Clerk authentication ID
- `phone`, `iban`, `adres` - Contact details
- `metadata` (any) - Flexible data storage
- `createdAt`, `updatedAt` (number) - Timestamps

**Indexes:**
- `by_email`, `by_kvk`, `by_plan`, `by_clerk_user`

---

## 🔥 Belastingbot Tables

### `belt_expenses`
Track business expenses with BTW calculation.

**Key Features:**
- Automatic BTW calculation (21%, 9%, 0%)
- Category-based organization
- Receipt storage
- Recurring expense support

**Indexes:**
- `by_user`, `by_date`, `by_kvk`, `by_category`, `by_user_date`

### `belt_btw_reports`
Quarterly BTW reports following Dutch tax office format.

**Key Features:**
- All rubrieken (1a-5g) supported
- Status tracking (concept → ingediend → goedgekeurd → betaald)
- PDF storage
- Belastingdienst reference linking

**Indexes:**
- `by_user`, `by_quarter_year`, `by_user_quarter_year`, `by_status`

### `belt_waitlist`
Pre-launch waitlist management.

**Indexes:**
- `by_email`, `by_created_at`, `by_converted`

### `belt_bank_imports`
Import and match bank transactions to expenses.

**Features:**
- Support for multiple Dutch banks
- Transaction matching
- Status tracking

**Indexes:**
- `by_user`, `by_status`, `by_created_at`

---

## 💰 Factuur App Tables

### `fact_invoices`
Complete invoice management system.

**Key Features:**
- Automatic invoice numbering
- Multi-item invoices with BTW
- Status workflow (concept → verzonden → betaald)
- Recurring invoices
- PDF generation support

**Indexes:**
- `by_user`, `by_client`, `by_nummer`, `by_status`, `by_invoice_date`, `by_due_date`, `by_user_status`

### `fact_clients`
Client/customer management.

**Key Features:**
- Full contact details
- Address storage
- KVK/BTW lookup
- Payment terms per client
- Calculated balances

**Indexes:**
- `by_user`, `by_email`, `by_naam`, `by_kvk`, `by_active`
- Search index on `naam`

### `fact_company_settings`
ZZP'er company profile for invoices.

**Key Features:**
- Logo upload
- Invoice prefix/numbering
- Default payment terms
- Footer text customization

**Indexes:**
- `by_user`, `by_kvk`

---

## 👥 Klantportaal Tables

### `klant_projects`
Collaborative project management.

**Key Features:**
- Status tracking
- Progress percentage
- Milestones
- Deadline management
- Color coding

**Indexes:**
- `by_user`, `by_client`, `by_status`, `by_deadline`, `by_user_status`

### `klant_project_files`
File sharing with visibility control.

**Key Features:**
- Upload by ZZP or client
- Client visibility toggle
- Convex storage integration

**Indexes:**
- `by_project`, `by_uploaded_by`, `by_created_at`

### `klant_project_comments`
Project communication with threading.

**Key Features:**
- Comment threading (replies)
- Attachments
- Edit tracking
- Author type (ZZP vs client)

**Indexes:**
- `by_project`, `by_author_type`, `by_created_at`

### `klant_portal_branding`
White-label portal customization.

**Key Features:**
- Custom subdomain (e.g., acme.klantportaal.nl)
- Custom domain support
- Color scheme
- Logo/favicon
- Welcome message

**Indexes:**
- `by_user`, `by_subdomain`, `by_custom_domain`

### `klant_client_access`
Passwordless client access management.

**Key Features:**
- Magic link tokens
- Login tracking
- Access revocation

**Indexes:**
- `by_client`, `by_email`, `by_access_token`

---

## ⏱️ Uren App Tables

### `uren_time_entries`
Track individual time entries.

**Key Features:**
- Start/stop timer
- Manual entry support
- Billable/non-billable toggle
- Per-entry rate override
- Invoice linking

**Indexes:**
- `by_user`, `by_project`, `by_date`, `by_user_date`, `by_invoice`, `by_billable`

### `uren_projects`
Time tracking projects (distinct from klant_projects).

**Key Features:**
- Hourly rate
- Budget tracking (hours & amount)
- Client linking
- Color coding
- Active/archived

**Indexes:**
- `by_user`, `by_client`, `by_active`, `by_user_active`

### `uren_timesheets`
Aggregate time entries for invoicing.

**Key Features:**
- Period-based (weekly, monthly)
- Approval workflow
- Direct invoice linking
- Total calculations

**Indexes:**
- `by_user`, `by_period`, `by_status`, `by_invoice`

---

## 🔗 Cross-App Integrations

### Invoice ↔ Time Tracking
```typescript
// Link timesheet to invoice
await linkTimesheetToInvoice({
  timesheetId: "...",
  invoiceId: "..."
});
// All time entries automatically linked
```

### Client Data Sharing
`fact_clients` is used by:
- Factuur App (invoicing)
- Klantportaal (project clients)
- Uren App (time tracking projects)

### Expense → Invoice Flow
Track expenses in Belastingbot, reference in Factuur App invoices.

---

## 🚀 Usage Examples

### Creating a User
```typescript
import { api } from "./_generated/api";

const userId = await ctx.runMutation(api.zzp_users.createUser, {
  email: "jan@example.nl",
  naam: "Jan de Vries",
  kvk: "12345678",
  btw_nummer: "NL123456789B01",
  plan: "pro"
});
```

### Creating an Invoice
```typescript
const invoiceId = await ctx.runMutation(api.fact_invoices.createInvoice, {
  userId,
  clientId,
  items: [
    {
      omschrijving: "Website development",
      aantal: 40,
      eenheidsprijs: 7500, // €75.00 in cents
      btw_tarief: 21
    }
  ],
  invoice_date: Date.now(),
  payment_terms: 14
});
```

### Starting Time Tracking
```typescript
const entryId = await ctx.runMutation(api.uren_tracking.startTimeEntry, {
  userId,
  description: "Website development",
  projectId,
  is_billable: true
});

// Later...
await ctx.runMutation(api.uren_tracking.stopTimeEntry, {
  entryId
});
```

### Generating BTW Report
```typescript
const reportId = await ctx.runMutation(api.belt_btw.generateBtwReportFromExpenses, {
  userId,
  kvk: "12345678",
  year: 2024,
  quarter: 1
});
```

---

## 📁 File Structure

```
convex/
├── schema.ts                    # Main schema (includes all ZZP tables)
├── zzp_schema_additions.ts      # Schema definitions for reference
├── zzp_users.ts                 # Shared user management
├── belt_expenses.ts             # Belastingbot: Expenses
├── belt_btw.ts                  # Belastingbot: BTW, waitlist, imports
├── fact_invoices.ts             # Factuur: Invoices
├── fact_clients.ts              # Factuur: Clients
├── fact_settings.ts             # Factuur: Company settings
├── klant_projects.ts            # Klantportaal: Projects, files, comments
├── klant_portal.ts              # Klantportaal: Branding, client access
├── uren_tracking.ts             # Uren: Time entries, projects, timesheets
└── ZZP_SCHEMA_README.md         # This file
```

---

## ⚙️ Deployment Steps

1. **Schema is already updated** - `schema.ts` has been modified
2. **Push to Convex:**
   ```bash
   cd apps/admin
   npx convex deploy --prod
   ```
3. **Verify in Convex Dashboard:**
   - Go to https://dashboard.convex.dev
   - Select `honorable-elk-818` deployment
   - Check "Data" tab for new tables

---

## 🔒 Security Notes

- All mutations validate `userId` ownership
- Client portal uses unique access tokens (not passwords)
- BTW reports reference KVK for audit trails
- Invoiced time entries cannot be deleted
- Company settings unique per user

---

## 📊 Performance Considerations

### Optimized Queries
- All user-scoped queries use `by_user` index
- Date range queries use compound `by_user_date` index
- Search uses dedicated search indexes

### Recommended Practices
- Always filter by `userId` first
- Use pagination for large result sets
- Cache company settings per session
- Batch operations for bank imports

---

## 🧪 Testing Checklist

### User Flow
- [ ] Create ZZP user
- [ ] Upgrade to pro plan
- [ ] Update profile

### Belastingbot
- [ ] Add expense with receipt
- [ ] Import bank transactions
- [ ] Generate BTW report
- [ ] Mark report as submitted

### Factuur App
- [ ] Set up company settings
- [ ] Add client
- [ ] Create invoice
- [ ] Mark invoice as sent
- [ ] Mark invoice as paid

### Klantportaal
- [ ] Set up portal branding
- [ ] Create project
- [ ] Upload file (visible to client)
- [ ] Add comment
- [ ] Generate client access token

### Uren App
- [ ] Create time tracking project
- [ ] Start timer
- [ ] Stop timer
- [ ] Create manual entry
- [ ] Generate timesheet
- [ ] Link timesheet to invoice

---

## 📞 Support

For questions about this schema:
- Check function JSDoc comments
- Review the TypeScript types in `_generated/api.d.ts`
- Test queries in Convex dashboard

---

## 🎯 Future Enhancements

### Potential Additions
- [ ] `belt_tax_deductions` - Track tax deductions
- [ ] `fact_quotes` - Pre-invoice quotes
- [ ] `klant_tasks` - Project task management
- [ ] `uren_reports` - Advanced time reports
- [ ] `notifications` - Cross-app notification system
- [ ] `subscriptions` - Stripe billing integration

### Cross-App Features
- [ ] Auto-create invoices from timesheets
- [ ] Link expenses to projects
- [ ] Client dashboard showing invoices + projects + time
- [ ] Export all data for accountant

---

## ✅ Status

**Ready for Production** ✅

All schema tables are defined, indexed, and have corresponding queries/mutations. Deploy with confidence!

---

**Last Updated:** February 14, 2025
**Schema Version:** 1.0.0
**Convex Deployment:** honorable-elk-818.eu-west-1.convex.cloud
