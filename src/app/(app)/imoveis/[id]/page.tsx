

'use client'

import React, { useEffect, useState, useCallback } from "react";
import { Home, Tag, DollarSign, BedDouble, Bath, CheckSquare, XSquare, Info, CalendarCheck, Image as ImageIcon, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import type { Imovel, Task } from "@/lib/definitions";
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
import { getInitialImoveis } from "@/lib/initial-data";

const IMOVEIS_STORAGE_KEY = 'imoveisData';
const TASKS_STORAGE_KEY = 'tasksData';

export default function ImovelDetailPage({ params }: { params: { id: string } }) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const imovelId = params.id;
  
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
