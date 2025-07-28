import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, ChevronLeft, Building } from "lucide-react";
import Link from "next/link";
import type { Negocio, Imovel } from "@/lib/definitions";
import { ImovelCardPortal } from "@/components/portal/imovel-card-portal";

// MOCK DATA FETCHING

// In a real app, you would get the logged-in client's ID from the session
const MOCKED_CLIENT_ID = "CLIENT-1";

async function getRecommendedPropertiesForClient(clientId: string): Promise<Imovel[]> {
    // 1. Fetch all deals
    const allNegocios: Negocio[] = [
        { id: "NEG-1", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-1", imovelTitulo: "Casa Espaçosa com Piscina", etapa: "Proposta", dataCriacao: "2024-07-28", valorProposta: 745000, recomendadoCliente: true },
        { id: "NEG-2", clienteId: "CLIENT-2", clienteNome: "Jane Smith", imovelId: "IMOVEL-2", imovelTitulo: "Apartamento Moderno no Centro", etapa: "Visita", dataCriacao: "2024-07-25", valorProposta: 450000 },
        { id: "NEG-7", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-5", imovelTitulo: "Casa Charmosa em Bairro Tranquilo", etapa: "Visita", dataCriacao: "2024-07-30", valorProposta: 680000, recomendadoCliente: true },
        { id: "NEG-8", clienteId: "CLIENT-1", clienteNome: "John Doe", imovelId: "IMOVEL-3", imovelTitulo: "Terreno Plano em Condomínio", etapa: "Contato", dataCriacao: "2024-08-01", valorProposta: 200000, recomendadoCliente: false },
    ];

    // 2. Fetch all properties
    const allImoveis: Imovel[] = [
        { id: "IMOVEL-1", refCode: "CA001", title: "Casa Espaçosa com Piscina", description: "Uma bela casa com 3 quartos, 2 banheiros e uma grande área de lazer com piscina.", type: "Casa", price: 750000, bedrooms: 3, bathrooms: 2, status: "Disponível" },
        { id: "IMOVEL-2", refCode: "AP002", title: "Apartamento Moderno no Centro", description: "Apartamento de 2 quartos totalmente reformado no coração da cidade.", type: "Apartamento", price: 450000, bedrooms: 2, bathrooms: 1, status: "Vendido" },
        { id: "IMOVEL-3", refCode: "TE003", title: "Terreno Plano em Condomínio", description: "Excelente terreno para construir a casa dos seus sonhos em condomínio fechado.", type: "Terreno", price: 200000, bedrooms: 0, bathrooms: 0, status: "Disponível" },
        { id: "IMOVEL-4", refCode: "AP004", title: "Apartamento para Alugar", description: "Apartamento com 1 quarto, mobiliado, pronto para morar.", type: "Apartamento", price: 1500, bedrooms: 1, bathrooms: 1, status: "Alugado" },
        { id: "IMOVEL-5", refCode: "CA005", title: "Casa Charmosa em Bairro Tranquilo", description: "Casa com 3 quartos, jardim de inverno e edícula. Perfeita para famílias que buscam sossego.", type: "Casa", price: 680000, bedrooms: 3, bathrooms: 2, status: "Disponível"}
    ];
    
    // 3. Filter deals for the specific client and where recommended is true
    const recommendedDealIds = allNegocios
        .filter(n => n.clienteId === clientId && n.recomendadoCliente)
        .map(n => n.imovelId);

    // 4. Filter properties based on the recommended deal IDs
    const recommendedProperties = allImoveis.filter(i => recommendedDealIds.includes(i.id));

    return recommendedProperties;
}


export default async function RecommendedPropertiesPage() {
    const properties = await getRecommendedPropertiesForClient(MOCKED_CLIENT_ID);

  return (
    <div>
        <header className="bg-card border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 font-headline text-lg font-semibold">
                    <Building className="h-6 w-6 text-primary" />
                    <span>Imóveis Recomendados</span>
                </div>
                <Link href="/portal/login">
                    <Button variant="outline" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </Link>
            </div>
        </header>
        <main className="container mx-auto p-4 md:p-8 space-y-6">
            <Link href="/portal/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
                Voltar para o Painel
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-headline">Imóveis Selecionados para Você</h1>
                <p className="text-muted-foreground">Aqui estão os imóveis que nosso time selecionou com base no seu perfil.</p>
            </div>

            {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(imovel => (
                        <ImovelCardPortal key={imovel.id} imovel={imovel} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg bg-muted/50">
                    <p className="text-lg font-semibold">Nenhum imóvel recomendado no momento.</p>
                    <p className="text-muted-foreground mt-2">Fique de olho! Em breve teremos novidades para você.</p>
                </div>
            )}
            
        </main>
    </div>
  );
}
