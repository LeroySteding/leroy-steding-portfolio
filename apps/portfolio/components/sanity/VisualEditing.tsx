"use client";

import { enableVisualEditing } from "@sanity/visual-editing";
import { useEffect } from "react";

export function VisualEditing() {
  useEffect(() => {
    enableVisualEditing({
      refresh: async (payload) => {
        // Refresh the page when content changes in Sanity
        if (payload.source === "mutation") {
          // Use Next.js router refresh for mutations
          window.location.reload();
        }
      },
    });
  }, []);

  return null;
}
