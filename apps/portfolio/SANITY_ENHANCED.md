# 🎨 Enhanced Sanity Studio Guide

## 🎉 What's New?

Your Sanity Studio now has a **completely redesigned structure** with powerful content management capabilities!

### ✨ New Features

1. **📝 Organized Content** - Clean categorization with emojis
2. **🏗️ Page Builder** - Drag-and-drop page construction
3. **🧩 Modular Sections** - Reusable content sections
4. **⚙️ Site Settings** - Centralized configuration
5. **🌍 Full i18n Support** - Manage EN/NL content separately
6. **🎯 Better Navigation** - Intuitive sidebar structure

---

## 📂 Studio Structure

Your Studio is now organized into **4 main areas**:

### 1. 📝 Content
**Location**: Click "Content" in the sidebar

Manage all your content types:

- **Blog Posts** - Your articles, tutorials, and research
  - Full markdown support
  - Categories: Article, Tutorial, Research
  - Tag system
  - Featured posts
  - Language-specific content (EN/NL)

- **Projects** - Portfolio projects (coming soon)
- **Experiences** - Work history (coming soon)

**How to use**:
```
📝 Content → Blog Posts → Click any post to edit
```

---

### 2. 🏗️ Pages
**Location**: Click "Pages" in the sidebar

Build and manage entire pages:

#### **Home Page**
- Separate versions for English and Dutch
- Drag-and-drop sections to build your page
- Add Hero, About, Experience, Projects, Blog, Contact sections

#### **Page Builder**
Each page has a "Page Builder" field where you can:
1. Click "+ Add item"
2. Select a section type (Hero, About, Contact, etc.)
3. Either create new or reference existing sections
4. Drag to reorder sections
5. Remove sections you don't need

**SEO Settings** built into each page:
- Meta title
- Meta description  
- Open Graph image

**Example workflow**:
```
🏗️ Pages → Home Page → Edit Page Builder → Add sections
```

---

### 3. 🧩 Sections
**Location**: Click "Sections" in the sidebar

Create reusable content sections:

#### **Hero Sections**
Perfect for landing pages and headers:
- Title, subtitle, tagline
- CTA buttons (customizable text, links, variants)
- Statistics display
- Language-specific versions

**Fields**:
- Section Name (internal reference)
- Title & Subtitle
- Tagline
- CTA Buttons (array)
  - Button Text
  - Link
  - Variant (primary/secondary)
- Stats (array)
  - Value
  - Label

#### **About Sections**
Tell your story:
- Section title with highlight text
- Introduction (markdown)
- Expertise description (markdown)
- Experience description (markdown)
- Highlights (array of key points)

#### **Contact Sections**
Connect with visitors:
- Title and description
- Email and phone
- Social media links
- Icon configuration

**How sections work**:
1. Create a section (e.g., "Hero - Homepage EN")
2. Fill in the content
3. Reference it in a page's Page Builder
4. Reuse the same section across multiple pages!

**Example**:
```
🧩 Sections → Hero Sections → Create → Fill content → Save
Then use in: 🏗️ Pages → Home Page → Page Builder → Add Hero reference
```

---

### 4. ⚙️ Settings
**Location**: Click "Settings" in the sidebar

Global site configuration:

#### **Site Settings**
- Site title and description
- Logo and favicon
- Social media links (GitHub, LinkedIn, Twitter, Email)
- Default SEO settings
  - Meta title template
  - Meta description
  - Default OG image

#### **Navigation**
- Main navigation menu items
- Footer navigation links
- Label and link configuration

**Note**: These are singleton documents (one per site)

---

## 🌍 Internationalization (i18n)

### How i18n Works

All content types support English and Dutch:

1. **Creating Translated Content**:
   - Create your content in one language
   - Look for the "Translations" tab
   - Click "Create translation"
   - Select language (EN or NL)
   - Fill in translated content

2. **Language Indicator**:
   - Each document has a hidden `language` field
   - Automatically set to 'en' or 'nl'
   - Used for filtering in queries

3. **Linked Translations**:
   - The i18n plugin links related documents
   - Switch between languages easily in the Studio
   - Maintain content parity

### Best Practices

✅ **Do**:
- Create both EN and NL versions of important content
- Use consistent slugs (e.g., `about` vs `over-ons`)
- Keep structure similar across languages
- Use the Translations tab to link documents

❌ **Don't**:
- Mix languages in the same document
- Forget to translate key pages
- Use automatic translation (quality matters!)

---

## 🎯 Common Workflows

### Creating a New Blog Post

1. Navigate to `📝 Content → Blog Posts`
2. Click "Create" button
3. Fill in:
   - Title
   - Slug (auto-generated or custom)
   - Excerpt (max 200 chars)
   - Content (markdown editor)
   - Category (Article/Tutorial/Research)
   - Tags
   - Author (defaults to "Leroy Steding")
   - Published date
   - Reading time
   - Featured toggle
4. Click "Publish"
5. **For translation**:
   - Go to "Translations" tab
   - Click "Create Dutch translation"
   - Fill in Dutch content

### Building a New Page

1. Navigate to `🏗️ Pages`
2. Click "Create Page"
3. Add title and slug
4. Open "Page Builder" section
5. Click "+ Add item"
6. Select section type:
   - **Reference**: Choose existing section
   - **Create new**: Build section inline
7. Drag sections to reorder
8. Configure SEO settings
9. Publish!

### Creating Reusable Sections

**Example**: Creating a Hero section for multiple pages

1. Navigate to `🧩 Sections → Hero Sections`
2. Click "Create"
3. Fill in:
   ```
   Section Name: "Hero - Services Page"
   Title: "Our Services"
   Subtitle: "Professional Solutions"
   Tagline: "We deliver excellence"
   CTA Buttons:
     - Text: "Get Started", Link: "/contact", Variant: primary
     - Text: "Learn More", Link: "/about", Variant: secondary
   ```
4. Save
5. Now you can reference this in multiple pages!

### Updating Site-Wide Settings

1. Navigate to `⚙️ Settings → Site Settings`
2. Update:
   - Logo (upload image)
   - Social links
   - Default SEO meta
3. Changes apply site-wide immediately!

---

## 🔧 Advanced Features

### Page Builder Tips

**Flexibility**:
- Mix section types freely
- Create custom layouts per page
- Reuse sections or create unique ones
- Preview changes in real-time

**Organization**:
- Name sections descriptively ("Hero - Homepage", not "Hero 1")
- Group related sections
- Use section references for consistency

### Markdown Editor

Your content fields support full markdown:

```markdown
# Heading 1
## Heading 2

**Bold text**
*Italic text*

- List item 1
- List item 2

[Link text](https://example.com)

`inline code`

\`\`\`javascript
// Code block
const example = "code";
\`\`\`
```

### Media Management

- Upload images directly in sections
- Automatic optimization
- Hotspot for focal point selection
- Alt text for accessibility
- Generates optimized URLs

---

## 📊 Content Strategy

### Recommended Structure

**For a typical portfolio site**:

1. **Pages** (4-6 pages):
   - Home (EN + NL)
   - About (EN + NL)
   - Projects (EN + NL)
   - Blog (listing page)
   - Contact (EN + NL)

2. **Sections** (10-15 reusable):
   - 2-3 Hero variants
   - 2 About sections (EN/NL)
   - 1-2 Contact forms
   - Service sections
   - CTA sections

3. **Blog Posts** (Ongoing):
   - Minimum 6 posts to start
   - Both languages
   - Regular updates (weekly/monthly)

### Content Calendar

Use Sanity's publishing workflow:
- **Draft**: Work in progress
- **Published**: Live on site
- **Scheduled**: Publish at specific time (with plugins)

---

## 🚀 Next Steps

### Immediate Actions

1. ✅ **Explore the Studio**
   ```
   http://localhost:3000/studio
   ```

2. ✅ **Check your blog posts**
   - Should see all 12 posts (6 EN + 6 NL)
   - Try editing one
   - Preview markdown rendering

3. ✅ **Create your first section**
   - Go to 🧩 Sections → Hero Sections
   - Create "Hero - Homepage EN"
   - Fill in your actual content

4. ✅ **Build a page**
   - Go to 🏗️ Pages → Home Page
   - Add sections to Page Builder
   - Preview structure

### Short-term Goals

- [ ] Create all section content (Hero, About, Contact)
- [ ] Build Home page with Page Builder
- [ ] Configure Site Settings with your branding
- [ ] Set up Navigation menus
- [ ] Add more blog posts

### Long-term Enhancements

- [ ] Add Project schema and content
- [ ] Add Experience schema and content  
- [ ] Implement draft/preview workflow
- [ ] Add Clerk authentication for Studio
- [ ] Set up webhooks for auto-deploy
- [ ] Configure CDN caching

---

## 🆘 Troubleshooting

### Can't see new structure?

1. Refresh the Studio page
2. Clear browser cache
3. Check console for errors
4. Restart dev server

### Section not showing in Page Builder?

- Make sure section is published
- Check document type is added to schema
- Verify reference in `page.ts` schema

### i18n not working?

- Check `language` field is set correctly
- Verify document is linked in Translations tab
- Ensure both versions exist

### Changes not reflecting on site?

- Studio changes are immediate in Sanity
- Frontend needs to fetch new data
- May need to rebuild/redeploy
- Check if using ISR/SSG caching

---

## 📚 Resources

- [Sanity Page Builder Guide](https://www.sanity.io/guides/build-your-own-page-builder)
- [i18n Plugin Docs](https://www.sanity.io/plugins/document-internationalization)
- [Markdown Plugin](https://www.sanity.io/plugins/sanity-plugin-markdown)
- [Structure Tool API](https://www.sanity.io/docs/structure-builder-introduction)

---

## 🎉 Summary

You now have a **production-ready CMS** with:

✅ **Organized content** - Clear structure with icons
✅ **Page Builder** - Drag-and-drop page construction  
✅ **Modular sections** - Reusable content blocks
✅ **Full i18n** - English & Dutch support
✅ **Site settings** - Global configuration
✅ **Blog management** - 12 posts ready to go

**Your Studio is ready for content creation!** 🚀

Start by exploring the new structure at:
```
http://localhost:3000/studio
```

Enjoy your enhanced Sanity Studio! 🎨
