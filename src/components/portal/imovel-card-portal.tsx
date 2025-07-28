import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Imovel } from "@/lib/definitions";
import { BedDouble, Bath, RulerSquare } from 'lucide-react';

interface ImovelCardProps {
  imovel: Imovel;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
}

export function ImovelCardPortal({ imovel }: ImovelCardProps) {
  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-lg transition-shadow duration-300">
      {/* In a real app, you would use next/image here */}
      <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
          <img src={`https://placehold.co/600x400.png`} alt={imovel.title} className="object-cover w-full h-full rounded-t-lg" data-ai-hint="house exterior" />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold">{imovel.title}</CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap">{imovel.type}</Badge>
        </div>
        <CardDescription className="text-xs pt-1">
            {imovel.refCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-3 flex-grow">
         <p className="line-clamp-3 text-sm">{imovel.description}</p>
        <div className="flex items-center justify-between text-xs pt-2 text-foreground/80">
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-primary/70" /> {imovel.bedrooms} quartos</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-primary/70" /> {imovel.bathrooms} banheiros</span>
        </div>
      </CardContent>
       <CardFooter className="p-4 border-t">
          <p className="text-xl font-bold text-primary w-full">{formatPrice(imovel.price)}</p>
      </CardFooter>
    </Card>
  );
}
