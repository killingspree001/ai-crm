"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { dbConfigured } from "@/lib/queries";
import * as ai from "@/lib/ai";
import type { DealStage, TaskStatus } from "@prisma/client";

/** Move a deal to a new pipeline stage (persists when a DB is connected). */
export async function updateDealStage(id: string, stage: DealStage) {
  if (dbConfigured()) {
    await prisma.deal.update({ where: { id }, data: { stage } });
    revalidatePath("/deals");
    revalidatePath("/");
  }
  return { ok: true };
}

/** Toggle a task's status. */
export async function setTaskStatus(id: string, status: TaskStatus) {
  if (dbConfigured()) {
    await prisma.task.update({ where: { id }, data: { status } });
    revalidatePath("/tasks");
  }
  return { ok: true };
}

/** Create a contact (requires a DB). */
export async function createContact(input: {
  name: string;
  email?: string;
  company?: string;
  title?: string;
}) {
  if (!dbConfigured()) {
    return { ok: false, demo: true as const };
  }
  const owner = await prisma.user.findFirst();
  if (!owner) return { ok: false, demo: false as const };
  const c = await prisma.contact.create({
    data: {
      name: input.name,
      email: input.email || null,
      company: input.company || null,
      title: input.title || null,
      ownerId: owner.id,
    },
  });
  revalidatePath("/contacts");
  return { ok: true, id: c.id };
}

/** Run AI extraction on a meeting transcript (works in demo — pure computation). */
export async function processTranscript(transcript: string) {
  const result = await ai.extractActionItems(transcript);
  return result;
}

/** Generate a follow-up email draft from a summary. */
export async function draftEmail(contactName: string, summary: string) {
  const text = await ai.draftFollowUpEmail(contactName, summary);
  return { text };
}

/** Generate the AI weekly report narrative. */
export async function weeklyReport(stats: {
  pipelineValue: number;
  weightedValue: number;
  wonValue: number;
  openDeals: number;
  atRiskCount: number;
}) {
  const text = await ai.generateWeeklyReport(stats);
  return { text };
}

/** AI deal score. */
export async function scoreDeal(deal: { stage: string; health: string; value: number }) {
  return ai.scoreDeal(deal);
}
