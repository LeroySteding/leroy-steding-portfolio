import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STEDING. | Full-Stack Developer & AI Automation Architect",
  description:
    "Building scalable AI-driven web platforms & digital automation solutions.",
};

// Minimal root layout - actual layouts are in route groups
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
