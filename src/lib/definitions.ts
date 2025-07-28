export type Property = {
  id: string;
  address: string;
  price: number;
  type: 'House' | 'Apartment' | 'Condo' | 'Townhouse';
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
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
  type: 'Casa' | 'Apartamento' | 'Terreno';
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: 'Disponível' | 'Vendido' | 'Alugado';
};

export type EtapaFunil = 'Contato' | 'Atendimento' | 'Visita' | 'Proposta' | 'Reserva' | 'Fechado - Ganho' | 'Fechado - Perdido';

export type Negocio = {
  id: string;
  clienteId: string;
  clienteNome: string;
  imovelId: string;
  imovelTitulo: string;
  etapa: EtapaFunil;
  dataCriacao: string;
  valorProposta: number;
};
