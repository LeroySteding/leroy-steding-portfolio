"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Award,
  Lightbulb,
  Image,
  Settings,
  Moon,
  Sun,
  Rss,
  CheckSquare,
  Building2,
  Calendar,
  BarChart3,
  Search,
  Bot,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Intelligence", href: "/intelligence", icon: Rss },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Jobs", href: "/jobs", icon: Building2 },
  { name: "Content", href: "/content", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Costs", href: "/costs", icon: DollarSign },
  { name: "SEO", href: "/seo", icon: Search },
  { name: "Blog Posts", href: "/blog", icon: FileText },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Experience", href: "/experience", icon: Award },
  { name: "Skills", href: "/skills", icon: Lightbulb },
  { name: "Media", href: "/media", icon: Image },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full w-64 flex-col gap-y-5 border-r bg-sidebar px-6 py-8">
      <div className="flex h-10 items-center">
        <h1 className="text-xl font-bold">Portfolio Admin</h1>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive
                            ? "text-sidebar-accent-foreground"
                            : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li className="mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3 p-2">
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
              <div className="flex-1 text-sm">
                <div className="font-medium">Admin</div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
