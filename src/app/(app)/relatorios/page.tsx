
"use client"

import * as React from "react";
import { subDays, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Negocio } from "@/lib/definitions";
import { BarChartHorizontal } from "lucide-react";
import { DateRangePicker } from "@/components/relatorios/date-range-picker";
import { FunnelConversionReport } from "@/components/relatorios/funnel-conversion-report";
import { getInitialNegocios } from "@/lib/initial-data";

const NEGOCIOS_STORAGE_KEY = 'funilBoardData';

export default function RelatoriosPage() {
  const [allNegocios, setAllNegocios] = React.useState<Negocio[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const loadData = React.useCallback(() => {
      try {
          const savedNegocios = window.localStorage.getItem(NEGOCIOS_STORAGE_KEY);
          if (savedNegocios) {
            const boardData = JSON.parse(savedNegocios);
            const allNegocios = Array.isArray(boardData) ? boardData.flatMap((column: any) => column.negocios) : getInitialNegocios();
            setAllNegocios(allNegocios);
          } else {
            setAllNegocios(getInitialNegocios());
          }
      } catch (error) {
          console.error("Failed to load business data for reports", error);
          setAllNegocios(getInitialNegocios());
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
    const toDate = date.to ?? new Date();
    // Set hours to the end of the day for 'to' date to include all deals on that day
    toDate.setHours(23, 59, 59, 999);

    return allNegocios.filter(negocio => {
        const dealDate = parseISO(negocio.dataCriacao);
        return dealDate >= date.from! && dealDate <= toDate;
    })
  }, [date, allNegocios]);

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
        Analise o desempenho de suas vendas e atividades.
      </p>
      <div className="mt-6 space-y-6">
        <FunnelConversionReport data={filteredNegocios} />
      </div>
    </div>
  );
}
