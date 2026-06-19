// AI service layer.
//
// By default (AI_PROVIDER unset or "mock") these functions return realistic,
// deterministic results so the product is fully demoable at zero cost. To enable
// real inference, set AI_PROVIDER="openai" (or "anthropic") and an API key, then
// implement the marked TODO branches — the function signatures stay the same.

export type ExtractedTask = {
  title: string;
  owner: string;
  due: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export type ExtractionResult = {
  summary: string;
  tasks: ExtractedTask[];
  sentiment: "positive" | "neutral" | "negative";
};

export type RiskFlag = {
  dealId: string;
  deal: string;
  severity: "low" | "medium" | "high";
  reason: string;
};

const provider = () => process.env.AI_PROVIDER || "mock";

/** Simulate model latency for realistic UX in the demo. */
const think = (ms = 900) => new Promise((r) => setTimeout(r, ms));

const ACTION_CUES = [
  "send", "prepare", "follow up", "schedule", "share", "draft",
  "set up", "review", "confirm", "i'll", "we'll", "we need", "let's",
];

/** Extract action items + summary from a meeting transcript. */
export async function extractActionItems(transcript: string): Promise<ExtractionResult> {
  if (provider() !== "mock") {
    // TODO: call OpenAI/Anthropic with a structured-output prompt and return the parsed result.
  }
  await think();

  const lines = transcript
    .split(/\n|\.(?=\s|$)/)
    .map((l) => l.trim())
    .filter(Boolean);

  const tasks: ExtractedTask[] = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (ACTION_CUES.some((c) => lower.includes(c))) {
      const owner = /priya/i.test(line)
        ? "Priya Nair"
        : /marco/i.test(line)
        ? "Marco Rossi"
        : "You";
      const priority: ExtractedTask["priority"] =
        /security|soc2|contract|sign|budget|blocker|asap|today/i.test(lower)
          ? "HIGH"
          : /pricing|proposal|plan|roi/i.test(lower)
          ? "MEDIUM"
          : "LOW";
      tasks.push({
        title: cleanTitle(line),
        owner,
        due: priority === "HIGH" ? "in 2 days" : "this week",
        priority,
      });
    }
    if (tasks.length >= 5) break;
  }

  if (tasks.length === 0) {
    tasks.push(
      { title: "Send recap email to the contact", owner: "You", due: "today", priority: "MEDIUM" },
      { title: "Log next steps in the deal record", owner: "You", due: "this week", priority: "LOW" }
    );
  }

  const sentiment: ExtractionResult["sentiment"] = /blocker|concern|quiet|delay|expensive/i.test(
    transcript
  )
    ? "neutral"
    : "positive";

  return {
    summary: summarize(transcript),
    tasks,
    sentiment,
  };
}

/** Flag stalled / at-risk deals from the pipeline. */
export async function detectRisks(
  deals: { id: string; title: string; health: string; probability: number; updatedAt: string }[]
): Promise<RiskFlag[]> {
  if (provider() !== "mock") {
    // TODO: send pipeline snapshot to the model for risk analysis.
  }
  await think(600);
  return deals
    .filter((d) => d.health !== "HEALTHY" || d.probability < 25)
    .map((d) => ({
      dealId: d.id,
      deal: d.title,
      severity: d.health === "STALLED" ? "high" : d.probability < 25 ? "medium" : "low",
      reason:
        d.health === "STALLED"
          ? "No activity in 10+ days after proposal — likely going cold."
          : d.health === "AT_RISK"
          ? "Momentum slowing; budget-holder hasn't re-engaged."
          : "Low win probability for current stage.",
    }));
}

/** Generate a weekly pipeline summary. */
export async function generateWeeklyReport(stats: {
  pipelineValue: number;
  weightedValue: number;
  wonValue: number;
  openDeals: number;
  atRiskCount: number;
}): Promise<string> {
  if (provider() !== "mock") {
    // TODO: have the model write the narrative from real metrics.
  }
  await think(700);
  const fmt = (n: number) => "$" + n.toLocaleString("en-US");
  return [
    `This week your pipeline holds ${fmt(stats.pipelineValue)} across ${stats.openDeals} open deals, with a weighted forecast of ${fmt(stats.weightedValue)}.`,
    `${fmt(stats.wonValue)} closed-won so far. ${stats.atRiskCount} deal${stats.atRiskCount === 1 ? "" : "s"} need attention — prioritize the stalled ones first.`,
    `Recommended focus: push negotiation-stage deals to signature and re-engage the stalled accounts before they go cold.`,
  ].join(" ");
}

/** Draft a follow-up email from meeting notes. */
export async function draftFollowUpEmail(contactName: string, summary: string): Promise<string> {
  if (provider() !== "mock") {
    // TODO: generate with the model using the summary as context.
  }
  await think(800);
  const first = contactName.split(" ")[0];
  return `Hi ${first},

Thanks for taking the time to chat today. To recap what we covered:

${summary}

I'll get the next steps moving on my end. Please let me know if anything above needs adjusting, and I'm happy to jump on another call if helpful.

Best,
Marco`;
}

/** Pull key facts from free-form contact notes. */
export async function enrichContact(notes: string): Promise<string[]> {
  if (provider() !== "mock") {
    // TODO: ask the model to extract structured facts.
  }
  await think(500);
  const facts = notes
    .split(/\.|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
    .slice(0, 4);
  return facts.length ? facts : ["No notes available to enrich yet."];
}

/** Score a deal's probability to close (0-100) with reasoning. */
export async function scoreDeal(deal: {
  stage: string;
  health: string;
  value: number;
}): Promise<{ probability: number; reasoning: string }> {
  if (provider() !== "mock") {
    // TODO: model-based scoring.
  }
  await think(500);
  const base: Record<string, number> = {
    LEAD: 15,
    QUALIFIED: 35,
    PROPOSAL: 55,
    NEGOTIATION: 78,
    WON: 100,
    LOST: 0,
  };
  let p = base[deal.stage] ?? 20;
  if (deal.health === "AT_RISK") p -= 15;
  if (deal.health === "STALLED") p -= 30;
  p = Math.max(5, Math.min(100, p));
  return {
    probability: p,
    reasoning: `Based on the ${deal.stage.toLowerCase()} stage and ${deal.health
      .toLowerCase()
      .replace("_", " ")} signals, this deal has a ${p}% chance to close.`,
  };
}

function cleanTitle(line: string) {
  let t = line.replace(/^(marco|sofia|priya|james|mei|lena|tomás|dana|daniel)\s*:\s*/i, "");
  t = t.replace(/^(i'll|we'll|we need to|let's|i will|we will)\s*/i, "");
  t = t.charAt(0).toUpperCase() + t.slice(1);
  return t.length > 80 ? t.slice(0, 77) + "..." : t;
}

function summarize(transcript: string) {
  const sentences = transcript
    .replace(/\n/g, " ")
    .split(/(?<=\.)\s+/)
    .filter((s) => s.trim().length > 20);
  return sentences.slice(0, 2).join(" ") || "Short meeting — see transcript for details.";
}
