
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TaskForm } from './task-form';
import { PlusCircle } from 'lucide-react';
import type { Client, Negocio, Task, Imovel } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { getInitialClients, getInitialImoveis } from '@/lib/initial-data';

const CLIENTS_STORAGE_KEY = 'clientsData';
const NEGOCIOS_STORAGE_KEY = 'funilBoardData';
const TASKS_STORAGE_KEY = 'tasksData';
const IMOVEIS_STORAGE_KEY = 'imoveisData';

interface AddTaskButtonProps {
    preselectedClientId?: string;
    preselectedNegocioId?: string;
    preselectedImovelId?: string;
    preselectedDate?: Date;
}

export function AddTaskButton({ preselectedClientId, preselectedNegocioId, preselectedImovelId, preselectedDate }: AddTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      try {
        const savedClients = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
        setClients(savedClients ? JSON.parse(savedClients) : getInitialClients());

        const savedNegocios = window.localStorage.getItem(NEGOCIOS_STORAGE_KEY);
        if (savedNegocios) {
          const boardData = JSON.parse(savedNegocios);
          const allNegocios = boardData.flatMap((column: any) => column.negocios);
          setNegocios(allNegocios);
        }

        const savedImoveis = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
        setImoveis(savedImoveis ? JSON.parse(savedImoveis) : getInitialImoveis());
        
      } catch (error) {
        console.error("Failed to load data for task form", error);
      }
    }
  }, [isOpen]);

  const handleTaskSave = (values: any) => {
    try {
        const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
        const tasks: Task[] = savedTasks ? JSON.parse(savedTasks) : [];
        
        const selectedClient = clients.find(c => c.id === values.clientId);
        const selectedNegocio = negocios.find(n => n.id === values.negocioId);
        const selectedImovel = imoveis.find(i => i.id === values.imovelId);

        const newTask: Task = {
            id: `TASK-${Date.now()}`,
            title: values.title,
            description: values.description || '',
            dueDate: values.dueDate.toISOString(),
            completed: false,
            clientId: values.clientId,
            clientName: selectedClient?.name,
            negocioId: values.negocioId,
            negocioTitle: selectedNegocio?.imovelTitulo,
            imovelId: selectedNegocio?.imovelId,
            imovelTitle: selectedImovel?.title,
            priority: values.priority || 'Baixa',
        };

        tasks.push(newTask);
        window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

        toast({
            title: "Tarefa Salva!",
            description: "Sua nova tarefa foi adicionada com sucesso.",
        });
        
        window.dispatchEvent(new CustomEvent('dataUpdated'));
        setIsOpen(false);
    } catch (error) {
        console.error("Failed to save task", error);
        toast({
            title: "Erro",
            description: "Não foi possível salvar a tarefa.",
            variant: "destructive"
        })
    }
  };
  
  const initialData = {
      clientId: preselectedClientId,
      negocioId: preselectedNegocioId,
      dueDate: preselectedDate,
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tarefa
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua nova tarefa.
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            onSave={handleTaskSave} 
            onCancel={() => setIsOpen(false)}
            clients={clients}
            negocios={negocios}
            initialData={initialData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
