import { ImovelForm } from "@/components/imoveis/imovel-form";

export default function NovoImovelPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Adicionar Novo Imóvel</h2>
      </div>
      <ImovelForm />
    </div>
  );
}
