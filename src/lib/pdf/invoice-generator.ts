import jsPDF from 'jspdf'

interface InvoiceData {
  invoice: {
    invoiceNumber: string
    issueDate: string
    dueDate: string
    status: string
  }
  business: {
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    logo?: string
  }
  customer: {
    name: string
    email: string
    company?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    taxRate: number
    discountPercent: number
    amount: number
  }>
  totals: {
    subtotal: number
    taxAmount: number
    discountAmount: number
    totalAmount: number
    paidAmount: number
    balanceDue: number
  }
  notes?: string
  terms?: string
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Colors
  const primaryColor: [number, number, number] = [59, 130, 246] // Blue
  const darkColor: [number, number, number] = [31, 41, 55] // Dark gray
  const lightGray: [number, number, number] = [243, 244, 246]

  // Add watermark logo in center if available
  if (data.business.logo) {
    try {
      // Calculate center position for watermark
      const watermarkSize = 120 // Large size for watermark
      const centerX = (pageWidth - watermarkSize) / 2
      const centerY = (pageHeight - watermarkSize) / 2

      // Add watermark with transparency
      doc.setGState(new doc.GState({ opacity: 0.1 }))
      doc.addImage(data.business.logo, 'PNG', centerX, centerY, watermarkSize, watermarkSize, undefined, 'NONE')

      // Reset opacity for rest of content
      doc.setGState(new doc.GState({ opacity: 1.0 }))
    } catch (error) {
      console.error('Error adding watermark:', error)
    }
  }

  let y = 20

  // Header - Business Info
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')

  // Add logo to header if available
  if (data.business.logo) {
    try {
      const logoWidth = 30
      const logoHeight = 30
      doc.addImage(data.business.logo, 'PNG', 165, 5, logoWidth, logoHeight, undefined, 'NONE')
    } catch (error) {
      console.error('Error adding header logo:', error)
    }
  }

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(data.business.name, 20, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  if (data.business.address) doc.text(data.business.address, 20, 27)
  if (data.business.city) {
    const cityLine = `${data.business.city}${data.business.state ? ', ' + data.business.state : ''}${data.business.zipCode ? ' ' + data.business.zipCode : ''}`
    doc.text(cityLine, 20, 32)
  }
  if (data.business.email) doc.text(data.business.email, 20, 37)

  // Invoice Title
  doc.setTextColor(...darkColor)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 150, 20)

  y = 50

  // Invoice Details Box
  doc.setFillColor(...lightGray)
  doc.rect(120, y, 70, 30, 'F')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice #:', 125, y + 8)
  doc.text('Issue Date:', 125, y + 15)
  doc.text('Due Date:', 125, y + 22)

  doc.setFont('helvetica', 'normal')
  doc.text(data.invoice.invoiceNumber, 155, y + 8)
  doc.text(data.invoice.issueDate, 155, y + 15)
  doc.text(data.invoice.dueDate, 155, y + 22)

  // Bill To
  y += 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('BILL TO:', 20, y)

  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(data.customer.name, 20, y)

  if (data.customer.company) {
    y += 5
    doc.text(data.customer.company, 20, y)
  }

  if (data.customer.address) {
    y += 5
    doc.text(data.customer.address, 20, y)
  }

  if (data.customer.city) {
    y += 5
    const customerCity = `${data.customer.city}${data.customer.state ? ', ' + data.customer.state : ''}${data.customer.zipCode ? ' ' + data.customer.zipCode : ''}`
    doc.text(customerCity, 20, y)
  }

  y += 5
  doc.text(data.customer.email, 20, y)

  // Items Table
  y += 15

  // Table Header
  doc.setFillColor(...primaryColor)
  doc.rect(20, y, 170, 8, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Description', 22, y + 5.5)
  doc.text('Qty', 120, y + 5.5)
  doc.text('Price', 140, y + 5.5)
  doc.text('Tax %', 160, y + 5.5)
  doc.text('Amount', 180, y + 5.5)

  y += 8

  // Table Rows
  doc.setTextColor(...darkColor)
  doc.setFont('helvetica', 'normal')

  data.items.forEach((item, index) => {
    if (y > 250) {
      doc.addPage()
      y = 20
    }

    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(...lightGray)
      doc.rect(20, y, 170, 7, 'F')
    }

    doc.text(item.description.substring(0, 50), 22, y + 5)
    doc.text(item.quantity.toString(), 120, y + 5)
    doc.text(`$${item.unitPrice.toFixed(2)}`, 140, y + 5)
    doc.text(`${item.taxRate}%`, 160, y + 5)
    doc.text(`$${item.amount.toFixed(2)}`, 180, y + 5)

    y += 7
  })

  // Totals
  y += 10

  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', 140, y)
  doc.text(`$${data.totals.subtotal.toFixed(2)}`, 180, y)

  y += 6
  if (data.totals.discountAmount > 0) {
    doc.setTextColor(220, 38, 38) // Red
    doc.text('Discount:', 140, y)
    doc.text(`-$${data.totals.discountAmount.toFixed(2)}`, 180, y)
    y += 6
  }

  doc.setTextColor(...darkColor)
  doc.text('Tax:', 140, y)
  doc.text(`$${data.totals.taxAmount.toFixed(2)}`, 180, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setFillColor(...lightGray)
  doc.rect(135, y - 5, 55, 8, 'F')
  doc.text('Total:', 140, y + 1)
  doc.text(`$${data.totals.totalAmount.toFixed(2)}`, 180, y + 1)

  if (data.totals.paidAmount > 0) {
    y += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(34, 197, 94) // Green
    doc.text('Paid:', 140, y)
    doc.text(`$${data.totals.paidAmount.toFixed(2)}`, 180, y)

    y += 6
    doc.setTextColor(...darkColor)
    doc.setFont('helvetica', 'bold')
    doc.text('Balance Due:', 140, y)
    doc.text(`$${data.totals.balanceDue.toFixed(2)}`, 180, y)
  }

  // Notes and Terms
  if (data.notes || data.terms) {
    y += 15

    if (data.notes) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('Notes:', 20, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      const notesLines = doc.splitTextToSize(data.notes, 170)
      doc.text(notesLines, 20, y)
      y += (notesLines.length * 5) + 5
    }

    if (data.terms) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('Terms & Conditions:', 20, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      const termsLines = doc.splitTextToSize(data.terms, 170)
      doc.text(termsLines, 20, y)
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      287,
      { align: 'center' }
    )
  }

  return doc
}

export function downloadInvoicePDF(data: InvoiceData, filename?: string) {
  const pdf = generateInvoicePDF(data)
  const fileName = filename || `Invoice-${data.invoice.invoiceNumber}.pdf`
  pdf.save(fileName)
}

export function getInvoicePDFBlob(data: InvoiceData): Blob {
  const pdf = generateInvoicePDF(data)
  return pdf.output('blob')
}
