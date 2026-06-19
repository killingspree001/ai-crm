import type {
  ContactView,
  DealView,
  TaskView,
  ActivityView,
  MeetingView,
  TeamMember,
} from "@/lib/types";

// Rich demo dataset used when no DATABASE_URL is configured, so the app is fully
// browsable as a showcase. With a real database connected, live data is used instead.

export const demoTeam: TeamMember[] = [
  { id: "u1", name: "Avery Chen", email: "avery@nexuscrm.io", role: "ADMIN" },
  { id: "u2", name: "Marco Rossi", email: "marco@nexuscrm.io", role: "SALES_REP" },
  { id: "u3", name: "Priya Nair", email: "priya@nexuscrm.io", role: "SALES_REP" },
  { id: "u4", name: "Dana Okafor", email: "dana@nexuscrm.io", role: "VIEWER" },
];

export const demoContacts: ContactView[] = [
  { id: "c1", name: "Sofia Marin", email: "sofia@helixlabs.com", phone: "+1 415 555 0142", company: "Helix Labs", title: "VP Engineering", tags: ["enterprise", "champion"], notes: "Technical champion. Cares about SOC2 and SSO.", createdAt: "2026-03-02", dealCount: 1, openTasks: 2 },
  { id: "c2", name: "James Whitfield", email: "james@northpeak.io", phone: "+1 212 555 0199", company: "Northpeak", title: "CFO", tags: ["budget-holder"], notes: "Final sign-off on budget. Wants annual pricing.", createdAt: "2026-03-18", dealCount: 1, openTasks: 1 },
  { id: "c3", name: "Lena Brandt", email: "lena@orbital.co", phone: "+49 30 5550 188", company: "Orbital", title: "Head of Sales", tags: ["mid-market"], notes: "Evaluating us vs. two competitors.", createdAt: "2026-04-01", dealCount: 1, openTasks: 0 },
  { id: "c4", name: "Tomás Herrera", email: "tomas@brightwave.com", phone: "+34 91 555 0123", company: "Brightwave", title: "COO", tags: ["enterprise"], notes: "Stalled — went quiet after proposal.", createdAt: "2026-02-11", dealCount: 1, openTasks: 1 },
  { id: "c5", name: "Mei Tanaka", email: "mei@cascade.app", phone: "+81 3 5550 0177", company: "Cascade", title: "Founder", tags: ["startup", "fast"], notes: "Moves fast, wants to close this month.", createdAt: "2026-04-22", dealCount: 1, openTasks: 1 },
  { id: "c6", name: "Daniel Osei", email: "daniel@vantage.io", phone: "+1 646 555 0110", company: "Vantage", title: "Director of Ops", tags: ["mid-market", "renewal"], notes: "Expansion opportunity for next quarter.", createdAt: "2026-01-15", dealCount: 1, openTasks: 0 },
];

export const demoDeals: DealView[] = [
  { id: "d1", title: "Helix Labs — Platform", value: 84000, stage: "NEGOTIATION", health: "HEALTHY", probability: 78, expectedCloseDate: "2026-07-10", position: 0, contact: { id: "c1", name: "Sofia Marin", company: "Helix Labs" }, owner: { id: "u2", name: "Marco Rossi" }, updatedAt: "2026-06-17" },
  { id: "d2", title: "Northpeak — Annual", value: 120000, stage: "PROPOSAL", health: "AT_RISK", probability: 45, expectedCloseDate: "2026-07-28", position: 0, contact: { id: "c2", name: "James Whitfield", company: "Northpeak" }, owner: { id: "u3", name: "Priya Nair" }, updatedAt: "2026-06-12" },
  { id: "d3", title: "Orbital — Team Plan", value: 36000, stage: "QUALIFIED", health: "HEALTHY", probability: 35, expectedCloseDate: "2026-08-15", position: 0, contact: { id: "c3", name: "Lena Brandt", company: "Orbital" }, owner: { id: "u2", name: "Marco Rossi" }, updatedAt: "2026-06-15" },
  { id: "d4", title: "Brightwave — Enterprise", value: 156000, stage: "PROPOSAL", health: "STALLED", probability: 20, expectedCloseDate: "2026-07-05", position: 1, contact: { id: "c4", name: "Tomás Herrera", company: "Brightwave" }, owner: { id: "u3", name: "Priya Nair" }, updatedAt: "2026-05-29" },
  { id: "d5", title: "Cascade — Pro", value: 18000, stage: "NEGOTIATION", health: "HEALTHY", probability: 82, expectedCloseDate: "2026-06-30", position: 1, contact: { id: "c5", name: "Mei Tanaka", company: "Cascade" }, owner: { id: "u2", name: "Marco Rossi" }, updatedAt: "2026-06-18" },
  { id: "d6", title: "Vantage — Expansion", value: 48000, stage: "LEAD", health: "HEALTHY", probability: 15, expectedCloseDate: "2026-09-01", position: 0, contact: { id: "c6", name: "Daniel Osei", company: "Vantage" }, owner: { id: "u3", name: "Priya Nair" }, updatedAt: "2026-06-16" },
  { id: "d7", title: "Helix Labs — Add-on", value: 22000, stage: "WON", health: "HEALTHY", probability: 100, expectedCloseDate: "2026-06-01", position: 0, contact: { id: "c1", name: "Sofia Marin", company: "Helix Labs" }, owner: { id: "u2", name: "Marco Rossi" }, updatedAt: "2026-06-01" },
  { id: "d8", title: "Orbital — Pilot", value: 9000, stage: "LEAD", health: "AT_RISK", probability: 10, expectedCloseDate: "2026-08-20", position: 1, contact: { id: "c3", name: "Lena Brandt", company: "Orbital" }, owner: { id: "u3", name: "Priya Nair" }, updatedAt: "2026-06-08" },
];

export const demoTasks: TaskView[] = [
  { id: "t1", title: "Send SOC2 documentation to Sofia", description: "She flagged security as the main blocker.", status: "TODO", priority: "HIGH", dueDate: "2026-06-20", aiGenerated: true, assignee: { id: "u2", name: "Marco Rossi" }, deal: { id: "d1", title: "Helix Labs — Platform" }, contact: { id: "c1", name: "Sofia Marin" } },
  { id: "t2", title: "Prepare annual pricing for Northpeak", description: "James wants annual terms before sign-off.", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-06-21", aiGenerated: true, assignee: { id: "u3", name: "Priya Nair" }, deal: { id: "d2", title: "Northpeak — Annual" }, contact: { id: "c2", name: "James Whitfield" } },
  { id: "t3", title: "Follow up with Brightwave (stalled)", description: "No reply for 12 days. Re-engage Tomás.", status: "TODO", priority: "HIGH", dueDate: "2026-06-19", aiGenerated: true, assignee: { id: "u3", name: "Priya Nair" }, deal: { id: "d4", title: "Brightwave — Enterprise" }, contact: { id: "c4", name: "Tomás Herrera" } },
  { id: "t4", title: "Schedule Cascade contract signing", description: "Mei ready to close this month.", status: "TODO", priority: "MEDIUM", dueDate: "2026-06-24", aiGenerated: false, assignee: { id: "u2", name: "Marco Rossi" }, deal: { id: "d5", title: "Cascade — Pro" }, contact: { id: "c5", name: "Mei Tanaka" } },
  { id: "t5", title: "Qualify Orbital pilot scope", description: null, status: "IN_PROGRESS", priority: "MEDIUM", dueDate: "2026-06-26", aiGenerated: false, assignee: { id: "u2", name: "Marco Rossi" }, deal: { id: "d3", title: "Orbital — Team Plan" }, contact: { id: "c3", name: "Lena Brandt" } },
  { id: "t6", title: "Draft expansion proposal for Vantage", description: null, status: "TODO", priority: "LOW", dueDate: "2026-07-02", aiGenerated: false, assignee: { id: "u3", name: "Priya Nair" }, deal: { id: "d6", title: "Vantage — Expansion" }, contact: { id: "c6", name: "Daniel Osei" } },
  { id: "t7", title: "Log kickoff notes for Helix add-on", description: "Won deal — capture onboarding details.", status: "DONE", priority: "MEDIUM", dueDate: "2026-06-02", aiGenerated: false, assignee: { id: "u2", name: "Marco Rossi" }, deal: { id: "d7", title: "Helix Labs — Add-on" }, contact: { id: "c1", name: "Sofia Marin" } },
];

export const demoActivities: ActivityView[] = [
  { id: "a1", type: "MEETING", content: "Discovery call with Sofia — covered security requirements and rollout timeline.", createdAt: "2026-06-17", user: { name: "Marco Rossi" } },
  { id: "a2", type: "STAGE_CHANGE", content: "Cascade — Pro moved to Negotiation.", createdAt: "2026-06-18", user: { name: "Marco Rossi" } },
  { id: "a3", type: "EMAIL", content: "Sent follow-up to James with annual pricing options.", createdAt: "2026-06-12", user: { name: "Priya Nair" } },
  { id: "a4", type: "NOTE", content: "Brightwave went quiet after proposal — flagged as stalled.", createdAt: "2026-06-09", user: { name: "Priya Nair" } },
  { id: "a5", type: "CALL", content: "Quick check-in with Mei — ready to sign this month.", createdAt: "2026-06-18", user: { name: "Marco Rossi" } },
];

export const demoMeetings: MeetingView[] = [
  {
    id: "m1",
    title: "Helix Labs — Discovery Call",
    occurredAt: "2026-06-17",
    processed: true,
    summary:
      "Sofia (VP Eng) is the technical champion. Main blocker is security review (SOC2, SSO). Positive on timeline; aiming to roll out to 40 seats in Q3. Budget confirmed pending security sign-off.",
    transcript:
      "Marco: Thanks for joining, Sofia. Could you walk me through your current workflow?\nSofia: Sure. Right now the team juggles three tools... the big thing for us is security — we need SOC2 and SSO before we can commit.\nMarco: Understood. We can send over our SOC2 report this week.\nSofia: Great. If security checks out, we'd want to start with about 40 seats in Q3.\nMarco: Perfect, I'll prepare a rollout plan.",
    contact: { id: "c1", name: "Sofia Marin" },
    deal: { id: "d1", title: "Helix Labs — Platform" },
  },
  {
    id: "m2",
    title: "Cascade — Pricing Sync",
    occurredAt: "2026-06-18",
    processed: true,
    summary:
      "Mei wants to close before end of month. Agreed on Pro plan. Next step: send contract for signature.",
    transcript:
      "Mei: We love it. Let's get this done before month end.\nMarco: Awesome — I'll send the Pro contract today.\nMei: Perfect, I'll sign as soon as it's in.",
    contact: { id: "c5", name: "Mei Tanaka" },
    deal: { id: "d5", title: "Cascade — Pro" },
  },
  {
    id: "m3",
    title: "Northpeak — Budget Review",
    occurredAt: "2026-06-12",
    processed: false,
    summary: null,
    transcript:
      "James: Before we proceed I need to see annual pricing. The board only approves annual commitments.\nPriya: Got it, I'll prepare annual terms.\nJames: Also need a clear ROI summary for the finance committee.",
    contact: { id: "c2", name: "James Whitfield" },
    deal: { id: "d2", title: "Northpeak — Annual" },
  },
];
