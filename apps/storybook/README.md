# Steding Design System - Storybook

Comprehensive component documentation and design system for all Steding projects.

## 🚀 Quick Start

### Installation

```bash
# From the monorepo root
cd apps/storybook
pnpm install
```

### Development

```bash
# Start Storybook development server
pnpm dev

# Build Storybook for production
pnpm build

# Preview production build
pnpm preview
```

Storybook will be available at `http://localhost:6006`

## 📁 Structure

```
apps/storybook/
├── .storybook/              # Storybook configuration
│   ├── main.ts             # Main configuration
│   ├── preview.ts          # Preview configuration
│   └── styles.css          # Global styles
├── stories/                 # Component stories
│   ├── Introduction.mdx    # Getting started guide
│   ├── Foundations/        # Design tokens, colors, typography
│   ├── Primitives/         # Atomic components (buttons, inputs)
│   ├── Components/         # Composite components
│   ├── Sections/           # Page sections (Hero, About, etc)
│   ├── Pages/              # Complete page templates
│   └── Utilities/          # Helper components
└── public/                  # Static assets
```

## 🎨 Component Organization

### Foundations
Basic design tokens and guidelines:
- **Colors** - Cyber-themed color palette
- **Typography** - Font system and text styles
- **Spacing** - Layout spacing guidelines
- **Icons** - Icon library and usage

### Primitives
Atomic UI components:
- Buttons (primary, secondary, outline, ghost)
- Inputs, textareas, selects
- Cards, badges, tags
- Tooltips, popovers

### Components
Composite components:
- Theme Toggle
- Language Switcher
- 3D Card
- Navigation
- Forms
- Modals

### Sections
Page sections:
- Hero - Landing section with CTA
- About - Personal introduction
- Projects - Project showcase grid
- Experience - Timeline of work history
- Contact - Contact form and links
- Tech Stack - Technology showcase

### Pages
Complete page templates:
- Home Page - Full landing page layout
- Project Detail - Individual project page
- Experience Detail - Detailed experience view

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Storybook 8** - Component documentation
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📝 Writing Stories

### Basic Story

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Category/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prop: 'value',
  },
};
```

### Story with Args

```tsx
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button Text',
  },
};
```

### Story with Custom Render

```tsx
export const CustomExample: Story = {
  render: () => (
    <div className="flex gap-4">
      <MyComponent variant="primary" />
      <MyComponent variant="secondary" />
    </div>
  ),
};
```

## 🎯 Best Practices

### Story Organization
1. **Use descriptive titles** - `'Sections/Hero'` not `'Hero'`
2. **Group related components** - Keep hierarchy clear
3. **Include documentation** - Use description parameters
4. **Show all variants** - Create comprehensive examples

### Component Documentation
1. **Add JSDoc comments** - For prop descriptions
2. **Include usage examples** - Show real-world use cases
3. **Document edge cases** - Error states, loading states
4. **Add accessibility notes** - WCAG compliance info

### Styling
1. **Use Tailwind classes** - Consistent with project
2. **Apply cyber theme** - Neon colors, dark backgrounds
3. **Include hover states** - Interactive feedback
4. **Test responsive design** - Use viewport addon

## 🎨 Design Tokens

### Colors

```tsx
// Neon Accents
'text-neon-cyan'      // #00f0ff - Primary
'text-neon-violet'    // #b026ff - Secondary
'text-neon-pink'      // #ff006e - Tertiary
'text-neon-green'     // #39ff14 - Success
'text-neon-blue'      // #0080ff - Info

// Backgrounds
'bg-cyber-darker'     // #050505
'bg-cyber-dark'       // #0a0a0a
'bg-cyber-gray-dark'  // #1a1a1a
'bg-cyber-gray'       // #2a2a2a
'bg-cyber-gray-light' // #3a3a3a
```

### Typography

```tsx
'text-xs'    // 0.75rem
'text-sm'    // 0.875rem
'text-base'  // 1rem
'text-lg'    // 1.125rem
'text-xl'    // 1.25rem
'text-2xl'   // 1.5rem
'text-3xl'   // 1.875rem
'text-4xl'   // 2.25rem
'text-5xl'   // 3rem
'text-6xl'   // 3.75rem
```

## 🔌 Addons

Configured addons:
- **Essentials** - Controls, Actions, Docs
- **A11y** - Accessibility testing
- **Interactions** - User interaction testing
- **Themes** - Theme switching
- **Links** - Story navigation

## 📦 Importing Components

### From Shared UI Package
```tsx
import { Button } from '@steding/ui';
```

### From Portfolio App
```tsx
import { Hero } from '../../apps/portfolio/components/sections/Hero';
```

### From Timeline Scroll Package
```tsx
import { Timeline } from '@steding/timeline-scroll';
```

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Vercel/Netlify
The `storybook-static` folder contains the static build ready for deployment.

## 🤝 Contributing

1. Create stories for new components
2. Follow naming conventions
3. Include comprehensive documentation
4. Test across different viewports
5. Ensure accessibility compliance

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)

## 📄 License

Private - © 2024 Leroy Steding

---

**Version:** 0.1.0  
**Last Updated:** November 2024
