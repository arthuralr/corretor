import { Briefcase, User, Home, DollarSign, Calendar, Tag, Info, CalendarCheck } from "lucide-react";
import type { Negocio, Task } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/agenda/task-list";
import { AddTaskButton } from "@/components/agenda/add-task-button";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

// MOCK DATA FETCHING
async function getNegocio(id: string): Promise<Negocio | undefined> {
  const negocios: Negocio[] = [
    { id: "NEG-1", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-1", imovelTitulo: "Casa Espaçosa com Piscina", etapa: "Proposta", dataCriacao: "2024-07-28", valorProposta: 745000 },
    { id: "NEG-2", clienteId: "CLIENT-2", clienteNome: "Jane Smith", imovelId: "IMOVEL-2", imovelTitulo: "Apartamento Moderno no Centro", etapa: "Visita", dataCriacao: "2024-07-25", valorProposta: 450000 },
  ];
  return negocios.find(n => n.id === id);
}

async function getTasksForNegocio(negocioId: string): Promise<Task[]> {
  const allTasks: Task[] = [
    { id: 'TASK-1', title: 'Follow-up com cliente John Doe', description: 'Ligar para discutir a contra-proposta.', dueDate: new Date().toISOString(), completed: false, negocioId: 'NEG-1' },
    { id: 'TASK-2', title: 'Preparar apresentação do imóvel AP002', description: 'Montar slides com fotos e detalhes.', dueDate: new Date().toISOString(), completed: false, negocioId: 'NEG-2' },
  ];
  return allTasks.filter(t => t.negocioId === negocioId);
}


export default async function NegocioDetailPage({ params }: { params: { id: string } }) {
  const negocio = await getNegocio(params.id);
  const tasks = await getTasksForNegocio(params.id);

   const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  if (!negocio) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Negócio não encontrado</h2>
        <p>O negócio que você está procurando não foi encontrado.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-accent" />
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">{negocio.imovelTitulo}</h2>
                <p className="text-muted-foreground">Oportunidade com {negocio.clienteNome}</p>
            </div>
        </div>
        <Button>Editar Negócio</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Info className="w-5 h-5"/> Detalhes do Negócio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <Badge variant="secondary">{negocio.etapa}</Badge>
            </div>
             <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span>{formatPrice(negocio.valorProposta)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>Criado em: {format(parseISO(negocio.dataCriacao), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <Link href={`/clients/${negocio.clienteId}`} className="hover:underline text-primary">
                        {negocio.clienteNome}
                    </Link>
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-muted-foreground" />
                    <Link href={`/imoveis/${negocio.imovelId}`} className="hover:underline text-primary">
                        {negocio.imovelTitulo}
                    </Link>
                </div>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-lg">Tarefas Associadas</CardTitle>
                <CardDescription>Todas as tarefas relacionadas a este negócio.</CardDescription>
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