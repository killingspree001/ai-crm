"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  CheckSquare,
  Mic,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Home", icon: LayoutDashboard, href: "/" },
  { label: "Contacts", icon: Users, href: "/contacts" },
  { label: "Deals", icon: KanbanSquare, href: "/deals" },
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { label: "Meetings", icon: Mic, href: "/meetings" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col border-r border-border bg-card/40">
      <Link href="/" className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-black text-white shadow-md shadow-primary/30">
          N
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight">Nexus CRM</div>
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            AI Sales
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {routes.map((r) => {
          const active = isActive(r.href);
          return (
            <Link
              key={r.href}
              href={r.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient" />
              )}
              <r.icon className={cn("h-[18px] w-[18px]", active && "text-primary")} />
              {r.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-1 flex items-center gap-1.5 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Assist</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Meetings auto-summarized and action items extracted for you.
          </p>
        </div>
      </div>
    </div>
  );
};
