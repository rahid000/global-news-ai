
'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate an image for a news article based on its summary.
 *
 * - generateArticleImage - A function that triggers the image generation flow.
 * - GenerateArticleImageInput - The input type for the generateArticleImage function.
 * - GenerateArticleImageOutput - The return type for the generateArticleImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleImageInputSchema = z.object({
  articleSummary: z
    .string()
    .describe('The summary of the news article to generate an image for.'),
});
export type GenerateArticleImageInput = z.infer<typeof GenerateArticleImageInputSchema>;

const GenerateArticleImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'The generated image as a data URI that includes a MIME type and uses Base64 encoding. It should be in the format: data:<mimetype>;base64,<encoded_data>.'
    )
    .nullable(),
});
export type GenerateArticleImageOutput = z.infer<typeof GenerateArticleImageOutputSchema>;

export async function generateArticleImage(
  input: GenerateArticleImageInput
): Promise<GenerateArticleImageOutput> {
  return generateArticleImageFlow(input);
}

// This prompt object definition is not directly used by the flow for image generation,
// as image generation with ai.generate requires specific model and config.
// However, the prompt text itself is valuable.
const _unusedGenerateArticleImagePrompt = ai.definePrompt({
  name: 'generateArticleImagePromptDefinition', // Renamed to avoid confusion
  input: {schema: GenerateArticleImageInputSchema},
  output: {schema: GenerateArticleImageOutputSchema},
  prompt: `Generate a visually appealing and relevant image based on the following news article summary.
Aim for a style that is appropriate for a news context (e.g., realistic, illustrative, or infographic-style, avoiding overly artistic or abstract representations unless clearly implied by the summary).
If you cannot generate a suitable image, leave the output empty. Do not generate inappropriate or disturbing content.

Summary: {{{articleSummary}}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateArticleImageFlow = ai.defineFlow(
  {
    name: 'generateArticleImageFlow',
    inputSchema: GenerateArticleImageInputSchema,
    outputSchema: GenerateArticleImageOutputSchema,
  },
  async input => {
    try {
      // Construct a detailed text prompt for the image generation model
      const detailedPromptText = `Generate a visually appealing and relevant image based on the following news article summary.
Aim for a style that is appropriate for a news context (e.g., realistic, illustrative, or infographic-style, avoiding overly artistic or abstract representations unless clearly implied by the summary).
If you cannot generate a suitable image, return nothing or indicate failure. Do not generate inappropriate or disturbing content.

Article Summary: "${input.articleSummary}"`;

      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Model capable of image generation
        prompt: [
          {
            text: detailedPromptText, // Use the more detailed prompt
          },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // Request image output
           safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE'},
          ],
        },
      });

      if (media?.url) {
        return {imageDataUri: media.url};
      } else {
        return {imageDataUri: null};
      }
    } catch (error) {
      console.error('Error generating image:', error);
      return {imageDataUri: null};
    }
  }
);

