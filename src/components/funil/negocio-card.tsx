import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Negocio } from "@/lib/definitions";
import { User, Calendar, DollarSign, Star, Clock, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NegocioCardProps {
  negocio: Negocio;
  onPriorityChange: (negocioId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

export function NegocioCard({ negocio, onPriorityChange, onEdit, onDelete }: NegocioCardProps) {
  
  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPriorityChange(negocio.id);
  }

  const timeSinceCreation = () => {
    try {
        return formatDistanceToNow(parseISO(negocio.dataCriacao), { addSuffix: true, locale: ptBR });
    } catch (error) {
        return 'Data inválida';
    }
  }

  return (
    <AlertDialog>
      <div className="relative group">
        <Link href={`/negocios/${negocio.id}`} className="block">
          <Card className={cn(
            "mb-2 bg-card hover:bg-card/90 cursor-pointer transition-colors",
            negocio.prioridade && "border-yellow-400 hover:border-yellow-500"
          )}>
            <CardHeader className="p-4 pb-2 pr-10">
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
              <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{format(parseISO(negocio.dataCriacao), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </span>
                  <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{timeSinceCreation()}</span>
                  </span>
              </div>
            </CardContent>
          </Card>
        </Link>
        <div className="absolute top-1 right-1 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      aria-label="Mais opções"
                  >
                      <MoreHorizontal className="h-4 w-4" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleStarClick}>
                    <Star className={cn("mr-2 h-4 w-4", negocio.prioridade && "fill-yellow-400 text-yellow-400")} />
                    {negocio.prioridade ? 'Remover Prioridade' : 'Marcar como Prioridade'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                 </AlertDialogTrigger>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>
       <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o negócio para 
                  <span className="font-semibold"> {negocio.imovelTitulo}</span> com o cliente 
                  <span className="font-semibold"> {negocio.clienteNome}</span>.
              </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
