"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  Shield,
  Activity,
  Eye,
  AlertCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SystemStats {
  totalBusinesses: number
  activeBusinesses: number
  pendingBusinesses: number
  totalUsers: number
  totalInvoices: number
  totalRevenue: number
  monthlyGrowth: number
}

interface Business {
  id: string
  name: string
  email: string
  plan: string
  status: string
  approved: boolean
  createdAt: string
  stats: {
    users: number
    invoices: number
    revenue: number
  }
}

export default function SuperAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsResponse, businessesResponse] = await Promise.all([
        fetch('/api/superadmin/stats'),
        fetch('/api/superadmin/businesses')
      ])

      const statsData = await statsResponse.json()
      const businessesData = await businessesResponse.json()

      if (statsData.success) {
        setSystemStats(statsData.stats)
      }

      if (businessesData.success) {
        setBusinesses(businessesData.businesses)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBusinesses = businesses.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPlanBadge = (plan: string) => {
    const config: Record<string, { variant: any, label: string }> = {
      free: { variant: "secondary", label: "Free" },
      starter: { variant: "default", label: "Starter" },
      business: { variant: "default", label: "Business" },
      enterprise: { variant: "default", label: "Enterprise" }
    }
    const { variant, label } = config[plan] || config.free
    return <Badge variant={variant}>{label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any, label: string }> = {
      active: { variant: "success", label: "Active" },
      suspended: { variant: "destructive", label: "Suspended" },
      cancelled: { variant: "outline", label: "Cancelled" }
    }
    const { variant, label } = config[status] || config.active
    return <Badge variant={variant}>{label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">System-wide overview and management</p>
        </div>
        <div className="flex gap-3">
          {systemStats && systemStats.pendingBusinesses > 0 && (
            <Link href="/superadmin/approvals">
              <Button variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                {systemStats.pendingBusinesses} Pending Approvals
              </Button>
            </Link>
          )}
          <Badge variant="destructive" className="text-lg px-4 py-2">
            SUPER ADMIN
          </Badge>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.totalBusinesses || 0}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats?.activeBusinesses || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all businesses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.totalInvoices || 0}</div>
            <p className="text-xs text-muted-foreground">
              System-wide
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((systemStats?.totalRevenue || 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground">
              All businesses combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {systemStats?.monthlyGrowth ? `+${systemStats.monthlyGrowth}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {systemStats?.pendingBusinesses || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Businesses</CardTitle>
              <CardDescription>Manage and monitor all registered businesses</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                  <TableHead className="text-right">Invoices</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {business.name}
                          {!business.approved && (
                            <Badge variant="secondary" className="ml-2">Pending</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{business.email}</TableCell>
                      <TableCell>{getPlanBadge(business.plan)}</TableCell>
                      <TableCell>{getStatusBadge(business.status)}</TableCell>
                      <TableCell className="text-right">{business.stats.users}</TableCell>
                      <TableCell className="text-right">{business.stats.invoices}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ${business.stats.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(business.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/superadmin/approvals">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Business Approvals
              </CardTitle>
              <CardDescription>
                Review and approve pending business registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {systemStats?.pendingBusinesses || 0} Pending
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/superadmin/users">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage all users across businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {systemStats?.totalUsers || 0} Users
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:bg-accent cursor-pointer transition-colors opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Template Management
            </CardTitle>
            <CardDescription>
              Upload and manage invoice templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
