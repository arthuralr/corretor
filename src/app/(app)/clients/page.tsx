import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/clients/columns";
import { DataTable } from "@/components/data-table";
import type { Client } from "@/lib/definitions";

async function getClients(): Promise<Client[]> {
  // In a real app, you'd fetch this from a database.
  return [
    {
      id: "CLIENT-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
      searchProfile: "Looking for a 3-bedroom house with a yard.",
    },
    {
      id: "CLIENT-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-5678",
      searchProfile: "Wants a modern apartment downtown, 2-bed minimum.",
    },
    {
        id: "CLIENT-3",
        name: "Sam Wilson",
        email: "sam.wilson@example.com",
        phone: "555-9876",
        searchProfile: "Interested in condos with a gym and pool.",
    }
  ];
}

export default async function ClientsPage() {
  const data = await getClients();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Clients</h2>
        <Link href="/clients/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} filterColumnId="name" />
    </div>
  );
}
