// The AI flow that generates property descriptions based on property details provided as input.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GeneratePropertyDescriptionInputSchema = z.object({
  endereco: z.string().describe('O endereço completo do imóvel.'),
  tipoImovel: z
    .string()
    .describe(
      'O tipo de imóvel. Ex: Casa, Apartamento, Condomínio, Sobrado.'
    ),
  quartos: z.number().describe('O número de quartos no imóvel.'),
  banheiros: z.number().describe('O número de banheiros no imóvel.'),
  area: z.number().describe('A área do imóvel em metros quadrados.'),
  comodidades: z
    .string()
    .describe(
      'Uma lista de comodidades separadas por vírgula. Ex: piscina, garagem, piso de madeira.'
    ),
  descricaoExistente: z.string().optional().describe('Qualquer descrição ou anotação existente sobre o imóvel.'),
});

export type GeneratePropertyDescriptionInput =
  z.infer<typeof GeneratePropertyDescriptionInputSchema>;

const GeneratePropertyDescriptionOutputSchema = z.object({
  description: z.string().describe('A descrição do imóvel gerada.'),
});

export type GeneratePropertyDescriptionOutput =
  z.infer<typeof GeneratePropertyDescriptionOutputSchema>;

export async function generatePropertyDescription(
  input: GeneratePropertyDescriptionInput
): Promise<GeneratePropertyDescriptionOutput> {
  return generatePropertyDescriptionFlow(input);
}

const generatePropertyDescriptionPrompt = ai.definePrompt({
  name: 'generatePropertyDescriptionPrompt',
  input: {schema: GeneratePropertyDescriptionInputSchema},
  output: {schema: GeneratePropertyDescriptionOutputSchema},
  prompt: `Você é uma redatora imobiliária especialista em criar textos em português do Brasil. Gere uma descrição de imóvel envolvente e informativa com base nos seguintes detalhes:

Endereço: {{{endereco}}}
Tipo de Imóvel: {{{tipoImovel}}}
Quartos: {{{quartos}}}
Banheiros: {{{banheiros}}}
Área: {{{area}}}m²
Comodidades: {{{comodidades}}}

Descrição Existente: {{{descricaoExistente}}}

Escreva uma descrição atraente que destaque as principais características e benefícios do imóvel. Mantenha o texto conciso e profissional, visando potenciais compradores. A descrição deve ter aproximadamente 150-200 palavras e ser em português.`,
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePropertyDescriptionFlow',
    inputSchema: GeneratePropertyDescriptionInputSchema,
    outputSchema: GeneratePropertyDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generatePropertyDescriptionPrompt(input);
    return output!;
  }
);
