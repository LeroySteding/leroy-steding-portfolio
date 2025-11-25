import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leroy Steding Portfolio",
    short_name: "LS Portfolio",
    description:
      "Full-Stack Developer & AI Automation Architect - Building scalable AI-driven web platforms",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#00f0ff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
