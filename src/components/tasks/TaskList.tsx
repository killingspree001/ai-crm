"use client";

import { useState } from "react";
import { Check, Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_META } from "@/lib/constants";
import { initials, cn } from "@/lib/utils";
import { setTaskStatus } from "@/app/actions";
import type { TaskView } from "@/lib/types";

type Filter = "ALL" | "OPEN" | "DONE";

export function TaskList({ initialTasks }: { initialTasks: TaskView[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<Filter>("OPEN");

  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "DONE" ? "TODO" : "DONE" } : t
      )
    );
    const t = tasks.find((x) => x.id === id);
    const next = t?.status === "DONE" ? "TODO" : "DONE";
    setTaskStatus(id, next).catch(() => {});
  };

  const visible = tasks.filter((t) =>
    filter === "ALL" ? true : filter === "DONE" ? t.status === "DONE" : t.status !== "DONE"
  );

  const counts = {
    ALL: tasks.length,
    OPEN: tasks.filter((t) => t.status !== "DONE").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 text-sm w-fit">
        {(["OPEN", "ALL", "DONE"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium capitalize transition-colors",
              filter === f ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.toLowerCase()} <span className="ml-1 text-xs text-muted-foreground">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {visible.map((t) => {
          const done = t.status === "DONE";
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-accent/40"
            >
              <button
                onClick={() => toggle(t.id)}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                  done ? "border-primary bg-brand-gradient text-white" : "border-border hover:border-primary"
                )}
              >
                {done && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("truncate text-sm font-medium", done && "text-muted-foreground line-through")}>
                    {t.title}
                  </span>
                  {t.aiGenerated && (
                    <Badge>
                      <Sparkles className="h-2.5 w-2.5" /> AI
                    </Badge>
                  )}
                </div>
                {t.deal && <span className="text-xs text-muted-foreground">{t.deal.title}</span>}
              </div>

              <span className={cn("hidden text-[10px] font-bold uppercase sm:block", PRIORITY_META[t.priority].color)}>
                {PRIORITY_META[t.priority].label}
              </span>
              {t.dueDate && (
                <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                  <Calendar className="h-3 w-3" /> {t.dueDate}
                </span>
              )}
              {t.assignee && (
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[9px] font-bold"
                  title={t.assignee.name ?? ""}
                >
                  {initials(t.assignee.name)}
                </span>
              )}
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">Nothing here. 🎉</div>
        )}
      </div>
    </div>
  );
}
