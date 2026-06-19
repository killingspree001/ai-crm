import type {
  DealStage,
  DealHealth,
  TaskStatus,
  TaskPriority,
  ActivityType,
  UserRole,
} from "@prisma/client";

export type ContactView = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  tags: string[];
  notes: string | null;
  createdAt: string;
  dealCount?: number;
  openTasks?: number;
};

export type DealView = {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  health: DealHealth;
  probability: number;
  expectedCloseDate: string | null;
  position: number;
  contact: { id: string; name: string; company: string | null } | null;
  owner: { id: string; name: string | null };
  updatedAt: string;
};

export type TaskView = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  aiGenerated: boolean;
  assignee: { id: string; name: string | null } | null;
  deal: { id: string; title: string } | null;
  contact: { id: string; name: string } | null;
};

export type ActivityView = {
  id: string;
  type: ActivityType;
  content: string;
  createdAt: string;
  user: { name: string | null };
};

export type MeetingView = {
  id: string;
  title: string;
  occurredAt: string;
  processed: boolean;
  summary: string | null;
  transcript: string;
  contact: { id: string; name: string } | null;
  deal: { id: string; title: string } | null;
};

export type TeamMember = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};
