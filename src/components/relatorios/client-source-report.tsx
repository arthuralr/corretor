
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Client } from "@/lib/definitions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const chartConfig = {
  count: {
    label: "Clientes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface ClientSourceReportProps {
  data: Client[];
}

export function ClientSourceReport({ data }: ClientSourceReportProps) {
  const chartData = React.useMemo(() => {
    const sourceCounts: { [source: string]: number } = {};
    
    data.forEach(client => {
      const source = client.source || "Não definida";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    return Object.keys(sourceCounts).map(source => ({
      source,
      count: sourceCounts[source],
    })).sort((a,b) => b.count - a.count);

  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Origem dos Clientes</CardTitle>
        <CardDescription>
          A quantidade de clientes por canal de aquisição.
        </CardDescription>
      </CardHeader>
       <CardContent className="flex-grow flex items-center justify-center">
         {data.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <p>Nenhum cliente no período.</p>
          </div>
        ) : (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ left: 20 }}
            >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="source"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
              interval={0}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              radius={4}
            >
            </Bar>
          </BarChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
