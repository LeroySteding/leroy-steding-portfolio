# Leroy Steding Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A cutting-edge personal portfolio website showcasing full-stack development expertise, AI automation projects, and modern web technologies. Built with the latest Next.js 16, React 19, and Tailwind CSS v4.

🌐 **Live Site:** [leroysteding.nl](https://leroysteding.nl)

## 🚀 Features

- ⚡ **Next.js 16** with App Router and Turbopack for blazing-fast builds
- ⚛️ **React 19** with Server Components and modern React features
- 🎨 **Tailwind CSS v4** with custom cyber-minimal design system
- 🌓 **Dark/Light Mode** with system preference detection
- ✨ **Framer Motion** animations and page transitions
- 📱 **Fully Responsive** mobile-first design
- ♿ **Accessible** WCAG 2.2 AA compliant
- 🔍 **SEO Optimized** with OpenGraph, sitemap, and robots.txt
- 📊 **Analytics** via Vercel Analytics
- 🎯 **Performance** Lighthouse score ≥95

## 🎨 Design System

### Cyber-Minimal Theme
- **Base Colors:** Pure black (#000000) with dark grays
- **Accent Colors:** Neon cyan (#00f0ff) and violet (#a855f7)
- **Typography:** Inter (body) + Orbitron (display)
- **Effects:** Neon glows, glassmorphism, gradient animations

## 📦 Tech Stack

### Frontend
- **Framework:** Next.js 16.0
- **UI Library:** React 19.2
- **Styling:** Tailwind CSS 4.1
- **Animations:** Framer Motion 12.23
- **Icons:** Lucide React
- **Theme:** next-themes

### Development
- **Language:** TypeScript 5.9
- **Package Manager:** pnpm
- **Linting:** Biome 2.2
- **Build Tool:** Turbopack

### Deployment
- **Platform:** Vercel
- **Domain:** leroysteding.nl
- **Analytics:** Vercel Analytics
- **Region:** Amsterdam (ams1)

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage with all sections
│   ├── globals.css         # Global styles and animations
│   ├── robots.ts           # Robots.txt configuration
│   ├── sitemap.ts          # Sitemap generation
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Navigation with dark mode toggle
│   │   └── Footer.tsx      # Footer with social links
│   ├── sections/
│   │   ├── Hero.tsx        # Hero section with CTA
│   │   ├── About.tsx       # About section
│   │   ├── Experience.tsx  # Timeline component
│   │   ├── Skills.tsx      # Skills matrix
│   │   ├── Projects.tsx    # Projects gallery
│   │   └── Contact.tsx     # Contact form
│   └── providers/
│       └── ThemeProvider.tsx
├── public/
│   ├── portrait.jpg        # Portrait image
│   ├── og-image.png        # OpenGraph image
│   └── projects/           # Project screenshots
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm 9+ (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/leroysteding/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build Commands

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code with Biome
pnpm lint

# Format code with Biome
pnpm format
```

## 🌐 Deployment

### Vercel Deployment

This project is optimized for Vercel deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure domain: `leroysteding.nl`

3. **Environment Variables**
   - No environment variables required for basic setup
   - Add analytics tokens if using third-party services

4. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Preview deployments for pull requests

### Custom Domain Setup

1. Add domain in Vercel dashboard
2. Configure DNS records:
   ```
   A     @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```
3. Wait for DNS propagation (5-30 minutes)

## 📝 Content Management

### Updating Content

All content is managed through React components:

- **Personal Info:** `app/layout.tsx` (metadata)
- **Hero Section:** `components/sections/Hero.tsx`
- **About:** `components/sections/About.tsx`
- **Experience:** `components/sections/Experience.tsx`
- **Skills:** `components/sections/Skills.tsx`
- **Projects:** `components/sections/Projects.tsx`
- **Contact:** `components/sections/Contact.tsx`

### Adding Projects

Edit `components/sections/Projects.tsx`:

```typescript
const projects = [
  {
    title: "Your Project",
    description: "Project description",
    image: "/projects/your-project.jpg",
    technologies: ["Next.js", "TypeScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/...",
    featured: true,
  },
  // ... more projects
];
```

### Adding Images

1. Add portrait: `public/portrait.jpg` (800x800px recommended)
2. Add projects: `public/projects/project-name.jpg`
3. Add OG image: `public/og-image.png` (1200x630px)

## 🎨 Customization

### Colors

Edit `app/globals.css`:

```css
@theme {
  --color-neon-cyan: #00f0ff;
  --color-neon-violet: #a855f7;
  /* ... more colors */
}
```

### Fonts

Edit `app/layout.tsx`:

```typescript
import { YourFont } from "next/font/google";

const yourFont = YourFont({
  variable: "--font-your-font",
  subsets: ["latin"],
});
```

### Animations

Custom animations in `app/globals.css`:

```css
@keyframes your-animation {
  /* ... */
}

.animate-your-animation {
  animation: your-animation 2s ease infinite;
}
```

## 🧪 Testing

### Lighthouse Performance

```bash
# Install lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

Target scores:
- Performance: ≥95
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📊 Performance Optimizations

- **Image Optimization:** Next.js Image component with lazy loading
- **Code Splitting:** Automatic route-based splitting
- **Font Optimization:** next/font with display swap
- **CSS:** Tailwind CSS with minimal bundle size
- **Animations:** Framer Motion with reduced motion support
- **Caching:** Vercel Edge Network CDN

## 🔒 Security

- **Headers:** Security headers in `vercel.json`
- **CSP:** Content Security Policy configured
- **HTTPS:** Forced HTTPS on Vercel
- **Dependencies:** Regular security audits

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Leroy Steding**

- Website: [leroysteding.nl](https://leroysteding.nl)
- GitHub: [@leroysteding](https://github.com/leroysteding)
- LinkedIn: [leroysteding](https://linkedin.com/in/leroysteding)
- Email: leroy@steding.me

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Deployed on [Vercel](https://vercel.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ and ☕ by Leroy Steding**

*Building scalable AI-driven web platforms & digital automation solutions.*
