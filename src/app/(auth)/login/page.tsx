"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const doLogin = async (email: string, password: string) => {
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      toast.error(res.error);
      return false;
    }
    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    await doLogin(data.get("email") as string, data.get("password") as string);
    setLoading(false);
  };

  const demoLogin = async () => {
    setDemoLoading(true);
    await doLogin("demo@cadencecrm.io", "demo");
    setDemoLoading(false);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Cadence workspace.">
      <Button
        onClick={demoLogin}
        disabled={demoLoading}
        className="h-11 w-full"
      >
        <Sparkles className="h-4 w-4" />
        {demoLoading ? "Signing in..." : "Explore the demo (one click)"}
      </Button>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          or sign in
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Email
          </Label>
          <Input id="email" name="email" type="email" defaultValue="demo@cadencecrm.io" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Password
          </Label>
          <Input id="password" name="password" type="password" defaultValue="demo" required />
        </div>
        <Button type="submit" variant="outline" disabled={loading} className="group h-11 w-full">
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
