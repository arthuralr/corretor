
"use client"

import * as React from "react";
import { subDays, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Negocio, Client, EtapaFunil } from "@/lib/definitions";
import { BarChartHorizontal } from "lucide-react";
import { DateRangePicker } from "@/components/relatorios/date-range-picker";
import { BusinessSummaryReport } from "@/components/relatorios/business-summary-report";
import { FunnelConversionReport } from "@/components/relatorios/funnel-conversion-report";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientSourceReport } from "@/components/relatorios/client-source-report";

export default function RelatoriosPage() {
  const [allNegocios, setAllNegocios] = React.useState<Negocio[]>([]);
  const [allClients, setAllClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
        const negociosSnapshot = await getDocs(collection(db, "negocios"));
        const negociosData = negociosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Negocio));
        setAllNegocios(negociosData);

        const clientsSnapshot = await getDocs(collection(db, "clients"));
        const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setAllClients(clientsData);

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


  const filteredNegocios = React.useMemo(() => {
    if (!date?.from) return [];
    const fromDate = date.from;
    const toDate = date.to ?? new Date();
    
    toDate.setHours(23, 59, 59, 999);
    fromDate.setHours(0,0,0,0);

    return allNegocios.filter(negocio => {
        const dealDate = parseISO(negocio.dataCriacao);
        return dealDate >= fromDate && dealDate <= toDate;
    })
  }, [date, allNegocios]);

  const filteredClients = React.useMemo(() => {
    if (!date?.from) return [];
    const fromDate = date.from;
    const toDate = date.to ?? new Date();
    
    toDate.setHours(23, 59, 59, 999);
    fromDate.setHours(0,0,0,0);

    return allClients.filter(client => {
        if (!client.createdAt) return false;
        const clientDate = client.createdAt.toDate ? client.createdAt.toDate() : parseISO(client.createdAt);
        return clientDate >= fromDate && clientDate <= toDate;
    })
  }, [date, allClients]);


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
                <BusinessSummaryReport data={filteredNegocios} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FunnelConversionReport data={filteredNegocios} />
                    <ClientSourceReport data={filteredClients} />
                </div>
            </div>
        )}
    </div>
  );
}
