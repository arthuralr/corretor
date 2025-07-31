

"use client";

import { useState } from 'react';
import type { Task, TaskPriority, TaskCategory } from '@/lib/definitions';
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
import { ChevronDown, Trash2, User, Car, Users, Phone, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';

const TASKS_STORAGE_KEY = 'tasksData';

interface TaskItemProps {
  task: Task;
  onTaskChange: () => void;
}

const priorityConfig: Record<TaskPriority, { color: string, label: string }> = {
    'Baixa': { color: 'bg-gray-400', label: 'Prioridade Baixa' },
    'Média': { color: 'bg-yellow-500', label: 'Prioridade Média' },
    'Alta': { color: 'bg-red-500', label: 'Prioridade Alta' },
}

export const categoryConfig: Record<TaskCategory, { icon: React.ElementType, color: string, label: string }> = {
    'Visita': { icon: Car, color: 'border-blue-500', label: 'Visita' },
    'Reunião': { icon: Users, color: 'border-green-500', label: 'Reunião' },
    'Ligação': { icon: Phone, color: 'border-orange-500', label: 'Ligação' },
    'Prazo': { icon: Flag, color: 'border-red-500', label: 'Prazo' },
}

export function TaskItem({ task, onTaskChange }: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(task.completed);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const { toast } = useToast();

  const updateTasksInStorage = (updatedTasks: Task[]) => {
     try {
        window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        onTaskChange();
     } catch (error) {
        console.error("Failed to update tasks in storage", error);
        toast({ title: "Erro", description: "Falha ao atualizar tarefa.", variant: "destructive" });
     }
  }

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    const savedTasks = JSON.parse(window.localStorage.getItem(TASKS_STORAGE_KEY) || '[]');
    const updatedTasks = savedTasks.map((t: Task) => 
        t.id === task.id ? { ...t, completed: checked } : t
    );
    updateTasksInStorage(updatedTasks);
    toast({
      title: checked ? "Tarefa Concluída!" : "Tarefa Reaberta!",
      description: task.title,
    });
  };

  const handleDelete = () => {
    const savedTasks = JSON.parse(window.localStorage.getItem(TASKS_STORAGE_KEY) || '[]');
    const updatedTasks = savedTasks.filter((t: Task) => t.id !== task.id);
    updateTasksInStorage(updatedTasks);
    toast({
        title: "Tarefa Excluída",
        description: task.title,
        variant: "destructive"
    });
  };

  const dueDate = new Date(task.dueDate);
  const isOverdue = !isChecked && isPast(dueDate) && !isToday(dueDate);
  const priority = task.priority || 'Baixa';
  const category = task.category || 'Prazo';
  const currentPriorityConfig = priorityConfig[priority];
  const currentCategoryConfig = categoryConfig[category];
  const CategoryIcon = currentCategoryConfig.icon;

  return (
    <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen} asChild>
        <div id={task.id} className={cn(
            'p-4 rounded-lg border-l-4 transition-all',
            isChecked ? 'bg-muted/50 text-muted-foreground border-muted' : `bg-card ${currentCategoryConfig.color}`,
            isOverdue && 'border-destructive/50'
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id={`task-${task.id}`}
                        checked={isChecked}
                        onCheckedChange={handleCheckedChange}
                    />
                    <div>
                         <div className='flex items-center gap-2'>
                           <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                            <label
                                htmlFor={`task-${task.id}`}
                                className={cn('font-medium', isChecked && 'line-through')}
                            >
                                {task.title}
                            </label>
                        </div>
                        {(task.clientName || task.imovelTitle) && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 pl-6">
                                {task.clientId && task.clientName && (
                                    <Link href={`/clients/${task.clientId}`} className="flex items-center gap-1 hover:underline">
                                        <User className="w-3 h-3" />
                                        {task.clientName}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className={cn('w-3 h-3 rounded-full', currentPriorityConfig.color)} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{currentPriorityConfig.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="text-sm text-muted-foreground">
                        <span className={cn(isOverdue && 'text-destructive font-semibold')}>
                            {format(dueDate, "HH:mm", { locale: ptBR })}
                        </span>
                    </div>
                     <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    {task.description && (
                      <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsibleOpen && "rotate-180")} />
                          </Button>
                      </CollapsibleTrigger>
                    )}
                </div>
            </div>
            <CollapsibleContent>
                <div className="pt-4 pl-10 text-sm text-muted-foreground">
                    <p>{task.description || "Nenhuma descrição fornecida."}</p>
                     {task.imovelId && task.imovelTitle && (
                        <div className="mt-2">
                            <span className="font-semibold">Imóvel:</span>{' '}
                            <Link href={`/gestao-imoveis/${task.imovelId}`} className="hover:underline text-primary">
                                {task.imovelTitle}
                            </Link>
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </div>
    </Collapsible>
  );
}
