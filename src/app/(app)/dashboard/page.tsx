
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building2, Users, DollarSign, Home, FileText } from "lucide-react"
import type { Negocio, Task, Imovel } from "@/lib/definitions";
import { isThisMonth, parseISO } from 'date-fns';
import { TaskList } from "@/components/agenda/task-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NEGOCIOS_STORAGE_KEY = 'funilBoardData';
const IMOVEIS_STORAGE_KEY = 'imoveisData';

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

const getInitialImoveis = (): Imovel[] => {
  return [
    {
      id: "IMOVEL-1",
      refCode: "CA001",
      title: "Casa Espaçosa com Piscina",
      description: "Uma bela casa com 3 quartos, 2 banheiros e uma grande área de lazer com piscina.",
      type: "Casa",
      price: 750000,
      bedrooms: 3,
      bathrooms: 2,
      status: "Disponível",
    },
    {
      id: "IMOVEL-2",
      refCode: "AP002",
      title: "Apartamento Moderno no Centro",
      description: "Apartamento de 2 quartos totalmente reformado no coração da cidade.",
      type: "Apartamento",
      price: 450000,
      bedrooms: 2,
      bathrooms: 1,
      status: "Vendido",
    },
    {
      id: "IMOVEL-3",
      refCode: "TE003",
      title: "Terreno Plano em Condomínio",
      description: "Excelente terreno para construir a casa dos seus sonhos em condomínio fechado.",
      type: "Terreno",
      price: 200000,
      bedrooms: 0,
      bathrooms: 0,
      status: "Disponível",
    },
     {
      id: "IMOVEL-4",
      refCode: "AP004",
      title: "Apartamento para Alugar",
      description: "Apartamento com 1 quarto, mobiliado, pronto para morar.",
      type: "Apartamento",
      price: 1500,
      bedrooms: 1,
      bathrooms: 1,
      status: "Alugado",
    },
  ];
};

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
  const [imoveis, setImoveis] = React.useState<Imovel[]>([]);

  const loadData = React.useCallback(async () => {
    try {
      // Load Negocios
      const savedNegocios = window.localStorage.getItem(NEGOCIOS_STORAGE_KEY);
      if (savedNegocios) {
        const boardData = JSON.parse(savedNegocios);
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

      // Load Imoveis
      const savedImoveis = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
       if (savedImoveis) {
        setImoveis(JSON.parse(savedImoveis));
      } else {
        const initialImoveis = getInitialImoveis();
        setImoveis(initialImoveis);
        window.localStorage.setItem(IMOVEIS_STORAGE_KEY, JSON.stringify(initialImoveis));
      }

    } catch (error) {
      console.error("Failed to load data, using initial data", error);
      const initialNegocios = await getInitialNegocios();
      setNegocios(initialNegocios);
      const initialImoveis = getInitialImoveis();
      setImoveis(initialImoveis);
    }
  }, []);


  React.useEffect(() => {
    const fetchTasks = async () => {
        const tasksData = await getTasks();
        setTasks(tasksData);
    };
    fetchTasks();
    loadData();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === NEGOCIOS_STORAGE_KEY || event.key === IMOVEIS_STORAGE_KEY) {
            loadData();
        }
    };
    
    window.addEventListener('storage', handleStorageChange);

    const handleDataUpdate = () => {
        loadData();
    }
    window.addEventListener('funilBoardUpdated', handleDataUpdate);
    window.addEventListener('imoveisUpdated', handleDataUpdate);


    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('funilBoardUpdated', handleDataUpdate);
        window.removeEventListener('imoveisUpdated', handleDataUpdate);
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

    