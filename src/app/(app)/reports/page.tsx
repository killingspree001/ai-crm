import { PageHeader } from "@/components/app/PageHeader";
import { getDashboardData } from "@/lib/queries";
import { ReportsClient } from "@/components/reports/ReportsClient";

export default async function ReportsPage() {
  const { deals, stats } = await getDashboardData();
  return (
    <div>
      <PageHeader title="Reports" subtitle="Pipeline analytics, risk heatmap, and an AI-written weekly summary." />
      <div className="p-6">
        <ReportsClient deals={deals} stats={stats} />
      </div>
    </div>
  );
}
