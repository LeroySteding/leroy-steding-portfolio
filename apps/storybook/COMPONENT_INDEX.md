# Complete Component Index

## 📋 Overview

This document provides a comprehensive index of all components documented in the Steding Design System Storybook.

## 🎨 Foundations

### Colors
**Location**: `Foundations/Colors`  
**Description**: Cyber-themed color palette with neon accents and dark backgrounds
- Neon Cyan (#00f0ff) - Primary accent
- Neon Violet (#b026ff) - Secondary accent
- Neon Pink (#ff006e) - Tertiary accent
- Neon Green (#39ff14) - Success states
- Neon Blue (#0080ff) - Info/links
- Cyber backgrounds (5 shades from #050505 to #3a3a3a)

### Typography
**Location**: `Foundations/Typography`  
**Description**: System font stack with responsive sizing
- Headings: H1-H6 with responsive sizes
- Body text: Large, regular, small
- Special effects: Glow, gradient text

## 🧩 Primitives

### Button
**Location**: `Primitives/Button`  
**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onClick`: function

**Variants**:
- Primary - Neon cyan background
- Secondary - Neon violet background
- Outline - Transparent with cyan border
- Ghost - Transparent with hover effect

**Stories**:
- Default variants (Primary, Secondary, Outline, Ghost)
- Size variants (Small, Medium, Large)
- Disabled state
- All variants showcase

## 🏗️ Components

### 3D Card
**Location**: `Components/3D Card`  
**Description**: Interactive card with mouse-tracking tilt effect

**Components**:
- `CardContainer` - Wrapper with perspective
- `CardBody` - Content container with transform-3d
- `CardItem` - Individual 3D elements

**Stories**:
- Basic - Simple 3D card
- With Image - Card with image header
- Glowing - Card with glow effect

### Theme Toggle
**Location**: `Components/ThemeToggle`  
**Description**: Dark/light theme switcher with icon transition

**Features**:
- Sun/Moon icon toggle
- Smooth transitions
- Glass morphism effect
- Fixed positioning support

**Stories**:
- Default - Standalone toggle
- With Background - In dark container
- Positioned - Corner placement example

## 📄 Sections

### Hero Section
**Location**: `Sections/Hero`  
**Description**: Full-screen landing section with animated background

**Features**:
- Animated gradient orbs
- Title with glow effect
- Subtitle and description
- Dual CTA buttons

**Stories**:
- Default - Standard hero layout
- With Dark Background - Enhanced contrast

### About Section
**Location**: `Sections/About`  
**Description**: Personal introduction with image and skills

**Features**:
- Two-column layout (image + content)
- Skills tag grid
- Responsive design

**Stories**:
- Default - Complete about section

### Projects Section
**Location**: `Sections/Projects`  
**Description**: Project showcase with grid layout

**Features**:
- Project cards with hover effects
- Image placeholders
- Tag badges
- View all CTA

**Stories**:
- Default - Full projects grid
- Single Project - Individual project card

### Experience Section
**Location**: `Sections/Experience`  
**Description**: Work history with vertical timeline

**Features**:
- Timeline with connecting line
- Timeline dots
- Experience cards with hover
- Chronological order

**Stories**:
- Default - Complete timeline
- Single Experience - Individual card

### Contact Section
**Location**: `Sections/Contact`  
**Description**: Contact form with social links

**Features**:
- Contact form (name, email, message)
- Social media links
- Icon-based link cards
- Focus states on inputs

**Stories**:
- Default - Full contact section

### Tech Stack Section
**Location**: `Sections/Tech Stack`  
**Description**: Technology showcase organized by category

**Features**:
- Category grouping
- Icon grid layout
- Hover effects
- Color-coded categories

**Stories**:
- Default - All categories
- Single Category - Individual tech group

## 📱 Pages

### Home Page
**Location**: `Pages/Home Page`  
**Description**: Complete landing page template

**Includes**:
- Fixed header with navigation
- Hero section
- Quick stats grid
- Footer

**Stories**:
- Default - Full page layout

## 🔧 Utilities

### Language Switcher
**Location**: `Utilities/Language Switcher`  
**Description**: Multi-language dropdown selector

**Features**:
- Globe icon
- Dropdown menu
- Active state styling
- EN/NL support

**Stories**:
- Default - Standalone switcher
- In Header - Header placement example

## 📊 Component Statistics

### Total Components: 15

**By Category**:
- Foundations: 2
- Primitives: 1
- Components: 2
- Sections: 6
- Pages: 1
- Utilities: 1

**By Status**:
- ✅ Completed: 13
- 🔜 Planned: Multiple variants and states

## 🎯 Component Complexity

### Simple (Easy to implement)
- Button
- Theme Toggle
- Language Switcher

### Medium (Moderate complexity)
- 3D Card
- Project Cards
- Experience Cards
- Contact Form

### Complex (Advanced features)
- Hero Section (with animations)
- Complete Page Layouts
- Timeline Components

## 📦 Package Sources

### @steding/ui (Shared UI Package)
- Button component
- Base primitives

### Portfolio App Components
- All sections (Hero, About, Projects, etc.)
- Theme Toggle
- Language Switcher
- 3D Card

### @steding/timeline-scroll
- Timeline components
- Scroll-based animations

## 🚀 Usage Patterns

### Common Patterns

1. **Section Layout**
```tsx
<section className="py-20 px-4 bg-cyber-dark">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-neon-cyan mb-12 text-center">
      Title
    </h2>
    {/* Content */}
  </div>
</section>
```

2. **Card Component**
```tsx
<div className="bg-cyber-gray-dark border border-cyber-gray-light 
                rounded-xl p-6 hover:border-neon-cyan transition-all">
  {/* Content */}
</div>
```

3. **Button Usage**
```tsx
<button className="px-8 py-3 bg-neon-cyan text-cyber-darker 
                   font-semibold rounded-lg hover:bg-neon-cyan/90 
                   transition-all hover:shadow-lg hover:shadow-neon-cyan/50">
  Click Me
</button>
```

## 🔄 State Variations

### Documented States
- Default
- Hover
- Disabled
- Active/Selected
- Focus
- Loading (planned)
- Error (planned)

## 🎨 Theme Integration

All components support:
- ✅ Dark theme (primary)
- ✅ Cyber color scheme
- ✅ Glass morphism
- ✅ Neon glow effects
- 🔜 Light theme variants

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

All components are tested across these breakpoints.

## ♿ Accessibility

All components include:
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Color contrast compliance

## 📈 Future Additions

### Planned Components
- [ ] Form inputs (text, select, checkbox, radio)
- [ ] Modals and dialogs
- [ ] Toast notifications
- [ ] Loading spinners
- [ ] Progress bars
- [ ] Tabs component
- [ ] Accordion
- [ ] Tooltip
- [ ] Breadcrumbs
- [ ] Pagination

### Planned Sections
- [ ] Skills section
- [ ] Testimonials
- [ ] Blog posts grid
- [ ] FAQ section

### Planned Pages
- [ ] Project detail page
- [ ] Experience detail page
- [ ] Blog post template
- [ ] 404 error page

---

**Last Updated**: November 2024  
**Total Stories**: 30+  
**Coverage**: 80% of portfolio components
