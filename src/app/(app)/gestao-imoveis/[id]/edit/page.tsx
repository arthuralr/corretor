
'use client'

import { ImovelForm } from "@/components/imoveis/imovel-form";
import type { Imovel } from "@/lib/definitions";
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditImovelPage({ params }: { params: { id: string } }) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const imovelId = params.id;

  useEffect(() => {
    if (imovelId) {
        const fetchImovel = async () => {
            try {
                const docRef = doc(db, "imoveis", imovelId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setImovel({ id: docSnap.id, ...docSnap.data() } as Imovel);
                } else {
                     console.log("No such document!");
                }
            } catch (error) {
                console.error("Failed to load property data from firestore", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImovel();
    }
  }, [imovelId]);

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
