"use client";

import type { Negocio, EtapaFunil } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowRight } from "lucide-react";

interface FunnelConversionReportProps {
  data: Negocio[];
}

const ETAPAS_FUNIL: EtapaFunil[] = [
  'Contato',
  'Atendimento',
  'Visita',
  'Proposta',
  'Reserva',
  'Fechado - Ganho',
];

export function FunnelConversionReport({ data }: FunnelConversionReportProps) {
  const processReportData = () => {
    const stageCounts: { [key in EtapaFunil]?: number } = {};

    // Initialize counts for all stages to handle cases where a stage has 0 deals
    ETAPAS_FUNIL.forEach(stage => {
        stageCounts[stage] = 0;
    });

    data.forEach(deal => {
      // Find the index of the deal's stage in the predefined order
      const stageIndex = ETAPAS_FUNIL.indexOf(deal.etapa);
      
      // Increment count for all stages the deal has passed through or is in
      if (stageIndex !== -1) {
        for (let i = 0; i <= stageIndex; i++) {
          const stage = ETAPAS_FUNIL[i];
          stageCounts[stage] = (stageCounts[stage] ?? 0) + 1;
        }
      }
    });

    const report = [];
    for (let i = 0; i < ETAPAS_FUNIL.length; i++) {
      const currentStage = ETAPAS_FUNIL[i];
      const nextStage = ETAPAS_FUNIL[i + 1];
      const currentCount = stageCounts[currentStage] ?? 0;
      const nextCount = stageCounts[nextStage] ?? 0;

      let conversionRate = 0;
      if (currentCount > 0 && i < ETAPAS_FUNIL.length -1) {
        conversionRate = (nextCount / currentCount) * 100;
      }

      report.push({
        stage: currentStage,
        dealCount: currentCount,
        conversionRate: i < ETAPAS_FUNIL.length - 1 ? conversionRate : null,
      });
    }

    // Calculate total conversion rate (Contact to Won)
    const initialCount = stageCounts['Contato'] ?? 0;
    const finalCount = stageCounts['Fechado - Ganho'] ?? 0;
    const totalConversion = initialCount > 0 ? (finalCount / initialCount) * 100 : 0;
    
    return { report, totalConversion };
  };

  const { report, totalConversion } = processReportData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Conversão do Funil</CardTitle>
        <CardDescription>
          Analisa a transição de negócios entre as etapas do funil de vendas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            <p>Nenhum negócio encontrado no período selecionado.</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Etapa</TableHead>
                  <TableHead className="text-center w-1/3">Nº de Negócios</TableHead>
                  <TableHead className="text-right w-1/3">Taxa de Conversão para Próxima Etapa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.map((row, index) => (
                  <React.Fragment key={row.stage}>
                    <TableRow>
                      <TableCell className="font-medium">{row.stage}</TableCell>
                      <TableCell className="text-center">{row.dealCount}</TableCell>
                      <TableCell className="text-right">
                        {row.conversionRate !== null ? `${row.conversionRate.toFixed(1)}%` : 'N/A'}
                      </TableCell>
                    </TableRow>
                    {index < report.length - 1 && (
                      <TableRow>
                        <TableCell colSpan={3} className="py-2 text-center">
                            <div className="flex items-center justify-center text-muted-foreground text-xs">
                                <ArrowDown className="h-4 w-4 mr-2" />
                                {row.conversionRate !== null ? `(${row.conversionRate.toFixed(1)}%)` : ''}
                            </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 flex items-center justify-end border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Taxa de Conversão Total (Contato para Ganho):</h3>
                <p className="ml-2 text-lg font-bold text-primary">{totalConversion.toFixed(1)}%</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
