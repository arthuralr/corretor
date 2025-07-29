
'use client'

import React, { useState, useEffect, useCallback } from "react";
import { User, Mail, Phone, Search, Edit } from "lucide-react";
import type { Client, Task } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TaskList } from "@/components/agenda/task-list";
import { AddTaskButton } from "@/components/agenda/add-task-button";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitialClients, getInitialTasks } from "@/lib/initial-data";
import { ClientEditModal } from "@/components/clients/client-edit-modal";

const CLIENTS_STORAGE_KEY = 'clientsData';
const TASKS_STORAGE_KEY = 'tasksData';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id: clientId } = params;

  const loadData = useCallback(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch Client
      const savedClients = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
      const allClients = savedClients ? JSON.parse(savedClients) : getInitialClients();
      const foundClient = allClients.find((c: Client) => c.id === clientId);
      setClient(foundClient || null);


      // Fetch Tasks for Client
      const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
      const allTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : getInitialTasks();
      const clientTasks = allTasks.filter(t => t.clientId === clientId);
      setTasks(clientTasks);
      
    } catch (error) {
      console.error("Failed to load client data", error);
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadData();
    window.addEventListener('dataUpdated', loadData);
    return () => {
        window.removeEventListener('dataUpdated', loadData);
    };
  }, [loadData]);
  
  if (loading) {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                 <Skeleton className="h-10 w-1/2" />
                 <Skeleton className="h-10 w-24" />
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
                <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
             </div>
             <Card><CardHeader><Skeleton className="h-32 w-full" /></CardHeader></Card>
        </div>
    )
  }

  if (!client) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Cliente não encontrado</h2>
        <p>O cliente que você está procurando não foi encontrado.</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">{client.name}</h2>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2"/>
            Editar Cliente
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Perfil de Busca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <Search className="w-5 h-5 mt-1 text-muted-foreground" />
              <p className="text-muted-foreground">{client.searchProfile || "Nenhum perfil de busca definido."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-lg">Tarefas Associadas</CardTitle>
                <CardDescription>Todas as tarefas relacionadas a {client.name}.</CardDescription>
            </div>
            <AddTaskButton preselectedClientId={client.id} />
        </CardHeader>
        <CardContent>
            <TaskList tasks={tasks} onTaskChange={loadData} />
        </CardContent>
      </Card>
    </div>
    <ClientEditModal 
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        client={client}
    />
    </>
  );
}
