# Convex Deployment Guide

## Quick Deploy

```bash
pnpm convex:deploy
```

This command automatically:
1. Cleans compiled `.js` and `.js.map` files
2. Clears Convex cache
3. Deploys to production with typecheck disabled

## Manual Steps

If you need to deploy manually:

```bash
# 1. Clean compiled files first
pnpm convex:clean

# 2. Deploy to Convex
npx convex deploy --yes --typecheck=disable
```

## Common Issues

### "Two output files share the same path" Error

**Cause**: Stale `.js` files in the `convex/` directory causing build conflicts.

**Solution**: Run `pnpm convex:clean` before deploying.

**Prevention**: 
- `.js` files are now ignored by git (`.gitignore` + `convex/.gitignore`)
- Use `pnpm convex:deploy` which auto-cleans before deploying

### TypeScript Errors During Deploy

**Solution**: We use `--typecheck=disable` because the monorepo structure causes path resolution issues during Convex's bundling phase. Type checking still happens during development via `pnpm typecheck`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm convex:clean` | Remove compiled files and cache |
| `pnpm convex:deploy` | Clean + deploy to production |

## Files

- `scripts/clean-convex.sh` - Cleanup script
- `convex/.gitignore` - Prevents committing compiled JS files
- `.gitignore` - Root-level ignore patterns for Convex files

## Deployment Checklist

1. ✅ Convex functions deployed → `pnpm convex:deploy`
2. ✅ Git committed → `git add . && git commit -m "..."`
3. ✅ Pushed to GitHub → `git push`
4. ✅ Vercel auto-deploys → Monitor at vercel.com
5. ✅ Verify production → Check admin.leroysteding.nl

## Last Updated

2026-03-03 - Fixed duplicate file errors with cleanup automation
