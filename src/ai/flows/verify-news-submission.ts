
'use server';
/**
 * @fileOverview An AI agent for verifying the authenticity of a news submission.
 *
 * - verifyNewsSubmission - A function that handles the news verification process.
 * - VerifyNewsInput - The input type for the verifyNewsSubmission function.
 * - VerifyNewsOutput - The return type for the verifyNewsSubmission function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyNewsInputSchema = z.object({
  url: z.string().optional().describe('The URL of the news article to verify.'),
  articleText: z.string().optional().describe('The text content of the news article.'),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An image related to the news, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyNewsInput = z.infer<typeof VerifyNewsInputSchema>;

const VerifyNewsOutputSchema = z.object({
  status: z
    .enum([
      "Likely Authentic",
      "Potentially Misleading",
      "Caution Advised",
      "Insufficient Information",
      "Unable to Verify",
      "Strong Indicators of Misinformation"
    ])
    .describe('The AI-assessed verification status of the news submission.'),
  reasoning: z.string().describe('A detailed explanation for the assigned verification status.'),
  summary: z.string().describe('A brief summary of what was analyzed from the input.'),
});
export type VerifyNewsOutput = z.infer<typeof VerifyNewsOutputSchema>;

export async function verifyNewsSubmission(input: VerifyNewsInput): Promise<VerifyNewsOutput> {
  return verifyNewsSubmissionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyNewsSubmissionPrompt',
  input: {schema: VerifyNewsInputSchema},
  output: {schema: VerifyNewsOutputSchema},
  prompt: `You are an advanced AI fact-checking assistant. Your task is to meticulously analyze the provided information (any combination of a URL, article text, or an image) to assess its likely authenticity and potential for misinformation.

Provided Information:
{{#if url}}URL: {{{url}}}{{/if}}
{{#if articleText}}Article Text: {{{articleText}}}{{/if}}
{{#if imageDataUri}}Image: {{media url=imageDataUri}}{{/if}}

Analysis Guidelines:
1.  **Summarize**: Briefly state what information you were provided for analysis (e.g., "URL and article text provided", "Only an image was provided").
2.  **URL Analysis (if provided)**:
    *   Analyze the structure of the URL. Does the domain seem reputable or does it mimic a known site? Are there unusual characters or subdomains?
    *   Based on your training data, is this domain associated with known sources of misinformation or legitimate news outlets?
    *   State clearly that you cannot access live, real-time content from the URL. Your analysis is based on the URL string itself and your existing knowledge.
3.  **Article Text Analysis (if provided)**:
    *   Examine the language for tone (e.g., neutral, sensationalist, heavily biased, emotionally charged).
    *   Identify key claims made in the text. Do these claims align with general knowledge or common sense?
    *   Are there specific sources cited? If so, are these sources generally considered reliable?
    *   Look for common misinformation tactics: lack of evidence, appeals to emotion, logical fallacies, unverifiable claims, urgent calls to action based on fear.
4.  **Image Analysis (if provided)**:
    *   Describe the content of the image.
    *   Based on your training data, does the image appear to be manipulated, out of context, or associated with known misinformation campaigns? Note any visual inconsistencies if apparent.
    *   (State if you cannot determine manipulation from visual inspection alone).
5.  **Overall Assessment & Reasoning**:
    *   Synthesize your findings from the provided inputs.
    *   Assign a verification status: "Likely Authentic", "Potentially Misleading", "Caution Advised" (if some aspects are suspicious but not definitively false), "Insufficient Information" (if not enough data to make a call), "Unable to Verify" (if the query is outside your capabilities or the content is too ambiguous), or "Strong Indicators of Misinformation".
    *   Provide a clear, concise reasoning for your assigned status, highlighting the key factors that led to your conclusion.
    *   If multiple pieces of information were provided (e.g., text and image), comment on whether they are consistent with each other.

Important Notes for your response:
*   Be objective and analytical.
*   Clearly state the limitations of your analysis (e.g., inability to browse live URLs, reliance on training data).
*   Avoid making definitive statements of "true" or "false" unless the evidence is overwhelmingly clear within your knowledge base. Prefer nuanced language.
*   Your goal is to help the user make an informed judgment, not to be the ultimate arbiter of truth.

Output the results in the specified JSON format with 'status', 'reasoning', and 'summary' fields.
`,
config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }, // Be more sensitive to dangerous content in fact-checking
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
});

const verifyNewsSubmissionFlow = ai.defineFlow(
  {
    name: 'verifyNewsSubmissionFlow',
    inputSchema: VerifyNewsInputSchema,
    outputSchema: VerifyNewsOutputSchema,
  },
  async (input) => {
    // Construct a presence check for the prompt
    const promptData: Record<string, any> = {};
    if (input.url) promptData.url = input.url;
    if (input.articleText) promptData.articleText = input.articleText;
    if (input.imageDataUri) promptData.imageDataUri = input.imageDataUri;

    if (Object.keys(promptData).length === 0) {
        return {
            status: "Insufficient Information",
            reasoning: "No information (URL, text, or image) was provided for verification. Please provide at least one input.",
            summary: "No input provided."
        };
    }

    const {output} = await prompt(promptData);
    return output!;
  }
);

