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
  description: z.string().describe('The generated property description.'),
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
  prompt: `You are a real estate copywriter. Generate an engaging and informative property description based on the following details:

Address: {{{address}}}
Property Type: {{{propertyType}}}
Bedrooms: {{{bedrooms}}}
Bathrooms: {{{bathrooms}}}
Square Footage: {{{squareFootage}}}
Amenities: {{{amenities}}}

Existing Description: {{{description}}}

Write a compelling description that highlights the key features and benefits of the property. Keep it concise and professional, targeting potential buyers. The description should be approximately 150-200 words.`,
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
