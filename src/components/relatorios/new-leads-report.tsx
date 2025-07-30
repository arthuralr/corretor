
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Lead } from "@/lib/definitions"
import { format, parseISO, startOfDay, eachDayOfInterval } from "date-fns"

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface NewLeadsReportProps {
  data: Lead[];
}

export function NewLeadsReport({ data }: NewLeadsReportProps) {
  const chartData = React.useMemo(() => {
    if (data.length === 0) return [];
    
    const leadsByDay: { [key: string]: number } = {};

    const dates = data.map(lead => parseISO(lead.createdAt));
    const minDate = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
    
    const interval = eachDayOfInterval({
        start: startOfDay(minDate),
        end: startOfDay(maxDate)
    })

    interval.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        leadsByDay[dayKey] = 0;
    })
    
    data.forEach(lead => {
      const dayKey = format(parseISO(lead.createdAt), 'yyyy-MM-dd');
      leadsByDay[dayKey] = (leadsByDay[dayKey] || 0) + 1;
    });

    return Object.keys(leadsByDay).map(day => ({
      date: format(parseISO(day), 'dd/MM'),
      leads: leadsByDay[day],
    })).sort((a,b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  }, [data]);

  if (data.length === 0) {
    return (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
            <p>Nenhum lead encontrado no período selecionado.</p>
        </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
         <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="leads"
          type="monotone"
          stroke="var(--color-leads)"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  )
}
