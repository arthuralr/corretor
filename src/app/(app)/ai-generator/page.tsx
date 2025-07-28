import { GeneratorForm } from "@/components/ai/generator-form";
import { WandSparkles } from "lucide-react";

export default function AIGeneratorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <WandSparkles className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Gerador de Anúncios com IA</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Preencha os detalhes do imóvel abaixo e deixe a IA criar uma descrição incrível para você.
      </p>
      <GeneratorForm />
    </div>
  );
}
