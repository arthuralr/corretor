
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
    if (price === undefined) return 'Consulte';
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const { siteConfig } = useSiteConfig();
  const imageUrl = (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : property.mainImageUrl) || 'https://placehold.co/600x400.png';
  const price = property.sellPrice || property.rentPrice;

  return (
    <Link href={`/imoveis/${property.id}`} className="block h-full">
        <Card className="flex flex-col h-full bg-public-card hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video bg-public-muted rounded-t-lg flex items-center justify-center relative">
            <Image 
                src={imageUrl} 
                alt={property.title} 
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint="house exterior" 
            />
        </div>
        <CardHeader className="p-4">
            <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-bold text-public-heading line-clamp-2">{property.title}</CardTitle>
                <Badge variant="secondary" className="whitespace-nowrap bg-public-primary/10 text-public-primary border-public-primary/20">{property.type}</Badge>
            </div>
             <CardDescription className="text-sm pt-1 text-public-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4"/>
                {property.neighborhood}, {property.city}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-public-foreground space-y-3 flex-grow">
            <div className="flex items-center justify-start text-sm pt-2 gap-4 border-t border-public-border pt-4">
                <span className="flex items-center gap-1.5"><AreaChart className="w-4 h-4 text-public-primary" /> {property.area} m²</span>
                <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-public-primary" /> {property.bedrooms}</span>
                <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-public-primary" /> {property.bathrooms}</span>
            </div>
        </CardContent>
        <CardFooter className="p-4 bg-public-muted/50 rounded-b-lg">
            <p className="text-xl font-bold text-public-primary w-full">
                {formatPrice(price)}
                {property.rentPrice && <span className="text-sm font-normal text-public-muted-foreground">/mês</span>}
            </p>
        </CardFooter>
        </Card>
    </Link>
  );
}
