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

const generateArticleImageFlow = ai.defineFlow(
  {
    name: 'generateArticleImageFlow',
    inputSchema: GenerateArticleImageInputSchema,
    outputSchema: GenerateArticleImageOutputSchema,
  },
  async input => {
    console.log(`[generateArticleImageFlow] Received summary: "${input.articleSummary ? input.articleSummary.substring(0, 100) : 'EMPTY_SUMMARY' }..." Length: ${input.articleSummary?.length || 0}`);

    if (!input.articleSummary || input.articleSummary.trim() === "") {
        console.warn('[generateArticleImageFlow] Received empty or invalid summary. Skipping image generation.');
        return { imageDataUri: null };
    }

    try {
      const detailedPromptText = `Generate a visually appealing and relevant image based on the following news article summary.
Aim for a style that is appropriate for a news context (e.g., realistic, illustrative, or infographic-style). Avoid overly artistic or abstract representations unless clearly implied by the summary.
If you cannot generate a suitable image, do not return any image data. Do not generate inappropriate or disturbing content.

Article Summary: "${input.articleSummary}"`;

      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: [
          {
            text: detailedPromptText,
          },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
           safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE'},
          ],
        },
      });

      console.log('[generateArticleImageFlow] Full AI response object:', JSON.stringify(response, null, 2));

      const mediaContent = response.media; // This can be MediaPart | MediaPart[] | undefined
      let finalImageUrl: string | null = null;

      if (mediaContent) {
        if (Array.isArray(mediaContent)) {
          // If it's an array, take the URL from the first element, if available
          if (mediaContent.length > 0 && mediaContent[0]?.url) {
            finalImageUrl = mediaContent[0].url;
          }
        } else {
          // If it's a single MediaPart object, take its URL
          // The TypeScript error indicated that 'mediaContent' was inferred as a single object here.
          if (mediaContent.url) {
            finalImageUrl = mediaContent.url;
          }
        }
      }

      if (finalImageUrl) {
        console.log('[generateArticleImageFlow] Image generated successfully. Data URI starts with:', finalImageUrl.substring(0, 70) + "...");
        return {imageDataUri: finalImageUrl};
      } else {
        console.warn('[generateArticleImageFlow] AI model did not return a usable image. Response text (if any):', response.text);
        return {imageDataUri: null};
      }
    } catch (error) {
      console.error('[generateArticleImageFlow] Error generating image:', error);
      return {imageDataUri: null};
    }
  }
);

