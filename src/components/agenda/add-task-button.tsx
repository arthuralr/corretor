"use client";

import { useState } from 'react';
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
import type { Client, Negocio } from '@/lib/definitions';

// Mock data fetching, replace with your actual data fetching logic
const getClients = async (): Promise<Client[]> => [
  { id: 'CLIENT-1', name: 'John Doe', email: '', phone: '', searchProfile: '' },
  { id: 'CLIENT-2', name: 'Jane Smith', email: '', phone: '', searchProfile: '' },
  { id: 'CLIENT-3', name: 'Sam Wilson', email: '', phone: '', searchProfile: '' },
];
const getNegocios = async (): Promise<Negocio[]> => [
    { id: 'NEG-1', clienteId: 'CLIENT-1', clienteNome: 'John Doe', imovelId: 'IMOVEL-1', imovelTitulo: 'Casa Espaçosa com Piscina', etapa: 'Proposta', dataCriacao: '2024-07-28', valorProposta: 745000, recomendadoCliente: true },
    { id: 'NEG-2', clienteId: 'CLIENT-2', clienteNome: 'Jane Smith', imovelId: 'IMOVEL-2', imovelTitulo: 'Apartamento Moderno no Centro', etapa: 'Visita', dataCriacao: '2024-07-25', valorProposta: 450000 },
];


export function AddTaskButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);

  const handleOpen = async () => {
    // Fetch data when the dialog is about to open
    const clientData = await getClients();
    const negocioData = await getNegocios();
    setClients(clientData);
    setNegocios(negocioData);
    setIsOpen(true);
  };

  const handleTaskSave = (values: any) => {
    console.log("Task saved:", values);
    setIsOpen(false);
    // Here you would typically revalidate the data to show the new task
  };

  return (
    <>
      <Button onClick={handleOpen}>
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tarefa
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua nova tarefa. Você pode associá-la a um cliente ou a um negócio.
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            onSave={handleTaskSave} 
            onCancel={() => setIsOpen(false)}
            clients={clients}
            negocios={negocios}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
