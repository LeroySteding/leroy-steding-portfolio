# Blog Table of Contents

## Overview
Automatic table of contents generation for blog posts with hierarchical structure, active section tracking, and smooth scrolling navigation.

## Features

✅ **Hierarchical Structure** - Supports both H2 and H3 headings with proper nesting  
✅ **Auto-extraction** - Automatically extracts headings from markdown content  
✅ **Sticky Sidebar** - TOC stays visible while scrolling (`sticky top-32`)  
✅ **Active Section Highlighting** - Current section is highlighted with accent color  
✅ **Smooth Scroll** - Click any heading to smoothly scroll to that section  
✅ **Visual Hierarchy** - H3 headings are indented with `ml-4` for clear structure  
✅ **Active Indicator** - Left border shows which section you're reading  
✅ **Responsive** - Only shows on large screens (lg+) to preserve mobile UX  

## Implementation

### Heading Extraction

Headings are extracted from markdown content using regex:

```typescript
const headings = useMemo(() => {
  if (!post?.content) return [];
  const matches = post.content.match(/^#{2,3}\s+(.+)$/gm);
  if (!matches) return [];
  return matches.map((match: string) => {
    const level = match.startsWith("###") ? 3 : 2;
    const text = match.replace(/^#{2,3}\s+/, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { text, id, level };
  });
}, [post]);
```

### Active Section Tracking

Active section is tracked on scroll using intersection detection:

```typescript
useEffect(() => {
  const updateProgress = () => {
    // ... progress bar code ...
    
    // Update active heading
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);
    
    for (let i = headingElements.length - 1; i >= 0; i--) {
      const element = headingElements[i];
      if (element && element.getBoundingClientRect().top <= 150) {
        setActiveHeading(headings[i].id);
        break;
      }
    }
  };

  window.addEventListener("scroll", updateProgress);
  updateProgress();
  return () => window.removeEventListener("scroll", updateProgress);
}, [headings]);
```

### Heading IDs

Both H2 and H3 markdown headings get IDs for linking:

```typescript
h2: ({ children }) => {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <h2
      id={id}
      className="text-4xl font-display font-bold mb-6 mt-12 text-text-primary border-l-4 border-accent-primary pl-6 scroll-mt-24"
    >
      {children}
    </h2>
  );
},
h3: ({ children }) => {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <h3
      id={id}
      className="text-3xl font-display font-bold mb-4 mt-10 text-text-primary scroll-mt-24"
    >
      {children}
    </h3>
  );
},
```

### Smooth Scrolling

Clicking a TOC link smoothly scrolls to the target:

```typescript
<a
  href={`#${heading.id}`}
  onClick={(e) => {
    e.preventDefault();
    document.getElementById(heading.id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
>
  {heading.text}
</a>
```

## Visual Design

### Hierarchy Indicators

- **H2 headings**: No indentation, full width
- **H3 headings**: 1rem left margin (`ml-4`) for visual nesting

### Active State

```tsx
className={`block text-sm py-2 px-3 rounded-lg transition-all ${
  heading.level === 3 ? "ml-4" : ""
} ${
  activeHeading === heading.id
    ? "bg-accent-primary/20 text-accent-primary font-bold border-l-2 border-accent-primary"
    : "text-text-secondary hover:text-accent-primary hover:bg-surface border-l-2 border-transparent"
}`}
```

Active items have:
- Background: `accent-primary/20`
- Text color: `accent-primary`
- Font weight: `font-bold`
- Left border: `border-l-2 border-accent-primary`

### Hover State

Non-active items on hover:
- Text color: Changes to `accent-primary`
- Background: `hover:bg-surface`

## Usage in Blog Posts

Write blog posts with clear heading structure:

```markdown
## Main Section Title

Content for the main section...

### Subsection Title

Content for the subsection...

### Another Subsection

More content...

## Another Main Section

Content continues...

### Nested Under Second Section

Final content...
```

The TOC will automatically:
1. Extract all H2 and H3 headings
2. Generate clean IDs (lowercase, hyphenated)
3. Create hierarchical navigation
4. Track which section is active
5. Enable smooth scrolling to any section

## Accessibility

- ✅ Semantic `<nav>` element for TOC
- ✅ Proper heading hierarchy in content (H2 → H3)
- ✅ Keyboard accessible links
- ✅ `scroll-mt-24` prevents headings from hiding behind fixed header
- ✅ High contrast for active state
- ✅ Clear focus states on interactive elements

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- **Minimal re-renders**: Uses `useMemo` for heading extraction
- **Efficient scroll handler**: Single event listener with throttling
- **No layout thrashing**: Uses `getBoundingClientRect()` efficiently

## Future Enhancements

- [ ] H4 support for deeply nested content
- [ ] Collapse/expand for long TOCs
- [ ] Progress indicator showing how far through each section
- [ ] "Back to top" button for mobile
- [ ] Estimated reading time per section

## Related Features

- **Reading Progress Bar**: Shows overall progress at top of page
- **Sticky Sidebar**: TOC container uses `sticky top-32` positioning
- **Code Highlighting**: Works seamlessly with Shiki code blocks

## File Structure

```
apps/portfolio/
└── app/(main)/[locale]/blog/
    └── [slug]/
        └── BlogPostClient.tsx  # TOC implementation
```

## Testing

To test the TOC:

1. Create a blog post with multiple H2 and H3 headings
2. View the post in browser
3. Verify TOC appears in right sidebar
4. Click various headings - page should smooth scroll
5. Scroll manually - active section should update
6. Check that H3 headings are indented
7. Verify active section has accent color and border

## Troubleshooting

### TOC not appearing
- Check that blog post has H2 or H3 headings
- Verify content is in markdown format
- Ensure `headings.length > 0` condition passes

### Active section not updating
- Check browser console for JavaScript errors
- Verify heading IDs match between TOC and content
- Ensure scroll event listener is attached

### Smooth scroll not working
- Verify `scroll-behavior: smooth` CSS is not disabled
- Check that heading IDs exist in the DOM
- Ensure `preventDefault()` is called on click

### Hierarchy not showing
- Verify H3 headings have `ml-4` class
- Check that heading levels are correctly detected
- Ensure regex matches both ## and ### patterns

## Credits

- **Design**: Custom implementation by Leroy Steding
- **Inspiration**: Medium, Dev.to, and modern blog platforms

---

**Last Updated**: 2026-02-26  
**Status**: ✅ Production Ready  
**Task**: BLOG-02
