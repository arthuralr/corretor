
"use client"

import * as React from "react";
import { subDays, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Negocio, Client, Despesa, Entrada, Lead } from "@/lib/definitions";
import { BarChartHorizontal } from "lucide-react";
import { DateRangePicker } from "@/components/relatorios/date-range-picker";
import { BusinessSummaryReport } from "@/components/relatorios/business-summary-report";
import { FunnelConversionReport } from "@/components/relatorios/funnel-conversion-report";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientSourceReport } from "@/components/relatorios/client-source-report";
import { FinancialSummaryReport } from "@/components/relatorios/financial-summary-report";
import { NewLeadsReport } from "@/components/relatorios/new-leads-report";
import { Card } from "@/components/ui/card";

export default function RelatoriosPage() {
  const [allNegocios, setAllNegocios] = React.useState<Negocio[]>([]);
  const [allClients, setAllClients] = React.useState<Client[]>([]);
  const [allDespesas, setAllDespesas] = React.useState<Despesa[]>([]);
  const [allEntradas, setAllEntradas] = React.useState<Entrada[]>([]);
  const [allLeads, setAllLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
        const negociosSnapshot = await getDocs(collection(db, "negocios"));
        setAllNegocios(negociosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Negocio)));

        const clientsSnapshot = await getDocs(collection(db, "clients"));
        setAllClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));

        const savedDespesas = window.localStorage.getItem('despesasData');
        setAllDespesas(savedDespesas ? JSON.parse(savedDespesas) : []);
        
        const savedEntradas = window.localStorage.getItem('entradasData');
        setAllEntradas(savedEntradas ? JSON.parse(savedEntradas) : []);

        const savedLeads = window.localStorage.getItem('leadsData');
        setAllLeads(savedLeads ? JSON.parse(savedLeads) : []);

    } catch (error) {
        console.error("Failed to load data for reports", error);
    } finally {
        setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
    window.addEventListener('dataUpdated', loadData);
    return () => {
        window.removeEventListener('dataUpdated', loadData);
    };
  }, [loadData]);

  const filterByDate = <T extends { dataCriacao?: string; date?: string; dataRecebimento?: string; createdAt?: any; }>(items: T[], dateKey: keyof T): T[] => {
    if (!date?.from) return [];
    const fromDate = date.from;
    const toDate = date.to ?? new Date();
    
    toDate.setHours(23, 59, 59, 999);
    fromDate.setHours(0,0,0,0);

    return items.filter(item => {
        const itemDateValue = item[dateKey];
        if (!itemDateValue) return false;
        
        let itemDate;
        if (typeof itemDateValue === 'string') {
            itemDate = parseISO(itemDateValue);
        } else if (itemDateValue.toDate) { // Firestore Timestamp
            itemDate = itemDateValue.toDate();
        } else {
            return false;
        }
        
        return itemDate >= fromDate && itemDate <= toDate;
    });
  }


  const filteredNegocios = React.useMemo(() => filterByDate(allNegocios, 'dataCriacao'), [date, allNegocios]);
  const filteredClients = React.useMemo(() => filterByDate(allClients, 'createdAt'), [date, allClients]);
  const filteredDespesas = React.useMemo(() => filterByDate(allDespesas, 'date'), [date, allDespesas]);
  const filteredEntradas = React.useMemo(() => filterByDate(allEntradas, 'dataRecebimento'), [date, allEntradas]);
  const filteredLeads = React.useMemo(() => filterByDate(allLeads, 'createdAt'), [date, allLeads]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          <BarChartHorizontal className="h-8 w-8 text-accent" />
          <h2 className="text-3xl font-bold tracking-tight font-headline">Relatórios</h2>
        </div>
        <DateRangePicker date={date} onDateChange={setDate} />
      </div>
      <p className="text-muted-foreground">
        Analise o desempenho de suas vendas e atividades no período selecionado.
      </p>
        {loading ? (
             <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
             </div>
        ) : (
             <div className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Resumo de Negócios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BusinessSummaryReport data={filteredNegocios} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Resumo Financeiro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FinancialSummaryReport entradas={filteredEntradas} despesas={filteredDespesas} />
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FunnelConversionReport data={filteredNegocios} />
                    <ClientSourceReport data={filteredClients} />
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Novos Leads no Período</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <NewLeadsReport data={filteredLeads} />
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}

