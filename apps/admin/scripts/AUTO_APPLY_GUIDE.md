# Auto-Apply System - Complete Guide

## Overview

The Auto-Apply System is a **safety-first** job application automation tool with three operating modes and comprehensive controls.

⚠️ **CRITICAL**: Always start in dry-run mode and manually verify results before enabling live applications.

---

## Table of Contents

1. [Operating Modes](#operating-modes)
2. [Safety Features](#safety-features)
3. [Setup Guide](#setup-guide)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Safety Guidelines](#safety-guidelines)
7. [Troubleshooting](#troubleshooting)

---

## Operating Modes

### 1. Manual Mode (Default)
- **What it does**: Displays matched jobs with pre-filled application data
- **User action required**: Review and one-click apply
- **Safety**: Highest - full control over every application
- **Best for**: Selective applications, high-value positions

### 2. Semi-Auto Mode
- **What it does**: Automatically applies to high-match jobs (score >80%)
- **Notifications**: Sends notification for each application
- **Safety**: Medium - applies only to top matches
- **Best for**: Active job search with quality filter

### 3. Full-Auto Mode
- **What it does**: Automatically applies to all jobs above threshold (default: 70%)
- **Notifications**: Daily summary only
- **Safety**: Lower - requires careful configuration
- **Best for**: High-volume applications with well-tuned filters

---

## Safety Features

### 1. Daily Application Limit
- **Default**: 10 applications per day
- **Purpose**: Prevents spam, maintains quality
- **Configurable**: Adjust based on your search intensity
- **Reset**: Midnight local time

### 2. Company Cooldown Period
- **Default**: 30 days
- **Purpose**: Prevents re-applying too soon
- **Behavior**: Skips companies you've applied to recently
- **Override**: Can be bypassed with `--force` flag

### 3. Blacklist
- **Companies**: Skip specific companies entirely
- **Keywords**: Skip jobs containing certain terms
- **Use cases**:
  - Companies with poor culture
  - Positions requiring specific skills you lack
  - Geographic locations you want to avoid

### 4. Whitelist
- **Companies**: Prioritize applications to preferred companies
- **Behavior**: Whitelisted companies bypass some filters
- **Use cases**: Dream companies, referral opportunities

### 5. Required Keywords
- **Purpose**: Only apply to jobs containing specific terms
- **Example**: ["TypeScript", "React", "remote"]
- **Behavior**: Skip jobs missing ANY required keyword

### 6. Dry-Run Mode
- **Purpose**: Test configuration without submitting applications
- **Behavior**: Goes through entire flow but doesn't submit
- **Outputs**: Screenshots, logs, would-be applications
- **Usage**: ALWAYS test with dry-run first

### 7. Application Tracking
- **Logs**: Every action, timestamp, outcome
- **Screenshots**: Confirmation pages (when enabled)
- **Status**: Applied, failed, skipped with reasons
- **Withdrawal**: Track withdrawn applications

---

## Setup Guide

### Prerequisites

1. **Convex Schema**: Already configured ✅
2. **Node.js**: v18+ required
3. **Puppeteer**: Installed via dependencies
4. **Application Template**: Create at least one default template

### Step 1: Create Application Template

```typescript
// Via Convex dashboard or API
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

I am writing to express my interest in the {position} position...

Best regards,
{name}`,
  availability: "2 weeks notice",
  salaryExpectation: "€60,000 - €80,000",
  rightsToWork: "EU Citizen",
});
```

### Step 2: Configure Settings

```typescript
// Start with safe defaults
await convex.mutation(api.auto_apply_settings.update, {
  mode: "manual",  // Start with manual
  enabled: false,  // Disabled by default
  dailyLimit: 5,   // Conservative limit
  scoreThreshold: 75,
  companyCooldownDays: 30,
  blacklistCompanies: ["Company A", "Company B"],
  blacklistKeywords: ["blockchain", "crypto"],
  whitelistCompanies: [],
  requiredKeywords: ["TypeScript", "React"],
  dryRun: true,    // Always dry-run first!
  notifyOnApply: true,
  autoWithdrawOnBetter: false,
  weeklyReportEnabled: true,
});
```

### Step 3: Test with Dry-Run

```bash
# Test with specific job
tsx apps/admin/scripts/auto-apply.ts --dry-run --job-id=<job-id>

# Test with all matching jobs
tsx apps/admin/scripts/auto-apply.ts --dry-run

# Review logs and screenshots
ls screenshots/
cat logs/auto-apply-*.log
```

### Step 4: Enable Gradually

1. **Week 1**: Manual mode, review all matches
2. **Week 2**: Semi-auto mode with dry-run, verify quality
3. **Week 3**: Semi-auto mode live, low daily limit (5)
4. **Week 4+**: Adjust based on results

---

## Configuration

### Environment Variables

```bash
# .env.local
CONVEX_URL=https://your-deployment.convex.cloud
```

### Settings Reference

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `mode` | string | "manual" | Operating mode (manual/semi-auto/full-auto) |
| `enabled` | boolean | false | Master on/off switch |
| `dailyLimit` | number | 10 | Max applications per day |
| `scoreThreshold` | number | 70 | Minimum match score (0-100) |
| `companyCooldownDays` | number | 30 | Days before re-applying |
| `blacklistCompanies` | array | [] | Companies to skip |
| `blacklistKeywords` | array | [] | Keywords to avoid |
| `whitelistCompanies` | array | [] | Companies to prioritize |
| `requiredKeywords` | array | [] | Must-have keywords |
| `dryRun` | boolean | true | Test mode |
| `notifyOnApply` | boolean | true | Send notifications |
| `autoWithdrawOnBetter` | boolean | false | Withdraw from lower-score jobs |
| `weeklyReportEnabled` | boolean | true | Weekly summary emails |

---

## Usage

### Command Line

```bash
# Dry-run (test mode)
tsx apps/admin/scripts/auto-apply.ts --dry-run

# Live run
tsx apps/admin/scripts/auto-apply.ts

# Force (bypass daily limit)
tsx apps/admin/scripts/auto-apply.ts --force

# Specific job
tsx apps/admin/scripts/auto-apply.ts --job-id=xyz123

# Combined
tsx apps/admin/scripts/auto-apply.ts --dry-run --force --job-id=xyz123
```

### Cron Job (Automated)

```bash
# Add to OpenClaw cron (recommended)
openclaw cron add "0 9,17 * * *" "cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/auto-apply-cron.sh"

# Or add to system cron
crontab -e
# Add: 0 9,17 * * * cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/auto-apply-cron.sh
```

### Scheduled Times (Examples)

```bash
# Twice daily (9 AM, 5 PM)
0 9,17 * * *

# Once daily (9 AM)
0 9 * * *

# Weekdays only (9 AM)
0 9 * * 1-5

# Every 6 hours
0 */6 * * *
```

---

## Safety Guidelines

### DO ✅

1. **Start with dry-run mode** - ALWAYS test first
2. **Review logs regularly** - Check for errors or unexpected behavior
3. **Start with low daily limits** - 5-10 applications max
4. **Use blacklists liberally** - Better to miss than to apply incorrectly
5. **Monitor application quality** - Check confirmation emails/receipts
6. **Update templates regularly** - Keep CV and info current
7. **Set realistic score thresholds** - 70+ for full-auto, 80+ for semi-auto
8. **Enable notifications** - Stay informed of applications
9. **Check cooldowns work** - Verify no duplicate applications
10. **Keep screenshots** - Evidence of applications

### DON'T ❌

1. **Don't enable full-auto without testing** - Weeks of dry-run first
2. **Don't set daily limit >20** - Quality over quantity
3. **Don't ignore error logs** - Could indicate broken applications
4. **Don't apply to blacklisted companies** - Respect your preferences
5. **Don't use outdated templates** - Always have current info
6. **Don't bypass cooldowns casually** - Looks spammy to recruiters
7. **Don't disable notifications** - You need to know what's happening
8. **Don't run multiple instances** - One cron job is enough
9. **Don't forget to update score thresholds** - As preferences change
10. **Don't use force flag in cron jobs** - Manual intervention only

### Emergency Stop

If something goes wrong:

```bash
# 1. Disable immediately
await convex.mutation(api.auto_apply_settings.update, { enabled: false });

# 2. Stop cron jobs
openclaw cron list
openclaw cron remove <job-id>

# 3. Review logs
cat ~/logs/auto-apply/*.log | grep ERROR

# 4. Check applications
# Visit Convex dashboard -> job_applications table

# 5. Withdraw if needed
# Use application tracking to identify and withdraw
```

---

## Monitoring & Reports

### Daily Stats

Check dashboard or query:

```typescript
const stats = await convex.query(api.auto_apply_settings.getStats);
console.log(stats);
// {
//   enabled: true,
//   mode: "semi-auto",
//   dailyLimit: 10,
//   todayCount: 3,
//   remainingToday: 7,
//   totalAutoApplied: 45,
//   dryRun: false
// }
```

### Weekly Report

Generated automatically if enabled, includes:
- Total applications
- Success rate
- Top companies applied to
- Average match score
- Failed applications
- Recommendations

---

## Troubleshooting

### Issue: "No default template found"

**Solution**: Create an application template and mark as default.

### Issue: Daily limit reached

**Solution**: Wait until midnight or use `--force` flag (carefully).

### Issue: No jobs matching criteria

**Solution**: 
- Lower score threshold
- Remove some required keywords
- Check blacklist isn't too broad

### Issue: Applications failing

**Solution**:
- Check logs for specific errors
- Run in dry-run mode to see screenshots
- Verify template data is correct
- Check ProLinker site hasn't changed structure

### Issue: Duplicate applications

**Solution**:
- Check cooldown period is working
- Verify deduplication logic
- Review company name matching

---

## Advanced Features

### Custom Form Filling

Extend the `fillApplicationForm` method to handle platform-specific fields.

### Multi-Platform Support

Add new `applyTo<Platform>` methods for LinkedIn, Indeed, etc.

### AI-Powered Cover Letters

Integrate OpenAI API to generate custom cover letters per job.

### Score Tuning

Adjust job matching algorithm in `job_matches` to improve score accuracy.

---

## Legal & Ethics

### Compliance

- ✅ Respect robots.txt and rate limits
- ✅ Don't circumvent CAPTCHA or anti-bot measures
- ✅ Provide accurate information in applications
- ✅ Don't apply to jobs you're not qualified for

### Best Practices

- Apply to jobs you genuinely want
- Don't waste recruiters' time
- Be prepared to respond to all applications
- Withdraw from positions you're no longer interested in

---

## Support

For issues or questions:

1. Check logs: `~/logs/auto-apply/`
2. Review Convex tables: `job_applications`, `auto_apply_settings`
3. Test in dry-run mode
4. Contact Orchestrator agent for help

---

**Remember: This is a power tool. Use responsibly.** 🚀
