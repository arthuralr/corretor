"use client";

import { useState } from 'react';
import type { Task } from '@/lib/definitions';
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '../ui/button';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(task.completed);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const { toast } = useToast();

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    // In a real app, you would also update the task's state on the server.
    toast({
      title: checked ? "Tarefa Concluída!" : "Tarefa Reaberta!",
      description: task.title,
    });
  };

  const handleDelete = () => {
     // In a real app, you would also delete the task on the server.
    toast({
        title: "Tarefa Excluída",
        description: task.title,
        variant: "destructive"
    });
    // This is a mock. In a real app, the component would be removed upon re-fetching data.
    // For now, we can just visually hide it.
    const element = document.getElementById(task.id);
    if (element) {
        element.style.display = 'none';
    }
  };

  const dueDate = new Date(task.dueDate);
  const isOverdue = !isChecked && isPast(dueDate) && !isToday(dueDate);

  return (
    <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen} asChild>
        <div id={task.id} className={cn(
            'p-4 rounded-lg border transition-all',
            isChecked ? 'bg-muted/50 text-muted-foreground' : 'bg-card',
            isOverdue && 'border-destructive/50'
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Checkbox
                        id={`task-${task.id}`}
                        checked={isChecked}
                        onCheckedChange={handleCheckedChange}
                    />
                    <label
                        htmlFor={`task-${task.id}`}
                        className={cn('font-medium', isChecked && 'line-through')}
                    >
                        {task.title}
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        <span className={cn(isOverdue && 'text-destructive font-semibold')}>
                            {format(dueDate, "dd 'de' MMM", { locale: ptBR })}
                        </span>
                    </div>
                     <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsibleOpen && "rotate-180")} />
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </div>
            <CollapsibleContent>
                <div className="pt-4 pl-10 text-sm text-muted-foreground">
                    <p>{task.description || "Nenhuma descrição fornecida."}</p>
                </div>
            </CollapsibleContent>
        </div>
    </Collapsible>
  );
}
