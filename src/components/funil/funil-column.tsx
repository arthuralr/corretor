
"use client";

import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { Negocio, EtapaFunil } from "@/lib/definitions";
import { NegocioCard } from './negocio-card';

interface FunilColumnProps {
  etapa: EtapaFunil;
  negocios: Negocio[];
  onPriorityChange: (negocioId: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

export function FunilColumn({ etapa, negocios, onPriorityChange }: FunilColumnProps) {
  const totalValor = negocios.reduce((sum, negocio) => sum + negocio.valorProposta, 0);

  return (
    <div className="flex flex-col rounded-lg bg-muted/50">
        <div className="p-4 text-center border-b">
            <h3 className="text-lg font-semibold tracking-tight font-headline">
                {etapa} ({negocios.length})
            </h3>
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
                                    <NegocioCard negocio={negocio} onPriorityChange={onPriorityChange} />
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
