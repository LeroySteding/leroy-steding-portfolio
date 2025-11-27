import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Clean up after each test case
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    themes: ["light", "dark"],
  }),
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
    button: "button",
    section: "section",
    article: "article",
    nav: "nav",
    header: "header",
    footer: "footer",
    main: "main",
    aside: "aside",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    p: "p",
    a: "a",
    ul: "ul",
    li: "li",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({}),
  useInView: () => true,
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver
  implements globalThis.IntersectionObserver
{
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
