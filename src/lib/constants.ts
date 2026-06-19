import type { DealStage, DealHealth, TaskPriority, UserRole } from "@prisma/client";

export const DEAL_STAGES: {
  key: DealStage;
  label: string;
  /** tailwind text/bg color hints */
  color: string;
  dot: string;
}[] = [
  { key: "LEAD", label: "Lead", color: "text-sky-300", dot: "bg-sky-400" },
  { key: "QUALIFIED", label: "Qualified", color: "text-indigo-300", dot: "bg-indigo-400" },
  { key: "PROPOSAL", label: "Proposal", color: "text-violet-300", dot: "bg-violet-400" },
  { key: "NEGOTIATION", label: "Negotiation", color: "text-amber-300", dot: "bg-amber-400" },
  { key: "WON", label: "Won", color: "text-emerald-300", dot: "bg-emerald-400" },
];

/** Columns shown on the Kanban board (LOST is tracked but not a board column). */
export const PIPELINE_STAGES = DEAL_STAGES;

export const HEALTH_META: Record<DealHealth, { label: string; variant: "healthy" | "risk" | "stalled" }> = {
  HEALTHY: { label: "Healthy", variant: "healthy" },
  AT_RISK: { label: "At Risk", variant: "risk" },
  STALLED: { label: "Stalled", variant: "stalled" },
};

export const PRIORITY_META: Record<TaskPriority, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-muted-foreground" },
  MEDIUM: { label: "Medium", color: "text-sky-300" },
  HIGH: { label: "High", color: "text-rose-300" },
};

export const ROLE_META: Record<UserRole, string> = {
  ADMIN: "Admin",
  SALES_REP: "Sales Rep",
  VIEWER: "Viewer",
};
