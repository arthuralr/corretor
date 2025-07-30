
import { FunilBoard } from "@/components/funil/funil-board";
import { DollarSign } from "lucide-react";

export default async function FunilPage() {
  return (
    <div className="flex flex-col flex-1 space-y-4 p-4 md:p-8 pt-6 h-full">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Funil de Vendas</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Arraste os cards para mover os negócios ou use a busca para filtrar.
      </p>
      <div className="flex-1 overflow-x-auto pb-4">
        <FunilBoard />
      </div>
    </div>
  );
}
