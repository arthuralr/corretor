
"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/clients/columns";
import { DataTable } from "@/components/data-table";
import type { Client } from "@/lib/definitions";
import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";


export default function ClientsPage() {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      })) as Client[];
      setData(clientsData);
    } catch (error) {
        console.error("Falha ao carregar dados de clientes do Firestore.", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);
  
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
        <h2 className="text-3xl font-bold tracking-tight font-headline">Clientes</h2>
        <Link href="/clients/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Cliente
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} filterColumnId="name" filterPlaceholder="Filtrar por nome..." />
    </div>
  );
}
