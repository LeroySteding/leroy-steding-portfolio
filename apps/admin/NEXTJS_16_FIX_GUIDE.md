# Next.js 16 Async Params Fix Guide

## 🔴 Issue
Next.js 16 breaking change: `params` and `searchParams` are now **Promises** and must be awaited.

**Error**: Application crashes on dynamic routes (e.g., `/tasks/[id]`, `/blog/[id]/edit`)

---

## ✅ Solution

### For Client Components ("use client")

Use React's `use()` hook to unwrap the Promise:

```tsx
// ❌ BEFORE (broken in Next.js 16)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  // ...
}

// ✅ AFTER (fixed)
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // ...
}
```

### For Server Components (default)

Make the component async and await params:

```tsx
// ❌ BEFORE
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  // ...
}

// ✅ AFTER
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}
```

---

## 🔧 Files to Fix (4)

### 1. `src/app/(admin)/tasks/[id]/page.tsx`

**Line 36** - Change:
```tsx
// FROM:
export default function TaskDetailPage({ params }: { params: { id: string } }) {

// TO:
import { use } from "react"; // Add at top if not present

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
```

**Line 40, 60, 72** - Replace all `params.id` with `taskId`:
```tsx
// FROM: params.id
// TO: taskId
```

---

### 2. `src/app/(admin)/projects/[id]/edit/page.tsx`

Add `use()` hook:
```tsx
// Add import
import { use } from "react";

// Update function signature
export default function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>; // Add Promise wrapper
}) {
  const { id } = use(params); // Unwrap promise
  
  // Rest of code unchanged
  const project = useQuery(api.projects.get, { id: id as Id<"projects"> });
  // ...
}
```

---

### 3. `src/app/(admin)/projects/[id]/page.tsx`

Same fix as #2:
```tsx
import { use } from "react";

export default function ProjectViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = useQuery(api.projects.get, { id: id as Id<"projects"> });
  // ...
}
```

---

### 4. `src/app/(admin)/skills/[id]/page.tsx`

Same fix:
```tsx
import { use } from "react";

export default function SkillViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const skill = useQuery(api.skills.get, { id: id as Id<"skills"> });
  // ...
}
```

---

## 🚀 Quick Fix (Auto)

Run the official Next.js codemod:

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
npx @next/codemod@latest next-async-request-api .
```

**Note**: The codemod may not catch everything. Manually verify all dynamic routes.

---

## ✅ Verification

After fixing:

1. **Build test**:
   ```bash
   pnpm build
   ```

2. **Runtime test**:
   - Visit `/tasks/123`
   - Visit `/projects/456`
   - Visit `/skills/789`
   - Visit `/blog/abc/edit`

3. **Expected**: No errors, pages load correctly

---

## 📋 Checklist

- [ ] Fix `tasks/[id]/page.tsx`
- [ ] Fix `projects/[id]/edit/page.tsx`
- [ ] Fix `projects/[id]/page.tsx`
- [ ] Fix `skills/[id]/page.tsx`
- [ ] Run `pnpm build` (should succeed)
- [ ] Test dynamic routes in browser
- [ ] Deploy to Vercel

---

## 🔗 References

- [Next.js 16 Migration Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Async Dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [Official Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)

---

## 💡 Pro Tip

For **new pages** going forward, always use:

```tsx
// Client components
import { use } from "react";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
}

// Server components
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

---

**Status**: Ready to implement  
**Estimated Time**: 15 minutes (manual) or 5 minutes (codemod + verification)  
**Priority**: 🔴 BLOCKER - App is broken without this fix
