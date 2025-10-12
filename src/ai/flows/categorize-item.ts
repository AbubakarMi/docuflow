import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface CategorizeItemInput {
  itemName: string
  itemDescription?: string
}

interface CategorizeItemOutput {
  category: string
  suggestedCategories: string[]
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Uses AI to automatically categorize an inventory item based on its name and optional description
 */
export async function categorizeItem(
  input: CategorizeItemInput
): Promise<CategorizeItemOutput> {
  const prompt = `You are an AI assistant helping to categorize inventory items for a business management system.

Given the following item information:
Item Name: ${input.itemName}
${input.itemDescription ? `Description: ${input.itemDescription}` : ''}

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

  try {
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

    return {
      category: primaryCategory,
      suggestedCategories: [primaryCategory, ...alternativeCategories].filter(
        (c, index, arr) => arr.indexOf(c) === index
      ), // Remove duplicates
      confidence,
    }
  } catch (error) {
    console.error('Error categorizing item:', error)
    // Return a default response if AI fails
    return {
      category: 'Other',
      suggestedCategories: ['Other', 'Uncategorized'],
      confidence: 'low',
    }
  }
}
