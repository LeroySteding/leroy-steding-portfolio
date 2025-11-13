# Publishing @steding/timeline-scroll to npm

## Pre-Publishing Checklist

### 1. Build the Package
```bash
cd packages/timeline-scroll
pnpm build
```

### 2. Verify Build Output
Check that `dist/` contains:
- ✅ `index.js` (CJS)
- ✅ `index.mjs` (ESM)
- ✅ `index.d.ts` (TypeScript definitions)
- ✅ `index.d.mts` (ESM TypeScript definitions)
- ✅ `styles.css` (Styles)
- ✅ Source maps (.map files)

### 3. Test Package Locally

#### Option A: Test in monorepo
Add to another package's dependencies:
```json
{
  "dependencies": {
    "@steding/timeline-scroll": "workspace:*"
  }
}
```

#### Option B: Test with npm link
```bash
cd packages/timeline-scroll
npm link

cd /path/to/test-project
npm link @steding/timeline-scroll
```

#### Option C: Test with npm pack
```bash
cd packages/timeline-scroll
npm pack
# Creates @steding-timeline-scroll-0.1.0.tgz

cd /path/to/test-project
npm install /path/to/@steding-timeline-scroll-0.1.0.tgz
```

### 4. Verify Package Contents
```bash
npm pack --dry-run
```

This shows exactly what will be published.

## Publishing to npm

### First Time Setup

1. **Create npm account** (if you don't have one)
   - Visit https://www.npmjs.com/signup

2. **Login to npm**
   ```bash
   npm login
   ```

3. **Verify login**
   ```bash
   npm whoami
   ```

### Publishing Steps

#### 1. Update Version (if needed)
```bash
# For patch release (0.1.0 -> 0.1.1)
npm version patch

# For minor release (0.1.0 -> 0.2.0)
npm version minor

# For major release (0.1.0 -> 1.0.0)
npm version major
```

#### 2. Build Fresh
```bash
pnpm clean
pnpm build
```

#### 3. Publish
```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (@steding/...).

#### 4. Verify Publication
```bash
npm view @steding/timeline-scroll
```

Or visit: https://www.npmjs.com/package/@steding/timeline-scroll

## Usage After Publishing

### Installation
```bash
npm install @steding/timeline-scroll framer-motion
# or
pnpm add @steding/timeline-scroll framer-motion
# or
yarn add @steding/timeline-scroll framer-motion
```

### Import
```tsx
import { TimelineScroll } from '@steding/timeline-scroll';
import '@steding/timeline-scroll/styles.css';
```

## Continuous Publishing

### Using Changesets (Recommended)

1. **Install changesets**
   ```bash
   pnpm add -D @changesets/cli
   pnpm changeset init
   ```

2. **Create a changeset**
   ```bash
   pnpm changeset
   ```

3. **Version packages**
   ```bash
   pnpm changeset version
   ```

4. **Publish**
   ```bash
   pnpm changeset publish
   ```

### Automated with GitHub Actions

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install
      - run: pnpm build --filter @steding/timeline-scroll
      
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### Issue: Package already exists
- You cannot publish the same version twice
- Bump the version number and try again

### Issue: 403 Forbidden
- Verify you're logged in: `npm whoami`
- Check you have permission for the @steding scope
- Use `--access public` flag

### Issue: Missing files in published package
- Check the `files` field in package.json
- Review .npmignore
- Use `npm pack --dry-run` to preview

### Issue: TypeScript errors when importing
- Verify `types` field in package.json points to correct .d.ts file
- Check that .d.ts files exist in dist/
- Ensure tsconfig includes proper lib settings

## Package Maintenance

### Update Dependencies
```bash
pnpm update --latest
```

### Security Audit
```bash
pnpm audit
pnpm audit --fix
```

### Bundle Size Check
```bash
npx bundlephobia @steding/timeline-scroll
```

## Best Practices

1. **Always build before publishing**
2. **Test in a real project first**
3. **Use semantic versioning**
4. **Keep README up to date**
5. **Add changelog for major updates**
6. **Test tree-shaking works**
7. **Monitor bundle size**
8. **Respond to issues promptly**

## Support

For issues or questions:
- GitHub Issues: https://github.com/steding/timeline-scroll/issues
- npm package: https://www.npmjs.com/package/@steding/timeline-scroll
