import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  status: string

  // Business Info
  businessName: string
  businessEmail: string
  businessPhone?: string
  businessAddress?: string
  businessCity?: string
  businessState?: string
  businessCountry?: string
  businessLogo?: string

  // Customer Info
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  customerState?: string
  customerCountry?: string

  // Invoice Items
  items: Array<{
    productName: string
    description?: string
    quantity: number
    price: number
    amount: number
  }>

  // Totals
  subtotal: number
  taxRate?: number
  taxAmount?: number
  discount?: number
  total: number
  currency: string

  // Optional
  notes?: string
  terms?: string
}

function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£',
    ZAR: 'R',
    KES: 'KSh',
    GHS: 'GH₵'
  }

  const symbol = symbols[currency] || currency + ' '
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Modern Color Palette
  const primaryColor: [number, number, number] = [99, 102, 241] // Indigo-500
  const accentColor: [number, number, number] = [139, 92, 246] // Purple-500
  const darkColor: [number, number, number] = [15, 23, 42] // Slate-900
  const grayColor: [number, number, number] = [100, 116, 139] // Slate-500
  const lightGray: [number, number, number] = [248, 250, 252] // Slate-50
  const borderColor: [number, number, number] = [226, 232, 240] // Slate-200

  // Add watermark logo in center if available
  if (data.businessLogo) {
    try {
      const watermarkSize = 150
      const centerX = (pageWidth - watermarkSize) / 2
      const centerY = (pageHeight - watermarkSize) / 2

      doc.setGState(new doc.GState({ opacity: 0.08 }))
      doc.addImage(data.businessLogo, 'PNG', centerX, centerY, watermarkSize, watermarkSize, undefined, 'NONE')
      doc.setGState(new doc.GState({ opacity: 1.0 }))
    } catch (error) {
      console.error('Error adding watermark:', error)
    }
  }

  // Modern Header Background with Gradient Effect
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 55, 'F')

  // Accent stripe
  doc.setFillColor(...accentColor)
  doc.rect(0, 52, pageWidth, 3, 'F')

  let yPosition = 22

  // Company Logo and Name in Header
  if (data.businessLogo) {
    try {
      const logoSize = 32
      doc.addImage(data.businessLogo, 'PNG', 20, yPosition - 10, logoSize, logoSize, undefined, 'NONE')
    } catch (error) {
      console.error('Error adding header logo:', error)
    }
  }

  // Company Name - White on colored background
  const companyNameX = data.businessLogo ? 58 : 20
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(data.businessName, companyNameX, yPosition)

  // Company Contact Info - Light color
  doc.setFontSize(9)
  doc.setTextColor(226, 232, 240) // Light slate
  doc.setFont('helvetica', 'normal')

  let contactY = yPosition + 6
  if (data.businessEmail) {
    doc.text(data.businessEmail, companyNameX, contactY)
    contactY += 4
  }
  if (data.businessPhone) {
    doc.text(data.businessPhone, companyNameX, contactY)
    contactY += 4
  }
  if (data.businessAddress) {
    const addressParts = [data.businessAddress, data.businessCity, data.businessState]
      .filter(Boolean)
      .join(', ')
    doc.text(addressParts, companyNameX, contactY)
  }

  // Invoice Title - Right side with modern styling
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('INVOICE', pageWidth - 20, 28, { align: 'right' })

  yPosition = 70

  // Invoice Details Card - Modern card design
  const cardX = pageWidth - 75
  const cardWidth = 70
  const cardHeight = 38

  // Card shadow effect
  doc.setFillColor(226, 232, 240)
  doc.roundedRect(cardX + 1, yPosition + 1, cardWidth, cardHeight, 2, 2, 'F')

  // Card background
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'F')

  // Card border
  doc.setDrawColor(...borderColor)
  doc.setLineWidth(0.3)
  doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'S')

  let cardY = yPosition + 8

  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE NUMBER', cardX + 5, cardY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.text(data.invoiceNumber, cardX + 5, cardY + 5)

  cardY += 12
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.setFont('helvetica', 'bold')
  doc.text('ISSUE DATE', cardX + 5, cardY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...darkColor)
  doc.text(data.invoiceDate, cardX + 5, cardY + 5)

  cardY += 12
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.setFont('helvetica', 'bold')
  doc.text('DUE DATE', cardX + 5, cardY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...darkColor)
  doc.text(data.dueDate, cardX + 5, cardY + 5)

  // Status Badge - Modern pill design
  const statusColor: Record<string, [number, number, number]> = {
    paid: [16, 185, 129],
    pending: [245, 158, 11],
    overdue: [239, 68, 68],
    draft: [148, 163, 184]
  }
  const badgeColor = statusColor[data.status.toLowerCase()] || [100, 100, 100]
  doc.setFillColor(...badgeColor)
  doc.roundedRect(cardX + 5, cardY + 10, 30, 7, 3.5, 3.5, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text(data.status.toUpperCase(), cardX + 20, cardY + 15, { align: 'center' })

  yPosition = 70

  // Customer Section - Modern Card Style
  const billToCardY = yPosition
  const billToCardHeight = 35

  // Card shadow
  doc.setFillColor(226, 232, 240)
  doc.roundedRect(21, billToCardY + 1, 90, billToCardHeight, 3, 3, 'F')

  // Card background
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(20, billToCardY, 90, billToCardHeight, 3, 3, 'F')

  // Card border
  doc.setDrawColor(...borderColor)
  doc.setLineWidth(0.3)
  doc.roundedRect(20, billToCardY, 90, billToCardHeight, 3, 3, 'S')

  // Accent bar on left
  doc.setFillColor(...primaryColor)
  doc.rect(20, billToCardY, 3, billToCardHeight, 'F')

  let billToY = billToCardY + 8
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO', 28, billToY)

  billToY += 6
  doc.setFontSize(11)
  doc.setTextColor(...darkColor)
  doc.setFont('helvetica', 'bold')
  doc.text(data.customerName, 28, billToY)

  billToY += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)

  if (data.customerEmail) {
    doc.text(data.customerEmail, 28, billToY)
    billToY += 4
  }
  if (data.customerPhone) {
    doc.text(data.customerPhone, 28, billToY)
    billToY += 4
  }
  if (data.customerAddress) {
    const addressLine = [data.customerAddress, data.customerCity, data.customerState]
      .filter(Boolean)
      .join(', ')
    const lines = doc.splitTextToSize(addressLine, 75)
    doc.text(lines, 28, billToY)
  }

  yPosition = billToCardY + billToCardHeight + 15

  // Items Table with Modern Styling
  const tableData = data.items.map(item => [
    item.productName + (item.description ? `\n${item.description}` : ''),
    item.quantity.toString(),
    formatCurrency(item.price, data.currency),
    formatCurrency(item.amount, data.currency)
  ])

  autoTable(doc, {
    startY: yPosition,
    head: [['Item Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: { top: 8, right: 5, bottom: 8, left: 5 },
      lineColor: borderColor,
      lineWidth: 0.1,
      textColor: darkColor,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      cellPadding: { top: 10, right: 5, bottom: 10, left: 5 },
      halign: 'left',
    },
    columnStyles: {
      0: {
        cellWidth: 'auto',
        fontStyle: 'normal',
        textColor: darkColor,
      },
      1: {
        halign: 'center',
        cellWidth: 25,
        fontStyle: 'bold',
        textColor: grayColor,
      },
      2: {
        halign: 'right',
        cellWidth: 35,
        textColor: grayColor,
      },
      3: {
        halign: 'right',
        cellWidth: 35,
        fontStyle: 'bold',
        textColor: darkColor,
      }
    },
    alternateRowStyles: {
      fillColor: [252, 252, 253]
    },
    bodyStyles: {
      minCellHeight: 12,
    },
    didDrawPage: function(data) {
      // Add subtle border around table
      const tableHeight = (data as any).cursor.y - yPosition
      doc.setDrawColor(...borderColor)
      doc.setLineWidth(0.5)
      doc.rect(20, yPosition, pageWidth - 40, tableHeight, 'S')
    }
  })

  // Get Y position after table
  yPosition = (doc as any).lastAutoTable.finalY + 10

  // Totals Section - Modern Card Design
  const totalsCardX = pageWidth - 85
  const totalsCardWidth = 65
  let totalsCardHeight = 35

  // Calculate card height based on content
  if (data.taxRate && data.taxAmount) totalsCardHeight += 8
  if (data.discount && data.discount > 0) totalsCardHeight += 8

  // Card shadow
  doc.setFillColor(226, 232, 240)
  doc.roundedRect(totalsCardX + 1, yPosition + 1, totalsCardWidth, totalsCardHeight, 3, 3, 'F')

  // Card background
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(totalsCardX, yPosition, totalsCardWidth, totalsCardHeight, 3, 3, 'F')

  // Card border
  doc.setDrawColor(...borderColor)
  doc.setLineWidth(0.3)
  doc.roundedRect(totalsCardX, yPosition, totalsCardWidth, totalsCardHeight, 3, 3, 'S')

  let totalsY = yPosition + 10

  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.setFont('helvetica', 'normal')

  // Subtotal
  doc.text('Subtotal', totalsCardX + 5, totalsY)
  doc.setTextColor(...darkColor)
  doc.text(formatCurrency(data.subtotal, data.currency), totalsCardX + totalsCardWidth - 5, totalsY, { align: 'right' })
  totalsY += 7

  // Tax
  if (data.taxRate && data.taxAmount) {
    doc.setTextColor(...grayColor)
    doc.text(`Tax (${data.taxRate}%)`, totalsCardX + 5, totalsY)
    doc.setTextColor(...darkColor)
    doc.text(formatCurrency(data.taxAmount, data.currency), totalsCardX + totalsCardWidth - 5, totalsY, { align: 'right' })
    totalsY += 7
  }

  // Discount
  if (data.discount && data.discount > 0) {
    doc.setTextColor(...grayColor)
    doc.text('Discount', totalsCardX + 5, totalsY)
    doc.setTextColor(239, 68, 68) // Red for discount
    doc.text(`-${formatCurrency(data.discount, data.currency)}`, totalsCardX + totalsCardWidth - 5, totalsY, { align: 'right' })
    totalsY += 7
  }

  // Divider line
  doc.setDrawColor(...borderColor)
  doc.setLineWidth(0.5)
  doc.line(totalsCardX + 5, totalsY, totalsCardX + totalsCardWidth - 5, totalsY)
  totalsY += 7

  // Total - Highlighted
  doc.setFillColor(...primaryColor)
  doc.roundedRect(totalsCardX + 5, totalsY - 5, totalsCardWidth - 10, 12, 2, 2, 'F')

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('TOTAL', totalsCardX + 8, totalsY + 2)
  doc.setFontSize(12)
  doc.text(formatCurrency(data.total, data.currency), totalsCardX + totalsCardWidth - 8, totalsY + 2, { align: 'right' })

  yPosition = yPosition + totalsCardHeight + 15

  // Notes Section - Modern Card Style
  if (data.notes && yPosition < pageHeight - 55) {
    const notesCardHeight = 25

    // Card shadow
    doc.setFillColor(226, 232, 240)
    doc.roundedRect(21, yPosition + 1, pageWidth - 42, notesCardHeight, 3, 3, 'F')

    // Card background
    doc.setFillColor(250, 250, 251)
    doc.roundedRect(20, yPosition, pageWidth - 40, notesCardHeight, 3, 3, 'F')

    // Card border
    doc.setDrawColor(...borderColor)
    doc.setLineWidth(0.3)
    doc.roundedRect(20, yPosition, pageWidth - 40, notesCardHeight, 3, 3, 'S')

    let notesY = yPosition + 8
    doc.setFontSize(9)
    doc.setTextColor(...grayColor)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTES', 25, notesY)

    notesY += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 50)
    doc.text(notesLines, 25, notesY)

    yPosition += notesCardHeight + 8
  }

  // Terms Section
  if (data.terms && yPosition < pageHeight - 40) {
    const termsCardHeight = 25

    // Card shadow
    doc.setFillColor(226, 232, 240)
    doc.roundedRect(21, yPosition + 1, pageWidth - 42, termsCardHeight, 3, 3, 'F')

    // Card background
    doc.setFillColor(250, 250, 251)
    doc.roundedRect(20, yPosition, pageWidth - 40, termsCardHeight, 3, 3, 'F')

    // Card border
    doc.setDrawColor(...borderColor)
    doc.setLineWidth(0.3)
    doc.roundedRect(20, yPosition, pageWidth - 40, termsCardHeight, 3, 3, 'S')

    let termsY = yPosition + 8
    doc.setFontSize(9)
    doc.setTextColor(...grayColor)
    doc.setFont('helvetica', 'bold')
    doc.text('TERMS & CONDITIONS', 25, termsY)

    termsY += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    const termsLines = doc.splitTextToSize(data.terms, pageWidth - 50)
    doc.text(termsLines, 25, termsY)
  }

  // Modern Footer with divider
  const footerY = pageHeight - 15

  // Footer divider
  doc.setDrawColor(...borderColor)
  doc.setLineWidth(0.5)
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)

  // Footer text
  doc.setFontSize(8)
  doc.setTextColor(...grayColor)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Generated by DocuFlow | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )

  // Thank you message
  doc.setFontSize(10)
  doc.setTextColor(...primaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text('Thank you for your business!', pageWidth / 2, footerY - 10, { align: 'center' })

  return doc
}

export function downloadInvoicePDF(data: InvoiceData, filename?: string) {
  const doc = generateInvoicePDF(data)
  const fileName = filename || `Invoice-${data.invoiceNumber}.pdf`
  doc.save(fileName)
}

export function getInvoicePDFBlob(data: InvoiceData): Blob {
  const doc = generateInvoicePDF(data)
  return doc.output('blob')
}
