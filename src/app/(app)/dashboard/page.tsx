
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building2, Users, DollarSign, Home, FileText, Activity, Clock, CheckCircle, UserPlus, HomeIcon } from "lucide-react"
import type { Negocio, Task, Imovel, ActivityLog, Client } from "@/lib/definitions";
import { TaskList } from "@/components/agenda/task-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DealsChart } from "@/components/dashboard/deals-chart";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const TASKS_STORAGE_KEY = 'tasksData';
const ACTIVITY_LOG_KEY = 'activityLog';

const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
        case 'negocio':
            return <CheckCircle className="h-5 w-5" />;
        case 'cliente':
            return <UserPlus className="h-5 w-5" />;
        case 'imovel':
            return <HomeIcon className="h-5 w-5" />;
        default:
            return <Activity className="h-5 w-5" />;
    }
};

const getActivityColor = (type: ActivityLog['type']) => {
    switch(type) {
        case 'negocio': return 'text-green-600';
        case 'cliente': return 'text-blue-600';
        case 'imovel': return 'text-purple-600';
        default: return 'text-gray-600';
    }
}


export default function Dashboard() {
  const [negocios, setNegocios] = React.useState<Negocio[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [imoveis, setImoveis] = React.useState<Imovel[]>([]);
  const [activityLog, setActivityLog] = React.useState<ActivityLog[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);


  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Load from Firestore
      const negociosSnapshot = await getDocs(collection(db, "negocios"));
      setNegocios(negociosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Negocio)));
      
      const imoveisSnapshot = await getDocs(collection(db, "imoveis"));
      setImoveis(imoveisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imovel)));
      
      const clientsSnapshot = await getDocs(collection(db, "clients"));
      setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));

      // Load from LocalStorage (Tasks and ActivityLog are not migrated yet)
      const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);

      const savedActivityLog = window.localStorage.getItem(ACTIVITY_LOG_KEY);
      const logQuery = query(collection(db, "activityLog"), orderBy("timestamp", "desc"), limit(7));
      const logSnapshot = await getDocs(logQuery);
      setActivityLog(logSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as ActivityLog)))

    } catch (error) {
      console.error("Failed to load data, using initial data", error);
    } finally {
      setLoading(false);
    }
  }, []);


  React.useEffect(() => {
    loadData();
    // Keep a generic dataUpdated listener in case some parts are still using it
    window.addEventListener('dataUpdated', loadData);
    return () => {
        window.removeEventListener('dataUpdated', loadData);
    };
  }, [loadData]);
  
  const salesTotal = negocios
    .filter(n => n.etapa === 'Fechado - Ganho')
    .reduce((sum, n) => {
        const commission = (n.valorProposta * (n.taxaComissao || 0)) / 100;
        return sum + commission;
    }, 0);
  
  const proposalsCount = negocios.filter(n => n.etapa === 'Proposta').length;
  
  const activeClientIds = new Set(
    negocios
      .filter(n => n.etapa !== 'Fechado - Ganho' && n.etapa !== 'Fechado - Perdido')
      .map(n => n.clienteId)
  );
  const activeClientsCount = activeClientIds.size;
  
  const availablePropertiesCount = imoveis.filter(i => i.status === 'Ativo').length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }
  
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getLogDate = (log: ActivityLog) => {
    if (!log.timestamp) return new Date();
    // Firestore Timestamps have a toDate() method, otherwise we parse it.
    if (typeof log.timestamp.toDate === 'function') {
        return log.timestamp.toDate();
    }
    return new Date(log.timestamp);
  }
  
  if (loading) {
    return (
       <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          </div>
           <Card><CardContent className="pt-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4"><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
              <Card className="col-span-3"><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
           </div>
       </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões (Ganhos)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Soma das comissões de negócios ganhos
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
                             <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-secondary ${getActivityColor(log.type)}`}>
                                {getActivityIcon(log.type)}
                            </span>
                           </div>
                           <div className="flex-grow">
                                <p className="text-sm">
                                    {log.link ? <Link href={log.link} className="hover:underline">{log.description}</Link> : log.description}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3"/>
                                    {formatDistanceToNow(getLogDate(log), { addSuffix: true, locale: ptBR })}
                                </p>
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma atividade registrada recentemente.</p>
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
            <TaskList tasks={upcomingTasks} onTaskChange={loadData}/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
