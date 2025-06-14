'use server';
/**
 * @fileOverview An AI agent for assessing the plausibility of a news article.
 *
 * - assessArticlePlausibility - A function that handles the article plausibility assessment process.
 * - AssessArticlePlausibilityInput - The input type for the assessArticlePlausibility function.
 * - AssessArticlePlausibilityOutput - The return type for the assessArticlePlausibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessArticlePlausibilityInputSchema = z.object({
  headline: z.string().describe('The headline of the news article.'),
  summary: z.string().describe('The summary of the news article.'),
});
export type AssessArticlePlausibilityInput = z.infer<typeof AssessArticlePlausibilityInputSchema>;

const AssessArticlePlausibilityOutputSchema = z.object({
  status: z
    .enum(['AI Verified', 'Potentially Misleading', 'Uncertain/Needs More Info'])
    .describe('The AI-assessed plausibility status of the article.'),
  reason: z.string().describe('The reason for the assigned plausibility status.'),
});
export type AssessArticlePlausibilityOutput = z.infer<typeof AssessArticlePlausibilityOutputSchema>;

export async function assessArticlePlausibility(
  input: AssessArticlePlausibilityInput
): Promise<AssessArticlePlausibilityOutput> {
  return assessArticlePlausibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessArticlePlausibilityPrompt',
  input: {schema: AssessArticlePlausibilityInputSchema},
  output: {schema: AssessArticlePlausibilityOutputSchema},
  prompt: `You are an AI assistant tasked with assessing the plausibility of news articles.

  Based on the headline and summary provided, determine the plausibility of the article.
  Provide a status of either "AI Verified," "Potentially Misleading," or "Uncertain/Needs More Info."
  Also, provide a brief reason for your assessment.

  Headline: {{{headline}}}
  Summary: {{{summary}}}`,
});

const assessArticlePlausibilityFlow = ai.defineFlow(
  {
    name: 'assessArticlePlausibilityFlow',
    inputSchema: AssessArticlePlausibilityInputSchema,
    outputSchema: AssessArticlePlausibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
