'use server';

/**
 * @fileOverview Um fluxo de IA para gerar posts para redes sociais sobre imóveis.
 * 
 * - generateSocialMediaPost - A função que lida com a geração de posts.
 * - GenerateSocialMediaPostInput - O tipo de entrada para a função.
 * - GenerateSocialMediaPostOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  propertyType: z
    .string()
    .describe('O tipo de imóvel. Ex: Casa, Apartamento, Terreno'),
  location: z.string().describe('O bairro ou cidade onde o imóvel está localizado.'),
  bedrooms: z.number().describe('O número de quartos.'),
  bathrooms: z.number().describe('O número de banheiros.'),
  keyFeatures: z
    .string()
    .describe(
      'Uma lista de características principais separadas por vírgula. Ex: piscina, área gourmet, vista para o mar'
    ),
    price: z.string().describe('O preço do imóvel (como texto, ex: R$ 500.000).'),
});

export type GenerateSocialMediaPostInput =
  z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  postText: z.string().describe('O texto gerado para a postagem na rede social.'),
  hashtags: z.array(z.string()).describe('Uma lista de hashtags relevantes para a postagem.'),
});

export type GenerateSocialMediaPostOutput =
  z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const generateSocialMediaPostPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `Você é um especialista em marketing imobiliário para redes sociais. Sua tarefa é criar um post curto e atrativo para Instagram e Facebook com base nos detalhes de um imóvel. O post deve ser otimista, usar emojis relevantes e terminar com uma chamada para ação clara.

Detalhes do Imóvel:
- Tipo: {{{propertyType}}}
- Localização: {{{location}}}
- Quartos: {{{bedrooms}}}
- Banheiros: {{{bathrooms}}}
- Características Principais: {{{keyFeatures}}}
- Preço: {{{price}}}

Gere o texto do post e uma lista de 5 a 7 hashtags populares e relevantes em português.`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await generateSocialMediaPostPrompt(input);
    return output!;
  }
);
