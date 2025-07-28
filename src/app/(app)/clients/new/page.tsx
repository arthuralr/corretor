import { ClientForm } from "@/components/clients/client-form";

export default function NewClientPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Add New Client</h2>
      </div>
      <ClientForm />
    </div>
  );
}
