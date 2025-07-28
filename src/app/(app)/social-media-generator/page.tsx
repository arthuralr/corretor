import { SocialPostForm } from "@/components/social/social-post-form";
import { Instagram } from "lucide-react";

export default function SocialMediaGeneratorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
            <Instagram className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">Gerador de Posts para Redes Sociais</h2>
        </div>
      </div>
      <p className="text-muted-foreground">
        Preencha os detalhes do imóvel e deixe a IA criar um post incrível para suas redes sociais.
      </p>
      <SocialPostForm />
    </div>
  );
}
