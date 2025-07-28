export type Property = {
  id: string;
  address: string;
  price: number;
  type: 'Casa' | 'Apartamento' | 'Condomínio' | 'Sobrado';
  status: 'À Venda' | 'Para Alugar' | 'Vendido' | 'Alugado';
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  imageUrl: string;
  amenities: string[];
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  searchProfile: string;
};

export type Imovel = {
  id: string;
  refCode: string;
  title: string;
  description: string;
  type: 'Casa' | 'Apartamento' | 'Terreno' | 'Cobertura';
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: 'Disponível' | 'Vendido' | 'Alugado';
  imageUrl?: string;
};

export type EtapaFunil = 'Contato' | 'Atendimento' | 'Visita' | 'Proposta' | 'Reserva' | 'Fechado - Ganho' | 'Fechado - Perdido';

export type Documento = {
  id: string;
  name: string;
  url: string; // In a real app, this would be a URL to cloud storage
  type: 'pdf' | 'image' | 'word' | 'other';
  size: number; // in bytes
};

export type Negocio = {
  id: string;
  clienteId: string;
  clienteNome: string;
  imovelId: string;
  imovelTitulo: string;
  etapa: EtapaFunil;
  dataCriacao: string;
  valorProposta: number;
  recomendadoCliente?: boolean;
  documentos?: Documento[];
};

// Simplified version for the AI flow
export type ImovelSimplificado = {
  id: string;
  title: string;
  description: string;
  type: 'Casa' | 'Apartamento' | 'Terreno' | 'Cobertura';
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: 'Disponível' | 'Vendido' | 'Alugado';
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO String
  completed: boolean;
  clientId?: string;
  negocioId?: string;
  clientName?: string;
  negocioTitle?: string;
};

export type MessageTemplate = {
    id: string;
    title: string;
    content: string;
};
