import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Imovel } from "@/lib/definitions";
import { BedDouble, Bath, Tag, RulerSquare } from 'lucide-react';

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

export function ImovelCard({ imovel }: ImovelCardProps) {
  return (
    <Card className="flex flex-col h-full bg-card hover:bg-card/90">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-base font-semibold">{imovel.title}</CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap">{imovel.type}</Badge>
        </div>
        <CardDescription className="text-xs pt-1">
            {imovel.refCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-3 flex-grow">
         <p className="line-clamp-3 text-sm">{imovel.description}</p>
        <div className="flex items-center justify-between text-xs pt-2">
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> {imovel.bedrooms} quartos</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> {imovel.bathrooms} banh.</span>
        </div>
      </CardContent>
       <CardFooter className="p-4 pt-0">
          <p className="text-lg font-bold text-primary w-full">{formatPrice(imovel.price)}</p>
      </CardFooter>
    </Card>
  );
}
