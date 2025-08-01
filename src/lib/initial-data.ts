

import type { Negocio, Imovel, Client, Task, Lead } from './definitions';

export const getInitialNegocios = (): Negocio[] => {
  const today = new Date().toISOString();
  return [
    {
      id: "NEG-1",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-1",
      imovelTitulo: "Casa Espaçosa com Piscina",
      etapa: "Proposta",
      dataCriacao: today,
      valorProposta: 745000,
      taxaComissao: 6,
      recomendadoCliente: true,
      prioridade: true,
    },
    {
      id: "NEG-2",
      clienteId: "CLIENT-2",
      clienteNome: "Jane Smith",
      imovelId: "IMOVEL-2",
      imovelTitulo: "Apartamento Moderno no Centro",
      etapa: "Visita",
      dataCriacao: "2024-07-25",
      valorProposta: 450000,
      taxaComissao: 5,
      prioridade: false,
    },
    {
      id: "NEG-3",
      clienteId: "CLIENT-3",
      clienteNome: "Sam Wilson",
      imovelId: "IMOVEL-3",
      imovelTitulo: "Terreno Plano em Condomínio",
      etapa: "Contato",
      dataCriacao: "2024-07-29",
      valorProposta: 200000,
      taxaComissao: 6,
      prioridade: false,
    },
     {
      id: "NEG-4",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-4",
      imovelTitulo: "Apartamento para Alugar",
      etapa: "Fechado - Ganho",
      dataCriacao: today,
      valorProposta: 1500,
      taxaComissao: 10,
      prioridade: false,
    },
     {
      id: "NEG-5",
      clienteId: "CLIENT-2",
      clienteNome: "Jane Smith",
      imovelId: "IMOVEL-1",
      imovelTitulo: "Casa Espaçosa com Piscina",
      etapa: "Fechado - Perdido",
      dataCriacao: "2024-06-15",
      valorProposta: 750000,
      taxaComissao: 6,
      prioridade: false,
    },
    {
      id: "NEG-6",
      clienteId: "CLIENT-3",
      clienteNome: "Sam Wilson",
      imovelId: "IMOVEL-2",
      imovelTitulo: "Apartamento Moderno no Centro",
      etapa: "Fechado - Ganho",
      dataCriacao: today,
      valorProposta: 480000,
      taxaComissao: 5,
      prioridade: false,
    },
     {
      id: "NEG-7",
      clienteId: "CLIENT-1",
      clienteNome: "John Doe",
      imovelId: "IMOVEL-5",
      imovelTitulo: "Casa Charmosa em Bairro Tranquilo",
      etapa: "Visita",
      dataCriacao: "2024-07-30",
      valorProposta: 680000,
      recomendadoCliente: true,
      prioridade: false,
    },
  ];
};

export const getInitialImoveis = (): Imovel[] => {
  return [
    {
      id: "IMOVEL-1",
      refCode: "CA001",
      title: "Casa Espaçosa com Piscina",
      description: "Uma bela casa com 3 quartos, 2 banheiros e uma grande área de lazer com piscina.",
      type: "Casa",
      sellPrice: 750000,
      bedrooms: 3,
      bathrooms: 2,
      area: 250,
      status: "Ativo",
      mainImageUrl: "https://placehold.co/600x400.png?text=Frente",
      imageUrls: ["https://placehold.co/600x400.png?text=Frente", "https://placehold.co/600x400.png?text=Sala", "https://placehold.co/600x400.png?text=Piscina"],
      createdAt: new Date().toISOString()
    },
    {
      id: "IMOVEL-2",
      refCode: "AP002",
      title: "Apartamento Moderno no Centro",
      description: "Apartamento de 2 quartos totalmente reformado no coração da cidade.",
      type: "Apartamento",
      sellPrice: 450000,
      bedrooms: 2,
      bathrooms: 1,
      area: 90,
      status: "Vendido",
      mainImageUrl: "https://placehold.co/600x400.png",
      createdAt: new Date().toISOString()
    },
    {
      id: "IMOVEL-3",
      refCode: "TE003",
      title: "Terreno Plano em Condomínio",
      description: "Excelente terreno para construir a casa dos seus sonhos em condomínio fechado.",
      type: "Terreno",
      sellPrice: 200000,
      bedrooms: 0,
      bathrooms: 0,
      area: 1000,
      status: "Ativo",
      createdAt: new Date().toISOString()
    },
     {
      id: "IMOVEL-4",
      refCode: "AP004",
      title: "Apartamento para Alugar",
      description: "Apartamento com 1 quarto, mobiliado, pronto para morar.",
      type: "Apartamento",
      rentPrice: 1500,
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      status: "Alugado",
      createdAt: new Date().toISOString()
    },
    { 
      id: "IMOVEL-5", 
      refCode: "CA005", 
      title: "Casa Charmosa em Bairro Tranquilo", 
      description: "Casa com 3 quartos, jardim de inverno e edícula. Perfeita para famílias que buscam sossego.", 
      type: "Casa", 
      sellPrice: 680000,
      bedrooms: 3, 
      bathrooms: 2, 
      area: 180,
      status: "Ativo", 
      mainImageUrl: "https://placehold.co/600x400.png",
      imageUrls: ["https://placehold.co/600x400.png"]
    }
  ];
};


export const getInitialClients = (): Client[] => {
  return [
    {
      id: "CLIENT-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
      searchProfile: "Looking for a 3-bedroom house with a yard.",
    },
    {
      id: "CLIENT-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-5678",
      searchProfile: "Wants a modern apartment downtown, 2-bed minimum.",
    },
    {
        id: "CLIENT-3",
        name: "Sam Wilson",
        email: "sam.wilson@example.com",
        phone: "555-9876",
        searchProfile: "Interested in condos with a gym and pool.",
    }
  ];
};

export const getInitialTasks = (): Task[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
        { id: 'TASK-1', title: 'Follow-up com cliente John Doe', description: 'Ligar para discutir a contra-proposta.', dueDate: today.toISOString(), completed: false, priority: 'Alta', category: 'Ligação' },
        { id: 'TASK-2', title: 'Preparar apresentação do imóvel AP002', description: 'Montar slides com fotos e detalhes.', dueDate: tomorrow.toISOString(), completed: false, priority: 'Média', category: 'Prazo' },
        { id: 'TASK-3', title: 'Visita ao imóvel com Jane Smith', description: 'Levar a cliente para conhecer a casa CA001.', dueDate: tomorrow.toISOString(), completed: false, priority: 'Alta', category: 'Visita'},
    ];
};

export const getInitialLeads = (): Lead[] => {
    return [
        {
          id: `LEAD-${Date.now() - 10000}`,
          name: "Ana Silva",
          email: "ana.silva@example.com",
          phone: "11 98765-4321",
          interest: "Casa Espaçosa com Piscina",
          source: "Site - Imóvel CA001",
          createdAt: new Date(Date.now() - 10000).toISOString(),
          status: 'Novo',
        },
        {
          id: `LEAD-${Date.now() - 20000}`,
          name: "Carlos Pereira",
          email: "carlos.p@example.com",
          phone: "21 91234-5678",
          interest: "Falar com um corretor",
          message: "Gostaria de entender melhor as opções de financiamento.",
          source: "Site - Contato",
          createdAt: new Date(Date.now() - 20000).toISOString(),
          status: 'Em Contato',
        }
    ]
}
