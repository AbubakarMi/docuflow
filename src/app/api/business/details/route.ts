import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookie()

    if (!user || !user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch business details with settings
    const business = await prisma.business.findUnique({
      where: { id: user.businessId },
      include: {
        settings: true
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        name: business.name,
        email: business.email,
        phone: business.phone,
        address: business.address,
        city: business.city,
        state: business.state,
        zipCode: business.zipCode,
        country: business.country,
        taxId: business.taxId,
        logo: business.logo,
        website: business.website,
        currency: business.currency,
        timezone: business.timezone,
        settings: business.settings ? {
          invoicePrefix: business.settings.invoicePrefix,
          nextInvoiceNumber: business.settings.nextInvoiceNumber,
          invoiceTerms: business.settings.invoiceTerms,
          invoiceNotes: business.settings.invoiceNotes,
          paymentTermsDays: business.settings.paymentTermsDays,
          emailFromName: business.settings.emailFromName,
          emailFromAddress: business.settings.emailFromAddress
        } : null
      }
    })

  } catch (error) {
    console.error('Error fetching business details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business details' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromCookie()

    if (!user || !user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { business: businessData, settings: settingsData } = body

    // Update business information
    const updatedBusiness = await prisma.business.update({
      where: { id: user.businessId },
      data: {
        name: businessData.name,
        email: businessData.email,
        phone: businessData.phone,
        address: businessData.address,
        city: businessData.city,
        state: businessData.state,
        zipCode: businessData.zipCode,
        country: businessData.country,
        taxId: businessData.taxId,
        website: businessData.website,
        logo: businessData.logo,
        currency: businessData.currency,
        timezone: businessData.timezone,
      }
    })

    // Update or create business settings
    let updatedSettings = null
    if (settingsData) {
      updatedSettings = await prisma.businessSettings.upsert({
        where: { businessId: user.businessId },
        update: {
          invoicePrefix: settingsData.invoicePrefix,
          nextInvoiceNumber: settingsData.nextInvoiceNumber,
          invoiceTerms: settingsData.invoiceTerms,
          invoiceNotes: settingsData.invoiceNotes,
          paymentTermsDays: settingsData.paymentTermsDays,
          emailFromName: settingsData.emailFromName,
          emailFromAddress: settingsData.emailFromAddress,
        },
        create: {
          businessId: user.businessId,
          invoicePrefix: settingsData.invoicePrefix || 'INV',
          nextInvoiceNumber: settingsData.nextInvoiceNumber || 1001,
          invoiceTerms: settingsData.invoiceTerms,
          invoiceNotes: settingsData.invoiceNotes,
          paymentTermsDays: settingsData.paymentTermsDays || 30,
          emailFromName: settingsData.emailFromName,
          emailFromAddress: settingsData.emailFromAddress,
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Business details updated successfully',
      business: updatedBusiness,
      settings: updatedSettings
    })

  } catch (error) {
    console.error('Error updating business details:', error)
    return NextResponse.json(
      { error: 'Failed to update business details' },
      { status: 500 }
    )
  }
}
