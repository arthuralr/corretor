
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building2, Users, DollarSign, Home, FileText, Activity, Clock, CheckCircle } from "lucide-react"
import type { Negocio, Task, Imovel, ActivityLog } from "@/lib/definitions";
import { TaskList } from "@/components/agenda/task-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getInitialNegocios, getInitialImoveis, getInitialClients, getInitialTasks } from "@/lib/initial-data";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DealsChart } from "@/components/dashboard/deals-chart";

const NEGOCIOS_STORAGE_KEY = 'funilBoardData';
const IMOVEIS_STORAGE_KEY = 'imoveisData';
const CLIENTS_STORAGE_KEY = 'clientsData';
const TASKS_STORAGE_KEY = 'tasksData';

const getRecentCompletedTasksAsActivityLog = (): ActivityLog[] => {
    try {
        const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
        if (!savedTasks) return [];
        
        const allTasks: Task[] = JSON.parse(savedTasks);
        
        const completedTasks = allTasks
            .filter(task => task.completed)
            .sort((a, b) => parseISO(b.dueDate).getTime() - parseISO(a.dueDate).getTime()) // Assuming completion date is similar to due date for sorting
            .slice(0, 5);

        return completedTasks.map(task => ({
            id: `activity-task-${task.id}`,
            type: 'negocio', // Using 'negocio' for icon consistency, can be adapted
            description: `Tarefa concluída: ${task.title}`,
            timestamp: task.dueDate, // Ideally we'd store a completion timestamp
            link: `/agenda`
        }));

    } catch (error) {
        console.error("Failed to get recent completed tasks", error);
        return [];
    }
}


export default function Dashboard() {
  const [negocios, setNegocios] = React.useState<Negocio[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [imoveis, setImoveis] = React.useState<Imovel[]>([]);
  const [activityLog, setActivityLog] = React.useState<ActivityLog[]>([]);

  const loadData = React.useCallback(async () => {
    try {
      // Load Negocios
      const savedNegocios = window.localStorage.getItem(NEGOCIOS_STORAGE_KEY);
      const initialNegocios = getInitialNegocios();
      if (savedNegocios) {
        const boardData = JSON.parse(savedNegocios);
        const allNegocios = Array.isArray(boardData) ? boardData.flatMap((column: any) => column.negocios) : initialNegocios;
        setNegocios(allNegocios);
      } else {
        setNegocios(initialNegocios);
      }

      // Load Imoveis
      const savedImoveis = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
      setImoveis(savedImoveis ? JSON.parse(savedImoveis) : getInitialImoveis());
      
      // Load Tasks
      const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
      setTasks(savedTasks ? JSON.parse(savedTasks) : getInitialTasks());

      // Load Activity Log
      setActivityLog(getRecentCompletedTasksAsActivityLog());

    } catch (error) {
      console.error("Failed to load data, using initial data", error);
      setNegocios(getInitialNegocios());
      setImoveis(getInitialImoveis());
      setTasks(getInitialTasks());
    }
  }, []);


  React.useEffect(() => {
    loadData();
    
    const handleDataUpdate = () => {
        loadData();
    }
    window.addEventListener('dataUpdated', handleDataUpdate);


    return () => {
        window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, [loadData]);

  const salesTotal = negocios
    .filter(n => n.etapa === 'Fechado - Ganho')
    .reduce((sum, n) => sum + n.valorProposta, 0);
  
  const proposalsCount = negocios.filter(n => n.etapa === 'Proposta').length;
  const activeClientsCount = [...new Set(negocios.filter(n => n.etapa !== 'Fechado - Ganho' && n.etapa !== 'Fechado - Perdido').map(n => n.clienteId))].length;
  const availablePropertiesCount = imoveis.filter(i => i.status === 'Disponível').length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas (Total)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os negócios ganhos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeClientsCount}</div>
            <p className="text-xs text-muted-foreground">
              Clientes com negócios em aberto
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios em Proposta</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total de propostas aguardando
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis Disponíveis</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availablePropertiesCount}</div>
            <p className="text-xs text-muted-foreground">
              Total de imóveis para negócio
            </p>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
            <CardTitle className="font-headline">Performance (Últimos 6 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
            <DealsChart data={negocios} />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Activity className="w-5 h-5"/> Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {activityLog.length > 0 ? (
                <div className="space-y-4">
                    {activityLog.map(log => (
                        <div key={log.id} className="flex items-start gap-4">
                           <div className="flex-shrink-0 pt-1">
                             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-green-600">
                                <CheckCircle className="h-5 w-5" />
                            </span>
                           </div>
                           <div className="flex-grow">
                                <p className="text-sm">
                                    {log.link ? <Link href={log.link} className="hover:underline">{log.description}</Link> : log.description}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3"/>
                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: ptBR })}
                                </p>
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma tarefa concluída recentemente.</p>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
           <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">Próximas Tarefas</CardTitle>
            <Link href="/agenda">
              <Button variant="outline" size="sm">Ver Agenda Completa</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <TaskList tasks={tasks.filter(t => !t.completed).slice(0, 5)} onTaskChange={loadData}/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
