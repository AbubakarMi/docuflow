'use server';

/**
 * @fileOverview An AI flow to suggest item details from an image.
 * 
 * - suggestItemDetailsFromImage - A function that suggests item name and category from an image.
 * - SuggestItemDetailsInput - The input type for the suggestItemDetailsFromImage function.
 * - SuggestItemDetailsOutput - The return type for the suggestItemDetailsFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestItemDetailsInputSchema = z.object({
  imageDataUri: z.string().describe("A photo of an item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type SuggestItemDetailsInput = z.infer<typeof SuggestItemDetailsInputSchema>;

const SuggestItemDetailsOutputSchema = z.object({
  itemName: z.string().describe("A short, user-friendly name for the item."),
  category: z.string().describe("A single, general-purpose category for the item (e.g., 'Food', 'Drink', 'Snack')."),
});
export type SuggestItemDetailsOutput = z.infer<typeof SuggestItemDetailsOutputSchema>;

export async function suggestItemDetailsFromImage(input: SuggestItemDetailsInput): Promise<SuggestItemDetailsOutput> {
  return suggestItemDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemDetailsPrompt',
  input: { schema: SuggestItemDetailsInputSchema },
  output: { schema: SuggestItemDetailsOutputSchema },
  prompt: `You are an expert at identifying items from images for an inventory system.
Analyze the image provided and identify the main item.
Provide a short, user-friendly name for the item and a single, general-purpose category for it (e.g., 'Food', 'Drink', 'Snack').

Image: {{media url=imageDataUri}}

Respond with only the extracted JSON data.`,
});


const suggestItemDetailsFlow = ai.defineFlow(
    {
        name: 'suggestItemDetailsFlow',
        inputSchema: SuggestItemDetailsInputSchema,
        outputSchema: SuggestItemDetailsOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
)
