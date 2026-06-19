import Link from "next/link";
import {
  TrendingUp,
  Target,
  Trophy,
  Briefcase,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  CheckSquare,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/queries";
import { DEAL_STAGES, HEALTH_META, PRIORITY_META } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default async function HomePage() {
  const { stats, deals, tasks, activity, atRisk } = await getDashboardData();

  const statCards = [
    { label: "Pipeline Value", value: formatCurrency(stats.pipelineValue), icon: TrendingUp, hint: `${stats.openDeals} open deals`, tint: "text-sky-300" },
    { label: "Weighted Forecast", value: formatCurrency(stats.weightedValue), icon: Target, hint: "probability-adjusted", tint: "text-indigo-300" },
    { label: "Closed Won", value: formatCurrency(stats.wonValue), icon: Trophy, hint: "this period", tint: "text-emerald-300" },
    { label: "Needs Attention", value: String(stats.atRiskCount), icon: AlertTriangle, hint: "at-risk / stalled", tint: "text-amber-300" },
  ];

  const openDeals = deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST");
  const byStage = DEAL_STAGES.map((s) => {
    const items = openDeals.filter((d) => d.stage === s.key);
    return { ...s, count: items.length, value: items.reduce((a, d) => a + d.value, 0) };
  });
  const maxStageVal = Math.max(1, ...byStage.map((s) => s.value));
  const todays = [...tasks].filter((t) => t.status !== "DONE").slice(0, 5);

  return (
    <div>
      <PageHeader title="Pipeline Overview" subtitle="Your sales at a glance, with AI watching for risk.">
        <Link
          href="/meetings"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-gradient px-4 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" /> Process a meeting
        </Link>
      </PageHeader>

      <div className="space-y-6 p-6">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
                <s.icon className={`h-4 w-4 ${s.tint}`} />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pipeline by stage */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide">Pipeline by Stage</h2>
                <p className="text-xs text-muted-foreground">Open deal value across your funnel</p>
              </div>
              <Link href="/deals" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Open board <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-4 p-5">
              {byStage.map((s) => (
                <div key={s.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                      <span className="font-medium">{s.label}</span>
                      <span className="text-xs text-muted-foreground">· {s.count}</span>
                    </span>
                    <span className="font-semibold">{formatCurrency(s.value)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${(s.value / maxStageVal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI risk panel */}
          <Card>
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">AI Risk Radar</h2>
            </div>
            <div className="space-y-3 p-5">
              {atRisk.length === 0 && (
                <p className="text-sm text-muted-foreground">No risks detected. Pipeline looks healthy. 🎉</p>
              )}
              {atRisk.map((d) => {
                const meta = HEALTH_META[d.health];
                return (
                  <Link
                    key={d.id}
                    href={`/deals/${d.id}`}
                    className="block rounded-lg border border-border bg-background/40 p-3 transition hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{d.title}</span>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {d.health === "STALLED"
                        ? "No activity in 10+ days — likely going cold."
                        : "Momentum slowing; needs a nudge to stay on track."}
                    </p>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's tasks */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wide">Today&apos;s Tasks</h2>
              </div>
              <Link href="/tasks" className="text-xs font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-border">
              {todays.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="h-4 w-4 shrink-0 rounded-md border border-border" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{t.title}</span>
                      {t.aiGenerated && <Badge>AI</Badge>}
                    </div>
                    {t.deal && <span className="text-xs text-muted-foreground">{t.deal.title}</span>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${PRIORITY_META[t.priority].color}`}>
                    {PRIORITY_META[t.priority].label}
                  </span>
                  {t.dueDate && (
                    <span className="hidden text-xs text-muted-foreground sm:block">{t.dueDate}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Recent activity */}
          <Card>
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Briefcase className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">Recent Activity</h2>
            </div>
            <div className="space-y-4 p-5">
              {activity.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm leading-snug">{a.content}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {a.user.name} · {a.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
