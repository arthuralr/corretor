import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/properties/columns";
import { DataTable } from "@/components/data-table";
import type { Property } from "@/lib/definitions";

async function getProperties(): Promise<Property[]> {
  // In a real app, you'd fetch this from a database.
  return [
    {
      id: "PROP-1",
      address: "123 Main St, Anytown, USA",
      price: 500000,
      type: "Casa",
      status: "À Venda",
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 2500,
      imageUrl: "https://placehold.co/100x100.png",
      amenities: ["Piscina", "Garagem"],
    },
    {
      id: "PROP-2",
      address: "456 Oak Ave, Anytown, USA",
      price: 2500,
      type: "Apartamento",
      status: "Para Alugar",
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200,
      imageUrl: "https://placehold.co/100x100.png",
      amenities: ["Academia", "Sacada"],
    },
    {
      id: "PROP-3",
      address: "789 Pine Ln, Anytown, USA",
      price: 750000,
      type: "Casa",
      status: "Vendido",
      bedrooms: 5,
      bathrooms: 4.5,
      squareFootage: 3500,
      imageUrl: "https://placehold.co/100x100.png",
      amenities: ["Jardim", "Lareira"],
    },
  ];
}

export default async function PropertiesPage() {
  const data = await getProperties();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Propriedades</h2>
        <Link href="/properties/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Imóvel
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} filterColumnId="address" filterPlaceholder="Filtrar por endereço..." />
    </div>
  );
}
