"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { DealStage } from "@prisma/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PIPELINE_STAGES, HEALTH_META } from "@/lib/constants";
import { formatCurrency, initials } from "@/lib/utils";
import { updateDealStage } from "@/app/actions";
import type { DealView } from "@/lib/types";

function DealCard({ deal, overlay }: { deal: DealView; overlay?: boolean }) {
  const meta = HEALTH_META[deal.health];
  return (
    <div
      className={`rounded-xl border border-border bg-card p-3.5 shadow-sm ${
        overlay ? "rotate-2 shadow-xl ring-1 ring-primary/40" : "hover:border-primary/40"
      } transition-colors`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-snug">{deal.title}</span>
        <Badge variant={meta.variant}>{meta.label}</Badge>
      </div>
      {deal.contact && (
        <p className="mb-3 text-xs text-muted-foreground">
          {deal.contact.company ?? deal.contact.name}
        </p>
      )}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>Win prob.</span>
          <span>{deal.probability}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${deal.probability}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{formatCurrency(deal.value)}</span>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[9px] font-bold"
          title={deal.owner.name ?? ""}
        >
          {initials(deal.owner.name)}
        </span>
      </div>
    </div>
  );
}

function DraggableCard({ deal }: { deal: DealView }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: deal.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      <Link href={`/deals/${deal.id}`} onClick={(e) => isDragging && e.preventDefault()}>
        <DealCard deal={deal} />
      </Link>
    </div>
  );
}

function Column({
  stage,
  deals,
}: {
  stage: (typeof PIPELINE_STAGES)[number];
  deals: DealView[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const total = deals.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${stage.dot}`} />
          <span className="text-sm font-semibold">{stage.label}</span>
          <span className="rounded-full bg-secondary px-1.5 text-[10px] font-bold text-muted-foreground">
            {deals.length}
          </span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground">{formatCurrency(total)}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 rounded-xl border border-dashed p-2 transition-colors ${
          isOver ? "border-primary/50 bg-primary/5" : "border-border/60 bg-card/20"
        }`}
      >
        {deals.map((d) => (
          <DraggableCard key={d.id} deal={d} />
        ))}
        {deals.length === 0 && (
          <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ initialDeals }: { initialDeals: DealView[] }) {
  const [deals, setDeals] = useState(initialDeals);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const dealId = active.id as string;
    const newStage = over.id as DealStage;
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === newStage) return;

    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
    const label = PIPELINE_STAGES.find((s) => s.key === newStage)?.label ?? newStage;
    updateDealStage(dealId, newStage)
      .then(() => toast.success(`Moved "${deal.title}" to ${label}`))
      .catch(() => toast.error("Couldn't save move"));
  };

  const activeDeal = deals.find((d) => d.id === activeId) ?? null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="scroll-slim flex min-h-full gap-4 overflow-x-auto p-6">
        {PIPELINE_STAGES.map((stage) => (
          <Column key={stage.key} stage={stage} deals={deals.filter((d) => d.stage === stage.key)} />
        ))}
      </div>
      <DragOverlay>{activeDeal ? <DealCard deal={activeDeal} overlay /> : null}</DragOverlay>
    </DndContext>
  );
}
