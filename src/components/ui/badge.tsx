import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary",
        neutral: "bg-muted text-muted-foreground",
        healthy: "bg-[var(--healthy)]/15 text-[var(--healthy)]",
        risk: "bg-[var(--risk)]/15 text-[var(--risk)]",
        stalled: "bg-[var(--stalled)]/15 text-[var(--stalled)]",
        outline: "border border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
