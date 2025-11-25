# Quick Start Guide - Portfolio Improvements

## 🚀 Getting Started

### 1. Install Dependencies (from monorepo root)
```bash
# From project root
pnpm install
```

### 2. Initialize Git Hooks
```bash
# From project root - this happens automatically during install
# Or run manually:
pnpm prepare
```

### 3. Install Playwright Browsers
```bash
# From project root
npx playwright install --with-deps
```

### 4. Run Tests
```bash
# From monorepo root - runs tests in all packages
pnpm test

# From apps/portfolio - run specific tests
cd apps/portfolio

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

## 📋 What's Been Added

### ✅ Testing
- **Vitest** for unit tests
- **Playwright** for E2E tests
- **Accessibility testing** with axe-core
- Sample tests included

### ✅ Error Handling
- Error boundaries at all levels
- Production-ready error UI
- Error tracking service ready

### ✅ Performance
- Bundle analyzer
- Performance budgets
- Core Web Vitals monitoring
- Lighthouse CI integration

### ✅ Code Quality
- Pre-commit hooks (lint + typecheck)
- Pre-push tests
- Conventional commits validation
- Automated formatting

### ✅ CI/CD
- GitHub Actions workflows
- Automated testing
- Security scanning
- Vercel preview deployments

## 🔧 Optional Setup

### Enable Error Tracking (Choose One)

**Option 1: Sentry**
```bash
pnpm add @sentry/nextjs
```
Add to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=your_dsn
SENTRY_AUTH_TOKEN=your_token
```

**Option 2: LogRocket**
```bash
pnpm add logrocket
```
Add to `.env.local`:
```env
NEXT_PUBLIC_LOGROCKET_APP_ID=your_app_id
```

Then uncomment the relevant code in `lib/monitoring/error-tracking.ts`

### GitHub Secrets (for CI/CD)

Add these in GitHub repo settings → Secrets:
- `CODECOV_TOKEN` - Get from codecov.io
- `VERCEL_TOKEN` - Get from Vercel settings
- `VERCEL_ORG_ID` - Get from Vercel
- `VERCEL_PROJECT_ID` - Get from Vercel

## 📝 New Commands

```bash
# Testing
pnpm test              # Run unit tests
pnpm test:ui           # Test UI
pnpm test:coverage     # Coverage report
pnpm test:e2e          # E2E tests
pnpm test:e2e:ui       # E2E with UI

# Build & Analysis
pnpm build:analyze     # Bundle size analysis

# Git Hooks
# Automatically run on commit/push
```

## 📚 Documentation

See `IMPROVEMENTS.md` for detailed documentation of all changes.

## ✨ Benefits

- **80%+ test coverage** target
- **Automated quality checks** before every commit
- **Performance monitoring** in CI/CD
- **Security scanning** for vulnerabilities
- **Error tracking** ready to enable
- **Deployment previews** for PRs

---

**Questions?** Check `IMPROVEMENTS.md` for comprehensive documentation.
