
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
import { ChevronLeft, ChevronRight, CalendarCheck, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import type { Task } from "@/lib/definitions";
import { AddTaskButton } from "@/components/agenda/add-task-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TaskItem } from "@/components/agenda/task-item";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const TASKS_STORAGE_KEY = 'tasksData';

const getInitialTasks = (): Task[] => {
    // This is a fallback and might not be used if localStorage has data.
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
        { id: 'TASK-1', title: 'Follow-up com cliente John Doe', description: 'Ligar para discutir a contra-proposta.', dueDate: today.toISOString(), completed: false, priority: 'Alta' },
        { id: 'TASK-2', title: 'Preparar apresentação do imóvel AP002', description: 'Montar slides com fotos e detalhes.', dueDate: tomorrow.toISOString(), completed: false, priority: 'Média' },
    ];
};

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
        map.set(dateKey, [...existing, task]);
    });
    return map;
  }, [tasks]);

  const selectedDayTasks = useMemo(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDate.get(dateKey) || [];
  }, [selectedDate, tasksByDate]);


  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
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
                    {days.map(day => (
                        <div
                            key={day.toString()}
                            className={cn(
                                "border-t border-r p-2 h-24 flex flex-col items-start cursor-pointer transition-colors",
                                isSameMonth(day, currentDate) ? "bg-background" : "bg-muted/50 text-muted-foreground",
                                !isSameMonth(day, currentDate) && "pointer-events-none",
                                isSameDay(day, selectedDate) && "bg-primary/10",
                            )}
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className={cn(
                                "h-7 w-7 flex items-center justify-center rounded-full text-sm",
                                isToday(day) && "bg-primary text-primary-foreground",
                                isSameDay(day, selectedDate) && "bg-accent text-accent-foreground",
                            )}>
                                {format(day, 'd')}
                            </span>
                            {tasksByDate.has(format(day, 'yyyy-MM-dd')) && (
                                <div className="flex-grow flex items-center justify-center w-full">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-1"></div>
                                </div>
                            )}
                        </div>
                    ))}
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
                    <AddTaskButton />
                </CardHeader>
                <CardContent className="h-[60vh] overflow-y-auto">
                   {selectedDayTasks.length > 0 ? (
                        <div className="space-y-2">
                             {selectedDayTasks.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(task => (
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

