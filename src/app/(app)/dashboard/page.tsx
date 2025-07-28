
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building2, Users, DollarSign, Home, FileText } from "lucide-react"
import type { Negocio, Task } from "@/lib/definitions";
import { isThisMonth, parseISO } from 'date-fns';
import { TaskList } from "@/components/agenda/task-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LOCAL_STORAGE_KEY = 'funilBoardData';

// In a real app, you'd fetch this from a database.
async function getInitialNegocios(): Promise<Negocio[]> {
  return [
    {
      id: "NEG-1",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-1",
      imovelTitulo: "Casa Espaçosa com Piscina",
      etapa: "Proposta",
      dataCriacao: new Date().toISOString(),
      valorProposta: 745000,
      recomendadoCliente: true,
    },
    {
      id: "NEG-2",
      clienteId: "CLIENT-2",
      clienteNome: "Jane Smith",
      imovelId: "IMOVEL-2",
      imovelTitulo: "Apartamento Moderno no Centro",
      etapa: "Visita",
      dataCriacao: "2024-07-25",
      valorProposta: 450000,
    },
    {
      id: "NEG-3",
      clienteId: "CLIENT-3",
      clienteNome: "Sam Wilson",
      imovelId: "IMOVEL-3",
      imovelTitulo: "Terreno Plano em Condomínio",
      etapa: "Contato",
      dataCriacao: "2024-07-29",
      valorProposta: 200000,
    },
     {
      id: "NEG-4",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-4",
      imovelTitulo: "Apartamento para Alugar",
      etapa: "Fechado - Ganho",
      dataCriacao: new Date().toISOString(), // Set to today for testing
      valorProposta: 1500,
    },
     {
      id: "NEG-5",
      clienteId: "CLIENT-2",
      clienteNome: "Jane Smith",
      imovelId: "IMOVEL-1",
      imovelTitulo: "Casa Espaçosa com Piscina",
      etapa: "Fechado - Perdido",
      dataCriacao: "2024-06-15",
      valorProposta: 750000,
    },
    {
      id: "NEG-6",
      clienteId: "CLIENT-3",
      clienteNome: "Sam Wilson",
      imovelId: "IMOVEL-2",
      imovelTitulo: "Apartamento Moderno no Centro",
      etapa: "Fechado - Ganho",
      dataCriacao: new Date().toISOString(), // Set to today for testing
      valorProposta: 480000,
    },
     {
      id: "NEG-7",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-5",
      imovelTitulo: "Casa Charmosa em Bairro Tranquilo",
      etapa: "Visita",
      dataCriacao: "2024-07-30",
      valorProposta: 680000,
      recomendadoCliente: true,
    },
  ];
}

async function getTasks(): Promise<Task[]> {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    { id: 'TASK-1', title: 'Follow-up com cliente John Doe', description: 'Ligar para discutir a contra-proposta.', dueDate: today.toISOString(), completed: false },
    { id: 'TASK-2', title: 'Preparar apresentação do imóvel AP002', description: 'Montar slides com fotos e detalhes.', dueDate: tomorrow.toISOString(), completed: false },
    { id: 'TASK-3', title: 'Agendar visita com Jane Smith', description: 'Entrar em contato para marcar a visita à casa CA001.', dueDate: tomorrow.toISOString(), completed: true },
    { id: 'TASK-4', title: 'Enviar documentação para o banco', description: 'Pendências do financiamento do cliente Sam Wilson.', dueDate: nextWeek.toISOString(), completed: false },
  ];
}


export default function Dashboard() {
  const [negocios, setNegocios] = React.useState<Negocio[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const loadNegocios = React.useCallback(async () => {
    try {
      const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const boardData = JSON.parse(savedData);
        // Ensure boardData is an array before calling flatMap
        if (Array.isArray(boardData)) {
            const allNegocios = boardData.flatMap((column: any) => column.negocios);
            setNegocios(allNegocios);
        } else {
             const initialNegocios = await getInitialNegocios();
             setNegocios(initialNegocios);
        }
      } else {
        const initialNegocios = await getInitialNegocios();
        setNegocios(initialNegocios);
      }
    } catch (error) {
      console.error("Failed to load data, using initial data", error);
      const initialNegocios = await getInitialNegocios();
      setNegocios(initialNegocios);
    }
  }, []);


  React.useEffect(() => {
    const fetchTasks = async () => {
        const tasksData = await getTasks();
        setTasks(tasksData);
    };
    fetchTasks();
    loadNegocios();

    // Listen for changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === LOCAL_STORAGE_KEY) {
            loadNegocios();
        }
    };
    
    window.addEventListener('storage', handleStorageChange);

    // Also listen for a custom event when the board is updated in the same tab
    const handleBoardUpdate = () => {
        loadNegocios();
    }
    window.addEventListener('funilBoardUpdated', handleBoardUpdate);


    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('funilBoardUpdated', handleBoardUpdate);
    };
  }, [loadNegocios]);

  const salesThisMonth = negocios
    .filter(n => n.etapa === 'Fechado - Ganho' && isThisMonth(parseISO(n.dataCriacao)))
    .reduce((sum, n) => sum + n.valorProposta, 0);
  
  const proposalsCount = negocios.filter(n => n.etapa === 'Proposta').length;
  const activeClientsCount = [...new Set(negocios.filter(n => n.etapa !== 'Fechado - Ganho' && n.etapa !== 'Fechado - Perdido').map(n => n.clienteId))].length;
  const availablePropertiesCount = 5; // Replace with actual property count later

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
            <CardTitle className="text-sm font-medium">Vendas no Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesThisMonth)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de negócios ganhos este mês
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <p>Feed de atividades em breve...</p>
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
            <TaskList tasks={tasks.filter(t => !t.completed).slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

    