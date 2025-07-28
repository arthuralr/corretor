import { GeneratorForm } from "@/components/ai/generator-form";
import { WandSparkles } from "lucide-react";

export default function AIGeneratorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <WandSparkles className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">AI Listing Generator</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Fill in the property details below and let AI craft a compelling listing description for you.
      </p>
      <GeneratorForm />
    </div>
  );
}
