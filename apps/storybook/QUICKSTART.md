# Storybook Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies (if not done)
```bash
cd apps/storybook
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:6006` to see your component library!

### 3. Explore Components

Navigate through the sidebar to see:
- **Foundations** → Colors, Typography
- **Primitives** → Buttons, Cards
- **Components** → Theme Toggle, 3D Cards
- **Sections** → Hero, About, Projects, Experience, Contact, Tech Stack
- **Pages** → Complete page templates
- **Utilities** → Language Switcher

## 📖 Component Categories

### Foundations
Design tokens and guidelines
- Colors & cyber theme palette
- Typography system
- Spacing & layout

### Primitives
Atomic UI components
- ✅ Buttons (primary, secondary, outline, ghost)
- ✅ Cards with various styles
- 🔜 Inputs & Forms
- 🔜 Badges & Tags

### Components
Composite components
- ✅ Theme Toggle
- ✅ 3D Card with mouse tracking
- ✅ Language Switcher
- 🔜 Navigation
- 🔜 Modals

### Sections
Full page sections
- ✅ Hero Section
- ✅ About Section
- ✅ Projects Grid
- ✅ Experience Timeline
- ✅ Contact Form
- ✅ Tech Stack Grid

### Pages
Complete page templates
- ✅ Home Page Layout
- 🔜 Project Detail Page
- 🔜 Experience Detail Page

## 🎨 Using Components

### Copy Code
1. Click on any story
2. View the code in the "Show code" tab
3. Copy and paste into your project

### Test Variants
1. Use the "Controls" panel to test different props
2. Try different sizes, colors, and states
3. See live updates in the canvas

### Check Accessibility
1. Switch to the "Accessibility" tab
2. Review WCAG compliance
3. Fix any issues highlighted

## 🛠️ Build Commands

```bash
# Development
pnpm dev              # Start dev server on :6006

# Production
pnpm build            # Build static site
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run linter
```

## 📁 Adding New Stories

Create a new file in `stories/`:

```tsx
// stories/Components/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // your props here
  },
};
```

## 💡 Tips

1. **Hot Reload**: Changes are reflected instantly
2. **Mobile View**: Use viewport addon to test responsive design
3. **Dark/Light**: Toggle themes with the theme addon
4. **Keyboard**: Navigate stories with arrow keys
5. **Search**: Use Cmd/Ctrl + K to search stories

## 🎯 Next Steps

1. ✅ Explore existing components
2. 📝 Add stories for your new components
3. 🎨 Customize the cyber theme
4. 🚀 Deploy to production
5. 📚 Share with your team

## 🆘 Need Help?

- Check the README.md for detailed documentation
- Visit the Introduction page in Storybook
- Review example stories in the `stories/` folder

Happy building! 🚀
