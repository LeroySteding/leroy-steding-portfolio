# Portfolio to Storybook Migration Plan

## 🎯 Goal
Migrate portfolio components to a reusable design system in `@steding/ui` with comprehensive Storybook documentation.

## 📊 Component Analysis Summary

### Components Ready to Migrate (No Refactoring)
1. ✅ **3d-card.tsx** - Self-contained 3D interactive card
2. ✅ **layout-text-flip.tsx** - Animated text rotation
3. ✅ **CVDownloadOptions.tsx** - Download options panel

### Components to Refactor Then Migrate
4. 🔄 **ThemeToggle** → Extract generic Toggle/Switch component
5. 🔄 **LanguageSwitcher** → Extract SegmentedControl component
6. 🔄 **EditableField** → Extract InlineEdit pattern
7. 🔄 **EditableList** → Extract DragDropList component

### Patterns to Extract (Build New Components)
8. 🏗️ **Button** - From `.btn-primary`/`.btn-secondary` classes
9. 🏗️ **Card** - From `.card` class pattern
10. 🏗️ **Badge/Tag** - From Projects/TechStack usage
11. 🏗️ **Input/Textarea** - From Contact form
12. 🏗️ **IconButton** - From Header/Footer social links
13. 🏗️ **SectionHeader** - Repeated pattern across sections

## 🗓️ Migration Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up design system infrastructure

- [x] Create Storybook 10 setup ✅
- [x] Configure Tailwind CSS v4 ✅
- [x] Implement Navy & Beige theme ✅
- [x] Add dark/light theme switching ✅
- [ ] Extract design tokens from globals.css to @steding/ui
- [ ] Set up tsup build configuration for @steding/ui
- [ ] Create component template structure

**Design Tokens to Extract**:
```typescript
// colors.ts
export const colors = {
  dark: {
    primaryBg: '#0f1419',
    secondaryBg: '#1a2332',
    // ... rest
  },
  light: {
    primaryBg: '#ffffff',
    // ... rest
  }
}

// spacing.ts
export const spacing = {
  section: '10rem',
  sectionSm: '6rem',
  container: '5rem'
}
```

### Phase 2: Atomic Components (Week 2)
**Goal**: Build foundation UI components

1. **Button Component** ⭐ Priority
   - Variants: primary, secondary, ghost, outline
   - Sizes: sm, md, lg
   - States: default, hover, disabled, loading
   - With/without icons
   - **Storybook**: 10+ stories showing all combinations

2. **Card Component**
   - Base card with border/shadow
   - Interactive variant (hover effects)
   - Highlight variant
   - **Storybook**: 5+ stories

3. **Badge/Tag Component**
   - Tech tags
   - Status badges  
   - Removable tags
   - **Storybook**: 6+ stories

4. **Input Components**
   - TextInput
   - Textarea
   - Label
   - Helper text
   - Error states
   - **Storybook**: 8+ stories

5. **IconButton**
   - Social link style
   - Action button style
   - Sizes
   - **Storybook**: 4+ stories

6. **Migrate 3d-card** (as-is)
   - Update imports
   - Add Storybook stories
   - Document props

7. **Migrate layout-text-flip** (as-is)
   - Update imports
   - Add Storybook stories
   - Document animation options

### Phase 3: Composed Components (Week 3)
**Goal**: Build complex reusable components

8. **Toggle/Switch** (from ThemeToggle)
   - Generic on/off toggle
   - With labels
   - Sizes
   - **Storybook**: 5+ stories

9. **SegmentedControl** (from LanguageSwitcher)
   - 2-4 options
   - With icons
   - Disabled states
   - **Storybook**: 5+ stories

10. **Stats Display**
    - Number + label
    - Animated counter option
    - Grid layout
    - **Storybook**: 4+ stories

11. **Section Header**
    - Title with gradient
    - Optional subtitle
    - Consistent spacing
    - **Storybook**: 3+ stories

12. **Migrate CVDownloadOptions** (as-is)
    - Update imports
    - Add stories
    - Document usage

### Phase 4: Complex Patterns (Week 4)
**Goal**: Advanced interaction patterns

13. **InlineEdit Pattern** (from EditableField)
    - View/edit modes
    - Save/cancel actions
    - Validation
    - **Storybook**: 6+ stories

14. **DragDropList** (from EditableList)
    - Reorderable items
    - Add/remove items
    - Custom item rendering
    - **Storybook**: 5+ stories

15. **Navigation Components** (from Header)
    - NavItem
    - NavMenu
    - MobileMenu
    - **Storybook**: 8+ stories

16. **Footer Components**
    - FooterSection
    - FooterLinks
    - SocialIcons
    - **Storybook**: 4+ stories

### Phase 5: Form System (Week 5)
**Goal**: Complete form component ecosystem

17. **FormGroup**
18. **FormLabel**  
19. **FormValidation**
20. **FormError**
21. **ContactForm** (composition example)

## 🔧 Technical Implementation

### Package Structure
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   └── ...
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── hooks/
│   ├── utils/
│   └── index.ts
├── package.json
├── tsup.config.ts
└── tailwind.config.ts
```

### Build Configuration (tsup)
```typescript
// packages/ui/tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom', 'framer-motion'],
  clean: true,
  treeshake: true
});
```

### Component Template
```typescript
// Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ ... }: ButtonProps) => {
  // Implementation using design tokens
};
```

## 📚 Storybook Documentation Standards

### Every Component Should Have:
1. **Default Story** - Basic usage
2. **Variants Story** - All visual variants
3. **Sizes Story** - All size options
4. **States Story** - Interactive states
5. **Dark/Light Theme Story** - Theme variations
6. **Playground Story** - Interactive controls
7. **Accessibility Story** - Keyboard, ARIA
8. **Usage Docs** - Code examples, best practices

### Story Template
```typescript
export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Primary UI button component...'
      }
    }
  }
} satisfies Meta<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Click me' }
};
// ... more stories
```

## ✅ Success Criteria

- [ ] 20+ reusable components in @steding/ui
- [ ] 100+ Storybook stories documented
- [ ] TypeScript coverage 100%
- [ ] Dark/Light theme support for all components
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Tree-shakeable ESM/CJS bundles
- [ ] Zero runtime dependencies (peer deps only)
- [ ] Portfolio app using @steding/ui components
- [ ] Comprehensive component API documentation

## 🚀 Quick Start (Next Steps)

1. **Extract design tokens** from portfolio globals.css
2. **Build Button component** matching portfolio usage
3. **Document Button** with 10+ Storybook stories
4. **Migrate 3d-card** as first real component
5. **Update portfolio** to import from @steding/ui
6. **Repeat** for remaining components

## 📖 Current Status

### ✅ Completed
- Storybook 10.0.7 setup with Vite
- Tailwind CSS v4 configuration
- Navy & Beige theme from portfolio
- Dark/Light theme switching via backgrounds addon
- Mock Button component for demonstration

### 🔄 In Progress
- Theme system refinement
- Design token extraction

### 📋 Up Next
- Extract Button pattern from portfolio globals.css
- Set up @steding/ui build system
- Create design tokens package
- Migrate first component (3d-card)

---

**Last Updated**: 2025-11-17  
**Version**: 1.0  
**Status**: Planning Complete, Ready for Phase 2
