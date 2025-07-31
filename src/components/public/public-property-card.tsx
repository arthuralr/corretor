
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Imovel } from "@/lib/definitions";
import { BedDouble, Bath, RulerSquare, MapPin } from 'lucide-react';
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
  const imageUrl = (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : property.mainImageUrl) || 'https://placehold.co/600x400.png';
  const { siteConfig } = useSiteConfig();
  const primaryColor = siteConfig.primaryColor || '#22426A';

  return (
    <Card className="flex flex-col h-full bg-public-card hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden group">
      <Link href={`/imoveis/${property.id}`} className="flex flex-col h-full">
        <div className="aspect-video bg-public-muted flex items-center justify-center relative overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={property.title} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="house exterior" />
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg font-bold text-public-heading group-hover:text-public-primary transition-colors">{property.title}</CardTitle>
          </div>
           {property.neighborhood && property.city && (
            <CardDescription className="text-xs pt-1 flex items-center gap-1.5 text-public-muted-foreground">
                <MapPin className="w-3 h-3"/> {property.neighborhood}, {property.city}
            </CardDescription>
           )}
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-public-foreground space-y-3 flex-grow">
          <div className="flex items-center justify-around text-xs pt-2 border-t text-center">
              <span className="flex flex-col items-center gap-1.5"><RulerSquare className="w-5 h-5 text-public-muted-foreground" /> {property.area} m²</span>
              <span className="flex flex-col items-center gap-1.5"><BedDouble className="w-5 h-5 text-public-muted-foreground" /> {property.bedrooms} quartos</span>
              <span className="flex flex-col items-center gap-1.5"><Bath className="w-5 h-5 text-public-muted-foreground" /> {property.bathrooms} banh.</span>
          </div>
        </CardContent>
         <CardFooter className="p-4" style={{ backgroundColor: primaryColor }}>
            <p className="text-xl font-bold text-public-primary-foreground w-full text-center">
                {property.rentPrice ? (
                    <>
                        {formatPrice(property.rentPrice)}<span className="text-sm font-normal">/mês</span>
                    </>
                ) : (
                    formatPrice(property.sellPrice)
                )}
            </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
