
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Imovel } from "@/lib/definitions";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { addActivityLog } from "@/lib/activity-log";
import { Trash2, PlusCircle } from "lucide-react";
import { MaskedInput } from "../ui/masked-input";

const IMOVEIS_STORAGE_KEY = 'imoveisData';

const formSchema = z.object({
  refCode: z.string().min(1, "O código de referência é obrigatório"),
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  type: z.enum(["Casa", "Apartamento", "Terreno", "Cobertura"]),
  price: z.coerce.number().min(1, "O preço é obrigatório"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  status: z.enum(["Disponível", "Vendido", "Alugado"]),
  imageUrls: z.array(z.object({ value: z.string().url("URL inválida") })),
});

type ImovelFormValues = z.infer<typeof formSchema>;

interface ImovelFormProps {
    initialData?: Imovel;
}

export function ImovelForm({ initialData }: ImovelFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const form = useForm<ImovelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
        ? { ...initialData, imageUrls: initialData.imageUrls?.map(url => ({ value: url })) || (initialData.imageUrl ? [{ value: initialData.imageUrl }] : []) }
        : {
            refCode: "",
            title: "",
            description: "",
            type: "Casa",
            price: 0,
            bedrooms: 3,
            bathrooms: 2,
            status: "Disponível",
            imageUrls: [{ value: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrls",
  });

  function onSubmit(values: ImovelFormValues) {
    try {
        const savedData = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
        const imoveis: Imovel[] = savedData ? JSON.parse(savedData) : [];
        
        const finalImageUrls = values.imageUrls.map(urlObj => urlObj.value).filter(Boolean);
        const submissionData = { ...values, imageUrls: finalImageUrls, imageUrl: finalImageUrls[0] || '' };

        if (isEditing) {
            // Update existing imovel
            const updatedImoveis = imoveis.map(imovel => 
                imovel.id === initialData.id ? { ...imovel, ...submissionData } : imovel
            );
            window.localStorage.setItem(IMOVEIS_STORAGE_KEY, JSON.stringify(updatedImoveis));
             addActivityLog({
                type: 'imovel',
                description: `Imóvel "${values.title}" atualizado.`,
                link: `/imoveis/${initialData.id}`
            });
            toast({
              title: "Imóvel Atualizado!",
              description: "As informações do imóvel foram salvas.",
            });
        } else {
            // Create new imovel
            const newImovel: Imovel = {
                id: `IMOVEL-${Date.now()}`,
                ...submissionData,
                description: values.description || '',
                createdAt: new Date().toISOString(),
            };
            imoveis.push(newImovel);
            window.localStorage.setItem(IMOVEIS_STORAGE_KEY, JSON.stringify(imoveis));
            addActivityLog({
                type: 'imovel',
                description: `Novo imóvel "${values.title}" adicionado.`,
                link: `/imoveis/${newImovel.id}`
            });
            toast({
              title: "Imóvel Salvo!",
              description: "O novo imóvel foi adicionado aos seus registros.",
            });
        }
        
        window.dispatchEvent(new CustomEvent('dataUpdated'));
        router.push("/imoveis");
        router.refresh(); 

    } catch (error) {
        console.error("Falha ao salvar imóvel no localStorage", error);
        toast({
            title: "Erro ao Salvar",
            description: "Não foi possível salvar o imóvel. Tente novamente.",
            variant: "destructive",
        });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
             <CardTitle className="font-headline">{isEditing ? 'Editar Imóvel' : 'Detalhes do Novo Imóvel'}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="refCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Referência</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: CA001, AP002" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Anúncio</FormLabel>
                  <FormControl>
                    <Input placeholder="Casa com 3 quartos no centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os principais detalhes e características do imóvel..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                     <MaskedInput
                      mask="R$ num"
                      blocks={{
                        num: {
                          mask: Number,
                          thousandsSeparator: '.',
                          radix: ',',
                          scale: 2,
                          padFractionalZeros: true,
                          min: 0,
                          max: 999999999
                        }
                      }}
                      unmaskedValue={String(field.value)}
                      onAccept={(value: any) => field.onChange(value)}
                      placeholder="R$ 500.000,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Imóvel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
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
                    <FormMessage />
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
                      <Input type="number" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Disponível">Disponível</SelectItem>
                      <SelectItem value="Vendido">Vendido</SelectItem>
                      <SelectItem value="Alugado">Alugado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2 space-y-4">
              <FormLabel>URLs das Imagens</FormLabel>
               <CardDescription>
                Adicione as URLs das imagens do imóvel. A primeira URL será usada como imagem de capa.
               </CardDescription>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`imageUrls.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="https://exemplo.com/imagem.png" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar mais URLs
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Salvar Imóvel'}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

    

    