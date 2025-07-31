
"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/imoveis/columns";
import { DataTable } from "@/components/data-table";
import type { Imovel } from "@/lib/definitions";
import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";


export default function ImoveisPage() {
  const [data, setData] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadImoveis = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "imoveis"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const imoveisData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      })) as Imovel[];
      setData(imoveisData);
    } catch (error) {
        console.error("Falha ao carregar dados de imóveis do Firestore.", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImoveis();
  }, [loadImoveis]);
  
  if (loading) {
      return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="rounded-md border mt-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
      )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Gestão de Imóveis</h2>
        <Link href="/gestao-imoveis/novo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Imóvel
          </Button>
        </Link>
      </div>
      <DataTable columns={columns(loadImoveis)} data={data} filterColumnId="title" filterPlaceholder="Filtrar por título..." />
    </div>
  );
}
