import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

interface GenerateInvoiceOutput {
  clientName?: string
  clientAddress?: string
  invoiceNumber?: string
  issueDate?: string
  dueDate?: string
  items: InvoiceItem[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const systemPrompt = `You are an expert at parsing invoice details from text descriptions.

Extract the following information from the user's prompt:
- Client name and address
- Invoice number (if mentioned)
- Issue date (if not mentioned, use today: ${today})
- Due date (if not mentioned, use 30 days from today: ${dueDate})
- Line items with description, quantity, and unit price

For each line item:
- Extract the description, quantity, and unit price
- If quantity is not specified, assume 1
- Prices should be numbers only (no currency symbols)

Respond ONLY with valid JSON in this exact format:
{
  "clientName": "string or null",
  "clientAddress": "string or null",
  "invoiceNumber": "string or null",
  "issueDate": "YYYY-MM-DD or null",
  "dueDate": "YYYY-MM-DD or null",
  "items": [
    {
      "description": "string",
      "quantity": number,
      "price": number
    }
  ]
}

Do not include any explanation or markdown formatting, just the JSON object.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\nUser's invoice description:\n${prompt}`,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON response
    let result: GenerateInvoiceOutput
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim()
      result = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      throw new Error('Failed to parse invoice data from AI response')
    }

    // Ensure items array exists
    if (!result.items || !Array.isArray(result.items)) {
      result.items = []
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error generating invoice:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate invoice from text'
      },
      { status: 500 }
    )
  }
}
