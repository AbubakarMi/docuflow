
'use server';

/**
 * @fileOverview An AI flow to parse invoice details from a natural language prompt.
 *
 * - generateInvoiceFromText - A function that parses a text prompt to extract structured invoice data.
 * - GenerateInvoiceInput - The input type for the generateInvoiceFromText function.
 * - GenerateInvoiceOutput - The return type for the generateInvoiceFromText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInvoiceInputSchema = z.object({
  prompt: z.string().describe('The natural language prompt describing the invoice.'),
});
export type GenerateInvoiceInput = z.infer<typeof GenerateInvoiceInputSchema>;

const InvoiceItemSchema = z.object({
    description: z.string().describe('The description of the invoice item.'),
    quantity: z.number().describe('The quantity of the invoice item.'),
    price: z.number().describe('The unit price of the invoice item in the local currency.'),
});

const GenerateInvoiceOutputSchema = z.object({
  clientName: z.string().optional().describe("The name of the client or customer."),
  clientAddress: z.string().optional().describe("The full address of the client."),
  invoiceNumber: z.string().optional().describe("The invoice number or identifier."),
  issueDate: z.string().optional().describe("The date the invoice was issued, in YYYY-MM-DD format."),
  dueDate: z.string().optional().describe("The date the invoice is due, in YYYY-MM-DD format."),
  items: z.array(InvoiceItemSchema).describe('An array of line items for the invoice.'),
});
export type GenerateInvoiceOutput = z.infer<typeof GenerateInvoiceOutputSchema>;

export async function generateInvoiceFromText(
  input: GenerateInvoiceInput
): Promise<GenerateInvoiceOutput> {
  return generateInvoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvoicePrompt',
  input: { schema: GenerateInvoiceInputSchema },
  output: { schema: GenerateInvoiceOutputSchema },
  prompt: `You are an expert at parsing invoice details from a text prompt.
The user will provide a description of an invoice. Extract the client's name, address, invoice number, issue date, due date, and all line items.
For each line item, extract the description, quantity, and price. The price should be a number.
If the quantity for an item is not specified, assume it is 1.
Today's date is ${new Date().toLocaleDateString('en-CA')}. If the user does not specify an issue date, use today. If they do not specify a due date, make it 30 days from today.

Prompt:
{{{prompt}}}

Respond with only the extracted JSON data.
`,
});

const generateInvoiceFlow = ai.defineFlow(
  {
    name: 'generateInvoiceFlow',
    inputSchema: GenerateInvoiceInputSchema,
    outputSchema: GenerateInvoiceOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
