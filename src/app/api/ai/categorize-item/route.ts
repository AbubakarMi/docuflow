import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface CategorizeItemOutput {
  category: string
  suggestedCategories: string[]
  confidence: 'high' | 'medium' | 'low'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemName, itemDescription } = body

    if (!itemName) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      )
    }

    const prompt = `You are an AI assistant helping to categorize inventory items for a business management system.

Given the following item information:
Item Name: ${itemName}
${itemDescription ? `Description: ${itemDescription}` : ''}

Please analyze this item and suggest the most appropriate category. Consider common business categories such as:
- Food & Beverages
- Drinks & Beverages
- Snacks & Appetizers
- Electronics
- Office Supplies
- Clothing & Apparel
- Home & Garden
- Health & Beauty
- Sports & Fitness
- Automotive
- Books & Media
- Toys & Games
- Pet Supplies
- Raw Materials
- Services
- Other

Provide your response in the following format:
Primary Category: [most appropriate category]
Alternative Categories: [2-3 other possible categories, comma-separated]
Confidence: [high/medium/low]

Be specific and choose the most relevant category. For food items, distinguish between prepared foods, drinks, snacks, etc.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse the response
    const primaryCategoryMatch = responseText.match(
      /Primary Category:\s*(.+?)(?:\n|$)/i
    )
    const alternativeCategoriesMatch = responseText.match(
      /Alternative Categories:\s*(.+?)(?:\n|$)/i
    )
    const confidenceMatch = responseText.match(/Confidence:\s*(.+?)(?:\n|$)/i)

    const primaryCategory = primaryCategoryMatch
      ? primaryCategoryMatch[1].trim()
      : 'Other'
    const alternativeCategories = alternativeCategoriesMatch
      ? alternativeCategoriesMatch[1].split(',').map((c) => c.trim())
      : []
    const confidence = (confidenceMatch
      ? confidenceMatch[1].trim().toLowerCase()
      : 'medium') as 'high' | 'medium' | 'low'

    const result: CategorizeItemOutput = {
      category: primaryCategory,
      suggestedCategories: [primaryCategory, ...alternativeCategories].filter(
        (c, index, arr) => arr.indexOf(c) === index
      ), // Remove duplicates
      confidence,
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error categorizing item:', error)

    // Return a default response if AI fails
    return NextResponse.json({
      success: true,
      data: {
        category: 'Other',
        suggestedCategories: ['Other', 'Uncategorized'],
        confidence: 'low',
      }
    })
  }
}
