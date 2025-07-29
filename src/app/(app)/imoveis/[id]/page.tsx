

'use client'

import React, { useEffect, useState, useCallback } from "react";
import { Home, Tag, DollarSign, BedDouble, Bath, CheckSquare, XSquare, Info, CalendarCheck, Image as ImageIcon, Edit, ChevronLeft, ChevronRight, Building, AreaChart, Briefcase } from "lucide-react";
import type { Imovel, Task, Negocio } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/agenda/task-list";
import { AddTaskButton } from "@/components/agenda/add-task-button";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getInitialImoveis, getInitialNegocios } from "@/lib/initial-data";

const IMOVEIS_STORAGE_KEY = 'imoveisData';
const TASKS_STORAGE_KEY = 'tasksData';
const NEGOCIOS_STORAGE_KEY = 'funilBoardData';


export default function ImovelDetailPage({ params }: { params: { id: string } }) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const { id: imovelId } = params;
  
  const loadData = useCallback(() => {
     if (imovelId) {
        setLoading(true);
        try {
            // Fetch Imovel
            const savedData = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
            const imoveis = savedData ? JSON.parse(savedData) : getInitialImoveis();
            const foundImovel = imoveis.find((i: Imovel) => i.id === imovelId) || null;
            setImovel(foundImovel);

            // Fetch Tasks
            const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
            if (savedTasks) {
                const allTasks: Task[] = JSON.parse(savedTasks);
                // Filter tasks associated directly with the imovel or through a negocio
                const imovelTasks = allTasks.filter(t => t.imovelId === imovelId);
                setTasks(imovelTasks);
            }

            // Fetch Negocios
             const savedNegocios = window.localStorage.getItem(NEGOCIOS_STORAGE_KEY);
            if (savedNegocios) {
                const boardData = JSON.parse(savedNegocios);
                const allNegocios: Negocio[] = boardData.flatMap((column: any) => column.negocios);
                const imovelNegocios = allNegocios.filter(n => n.imovelId === imovelId);
                setNegocios(imovelNegocios);
            }


        } catch (error) {
            console.error("Failed to load property data", error);
            setImovel(null);
        } finally {
            setLoading(false);
        }
    }
  }, [imovelId]);

  useEffect(() => {
    loadData();
    window.addEventListener('dataUpdated', loadData);
    return () => {
        window.removeEventListener('dataUpdated', loadData);
    }
  }, [loadData]);


   const formatPrice = (price: number | undefined) => {
    if (price === undefined) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }
  
  const statusConfig = {
    'Ativo': { icon: CheckSquare, color: 'text-green-600' },
    'Vendido': { icon: XSquare, color: 'text-red-600' },
    'Alugado': { icon: XSquare, color: 'text-red-600' },
    'Inativo': { icon: XSquare, color: 'text-gray-500' }
  };

  const images = imovel?.imageUrls && imovel.imageUrls.length > 0 
    ? imovel.imageUrls 
    : (imovel?.imageUrl ? [imovel.imageUrl] : []);


  if (loading) {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-12 w-2/3" />
                <Skeleton className="h-10 w-32" />
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <ImageIcon className="w-5 h-5"/> Imagem do Imóvel
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full aspect-video rounded-lg" />
                </CardContent>
            </Card>
        </div>
    )
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
      
       {images.length > 0 && (
         <Card>
            <CardContent className="p-4">
                <Carousel className="w-full max-w-full">
                <CarouselContent>
                    {images.map((url, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <div className="relative aspect-video">
                                <Image 
                                    src={url} 
                                    alt={`${imovel.title} - Imagem ${index + 1}`} 
                                    fill 
                                    className="object-cover rounded-lg"
                                />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2"/>
                </Carousel>
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
              {imovel.subType && <Badge variant="outline">{imovel.subType}</Badge>}
            </div>
            <div className="flex items-center gap-3">
              {React.createElement(statusConfig[imovel.status].icon, { className: `w-5 h-5 ${statusConfig[imovel.status].color}` })}
              <span className={statusConfig[imovel.status].color}>{imovel.status}</span>
            </div>
            <div className="space-y-2 pt-2">
                {imovel.sellPrice && <div className="flex items-center gap-3 font-semibold text-lg">
                    <span className="w-24 text-muted-foreground text-sm">Venda:</span>
                    <span className="text-primary">{formatPrice(imovel.sellPrice)}</span>
                </div>}
                {imovel.rentPrice && <div className="flex items-center gap-3 font-semibold text-lg">
                    <span className="w-24 text-muted-foreground text-sm">Aluguel:</span>
                    <span className="text-primary">{formatPrice(imovel.rentPrice)}/mês</span>
                </div>}
                 {imovel.condoPrice && <div className="flex items-center gap-3 font-semibold text-lg">
                    <span className="w-24 text-muted-foreground text-sm">Condomínio:</span>
                    <span className="text-primary">{formatPrice(imovel.condoPrice)}</span>
                </div>}
            </div>
             <div className="flex items-center gap-6 pt-4 border-t flex-wrap">
                <span className="flex items-center gap-2"><AreaChart className="w-5 h-5 text-muted-foreground" /> {imovel.area} m²</span>
                <span className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-muted-foreground" /> {imovel.bedrooms} quartos</span>
                {imovel.suites && <span className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-primary/80" /> {imovel.suites} suítes</span>}
                <span className="flex items-center gap-2"><Bath className="w-5 h-5 text-muted-foreground" /> {imovel.bathrooms} banheiros</span>
                {imovel.parkingSpaces && <span className="flex items-center gap-2"><Building className="w-5 h-5 text-muted-foreground" /> {imovel.parkingSpaces} vagas</span>}
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{imovel.description}</p>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5"/> Negócios Associados
            </CardTitle>
            <CardDescription>Oportunidades no funil de vendas para este imóvel.</CardDescription>
        </CardHeader>
        <CardContent>
            {negocios.length > 0 ? (
                <div className="space-y-2">
                    {negocios.map(negocio => (
                        <Link key={negocio.id} href={`/negocios/${negocio.id}`} className="block hover:bg-muted/50 p-3 rounded-md">
                           <div className="flex justify-between items-center">
                             <div>
                                <p className="font-semibold text-primary">{negocio.clienteNome}</p>
                                <p className="text-sm text-muted-foreground">{formatPrice(negocio.valorProposta)}</p>
                             </div>
                             <Badge variant="secondary">{negocio.etapa}</Badge>
                           </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Nenhum negócio ativo para este imóvel.</p>
            )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-lg">Tarefas Associadas</CardTitle>
                <CardDescription>Tarefas associadas diretamente a este imóvel.</CardDescription>
            </div>
            <AddTaskButton preselectedImovelId={imovel.id} />
        </CardHeader>
        <CardContent>
            <TaskList tasks={tasks} onTaskChange={loadData} />
        </CardContent>
      </Card>
    </div>
  );
}

