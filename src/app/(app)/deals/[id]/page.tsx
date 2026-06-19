import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Calendar, User, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DealScore } from "@/components/deals/DealScore";
import { getDealById } from "@/lib/queries";
import { DEAL_STAGES, HEALTH_META } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await getDealById(id);
  if (!deal) notFound();

  const stage = DEAL_STAGES.find((s) => s.key === deal.stage);
  const health = HEALTH_META[deal.health];

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/deals" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to deals
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge>{stage?.label ?? deal.stage}</Badge>
            <Badge variant={health.variant}>{health.label}</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{deal.title}</h1>
          {deal.contact && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {deal.contact.company ?? deal.contact.name}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{formatCurrency(deal.value)}</div>
          <div className="text-xs text-muted-foreground">deal value</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-5 md:col-span-2">
          <DealScore stage={deal.stage} health={deal.health} value={deal.value} />
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Details</h2>
          <Detail icon={TrendingUp} label="Win probability" value={`${deal.probability}%`} />
          <Detail icon={Calendar} label="Expected close" value={deal.expectedCloseDate ?? "—"} />
          <Detail icon={User} label="Owner" value={deal.owner.name ?? "—"} />
          {deal.contact && (
            <Detail
              icon={User}
              label="Primary contact"
              value={deal.contact.name}
              href={`/contacts/${deal.contact.id}`}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={`text-sm font-medium ${href ? "text-primary" : ""}`}>{value}</div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
