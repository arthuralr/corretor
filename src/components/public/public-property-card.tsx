import type { Imovel } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, AreaChart } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { Button } from "../ui/button";

interface PublicPropertyCardProps {
  property: Imovel;
}

const formatPrice = (property: Imovel) => {
    const price = property.rentPrice || property.sellPrice;
    if (price === undefined) return "Consulte";
    
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);

    return property.rentPrice ? `${formatted}/mês` : formatted;
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const imageUrl = property.mainImageUrl || (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : null) || 'https://placehold.co/600x400.png';
  const price = formatPrice(property);

  return (
    <Card className="flex flex-col h-full bg-public-card hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
        <Link href={`/imovel/${property.id}`} className="block">
            <div className="aspect-video bg-public-muted flex items-center justify-center relative">
                <Image 
                    src={imageUrl}
                    alt={property.title} 
                    fill
                    className="object-cover"
                    data-ai-hint="house exterior"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                 <Badge variant="secondary" className="absolute top-2 left-2 bg-public-primary/20 text-public-primary border-public-primary/30">{property.type}</Badge>
            </div>
        </Link>
      <CardHeader className="p-4">
        <Link href={`/imovel/${property.id}`}>
            <CardTitle className="text-lg font-bold text-public-heading hover:text-public-primary transition-colors line-clamp-1">{property.title}</CardTitle>
        </Link>
        <CardDescription className="text-sm pt-1 text-public-muted-foreground">
            {property.neighborhood}, {property.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-public-foreground space-y-3 flex-grow">
        <div className="flex items-center justify-between text-sm text-public-foreground/80 border-t border-b border-public-border py-3">
            <span className="flex items-center gap-1.5"><AreaChart className="w-4 h-4 text-public-primary/70" /> {property.area} m²</span>
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-public-primary/70" /> {property.bedrooms} quartos</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-public-primary/70" /> {property.bathrooms} banh.</span>
        </div>
        <p className="line-clamp-3 text-sm text-public-muted-foreground">{property.description}</p>
      </CardContent>
       <CardFooter className="p-4 bg-public-muted/50">
          <div className="w-full flex justify-between items-center">
             <p className="text-xl font-bold text-public-primary">{price}</p>
             <Link href={`/imovel/${property.id}`}>
                <Button>Ver Detalhes</Button>
            </Link>
          </div>
      </CardFooter>
    </Card>
  );
}
