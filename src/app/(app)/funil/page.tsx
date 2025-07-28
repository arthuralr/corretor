import { FunilBoard } from "@/components/funil/funil-board";
import type { Negocio, EtapaFunil } from "@/lib/definitions";
import { DollarSign } from "lucide-react";

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
  return [
    {
      id: "NEG-1",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-1",
      imovelTitulo: "Casa Espaçosa com Piscina",
      etapa: "Proposta",
      dataCriacao: "2024-07-28",
      valorProposta: 745000,
      recomendadoCliente: true,
    },
    {
      id: "NEG-2",
      clienteId: "CLIENT-2",
      clienteNome: "Jane Smith",
      imovelId: "IMOVEL-2",
      imovelTitulo: "Apartamento Moderno no Centro",
      etapa: "Visita",
      dataCriacao: "2024-07-25",
      valorProposta: 450000,
    },
    {
      id: "NEG-3",
      clienteId: "CLIENT-3",
      clienteNome: "Sam Wilson",
      imovelId: "IMOVEL-3",
      imovelTitulo: "Terreno Plano em Condomínio",
      etapa: "Contato",
      dataCriacao: "2024-07-29",
      valorProposta: 200000,
    },
     {
      id: "NEG-4",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-4",
      imovelTitulo: "Apartamento para Alugar",
      etapa: "Fechado - Ganho",
      dataCriacao: "2024-07-20",
      valorProposta: 1500,
    },
     {
      id: "NEG-5",
      clienteId: "CLIENT-2",
      clienteNome: "Jane Smith",
      imovelId: "IMOVEL-1",
      imovelTitulo: "Casa Espaçosa com Piscina",
      etapa: "Fechado - Perdido",
      dataCriacao: "2024-06-15",
      valorProposta: 750000,
    },
     {
      id: "NEG-7",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-5",
      imovelTitulo: "Casa Charmosa em Bairro Tranquilo",
      etapa: "Visita",
      dataCriacao: "2024-07-30",
      valorProposta: 680000,
      recomendadoCliente: true,
    },
  ];
}


export default async function FunilPage() {
  const negocios = await getNegocios();
  const negociosPorEtapa = etapas.map(etapa => ({
    etapa,
    negocios: negocios.filter(n => n.etapa === etapa)
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Funil de Vendas</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Arraste os cards para mover os negócios entre as etapas do funil.
      </p>
      <div className="flex-1 overflow-x-auto">
        <FunilBoard initialData={negociosPorEtapa} />
      </div>
    </div>
  );
}
