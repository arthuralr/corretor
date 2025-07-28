
'use client'

import { ImovelForm } from "@/components/imoveis/imovel-form";
import type { Imovel } from "@/lib/definitions";
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const IMOVEIS_STORAGE_KEY = 'imoveisData';

export default function EditImovelPage({ params }: { params: { id: string } }) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const savedData = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
        if (savedData) {
            const imoveis: Imovel[] = JSON.parse(savedData);
            const foundImovel = imoveis.find(i => i.id === params.id);
            if (foundImovel) {
                setImovel(foundImovel);
            }
        }
    } catch (error) {
        console.error("Failed to load property data from local storage", error);
    } finally {
        setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Carregando...</h2>
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
  }

  if (!imovel) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Imóvel não encontrado</h2>
            <p>Não foi possível encontrar o imóvel que você está tentando editar.</p>
        </div>
    )
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Editar Imóvel</h2>
      </div>
      <ImovelForm initialData={imovel} />
    </div>
  );
}
