import { PageHeader } from "@/components/app/PageHeader";
import { KanbanBoard } from "@/components/deals/KanbanBoard";
import { getDeals } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default async function DealsPage() {
  const deals = await getDeals();
  const open = deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST");
  const total = open.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Deals" subtitle="Drag deals between stages to move them through your pipeline.">
        <div className="rounded-lg border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">Open pipeline:</span>{" "}
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
      </PageHeader>
      <div className="min-h-0 flex-1">
        <KanbanBoard initialDeals={deals} />
      </div>
    </div>
  );
}
