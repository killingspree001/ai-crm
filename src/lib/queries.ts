import prisma from "@/lib/prisma";
import {
  demoContacts,
  demoDeals,
  demoTasks,
  demoActivities,
  demoMeetings,
  demoTeam,
} from "@/lib/demo-data";
import type {
  ContactView,
  DealView,
  TaskView,
  MeetingView,
  ActivityView,
  TeamMember,
} from "@/lib/types";

/** True only when a real Postgres URL is configured (not the build placeholder). */
export function dbConfigured() {
  const url = process.env.DATABASE_URL;
  return !!url && !url.includes("placeholder");
}

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

export async function getDeals(): Promise<DealView[]> {
  if (!dbConfigured()) return demoDeals;
  const deals = await prisma.deal.findMany({
    include: { contact: true, owner: true },
    orderBy: [{ stage: "asc" }, { position: "asc" }],
  });
  return deals.map((d) => ({
    id: d.id,
    title: d.title,
    value: d.value,
    stage: d.stage,
    health: d.health,
    probability: d.probability,
    expectedCloseDate: iso(d.expectedCloseDate),
    position: d.position,
    contact: d.contact ? { id: d.contact.id, name: d.contact.name, company: d.contact.company } : null,
    owner: { id: d.owner.id, name: d.owner.name },
    updatedAt: iso(d.updatedAt) ?? "",
  }));
}

export async function getContacts(): Promise<ContactView[]> {
  if (!dbConfigured()) return demoContacts;
  const contacts = await prisma.contact.findMany({
    include: { _count: { select: { deals: true, tasks: true } } },
    orderBy: { createdAt: "desc" },
  });
  return contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    title: c.title,
    tags: c.tags,
    notes: c.notes,
    createdAt: iso(c.createdAt) ?? "",
    dealCount: c._count.deals,
    openTasks: c._count.tasks,
  }));
}

export async function getTasks(): Promise<TaskView[]> {
  if (!dbConfigured()) return demoTasks;
  const tasks = await prisma.task.findMany({
    include: { assignee: true, deal: true, contact: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: iso(t.dueDate),
    aiGenerated: t.aiGenerated,
    assignee: t.assignee ? { id: t.assignee.id, name: t.assignee.name } : null,
    deal: t.deal ? { id: t.deal.id, title: t.deal.title } : null,
    contact: t.contact ? { id: t.contact.id, name: t.contact.name } : null,
  }));
}

export async function getMeetings(): Promise<MeetingView[]> {
  if (!dbConfigured()) return demoMeetings;
  const meetings = await prisma.meeting.findMany({
    include: { contact: true, deal: true },
    orderBy: { occurredAt: "desc" },
  });
  return meetings.map((m) => ({
    id: m.id,
    title: m.title,
    occurredAt: iso(m.occurredAt) ?? "",
    processed: m.processed,
    summary: m.summary,
    transcript: m.transcript,
    contact: m.contact ? { id: m.contact.id, name: m.contact.name } : null,
    deal: m.deal ? { id: m.deal.id, title: m.deal.title } : null,
  }));
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!dbConfigured()) return demoTeam;
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
}

export async function getRecentActivity(): Promise<ActivityView[]> {
  if (!dbConfigured()) return demoActivities;
  const acts = await prisma.activity.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return acts.map((a) => ({
    id: a.id,
    type: a.type,
    content: a.content,
    createdAt: iso(a.createdAt) ?? "",
    user: { name: a.user.name },
  }));
}

export async function getDashboardData() {
  const [deals, tasks, activity] = await Promise.all([
    getDeals(),
    getTasks(),
    getRecentActivity(),
  ]);

  const open = deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST");
  const won = deals.filter((d) => d.stage === "WON");
  const pipelineValue = open.reduce((s, d) => s + d.value, 0);
  const weightedValue = Math.round(
    open.reduce((s, d) => s + (d.value * d.probability) / 100, 0)
  );
  const wonValue = won.reduce((s, d) => s + d.value, 0);
  const atRisk = open.filter((d) => d.health !== "HEALTHY");

  return {
    deals,
    tasks,
    activity,
    stats: {
      pipelineValue,
      weightedValue,
      wonValue,
      openDeals: open.length,
      atRiskCount: atRisk.length,
      openTasks: tasks.filter((t) => t.status !== "DONE").length,
    },
    atRisk,
  };
}

export async function getContactById(id: string): Promise<ContactView | null> {
  if (!dbConfigured()) return demoContacts.find((c) => c.id === id) ?? null;
  const c = await prisma.contact.findUnique({
    where: { id },
    include: { _count: { select: { deals: true, tasks: true } } },
  });
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    title: c.title,
    tags: c.tags,
    notes: c.notes,
    createdAt: iso(c.createdAt) ?? "",
    dealCount: c._count.deals,
    openTasks: c._count.tasks,
  };
}

export async function getDealById(id: string): Promise<DealView | null> {
  if (!dbConfigured()) return demoDeals.find((d) => d.id === id) ?? null;
  const d = await prisma.deal.findUnique({
    where: { id },
    include: { contact: true, owner: true },
  });
  if (!d) return null;
  return {
    id: d.id,
    title: d.title,
    value: d.value,
    stage: d.stage,
    health: d.health,
    probability: d.probability,
    expectedCloseDate: iso(d.expectedCloseDate),
    position: d.position,
    contact: d.contact ? { id: d.contact.id, name: d.contact.name, company: d.contact.company } : null,
    owner: { id: d.owner.id, name: d.owner.name },
    updatedAt: iso(d.updatedAt) ?? "",
  };
}
