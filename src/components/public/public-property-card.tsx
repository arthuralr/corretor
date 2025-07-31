
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
    if (!price) return "Consulte";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const { siteConfig } = useSiteConfig();
  const imageUrl = property.mainImageUrl || "https://placehold.co/600x400.png";
  const price = property.rentPrice || property.sellPrice;

  return (
    <Card className="flex flex-col h-full bg-public-card hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-lg border-public-border">
      <Link href={`/imoveis/${property.id}`} className="block">
        <div className="aspect-video bg-public-muted flex items-center justify-center relative">
            <Image 
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              data-ai-hint="house exterior" />
             <Badge variant="secondary" className="absolute top-3 left-3 bg-white text-gray-800">{property.type}</Badge>
        </div>
      </Link>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold text-public-heading hover:text-public-primary transition-colors">
             <Link href={`/imoveis/${property.id}`}>{property.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-public-muted-foreground flex items-center gap-1.5 pt-1">
           <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-public-foreground space-y-3 flex-grow">
        <div className="flex items-center justify-between text-sm pt-2 text-public-muted-foreground">
            <span className="flex items-center gap-1.5"><BedDouble className="w-5 h-5 text-public-primary" /> {property.bedrooms} quartos</span>
            <span className="flex items-center gap-1.5"><Bath className="w-5 h-5 text-public-primary" /> {property.bathrooms} banheiros</span>
             <span className="flex items-center gap-1.5"><AreaChart className="w-5 h-5 text-public-primary" /> {property.area} m²</span>
        </div>
      </CardContent>
       <CardFooter className="p-4 bg-public-muted">
          <div className="w-full">
            <p className="text-xs text-public-muted-foreground">{property.rentPrice ? 'Aluguel' : 'Venda'}</p>
            <p className="text-xl font-bold text-public-primary w-full">{formatPrice(price)}{property.rentPrice ? <span className="text-sm font-normal">/mês</span> : ''}</p>
          </div>
      </CardFooter>
    </Card>
  );
}
