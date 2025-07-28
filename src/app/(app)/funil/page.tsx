

import { FunilBoard } from "@/components/funil/funil-board";
import type { Negocio, EtapaFunil } from "@/lib/definitions";
import { DollarSign } from "lucide-react";
import { getInitialNegocios } from "@/lib/initial-data";

const etapas: EtapaFunil[] = [
  'Contato', 
  'Atendimento', 
  'Visita', 
  'Proposta', 
  'Reserva', 
  'Fechado - Ganho', 
  'Fechado - Perdido'
];

async function getNegocios(): Promise<Negocio[]> {
  // In a real app, you'd fetch this from a database.
  // We'll use this as fallback data if localStorage is empty.
  return getInitialNegocios();
}


export default async function FunilPage() {
  const negocios = await getNegocios();
  const negociosPorEtapa = etapas.map(etapa => ({
    etapa,
    negocios: negocios.filter(n => n.etapa === etapa)
  }));

  return (
    <div className="flex flex-col flex-1 space-y-4 p-4 md:p-8 pt-6 h-[calc(100vh-theme(spacing.16))]">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Funil de Vendas</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Arraste os cards para mover os negócios ou use a busca para filtrar.
      </p>
      <div className="flex-1 overflow-x-auto">
        <FunilBoard initialData={negociosPorEtapa} />
      </div>
    </div>
  );
}

    
