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

  // Colors
  const primaryColor: [number, number, number] = [79, 70, 229] // Indigo-600
  const secondaryColor: [number, number, number] = [71, 85, 105] // Slate-600
  const lightGray: [number, number, number] = [248, 250, 252] // Slate-50

  let yPosition = 20

  // Header - Company Name
  doc.setFontSize(28)
  doc.setTextColor(...primaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text(data.businessName, 20, yPosition)

  // Invoice Title
  doc.setFontSize(16)
  doc.setTextColor(100, 100, 100)
  doc.text('INVOICE', pageWidth - 20, yPosition, { align: 'right' })

  yPosition += 10

  // Business Contact Info
  doc.setFontSize(9)
  doc.setTextColor(...secondaryColor)
  doc.setFont('helvetica', 'normal')
  if (data.businessEmail) {
    doc.text(data.businessEmail, 20, yPosition)
    yPosition += 4
  }
  if (data.businessPhone) {
    doc.text(data.businessPhone, 20, yPosition)
    yPosition += 4
  }
  if (data.businessAddress) {
    doc.text(data.businessAddress, 20, yPosition)
    yPosition += 4
    if (data.businessCity || data.businessState) {
      const location = [data.businessCity, data.businessState, data.businessCountry]
        .filter(Boolean)
        .join(', ')
      doc.text(location, 20, yPosition)
      yPosition += 4
    }
  }

  // Invoice Details (Right side)
  yPosition = 35
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)

  const invoiceDetailsX = pageWidth - 70
  doc.text('Invoice Number:', invoiceDetailsX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(data.invoiceNumber, invoiceDetailsX + 35, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Date:', invoiceDetailsX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(data.invoiceDate, invoiceDetailsX + 35, yPosition)
  yPosition += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Due Date:', invoiceDetailsX, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(data.dueDate, invoiceDetailsX + 35, yPosition)
  yPosition += 6

  // Status Badge
  const statusColor: Record<string, [number, number, number]> = {
    paid: [16, 185, 129],
    pending: [245, 158, 11],
    overdue: [239, 68, 68],
    draft: [148, 163, 184]
  }
  const color = statusColor[data.status.toLowerCase()] || [100, 100, 100]
  doc.setFillColor(...color)
  doc.roundedRect(invoiceDetailsX, yPosition - 3, 30, 6, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text(data.status.toUpperCase(), invoiceDetailsX + 15, yPosition + 1, { align: 'center' })

  yPosition += 15

  // Customer Section
  doc.setFillColor(...lightGray)
  doc.rect(20, yPosition, pageWidth - 40, 35, 'F')

  yPosition += 8
  doc.setFontSize(11)
  doc.setTextColor(...primaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO:', 25, yPosition)

  yPosition += 7
  doc.setFontSize(10)
  doc.setTextColor(...secondaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text(data.customerName, 25, yPosition)

  yPosition += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  if (data.customerEmail) {
    doc.text(data.customerEmail, 25, yPosition)
    yPosition += 4
  }
  if (data.customerPhone) {
    doc.text(data.customerPhone, 25, yPosition)
    yPosition += 4
  }
  if (data.customerAddress) {
    doc.text(data.customerAddress, 25, yPosition)
    yPosition += 4
    if (data.customerCity || data.customerState) {
      const location = [data.customerCity, data.customerState, data.customerCountry]
        .filter(Boolean)
        .join(', ')
      doc.text(location, 25, yPosition)
    }
  }

  yPosition += 15

  // Items Table
  const tableData = data.items.map(item => [
    item.productName + (item.description ? `\n${item.description}` : ''),
    item.quantity.toString(),
    formatCurrency(item.price, data.currency),
    formatCurrency(item.amount, data.currency)
  ])

  autoTable(doc, {
    startY: yPosition,
    head: [['Item Description', 'Qty', 'Price', 'Amount']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 }
    },
    alternateRowStyles: {
      fillColor: lightGray
    }
  })

  // Get Y position after table
  yPosition = (doc as any).lastAutoTable.finalY + 10

  // Totals Section
  const totalsX = pageWidth - 70

  doc.setFontSize(10)
  doc.setTextColor(...secondaryColor)

  // Subtotal
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', totalsX, yPosition)
  doc.text(formatCurrency(data.subtotal, data.currency), pageWidth - 20, yPosition, { align: 'right' })
  yPosition += 6

  // Tax
  if (data.taxRate && data.taxAmount) {
    doc.text(`Tax (${data.taxRate}%):`, totalsX, yPosition)
    doc.text(formatCurrency(data.taxAmount, data.currency), pageWidth - 20, yPosition, { align: 'right' })
    yPosition += 6
  }

  // Discount
  if (data.discount && data.discount > 0) {
    doc.text('Discount:', totalsX, yPosition)
    doc.text(`-${formatCurrency(data.discount, data.currency)}`, pageWidth - 20, yPosition, { align: 'right' })
    yPosition += 6
  }

  // Total
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(totalsX, yPosition, pageWidth - 20, yPosition)
  yPosition += 6

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('TOTAL:', totalsX, yPosition)
  doc.text(formatCurrency(data.total, data.currency), pageWidth - 20, yPosition, { align: 'right' })

  yPosition += 15

  // Notes Section
  if (data.notes && yPosition < pageHeight - 50) {
    doc.setFontSize(10)
    doc.setTextColor(...secondaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes:', 20, yPosition)
    yPosition += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 40)
    doc.text(notesLines, 20, yPosition)
    yPosition += (notesLines.length * 4) + 10
  }

  // Terms Section
  if (data.terms && yPosition < pageHeight - 30) {
    doc.setFontSize(10)
    doc.setTextColor(...secondaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text('Terms & Conditions:', 20, yPosition)
    yPosition += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const termsLines = doc.splitTextToSize(data.terms, pageWidth - 40)
    doc.text(termsLines, 20, yPosition)
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Generated by DocuFlow on ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  )

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
