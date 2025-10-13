"use client"

import { useEffect, useState, useRef } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, TrendingUp, TrendingDown, DollarSign, Loader2, Download } from "lucide-react"
import { ProfitChart } from "@/components/dashboard/profit-chart"
import { formatCurrency } from "@/lib/utils"
import html2canvas from "html2canvas"
import { useToast } from "@/hooks/use-toast"
import { ExportConfirmationDialog } from "@/components/export-confirmation-dialog"

const NairaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
    <path d="M6 18h12M6 12h12M6 6h12M18 6l-12 12M6 18l12-12"/>
  </svg>
)

interface DashboardStats {
  totalRevenue: number
  totalCost: number
  totalProfit: number
  invoiceCount: number
  revenueGrowth: number
  monthlyData: Array<{
    month: string
    revenue: number
    cost: number
    profit: number
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const profitMargin = stats && stats.totalRevenue > 0
    ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)
    : 0

  const handleExportPDF = async () => {
    if (!stats) return

    setExporting(true)
    try {
      // Capture chart as image
      let chartImage = null
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#ffffff',
          scale: 2
        })
        chartImage = canvas.toDataURL('image/png')
      }

      // Send request to API
      const response = await fetch('/api/dashboard/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stats,
          businessName: 'Your Business',
          chartImage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'PDF report downloaded successfully'
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Error',
        description: 'Failed to export PDF report',
        variant: 'destructive'
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportDOCX = async () => {
    if (!stats) return

    setExporting(true)
    try {
      // Send request to API
      const response = await fetch('/api/dashboard/export/docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stats,
          businessName: 'Your Business'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate DOCX')
      }

      // Download the DOCX
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'DOCX report downloaded successfully'
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Error',
        description: 'Failed to export DOCX report',
        variant: 'destructive'
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportClick = () => {
    setExportDialogOpen(true)
  }

  const handleExportConfirm = async (format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      await handleExportPDF()
    } else {
      await handleExportDOCX()
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Export Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleExportClick}
          disabled={exporting || !stats}
          variant="outline"
          className="gap-2 text-sm sm:text-base"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Export Dashboard</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Export Confirmation Dialog */}
      <ExportConfirmationDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onConfirm={handleExportConfirm}
        title="Export Dashboard Report"
        description="Choose the format you want to export your dashboard report:"
        isLoading={exporting}
      />

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Revenue</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold break-all">
              {formatCurrency(stats?.totalRevenue || 0, 'NGN')}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1 flex-wrap">
              {stats && stats.revenueGrowth >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+{stats.revenueGrowth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">{stats?.revenueGrowth}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Cost</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <NairaIcon />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold break-all">
              {formatCurrency(stats?.totalCost || 0, 'NGN')}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Cost of goods sold
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Net Profit</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 break-all">
              {formatCurrency(stats?.totalProfit || 0, 'NGN')}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {profitMargin}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Invoices</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{stats?.invoiceCount || 0}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Documents generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profit Chart */}
      <Card className="hover:shadow-lg transition-all">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Financial Overview</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Revenue, Cost, and Profit analytics for the last 12 months
              </CardDescription>
            </div>
            <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-muted-foreground">Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">Profit</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 overflow-x-auto" ref={chartRef}>
          {stats && <ProfitChart data={stats.monthlyData} />}
        </CardContent>
      </Card>
    </div>
  )
}
