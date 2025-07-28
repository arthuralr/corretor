"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/clients/columns";
import { DataTable } from "@/components/data-table";
import type { Client } from "@/lib/definitions";
import { useState, useEffect, useCallback } from "react";

const CLIENTS_STORAGE_KEY = 'clientsData';

const getInitialClients = (): Client[] => {
  return [
    {
      id: "CLIENT-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
      searchProfile: "Looking for a 3-bedroom house with a yard.",
    },
    {
      id: "CLIENT-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-5678",
      searchProfile: "Wants a modern apartment downtown, 2-bed minimum.",
    },
    {
        id: "CLIENT-3",
        name: "Sam Wilson",
        email: "sam.wilson@example.com",
        phone: "555-9876",
        searchProfile: "Interested in condos with a gym and pool.",
    }
  ];
};

export default function ClientsPage() {
  const [data, setData] = useState<Client[]>([]);

  const loadClients = useCallback(() => {
    try {
      const savedData = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        const initialData = getInitialClients();
        setData(initialData);
        window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
        console.error("Falha ao carregar dados de clientes.", error);
        setData(getInitialClients());
    }
  }, []);

  useEffect(() => {
    loadClients();
    
    const handleDataUpdate = () => {
        loadClients();
    }
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, [loadClients]);

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
