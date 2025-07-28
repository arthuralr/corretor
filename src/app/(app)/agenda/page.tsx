"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarCheck } from "lucide-react";
import type { Task } from "@/lib/definitions";
import { TaskList } from "@/components/agenda/task-list";
import { AddTaskButton } from "@/components/agenda/add-task-button";

const TASKS_STORAGE_KEY = 'tasksData';

const getInitialTasks = (): Task[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    return [
        { id: 'TASK-1', title: 'Follow-up com cliente John Doe', description: 'Ligar para discutir a contra-proposta.', dueDate: today.toISOString(), completed: false },
        { id: 'TASK-2', title: 'Preparar apresentação do imóvel AP002', description: 'Montar slides com fotos e detalhes.', dueDate: tomorrow.toISOString(), completed: false },
        { id: 'TASK-3', title: 'Agendar visita com Jane Smith', description: 'Entrar em contato para marcar a visita à casa CA001.', dueDate: tomorrow.toISOString(), completed: true },
        { id: 'TASK-4', title: 'Enviar documentação para o banco', description: 'Pendências do financiamento do cliente Sam Wilson.', dueDate: nextWeek.toISOString(), completed: false },
        { id: 'TASK-5', title: 'Revisar contrato de aluguel', description: 'Verificar cláusulas do contrato do imóvel AP004.', dueDate: lastWeek.toISOString(), completed: true },
        { id: 'TASK-6', title: 'Ligar para o proprietário da CA005', description: 'Confirmar o valor do condomínio.', dueDate: today.toISOString(), completed: false },
    ];
};

export default function AgendaPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(() => {
    try {
      const savedData = window.localStorage.getItem(TASKS_STORAGE_KEY);
      if (savedData) {
        const parsedTasks = JSON.parse(savedData);
        setTasks(parsedTasks.sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      } else {
        const initialData = getInitialTasks();
        setTasks(initialData.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold tracking-tight font-headline">Minha Agenda</h2>
        </div>
        <AddTaskButton />
      </div>
      <p className="text-muted-foreground">
        Gerencie suas tarefas e mantenha seu dia organizado.
      </p>
      <div className="mt-6">
        <TaskList tasks={tasks} onTaskChange={loadTasks} />
      </div>
    </div>
  );
}
