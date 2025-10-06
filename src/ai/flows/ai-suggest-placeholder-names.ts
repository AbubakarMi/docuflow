'use server';

/**
 * @fileOverview AI-powered placeholder name suggestion for document templates.
 *
 * - suggestPlaceholderNames - A function that suggests placeholder names for a given document template.
 * - SuggestPlaceholderNamesInput - The input type for the suggestPlaceholderNames function.
 * - SuggestPlaceholderNamesOutput - The return type for the suggestPlaceholderNames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlaceholderNamesInputSchema = z.object({
  templateText: z
    .string()
    .describe('The text content of the document template.'),
});
export type SuggestPlaceholderNamesInput = z.infer<typeof SuggestPlaceholderNamesInputSchema>;

const SuggestPlaceholderNamesOutputSchema = z.object({
  suggestedPlaceholders: z
    .array(z.string())
    .describe('An array of suggested placeholder names.'),
});
export type SuggestPlaceholderNamesOutput = z.infer<typeof SuggestPlaceholderNamesOutputSchema>;

export async function suggestPlaceholderNames(
  input: SuggestPlaceholderNamesInput
): Promise<SuggestPlaceholderNamesOutput> {
  return suggestPlaceholderNamesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlaceholderNamesPrompt',
  input: {schema: SuggestPlaceholderNamesInputSchema},
  output: {schema: SuggestPlaceholderNamesOutputSchema},
  prompt: `You are an AI assistant that suggests placeholder names for document templates.

  Given the following template text, suggest a list of placeholder names that could be used in the template.  The names should be descriptive and relevant to the content of the template.

  Template Text:
  {{templateText}}

  Please only respond with a JSON array of suggested placeholder names.
  `, // Ensure the output is a JSON array of strings
});

const suggestPlaceholderNamesFlow = ai.defineFlow(
  {
    name: 'suggestPlaceholderNamesFlow',
    inputSchema: SuggestPlaceholderNamesInputSchema,
    outputSchema: SuggestPlaceholderNamesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
