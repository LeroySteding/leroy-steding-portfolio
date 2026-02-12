#!/bin/bash

# Quick installation test script
# Run this to verify the admin app is ready to install

echo "🔍 Verifying Portfolio Admin Panel Setup..."
echo ""

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this script from apps/admin directory"
  exit 1
fi

echo "✅ In correct directory"

# Check required files exist
REQUIRED_FILES=(
  "package.json"
  "next.config.ts"
  "tsconfig.json"
  "tailwind.config.ts"
  ".env.example"
  "src/middleware.ts"
  "src/app/layout.tsx"
  "src/lib/supabase/schema.sql"
  "README.md"
  "SETUP.md"
  "CHECKLIST.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done

echo "✅ All required files present"

# Count TypeScript files
TS_COUNT=$(find src -name "*.ts" -o -name "*.tsx" | wc -l | tr -d ' ')
echo "✅ Found $TS_COUNT TypeScript/TSX files"

# Check for required directories
REQUIRED_DIRS=(
  "src/app/(admin)"
  "src/app/(auth)"
  "src/components/ui"
  "src/components/layout"
  "src/components/editor"
  "src/lib/supabase"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ Missing required directory: $dir"
    exit 1
  fi
done

echo "✅ All required directories present"

# Check package.json has required dependencies
if ! grep -q "@clerk/nextjs" package.json; then
  echo "❌ Missing Clerk dependency"
  exit 1
fi

if ! grep -q "@supabase/supabase-js" package.json; then
  echo "❌ Missing Supabase dependency"
  exit 1
fi

if ! grep -q "@tiptap/react" package.json; then
  echo "❌ Missing Tiptap dependency"
  exit 1
fi

echo "✅ All required dependencies in package.json"

# Check .env.example has required variables
if ! grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.example; then
  echo "❌ Missing Clerk env vars in .env.example"
  exit 1
fi

if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.example; then
  echo "❌ Missing Supabase env vars in .env.example"
  exit 1
fi

echo "✅ All required env vars in .env.example"

# Check database schema
if ! grep -q "CREATE TABLE blog_posts" src/lib/supabase/schema.sql; then
  echo "❌ Database schema incomplete"
  exit 1
fi

echo "✅ Database schema looks good"

# Count pages
PAGE_COUNT=$(find src/app -name "page.tsx" | wc -l | tr -d ' ')
echo "✅ Found $PAGE_COUNT pages"

echo ""
echo "✨ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "   1. Run: pnpm install (from monorepo root)"
echo "   2. Follow CHECKLIST.md to set up Clerk and Supabase"
echo "   3. Copy .env.example to .env and fill in credentials"
echo "   4. Run: pnpm dev"
echo ""
echo "📖 Documentation:"
echo "   - Quick start: SETUP.md"
echo "   - Full guide: README.md"
echo "   - Checklist: CHECKLIST.md"
echo "   - Overview: PROJECT_OVERVIEW.md"
echo ""
echo "🎯 Ready to build! 🚀"
