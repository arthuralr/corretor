
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Imovel } from "@/lib/definitions";
import { BedDouble, Bath, AreaChart, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";

interface PublicPropertyCardProps {
  property: Imovel;
}

const formatPrice = (price: number | undefined) => {
    if (!price) return 'Consulte';
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const { siteConfig } = useSiteConfig();
  const imageUrl = (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : property.mainImageUrl) || 'https://placehold.co/600x400.png';
  const price = property.rentPrice ? `${formatPrice(property.rentPrice)}/mês` : formatPrice(property.sellPrice);

  return (
    <Card className="flex flex-col h-full bg-public-card hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
       <Link href={`/imoveis/${property.id}`} className="block">
            <div className="aspect-video bg-public-muted flex items-center justify-center relative overflow-hidden">
                <Image 
                    src={imageUrl} 
                    alt={property.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="house exterior" 
                />
                 <Badge variant="secondary" className="absolute top-3 left-3 bg-public-primary text-public-primary-foreground">
                    {property.type}
                </Badge>
            </div>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/imoveis/${property.id}`} className="block">
            <CardTitle className="text-lg font-bold text-public-heading truncate group-hover:text-public-primary transition-colors">{property.title}</CardTitle>
        </Link>
        <CardDescription className="text-sm text-public-muted-foreground flex items-center gap-1.5 pt-1">
            <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-public-foreground space-y-3 flex-grow">
        <div className="flex items-center justify-around text-center text-xs pt-2 border-t border-public-border">
            <span className="flex flex-col items-center gap-1.5 p-2"><AreaChart className="w-5 h-5 text-public-muted-foreground" /> {property.area} m²</span>
            <span className="flex flex-col items-center gap-1.5 p-2"><BedDouble className="w-5 h-5 text-public-muted-foreground" /> {property.bedrooms} quartos</span>
            <span className="flex flex-col items-center gap-1.5 p-2"><Bath className="w-5 h-5 text-public-muted-foreground" /> {property.bathrooms} banh.</span>
        </div>
      </CardContent>
       <CardFooter className="p-4 bg-public-muted/50">
           <Link href={`/imoveis/${property.id}`} className="w-full">
                <p className="text-xl font-bold text-public-primary w-full">{price}</p>
           </Link>
      </CardFooter>
    </Card>
  );
}
