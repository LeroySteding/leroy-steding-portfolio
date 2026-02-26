# Project Filtering & Sorting

## Overview
Comprehensive filtering and sorting system for the portfolio projects page with URL parameter persistence for shareable, bookmarkable URLs.

## Features

✅ **Category Filtering** - Filter by Product, Client, or Internal projects  
✅ **Technology Stack Filtering** - Multi-select tech stack filters  
✅ **Sorting Options** - Sort by date (newest/oldest) or title (A-Z/Z-A)  
✅ **URL Parameter Persistence** - Shareable and bookmarkable filter states  
✅ **Active Filter Chips** - Visual indication of active filters  
✅ **Results Count** - Real-time count of filtered results  
✅ **Clear All Filters** - One-click filter reset  
✅ **Mobile-Responsive** - Optimized for all screen sizes  
✅ **Smooth Animations** - Framer Motion transitions  
✅ **Accessible UI** - Keyboard navigation and ARIA labels  

## URL Parameter Schema

### Query Parameters

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `category` | string | `product`, `client`, `internal` | Filter by project category |
| `tech` | string[] | Any technology name | Multi-select tech stack filter |
| `sort` | string | `date-desc`, `date-asc`, `title-asc`, `title-desc` | Sort order |

### Example URLs

**Category Filter:**
```
/projects?category=product
```

**Technology Filters:**
```
/projects?tech=React&tech=TypeScript
```

**Category + Tech + Sort:**
```
/projects?category=client&tech=Next.js&sort=date-desc
```

**All Filters:**
```
/projects?category=product&tech=React&tech=Node.js&sort=title-asc
```

## Component Architecture

### ProjectFilters Component

**Location**: `components/projects/ProjectFilters.tsx`

**Props**:
```typescript
interface ProjectFiltersProps {
  categories: Record<string, string>;        // Category labels
  allTechnologies: string[];                 // All available techs
  locale: string;                            // Current language
  translations: {
    filter: {
      all: string;
      category: string;
      technologies: string;
      sortBy: string;
      clearAll: string;
      results: string;
    };
    sort: {
      dateDesc: string;
      dateAsc: string;
      titleAsc: string;
      titleDesc: string;
    };
  };
  totalResults: number;                      // Count of filtered results
}
```

**Key Features**:
- URL-based state management
- Active filter chips with remove buttons
- Sort dropdown with icons
- Mobile-responsive layout
- Framer Motion animations

### ProjectsGridClient Component

**Location**: `app/(main)/[locale]/projects/ProjectsGridClient.tsx`

**Responsibilities**:
- Read filters from URL params
- Filter projects by category and tech
- Sort projects by selected option
- Render filtered project cards
- Handle empty states

## Filtering Logic

### Category Filter

```typescript
if (categoryFilter !== "all") {
  filtered = filtered.filter((p) => p.category === categoryFilter);
}
```

### Technology Filter

```typescript
if (techFilters.length > 0) {
  filtered = filtered.filter((project) => {
    const projectTechs = project.technologies.map(getTechName);
    return techFilters.every((filter) => projectTechs.includes(filter));
  });
}
```

- **Logic**: ALL selected technologies must be present (AND logic)
- **Behavior**: Selecting "React" + "TypeScript" shows only projects with BOTH

### Sorting

```typescript
filtered.sort((a, b) => {
  switch (sortOption) {
    case "date-desc": return b.year - a.year;
    case "date-asc": return a.year - b.year;
    case "title-asc": return a.title.localeCompare(b.title);
    case "title-desc": return b.title.localeCompare(a.title);
  }
});
```

## URL State Management

### Reading URL Parameters

```typescript
const searchParams = useSearchParams();
const categoryFilter = searchParams.get("category") || "all";
const techFilters = searchParams.getAll("tech");
const sortOption = searchParams.get("sort") || "date-desc";
```

### Updating URL Parameters

```typescript
const createQueryString = (updates: Record<string, string | string[] | null>) => {
  const params = new URLSearchParams(searchParams);
  
  Object.entries(updates).forEach(([name, value]) => {
    if (value === null || value === "" || value === "all") {
      params.delete(name);
    } else if (Array.isArray(value)) {
      params.delete(name);
      value.forEach((v) => params.append(name, v));
    } else {
      params.set(name, value);
    }
  });
  
  return params.toString();
};
```

**Key Features**:
- Removes params when set to default/null
- Handles arrays for multi-select (`tech`)
- Preserves other params when updating one
- Uses `router.push` with `scroll: false`

## UI Components

### Filter Bar

```
┌─────────────────────────────────────────────────┐
│ 🔍 12 projects  [Product ×] [React ×]  [Sort ▼] │
└─────────────────────────────────────────────────┘
```

**Elements**:
- **Results count**: Shows number of filtered results
- **Active chips**: Visual tags for active filters with × buttons
- **Clear all**: Link to remove all filters
- **Sort dropdown**: Select box for sorting options

### Category Filters

```
Category
┌─────────┬─────────┬─────────┬──────────┐
│ All     │ Product │ Client  │ Internal │
└─────────┴─────────┴─────────┴──────────┘
```

**Behavior**:
- Single-select (radio button style)
- Active state with accent color
- Scale animation on selection

### Technology Filters

```
Technologies
┌───────┬────────────┬───────┬────────┐
│ React │ TypeScript │ Node  │ Next.js│
├───────┼────────────┼───────┼────────┤
│ Python│ PostgreSQL │ ...   │        │
└───────┴────────────┴───────┴────────┘
```

**Behavior**:
- Multi-select (checkbox style)
- Active state with secondary accent
- Wrap on multiple lines
- Scrollable on mobile

## Responsive Design

### Desktop (1024px+)
- Full filter bar with all options
- Sort dropdown on right
- Active chips inline

### Tablet (640px - 1023px)
- Filter bar wraps to 2 rows
- Sort dropdown below filters
- Active chips wrap naturally

### Mobile (< 640px)
- Filters stack vertically
- Full-width category buttons
- Technology chips wrap and scroll
- Sort dropdown at top

## Animations

### Filter Transitions

```typescript
<motion.div
  key={`${categoryFilter}-${techFilters.join(",")}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

- Smooth opacity fade on filter change
- Unique key triggers animation
- 300ms transition duration

### Active Chip Animations

```typescript
<motion.button
  layout
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
>
```

- Scale and fade in/out
- Layout animation for smooth reordering
- Framer Motion `AnimatePresence`

## Accessibility

### Keyboard Navigation

✅ Tab through all filters
✅ Enter/Space to toggle filters
✅ Arrow keys for sort dropdown
✅ Escape to close dropdowns

### Screen Readers

```tsx
<select aria-label="Sort by">
  <option>Newest first</option>
</select>

<button aria-label="Filter by React">
  React
</button>
```

### ARIA Labels

- Sort dropdown: `aria-label="Sort by"`
- Filter buttons: Clear labels
- Active chips: Describe filter + remove action

## Performance Optimizations

### Memoization

```typescript
// Extract all technologies once
const allTechnologies = useMemo(() => {
  const techSet = new Set<string>();
  projects.forEach(p => {
    p.technologies.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet).sort();
}, [projects]);

// Filter and sort once
const filteredProjects = useMemo(() => {
  // ... filtering and sorting logic
}, [projects, categoryFilter, techFilters, sortOption]);
```

### URL Updates

```typescript
router.push(pathname + query, { scroll: false });
```

- No page scroll on filter change
- Preserves user's scroll position
- Smoother UX

## Integration

### Server Component (page.tsx)

```tsx
export default async function ProjectsPage() {
  const projects = await getConvexProjects(locale);
  
  return (
    <ProjectsGridClient 
      projects={projects}
      translations={t}
      locale={locale}
    />
  );
}
```

### Client Component (ProjectsGridClient.tsx)

```tsx
export default function ProjectsGridClient({ projects, ... }) {
  const searchParams = useSearchParams();
  // Read URL params
  // Filter and sort
  // Render with ProjectFilters
}
```

## Localization

### English (en)

```typescript
filter: {
  all: "All Projects",
  category: "Category",
  technologies: "Technologies",
  sortBy: "Sort by",
  clearAll: "Clear all",
  results: "projects",
},
sort: {
  dateDesc: "Newest first",
  dateAsc: "Oldest first",
  titleAsc: "A to Z",
  titleDesc: "Z to A",
},
```

### Dutch (nl)

```typescript
filter: {
  all: "Alle Projecten",
  category: "Categorie",
  technologies: "Technologieën",
  sortBy: "Sorteren op",
  clearAll: "Alles wissen",
  results: "projecten",
},
sort: {
  dateDesc: "Nieuwste eerst",
  dateAsc: "Oudste eerst",
  titleAsc: "A tot Z",
  titleDesc: "Z tot A",
},
```

## Future Enhancements

- [ ] Search input for project titles/descriptions
- [ ] Date range filter (year slider)
- [ ] "Live" vs "Archived" filter
- [ ] Save filter presets
- [ ] Share filter link with social preview
- [ ] Analytics on popular filter combinations
- [ ] Infinite scroll for large project sets
- [ ] Filter count badges (e.g., "React (12)")

## Testing

### Test Cases

1. **Category Filter**
   - ✅ Filters projects by selected category
   - ✅ URL updates with `?category=product`
   - ✅ Active chip shows selected category
   - ✅ Clicking "All" clears filter

2. **Technology Filter**
   - ✅ Multiple techs can be selected
   - ✅ URL updates with multiple `?tech=` params
   - ✅ Shows only projects with ALL selected techs
   - ✅ Active chips show for each tech
   - ✅ Clicking chip removes that tech

3. **Sorting**
   - ✅ Date desc: Newest projects first
   - ✅ Date asc: Oldest projects first
   - ✅ Title asc: Alphabetical A-Z
   - ✅ Title desc: Alphabetical Z-A
   - ✅ URL updates with `?sort=`

4. **URL Sharing**
   - ✅ Copy URL with filters applied
   - ✅ Paste in new tab preserves filters
   - ✅ Browser back/forward works correctly

5. **Empty State**
   - ✅ Shows message when no results
   - ✅ Suggests clearing filters

6. **Mobile Responsive**
   - ✅ Filters stack vertically
   - ✅ Touch targets 44px minimum
   - ✅ Horizontal scrolling for tech chips

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Required Features**:
- URLSearchParams API
- Flexbox & CSS Grid
- ES6 JavaScript

## File Structure

```
apps/portfolio/
├── components/projects/
│   └── ProjectFilters.tsx                   # Filter UI component
├── app/(main)/[locale]/projects/
│   ├── page.tsx                             # Server component
│   ├── ProjectsGridClient.tsx               # Client grid with filters
│   └── ProjectsGrid.tsx                     # Legacy (can be removed)
├── locales/
│   ├── en.ts                                # English translations
│   └── nl.ts                                # Dutch translations
└── docs/
    └── PROJECT-FILTERING-SORTING.md         # This file
```

## Credits

- **Design**: Custom implementation by Leroy Steding
- **UI Library**: Framer Motion for animations
- **Routing**: Next.js App Router with useSearchParams

---

**Last Updated**: 2026-02-26  
**Status**: ✅ Production Ready  
**Task**: PORT-01
