"use client";

import { useState } from "react";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scoreDeal } from "@/app/actions";

export function DealScore({ stage, health, value }: { stage: string; health: string; value: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ probability: number; reasoning: string } | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      setResult(await scoreDeal({ stage, health, value }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide">AI Deal Score</h2>
        </div>
        <Button size="sm" onClick={run} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {loading ? "Scoring..." : "Score deal"}
        </Button>
      </div>
      {result ? (
        <div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gradient-brand">{result.probability}%</span>
            <span className="mb-1 text-xs text-muted-foreground">probability to close</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${result.probability}%` }} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{result.reasoning}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Run AI scoring to estimate this deal&apos;s probability to close based on stage and health signals.
        </p>
      )}
    </div>
  );
}
