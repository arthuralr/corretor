"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import {
  generatePropertyDescription,
  GeneratePropertyDescriptionInput,
} from "@/ai/flows/generate-property-description";

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

const formSchema = z.object({
  endereco: z.string().min(1, "O endereço é obrigatório"),
  tipoImovel: z.string().min(1, "O tipo de imóvel é obrigatório"),
  quartos: z.coerce.number().min(0),
  banheiros: z.coerce.number().min(1),
  area: z.coerce.number().min(1, "A área é obrigatória"),
  comodidades: z.string().min(1, "Pelo menos uma comodidade é obrigatória"),
  descricaoExistente: z.string().optional(),
});

export function GeneratorForm() {
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endereco: "Rua das Flores, 123, São Paulo, SP",
      tipoImovel: "Apartamento",
      quartos: 3,
      banheiros: 2,
      area: 120,
      comodidades: "piscina, garagem, piso de madeira, cozinha planejada",
      descricaoExistente: "",
    },
  });

  async function onSubmit(values: GeneratePropertyDescriptionInput) {
    setIsLoading(true);
    setGeneratedDescription("");
    try {
      const result = await generatePropertyDescription(values);
      setGeneratedDescription(result.description);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao gerar a descrição. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDescription);
    toast({
      title: "Copiado!",
      description: "A descrição foi copiada para sua área de transferência.",
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
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua das Flores, 123, São Paulo, SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoImovel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Imóvel</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo de imóvel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Apartamento">Apartamento</SelectItem>
                          <SelectItem value="Condomínio">Condomínio</SelectItem>
                          <SelectItem value="Sobrado">Sobrado</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quartos"
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
                  name="banheiros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="comodidades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comodidades e Características</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ex: piscina, garagem, piso de madeira..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Lista de características separadas por vírgula.
                    </FormDescription>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="descricaoExistente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opcional: Suas Notas / Descrição Existente</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Qualquer detalhe adicional para incluir..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar Descrição"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Descrição Gerada</CardTitle>
          {generatedDescription && (
            <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {generatedDescription && (
             <Textarea value={generatedDescription} readOnly className="h-full text-base leading-relaxed" />
          )}
          {!isLoading && !generatedDescription && (
            <div className="flex items-center justify-center h-full rounded-lg border border-dashed text-muted-foreground text-center p-4">
                A descrição do seu imóvel gerada por IA aparecerá aqui.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
