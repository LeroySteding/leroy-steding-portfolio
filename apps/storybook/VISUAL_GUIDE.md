# 🎨 Storybook Visual Component Guide

A visual reference guide for navigating and understanding the Steding Design System.

## 🗺️ Navigation Map

```
📚 Steding Design System
│
├── 📖 Introduction
│   └── Welcome & Getting Started
│
├── 🎨 Foundations
│   ├── 🌈 Colors
│   │   ├── Neon Accents (Cyan, Violet, Pink, Green, Blue)
│   │   └── Dark Backgrounds (5 shades)
│   │
│   └── 📝 Typography
│       ├── Headings (H1-H6)
│       ├── Body Text (Large, Regular, Small)
│       └── Special Effects (Glow, Gradient)
│
├── 🧩 Primitives
│   └── 🔘 Button
│       ├── Primary (Cyan)
│       ├── Secondary (Violet)
│       ├── Outline (Transparent + Border)
│       ├── Ghost (Transparent)
│       ├── Small / Medium / Large
│       └── Disabled State
│
├── 🏗️ Components
│   ├── 🎴 3D Card
│   │   ├── Basic (Simple tilt)
│   │   ├── With Image (Header image)
│   │   └── Glowing (Neon glow effect)
│   │
│   └── 🌓 Theme Toggle
│       ├── Default (Sun/Moon icon)
│       ├── With Background (In container)
│       └── Positioned (Corner placement)
│
├── 📄 Sections
│   ├── 🚀 Hero
│   │   ├── Full-screen landing
│   │   ├── Animated gradient orbs
│   │   ├── Title + Subtitle + CTA
│   │   └── Responsive layout
│   │
│   ├── 👤 About
│   │   ├── Two-column layout
│   │   ├── Image + Content
│   │   ├── Skills tags
│   │   └── Personal intro
│   │
│   ├── 💼 Projects
│   │   ├── Grid layout (2-3 columns)
│   │   ├── Project cards
│   │   ├── Hover effects
│   │   └── View all CTA
│   │
│   ├── 📅 Experience
│   │   ├── Vertical timeline
│   │   ├── Timeline dots
│   │   ├── Experience cards
│   │   └── Chronological order
│   │
│   ├── 📧 Contact
│   │   ├── Contact form (Name, Email, Message)
│   │   ├── Social links
│   │   ├── Icon cards
│   │   └── Focus states
│   │
│   └── 💻 Tech Stack
│       ├── Category groups (Frontend, Backend, Tools)
│       ├── Icon grid
│       ├── Hover effects
│       └── Color-coded
│
├── 📱 Pages
│   └── 🏠 Home Page
│       ├── Fixed Header + Navigation
│       ├── Hero Section
│       ├── Stats Grid (Projects, Clients, Experience, Technologies)
│       └── Footer
│
└── 🔧 Utilities
    └── 🌍 Language Switcher
        ├── Dropdown menu
        ├── Globe icon
        ├── EN / NL options
        └── Active state styling
```

## 🎨 Color Palette Visual

```
NEON ACCENTS                    DARK BACKGROUNDS
┌─────────────────┐            ┌─────────────────┐
│  Cyan  #00f0ff  │            │ Darker #050505  │ ■■■■■
│ Violet #b026ff  │            │  Dark  #0a0a0a  │ ■■■■░
│  Pink  #ff006e  │            │  Gray  #1a1a1a  │ ■■■░░
│ Green  #39ff14  │            │  Gray  #2a2a2a  │ ■■░░░
│  Blue  #0080ff  │            │ Light  #3a3a3a  │ ■░░░░
└─────────────────┘            └─────────────────┘
```

## 📏 Component Size Matrix

```
BUTTON SIZES
┌──────┬────────┬────────┬────────┐
│      │  Small │ Medium │ Large  │
├──────┼────────┼────────┼────────┤
│ Height│  32px  │  40px  │  48px  │
│ Padding│ 12px  │  16px  │  24px  │
│ Text  │  14px  │  16px  │  18px  │
└──────┴────────┴────────┴────────┘
```

## 🖼️ Layout Patterns

### Section Layout
```
┌─────────────────────────────────────────┐
│           Padding: py-20 px-4           │
│  ┌───────────────────────────────────┐  │
│  │    Max Width: max-w-6xl mx-auto   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │        Section Title        │  │  │
│  │  │    text-4xl font-bold       │  │  │
│  │  │    mb-12 text-center        │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │      Content Area           │  │  │
│  │  │      (Grid/Flex)            │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Card Layout
```
┌───────────────────────────────┐
│  bg-cyber-gray-dark          │
│  border border-cyber-gray    │
│  rounded-xl p-6              │
│  hover:border-neon-cyan      │
│  transition-all              │
│  ┌─────────────────────────┐ │
│  │  Image/Icon Area       │ │
│  │  h-48 rounded-lg       │ │
│  └─────────────────────────┘ │
│                              │
│  Title (text-xl font-bold)   │
│  Description (text-gray-400) │
│                              │
│  [Tags/Badges]               │
└───────────────────────────────┘
```

### Grid System
```
RESPONSIVE GRID
Mobile:     1 column   [■]
Tablet:     2 columns  [■][■]
Desktop:    3 columns  [■][■][■]
Wide:       4 columns  [■][■][■][■]
```

## 🎭 State Visualizations

### Button States
```
DEFAULT    [  Primary Button  ]  ← bg-neon-cyan
HOVER      [  Primary Button  ]  ← bg-neon-cyan/90 + shadow
ACTIVE     [  Primary Button  ]  ← scale-95
DISABLED   [  Primary Button  ]  ← opacity-50
```

### Card States
```
REST       │ border-cyber-gray-light
HOVER      │ border-neon-cyan
           │ title: animate-glow
ACTIVE     │ Selected styling
```

## 🔄 Animation Patterns

### Glow Effect
```css
@keyframes glow {
  0%   { text-shadow: 0 0 10px cyan }
  100% { text-shadow: 0 0 40px cyan }
}
```

### 3D Tilt
```
Mouse Position → Calculate X/Y → Apply Transform
┌─────────────┐
│      ↑      │
│   ←  •  →   │
│      ↓      │
└─────────────┘
  rotateY(x)
  rotateX(y)
```

## 📱 Responsive Breakpoints

```
Mobile         Tablet        Desktop       Wide
< 640px       640-1024px    1024-1440px   > 1440px
   │              │              │            │
[■■■■]        [■■][■■]      [■■][■■][■■]  [■][■][■][■]
```

## 🎯 Component Usage Flow

```
1. DISCOVER
   └─> Browse Storybook sidebar
   
2. EXPLORE
   └─> View component variants
   
3. CUSTOMIZE
   └─> Test with Controls panel
   
4. VALIDATE
   └─> Check Accessibility tab
   
5. IMPLEMENT
   └─> Copy code snippet
```

## 🔍 Quick Reference

### Most Used Classes
```tsx
// Backgrounds
'bg-cyber-darker'        // Main background
'bg-cyber-dark'          // Section background
'bg-cyber-gray-dark'     // Card background

// Text Colors
'text-neon-cyan'         // Primary accent
'text-neon-violet'       // Secondary accent
'text-gray-300'          // Body text
'text-gray-400'          // Secondary text

// Borders
'border-cyber-gray-light'      // Default
'hover:border-neon-cyan'       // Interactive

// Effects
'transition-all duration-300'  // Smooth transitions
'hover:shadow-lg hover:shadow-neon-cyan/50'  // Glow
'backdrop-blur-lg'            // Glass effect

// Layout
'max-w-6xl mx-auto'          // Content container
'py-20 px-4'                 // Section padding
'rounded-xl'                 // Card radius
```

### Typography Scale
```
text-xs    → 12px   Captions
text-sm    → 14px   Small text
text-base  → 16px   Body
text-lg    → 18px   Large body
text-xl    → 20px   Small heading
text-2xl   → 24px   H4
text-3xl   → 30px   H3
text-4xl   → 36px   H2
text-5xl   → 48px   H1
text-6xl   → 60px   Hero title
```

## 🎨 Design Tokens

```yaml
Spacing:
  xs: 0.25rem   (4px)
  sm: 0.5rem    (8px)
  md: 1rem      (16px)
  lg: 1.5rem    (24px)
  xl: 2rem      (32px)
  2xl: 3rem     (48px)

Borders:
  width: 1-2px
  radius: 0.5-1rem
  style: solid

Shadows:
  sm: 0 2px 4px rgba(0,0,0,0.1)
  md: 0 4px 8px rgba(0,0,0,0.2)
  lg: 0 8px 16px rgba(0,240,255,0.5)
  glow: 0 0 20px rgba(0,240,255,0.8)
```

## 📊 Component Complexity

```
SIMPLE          MEDIUM          COMPLEX
  │               │                │
Button          3D Card          Hero Section
ThemeToggle     ProjectCard      Page Layout
Badge           ExperienceCard   Timeline
Icon            ContactForm      Navigation
```

## 🚀 Story Structure

```tsx
ComponentName.stories.tsx
│
├── Meta Configuration
│   ├── title: "Category/Component"
│   ├── component: Component
│   ├── parameters
│   └── argTypes
│
├── Default Story
│   └── Basic usage
│
├── Variant Stories
│   ├── Primary
│   ├── Secondary
│   └── Outline
│
├── Size Stories
│   ├── Small
│   ├── Medium
│   └── Large
│
├── State Stories
│   ├── Disabled
│   ├── Loading
│   └── Error
│
└── Combined Story
    └── All Variants (showcase)
```

## 📈 File Organization

```
stories/
├── Category/           (Foundations, Primitives, etc.)
│   ├── Component.stories.tsx
│   └── Docs.mdx
│
Components per file:
✅ Single component per .stories.tsx
✅ Multiple stories per component
✅ Related variants grouped together
```

## 🎯 Best Practices Checklist

```
For Each Component:
☑ Default story
☑ All variants documented
☑ Size variations shown
☑ State variations (hover, disabled, etc.)
☑ Responsive behavior tested
☑ Accessibility validated
☑ Code examples provided
☑ Props documented
☑ Usage guidelines included
```

## 🔗 Quick Links

- **Start**: `cd apps/storybook && pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **URL**: `http://localhost:6006`

---

**Pro Tip**: Use `Cmd/Ctrl + K` in Storybook to quickly search for any component! 🔍
