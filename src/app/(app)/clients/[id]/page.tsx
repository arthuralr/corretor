import { User, Mail, Phone, Search, CalendarCheck, PlusCircle } from "lucide-react";
import type { Client, Task } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TaskList } from "@/components/agenda/task-list";
import { AddTaskButton } from "@/components/agenda/add-task-button";

// MOCK DATA FETCHING
async function getClient(id: string): Promise<Client | undefined> {
  const clients: Client[] = [
    { id: "CLIENT-1", name: "John Doe", email: "john.doe@example.com", phone: "555-1234", searchProfile: "Procura casa com 3 quartos e quintal." },
    { id: "CLIENT-2", name: "Jane Smith", email: "jane.smith@example.com", phone: "555-5678", searchProfile: "Quer apartamento moderno no centro, 2 quartos." },
    { id: "CLIENT-3", name: "Sam Wilson", email: "sam.wilson@example.com", phone: "555-9876", searchProfile: "Interessado em condomínios com academia e piscina." },
  ];
  return clients.find(c => c.id === id);
}

async function getTasksForClient(clientId: string): Promise<Task[]> {
  const allTasks: Task[] = [
    { id: 'TASK-1', title: 'Follow-up com cliente John Doe', description: 'Ligar para discutir a contra-proposta.', dueDate: new Date().toISOString(), completed: false, clientId: 'CLIENT-1' },
    { id: 'TASK-3', title: 'Agendar visita com Jane Smith', description: 'Entrar em contato para marcar a visita à casa CA001.', dueDate: new Date().toISOString(), completed: true, clientId: 'CLIENT-2' },
  ];
  return allTasks.filter(t => t.clientId === clientId);
}


export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id);
  const tasks = await getTasksForClient(params.id);

  if (!client) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Cliente não encontrado</h2>
        <p>O cliente que você está procurando não foi encontrado.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">{client.name}</h2>
        </div>
        <Button>Editar Cliente</Button>
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
            <AddTaskButton />
        </CardHeader>
        <CardContent>
            <TaskList tasks={tasks} />
        </CardContent>
      </Card>
    </div>
  );
}