import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth-utils'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, HeadingLevel } from 'docx'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookie()

    if (!user || !user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stats, businessName } = body

    if (!stats) {
      return NextResponse.json({ error: 'Dashboard stats are required' }, { status: 400 })
    }

    // Financial summary table
    const profitMargin = stats.totalRevenue > 0
      ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)
      : '0.0'

    const summaryTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        // Header row
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: 'Metric', bold: true })],
                alignment: AlignmentType.LEFT
              })],
              shading: { fill: '3B82F6' },
              width: { size: 50, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: 'Value', bold: true })],
                alignment: AlignmentType.RIGHT
              })],
              shading: { fill: '3B82F6' },
              width: { size: 50, type: WidthType.PERCENTAGE }
            })
          ]
        }),
        // Data rows
        createTableRow('Total Revenue', `₦${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
        createTableRow('Total Cost', `₦${stats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
        createTableRow('Net Profit', `₦${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
        createTableRow('Profit Margin', `${profitMargin}%`),
        createTableRow('Total Invoices', stats.invoiceCount.toString()),
        createTableRow('Revenue Growth', `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}%`)
      ]
    })

    // Monthly breakdown table
    const monthlyRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Month', bold: true })] })],
            shading: { fill: '10B981' }
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Revenue', bold: true })], alignment: AlignmentType.RIGHT })],
            shading: { fill: '10B981' }
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Cost', bold: true })], alignment: AlignmentType.RIGHT })],
            shading: { fill: '10B981' }
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Profit', bold: true })], alignment: AlignmentType.RIGHT })],
            shading: { fill: '10B981' }
          })
        ]
      }),
      ...stats.monthlyData.map((month: any) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: month.month, bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `₦${month.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` })],
                alignment: AlignmentType.RIGHT
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `₦${month.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` })],
                alignment: AlignmentType.RIGHT
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `₦${month.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` })],
                alignment: AlignmentType.RIGHT
              })]
            })
          ]
        })
      )
    ]

    const monthlyTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: monthlyRows
    })

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Dashboard Report', bold: true, size: 48 })],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: businessName || 'Business Dashboard', size: 28 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}`,
                color: '808080',
                size: 20
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Financial Summary', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          summaryTable,
          new Paragraph({
            children: [new TextRun({ text: 'Monthly Breakdown', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),
          monthlyTable,
          new Paragraph({
            children: [
              new TextRun({
                text: 'This report is confidential and intended for internal use only.',
                color: '808080',
                size: 18
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 }
          })
        ]
      }]
    })

    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc)

    // Return DOCX
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="dashboard-report-${new Date().toISOString().split('T')[0]}.docx"`
      }
    })

  } catch (error) {
    console.error('Error generating DOCX:', error)
    return NextResponse.json(
      { error: 'Failed to generate DOCX report' },
      { status: 500 }
    )
  }
}

// Helper function to create table rows
function createTableRow(metric: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: metric, bold: true })] })],
        width: { size: 50, type: WidthType.PERCENTAGE }
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value })], alignment: AlignmentType.RIGHT })],
        width: { size: 50, type: WidthType.PERCENTAGE }
      })
    ]
  })
}
