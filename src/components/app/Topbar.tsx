"use client";

import { signOut, useSession } from "next-auth/react";
import { Search, LogOut } from "lucide-react";
import { initials } from "@/lib/utils";

export const Topbar = () => {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Avery Chen";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-6 backdrop-blur-xl">
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search contacts, deals, meetings..."
          className="h-9 w-full rounded-lg border border-border bg-card/50 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <div className="text-xs font-semibold leading-tight">{name}</div>
            <div className="text-[10px] text-muted-foreground">
              {session?.user?.email ?? "demo@nexuscrm.io"}
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
            {initials(name)}
          </div>
        </div>
      </div>
    </header>
  );
};
