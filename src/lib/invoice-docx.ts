import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, BorderStyle, HeadingLevel } from 'docx'

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

export async function generateInvoiceDOCX(data: InvoiceData): Promise<Buffer> {
  // Header section
  const headerSection: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.businessName, bold: true, size: 48, color: '4F46E5' })],
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [new TextRun({ text: 'INVOICE', bold: true, size: 32, color: '64748B' })],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 }
    })
  ]

  // Business contact info
  if (data.businessEmail) {
    headerSection.push(new Paragraph({
      children: [new TextRun({ text: data.businessEmail, size: 18, color: '475569' })],
      spacing: { after: 50 }
    }))
  }
  if (data.businessPhone) {
    headerSection.push(new Paragraph({
      children: [new TextRun({ text: data.businessPhone, size: 18, color: '475569' })],
      spacing: { after: 50 }
    }))
  }
  if (data.businessAddress) {
    headerSection.push(new Paragraph({
      children: [new TextRun({ text: data.businessAddress, size: 18, color: '475569' })],
      spacing: { after: 50 }
    }))
    const location = [data.businessCity, data.businessState, data.businessCountry].filter(Boolean).join(', ')
    if (location) {
      headerSection.push(new Paragraph({
        children: [new TextRun({ text: location, size: 18, color: '475569' })],
        spacing: { after: 200 }
      }))
    }
  }

  // Invoice details table
  const invoiceDetailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Invoice Number:', bold: true })] })],
            width: { size: 40, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: data.invoiceNumber })] })],
            width: { size: 60, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Invoice Date:', bold: true })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: data.invoiceDate })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Due Date:', bold: true })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: data.dueDate })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Status:', bold: true })] })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: data.status.toUpperCase(), bold: true })] })]
          })
        ]
      })
    ]
  })

  // Bill To section
  const billToSection: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: 'BILL TO:', bold: true, size: 22, color: '4F46E5' })],
      spacing: { before: 300, after: 100 }
    }),
    new Paragraph({
      children: [new TextRun({ text: data.customerName, bold: true, size: 20 })],
      spacing: { after: 50 }
    })
  ]

  if (data.customerEmail) {
    billToSection.push(new Paragraph({
      children: [new TextRun({ text: data.customerEmail, size: 18 })],
      spacing: { after: 50 }
    }))
  }
  if (data.customerPhone) {
    billToSection.push(new Paragraph({
      children: [new TextRun({ text: data.customerPhone, size: 18 })],
      spacing: { after: 50 }
    }))
  }
  if (data.customerAddress) {
    billToSection.push(new Paragraph({
      children: [new TextRun({ text: data.customerAddress, size: 18 })],
      spacing: { after: 50 }
    }))
    const location = [data.customerCity, data.customerState, data.customerCountry].filter(Boolean).join(', ')
    if (location) {
      billToSection.push(new Paragraph({
        children: [new TextRun({ text: location, size: 18 })],
        spacing: { after: 200 }
      }))
    }
  }

  // Items table
  const itemsTableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Item Description', bold: true })], alignment: AlignmentType.LEFT })],
          shading: { fill: '4F46E5' }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Qty', bold: true })], alignment: AlignmentType.CENTER })],
          shading: { fill: '4F46E5' }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Price', bold: true })], alignment: AlignmentType.RIGHT })],
          shading: { fill: '4F46E5' }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Amount', bold: true })], alignment: AlignmentType.RIGHT })],
          shading: { fill: '4F46E5' }
        })
      ]
    }),
    ...data.items.map(item =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [
                new TextRun({ text: item.productName, bold: true }),
                ...(item.description ? [new TextRun({ text: `\n${item.description}`, size: 18 })] : [])
              ]
            })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: item.quantity.toString() })], alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(item.price, data.currency) })], alignment: AlignmentType.RIGHT })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(item.amount, data.currency) })], alignment: AlignmentType.RIGHT })]
          })
        ]
      })
    )
  ]

  const itemsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: itemsTableRows
  })

  // Totals table
  const totalsRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Subtotal:', bold: true })], alignment: AlignmentType.RIGHT })],
          width: { size: 70, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(data.subtotal, data.currency) })], alignment: AlignmentType.RIGHT })],
          width: { size: 30, type: WidthType.PERCENTAGE }
        })
      ]
    })
  ]

  if (data.taxRate && data.taxAmount) {
    totalsRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `Tax (${data.taxRate}%):`, bold: true })], alignment: AlignmentType.RIGHT })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(data.taxAmount, data.currency) })], alignment: AlignmentType.RIGHT })]
          })
        ]
      })
    )
  }

  if (data.discount && data.discount > 0) {
    totalsRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Discount:', bold: true })], alignment: AlignmentType.RIGHT })]
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: `-${formatCurrency(data.discount, data.currency)}` })], alignment: AlignmentType.RIGHT })]
          })
        ]
      })
    )
  }

  totalsRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL:', bold: true, size: 24, color: '4F46E5' })], alignment: AlignmentType.RIGHT })],
          shading: { fill: 'F8FAFC' }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(data.total, data.currency), bold: true, size: 24, color: '4F46E5' })], alignment: AlignmentType.RIGHT })],
          shading: { fill: 'F8FAFC' }
        })
      ]
    })
  )

  const totalsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: totalsRows
  })

  // Optional sections
  const optionalSections: Paragraph[] = []

  if (data.notes) {
    optionalSections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Notes:', bold: true, size: 20 })],
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: data.notes, size: 18 })],
        spacing: { after: 200 }
      })
    )
  }

  if (data.terms) {
    optionalSections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Terms & Conditions:', bold: true, size: 20 })],
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: data.terms, size: 18 })],
        spacing: { after: 200 }
      })
    )
  }

  // Footer
  const footer = new Paragraph({
    children: [new TextRun({
      text: `Generated by DocuFlow on ${new Date().toLocaleDateString()}`,
      size: 16,
      color: '94A3B8'
    })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 }
  })

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        ...headerSection,
        invoiceDetailsTable,
        ...billToSection,
        new Paragraph({ text: '', spacing: { after: 200 } }),
        itemsTable,
        new Paragraph({ text: '', spacing: { after: 200 } }),
        totalsTable,
        ...optionalSections,
        footer
      ]
    }]
  })

  // Generate buffer
  return await Packer.toBuffer(doc)
}

export async function downloadInvoiceDOCX(data: InvoiceData, filename?: string) {
  const buffer = await generateInvoiceDOCX(data)
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `Invoice-${data.invoiceNumber}.docx`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
