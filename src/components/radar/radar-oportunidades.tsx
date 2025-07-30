
"use client";

import { useState } from "react";
import type { Client, Imovel, ImovelSimplificado } from "@/lib/definitions";
import { findMatchingProperties } from "@/ai/flows/find-matching-properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ArrowRight } from "lucide-react";
import { ImovelCard } from "./imovel-card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

interface RadarDeOportunidadesProps {
  clients: Client[];
  allProperties: Imovel[];
  isLoading: boolean;
}

export function RadarDeOportunidades({ clients, allProperties, isLoading: isDataLoading }: RadarDeOportunidadesProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [matchingProperties, setMatchingProperties] = useState<Imovel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleClientSelect = async (client: Client) => {
    setSelectedClient(client);
    setMatchingProperties([]);
    
    if (!client.searchProfile) {
        toast({ title: "Perfil de Busca Vazio", description: "Este cliente não possui um perfil de busca para análise.", variant: "destructive" });
        return;
    }

    setIsSearching(true);
    
    const simplifiedProperties: ImovelSimplificado[] = allProperties.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.type,
        price: p.sellPrice || p.rentPrice || 0,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        status: p.status,
    }));

    try {
      const matchingIds = await findMatchingProperties({
        searchProfile: client.searchProfile,
        properties: simplifiedProperties,
      });

      const matched = allProperties.filter(p => matchingIds.includes(p.id));
      setMatchingProperties(matched);

    } catch (error) {
      console.error("Error finding matching properties:", error);
      toast({
        title: "Erro na Busca",
        description: "Ocorreu um erro ao buscar imóveis. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-start">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Clientes</CardTitle>
          <CardDescription>Selecione um cliente para iniciar a busca.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            {isDataLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : (
                <div className="space-y-2">
                {clients.map((client) => (
                    <Button
                    key={client.id}
                    variant={selectedClient?.id === client.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => handleClientSelect(client)}
                    disabled={isSearching}
                    >
                    <div>
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{client.searchProfile || "Sem perfil de busca"}</p>
                    </div>
                    </Button>
                ))}
                </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Imóveis Compatíveis</CardTitle>
          <CardDescription>
            {selectedClient 
              ? `Exibindo imóveis para ${selectedClient.name}` 
              : "Selecione um cliente para ver as oportunidades."}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[60vh] -mx-6 px-6">
                {isSearching && (
                    <div className="flex items-center justify-center h-full flex-col gap-4 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>A IA está buscando as melhores oportunidades...</p>
                    </div>
                )}
                {!isSearching && !selectedClient && (
                    <div className="flex items-center justify-center h-full flex-col gap-4 text-center text-muted-foreground">
                        <ArrowRight className="h-8 w-8" />
                        <p>Comece selecionando um cliente na lista ao lado.</p>
                    </div>
                )}
                {!isSearching && selectedClient && matchingProperties.length === 0 && (
                     <div className="flex items-center justify-center h-full flex-col gap-4 text-center text-muted-foreground">
                        <p>Nenhum imóvel compatível encontrado para este cliente no momento.</p>
                    </div>
                )}
                {!isSearching && matchingProperties.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {matchingProperties.map(imovel => (
                            <ImovelCard key={imovel.id} imovel={imovel} />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
