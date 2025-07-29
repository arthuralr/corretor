

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Imovel } from "@/lib/definitions";
import React, { useState, useEffect } from "react";
import { ImovelType, Subtypes, AmenitiesList } from "@/lib/definitions";

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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { addActivityLog } from "@/lib/activity-log";
import { Trash2, PlusCircle, Star, UploadCloud, Loader2 } from "lucide-react";
import { MaskedInput } from "../ui/masked-input";
import { cn } from "@/lib/utils";

const IMOVEIS_STORAGE_KEY = 'imoveisData';

const formSchema = z.object({
  refCode: z.string().min(1, "O código de referência é obrigatório"),
  title: z.string().min(1, "O título do anúncio é obrigatório."),
  
  type: z.enum(["Apartamento", "Casa", "Terreno", "Comercial"]),
  subType: z.string().optional(),
  
  cep: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),

  status: z.enum(["Ativo", "Inativo", "Vendido", "Alugado"]),
  exclusive: z.boolean().default(false),
  
  sellPrice: z.string().optional(),
  rentPrice: z.string().optional(),
  condoPrice: z.string().optional(),

  area: z.coerce.number().min(1, "A área útil é obrigatória"),
  bedrooms: z.coerce.number().min(0, "A quantidade de quartos não pode ser negativa"),
  suites: z.coerce.number().min(0, "A quantidade de suítes não pode ser negativa"),
  bathrooms: z.coerce.number().min(0, "A quantidade de banheiros não pode ser negativa"),
  parkingSpaces: z.coerce.number().min(0, "A quantidade de vagas não pode ser negativa"),
  amenities: z.array(z.string()).optional(),

  description: z.string().optional(),
  
  imageUrls: z.array(z.object({ value: z.string().url("URL da imagem inválida.") })),
  mainImageUrl: z.string().optional(),

}).refine(data => data.sellPrice || data.rentPrice, {
  message: "É necessário preencher o 'Valor de Venda' ou o 'Valor de Aluguel'.",
  path: ["sellPrice"],
});

type ImovelFormValues = z.infer<typeof formSchema>;

interface ImovelFormProps {
    initialData?: Imovel;
}

const parseCurrency = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    return Number(String(value).replace(/\./g, '').replace(',', '.'));
};

export function ImovelForm({ initialData }: ImovelFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ImovelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
        ? {
            ...initialData,
            sellPrice: String(initialData.sellPrice || ''),
            rentPrice: String(initialData.rentPrice || ''),
            condoPrice: String(initialData.condoPrice || ''),
            imageUrls: initialData.imageUrls?.map(url => ({ value: url })) || [],
            mainImageUrl: initialData.mainImageUrl,
            area: initialData.area || 0,
            bedrooms: initialData.bedrooms || 0,
            bathrooms: initialData.bathrooms || 0,
            suites: initialData.suites || 0,
            parkingSpaces: initialData.parkingSpaces || 0,
            status: initialData.status || 'Ativo',
            type: initialData.type || 'Apartamento',
            exclusive: initialData.exclusive || false,
            amenities: initialData.amenities || []
          }
        : {
            refCode: "",
            title: "",
            status: "Ativo",
            type: "Apartamento",
            area: 0,
            bedrooms: 0,
            suites: 0,
            bathrooms: 0,
            parkingSpaces: 0,
            imageUrls: [],
            exclusive: false,
            amenities: [],
        },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "imageUrls",
  });
  
  const mainImageUrl = form.watch("mainImageUrl");
  const selectedType = form.watch("type");

  useEffect(() => {
    // Reset subtype when type changes
    form.setValue("subType", undefined);
  }, [selectedType, form]);

  const handleSetMainImage = (url: string) => {
    form.setValue("mainImageUrl", url);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    // Mock upload - in a real app, this would upload to cloud storage
    // and return URLs. Here we'll use placeholder.co
    setTimeout(() => {
        const newUrls = Array.from(files).map((file, index) => ({
            value: `https://placehold.co/600x400.png?text=Imagem+${fields.length + index + 1}`
        }));
        
        append(newUrls);

        // If it's the first image, set it as main
        if (!mainImageUrl && newUrls.length > 0) {
            form.setValue('mainImageUrl', newUrls[0].value);
        }

        setIsUploading(false);
        toast({
            title: "Imagens Adicionadas",
            description: `${files.length} imagem(ns) foram adicionadas à galeria.`
        })
    }, 1000);
  }

  function onSubmit(values: ImovelFormValues) {
    try {
        const savedData = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
        const imoveis: Imovel[] = savedData ? JSON.parse(savedData) : [];
        
        const finalImageUrls = values.imageUrls.map(urlObj => urlObj.value);
        
        const submissionData = { 
            ...values,
            sellPrice: parseCurrency(values.sellPrice),
            rentPrice: parseCurrency(values.rentPrice),
            condoPrice: parseCurrency(values.condoPrice),
            imageUrls: finalImageUrls, 
            mainImageUrl: values.mainImageUrl || finalImageUrls[0] || '',
            // Ensure compatibility with old fields if needed
            price: parseCurrency(values.sellPrice) || parseCurrency(values.rentPrice) || 0,
            imageUrl: values.mainImageUrl || finalImageUrls[0] || '',
        };

        if (isEditing && initialData) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Informações Essenciais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <FormItem className="md:col-span-2">
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
                                {(Object.keys(Subtypes) as ImovelType[]).map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="subType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Subtipo de Imóvel</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedType}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedType ? "Selecione um tipo primeiro" : "Selecione o subtipo"} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {selectedType && Subtypes[selectedType].map(subtype => (
                                    <SelectItem key={subtype} value={subtype}>{subtype}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status do Anúncio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
                                <SelectItem value="Vendido">Vendido</SelectItem>
                                <SelectItem value="Alugado">Alugado</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="exclusive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:col-span-3">
                            <div className="space-y-0.5">
                                <FormLabel>Contrato de Exclusividade</FormLabel>
                                <FormDescription>
                                    Marque se você possui exclusividade na negociação deste imóvel.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                 />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-6">
                 <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                                <Input placeholder="00000-000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem className="md:col-span-4">
                            <FormLabel>Logradouro (Rua, Av.)</FormLabel>
                            <FormControl>
                                <Input placeholder="Av. Paulista" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem className="md:col-span-1">
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                                <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                                <Input placeholder="Bela Vista" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                 <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                                <Input placeholder="São Paulo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem className="md:col-span-1">
                            <FormLabel>Estado (UF)</FormLabel>
                            <FormControl>
                                <Input placeholder="SP" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Valores</CardTitle>
                 <CardDescription>Pelo menos um dos campos (Venda ou Aluguel) deve ser preenchido.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="sellPrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor de Venda (R$)</FormLabel>
                        <FormControl>
                           <MaskedInput
                                mask="num"
                                blocks={{
                                    num: { mask: Number, thousandsSeparator: '.', radix: ',', scale: 0 }
                                }}
                                unmaskedValue={field.value}
                                onAccept={field.onChange}
                                placeholder="R$ 500.000"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="rentPrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor de Aluguel (R$)</FormLabel>
                        <FormControl>
                            <MaskedInput
                                mask="num"
                                blocks={{
                                    num: { mask: Number, thousandsSeparator: '.', radix: ',', scale: 0 }
                                }}
                                unmaskedValue={field.value}
                                onAccept={field.onChange}
                                placeholder="R$ 2.500"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="condoPrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor do Condomínio (R$)</FormLabel>
                        <FormControl>
                             <MaskedInput
                                mask="num"
                                blocks={{
                                    num: { mask: Number, thousandsSeparator: '.', radix: ',', scale: 0 }
                                }}
                                unmaskedValue={field.value}
                                onAccept={field.onChange}
                                placeholder="R$ 500"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Características e Descrição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Área Útil (m²)</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="120" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
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
                        name="suites"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Suítes</FormLabel>
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
                                <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="parkingSpaces"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vagas</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descrição do Imóvel</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Descreva os principais detalhes e características do imóvel..."
                            className="resize-y min-h-[150px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Características e Comodidades</CardTitle>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="amenities"
                    render={() => (
                        <FormItem>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {AmenitiesList.map((item) => (
                                <FormField
                                    key={item}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                    return (
                                        <FormItem
                                            key={item}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), item])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                            (value) => value !== item
                                                        )
                                                        )
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {item}
                                        </FormLabel>
                                        </FormItem>
                                    )
                                    }}
                                />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Galeria de Fotos do Imóvel</CardTitle>
                <CardDescription>
                Adicione as fotos do imóvel. A primeira foto será a capa do anúncio, mas você pode escolher outra clicando na estrela.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative group aspect-square">
                           <img src={field.value} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSetMainImage(field.value)}
                                className="text-white hover:text-yellow-400"
                                >
                                <Star className={cn("h-5 w-5", mainImageUrl === field.value && "fill-yellow-400 text-yellow-400")} />
                                </Button>
                                <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-white hover:text-destructive"
                                >
                                <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                            {mainImageUrl === field.value && (
                                <div className="absolute top-1 right-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                </div>
                            )}
                        </div>
                    ))}
                     <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            {isUploading ? (
                                <>
                                 <Loader2 className="w-8 h-8 mb-4 text-muted-foreground animate-spin"/>
                                 <p className="mb-2 text-sm text-muted-foreground">Enviando...</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground"/>
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Adicionar fotos</span></p>
                                </>
                            )}
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} multiple accept="image/*"/>
                    </label>
                 </div>
                 <FormField
                    control={form.control}
                    name="imageUrls"
                    render={() => (
                        <FormItem>
                         <FormMessage className="mt-4" />
                        </FormItem>
                    )}
                    />
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Salvar Imóvel'}</Button>
        </div>
      </form>
    </Form>
  );
}
