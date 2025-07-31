
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
    if (price === undefined) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const { siteConfig } = useSiteConfig();
  const imageUrl = property.mainImageUrl || 'https://placehold.co/600x400.png';
  
  const getPrice = () => {
    if (property.rentPrice) {
        return <p className="text-xl font-bold text-public-primary">{formatPrice(property.rentPrice)}<span className="text-sm font-medium text-public-muted-foreground">/mês</span></p>
    }
    if (property.sellPrice) {
        return <p className="text-xl font-bold text-public-primary">{formatPrice(property.sellPrice)}</p>
    }
    return <p className="text-lg font-semibold text-public-primary">Consulte</p>;
  }

  return (
    <Card className="flex flex-col h-full bg-public-card hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <Link href={`/imoveis/${property.id}`} className="flex flex-col h-full">
        <div className="aspect-video bg-public-muted flex items-center justify-center relative overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={property.title} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="house exterior" />
             <div className="absolute top-2 right-2 flex gap-1">
                {property.exclusive && <Badge>Exclusivo</Badge>}
                <Badge variant="secondary" className="bg-public-primary/20 text-public-primary border-public-primary/30">{property.type}</Badge>
            </div>
        </div>
        <CardHeader className="p-4">
            <CardTitle className="text-lg font-bold text-public-heading group-hover:text-public-primary transition-colors">{property.title}</CardTitle>
            <CardDescription className="text-sm text-public-muted-foreground flex items-center gap-1 pt-1">
                <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.city}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-public-foreground space-y-3 flex-grow">
          <div className="flex items-center justify-start text-sm text-public-muted-foreground gap-4 border-t pt-4 mt-4">
              <span className="flex items-center gap-1.5"><AreaChart className="w-4 h-4 text-public-primary" /> {property.area} m²</span>
              <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-public-primary" /> {property.bedrooms} quartos</span>
              <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-public-primary" /> {property.bathrooms} banheiros</span>
          </div>
        </CardContent>
         <CardFooter className="p-4 bg-public-muted/50">
            {getPrice()}
        </CardFooter>
      </Link>
    </Card>
  );
}
