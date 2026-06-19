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
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-brand-gradient p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/15 blur-[120px]" />
        <div className="absolute -bottom-32 -left-10 h-96 w-96 rounded-full bg-black/10 blur-[120px]" />

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 font-black text-white backdrop-blur">
            C
          </div>
          <span className="text-lg font-bold tracking-tight">Cadence</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> AI Meeting Intelligence
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Close more deals with an AI that does the busywork.
          </h2>
          <div className="mt-8 space-y-4">
            {points.map((p) => (
              <div key={p.text} className="flex items-center gap-3 text-sm text-white/90">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <p.icon className="h-4 w-4" />
                </div>
                {p.text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/70">Trusted by modern sales teams.</div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-black text-white">
              C
            </div>
            <span className="text-lg font-bold tracking-tight">Cadence</span>
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
