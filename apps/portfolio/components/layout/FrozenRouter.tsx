"use client";

import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

/**
 * FrozenRouter - Freezes router context during page transitions
 * This prevents Next.js from updating context mid-animation,
 * which would cause Framer Motion AnimatePresence to break.
 *
 * Usage: Wrap around motion.div inside AnimatePresence
 *
 * @see https://github.com/framer/motion/issues/2145
 */
export function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  if (!context) {
    return <>{children}</>;
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}
