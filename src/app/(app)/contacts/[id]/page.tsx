import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Building2, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContactById, getDeals, getRecentActivity } from "@/lib/queries";
import { HEALTH_META } from "@/lib/constants";
import { initials, formatCurrency } from "@/lib/utils";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, deals, activity] = await Promise.all([
    getContactById(id),
    getDeals(),
    getRecentActivity(),
  ]);
  if (!contact) notFound();

  const contactDeals = deals.filter((d) => d.contact?.id === id);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/contacts" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to contacts
      </Link>

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-xl font-bold text-white">
          {initials(contact.name)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{contact.name}</h1>
          <p className="text-sm text-muted-foreground">
            {contact.title}
            {contact.company ? ` · ${contact.company}` : ""}
          </p>
          {contact.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {contact.tags.map((t) => (
                <Badge key={t} variant="neutral">{t}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {contact.notes && (
            <Card className="p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">Notes</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{contact.notes}</p>
            </Card>
          )}

          <Card>
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Deals ({contactDeals.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {contactDeals.map((d) => (
                <Link key={d.id} href={`/deals/${d.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-accent/40">
                  <div>
                    <div className="text-sm font-medium">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(d.value)}</div>
                  </div>
                  <Badge variant={HEALTH_META[d.health].variant}>{HEALTH_META[d.health].label}</Badge>
                </Link>
              ))}
              {contactDeals.length === 0 && (
                <div className="px-5 py-6 text-sm text-muted-foreground">No deals yet.</div>
              )}
            </div>
          </Card>

          <Card>
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Recent Activity</h2>
            </div>
            <div className="space-y-4 p-5">
              {activity.slice(0, 4).map((a) => (
                <div key={a.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm leading-snug">{a.content}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{a.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Contact</h2>
          {contact.email && <Row icon={Mail} value={contact.email} />}
          {contact.phone && <Row icon={Phone} value={contact.phone} />}
          {contact.company && <Row icon={Building2} value={contact.company} />}
          {contact.title && <Row icon={Briefcase} value={contact.title} />}
        </Card>
      </div>
    </div>
  );
}

function Row({ icon: Icon, value }: { icon: React.ComponentType<{ className?: string }>; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <span className="truncate text-sm">{value}</span>
    </div>
  );
}
