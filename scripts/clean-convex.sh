#!/bin/bash
# Clean Convex compiled files before deployment
# This prevents duplicate file errors during deployment

echo "🧹 Cleaning Convex compiled files..."

cd "$(dirname "$0")/.." || exit 1

# Remove compiled JS files from convex directory (but not _generated)
find convex -maxdepth 1 -name "*.js" -delete 2>/dev/null
find convex -maxdepth 1 -name "*.js.map" -delete 2>/dev/null

# Clear Convex cache
rm -rf .convex 2>/dev/null
rm -rf node_modules/.convex 2>/dev/null

echo "✅ Convex files cleaned successfully"
