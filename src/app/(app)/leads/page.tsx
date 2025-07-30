
"use client";

import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/leads/columns";
import { DataTable } from "@/components/data-table";
import type { Lead } from "@/lib/definitions";
import { useState, useEffect, useCallback } from "react";
import { ExportButton } from "@/components/shared/export-button";
import { ImportButton } from "@/components/shared/import-button";
import { saveLead } from "@/lib/lead-capture";
import { useToast } from "@/hooks/use-toast";
import { AddLeadButton } from "@/components/leads/add-lead-button";

const LEADS_STORAGE_KEY = 'leadsData';

export default function LeadsPage() {
  const [data, setData] = useState<Lead[]>([]);
  const { toast } = useToast();

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
    
    const handleDataUpdate = () => {
        loadLeads();
    }
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, [loadLeads]);

  const handleImport = async (importedData: any[]) => {
    let newLeadsCount = 0;
    try {
        importedData.forEach((row) => {
            if (row.name && row.email && row.phone && row.interest && row.source) {
                saveLead({
                    name: row.name,
                    email: row.email,
                    phone: String(row.phone),
                    interest: row.interest,
                    source: row.source,
                    message: row.message || "",
                    birthDate: row.birthDate || undefined,
                });
                newLeadsCount++;
            }
        });

        if (newLeadsCount > 0) {
            toast({
                title: "Importação Concluída",
                description: `${newLeadsCount} novos leads foram importados com sucesso.`,
            });
            loadLeads();
        } else {
             toast({
                title: "Nenhum dado importado",
                description: "Verifique se o arquivo possui as colunas obrigatórias.",
                variant: "destructive",
            });
        }
    } catch(e) {
        toast({
            title: "Erro na importação",
            description: "Não foi possível importar os leads.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Leads Recebidos</h2>
        </div>
        <div className="flex items-center gap-2">
            <ImportButton onImport={handleImport} />
            <ExportButton data={data} fileName="leads" />
            <AddLeadButton onLeadAdded={loadLeads} />
        </div>
      </div>
      <p className="text-muted-foreground">
        Veja e gerencie todos os contatos recebidos através do seu site.
      </p>
      <DataTable columns={columns(loadLeads)} data={data} filterColumnId="name" filterPlaceholder="Filtrar por nome..." />
    </div>
  );
}
