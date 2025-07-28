import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Negocio } from "@/lib/definitions";
import { User, Home, Calendar, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from "next/link";

interface NegocioCardProps {
  negocio: Negocio;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

export function NegocioCard({ negocio }: NegocioCardProps) {
  return (
    <Link href={`/negocios/${negocio.id}`} className="block">
      <Card className="mb-2 bg-card hover:bg-card/90 cursor-pointer">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base font-semibold">{negocio.imovelTitulo}</CardTitle>
          <CardDescription className="text-xs flex items-center gap-1.5 pt-1">
              <User className="w-3 h-3"/>
              {negocio.clienteNome}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2 text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 font-semibold text-primary/90">
              <DollarSign className="w-4 h-4" />
              <span>{formatPrice(negocio.valorProposta)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-3 h-3" />
              <span>Criado em: {format(parseISO(negocio.dataCriacao), "dd/MM/yyyy", { locale: ptBR })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
