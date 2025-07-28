"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import {
  generateSocialMediaPost,
  GenerateSocialMediaPostInput,
} from "@/ai/flows/generate-social-media-post";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  propertyType: z.string().min(1, "O tipo de imóvel é obrigatório"),
  location: z.string().min(1, "A localização é obrigatória"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(1),
  keyFeatures: z.string().min(1, "Pelo menos uma característica é obrigatória"),
  price: z.string().min(1, "O preço é obrigatório"),
});

export function SocialPostForm() {
  const [generatedPost, setGeneratedPost] = useState<{postText: string; hashtags: string[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "Apartamento",
      location: "Copacabana, Rio de Janeiro",
      bedrooms: 3,
      bathrooms: 2,
      keyFeatures: "piscina, área gourmet, vista para o mar",
      price: "R$ 1.200.000",
    },
  });

  async function onSubmit(values: GenerateSocialMediaPostInput) {
    setIsLoading(true);
    setGeneratedPost(null);
    try {
      const result = await generateSocialMediaPost(values);
      setGeneratedPost(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao gerar o post. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = () => {
    if (!generatedPost) return;
    const fullText = `${generatedPost.postText}\n\n${generatedPost.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    toast({
      title: "Copiado!",
      description: "O post foi copiado para sua área de transferência.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Detalhes do Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Imóvel</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Apartamento">Apartamento</SelectItem>
                          <SelectItem value="Terreno">Terreno</SelectItem>
                          <SelectItem value="Cobertura">Cobertura</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização (Bairro/Cidade)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ipanema, Rio de Janeiro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartos</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: R$ 750.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="keyFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Características Principais</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: piscina, área gourmet, vista para o mar..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Liste as características mais atrativas, separadas por vírgula.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Post...
                  </>
                ) : (
                  "Gerar Post"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Post Gerado</CardTitle>
          {generatedPost && (
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {generatedPost && (
             <div className="bg-muted/30 p-4 rounded-md border h-full whitespace-pre-wrap font-body text-sm">
                {generatedPost.postText}
             </div>
          )}
           {generatedPost && generatedPost.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {generatedPost.hashtags.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
            </div>
           )}
          {!isLoading && !generatedPost && (
            <div className="flex items-center justify-center h-full rounded-lg border border-dashed text-muted-foreground text-center p-4">
                Seu post para redes sociais aparecerá aqui.
            </div>
          )}
        </CardContent>
        {generatedPost && (
            <CardFooter>
                <Button className="w-full" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copiar Post Completo</Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
