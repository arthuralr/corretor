
'use client'

import React, { useEffect, useState } from "react";
import { Home, Tag, DollarSign, BedDouble, Bath, CheckSquare, XSquare, Info, CalendarCheck, Image as ImageIcon, ChevronLeft, ChevronRight, Building, AreaChart, Briefcase, LandPlot, ShowerHead } from "lucide-react";
import type { Imovel } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getInitialImoveis } from "@/lib/initial-data";
import { PropertyContactForm } from "@/components/public/property-contact-form";

const IMOVEIS_STORAGE_KEY = 'imoveisData';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const imovelId = params.id;

  useEffect(() => {
    if (imovelId) {
      setLoading(true);
      try {
        const savedData = window.localStorage.getItem(IMOVEIS_STORAGE_KEY);
        const imoveis = savedData ? JSON.parse(savedData) : getInitialImoveis();
        const foundImovel = imoveis.find((i: Imovel) => i.id === imovelId) || null;
        setImovel(foundImovel);
      } catch (error) {
        console.error("Failed to load property data", error);
        setImovel(null);
      } finally {
        setLoading(false);
      }
    }
  }, [imovelId]);

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };
  
  const images = imovel?.imageUrls && imovel.imageUrls.length > 0 
    ? imovel.imageUrls 
    : (imovel?.imageUrl ? [imovel.imageUrl] : []);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-12 w-2/3 mb-8" />
             <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <Skeleton className="w-full h-48 rounded-lg" />
                </div>
                <div className="md:col-span-1">
                    <Skeleton className="w-full h-96 rounded-lg" />
                </div>
             </div>
        </div>
    )
  }

  if (!imovel) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-public-heading">Imóvel não encontrado</h1>
        <p className="text-lg text-public-muted-foreground mt-4">O imóvel que você está procurando não foi encontrado.</p>
        <Link href="/inicio">
            <Button className="mt-6">Voltar para a Página Inicial</Button>
        </Link>
      </div>
    );
  }

  return (
     <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* Coluna Esquerda e Principal */}
        <div className="md:col-span-2 space-y-8">
           {/* Título e Preço */}
           <div>
            <Badge variant="secondary" className="mb-2 bg-public-primary/10 text-public-primary border-public-primary/20">{imovel.type}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-public-heading">{imovel.title}</h1>
            <p className="text-lg text-public-muted-foreground mt-2">{imovel.neighborhood}, {imovel.city}</p>
            <div className="mt-4">
                {imovel.rentPrice ? (
                    <p className="text-3xl font-bold text-public-primary">{formatPrice(imovel.rentPrice)}<span className="text-lg font-medium text-public-muted-foreground">/mês</span></p>
                ) : (
                    <p className="text-3xl font-bold text-public-primary">{formatPrice(imovel.sellPrice)}</p>
                )}
                {imovel.condoPrice && <p className="text-sm text-public-muted-foreground">Condomínio: {formatPrice(imovel.condoPrice)}</p>}
            </div>
           </div>

          {/* Galeria de Imagens */}
          {images.length > 0 && (
            <Carousel className="w-full max-w-full">
              <CarouselContent>
                {images.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="relative aspect-video">
                        <Image
                          src={url}
                          alt={`${imovel.title} - Imagem ${index + 1}`}
                          fill
                          className="object-cover rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
          )}

          {/* Descrição */}
          <Card className="bg-public-card">
            <CardHeader><CardTitle className="text-public-heading">Descrição</CardTitle></CardHeader>
            <CardContent className="text-public-foreground prose max-w-none">
              <p>{imovel.description}</p>
            </CardContent>
          </Card>

          {/* Detalhes */}
          <Card className="bg-public-card">
            <CardHeader><CardTitle className="text-public-heading">Detalhes</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6 text-public-foreground">
              <div className="flex items-center gap-2"><AreaChart className="w-5 h-5 text-public-primary" /> <span><span className="font-semibold">{imovel.area}</span> m² de área</span></div>
              <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-public-primary" /> <span><span className="font-semibold">{imovel.bedrooms}</span> quartos</span></div>
              {imovel.suites && <div className="flex items-center gap-2"><ShowerHead className="w-5 h-5 text-public-primary" /> <span><span className="font-semibold">{imovel.suites}</span> suítes</span></div>}
              <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-public-primary" /> <span><span className="font-semibold">{imovel.bathrooms}</span> banheiros</span></div>
              {imovel.parkingSpaces && <div className="flex items-center gap-2"><Building className="w-5 h-5 text-public-primary" /> <span><span className="font-semibold">{imovel.parkingSpaces}</span> vagas</span></div>}
              {imovel.type === 'Terreno' && <div className="flex items-center gap-2"><LandPlot className="w-5 h-5 text-public-primary" /> <span>Terreno</span></div>}
            </CardContent>
          </Card>
           
          {imovel.amenities && imovel.amenities.length > 0 && (
             <Card className="bg-public-card">
                <CardHeader><CardTitle className="text-public-heading">Comodidades</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {imovel.amenities.map(item => (
                        <Badge key={item} variant="outline" className="text-public-foreground">{item}</Badge>
                    ))}
                </CardContent>
            </Card>
          )}

        </div>

        {/* Coluna Direita - Formulário de Contato */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
             <Card className="bg-public-card shadow-lg">
                <CardHeader>
                    <CardTitle className="text-public-heading">Ficou interessado?</CardTitle>
                    <CardDescription className="text-public-muted-foreground">Envie uma mensagem para o corretor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PropertyContactForm propertyTitle={imovel.title} />
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
