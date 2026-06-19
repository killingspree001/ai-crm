"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Building2, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { initials } from "@/lib/utils";
import type { ContactView } from "@/lib/types";

export function ContactSearch({ contacts }: { contacts: ContactView[] }) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const filtered = term
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.company ?? "").toLowerCase().includes(term) ||
          (c.email ?? "").toLowerCase().includes(term) ||
          c.tags.some((t) => t.toLowerCase().includes(term))
      )
    : contacts;

  return (
    <div className="space-y-5">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, company, email, or tag..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link key={c.id} href={`/contacts/${c.id}`}>
            <Card className="group h-full p-5 transition-colors hover:border-primary/40">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  {initials(c.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold">{c.name}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.title}</p>
                </div>
              </div>
              {c.company && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  {c.company}
                </div>
              )}
              {c.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <Badge key={t} variant="neutral">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <span>{c.dealCount ?? 0} deals</span>
                <span>{c.openTasks ?? 0} open tasks</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No contacts match &ldquo;{q}&rdquo;.
        </div>
      )}
    </div>
  );
}
