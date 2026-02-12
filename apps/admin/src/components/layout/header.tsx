"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = paths.map((path, index) => ({
    label: path.charAt(0).toUpperCase() + path.slice(1),
    href: "/" + paths.slice(0, index + 1).join("/"),
  }));

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="sm" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "font-medium"
                  : "text-muted-foreground"
              }
            >
              {crumb.label}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}
