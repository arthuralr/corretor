
"use client";

import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { Negocio, EtapaFunil } from "@/lib/definitions";
import { NegocioCard } from './negocio-card';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

interface FunilColumnProps {
  etapa: EtapaFunil;
  negocios: Negocio[];
  onPriorityChange: (negocioId: string) => void;
  onAddNegocio: (etapa: EtapaFunil) => void;
  onEditNegocio: (negocio: Negocio) => void;
  onDeleteNegocio: (negocioId: string, etapa: EtapaFunil) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

export function FunilColumn({ etapa, negocios, onPriorityChange, onAddNegocio, onEditNegocio, onDeleteNegocio }: FunilColumnProps) {
  const totalValor = negocios.reduce((sum, negocio) => sum + negocio.valorProposta, 0);

  return (
    <div className="flex flex-col rounded-lg bg-muted/50">
        <div className="p-4 text-center border-b">
            <div className='flex items-center justify-center gap-2'>
              <h3 className="text-lg font-semibold tracking-tight font-headline">
                  {etapa} ({negocios.length})
              </h3>
               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAddNegocio(etapa)}>
                 <PlusCircle className="h-4 w-4" />
               </Button>
            </div>
            <p className="text-sm font-bold text-primary/80 mt-1">
                {formatCurrency(totalValor)}
            </p>
        </div>
        <Droppable droppableId={etapa}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-grow p-2 space-y-2 transition-colors duration-200 ease-in-out min-h-[200px] ${snapshot.isDraggingOver ? 'bg-primary/10' : ''}`}
                >
                    {negocios.map((negocio, index) => (
                       <Draggable key={negocio.id} draggableId={negocio.id} index={index}>
                            {(provided, snapshot) => (
                                <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? 'shadow-lg' : ''}
                                >
                                    <NegocioCard 
                                      negocio={negocio} 
                                      onPriorityChange={onPriorityChange}
                                      onEdit={() => onEditNegocio(negocio)} 
                                      onDelete={() => onDeleteNegocio(negocio.id, etapa)}
                                    />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </div>
  );
}
