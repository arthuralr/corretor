
"use client";

import type { Despesa, Entrada } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Scale } from "lucide-react";

interface FinancialSummaryReportProps {
  entradas: Entrada[];
  despesas: Despesa[];
}

export function FinancialSummaryReport({ entradas, despesas }: FinancialSummaryReportProps) {
  const totalEntradas = entradas.reduce((sum, item) => sum + item.valor, 0);
  const totalDespesas = despesas.reduce((sum, item) => sum + item.value, 0);
  const balanco = totalEntradas - totalDespesas;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const hasData = entradas.length > 0 || despesas.length > 0;

  if (!hasData) {
    return (
        <div className="flex h-24 items-center justify-center text-muted-foreground text-sm">
            <p>Nenhuma movimentação financeira encontrada no período.</p>
        </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</div>
             <p className="text-xs text-muted-foreground">
              {entradas.length} registro(s) no período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</div>
            <p className="text-xs text-muted-foreground">
              {despesas.length} registro(s) no período
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balanço</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balanco >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balanco)}
            </div>
             <p className="text-xs text-muted-foreground">
              Resultado líquido do período
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
