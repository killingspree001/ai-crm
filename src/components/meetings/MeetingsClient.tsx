"use client";

import { useState } from "react";
import { Sparkles, FileText, Wand2, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { processTranscript, draftEmail } from "@/app/actions";
import { toast } from "sonner";
import type { MeetingView } from "@/lib/types";
import type { ExtractionResult } from "@/lib/ai";

const SAMPLE = `Marco: Thanks for joining, Sofia. Could you walk me through your current workflow?
Sofia: Sure. Right now the team juggles three tools. The big thing for us is security — we need SOC2 and SSO before we can commit.
Marco: Understood. I'll send over our SOC2 report this week.
Sofia: Great. If security checks out, we'd want to start with about 40 seats in Q3.
Marco: Perfect, I'll prepare a rollout plan and follow up with pricing for 40 seats.
Sofia: Let's schedule a follow-up call next week to review.`;

export function MeetingsClient({ meetings }: { meetings: MeetingView[] }) {
  const [transcript, setTranscript] = useState(SAMPLE);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);

  const run = async () => {
    if (!transcript.trim()) return toast.error("Paste a transcript first");
    setProcessing(true);
    setResult(null);
    setEmail(null);
    try {
      const r = await processTranscript(transcript);
      setResult(r);
      toast.success("Transcript processed");
    } finally {
      setProcessing(false);
    }
  };

  const makeEmail = async () => {
    if (!result) return;
    setDrafting(true);
    try {
      const { text } = await draftEmail("Sofia Marin", result.summary);
      setEmail(text);
    } finally {
      setDrafting(false);
    }
  };

  const sentimentVariant =
    result?.sentiment === "positive" ? "healthy" : result?.sentiment === "negative" ? "stalled" : "risk";

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Past meetings */}
      <div className="space-y-3 lg:col-span-1">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent</h2>
        {meetings.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setTranscript(m.transcript);
              setResult(null);
              setEmail(null);
            }}
            className="block w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate text-sm font-medium">{m.title}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{m.occurredAt}</span>
              {m.processed ? (
                <Badge variant="healthy">Processed</Badge>
              ) : (
                <Badge variant="neutral">New</Badge>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Transcript + result */}
      <div className="space-y-6 lg:col-span-4">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">Transcript</h2>
            </div>
            <Button onClick={run} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {processing ? "Analyzing..." : "Extract with AI"}
            </Button>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={9}
            className="scroll-slim w-full resize-none rounded-lg border border-border bg-background/40 p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </Card>

        {processing && (
          <Card className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            AI is reading the transcript and pulling out action items...
          </Card>
        )}

        {result && (
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-5 py-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-wide">AI Extraction</span>
              <Badge variant={sentimentVariant} className="ml-auto">
                {result.sentiment}
              </Badge>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <h3 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Summary
                </h3>
                <p className="text-sm leading-relaxed">{result.summary}</p>
              </div>

              <div>
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Action items ({result.tasks.length})
                </h3>
                <div className="space-y-2">
                  {result.tasks.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span className="flex-1 text-sm">{t.title}</span>
                      <span className="hidden text-xs text-muted-foreground sm:block">{t.owner}</span>
                      <span className="text-xs text-muted-foreground">· {t.due}</span>
                      <Badge
                        variant={t.priority === "HIGH" ? "stalled" : t.priority === "MEDIUM" ? "risk" : "neutral"}
                      >
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <Button variant="outline" onClick={makeEmail} disabled={drafting}>
                  {drafting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  Draft follow-up email
                </Button>
                <span className="text-xs text-muted-foreground">
                  Action items can be saved as tasks when a database is connected.
                </span>
              </div>

              {email && (
                <div className="rounded-lg border border-border bg-background/40 p-4">
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Generated email
                  </h3>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{email}</pre>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
