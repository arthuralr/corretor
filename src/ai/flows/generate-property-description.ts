// The AI flow that generates property descriptions based on property details provided as input.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertyDescriptionInputSchema = z.object({
  address: z.string().describe('The full address of the property.'),
  propertyType: z
    .string()
    .describe(
      'The type of property, e.g., house, apartment, condominium, townhouse.'
    ),
  bedrooms: z.number().describe('The number of bedrooms in the property.'),
  bathrooms: z.number().describe('The number of bathrooms in the property.'),
  squareFootage: z.number().describe('The square footage of the property.'),
  amenities: z
    .string()
    .describe(
      'A comma-separated list of amenities, e.g., swimming pool, garage, hardwood floors.'
    ),
  description: z.string().optional().describe('Any existing description of the property.'),
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

Endereço: {{{address}}}
Tipo de Imóvel: {{{propertyType}}}
Quartos: {{{bedrooms}}}
Banheiros: {{{bathrooms}}}
Área: {{{squareFootage}}}m²
Comodidades: {{{amenities}}}

Descrição Existente: {{{description}}}

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
