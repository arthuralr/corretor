
"use client";

import type { Negocio } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Trophy, DollarSign, Ban, Percent } from "lucide-react";

interface BusinessSummaryReportProps {
  data: Negocio[];
}

export function BusinessSummaryReport({ data }: BusinessSummaryReportProps) {

  const totalDeals = data.length;
  const wonDeals = data.filter(deal => deal.etapa === 'Fechado - Ganho');
  const lostDeals = data.filter(deal => deal.etapa === 'Fechado - Perdido');
  
  const wonDealsCount = wonDeals.length;
  const lostDealsCount = lostDeals.length;
  
  const totalWonCommission = wonDeals.reduce((sum, deal) => {
    const commission = (deal.valorProposta * (deal.taxaComissao || 0)) / 100;
    return sum + commission;
  }, 0);

  const totalClosedDeals = wonDealsCount + lostDealsCount;
  const successRate = totalClosedDeals > 0 ? (wonDealsCount / totalClosedDeals) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (totalDeals === 0) {
    return (
        <div className="flex h-24 items-center justify-center text-muted-foreground text-sm">
            <p>Nenhum negócio encontrado no período para análise.</p>
        </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Negócios</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              Negócios criados no período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão (Ganhos)</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDealsCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalWonCommission)} em comissão
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios Perdidos</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lostDealsCount}</div>
             <p className="text-xs text-muted-foreground">
              Negócios marcados como "Perdido"
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Dos negócios concluídos
            </p>
          </CardContent>
        </Card>
    </div>
  );
}

