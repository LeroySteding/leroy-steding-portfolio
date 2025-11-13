# @steding/timeline-scroll

A horizontal scroll-jacking timeline carousel for React with Framer Motion. Perfect for creating interactive, cinematic timeline experiences. Includes reusable card components with multiple variants.

## Features

✅ **Horizontal Scroll Carousel** - Smooth scroll-jacking animation  
✅ **Reusable Card Component** - 4 pre-built variants (default, gradient, image, minimal)  
✅ **Fully Customizable** - Accept any React components  
✅ **TypeScript First** - Full type safety  
✅ **Next.js App Router** - "use client" directive included  
✅ **Tree-shakeable** - Optimized bundle size  
✅ **Zero Config** - Works out of the box  

## Installation

```bash
npm install @steding/timeline-scroll framer-motion
# or
pnpm add @steding/timeline-scroll framer-motion
# or
yarn add @steding/timeline-scroll framer-motion
```

## Peer Dependencies

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `framer-motion` ^12.0.0

## Quick Start

### Using TimelineCard Component (Recommended)

```tsx
import { HorizontalTimelineCarousel, TimelineCard } from '@steding/timeline-scroll';

function Experience() {
  const items = [
    {
      id: 1,
      content: (
        <TimelineCard
          variant="gradient"
          colorScheme="blue"
          title="Senior Developer"
          subtitle="Tech Company"
          period="2024 - Present"
          description="Building awesome products..."
          tags={['React', 'TypeScript', 'Node.js']}
        />
      ),
    },
    {
      id: 2,
      content: (
        <TimelineCard
          variant="gradient"
          colorScheme="purple"
          title="Full Stack Developer"
          subtitle="Startup XYZ"
          period="2022 - 2024"
          description="Launched multiple products..."
          tags={['Vue', 'Python', 'AWS']}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="h-48 flex items-center justify-center">
        <h2>Scroll to explore</h2>
      </div>
      
      <HorizontalTimelineCarousel items={items} />
      
      <div className="h-48" />
    </div>
  );
}
```

### Using Custom Components

```tsx
import { HorizontalTimelineCarousel } from '@steding/timeline-scroll';

function CustomCarousel() {
  const items = [
    {
      id: 1,
      content: (
        <div className="h-[450px] w-[450px] bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-8">
          <h3 className="text-white text-3xl font-bold">Your Custom Card</h3>
        </div>
      ),
    },
    // ... more items
  ];

  return <HorizontalTimelineCarousel items={items} />;
}
```

## API Reference

### HorizontalTimelineCarousel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CarouselItem[]` | **required** | Array of items with `id` and `content` |
| `scrollHeight` | `number` | `300` | Height of scroll section in viewport heights (vh) |
| `startX` | `string \| 'center'` | `"1%"` | Starting X position as percentage or `"center"` to center first card |
| `endX` | `string` | `"-95%"` | Ending X position as percentage |
| `cardGap` | `number` | `1` | Gap between cards in rem units (1rem = 16px) |
| `sidePadding` | `number` | `4` | Padding on left/right of carousel in rem units (4rem = 64px) |
| `sectionClassName` | `string` | `""` | Additional classes for section wrapper |
| `containerClassName` | `string` | `""` | Additional classes for sticky container |
| `cardsContainerClassName` | `string` | `""` | Additional classes for cards wrapper |

### TimelineCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'gradient' \| 'image' \| 'minimal'` | `'default'` | Card style variant |
| `title` | `string` | **required** | Card title |
| `subtitle` | `string` | - | Subtitle or company name |
| `period` | `string` | - | Time period (e.g., "2024 - Present") |
| `location` | `string` | - | Location |
| `description` | `string` | - | Description text |
| `tags` | `string[]` | `[]` | Array of tags/skills |
| `imageUrl` | `string` | - | Background image URL (for image variant) |
| `colorScheme` | `'blue' \| 'purple' \| 'green' \| 'orange' \| 'pink' \| 'cyan'` | `'blue'` | Color scheme for gradient variant |
| `width` | `number \| string` | `450` | Card width |
| `height` | `number \| string` | `450` | Card height |
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | - | Custom content inside card |

## Card Variants

### Default Variant
Clean, professional design with shadow and hover effects.

```tsx
<TimelineCard
  variant="default"
  title="Achievement"
  subtitle="Company"
  period="2024"
  description="Description here..."
  tags={['React', 'TypeScript']}
/>
```

### Gradient Variant
Colorful gradient backgrounds perfect for timelines.

```tsx
<TimelineCard
  variant="gradient"
  colorScheme="purple"
  title="Experience"
  subtitle="Position"
  period="2022 - 2024"
  tags={['Skill 1', 'Skill 2']}
/>
```

### Image Variant
Full background image with overlay text.

```tsx
<TimelineCard
  variant="image"
  imageUrl="/path/to/image.jpg"
  title="Project"
  subtitle="Featured"
  period="2023"
  description="Project details..."
/>
```

### Minimal Variant
Ultra-clean, simple design.

```tsx
<TimelineCard
  variant="minimal"
  title="Skill"
  subtitle="Level"
  period="Experience"
  tags={['Tool 1', 'Tool 2']}
/>
```

## Color Schemes

Available color schemes for gradient variant:
- `blue` - Blue to cyan gradient
- `purple` - Purple to pink gradient
- `green` - Green to emerald gradient
- `orange` - Orange to red gradient
- `pink` - Pink to rose gradient
- `cyan` - Cyan to blue gradient

## Spacing & Positioning

### Center First Card

Start the carousel with the first card centered:

```tsx
<HorizontalTimelineCarousel
  items={items}
  startX="center"
/>
```

### Increase Spacing Between Cards

```tsx
<HorizontalTimelineCarousel
  items={items}
  cardGap={3}        // 3rem = 48px gap between cards
  sidePadding={8}    // 8rem = 128px padding on sides
/>
```

### Tight Spacing

```tsx
<HorizontalTimelineCarousel
  items={items}
  cardGap={0.5}      // 0.5rem = 8px gap
  sidePadding={2}    // 2rem = 32px padding
/>
```

## Examples

### Experience Timeline

```tsx
import { HorizontalTimelineCarousel, TimelineCard } from '@steding/timeline-scroll';

const experiences = [
  {
    id: 1,
    content: (
      <TimelineCard
        variant="gradient"
        colorScheme="blue"
        title="Senior Developer"
        subtitle="Tech Co"
        period="2024 - Present"
        location="San Francisco"
        description="Leading team of 5 developers..."
        tags={['React', 'Node.js', 'AWS']}
      />
    ),
  },
  // ... more experiences
];

<HorizontalTimelineCarousel items={experiences} />
```

### Project Showcase

```tsx
const projects = [
  {
    id: 1,
    content: (
      <TimelineCard
        variant="image"
        imageUrl="/projects/ecommerce.jpg"
        title="E-Commerce Platform"
        subtitle="Full Stack"
        period="2024"
        description="Built scalable platform for 10k+ users"
      />
    ),
  },
];

<HorizontalTimelineCarousel items={projects} />
```

### Skills Overview

```tsx
const skills = [
  {
    id: 1,
    content: (
      <TimelineCard
        variant="minimal"
        title="Frontend"
        subtitle="Expert"
        period="5+ years"
        tags={['React', 'Vue', 'TypeScript']}
        width={400}
        height={300}
      />
    ),
  },
];

<HorizontalTimelineCarousel items={skills} scrollHeight={200} />
```

## Styling

The package uses Tailwind CSS classes. Make sure Tailwind is configured in your project.

For custom styling, use the className props:

```tsx
<TimelineCard
  className="border-4 border-pink-500"
  title="Custom Styled"
/>
```

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type { 
  HorizontalTimelineCarouselProps,
  CarouselItem,
  TimelineCardProps 
} from '@steding/timeline-scroll';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © Leroy Steding

## Contributing

Issues and PRs welcome!

## Links

- [GitHub](https://github.com/steding/timeline-scroll)
- [npm](https://www.npmjs.com/package/@steding/timeline-scroll)
