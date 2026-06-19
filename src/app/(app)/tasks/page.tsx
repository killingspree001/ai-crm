import { PageHeader } from "@/components/app/PageHeader";
import { getTasks } from "@/lib/queries";
import { TaskList } from "@/components/tasks/TaskList";

export default async function TasksPage() {
  const tasks = await getTasks();
  return (
    <div>
      <PageHeader title="Tasks" subtitle="Action items across your deals — including ones AI pulled from meetings." />
      <div className="p-6">
        <TaskList initialTasks={tasks} />
      </div>
    </div>
  );
}
