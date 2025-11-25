"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";

export default function LayoutSwitcher() {
  const { layoutMode, toggleLayoutMode } = useLayout();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute bottom-full left-0 mb-2 pointer-events-none">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="px-3 py-2 rounded-lg bg-surface border border-surface-light shadow-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <div className="font-semibold text-text-primary mb-1">
                Layout Preview
              </div>
              <div className="text-text-secondary text-xs">
                Currently:{" "}
                <span className="text-accent-primary font-medium">
                  {layoutMode === "full-width" ? "Full Width" : "Contained"}
                </span>
              </div>
              <div className="text-text-muted text-xs mt-1">
                Click to switch
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={toggleLayoutMode}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface/95 backdrop-blur-md border border-surface-light shadow-2xl hover:shadow-accent-primary/20 hover:border-accent-primary/50 transition-all duration-300 group"
          aria-label={`Switch to ${layoutMode === "full-width" ? "contained" : "full-width"} layout`}
        >
          {/* Icon */}
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {layoutMode === "full-width" ? (
                <motion.div
                  key="full-width"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Maximize2 className="w-5 h-5 text-accent-primary" />
                </motion.div>
              ) : (
                <motion.div
                  key="contained"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Minimize2 className="w-5 h-5 text-accent-secondary" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Labels */}
          <div className="flex flex-col items-start">
            <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
              Layout
            </span>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={layoutMode}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className={`font-bold text-sm ${
                    layoutMode === "full-width"
                      ? "text-accent-primary"
                      : "text-accent-secondary"
                  }`}
                >
                  {layoutMode === "full-width" ? "Full Width" : "Contained"}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Switch indicator */}
          <div className="w-12 h-6 rounded-full bg-surface-light relative ml-2">
            <motion.div
              className={`absolute top-1 w-4 h-4 rounded-full ${
                layoutMode === "full-width"
                  ? "bg-accent-primary"
                  : "bg-accent-secondary"
              }`}
              animate={{
                left: layoutMode === "full-width" ? "4px" : "28px",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </button>

        {/* Visual indicator bar */}
        <motion.div
          className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full"
          style={{
            background:
              layoutMode === "full-width"
                ? "linear-gradient(to right, var(--accent-primary), var(--accent-secondary))"
                : "linear-gradient(to right, var(--accent-secondary), var(--accent-primary))",
          }}
          layoutId="layout-indicator"
        />
      </div>
    </motion.div>
  );
}
