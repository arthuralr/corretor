

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
  
  type: 'Apartamento' | 'Casa' | 'Terreno' | 'Sala Comercial';
  subType?: string; // e.g., Cobertura, Kitnet, Casa de Condomínio
  
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  
  status: 'Ativo' | 'Inativo' | 'Vendido' | 'Alugado';

  sellPrice?: number;
  rentPrice?: number;
  condoPrice?: number;

  area: number;
  bedrooms: number;
  suites?: number;
  bathrooms: number;
  parkingSpaces?: number;

  imageUrls?: string[];
  mainImageUrl?: string;
  
  // Deprecated fields, kept for compatibility if needed, but should be migrated
  price: number; 
  imageUrl?: string;
  createdAt?: string;
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
  taxaComissao?: number;
  recomendadoCliente?: boolean;
  documentos?: Documento[];
  prioridade?: boolean;
};

// Simplified version for the AI flow
export type ImovelSimplificado = {
  id: string;
  title: string;
  description: string;
  type: Imovel['type'];
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: Imovel['status'];
};

export type TaskPriority = 'Baixa' | 'Média' | 'Alta';
export type TaskCategory = 'Visita' | 'Reunião' | 'Ligação' | 'Prazo';

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO String
  completed: boolean;
  clientId?: string;
  clientName?: string;
  negocioId?: string;
  negocioTitle?: string;
  imovelId?: string;
  imovelTitle?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
};

export type MessageTemplate = {
    id: string;
    title: string;
    content: string;
};

export type ActivityLog = {
    id: string;
    type: 'negocio' | 'cliente' | 'imovel';
    description: string;
    timestamp: string; // ISO String
    link?: string;
}

export type DespesaCategoria = 'Marketing' | 'Aluguel' | 'Salários' | 'Comissões' | 'Outros';

export type Despesa = {
    id: string;
    description: string;
    value: number;
    date: string; // ISO String
    category: DespesaCategoria;
}

export type Entrada = {
  id: string;
  origem: string;
  valor: number;
  dataRecebimento: string; // ISO String
}
