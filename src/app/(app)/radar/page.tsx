import type { Client, Imovel } from "@/lib/definitions";
import { RadarDeOportunidades } from "@/components/radar/radar-oportunidades";
import { Telescope } from "lucide-react";

async function getClients(): Promise<Client[]> {
  // In a real app, you'd fetch this from a database.
  return [
    {
      id: "CLIENT-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
      searchProfile: "Estou procurando uma casa espaçosa com pelo menos 3 quartos e um quintal grande, de preferência com piscina. O orçamento é até R$800.000.",
    },
    {
      id: "CLIENT-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-5678",
      searchProfile: "Quero um apartamento moderno no centro da cidade, com no mínimo 2 quartos e varanda gourmet. Preço em torno de R$500.000.",
    },
    {
        id: "CLIENT-3",
        name: "Sam Wilson",
        email: "sam.wilson@example.com",
        phone: "555-9876",
        searchProfile: "Tenho interesse em terrenos em condomínios fechados para construir. A área precisa ser de no mínimo 300m².",
    }
  ];
}

async function getImoveis(): Promise<Imovel[]> {
  // In a real app, you'd fetch this from a database.
  return [
    {
      id: "IMOVEL-1",
      refCode: "CA001",
      title: "Casa Espaçosa com Piscina",
      description: "Uma bela casa com 3 quartos, 2 banheiros e uma grande área de lazer com piscina e quintal espaçoso.",
      type: "Casa",
      price: 750000,
      bedrooms: 3,
      bathrooms: 2,
      status: "Disponível",
    },
    {
      id: "IMOVEL-2",
      refCode: "AP002",
      title: "Apartamento Moderno no Centro",
      description: "Apartamento de 2 quartos totalmente reformado no coração da cidade, com varanda gourmet e vista panorâmica.",
      type: "Apartamento",
      price: 450000,
      bedrooms: 2,
      bathrooms: 1,
      status: "Vendido",
    },
    {
      id: "IMOVEL-3",
      refCode: "TE003",
      title: "Terreno Plano em Condomínio",
      description: "Excelente terreno de 360m² para construir a casa dos seus sonhos em condomínio fechado com segurança 24h.",
      type: "Terreno",
      price: 200000,
      bedrooms: 0,
      bathrooms: 0,
      status: "Disponível",
    },
     {
      id: "IMOVEL-4",
      refCode: "AP004",
      title: "Apartamento para Alugar",
      description: "Apartamento com 1 quarto, mobiliado, pronto para morar.",
      type: "Apartamento",
      price: 1500,
      bedrooms: 1,
      bathrooms: 1,
      status: "Alugado",
    },
    {
      id: "IMOVEL-5",
      refCode: "CA005",
      title: "Casa Charmosa em Bairro Tranquilo",
      description: "Casa com 3 quartos, jardim de inverno e edícula. Perfeita para famílias que buscam sossego.",
      type: "Casa",
      price: 680000,
      bedrooms: 3,
      bathrooms: 2,
      status: "Disponível",
    }
  ];
}


export default async function RadarPage() {
  const clients = await getClients();
  const properties = await getImoveis();

  // We pass all properties to the component, the filtering logic happens on the client side after AI call
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <Telescope className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Radar de Oportunidades</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Selecione um cliente para que a IA encontre os imóveis mais compatíveis com seu perfil de busca.
      </p>
      <RadarDeOportunidades clients={clients} allProperties={properties} />
    </div>
  );
}
