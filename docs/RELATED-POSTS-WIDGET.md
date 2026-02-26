# Related Posts Widget

## Overview
Smart related posts recommendation system that increases engagement and page views by suggesting relevant content based on tag similarity, category matching, and recency.

## Features

✅ **Intelligent Matching Algorithm** - Multi-factor scoring system  
✅ **Tag-Based Similarity** - Prioritizes posts with shared tags  
✅ **Category Matching** - Boosts posts in same category  
✅ **Featured Post Bonus** - Highlights featured content  
✅ **Fallback to Recent Posts** - Shows latest posts when no matches found  
✅ **Responsive Design** - 1 column mobile, 2 on tablet, 3 on desktop  
✅ **Rich Card UI** - Thumbnail, title, date, reading time, excerpt  
✅ **Smooth Interactions** - Hover effects and scale transitions  
✅ **Optimized Performance** - Memoized calculations, SSR-friendly  

## Scoring Algorithm

### Point System

The relevance score is calculated based on multiple factors:

| Factor | Points | Description |
|--------|--------|-------------|
| **Same Category** | +3 | Post is in the same category (article, tutorial, research) |
| **Shared Tags** | +2 each | Each tag that appears in both posts |
| **Featured Post** | +1 | Bonus for featured content |

### Example Calculation

**Current Post:**
- Category: `tutorial`
- Tags: `["react", "nextjs", "typescript"]`

**Candidate Post:**
- Category: `tutorial`
- Tags: `["react", "typescript", "testing"]`
- Featured: `true`

**Score Calculation:**
```
Same category: 3 points
Shared tags (react, typescript): 2 × 2 = 4 points
Featured bonus: 1 point
Total: 8 points
```

### Algorithm Implementation

```typescript
function calculateRelevanceScore(post: BlogPost, currentPost: BlogPost): number {
  let score = 0;

  // Same category bonus
  if (post.category === currentPost.category) {
    score += 3;
  }

  // Shared tags bonus (2 points per shared tag)
  const sharedTags = post.tags.filter((tag) => 
    currentPost.tags.includes(tag)
  );
  score += sharedTags.length * 2;

  // Featured post bonus
  if (post.featured) {
    score += 1;
  }

  return score;
}
```

### Fallback Strategy

When no posts have a relevance score > 0:
1. Sort all posts by publish date (most recent first)
2. Take the top N recent posts
3. Return these as "suggested reading"

When some posts match but not enough to fill the grid:
1. Use all relevant posts (score > 0)
2. Fill remaining slots with recent posts
3. Remove duplicates
4. Limit to `maxPosts` (default: 3)

## Component API

### `<RelatedPosts />`

```tsx
import RelatedPosts from "@/components/blog/RelatedPosts";

<RelatedPosts 
  currentPost={post}
  allPosts={posts}
  language="en"
  maxPosts={3}
/>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentPost` | `BlogPost` | ✅ Yes | - | The current blog post being viewed |
| `allPosts` | `BlogPost[]` | ✅ Yes | - | Array of all blog posts to search |
| `language` | `"en" \| "nl"` | ❌ No | `"en"` | Language for UI text |
| `maxPosts` | `number` | ❌ No | `3` | Maximum number of related posts to show |

### BlogPost Type

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  coverImage?: string;
  featured?: boolean;
}
```

## Card Design

### Layout Structure

```
┌─────────────────────────────┐
│   [Cover Image]             │  ← 192px height
│   [Category Badge]          │  ← Top-right overlay
├─────────────────────────────┤
│ 📅 Jan 15, 2026  ⏱️ 5 min  │  ← Meta info
│                             │
│ Post Title Goes Here        │  ← Title (2 lines max)
│                             │
│ Short excerpt describing... │  ← Excerpt (2 lines max)
│                             │
│ Read article →              │  ← CTA with arrow
└─────────────────────────────┘
```

### Visual Features

- **Cover Image**: 3:2 aspect ratio, scales on hover
- **Category Badge**: Accent color, top-right position
- **Meta Info**: Icon + text for date and reading time
- **Title**: Bold, 2-line clamp, color changes on hover
- **Excerpt**: 2-line clamp, muted color
- **CTA**: Accent color, arrow translates on hover
- **Card**: Scale transform on hover (1.02x)

### Responsive Grid

```css
/* Mobile: 1 column */
grid-template-columns: 1fr;

/* Tablet (640px+): 2 columns */
@media (min-width: 640px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop (1024px+): 3 columns */
@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}
```

## Integration

### Server Component (Page)

```tsx
// app/(main)/[locale]/blog/[slug]/page.tsx
export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params;
  
  // Fetch current post
  const post = await getConvexPostByIdOrSlug(slug, locale);
  
  // Fetch all posts for related posts calculation
  const allPosts = await getConvexPosts(locale);
  
  return <BlogPostClient post={post} allPosts={allPosts} language={locale} />;
}
```

### Client Component

```tsx
// BlogPostClient.tsx
export default function BlogPostClient({ post, allPosts, language }) {
  return (
    <article>
      {/* ... article content ... */}
      
      {/* Related Posts Widget */}
      <RelatedPosts 
        currentPost={post}
        allPosts={allPosts}
        language={language}
        maxPosts={3}
      />
    </article>
  );
}
```

## Performance Optimizations

### Memoization

```tsx
const relatedPosts = useMemo(
  () => getRelatedPosts(currentPost, allPosts, maxPosts),
  [currentPost, allPosts, maxPosts]
);
```

- Recalculates only when dependencies change
- Prevents unnecessary re-renders
- O(n log n) complexity due to sorting

### Data Fetching

- **SSR-Friendly**: All posts fetched server-side
- **No Client Fetching**: Reduces client-side data requests
- **Pre-computed**: Scores calculated at render time

### Image Optimization

```tsx
<Image
  src={post.coverImage}
  alt={post.title}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

## Localization

### Supported Languages

| Language | Code | Title | Read More |
|----------|------|-------|-----------|
| English | `en` | "You might also like" | "Read article" |
| Dutch | `nl` | "Je vindt dit misschien ook leuk" | "Lees artikel" |

### Adding New Languages

```tsx
const t = {
  en: {
    title: "You might also like",
    readMore: "Read article",
  },
  nl: {
    title: "Je vindt dit misschien ook leuk",
    readMore: "Lees artikel",
  },
  // Add new language here
};
```

## Testing Scenarios

### Scenario 1: Perfect Match
**Current Post:**
- Category: `tutorial`
- Tags: `["react", "typescript", "hooks"]`

**Expected Related:**
1. Tutorial with all 3 tags (score: 9)
2. Tutorial with 2 tags (score: 7)
3. Article with 2 tags (score: 4)

### Scenario 2: Partial Match
**Current Post:**
- Category: `article`
- Tags: `["javascript"]`

**Expected Related:**
1. Article with "javascript" tag (score: 5)
2. Recent posts as fallback

### Scenario 3: No Match
**Current Post:**
- Category: `research`
- Tags: `["ai", "unique-topic"]`

**Expected Related:**
1. Most recent posts (sorted by date)

### Scenario 4: Insufficient Posts
**Current Post:**
- Tags: `["react"]`
- Only 2 other posts exist

**Expected Related:**
- Show all 2 posts (not 3)

## Edge Cases Handled

✅ **No Related Posts** - Component returns `null`  
✅ **Empty Tags** - Falls back to category + recency  
✅ **Duplicate Avoidance** - Current post excluded  
✅ **Missing Cover Images** - Shows gradient placeholder with initial  
✅ **Missing Excerpts** - Card adapts without excerpt  
✅ **Locale Routing** - Handles both EN and NL paths  

## Analytics Tracking

### Recommended Events

```typescript
// Track related post clicks
onClick={() => {
  analytics.track('Related Post Clicked', {
    from_post: currentPost.slug,
    to_post: post.slug,
    position: index + 1,
    score: calculateRelevanceScore(post, currentPost),
  });
}}
```

### Success Metrics

- **Click-Through Rate**: % of users clicking related posts
- **Bounce Rate**: Did related posts reduce exits?
- **Page Views per Session**: Impact on engagement
- **Top Performing Posts**: Which posts get most clicks?

## Accessibility

### Semantic HTML

```html
<article>
  <a href="/blog/post-slug">
    <h4>Post Title</h4>
    <time datetime="2026-01-15">Jan 15, 2026</time>
  </a>
</article>
```

### ARIA Labels

- Links have meaningful text (post titles)
- Time elements include `datetime` attribute
- Images have descriptive `alt` text

### Keyboard Navigation

- ✅ Fully keyboard accessible (Tab/Enter)
- ✅ Visible focus states
- ✅ Logical tab order

### Screen Readers

- Post title as link text (clear destination)
- Date and reading time announced
- Category badge provides context

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Uses standard CSS Grid and modern JavaScript.

## File Structure

```
apps/portfolio/
├── components/blog/
│   └── RelatedPosts.tsx                    # Main component
├── app/(main)/[locale]/blog/
│   └── [slug]/
│       ├── page.tsx                        # Server: fetch all posts
│       └── BlogPostClient.tsx              # Client: render widget
└── docs/
    └── RELATED-POSTS-WIDGET.md             # This file
```

## Future Enhancements

- [ ] ML-based recommendations (user behavior)
- [ ] A/B testing different algorithms
- [ ] Collaborative filtering (users who read X also read Y)
- [ ] Read time tracking for better scoring
- [ ] Recency decay (older posts score lower)
- [ ] User preference learning
- [ ] Social proof (most popular posts)

## Troubleshooting

### No Related Posts Showing

**Check:**
1. Is `allPosts` array populated?
2. Are there other posts in the same language?
3. Does current post have tags or category set?

**Debug:**
```tsx
console.log('All posts:', allPosts.length);
console.log('Current post tags:', currentPost.tags);
```

### Wrong Posts Appearing

**Check:**
1. Tag spelling matches exactly (case-sensitive)
2. Category names are consistent
3. Posts are in correct language

**Debug:**
```tsx
const scoredPosts = allPosts.map(post => ({
  title: post.title,
  score: calculateRelevanceScore(post, currentPost)
}));
console.table(scoredPosts);
```

### Performance Issues

**Solutions:**
1. Ensure `useMemo` is wrapping calculation
2. Limit `allPosts` to published posts only
3. Pre-filter by language server-side
4. Consider pagination if > 100 posts

## Credits

- **Algorithm Design**: Tag-based collaborative filtering
- **UI Design**: Custom implementation by Leroy Steding
- **Inspiration**: Medium, Dev.to, and modern blog platforms

---

**Last Updated**: 2026-02-26  
**Status**: ✅ Production Ready  
**Task**: BLOG-04
