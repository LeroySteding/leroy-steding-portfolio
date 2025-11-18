export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'article' | 'tutorial' | 'research';
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: string;
  coverImage?: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'building-scalable-nextjs-apps',
    title: 'Building Scalable Next.js Applications with Turborepo',
    excerpt: 'Learn how to structure and scale your Next.js applications using Turborepo monorepo architecture, shared components, and optimized build pipelines.',
    content: `
# Building Scalable Next.js Applications with Turborepo

In this comprehensive guide, we'll explore how to leverage Turborepo to create maintainable and scalable Next.js applications.

## Why Turborepo?

Turborepo provides:
- **Fast builds** with intelligent caching
- **Parallel execution** of tasks
- **Shared code** across multiple apps
- **Optimized CI/CD** pipelines

## Setting Up Your Monorepo

\`\`\`bash
npx create-turbo@latest
\`\`\`

## Architecture Overview

A typical structure includes:
- \`apps/\` - Your Next.js applications
- \`packages/\` - Shared libraries and components
- \`turbo.json\` - Build configuration

## Best Practices

1. **Shared UI Components**: Create a dedicated \`packages/ui\` package
2. **Type Safety**: Use a shared \`packages/tsconfig\` for consistency
3. **Utilities**: Extract common functions to \`packages/utils\`
4. **Testing**: Run tests in parallel across all packages

## Performance Optimization

Turborepo's remote caching can reduce build times by up to 70%. Configure it in your \`turbo.json\`:

\`\`\`json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
\`\`\`

## Conclusion

Turborepo transforms how we build and scale Next.js applications, making monorepos accessible and performant.
    `,
    category: 'tutorial',
    tags: ['Next.js', 'Turborepo', 'Monorepo', 'Architecture'],
    author: 'Leroy Steding',
    publishedAt: '2025-01-15',
    readingTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    featured: true,
  },
  {
    id: '2',
    slug: 'ai-automation-future',
    title: 'The Future of AI-Driven Automation in Web Development',
    excerpt: 'Exploring how artificial intelligence and automation are transforming the way we build, test, and deploy web applications.',
    content: `
# The Future of AI-Driven Automation in Web Development

AI is revolutionizing web development, from code generation to automated testing and deployment strategies.

## Current State of AI in Development

AI tools are now capable of:
- Generating production-ready code
- Automated testing and bug detection
- Performance optimization suggestions
- Security vulnerability scanning

## Case Study: AI-Powered Component Generation

We've implemented AI-assisted component generation in our workflow, reducing development time by 40%.

## Ethical Considerations

As we integrate AI more deeply, we must consider:
- Code quality and maintainability
- Developer skill development
- Job market implications
- Security and privacy concerns

## The Road Ahead

The future holds exciting possibilities:
- Self-healing applications
- Intelligent code refactoring
- Predictive performance optimization
- Automated accessibility improvements
    `,
    category: 'article',
    tags: ['AI', 'Automation', 'Web Development', 'Future Tech'],
    author: 'Leroy Steding',
    publishedAt: '2025-01-10',
    readingTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    featured: true,
  },
  {
    id: '3',
    slug: 'react-server-components-deep-dive',
    title: 'React Server Components: A Deep Dive',
    excerpt: 'Understanding the architecture, benefits, and implementation patterns of React Server Components in Next.js 14.',
    content: `
# React Server Components: A Deep Dive

React Server Components (RSC) represent a paradigm shift in how we build React applications.

## What Are Server Components?

Server Components render on the server and send HTML to the client, reducing bundle size and improving performance.

## Key Benefits

1. **Zero Bundle Impact**: Server-only code stays on the server
2. **Automatic Code Splitting**: Better performance out of the box
3. **Direct Backend Access**: No need for API routes
4. **Streaming**: Progressive rendering with Suspense

## Implementation Patterns

\`\`\`typescript
// app/page.tsx (Server Component by default)
async function Page() {
  const data = await fetchData(); // Direct DB access
  return <ClientComponent data={data} />;
}
\`\`\`

## Client vs Server Components

Use Server Components for:
- Data fetching
- Backend services
- Sensitive information

Use Client Components for:
- Interactivity
- Event handlers
- Browser APIs
- State management

## Performance Metrics

Our analysis shows:
- 45% reduction in JavaScript bundle size
- 60% faster initial page load
- Improved Core Web Vitals scores
    `,
    category: 'research',
    tags: ['React', 'Next.js', 'Server Components', 'Performance'],
    author: 'Leroy Steding',
    publishedAt: '2025-01-05',
    readingTime: '12 min read',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
    featured: false,
  },
  {
    id: '4',
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Enterprise Applications',
    excerpt: 'Master advanced TypeScript patterns including conditional types, mapped types, and template literal types for building robust applications.',
    content: `
# Advanced TypeScript Patterns for Enterprise Applications

TypeScript's type system is incredibly powerful. Let's explore advanced patterns that improve code quality and developer experience.

## Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
type Result = IsString<"hello">; // true
\`\`\`

## Mapped Types

\`\`\`typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
\`\`\`

## Template Literal Types

\`\`\`typescript
type Color = "red" | "blue";
type Quantity = "one" | "two";
type ColoredQuantity = \`\${Quantity}-\${Color}\`;
\`\`\`

## Real-World Application

These patterns enable:
- Type-safe API clients
- Runtime validation with Zod
- Better IDE autocomplete
- Compile-time error detection

## Performance Considerations

While powerful, complex types can slow down compilation. Balance type safety with build performance.
    `,
    category: 'tutorial',
    tags: ['TypeScript', 'Advanced Patterns', 'Type Safety'],
    author: 'Leroy Steding',
    publishedAt: '2024-12-28',
    readingTime: '10 min read',
    featured: false,
  },
  {
    id: '5',
    slug: 'web-performance-optimization',
    title: 'Web Performance Optimization: A Comprehensive Guide',
    excerpt: 'Dive deep into modern web performance optimization techniques, from Core Web Vitals to advanced bundling strategies.',
    content: `
# Web Performance Optimization: A Comprehensive Guide

Performance is not just a feature—it's a fundamental aspect of user experience.

## Core Web Vitals

Understanding the metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Optimization Strategies

### 1. Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Modern formats (WebP, AVIF)

### 2. Code Splitting
\`\`\`typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
});
\`\`\`

### 3. Caching Strategies
- Service Workers
- CDN configuration
- Browser caching headers

### 4. Bundle Optimization
- Tree shaking
- Code splitting
- Lazy loading

## Measuring Performance

Tools we use:
- Lighthouse
- WebPageTest
- Chrome DevTools
- Real User Monitoring (RUM)

## Results

After optimization:
- 65% faster page load
- 40% reduction in bundle size
- 90+ Lighthouse score
    `,
    category: 'article',
    tags: ['Performance', 'Optimization', 'Web Vitals', 'Best Practices'],
    author: 'Leroy Steding',
    publishedAt: '2024-12-20',
    readingTime: '15 min read',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    featured: true,
  },
  {
    id: '6',
    slug: 'building-design-systems',
    title: 'Building Scalable Design Systems with React and Tailwind',
    excerpt: 'Learn how to create maintainable design systems that scale across multiple applications using React components and Tailwind CSS.',
    content: `
# Building Scalable Design Systems with React and Tailwind

A well-architected design system is crucial for maintaining consistency across large applications.

## Design System Architecture

Core components:
- Design tokens
- Component library
- Documentation
- Testing strategy

## Token System

\`\`\`typescript
export const tokens = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      900: '#0c4a6e',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
  },
};
\`\`\`

## Component Patterns

### Composition
\`\`\`tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
\`\`\`

### Variants
Using CVA (Class Variance Authority):
\`\`\`typescript
const button = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      secondary: "btn-secondary",
    },
  },
});
\`\`\`

## Documentation with Storybook

Essential for:
- Component discovery
- Visual testing
- Usage examples
- Accessibility audits

## Accessibility First

Every component must:
- Support keyboard navigation
- Include ARIA labels
- Pass WCAG 2.1 AA standards
- Work with screen readers

## Conclusion

A solid design system accelerates development and ensures consistency across your product ecosystem.
    `,
    category: 'tutorial',
    tags: ['Design System', 'React', 'Tailwind CSS', 'Component Library'],
    author: 'Leroy Steding',
    publishedAt: '2024-12-15',
    readingTime: '11 min read',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    featured: false,
  },
];

// Utility functions for blog
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map(post => post.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(blogPosts.flatMap(post => post.tags)));
}
