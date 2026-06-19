import { PageHeader } from "@/components/app/PageHeader";
import { getMeetings } from "@/lib/queries";
import { MeetingsClient } from "@/components/meetings/MeetingsClient";

export default async function MeetingsPage() {
  const meetings = await getMeetings();
  return (
    <div>
      <PageHeader
        title="Meetings"
        subtitle="Paste a transcript and let AI extract the summary, action items, and next steps."
      />
      <div className="p-6">
        <MeetingsClient meetings={meetings} />
      </div>
    </div>
  );
}
