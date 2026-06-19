"use client";

import { useState } from "react";
import { Bell, Plug, Mail, MessageSquare, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn("relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors", on ? "bg-brand-gradient" : "bg-muted")}
    >
      <span className={cn("block h-5 w-5 rounded-full bg-white shadow transition-transform", on && "translate-x-5")} />
    </button>
  );
}

const prefsInit = [
  { key: "risk", label: "Deal risk alerts", desc: "Notify when AI flags a stalled deal", on: true },
  { key: "digest", label: "Weekly AI digest", desc: "Email me the weekly pipeline summary", on: true },
  { key: "tasks", label: "Task reminders", desc: "Remind me about due action items", on: false },
];

const integrations = [
  { key: "gmail", label: "Gmail", desc: "Sync emails & send follow-ups", icon: Mail, connected: true },
  { key: "slack", label: "Slack", desc: "Deal alerts in your channel", icon: MessageSquare, connected: false },
  { key: "cal", label: "Google Calendar", desc: "Auto-import meetings", icon: Calendar, connected: true },
];

export function SettingsPreferences() {
  const [prefs, setPrefs] = useState(prefsInit);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide">Notifications</h2>
        </div>
        <div className="divide-y divide-border">
          {prefs.map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div>
                <div className="text-sm font-medium">{p.label}</div>
                <div className="text-xs text-muted-foreground">{p.desc}</div>
              </div>
              <Toggle
                on={p.on}
                onClick={() => setPrefs((prev) => prev.map((x) => (x.key === p.key ? { ...x, on: !x.on } : x)))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Plug className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide">Integrations</h2>
        </div>
        <div className="divide-y divide-border">
          {integrations.map((i) => (
            <div key={i.key} className="flex items-center gap-3 px-5 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <i.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{i.label}</div>
                <div className="truncate text-xs text-muted-foreground">{i.desc}</div>
              </div>
              {i.connected ? (
                <Badge variant="healthy">Connected</Badge>
              ) : (
                <button className="text-xs font-semibold text-primary hover:underline">Connect</button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
