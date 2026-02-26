# Blog Code Syntax Highlighting with Shiki

## Overview
Beautiful, performant code syntax highlighting for blog posts using Shiki - a modern syntax highlighter powered by the same engine used in VS Code.

## Features

✅ **Dual Theme Support** - Automatically switches between light and dark themes  
✅ **Copy Code Button** - Hover over any code block to reveal copy functionality  
✅ **Language Badges** - Displays language name with hover effect  
✅ **25+ Languages** - TypeScript, JavaScript, Python, Bash, JSON, CSS, and more  
✅ **Line Numbers** - Optional line numbering (configurable per code block)  
✅ **Filename Display** - Show file names in code block headers  
✅ **Beautiful Styling** - Matches portfolio design system with accent colors  
✅ **Performant** - Zero runtime syntax highlighting, pre-rendered HTML  

## Usage in Blog Posts

### Basic Code Block
```markdown
\`\`\`typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
\`\`\`
```

### With Filename (coming soon)
```markdown
\`\`\`typescript:utils/greeting.ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}
\`\`\`
```

### Inline Code
```markdown
Use the `useState` hook for state management.
```

## Supported Languages

- **JavaScript/TypeScript**: `javascript`, `typescript`, `jsx`, `tsx`
- **Web**: `html`, `css`, `markdown`, `json`, `yaml`
- **Backend**: `python`, `php`, `ruby`, `java`, `go`, `rust`
- **Systems**: `c`, `cpp`, `csharp`, `swift`, `kotlin`
- **Shell**: `bash`, `shell`, `sql`
- **Mobile**: `dart` (Flutter), `swift`, `kotlin`

## Component API

### CodeBlock Component

```tsx
<CodeBlock 
  code="console.log('Hello');"
  language="javascript"
  showLineNumbers={false}
  filename="app.js"
/>
```

#### Props
- `code: string` - The code to highlight (required)
- `language: string` - Programming language (required)
- `showLineNumbers?: boolean` - Show line numbers (default: false)
- `filename?: string` - Display filename in header (optional)

## Theme Configuration

The component automatically detects and responds to the user's theme preference:

- **Light Mode**: Uses `github-light` theme
- **Dark Mode**: Uses `github-dark` theme

Themes are bundled at build time for optimal performance.

## Customization

### Adding More Languages

Edit `components/ui/CodeBlock.tsx`:

```typescript
const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: [
    // Add your language here
    "elixir",
    "haskell",
    // ...
  ] as BundledLanguage[],
});
```

### Changing Themes

Replace theme names in the highlighter config:

```typescript
themes: ["tokyo-night", "min-light"], // or any other bundled theme
```

Available themes: [Shiki Themes](https://shiki.matsu.io/themes)

### Styling

The component uses Tailwind classes and respects the design system:
- `accent-primary` - Highlight color
- `surface` - Background colors
- `text-*` - Text colors

## Performance

- **Build-time Rendering**: HTML is generated during Next.js build
- **Zero Client JS**: No runtime syntax highlighting
- **Lazy Loading**: Highlighter only loads when needed
- **Optimized Bundle**: Only selected languages/themes are bundled

## Migration from react-syntax-highlighter

Old (Prism):
```tsx
<SyntaxHighlighter 
  style={vscDarkPlus}
  language="javascript"
>
  {code}
</SyntaxHighlighter>
```

New (Shiki):
```tsx
<CodeBlock 
  code={code}
  language="javascript"
/>
```

### Benefits of Shiki
1. **Better Performance** - Pre-rendered HTML vs client-side JS
2. **More Accurate** - Uses VS Code's grammar engine
3. **Better TypeScript Support** - Native TS understanding
4. **Smaller Bundle** - No large runtime library
5. **Theme Consistency** - Matches VS Code exactly

## Accessibility

- ✅ Semantic HTML with `<pre>` and `<code>` tags
- ✅ Keyboard accessible copy button
- ✅ ARIA labels on interactive elements
- ✅ High contrast theme support
- ✅ Screen reader compatible

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Examples

See the blog post: `/blog/code-highlighting-demo` for live examples.

## Implementation Details

### File Structure
```
apps/portfolio/
├── components/ui/
│   └── CodeBlock.tsx          # Main component
├── app/(main)/[locale]/blog/
│   └── [slug]/
│       └── BlogPostClient.tsx # Integration point
└── docs/
    └── BLOG-CODE-HIGHLIGHTING.md
```

### Dependencies
- `shiki` ^3.23.0 - Syntax highlighting engine
- `next-themes` - Theme detection

### Related Files
- `components/ui/CodeBlock.tsx` - Main code highlighting component
- `app/(main)/[locale]/blog/[slug]/BlogPostClient.tsx` - Blog post renderer
- `tailwind.config.ts` - Design system configuration

## Troubleshooting

### Code block not rendering
- Check language name is supported
- Verify markdown fenced code block syntax
- Check browser console for errors

### Theme not switching
- Ensure `next-themes` is configured in layout
- Check `ThemeProvider` wrapper in app layout

### Copy button not working
- Check clipboard permissions in browser
- Verify HTTPS connection (required for clipboard API)

## Future Enhancements

- [ ] Line highlighting (highlight specific lines)
- [ ] Diff syntax highlighting (show +/- changes)
- [ ] Collapsible code blocks for long snippets
- [ ] Code playground integration (run code in browser)
- [ ] Filename extraction from markdown syntax

## Credits

- **Shiki**: https://shiki.matsu.io/
- **VS Code Themes**: https://github.com/microsoft/vscode
- **Design**: Custom implementation by Leroy Steding

---

**Last Updated**: 2026-02-26  
**Status**: ✅ Production Ready  
**Task**: BLOG-03
