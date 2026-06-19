import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTeam } from "@/lib/queries";
import { ROLE_META } from "@/lib/constants";
import { initials } from "@/lib/utils";
import { SettingsPreferences } from "@/components/settings/SettingsPreferences";

export default async function SettingsPage() {
  const team = await getTeam();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your team, roles, notifications, and integrations." />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Team Members</h2>
            <Badge variant="neutral">{team.length} members</Badge>
          </div>
          <div className="divide-y divide-border">
            {team.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  {initials(m.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.email}</div>
                </div>
                <Badge variant={m.role === "ADMIN" ? "default" : "neutral"}>{ROLE_META[m.role]}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <SettingsPreferences />
      </div>
    </div>
  );
}
