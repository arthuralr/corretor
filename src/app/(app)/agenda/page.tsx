
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarCheck, PlusCircle, Calendar as CalendarIcon, Flag, Car, Users, Phone } from "lucide-react";
import type { Task, TaskCategory, TaskPriority } from "@/lib/definitions";
import { AddTaskButton } from "@/components/agenda/add-task-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TaskItem, categoryConfig } from "@/components/agenda/task-item";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getInitialTasks } from "@/lib/initial-data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TASKS_STORAGE_KEY = 'tasksData';

const priorityConfig: Record<TaskPriority, { color: string, label: string }> = {
    'Baixa': { color: 'bg-gray-400', label: 'Prioridade Baixa' },
    'Média': { color: 'bg-yellow-500', label: 'Prioridade Média' },
    'Alta': { color: 'bg-red-500', label: 'Prioridade Alta' },
}

export default function AgendaPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadTasks = useCallback(() => {
    try {
      const savedData = window.localStorage.getItem(TASKS_STORAGE_KEY);
      if (savedData) {
        setTasks(JSON.parse(savedData));
      } else {
        const initialData = getInitialTasks();
        setTasks(initialData);
        window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error("Failed to load tasks", error);
      setTasks(getInitialTasks());
    }
  }, []);

  useEffect(() => {
    loadTasks();
    window.addEventListener('dataUpdated', loadTasks);
    return () => {
      window.removeEventListener('dataUpdated', loadTasks);
    };
  }, [loadTasks]);

  const start = startOfWeek(startOfMonth(currentDate), { locale: ptBR });
  const end = endOfWeek(endOfMonth(currentDate), { locale: ptBR });
  const days = eachDayOfInterval({ start, end });
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, task].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    });
    return map;
  }, [tasks]);

  const selectedDayTasks = useMemo(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDate.get(dateKey) || [];
  }, [selectedDate, tasksByDate]);


  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const getTasksForDay = (day: Date): Task[] => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return tasksByDate.get(dateKey) || [];
  }

  const renderTaskPreview = (task: Task) => {
    const CategoryIcon = categoryConfig[task.category || 'Prazo'].icon;
    const TaskPriority = priorityConfig[task.priority || 'Baixa'];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 w-full bg-secondary/50 hover:bg-secondary p-1 rounded-sm text-xs truncate">
                        <CategoryIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate flex-1">{task.title}</span>
                        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', TaskPriority.color)}></div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{task.title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold tracking-tight font-headline">Minha Agenda</h2>
        </div>
      </div>
       <p className="text-muted-foreground">
        Gerencie suas tarefas e compromissos em uma visualização de calendário.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Left Column: Calendar */}
        <div className="lg:col-span-2">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline capitalize text-xl">
                    {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground border-b">
                    {daysOfWeek.map(day => (
                        <div key={day} className="py-2">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days.map(day => {
                        const dayTasks = getTasksForDay(day);
                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "border-t border-r p-1 h-28 flex flex-col items-start cursor-pointer transition-colors group",
                                    isSameMonth(day, currentDate) ? "bg-background hover:bg-muted/50" : "bg-muted/50 text-muted-foreground",
                                    !isSameMonth(day, currentDate) && "pointer-events-none",
                                    isSameDay(day, selectedDate) && "bg-primary/10",
                                )}
                                onClick={() => setSelectedDate(day)}
                            >
                                <span className={cn(
                                    "h-7 w-7 flex items-center justify-center rounded-full text-sm mb-1",
                                    isToday(day) && "bg-primary text-primary-foreground",
                                    isSameDay(day, selectedDate) && "bg-accent text-accent-foreground",
                                )}>
                                    {format(day, 'd')}
                                </span>
                                <div className="space-y-1 w-full overflow-hidden">
                                     {dayTasks.slice(0, 2).map(task => (
                                        <div key={task.id}>
                                           {renderTaskPreview(task)}
                                        </div>
                                    ))}
                                     {dayTasks.length > 2 && (
                                        <p className="text-xs text-muted-foreground pl-1">+ {dayTasks.length - 2} mais</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Column: Appointments */}
        <div className="lg:col-span-1">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-xl">
                            Compromissos do Dia
                        </CardTitle>
                        <CardDescription>
                            {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </CardDescription>
                    </div>
                    <AddTaskButton preselectedDate={selectedDate} />
                </CardHeader>
                <CardContent className="h-[60vh] overflow-y-auto">
                   {selectedDayTasks.length > 0 ? (
                        <div className="space-y-2">
                             {selectedDayTasks.map(task => (
                                <TaskItem key={task.id} task={task} onTaskChange={loadTasks} />
                            ))}
                        </div>
                   ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <CalendarCheck className="h-10 w-10 mb-4" />
                        <p className="font-semibold">Nenhum compromisso.</p>
                        <p className="text-sm">Não há tarefas agendadas para este dia.</p>
                    </div>
                   )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
