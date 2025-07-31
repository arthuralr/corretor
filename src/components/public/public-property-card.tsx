
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Imovel } from "@/lib/definitions";
import { BedDouble, Bath, AreaChart, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";

interface PropertyCardProps {
  property: Imovel;
}

const formatPrice = (price: number | undefined) => {
  if (price === undefined || price === null) return "Consulte";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export function PublicPropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.mainImageUrl || (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : null) || "https://placehold.co/600x400.png";
  const { siteConfig } = useSiteConfig();
  const price = property.rentPrice || property.sellPrice;
  const priceLabel = property.rentPrice ? <span className="text-sm font-normal text-public-muted-foreground">/mês</span> : null;

  return (
    <Card className="flex flex-col h-full bg-public-card hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg group">
      <Link href={`/imoveis/${property.id}`} className="block">
        <div className="aspect-video bg-public-muted flex items-center justify-center relative overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={property.title} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="house exterior" />
            <Badge variant="secondary" className="absolute top-3 left-3 bg-public-primary/80 text-public-primary-foreground border-transparent">
              {property.type}
            </Badge>
        </div>
      </Link>
      <CardHeader className="p-4">
         <Link href={`/imoveis/${property.id}`} className="block">
            <CardTitle className="text-lg font-bold text-public-heading group-hover:text-public-primary transition-colors truncate">{property.title}</CardTitle>
            {property.neighborhood && property.city && (
                <CardDescription className="text-sm text-public-muted-foreground flex items-center gap-1 pt-1">
                    <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.city}
                </CardDescription>
            )}
         </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-public-foreground space-y-3 flex-grow">
        <div className="flex items-center justify-between text-sm pt-2">
            <span className="flex items-center gap-1.5"><AreaChart className="w-4 h-4 text-public-primary" /> {property.area} m²</span>
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-public-primary" /> {property.bedrooms} quartos</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-public-primary" /> {property.bathrooms} banh.</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-public-muted/50">
        <div className="w-full">
            <p className="text-xl font-bold text-public-primary">{formatPrice(price)} {priceLabel}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
