
"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Cake, ClipboardList, AlertTriangle, Briefcase, CalendarCheck } from "lucide-react";
import type { Lead, Client, Task, Negocio, Notification, NotificationType } from "@/lib/definitions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { isToday, isPast, parseISO, differenceInDays } from 'date-fns';
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const LEADS_STORAGE_KEY = 'leadsData';
const TASKS_STORAGE_KEY = 'tasksData';

const ICONS: Record<NotificationType, React.ElementType> = {
    lead: ClipboardList,
    aniversario: Cake,
    tarefa_hoje: CalendarCheck,
    tarefa_atrasada: AlertTriangle,
    negocio: Briefcase,
};

const getNotifications = async (): Promise<Notification[]> => {
    const notifications: Notification[] = [];
    const today = new Date();

    // 1. New Leads (last 2 days)
    try {
        const savedLeads = window.localStorage.getItem(LEADS_STORAGE_KEY);
        const leads: Lead[] = savedLeads ? JSON.parse(savedLeads) : [];
        leads.forEach(lead => {
            const leadDate = parseISO(lead.createdAt);
            if (differenceInDays(today, leadDate) <= 2) {
                notifications.push({
                    id: `notif-lead-${lead.id}`,
                    type: 'lead',
                    title: "Novo Lead Recebido",
                    description: `${lead.name} mostrou interesse em ${lead.interest}.`,
                    link: '/leads',
                    createdAt: lead.createdAt
                });
            }
        });
    } catch (e) { console.error(e)}

    // 2. Birthdays
    try {
        const clientsSnapshot = await getDocs(collection(db, "clients"));
        const clients = clientsSnapshot.docs.map(doc => doc.data() as Client);
        clients.forEach(client => {
            if (client.birthDate) {
                const birthDate = parseISO(client.birthDate);
                if (birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth()) {
                    notifications.push({
                        id: `notif-bday-${client.id}`,
                        type: 'aniversario',
                        title: "Aniversário de Cliente!",
                        description: `Hoje é o aniversário de ${client.name}.`,
                        link: `/clients/${client.id}`,
                        createdAt: today.toISOString()
                    });
                }
            }
        });
    } catch(e) { console.error(e)}

    // 3. Tasks for today & overdue tasks
    try {
        const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
        const tasks: Task[] = savedTasks ? JSON.parse(savedTasks) : [];
        tasks.filter(t => !t.completed).forEach(task => {
            const dueDate = parseISO(task.dueDate);
            if (isToday(dueDate)) {
                notifications.push({
                    id: `notif-task-today-${task.id}`,
                    type: 'tarefa_hoje',
                    title: "Tarefa para Hoje",
                    description: task.title,
                    link: '/agenda',
                    createdAt: task.dueDate
                });
            } else if (isPast(dueDate)) {
                 notifications.push({
                    id: `notif-task-overdue-${task.id}`,
                    type: 'tarefa_atrasada',
                    title: "Tarefa Atrasada",
                    description: task.title,
                    link: '/agenda',
                    createdAt: task.dueDate
                });
            }
        });
    } catch(e) { console.error(e)}
    
    // 4. New Deals (last 2 days)
    try {
        const q = query(collection(db, "negocios"), orderBy("dataCriacao", "desc"));
        const negociosSnapshot = await getDocs(q);
        const negocios = negociosSnapshot.docs.map(doc => doc.data() as Negocio);
        negocios.forEach(negocio => {
            const dealDate = parseISO(negocio.dataCriacao);
             if (differenceInDays(today, dealDate) <= 2) {
                notifications.push({
                    id: `notif-negocio-${negocio.id}`,
                    type: 'negocio',
                    title: "Novo Negócio no Funil",
                    description: `Oportunidade para ${negocio.imovelTitulo} com ${negocio.clienteNome}.`,
                    link: `/negocios/${negocio.id}`,
                    createdAt: negocio.dataCriacao
                });
            }
        });
    } catch(e) { console.error(e) }


    return notifications.sort((a,b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    const notifs = await getNotifications();
    setNotifications(notifs);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
        loadNotifications();
    }
  }, [isOpen, loadNotifications]);
  
  useEffect(() => {
    loadNotifications();
    window.addEventListener('dataUpdated', loadNotifications);
    return () => window.removeEventListener('dataUpdated', loadNotifications);
  },[loadNotifications])

  const NotificationItem = ({ notification }: {notification: Notification}) => {
    const Icon = ICONS[notification.type];
    const item = (
         <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-md">
            <div className="flex-shrink-0 pt-1">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
                <p className="font-semibold text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
            </div>
        </div>
    )

    if (notification.link) {
        return <Link href={notification.link} className="block" onClick={() => setIsOpen(false)}>{item}</Link>
    }
    return item;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
             <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">
                {notifications.length}
             </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
            <h3 className="font-medium">Notificações</h3>
        </div>
        <ScrollArea className="h-96">
            {loading && <p className="p-4 text-center text-sm text-muted-foreground">Carregando...</p>}
            {!loading && notifications.length > 0 ? (
                <div className="divide-y">
                    {notifications.map(notif => (
                        <NotificationItem key={notif.id} notification={notif}/>
                    ))}
                </div>
            ): (
                <p className="p-4 text-center text-sm text-muted-foreground">Nenhuma notificação nova.</p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
