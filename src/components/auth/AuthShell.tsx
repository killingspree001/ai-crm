import Link from "next/link";
import { Sparkles, Mic, ShieldCheck, BarChart3 } from "lucide-react";

const points = [
  { icon: Mic, text: "Turn meeting transcripts into action items automatically" },
  { icon: ShieldCheck, text: "AI flags stalled deals before they go cold" },
  { icon: BarChart3, text: "Weighted forecasts and weekly summaries, generated for you" },
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border p-12 lg:flex">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-gradient opacity-20 blur-[120px]" />
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-black text-white">
            N
          </div>
          <span className="text-lg font-bold tracking-tight">Nexus CRM</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI Meeting Intelligence
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-gradient">
            Close more deals with an AI that does the busywork.
          </h2>
          <div className="mt-8 space-y-4">
            {points.map((p) => (
              <div key={p.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <p.icon className="h-4 w-4" />
                </div>
                {p.text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          Trusted by modern sales teams.
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-black text-white">
              N
            </div>
            <span className="text-lg font-bold tracking-tight">Nexus CRM</span>
          </Link>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
