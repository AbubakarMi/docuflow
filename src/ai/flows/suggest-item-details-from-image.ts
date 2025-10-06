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
  itemName: z.string().describe("A short, user-friendly name for the item. Be very specific (e.g., 'Coca-Cola Can' not 'Soda')."),
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
  prompt: `You are an expert at identifying items from images for a point-of-sale inventory system. Your goal is maximum accuracy and speed.

Analyze the image provided and identify the main item with high precision. For example, if you see a can of Coca-Cola, identify it as 'Coca-Cola', not just 'soda' or 'drink'. If you see a bag of Lay's Classic potato chips, identify it as 'Lay's Classic Chips', not just 'chips'.

Based on your identification, provide:
1.  A short, specific, user-friendly name for the item.
2.  A single, general-purpose category for the item (e.g., 'Food', 'Drink', 'Snack').

Image: {{media url=imageDataUri}}

Respond with only the extracted JSON data. Be fast and accurate.`,
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
