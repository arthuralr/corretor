"use client"

import * as React from "react";
import { subDays, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { Negocio } from "@/lib/definitions";
import { BarChartHorizontal } from "lucide-react";
import { DateRangePicker } from "@/components/relatorios/date-range-picker";
import { FunnelConversionReport } from "@/components/relatorios/funnel-conversion-report";

// MOCK DATA: In a real app, this would be fetched from your database
const allNegocios: Negocio[] = [
    { id: "NEG-1", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-1", imovelTitulo: "Casa Espaçosa com Piscina", etapa: "Proposta", dataCriacao: "2024-07-28", valorProposta: 745000 },
    { id: "NEG-2", clienteId: "CLIENT-2", clienteNome: "Jane Smith", imovelId: "IMOVEL-2", imovelTitulo: "Apartamento Moderno no Centro", etapa: "Visita", dataCriacao: "2024-07-25", valorProposta: 450000 },
    { id: "NEG-3", clienteId: "CLIENT-3", clienteNome: "Sam Wilson", imovelId: "IMOVEL-3", imovelTitulo: "Terreno Plano em Condomínio", etapa: "Contato", dataCriacao: "2024-07-29", valorProposta: 200000 },
    { id: "NEG-4", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-4", imovelTitulo: "Apartamento para Alugar", etapa: "Fechado - Ganho", dataCriacao: "2024-07-20", valorProposta: 1500 },
    { id: "NEG-5", clienteId: "CLIENT-2", clienteNome: "Jane Smith", imovelId: "IMOVEL-1", imovelTitulo: "Casa Espaçosa com Piscina", etapa: "Fechado - Perdido", dataCriacao: "2024-06-15", valorProposta: 750000 },
    { id: "NEG-6", clienteId: "CLIENT-3", clienteNome: "Sam Wilson", imovelId: "IMOVEL-2", imovelTitulo: "Apartamento Moderno no Centro", etapa: "Fechado - Ganho", dataCriacao: "2024-07-22", valorProposta: 480000 },
    { id: "NEG-7", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-5", imovelTitulo: "Casa Charmosa em Bairro Tranquilo", etapa: "Visita", dataCriacao: "2024-07-30", valorProposta: 680000 },
    { id: "NEG-8", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-1", imovelTitulo: "Casa Espaçosa", etapa: "Atendimento", dataCriacao: "2024-07-26", valorProposta: 745000 },
    { id: "NEG-9", clienteId: "CLIENT-2", clienteNome: "Jane Smith", imovelId: "IMOVEL-2", imovelTitulo: "Apto Centro", etapa: "Atendimento", dataCriacao: "2024-07-24", valorProposta: 450000 },
    { id: "NEG-10", clienteId: "CLIENT-3", clienteNome: "Sam Wilson", imovelId: "IMOVEL-3", imovelTitulo: "Terreno", etapa: "Contato", dataCriacao: "2024-07-28", valorProposta: 200000 },
     { id: "NEG-11", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-1", imovelTitulo: "Casa Espaçosa", etapa: "Reserva", dataCriacao: "2024-07-29", valorProposta: 745000 },
];

export default function RelatoriosPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const filteredNegocios = React.useMemo(() => {
    if (!date?.from) return [];
    // If only 'from' is selected, filter from that date to now.
    // If 'to' is also selected, filter within the range.
    const toDate = date.to ?? new Date();

    return allNegocios.filter(negocio => {
        const dealDate = parseISO(negocio.dataCriacao);
        return dealDate >= date.from! && dealDate <= toDate;
    })
  }, [date]);

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
        {/* Outros relatórios podem ser adicionados aqui */}
      </div>
    </div>
  );
}
