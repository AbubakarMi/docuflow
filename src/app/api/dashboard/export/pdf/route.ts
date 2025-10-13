import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth-utils'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
    lastAutoTable: {
      finalY: number
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookie()

    if (!user || !user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stats, businessName, chartImage } = body

    if (!stats) {
      return NextResponse.json({ error: 'Dashboard stats are required' }, { status: 400 })
    }

    // Create PDF document
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Add title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Dashboard Report', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(businessName || 'Business Dashboard', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 5
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    doc.text(`Generated on ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setTextColor(0, 0, 0)

    // Add summary statistics
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Financial Summary', 14, yPosition)
    yPosition += 10

    // Create summary table
    const summaryData = [
      ['Total Revenue', `₦${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Total Cost', `₦${stats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Net Profit', `₦${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Profit Margin', `${((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)}%`],
      ['Total Invoices', stats.invoiceCount.toString()],
      ['Revenue Growth', `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}%`]
    ]

    doc.autoTable({
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 11
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { halign: 'right', cellWidth: 'auto' }
      },
      margin: { left: 14, right: 14 }
    })

    yPosition = doc.lastAutoTable.finalY + 15

    // Add monthly breakdown
    if (yPosition > pageHeight - 80) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Monthly Breakdown', 14, yPosition)
    yPosition += 10

    const monthlyData = stats.monthlyData.map((month: any) => [
      month.month,
      `₦${month.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `₦${month.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `₦${month.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ])

    doc.autoTable({
      startY: yPosition,
      head: [['Month', 'Revenue', 'Cost', 'Profit']],
      body: monthlyData,
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        halign: 'right'
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    })

    // Add chart image if provided
    if (chartImage) {
      yPosition = doc.lastAutoTable.finalY + 15

      if (yPosition > pageHeight - 120) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Financial Overview Chart', 14, yPosition)
      yPosition += 10

      try {
        // Add the chart image
        const imgWidth = pageWidth - 28
        const imgHeight = 100
        doc.addImage(chartImage, 'PNG', 14, yPosition, imgWidth, imgHeight)
      } catch (error) {
        console.error('Failed to add chart image:', error)
      }
    }

    // Add footer
    const footerY = pageHeight - 15
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('This report is confidential and intended for internal use only.', pageWidth / 2, footerY, { align: 'center' })

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="dashboard-report-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    )
  }
}
