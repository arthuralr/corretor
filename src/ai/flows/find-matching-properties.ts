'use server';

/**
 * @fileOverview An AI flow to find matching properties for a client's search profile.
 * 
 * - findMatchingProperties - A function that handles the property matching process.
 * - FindMatchingPropertiesInput - The input type for the findMatchingProperties function.
 * - FindMatchingPropertiesOutput - The return type for the findMatchingProperties function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ImovelSimplificado } from '@/lib/definitions';

const PropertySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['Casa', 'Apartamento', 'Terreno']),
  price: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  status: z.enum(['Disponível', 'Vendido', 'Alugado']),
});

const FindMatchingPropertiesInputSchema = z.object({
  searchProfile: z.string().describe("The client's search profile description."),
  properties: z.array(PropertySchema).describe("A list of available properties to search from."),
});
export type FindMatchingPropertiesInput = z.infer<typeof FindMatchingPropertiesInputSchema>;

const FindMatchingPropertiesOutputSchema = z.object({
  matchingPropertyIds: z.array(z.string()).describe("An array of property IDs that best match the client's search profile. Only include properties with status 'Disponível'."),
});
export type FindMatchingPropertiesOutput = z.infer<typeof FindMatchingPropertiesOutputSchema>;

export async function findMatchingProperties(input: FindMatchingPropertiesInput): Promise<string[]> {
  const matchingProperties = await findMatchingPropertiesFlow(input);
  return matchingProperties.matchingPropertyIds;
}

const prompt = ai.definePrompt({
  name: 'findMatchingPropertiesPrompt',
  input: { schema: FindMatchingPropertiesInputSchema },
  output: { schema: FindMatchingPropertiesOutputSchema },
  prompt: `You are an expert real estate agent. Your task is to analyze a client's search profile and find the best matching properties from a provided list.

Client's Search Profile:
"{{{searchProfile}}}"

Available Properties:
{{#each properties}}
- ID: {{{id}}}
  Title: {{{title}}}
  Description: {{{description}}}
  Type: {{{type}}}
  Price: R$ {{{price}}}
  Bedrooms: {{{bedrooms}}}
  Bathrooms: {{{bathrooms}}}
  Status: {{{status}}}
---
{{/each}}

Carefully review the client's search profile and compare it against the details of each property. Only consider properties with the status 'Disponível'. Return the IDs of the properties that are the most relevant matches.`,
});

const findMatchingPropertiesFlow = ai.defineFlow(
  {
    name: 'findMatchingPropertiesFlow',
    inputSchema: FindMatchingPropertiesInputSchema,
    outputSchema: FindMatchingPropertiesOutputSchema,
  },
  async (input) => {
    // Filter properties to only include available ones before sending to the AI
    const availableProperties = input.properties.filter(p => p.status === 'Disponível');
    
    if (availableProperties.length === 0) {
        return { matchingPropertyIds: [] };
    }

    const { output } = await prompt({ ...input, properties: availableProperties });
    return output!;
  }
);
