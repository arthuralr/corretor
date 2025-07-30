
"use client";

import { PlusCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/leads/columns";
import { DataTable } from "@/components/data-table";
import type { Lead } from "@/lib/definitions";
import { useState, useEffect, useCallback } from "react";

const LEADS_STORAGE_KEY = 'leadsData';

export default function LeadsPage() {
  const [data, setData] = useState<Lead[]>([]);

  const loadLeads = useCallback(() => {
    try {
      const savedData = window.localStorage.getItem(LEADS_STORAGE_KEY);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        setData([]);
      }
    } catch (error) {
        console.error("Falha ao carregar dados de leads.", error);
        setData([]);
    }
  }, []);

  useEffect(() => {
    loadLeads();
    
    // Custom event to reload data when a new lead is captured elsewhere
    const handleDataUpdate = () => {
        loadLeads();
    }
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, [loadLeads]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Leads Recebidos</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Veja e gerencie todos os contatos recebidos através do seu site.
      </p>
      <DataTable columns={columns(loadLeads)} data={data} filterColumnId="name" filterPlaceholder="Filtrar por nome..." />
    </div>
  );
}
