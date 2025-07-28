
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Negocio } from "@/lib/definitions"
import { useMemo } from "react"
import { format, parseISO, startOfMonth, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

const chartConfig = {
  ganhos: {
    label: "Ganhos",
    color: "hsl(var(--chart-2))",
  },
  perdidos: {
    label: "Perdidos",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

interface DealsChartProps {
  data: Negocio[];
}

export function DealsChart({ data }: DealsChartProps) {
  const chartData = useMemo(() => {
    const sixMonthsAgo = subMonths(startOfMonth(new Date()), 5);
    
    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
      const monthDate = subMonths(new Date(), 5 - i);
      return {
        month: format(monthDate, "MMM", { locale: ptBR }),
        ganhos: 0,
        perdidos: 0,
      };
    });

    data.forEach(deal => {
      if(deal.etapa !== 'Fechado - Ganho' && deal.etapa !== 'Fechado - Perdido') return;

      const dealDate = parseISO(deal.dataCriacao);
      if (dealDate >= sixMonthsAgo) {
        const monthKey = format(dealDate, "MMM", { locale: ptBR });
        const monthIndex = monthlyData.findIndex(d => d.month === monthKey);

        if (monthIndex > -1) {
            if (deal.etapa === 'Fechado - Ganho') {
                monthlyData[monthIndex].ganhos++;
            } else if (deal.etapa === 'Fechado - Perdido') {
                monthlyData[monthIndex].perdidos++;
            }
        }
      }
    });

    return monthlyData;
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="ganhos" fill="var(--color-ganhos)" radius={4} />
        <Bar dataKey="perdidos" fill="var(--color-perdidos)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
