
'use client'

import type { Imovel } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, AreaChart } from 'lucide-react';

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
};

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const imageUrl = (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : property.imageUrl) || 'https://placehold.co/600x400.png';
  const price = property.sellPrice || property.rentPrice;

  return (
    <Card className="flex flex-col h-full bg-public-card hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden group">
      <Link href={`/imovel/${property.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-video bg-public-muted flex items-center justify-center relative overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={property.title} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="house exterior" 
            />
            <Badge variant="secondary" className="absolute top-3 left-3 bg-public-primary text-public-primary-foreground">{property.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-public-heading truncate">{property.title}</h3>
          <p className="text-sm text-public-muted-foreground">{property.neighborhood}, {property.city}</p>
          <div className="flex items-center justify-between text-sm pt-2 text-public-foreground/90">
            <span className="flex items-center gap-2"><AreaChart className="w-4 h-4 text-public-primary" /> {property.area} m²</span>
            <span className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-public-primary" /> {property.bedrooms} quartos</span>
            <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-public-primary" /> {property.bathrooms} banheiros</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-public-muted/50 mt-auto">
            <div className="w-full">
                <p className="text-xs text-public-muted-foreground">{property.rentPrice ? 'Aluguel' : 'Venda'}</p>
                <p className="text-xl font-bold text-public-primary">{formatPrice(price)}</p>
            </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
