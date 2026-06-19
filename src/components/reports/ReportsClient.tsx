"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEAL_STAGES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { weeklyReport } from "@/app/actions";
import type { DealView } from "@/lib/types";

const HEALTH_COLORS = { HEALTHY: "#34d399", AT_RISK: "#fbbf24", STALLED: "#fb7185" };
const trend = [
  { m: "Jan", v: 210 }, { m: "Feb", v: 260 }, { m: "Mar", v: 240 },
  { m: "Apr", v: 320 }, { m: "May", v: 380 }, { m: "Jun", v: 471 },
];

const tooltipStyle = {
  backgroundColor: "rgba(20,22,30,0.92)",
  border: "1px solid rgba(59,130,246,0.3)",
  borderRadius: "10px",
  fontSize: 12,
};

export function ReportsClient({
  deals,
  stats,
}: {
  deals: DealView[];
  stats: { pipelineValue: number; weightedValue: number; wonValue: number; openDeals: number; atRiskCount: number };
}) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const open = deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST");
  const stageData = DEAL_STAGES.map((s) => ({
    name: s.label,
    value: open.filter((d) => d.stage === s.key).reduce((a, d) => a + d.value, 0),
  }));
  const healthData = (["HEALTHY", "AT_RISK", "STALLED"] as const).map((h) => ({
    name: h.replace("_", " "),
    key: h,
    value: open.filter((d) => d.health === h).length,
  }));

  const generate = async () => {
    setLoading(true);
    try {
      const { text } = await weeklyReport(stats);
      setReport(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI weekly report */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-primary/5 px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">AI Weekly Summary</h2>
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Writing..." : "Generate report"}
          </Button>
        </div>
        <div className="p-5">
          {report ? (
            <p className="text-sm leading-relaxed">{report}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click <span className="font-medium text-foreground">Generate report</span> to have AI write this
              week&apos;s pipeline summary from your live metrics.
            </p>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Pipeline Value by Stage</h2>
          </div>
          <div className="h-[280px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <defs>
                  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(59,130,246,0.08)" }} formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="value" fill="url(#bar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Deal Health</h2>
          </div>
          <div className="h-[280px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {healthData.map((h) => (
                    <Cell key={h.key} fill={HEALTH_COLORS[h.key]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4">
              {healthData.map((h) => (
                <div key={h.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: HEALTH_COLORS[h.key] }} />
                  {h.name} ({h.value})
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Pipeline Trend</h2>
          </div>
          <div className="h-[240px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${Number(v)}k`} />
                <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} fill="url(#area)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk heatmap */}
        <Card>
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Risk Heatmap</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-4 gap-2">
              {open.map((d) => (
                <div
                  key={d.id}
                  title={`${d.title} — ${d.health}`}
                  className="aspect-square rounded-md"
                  style={{ background: HEALTH_COLORS[d.health], opacity: 0.85 }}
                />
              ))}
            </div>
            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: HEALTH_COLORS.HEALTHY }} /> Healthy</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: HEALTH_COLORS.AT_RISK }} /> At risk</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: HEALTH_COLORS.STALLED }} /> Stalled</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
