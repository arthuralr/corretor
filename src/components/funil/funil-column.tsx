
"use client";

import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { Negocio, EtapaFunil } from "@/lib/definitions";
import { NegocioCard } from './negocio-card';

interface FunilColumnProps {
  etapa: EtapaFunil;
  negocios: Negocio[];
  onPriorityChange: (negocioId: string) => void;
}

export function FunilColumn({ etapa, negocios, onPriorityChange }: FunilColumnProps) {
  return (
    <div className="flex flex-col rounded-lg bg-muted/50">
        <h3 className="p-4 text-lg font-semibold tracking-tight font-headline text-center border-b">
            {etapa} ({negocios.length})
        </h3>
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
