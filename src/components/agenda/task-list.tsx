import type { Task } from '@/lib/definitions';
import { TaskItem } from './task-item';

interface TaskListProps {
  tasks: Task[];
  onTaskChange: () => void;
}

export function TaskList({ tasks, onTaskChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 rounded-lg border border-dashed text-muted-foreground">
        Nenhuma tarefa encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onTaskChange={onTaskChange} />
      ))}
    </div>
  );
}
