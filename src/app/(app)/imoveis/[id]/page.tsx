import React from "react";
import { Home, Tag, DollarSign, BedDouble, Bath, CheckSquare, XSquare, Info, CalendarCheck, Image as ImageIcon, Edit } from "lucide-react";
import type { Imovel, Task } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/agenda/task-list";
import { AddTaskButton } from "@/components/agenda/add-task-button";
import Image from "next/image";
import Link from "next/link";

// MOCK DATA FETCHING
async function getImovel(id: string): Promise<Imovel | undefined> {
  // In a real app, you would fetch from a database, but for now we read from localStorage
   if (typeof window !== 'undefined') {
    const savedImoveis = window.localStorage.getItem('imoveisData');
    if (savedImoveis) {
      const imoveis: Imovel[] = JSON.parse(savedImoveis);
      return imoveis.find(i => i.id === id);
    }
  }
  // Fallback to initial data if localStorage is not available or empty
  const imoveis: Imovel[] = [
    { id: "IMOVEL-1", refCode: "CA001", title: "Casa Espaçosa com Piscina", description: "Uma bela casa com 3 quartos, 2 banheiros e uma grande área de lazer com piscina.", type: "Casa", price: 750000, bedrooms: 3, bathrooms: 2, status: "Disponível", imageUrl: "https://placehold.co/600x400.png" },
    { id: "IMOVEL-2", refCode: "AP002", title: "Apartamento Moderno no Centro", description: "Apartamento de 2 quartos totalmente reformado no coração da cidade.", type: "Apartamento", price: 450000, bedrooms: 2, bathrooms: 1, status: "Vendido", imageUrl: "https://placehold.co/600x400.png" },
    { id: "IMOVEL-3", refCode: "TE003", title: "Terreno Plano em Condomínio", description: "Excelente terreno para construir a casa dos seus sonhos em condomínio fechado.", type: "Terreno", price: 200000, bedrooms: 0, bathrooms: 0, status: "Disponível" },
    { id: "IMOVEL-4", refCode: "AP004", title: "Apartamento para Alugar", description: "Apartamento com 1 quarto, mobiliado, pronto para morar.", type: "Apartamento", price: 1500, bedrooms: 1, bathrooms: 1, status: "Alugado" },
    { id: "IMOVEL-5", refCode: "CA005", title: "Casa Charmosa em Bairro Tranquilo", description: "Casa com 3 quartos, jardim de inverno e edícula. Perfeita para famílias que buscam sossego.", type: "Casa", price: 680000, bedrooms: 3, bathrooms: 2, status: "Disponível", imageUrl: "https://placehold.co/600x400.png"}
  ];
  return imoveis.find(i => i.id === id);
}

async function getTasksForImovel(imovelId: string): Promise<Task[]> {
    // This is mock data. In a real app, you would filter tasks by imovelId if it was linked.
    // For now, let's pretend no tasks are directly linked to properties, only through deals.
    return [];
}


export default async function ImovelDetailPage({ params }: { params: { id: string } }) {
  const imovel = await getImovel(params.id);
  const tasks = await getTasksForImovel(params.id);

   const formatPrice = (price: number, status: Imovel['status']) => {
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
    return status === 'Alugado' ? `${formattedPrice}/mês` : formattedPrice;
  }
  
  const statusConfig = {
    'Disponível': { icon: CheckSquare, color: 'text-green-600' },
    'Vendido': { icon: XSquare, color: 'text-red-600' },
    'Alugado': { icon: XSquare, color: 'text-red-600' }
  }

  if (!imovel) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Imóvel não encontrado</h2>
        <p>O imóvel que você está procurando não foi encontrado.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-accent" />
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">{imovel.title}</h2>
                <p className="text-muted-foreground">Ref: {imovel.refCode}</p>
            </div>
        </div>
        <Link href={`/imoveis/${imovel.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" /> Editar Imóvel
          </Button>
        </Link>
      </div>
      
      {imovel.imageUrl && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Imagem do Imóvel</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-video">
                    <Image src={imovel.imageUrl} alt={imovel.title} fill className="rounded-lg object-cover" />
                </div>
            </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Info className="w-5 h-5"/> Detalhes do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
             <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <Badge variant="secondary">{imovel.type}</Badge>
            </div>
            <div className="flex items-center gap-3">
              {React.createElement(statusConfig[imovel.status].icon, { className: `w-5 h-5 ${statusConfig[imovel.status].color}` })}
              <span className={statusConfig[imovel.status].color}>{imovel.status}</span>
            </div>
             <div className="flex items-center gap-3 font-semibold text-lg">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span className="text-primary">{formatPrice(imovel.price, imovel.status)}</span>
            </div>
             <div className="flex items-center gap-6 pt-2">
                <span className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-muted-foreground" /> {imovel.bedrooms} quartos</span>
                <span className="flex items-center gap-2"><Bath className="w-5 h-5 text-muted-foreground" /> {imovel.bathrooms} banheiros</span>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{imovel.description}</p>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-lg">Tarefas (via Negócios)</CardTitle>
                <CardDescription>Tarefas associadas a negócios que envolvem este imóvel.</CardDescription>
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
