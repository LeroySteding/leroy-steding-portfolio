# Deployment Checklist - Auto-Apply System

## ✅ Completed Files

### Convex Schema & API
- [x] `convex/schema.ts` - Extended with auto_apply_settings and application_templates tables
- [x] `convex/auto_apply_settings.ts` - Settings API (get, update, reset, getStats)
- [x] `convex/application_templates.ts` - Templates API (CRUD + renderCoverLetter)
- [x] `convex/job_applications.ts` - Already existed, extended with auto-apply fields

### Scripts
- [x] `apps/admin/scripts/auto-apply.ts` - Main auto-apply engine (650 lines)
- [x] `apps/admin/scripts/auto-apply-cron.sh` - Cron wrapper script
- [x] `apps/admin/scripts/AUTO_APPLY_GUIDE.md` - Comprehensive user guide
- [x] `apps/admin/scripts/README.md` - Scripts documentation

### UI Components
- [x] `apps/admin/src/components/auto-apply-settings.tsx` - Settings dashboard

### Documentation
- [x] `PROLINKER-03-COMPLETION.md` - Task completion report
- [x] `DEPLOYMENT_CHECKLIST.md` - This file

## 🚀 Deployment Steps

### 1. Deploy Convex Schema Changes

```bash
cd ~/Projects/personal/leroy-steding-portfolio

# Push schema changes to Convex
npx convex deploy

# Or if using dev mode:
npx convex dev
```

**What this does:**
- Creates `auto_apply_settings` table
- Creates `application_templates` table
- Extends `job_applications` table with new fields
- Adds new indexes

**Verify:**
- Check Convex dashboard for new tables
- Confirm indexes are created
- Test queries work

### 2. Install Dependencies (if needed)

```bash
# Already in package.json, but verify:
pnpm install
```

**Dependencies:**
- `puppeteer` - For browser automation
- `convex` - Already installed
- `tsx` - For running TypeScript

### 3. Configure Environment

```bash
# Ensure .env.local has:
CONVEX_URL=https://your-deployment.convex.cloud

# For testing:
HEADLESS=false  # Show browser during development
```

### 4. Create Application Template

**Option A: Via Convex Dashboard**
1. Go to Convex dashboard → `application_templates` table
2. Insert document with required fields (see below)

**Option B: Via Script**
```typescript
// Create a script: create-template.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

await convex.mutation(api.application_templates.create, {
  name: "Default Template",
  isDefault: true,
  fullName: "Your Name",
  email: "your.email@example.com",
  phone: "+31 6 12345678",
  location: "Amsterdam, Netherlands",
  linkedinUrl: "https://linkedin.com/in/yourprofile",
  githubUrl: "https://github.com/yourusername",
  portfolioUrl: "https://yourportfolio.com",
  cvUrl: "https://yourwebsite.com/cv.pdf",
  coverLetterTemplate: `Dear Hiring Manager at {company},

I am excited to apply for the {position} role...

Best regards,
{name}`,
  availability: "2 weeks notice",
  salaryExpectation: "€60,000 - €80,000",
  rightsToWork: "EU Citizen",
});
```

**Required Template Fields:**
- `name` - Template name (e.g., "Default")
- `isDefault` - true for main template
- `fullName` - Your full name
- `email` - Contact email
- `phone` - Phone number
- `location` - City, Country

**Optional but Recommended:**
- `linkedinUrl`, `githubUrl`, `portfolioUrl`
- `cvUrl` - URL to your CV
- `coverLetterTemplate` - With {company} and {position} placeholders
- `availability`, `salaryExpectation`, `rightsToWork`

### 5. Configure Auto-Apply Settings

**Initial Safe Configuration:**

```typescript
await convex.mutation(api.auto_apply_settings.update, {
  mode: "manual",           // Start safe
  enabled: false,           // Disabled by default
  dailyLimit: 5,           // Conservative limit
  scoreThreshold: 75,
  companyCooldownDays: 30,
  blacklistCompanies: [],  // Add known bad companies
  blacklistKeywords: [],   // Add dealbreakers
  whitelistCompanies: [],
  requiredKeywords: [],    // Your must-have skills
  dryRun: true,            // ALWAYS start with dry-run!
  notifyOnApply: true,
  autoWithdrawOnBetter: false,
  weeklyReportEnabled: true,
});
```

### 6. Test in Dry-Run Mode

```bash
# Test with dry-run (no actual applications)
tsx apps/admin/scripts/auto-apply.ts --dry-run

# Check output:
ls screenshots/  # Should see screenshots
cat ~/logs/auto-apply/*.log  # Should see logs
```

**What to verify:**
- Script runs without errors
- Screenshots are captured
- Logs show job filtering
- Form detection works
- No actual applications submitted

### 7. Add UI Route (Optional)

Add settings page to admin dashboard:

```typescript
// apps/admin/src/app/settings/auto-apply/page.tsx
import { AutoApplySettings } from "@/components/auto-apply-settings";

export default function AutoApplySettingsPage() {
  return <AutoApplySettings />;
}
```

Or add to existing settings page.

### 8. Setup Cron Job (When Ready)

**⚠️ Only after extensive dry-run testing!**

```bash
# Add to OpenClaw cron
openclaw cron add "0 9,17 * * *" \
  "cd ~/Projects/personal/leroy-steding-portfolio && \
   ./apps/admin/scripts/auto-apply-cron.sh"

# Verify cron job
openclaw cron list
```

**Recommended schedule:**
- Start: Once per day (e.g., 9 AM)
- Later: Twice per day (9 AM, 5 PM)
- Active search: Every 6 hours

### 9. Monitor and Adjust

**Daily (first week):**
- Check logs: `cat ~/logs/auto-apply/*.log`
- Review applications in Convex dashboard
- Verify confirmations received
- Adjust filters as needed

**Weekly:**
- Review application success rate
- Tune score threshold
- Update blacklists/whitelists
- Adjust daily limits

**Monthly:**
- Analyze response rates
- Compare auto vs manual applications
- Optimize for quality

## ⚠️ Pre-Production Checklist

Before enabling auto-apply in production:

- [ ] Convex schema deployed successfully
- [ ] Application template created with real data
- [ ] Settings configured conservatively
- [ ] Tested in dry-run mode (at least 5 runs)
- [ ] Reviewed screenshots - form filling works
- [ ] Checked logs - no errors
- [ ] Blacklist configured (if any companies to avoid)
- [ ] Required keywords set (your tech stack)
- [ ] Daily limit set low (5-10)
- [ ] Notifications enabled
- [ ] Dry-run mode ON initially
- [ ] Read AUTO_APPLY_GUIDE.md completely
- [ ] Understanding of emergency stop procedure

## 🚨 Emergency Stop

If something goes wrong:

```bash
# 1. Stop cron jobs immediately
openclaw cron list
openclaw cron remove <job-id>

# 2. Disable via Convex dashboard or API
# Go to auto_apply_settings table → set enabled = false

# 3. Review what happened
cat ~/logs/auto-apply/*.log | grep ERROR

# 4. Check applications
# Convex dashboard → job_applications → filter by appliedVia = "auto-apply"

# 5. Withdraw if needed (manual for now)
```

## 📊 Success Metrics

Track these to evaluate system:

- **Application success rate** - % of attempted vs successful
- **Response rate** - % of applications receiving replies
- **Interview rate** - % leading to interviews
- **Quality score** - Match score of successful applications
- **Error rate** - % of failed applications

## 🔄 Rollout Plan

**Week 1: Manual Mode**
- Enable: `mode = "manual"`, `enabled = false`
- Action: Review suggested jobs, one-click apply
- Goal: Validate job matches are good quality

**Week 2: Semi-Auto Dry-Run**
- Enable: `mode = "semi-auto"`, `dryRun = true`
- Action: Review what would be auto-applied
- Goal: Verify high-score jobs are worth applying to

**Week 3: Semi-Auto Live (Low Volume)**
- Enable: `mode = "semi-auto"`, `dryRun = false`, `dailyLimit = 5`
- Action: Monitor applications daily
- Goal: Build confidence in automation

**Week 4: Increase Volume**
- Enable: `dailyLimit = 10`
- Action: Continue monitoring
- Goal: Scale to comfortable level

**Week 5+: Consider Full-Auto (Optional)**
- Enable: `mode = "full-auto"`, `scoreThreshold = 70`
- Action: Weekly reviews
- Goal: Maximum automation with quality

## 📝 Notes

- **Schema changes are additive** - Won't break existing job_applications
- **All new fields are optional** - Backward compatible
- **Indexes improve query performance** - Especially for filtering
- **Templates support multiple** - Can create different templates for different roles
- **Settings are global** - One configuration per user (for now)

## 🎯 Next Steps After Deployment

1. Create your first application template
2. Configure initial settings (safe defaults)
3. Run 5-10 dry-run tests
4. Review results and adjust
5. Enable manual mode for 1 week
6. Gradually increase automation level
7. Monitor and optimize

---

**Remember:** Start slow, test extensively, increase automation gradually. Safety first! 🚀
